import valoriRoborLuni from '../assets/valoriRoborLuni.js'


export default {
  created() {},

  data() {
    return {
      robor: {
        lunaCurenta: null,
        roborCurent: null,
        robor_2016: 0.078,
        rata_2016: null,
        rata_curenta: null,
        credit: 250000,
        ani: null,
        perioada: null,
        dataInceput: '2016-01-29',
        roborMarja: 2.5,
        valoriRoborUtilizator: [],
      },
    }
  },

  methods: {
    calculeazaRate(credit) {
      this.calculeazaRata(credit)
    },

    calculeazaRata(credit) {
      const self = this;

      // this.PPMT(0.0335 / 12, 1, 240, 250000)

      // this.PPMT(0.0335 / 12, 1, 240, 250000)

      this.construireValoriRobor(this.robor.dataInceput).then((response) => {
      	self.faChestiiEconomice(response)
      }).catch((error) => {
        console.log(error)
      })
    },


    faChestiiEconomice(data){
    	for(let item of data) {
    		let roborProcente = ((parseFloat(item.ROBOR) + 2.5) / 100)/12
    		item.ROBOR = roborProcente
    		item.perioadaRamasa = this.robor.perioada
    		this.robor.perioada = this.robor.perioada - 1
    		console.log('data', item.Date)
    		if(data.indexOf(item) === 0) {
    			let sumaRamasa = parseFloat(this.robor.credit)
    			item.rata = this.ISPMT(item.ROBOR, 1, item.perioadaRamasa, sumaRamasa)
    			item.ppal = this.PPMT(item.ROBOR, 1, item.perioadaRamasa, sumaRamasa)
    			item.sumaRamasa = item.ppal + sumaRamasa
    			item.sumaRamasa = Math.round(item.sumaRamasa * 100) / 100
    			item.totalDePlata = item.rata + item.ppal
    			console.log(this.PPMT(item.ROBOR, 1, item.perioadaRamasa, sumaRamasa))
    			console.log('-----------first-------------')
    		}
    		else {
    			let sumaRamasa = data[data.indexOf(item) - 1].sumaRamasa
    			console.log('suma ramasa', sumaRamasa)
    			item.rata = this.ISPMT(item.ROBOR, 1, item.perioadaRamasa, sumaRamasa)
    			item.ppal = this.PPMT(item.ROBOR, 1, item.perioadaRamasa, sumaRamasa)
    			item.sumaRamasa = item.ppal + sumaRamasa
    			item.sumaRamasa =Math.round(item.sumaRamasa * 100) / 100
    			item.totalDePlata = item.rata + item.ppal
    		}
    		
    		console.log('--------------------------------------------------')
			

    	}



    	console.log(data)
    },

    construireValoriRobor(dataDeInceput) {
      const self = this
      return new Promise(function(resolve, reject) {
        let dataPrelucrata = dataDeInceput.split('-').splice(0, 2).join('-')
        let iteratorIndex = -1
        for (let val of valoriRoborLuni) {
          if (val.Date === dataPrelucrata) {
            iteratorIndex = valoriRoborLuni.indexOf(val)
            break;
          }
        }
        for (iteratorIndex; iteratorIndex < valoriRoborLuni.length; iteratorIndex++) {
          self.robor.valoriRoborUtilizator.push(valoriRoborLuni[iteratorIndex])
        }
        resolve(self.robor.valoriRoborUtilizator);
      });
    },





    ISPMT(rate, period, periods, value) {
      rate = eval(rate);
      periods = eval(periods);
      let ispmt = value * rate * (period / periods - 1);
      console.log('ispmt',ispmt)
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
      console.log('ppmt', ppmt)
      return ppmt
    },


    aniInLuni(ani) {
      this.robor.perioada = ani * 12
    }

  },

}