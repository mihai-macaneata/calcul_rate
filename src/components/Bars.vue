<template>
	<div class="bars">
    <!-- <button @click='changeChart'> > </button> -->
		<div class="page-container">
			<div class="section text-section">
					<h1>Crește ROBOR, <div><small>crește rata!</small></div></h1>
					<h1 style="color: white;">{{valoareCrestereRata}} <small>lei</small> <span class="arrow-left">↗</span> </h1> 
					<h3 style="color: white;">plătiți în plus doar în ultima lună</h3>
					<h4>din cauză că ROBOR, stabil în 2016 la ~0,78%, a urcat la 3,15% în timpul guvernării PSD. </h4>
			</div>
			<div style="cursor: pointer" @click="changeChart" ref="svgCont" class="section svg-container">
        <span class="arrow-right">↗</span>
	    		<svg class="bars" width="100%" height="500">
	    		<!-- 	 <defs>
					    <filter id="shadow" x="0" y="0" width="200%" height="200%">
					      <feOffset result="offOut" in="SourceAlpha" color="#eee" height="85%" dx="10" dy="5" />
					      <feBlend in="SourceGraphic" in2="blurOut" mode="normal" />
					    </filter>
					  </defs> -->
	    		</svg>
			</div>
		</div>

	</div>
</template>

<script>

import * as d3 from "d3"

