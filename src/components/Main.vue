<template>
  <div class="app-container">
    <bars :class="{hidden: !graphicShow}" :graphicShow.sync="graphicShow" :genereazaGraficMare.sync="genereazaGraficMare" :genereazaGrafic.sync="genereazaGrafic" :robor="robor"></bars>
    <barchart :class="{hidden: graphicShow}" :graphicShow.sync="graphicShow" :reseteazaRobor.sync="reseteazaRobor" :genereazaGraficMare.sync="genereazaGraficMare" :robor="robor"></barchart>
    <div class="footer">
      * Calcul pentru un credit de
        <input @change="userInput" type="number" v-model="robor.credit"/> pe 
        <input type="number" v-model="robor.ani" @change="aniInLuni(robor.ani)" /> de ani inceput in 
        <input @blur="userInput"   type="date" v-model="robor.dataInceput"/> 
        <button class="btn-calc" type="button" @click="calculeazaRate">Calculeaza</button>
    </div>
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
    this.calculeazaRate();
  },

 data() {
    return {
      genereazaGrafic: false,
      genereazaGraficMare: false,
      userGenerated: false,
      graphicShow: true,
      reseteazaRobor: false,
      robor: {
        rata_2016: null,
        credit: 250000,
        ani: 20,
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

    userInput() {
      this.userGenerated = true;
    },


    construireValoriRobor(dataDeInceput) {
      const self = this
      return new Promise(function(resolve, reject) {
        self.robor.valoriRoborUtilizator = [];
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
      this.userInput()
    }
    
  },

    watch: {

     reseteazaRobor: {
         handler(val){
          if(val === true){
            if(this.userGenerated) {
              this.robor = {
                rata_2016: this.robor.rata_2016,
                credit: this.robor.credit,
                ani: this.robor.ani,
                dataInceput: this.robor.dataInceput,
                roborMarja: 2.5,
                valoriRoborUtilizator: [],
                valoriGrafic: [],
                valoriGraficComparativ: [],
              }
            }
            this.reseteazaRobor = false

            this.aniInLuni(this.robor.ani);
          }
         },
         deep: true
      }
    }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>


.app-container {
      height: calc(100vh - 4rem);
    width: calc(100vw - 8rem);
    margin: 2rem 4rem;
    background: #e32b25;
    position: relative;
    overflow: hidden;
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


.btn-calc {
  background: white;
  border: 1px solid #e32b25;
  padding: .2rem 1rem;
  margin: .3rem;
  font-weight: bold;
  cursor: pointer;
}

</style>
