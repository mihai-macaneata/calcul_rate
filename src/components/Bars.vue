<template>
	<div class="bars">

		<div class="page-container">
			<div class="section">
				<div class="left">
					<h2>Crește ROBOR, <div><small>crește rata!</small></div></h2>
					<h1>{{valoareCrestereRata}} <small>lei</small></h1>
					<h3>plătiți în plus doar în ultima lună</h3>
					<p>din cauză că ROBOR, stabil în 2016 la ~0,78%, a urcat la 3,15% în timpul guvernării PSD. </p>
				</div>
			</div>
			<div ref="svgCont" class="section svg-container">
	    		<svg  class="bars" width="100%" height="500">
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
  },


  data () {
    return {
    	valoareCrestereRata: 0,

    }
  },

  created(){
  	console.log(this.robor)
  },

  methods: {


  renderChart() {
  	let computedWidth = this.$refs["svgCont"].offsetWidth
    var svg = d3.select("svg.bars"),
        margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = computedWidth - margin.left - margin.right,
        height = +svg.attr("height") - margin.top - margin.bottom;


    var x = d3.scaleBand().rangeRound([0, width]).padding(0.8),
        y = d3.scaleLinear().rangeRound([height, 0]);

    var g = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    let parsedData = JSON.parse(JSON.stringify(this.robor.valoriGraficComparativ));

      x.domain(parsedData.map(function(d) { return d.Date }));
      y.domain([0, d3.max(parsedData, function(d) { return -d.totalDePlata })]);

      g.append("g")
          .attr("class", "axis axis--x")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(x));

      g.append("g")
          // .attr("class", "axis axis--y")
          // .call(d3.axisLeft(y).ticks(10, "%"))
        // .append("text")
          // .attr("transform", "rotate(-90)")
          // .attr("y", 6)
          // .attr("dy", "0.71em")
          // .attr("text-anchor", "end")
          // .text("valoare rata");

      var bar_container = g.selectAll(".bar")
        .data(parsedData)
        .enter().append("g").attr('class','bar-container')


          bar_container.append('text')
          .text(function(d){return parseInt(-d.totalDePlata) + ' lei' })
          .attr("x", function(d) { return x(d.Date) + 120/4 })
          .attr("y", function(d) { return y(-d.totalDePlata ) + 80})
          .attr('font-size', '20px')
          .attr("width", 120)


          bar_container.append('rect')
          .attr("class", "bar-shadow")
          .attr("x", function(d) { return x(d.Date) + 10 })
          .attr("y", function(d) { return y(-d.totalDePlata) + 110 })
          .attr("width", 120)
          .attr("height", function(d) { return height - y(-d.totalDePlata) - 120 })
          .attr("fill", "rgba(0,0,0,0.5)")
          .attr("opacity", "0.5")


          bar_container.append('rect')
          .attr("class", "bar")
          .attr("x", function(d) { return x(d.Date) })
          .attr("y", function(d) { return y(-d.totalDePlata) + 100})
          .attr("width", 120)
          .attr("height", function(d) { return height - y(-d.totalDePlata) - 100 })
          // .attr('filter', 'url(#shadow)');

          let diferenta = this.valoareCrestere();
          console.log(diferenta)

        var diferenta_rect =  bar_container.append('rect')
          .attr("class", "bar-difference")
          .attr("x", function(d) { return x(d.Date) })
          .attr("y", function(d) {return y(-d.totalDePlata) + 100})
          .attr("width", function(d) { if(d.Date != '2016') 
          									return 120 
          								else 
          									return 0  })
          .attr("height", function(d) { return height - y(diferenta)  })
          .attr('fill','black')
          // .attr('filter', 'url(#shadow)');

          let textwidth = 0;
          bar_container.append('text')
          .text(function(d){if(d.Date != '2016') return '+' + parseInt(diferenta) + ' lei' })
          .attr("x", function(d) { 
           textwidth = this.getBBox().width
          	return x(d.Date) + 120/2 - 10
          })
          .attr("y", function(d) { return y(-d.totalDePlata ) + diferenta/2 - 10})
          .attr('font-size', '20px')
          .attr("width", 120)
          .attr('fill', 'white')
          .attr('transform',"translate(" + -textwidth/2 + "," + 0 + ")")


    },

    valoareCrestere(){
      this.valoareCrestereRata = parseInt(-this.robor.valoriGraficComparativ[1].totalDePlata -  ( - this.robor.valoriGraficComparativ[0].totalDePlata))
      return this.valoareCrestereRata
    },


  },


  watch: {
      genereazaGrafic: {
         handler(val){
          if(val === true){
            this.renderChart()
          }
         },
         deep: true
      }
    }
}
</script>

<style scoped>

.page-container {
	display: flex;
	flex: 1 0 auto;
	    padding: 1rem;
	    width: 100%;
}
	.section {
		flex-basis: 40%;
	}

	.svg-container {
		flex-basis: 60%;
	}
	svg {
		width: 100%;
	}

.bars {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
}



</style>
