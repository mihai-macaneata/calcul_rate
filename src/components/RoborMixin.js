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
        credit: null,
        ani: null,
        perioada: null,
        dataInceput: null,
        valoriRoborUtilizator: [],
      },
    }
  },

  methods: {
    calculeazaRate(credit) {
      this.calculeazaRata(credit)
    },

    calculeazaRata(credit) {
      let robor_marja = 3.28,
        robor_rata = 0.0328 / 12,
        perioada_curenta = 1,
        periaoda_totala = this.perioada,
        credit_de_plata_ramas = 250000
      // this.ISPMT(3.35/12,1,240, 250000)
      this.PPMT(0.0335 / 12, 1, 240, 250000)
      this.construireValoriRobor(this.robor.dataInceput).then((response) => {
        console.log(response)
      }).catch((error) => {
        console.log(error)
      })
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
        resolve('valori robor utilizator');
      });
    },

    ISPMT(rate, period, periods, value) {
      rate = eval(rate);
      periods = eval(periods);
      let ispmt = value * rate * (period / periods - 1);
      console.log(ispmt)
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
      console.log(pmt)
      return pmt;
    },

    IPMT(pv, pmt, rate, per) {
      var tmp = Math.pow(1 + rate, per);
      var ipmt = 0 - (pv * tmp * rate + pmt * (tmp - 1));
      console.log(ipmt)
      return ipmt
    },

    PPMT(rate, per, nper, pv, fv, type) {
      if (per < 1 || (per >= nper + 1)) return null;
      var pmt = this.PMT(rate, nper, pv, fv, type);
      var ipmt = this.IPMT(pv, pmt, rate, per - 1);
      var ppmt = pmt - ipmt;
      console.log('ppmt', ppmt)
    },

    aniInLuni(ani) {
      this.perioada = ani * 12
    }

  },

}