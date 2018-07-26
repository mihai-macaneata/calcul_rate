<template>
  <div class="app-container">
    <bars :genereazaGrafic.sync="genereazaGrafic" :robor="robor"></bars>
    <!-- <barchart v-if="genereazaGraficMare" :genereazaGrafic="genereazaGraficMare" :robor="robor"></barchart> -->
        <div class="footer">
      * Calcul pentru un credit de <input type="number" v-model="robor.credit"/> pe  <input type="number" v-model="robor.ani" @change="aniInLuni(robor.ani)" /> de ani inceput in  <input type="date" v-model="robor.dataInceput"/> <button type="button" @click="calculeazaRate">Calculeaza</button>
    </div>

<!--     <pre>
      Rata
      {{robor.valoriRoborUtilizator}}
      Media 2016
      {{robor.valoriGraficComparativ}}
    </pre> -->
  </div>
</template>

<script>

import BarChart from './BarChart'
import Bars from './Bars'
import valoriRoborLuni from '../assets/valoriRoborLuni.js'

export default {
  name: 'Main',

  components: {
    barchart: BarChart,
    bars: Bars
  },


  created(){
  },

 data() {
    return {
      genereazaGrafic: false,
      genereazaGraficMare: false,
      robor: {
        rata_2016: null,
        credit: 250000,
        perioada: 240,
        dataInceput: '2016-01-29',
        roborMarja: 2.5,
        valoriRoborUtilizator: [],
        valoriGrafic: [],
        valoriGraficComparativ: [],
      },
    }
  },

  methods: {

    calculeazaRate() {
      this.calculeazaRata(this.credit)
    },

    calculeazaRata(credit) {
      const self = this;
      this.construireValoriRobor(this.robor.dataInceput).then((response) => {
        self.faChestiiEconomice()
      }).catch((error) => {
        console.log(error)
      })
    },


    faChestiiEconomice(){
      const data = this.robor.valoriRoborUtilizator
      for(let item of data) {
        item.robor_nemodificat = item.ROBOR
        let roborProcente = ((parseFloat(item.ROBOR) + 2.5) / 100)/12
        item.ROBOR = roborProcente
        item.perioadaRamasa = this.robor.perioada
        this.robor.perioada = this.robor.perioada - 1
        if(data.indexOf(item) === 0) {
          let sumaRamasa = parseFloat(this.robor.credit)
          item.rata = this.ISPMT(item.ROBOR, 1, item.perioadaRamasa, sumaRamasa)
          item.ppal = this.PPMT(item.ROBOR, 1, item.perioadaRamasa, sumaRamasa)
          item.sumaRamasa = item.ppal + sumaRamasa
          item.sumaRamasa = Math.round(item.sumaRamasa * 100) / 100
          item.totalDePlata = item.rata + item.ppal
          // console.log(this.PPMT(item.ROBOR, 1, item.perioadaRamasa, sumaRamasa))
          // console.log('-----------first-------------')
        }
        else {
          let sumaRamasa = data[data.indexOf(item) - 1].sumaRamasa
          // console.log('suma ramasa', sumaRamasa)
          item.rata = this.ISPMT(item.ROBOR, 1, item.perioadaRamasa, sumaRamasa)
          item.ppal = this.PPMT(item.ROBOR, 1, item.perioadaRamasa, sumaRamasa)
          item.sumaRamasa = item.ppal + sumaRamasa
          item.sumaRamasa =Math.round(item.sumaRamasa * 100) / 100
          item.totalDePlata = item.rata + item.ppal
        }
        // console.log('--------------------------------------------------')
      }

      let pentruMedie = []
      this.robor.valoriGrafic = []

      for(let item of data) {
          let anul = item.Date.split('-')[0]
          if(anul === '2016'){
            pentruMedie.push(- item.totalDePlata)
          }
          if(parseInt(anul) > 2016) {
            this.robor.valoriGrafic.push(item)
          }
      }


      const average = arr => arr.reduce( ( p, c ) => p + c, 0 ) / arr.length;

      const result = average(pentruMedie); // 5



      let media_2016 = {
        Date: 2016,
        totalDePlata: -result,
        robor_nemodificat: 0.78,
      }

      this.robor.valoriGraficComparativ = []

      this.robor.valoriGraficComparativ.push(media_2016)
      this.robor.valoriGraficComparativ.push(data[data.length-1])


      this.robor.rata_2016 = result

      this.genereazaGrafic = true;



    },

    construireValoriRobor(dataDeInceput) {
      const self = this
      return new Promise(function(resolve, reject) {
        let dataPrelucrata = dataDeInceput.split('-').splice(0, 2).join('-')
        let iteratorIndex = -1

        let valoriRoborLuniModificate = JSON.parse(JSON.stringify(valoriRoborLuni))

        for (let val of valoriRoborLuniModificate) {
          if (val.Date === dataPrelucrata) {
            iteratorIndex = valoriRoborLuniModificate.indexOf(val)
            break;
          }
        }
        for (iteratorIndex; iteratorIndex < valoriRoborLuniModificate.length; iteratorIndex++) {
          self.robor.valoriRoborUtilizator.push(valoriRoborLuniModificate[iteratorIndex])
        }
        resolve(self.robor.valoriRoborUtilizator);
      });
    },





    ISPMT(rate, period, periods, value) {
      rate = eval(rate);
      periods = eval(periods);
      let ispmt = value * rate * (period / periods - 1);
      // console.log('ispmt',ispmt)
      return ispmt
    },

    PMT(rate, nper, pv, fv, type) {
      if (!fv) fv = 0;
      if (!type) type = 0;
      if (rate == 0) return -(pv + fv) / nper;
      var pvif = Math.pow(1 + rate, nper);
      var pmt = rate / (pvif - 1) * -(pv * pvif + fv);
      if (type == 1) {
        pmt /= (1 + rate);
      };
      // console.log('pmt',pmt)
      return pmt;
    },

    IPMT(pv, pmt, rate, per) {
      var tmp = Math.pow(1 + rate, per);
      var ipmt = 0 - (pv * tmp * rate + pmt * (tmp - 1));
      // console.log('ipmt',ipmt)
      return ipmt
    },

    PPMT(rate, per, nper, pv, fv, type) {
      if (per < 1 || (per >= nper + 1)) return null;
      var pmt = this.PMT(rate, nper, pv, fv, type);
      var ipmt = this.IPMT(pv, pmt, rate, per - 1);
      var ppmt = pmt - ipmt;
      // console.log('ppmt', ppmt)
      return ppmt
    },



    aniInLuni(ani) {
      this.robor.perioada = ani * 12
    }
    
  },

    watch: {
      genereazaGrafic: {
         handler(val){
          if(val === false){
            this.robor = {
              rata_2016: null,
              credit: 250000,
              perioada: null,
              dataInceput: '2016-01-29',
              roborMarja: 2.5,
              valoriRoborUtilizator: [],
              valoriGrafic: [],
              valoriGraficComparativ: [],
            }
          }
         },
         deep: true
      }
    }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}

.app-container {
      height: calc(100vh - 8rem);
    width: calc(100vw - 8rem);
    margin: 4rem;
    background: #e32b25;
}

.footer {
  padding: 1rem;
  text-align: center;
}

input {
    border: none;
    border-bottom: 1px solid red;
    max-width: 83px;
    text-align: center;
}

input[type="date"] {
      max-width: 127px;
}

</style>
