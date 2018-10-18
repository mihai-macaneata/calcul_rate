<template>
    <div class="app-container">
        <bars 
            :class="{hidden: !graphicShow, 'smaller-bars': smallerBars}" 
            :graphicShow.sync="graphicShow" 
            :genereazaGraficMare.sync="genereazaGraficMare" 
            :genereazaGrafic.sync="genereazaGrafic" 
            :robor="robor"
            ref="barsComponent">
                
        </bars>

        <barchart 
            :class="{hidden: graphicShow || showFinal}" 
            :graphicShow.sync="graphicShow" 
            :reseteazaRobor.sync="reseteazaRobor" 
            :showFinal.sync="showFinal" 
            :genereazaGraficMare.sync="genereazaGraficMare" 
            :robor="robor">
                
        </barchart>

        <final 
            :class="{hidden: !showFinal}" 
            :showFinal.sync="showFinal" 
            :robor="roborFaraPSD">
            
        </final>

        <div class="footer">
           <span class="mobile-block">* Calcul pentru un credit de</span>
            <span class="mobile-block"><input @change="userInput" type="number" v-model="robor.credit"/> </span> pe
            <span class="mobile-block"><input type="number" v-model="robor.ani" @change="aniInLuni(robor.ani)" /> </span> de ani inceput in
            <span class="mobile-block"><input @blur="userInput"   type="date" v-model="robor.dataInceput"/> </span>
            <span class="mobile-block"><button class="btn-calc" type="button" @click="calculeazaRate">Calculeaza</button></span>
        </div>
    </div>
</template>

<script>

import BarChart from './BarChart'
import Bars from './Bars'
import Final from "./Final"
import valoriRoborLuni from '../assets/valoriRoborLuni.js'
import valoriRoborLuniFaraPSD from '../assets/valoriRoborLuniFaraPSD.js'

