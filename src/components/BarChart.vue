<template>
    <div class="page-container bar-chart">
    <button ref="navigation_1" class="btn-navigation not-shown" @click='changeChart'> < </button>
    <button ref="navigation_2" class="btn-navigation right not-shown" @click='doShowFinal'> > </button>


      <h1>
        Cum a crescut rata în timpul guvernării PSD
      </h1>
      <div ref="svgCont" class="svg-container">
        <svg class="bar-chart" width="100%" height="100%"></svg>
      </div>
    </div>
</template>

<script>

import * as d3 from "d3"

export default {

  name: 'BarChart',


  props: {
    robor: null,
    genereazaGraficMare: false,
    graphicShow: null,
    reseteazaRobor: false,
    showFinal: false,
  },

  created() {
   console.log(this.genereazaGraficMare)
  },

  mounted(){
  },

  methods: {
    prepareData(){
      let datePentruMedie = JSON.parse(JSON.stringify(this.robor.valoriGraficComparativ)) 
      let media2016 = - datePentruMedie[0].totalDePlata
      let valoareReferinta = 0;
      let valoriFinale = JSON.parse(JSON.stringify(this.robor.valoriGrafic))
      for(let val of valoriFinale) {
        val.totalDePlata = val.totalDePlata + media2016
        if(-val.totalDePlata > valoareReferinta) {
          valoareReferinta = val.totalDePlata
        }
      }

      let dataReferinta = valoriFinale[valoriFinale.length - 1].Date.split('-')
      let lunaReferinta = parseInt(dataReferinta[1]) + 1

      let dataFinalaReferinta = dataReferinta[0] + '-' + lunaReferinta

      valoriFinale.push({totalDePlata: valoareReferinta * 1.3, referinta: true, Date:dataFinalaReferinta})

       const svg = d3.select('svg.bar-chart');

      // console.log(valoriFinale)

      this.renderChart(svg,valoriFinale)

    },

    changeChart(val) {
      this.$emit('update:graphicShow', val)
    },

    doShowFinal(){
      this.$emit('update:showFinal', true)
    },

  	renderChart(svg, data) {

       let computedWidth = this.$refs["svgCont"].offsetWidth
      let computedHeight = this.$refs["svgCont"].offsetHeight

      let media2016 = this.robor.valoriGraficComparativ[0].totalDePlata
    		    var margin = {top: 50, right: 20, bottom: 0, left: 50},
    		    width = computedWidth - margin.left - margin.right,
    		    height = computedHeight - margin.top - margin.bottom;


    		var x = d3.scaleBand().rangeRound([0, width]).padding(1),
    		    y = d3.scaleLinear().rangeRound([height, 0]);

          if (this.rendered) {
            var g = svg.select("g.main-group")
          } else {
            var g = svg.append("g").attr('class', 'main-group')
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
          }

        let parsedData = JSON.parse(JSON.stringify(data));

          x.domain(parsedData.map(function(d) { return d.Date }));
          y.domain([0, d3.max(parsedData, function(d) { return -d.totalDePlata })]);

       
          if (this.rendered) {
            var new_bars = g.selectAll(".bar-container").remove();
            var bar_container = g.selectAll(".bar-container")
              .data(parsedData)
              .enter().append("g").attr('class', 'bar-container')
          } else {
            var bar_container = g.selectAll(".bar-container")
              .data(parsedData)
              .enter().append("g").attr('class', 'bar-container')
          }

          bar_container.append('text')
          .text(function(d){
                   if(d.referinta === true) {
              return 
            } else {
              return '+ ' + parseInt(-d.totalDePlata) + ' lei'}
            }
            )
          .attr("x", function(d) { return x(d.Date) })
          .attr('font-size', '16px')
          .attr("y", function(d) {
            return y(0);
          })
          .attr("y", function(d) { return y(-d.totalDePlata)})
          .transition()
          .attr('transform', function(d){
            let height = this.getBBox().height
            let x = parseInt(this.getAttribute('x')) + height - 5
            let y = parseInt(this.getAttribute('y')) - height - 5
            return `rotate(-90,${x},${y})`
          })
          .attr("opacity", "1")


          bar_container.append('text')
          .attr('class', 'year')
          .text(function(d){
            if(d.Date === '2017-01') {
              return '2017'
            } else if(d.Date === '2018-01')  {
              return '2018'
            } else {
              return ''
            }
            })
          .attr("x", function(d) { return x(d.Date) + 10 })
          .attr('font-size', '28px')
          .attr("y", function(d) {
            return y(0);
          })
          .attr("y", function(d) { return 20})
          .transition()
          .attr("opacity", "1")


          
          bar_container.append('text')
          .attr('class', 'gov')
          .text(function(d){
            if(d.Date === '2017-01') {
              return 'Guvernul Grindeanu'
            } else if(d.Date === '2018-01')  {
              return 'Guvernul Dăncilă'
            } else if(d.Date === '2017-06') {
              return 'Guvernul Tudose'
            }
             else {
              return ''
            }
            })
          .attr("x", function(d) { 
            
            if(d.Date === '2018-01') {
              return x(d.Date) + parsedData.length * width/500 + 10
            }
            else {
              return x(d.Date) + 10 
            }
          })
          .attr('font-size', '18px')
          .attr("y", function(d) {
            return y(0);
          })
          .attr("y", function(d) { return 45})
          .transition()
          .attr("opacity", "1")

      
          bar_container.append('text')
          .attr('class', 'month')
          .text(function(d){
            if(d.Date === '2017-01') {
              return '4 Ianuarie 2017'
            } else if(d.Date === '2018-01')  {
              return '29 Ianuarie 2018'
            } else if(d.Date === '2017-07') {
              return '29 Iunie 2017'
            }
             else {
              return ''
            }

            })
          .attr("x", function(d) { 

            if(d.Date === '2018-01') {
              return x(d.Date) + parsedData.length * width/500 + 10
            }
            else {
            return x(d.Date) + 10
            } 
          })
          .attr('font-size', '12px')
          .attr("y", function(d) {
            return y(0);
          })
          .attr("y", function(d) { return 60})
          .transition()
          .attr("opacity", "1")






          bar_container.append('rect')
          .attr('class', 'line')
          .attr("x", function(d) { return x(d.Date) })
          .attr('font-size', '28px')
          .attr("height", function(d){
            if(d.Date === '2017-01' || d.Date === '2018-01') {
              return height
            } else if (d.Date === '2017-06'){
              return height - 20
            }
             else {
              return 0
            }
            
          })
          .attr("width", 1)
          .attr("y", function(d) {
              if (d.Date === '2017-06'){
               return 20
            } else {
               return 0
            }

           return 
            })
          .transition()
          .attr("opacity", "1")



          bar_container.append('rect')
          .attr("x", function(d) { return x(d.Date) + parseInt(parsedData.length * width/500) })
          .attr("y", function(d) {
            return y(0);
          })
          .attr("height", function(d){
            if(d.Date === '2018-01') {
              return height - 25
            }
             else {
              return 0
            }
          })
          .attr("width",function(d){
            if (d.Date === '2018-01'){
               return 1
            } else {
               return 0
            }

          })
          .attr("y", function(d) {
              if (d.Date === '2018-01'){
               return 25
            } else {
               return 0
            }

           return 
            })
          .transition()
          .attr("opacity", "0.4")






          bar_container.append('rect')
          .attr("class", "bar")
          .attr("x", function(d) { return x(d.Date) })
          .attr("fill",'black')
          .attr("width",  function(d) { 
            if(d.referinta === true) {
              return 0 
            } else {
              return parsedData.length * width/500
            }
          })
          .attr("y", function(d) {
            return y(0);
          })
          .attr("height", 0)
          .transition()
          .attr("y", function(d) { return y(-d.totalDePlata)})
          .attr("height", function(d) { 
            if(d.referinta === true) {
              return 0 
            } else {
              return height - y(-d.totalDePlata)
            }
          });

        bar_container.exit().remove();


      this.$emit('update:reseteazaRobor', true)
      this.$emit('update:genereazaGraficMare', false)

      this.rendered = true;
  	},
  },

  watch: {
    genereazaGraficMare: {
      handler(val) {
        if (val === true) {
            this.prepareData();
        }
      },
      deep: true
    },
    graphicShow: {
      handler(val) {
        if(val === false) {
          setTimeout(() => {
                this.$nextTick(() => {
                  this.$refs.navigation_2.classList.remove('not-shown')
                  this.$refs.navigation_1.classList.remove('not-shown')
                });
          },900) 
        } else {
          this.$refs.navigation_2.classList.add('not-shown')
          this.$refs.navigation_1.classList.add('not-shown')
        }
        
      },
    }
  },

  data () {
    return {
      rendered: false
    }
  },




}
</script>

<style scoped>
  h1 {
    text-align: center;
    font-size: 2.5rem;
    margin: 4rem 0;
  }
  .svg-container {
    width: 100%;

    flex-grow: 1;
    overflow: hidden;
  }

  .page-container {
    flex-direction: column;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    height: calc(100vh - 8rem);
  }




</style>