export default {
  name: 'Bars',
  props: {
    robor: null,
    genereazaGrafic: false,
    graphicShow: null,
  },
  data() {
    return {
      valoareCrestereRata: 0,
      rendered: false
    }
  },
  created() {console.log('created bars')},
  methods: {

    renderStuff() {
      let data = JSON.parse(JSON.stringify(this.robor.valoriGraficComparativ));
      const svg = d3.select('svg.bars');
      this.renderChart(svg, data)
    },

    changeChart(){
      this.$emit('update:graphicShow', false)
      // this.$destroy()
    },

    renderChart(svg, data) {
      const self = this;

      let computedWidth = this.$refs["svgCont"].offsetWidth
      let computedHeight = this.$refs["svgCont"].offsetHeight
      var margin = {
          top: 20,
          right: 20,
          bottom: 0,
          left: 40
        },
        width = computedWidth - margin.left - margin.right,
        height = +computedHeight - margin.top - margin.bottom;

      var x = d3.scaleBand().rangeRound([0, width]).padding(0.8),
        y = d3.scaleLinear().rangeRound([height, 0]);

      if (this.rendered) {
        var g = svg.select("g.main-group")
      } else {
        var g = svg.append("g").attr('class', 'main-group')
          .attr("transform", "translate(" + -width/4 + "," + margin.top + ")")
      }

      let parsedData = JSON.parse(JSON.stringify(data));
      x.domain(parsedData.map(function(d) {
        return d.Date
      }));
      y.domain([0, d3.max(parsedData, function(d) {
        return -d.totalDePlata
      })]);

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

      let barSizeWidth = computedWidth / 4
      let barSizeHeight = computedHeight / 3

      let textMarginBottom = 10
      let textMarginTop = 30

      bar_container.append('rect')
        .attr("class", "bar-shadow")
        .attr("x", function(d) {
          return x(d.Date) + 10
        })
        .attr("y", function(d) {
          return y(-d.totalDePlata) + textMarginTop + 10
        })
        .attr("width", barSizeWidth)
        .attr("height", function(d) {
          return height - y(-d.totalDePlata) - textMarginTop
        })
        .attr("fill", "rgba(0,0,0,0.5)")
        .attr("opacity", "0.4")


      bar_container.append('rect')
        .attr("class", "bar")
        .attr("x", function(d) {
          return x(d.Date)
        })
        .attr("width", barSizeWidth)
        .attr("y", function(d) {
          return y(0);
        })
        .attr("height", 0)
        .transition()
        .attr("y", function(d) {
          return y(-d.totalDePlata)  + textMarginTop
        })
        .attr("height", function(d) {
          return height - y(-d.totalDePlata)  - textMarginTop
        })


      bar_container.append('text')
        .text(function(d) {
          return parseInt(-d.totalDePlata) + ' lei'
        })
        .attr('font-size', '32px')
        .attr("x", function(d) {
        	// console.log('barsizewidth', barSizeWidth)
        	// console.log('bbox', this.getBBox().width)

        	// console.log('width', barSizeWidth - this.getBBox().width)
          return x(d.Date) + (barSizeWidth - this.getBBox().width)/2

        })
        .attr("y", function(d) {
          return y(-d.totalDePlata) + textMarginBottom 
        })



      let diferenta = this.valoareCrestere();


      bar_container.append('rect')
        .attr("class", "bar-difference")
        .attr("x", function(d) {
          return x(d.Date)
        })
        .attr("width", function(d) {
          if (d.Date != '2016')
            return barSizeWidth
          else
            return 0
        })
        .attr("y", function(d) {
          return y(0);
        })
        .attr("height", 0)
        .transition()
        .attr("y", function(d) {
          return y(-d.totalDePlata) + textMarginTop
        })
        .attr("height", function(d) {
          return height - y(diferenta)
        })
        .attr('fill', 'black')



      bar_container.append('text')
        .text(function(d) {
          if (d.Date != '2016') return '+' + parseInt(diferenta) + ' lei'
        })
        .attr('font-size', '32px')
        .attr("x", function(d) {
          return x(d.Date) + (barSizeWidth - this.getBBox().width)/2
        })
        .attr("y", function(d) {
          return y(-d.totalDePlata) + textMarginTop/2 + diferenta / 4
        })
        .attr("width", barSizeWidth)
        .attr('fill', 'white')



        var robor_text_height = 0

   		bar_container
   		.append('text')
   		.text(function(d) {
        	if(d.Date != '2016') {
        		return `ROBOR ${d.robor_nemodificat}`
        	} else {
        		return `ROBOR ${d.robor_nemodificat}`
        	}
        })

        .attr('font-size', '18px')
        .attr("x", function(d) {

          robor_text_height = this.getBBox().height + 5

          return x(d.Date) + (barSizeWidth - this.getBBox().width)/2

        })
        .attr("y", function(d) {
          // return y(-d.totalDePlata) + textMarginBottom 
		  if(d.Date != '2016') {
		  	return   y((-d.totalDePlata - diferenta )/2)
           } else {
          	return   y(-d.totalDePlata/2)
           }
        })



   		bar_container
   		.append('text')
   		.text(function(d) {
        	if(d.Date != '2016') {
        		return `${self.doTheDate(d.Date)}`
        	} else {
        		return `media pe 2016`
        	}
        })

        .attr('font-size', '18px')
        .attr("x", function(d) {
          return x(d.Date) + (barSizeWidth - this.getBBox().width)/2

        })
        .attr("y", function(d) {
          // return y(-d.totalDePlata) + textMarginBottom 
		  if(d.Date != '2016') {
		  	return   y((-d.totalDePlata - diferenta )/2) + robor_text_height
           } else {
          	return   y(-d.totalDePlata/2) + robor_text_height
           }
        })
   



      bar_container.exit().remove();

      this.$emit('update:genereazaGrafic', false)
      this.rendered = true;
      this.$emit('update:genereazaGraficMare', true)

    },

    doTheDate(date) {
    	let dateArr = date.split('-');
    	return `${dateArr[1]} ${dateArr[0]}`
    },

    valoareCrestere() {
      this.valoareCrestereRata = parseInt(-this.robor.valoriGraficComparativ[1].totalDePlata - (-this.robor.valoriGraficComparativ[0].totalDePlata))
      return this.valoareCrestereRata
    },

  },
  watch: {
    genereazaGrafic: {
      handler(val) {
        if (val === true) {
          this.renderStuff()
        }
      },
      deep: true
    }
  }
}
</script>

<style scoped>
button {
      background: none;
    border: none;
    position: absolute;
    right: 0;
    top: 0;
    font-size: 3rem;
    color: white;
    opacity: 0.5;
    height: 100%;
}

button:hover {
  background: rgba(255,255,255,0.5);
  cursor: pointer;
}

.text-section {
  font-size: 130%;
}

.text-section {
  display: flex;
  justify-content: center;
  flex-direction: column;
      margin-left: 5rem;
}

.text-section > * {
  width: 100%;
  text-align: left;
}

.arrow-left, .arrow-right{
  color: rgba(0,0,0,0.2);
  font-size: 8rem;
}

.arrow-right {
position: absolute;
    right: 1rem;
    font-size: 15rem;
    top: 70%;
    transform: translateY(-40%);
    color: rgba(255,255,255,0.2);
}

</style>