export default {
    name: 'Main',

    components: {
        barchart:   BarChart,
        bars:       Bars,
        final:      Final
    },


    created(){
        this.calculeazaRate();
        this.roborFaraPSD.credit        = this.robor.credit
        this.roborFaraPSD.ani           = this.robor.ani
        this.roborFaraPSD.perioada      = this.robor.perioada
        this.roborFaraPSD.dataInceput   = this.robor.dataInceput
        this.roborFaraPSD.roborMarja    = this.robor.roborMarja
    },
    mounted() {
        var self = this;
        let body = document.querySelector('body')
        body.classList.remove('no-ovf')
        /** 
         *   Rerender the d3 graph every time
         *   the window is resized  
         **/
        window.addEventListener('resize', function() {
            if(window.matchMedia('(min-width: 570px)').matches) {
                setTimeout(() => {
                    self.calculeazaRate()
                }, 500)
            }
        });
    },
    data() {
        return {
            genereazaGrafic:        false,
            genereazaGraficMare:    false,
            userGenerated:          false,
            graphicShow:            true,
            reseteazaRobor:         false,
            showFinal:              false,
            smallerBars:            false,
            robor: {
                rata_2016:      null,
                credit:         250000,
                ani:            20,
                perioada:       240,
                dataInceput:    '2016-01-29',
                roborMarja:     2.5,
                valoriRoborUtilizator:      [],
                valoriGrafic:               [],
                valoriGraficComparativ:     [],
                valoriComparatieFaraPSD:    [],
            },
            roborFaraPSD: {
                rata_2016:      null,
                credit:         250000,
                ani:            20,
                perioada:       240,
                dataInceput:    '2016-01-29',
                roborMarja:     2.5,
                valoriRoborUtilizator:  [],
                valoriGrafic:           [],
                valoriGraficComparativ: [],
                mediaCuPSD:     0,
                mediaFaraPSD:   0,
                totalCuPSD:     0,
                totalFaraPSD:   0,
            },
        }
    },

    methods: {

        calculeazaRate() {
            this.roborFaraPSD.credit      = this.robor.credit
            this.roborFaraPSD.ani         = this.robor.ani
            this.roborFaraPSD.perioada    = this.robor.perioada
            this.roborFaraPSD.dataInceput = this.robor.dataInceput
            this.roborFaraPSD.roborMarja  = this.robor.roborMarja
            this.calculeazaRata()
        },

        calculeazaRata() {
            const self = this;
            this.construireValoriRoborFaraPSD(this.roborFaraPSD.dataInceput).then((response) => {
                self.faChestiiEconomiceFaraPSD()
            }).catch((error) => {
                console.log(error)
            })
        },


        faChestiiEconomice() {
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
            this.robor.valoriComparatieFaraPSD = []

            for(let item of data) {
                let anul = item.Date.split('-')[0]
                if(anul === '2016') {
                    pentruMedie.push(- item.totalDePlata)
                }
                if(parseInt(anul) > 2016) {
                    this.robor.valoriGrafic.push(item)
                }
                if(parseInt(anul) > 2017) {
                    this.robor.valoriComparatieFaraPSD.push(item)
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

            this.comparaFaraPSD();
        },


        faChestiiEconomiceFaraPSD() {
            const self = this
            const data = this.roborFaraPSD.valoriRoborUtilizator
            for(let item of data) {
                item.robor_nemodificat = item.ROBOR
                let roborProcente = ((parseFloat(item.ROBOR) + 2.5) / 100)/12
                item.ROBOR = roborProcente
                item.perioadaRamasa = this.roborFaraPSD.perioada
                this.roborFaraPSD.perioada = this.roborFaraPSD.perioada - 1
                if(data.indexOf(item) === 0) {
                    let sumaRamasa = parseFloat(this.roborFaraPSD.credit)
                    item.rata = this.ISPMT(item.ROBOR, 1, item.perioadaRamasa, sumaRamasa)
                    item.ppal = this.PPMT(item.ROBOR, 1, item.perioadaRamasa, sumaRamasa)
                    item.sumaRamasa = item.ppal + sumaRamasa
                    item.sumaRamasa = Math.round(item.sumaRamasa * 100) / 100
                    item.totalDePlata = item.rata + item.ppal
                    // console.log(this.PPMT(item.ROBOR, 1, item.perioadaRamasa, sumaRamasa))
                    // console.log('-----------first-------------')
                } else {
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
            this.roborFaraPSD.valoriGrafic = []

            for(let item of data) {
                let anul = item.Date.split('-')[0]
                if(anul === '2016') {
                    pentruMedie.push(- item.totalDePlata)
                }
                if(parseInt(anul) > 2017) {
                    this.roborFaraPSD.valoriGrafic.push(item)
                }
            }

            const average = arr => arr.reduce( ( p, c ) => p + c, 0 ) / arr.length;

            const result = average(pentruMedie); // 5

            let media_2016 = {
                Date: 2016,
                totalDePlata: -result,
                robor_nemodificat: 0.78,
            }

            this.roborFaraPSD.valoriGraficComparativ = []

            this.roborFaraPSD.valoriGraficComparativ.push(media_2016)
            this.roborFaraPSD.valoriGraficComparativ.push(data[data.length-1])

            this.roborFaraPSD.rata_2016 = result
            // console.log(this.roborFaraPSD)

            this.construireValoriRobor(this.robor.dataInceput).then((response) => {
                self.faChestiiEconomice()
            }).catch((error) => {
                console.log(error)
            })
        },


        comparaFaraPSD(){
            let pentruMediaCuPSD = [];
            let pentruMediaFaraPSD = [];

            for(let value of this.robor.valoriComparatieFaraPSD) {
                pentruMediaCuPSD.push(value.totalDePlata)
            } 

            for(let value of this.roborFaraPSD.valoriGrafic) {
                pentruMediaFaraPSD.push(value.totalDePlata)
            } 

            const average = arr => arr.reduce( ( p, c ) => p + c, 0 ) / arr.length;
            const sum = arr => arr.reduce( ( p, c ) => p + c, 0 );

            const mediaCuPSD    = average(pentruMediaCuPSD); // 5
            const mediaFaraPSD  = average(pentruMediaFaraPSD)
            const totalCuPSD    = sum(pentruMediaCuPSD)
            const totalFaraPSD  = sum(pentruMediaFaraPSD)

            this.roborFaraPSD.totalCuPSD    = -totalCuPSD
            this.roborFaraPSD.totalFaraPSD  = -totalFaraPSD
            this.roborFaraPSD.mediaCuPSD    = -mediaCuPSD
            this.roborFaraPSD.mediaFaraPSD  = -mediaFaraPSD
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

        construireValoriRoborFaraPSD(dataDeInceput) {
            const self = this
            return new Promise(function(resolve, reject) {
                self.roborFaraPSD.valoriRoborUtilizator = [];
                let dataPrelucrata = dataDeInceput.split('-').splice(0, 2).join('-')
                let iteratorIndex = -1

                let valoriRoborLuniModificate = JSON.parse(JSON.stringify(valoriRoborLuniFaraPSD))

                for (let val of valoriRoborLuniModificate) {
                    if (val.Date === dataPrelucrata) {
                        iteratorIndex = valoriRoborLuniModificate.indexOf(val)
                        break;
                    }
                }
                for (iteratorIndex; iteratorIndex < valoriRoborLuniModificate.length; iteratorIndex++) {
                    self.roborFaraPSD.valoriRoborUtilizator.push(valoriRoborLuniModificate[iteratorIndex])
                }
                resolve(self.roborFaraPSD.valoriRoborUtilizator);
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
                    if (rate == 0) 
                        return -(pv + fv) / nper;

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
        },

        changeBodyOverflow(val) {
            // let roots = [document.querySelector('body'), document.querySelector('html')]

            if(!val && !this.showFinal) {
                window.scrollBy(0,-1000)
                this.smallerBars = true
                // roots.forEach( el => el.classList.add('no-ovf'))
            } else {
                this.smallerBars = false

                // roots.forEach( el => el.classList.remove('no-ovf'))
            }
        }
    },

    watch: {

        reseteazaRobor: {
            handler(val) {
                if(val === true) {
                    if(this.userGenerated) {
                        this.robor = {
                            rata_2016:      this.robor.rata_2016,
                            credit:         this.robor.credit,
                            ani:            this.robor.ani,
                            dataInceput:    this.robor.dataInceput,
                            roborMarja:     2.5,
                            valoriRoborUtilizator:      [],
                            valoriGrafic:               [],
                            valoriGraficComparativ:     [],
                            valoriComparatieFaraPSD:    [],
                        }
                    }
                    this.reseteazaRobor = false

                    this.aniInLuni(this.robor.ani);
                }
            },
            deep: true
        },
        graphicShow: {
            handler(val) {
                this.changeBodyOverflow(val);
            }
        },
        showFinal: {
            handler(val) {
                this.changeBodyOverflow(val);
            }
        },
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.app-container {
    height: calc(100vh - 4rem);
    margin: 2rem 4rem;
    background: #e32b25;
    position: relative;
    overflow: hidden;
}

.footer {
    padding: 1rem;
    text-align: center;
    background: white;
}

input {
    border: none;
    border-bottom: 1px solid red;
    max-width: 83px;
    text-align: center;
}

input[type="date"] {
    max-width: 140px;
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
