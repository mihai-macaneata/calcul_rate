<template>
	<div>

		<div class="section">
			<div class="left">
				<h2>Crește ROBOR, <div><small>crește rata!</small></div></h2>
				<h1>288 <small>lei</small></h1>
				<h3>plătiți în plus doar în ultima lună</h3>
				<p>din cauză că ROBOR, stabil în 2016 la ~0,78%, a urcat la 3,15% în timpul guvernării PSD. </p>
			</div>
			<div class="right">

			</div>
		</div>
		<div class="section">
			credit de <input type="number" v-model="robor.credit"/> pe  <input type="number" v-model="robor.ani" @change="aniInLuni(robor.ani)" /> de ani inceput in  <input type="date" v-model="robor.dataInceput"/> <button type="button" @click="emitCalculeazaRate(robor.credit)">Calculeaza</button>
		</div>
		<pre>
			<!-- {{robor.valoriRoborUtilizator}} -->
		</pre>
    <svg class="bars" width="960" height="500"></svg>

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

  created(){
  	console.log(this.robor)
  },

  methods: {

    emitCalculeazaRate(credit) {
      this.$emit('calculeaza', credit)
    },


  renderChart() {
    var svg = d3.select("svg.bars"),
        margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = +svg.attr("width") - margin.left - margin.right,
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
          .text(function(d){return -d.totalDePlata})
          .attr("x", function(d) { return x(d.Date) })
          .attr("y", function(d) { return y(-d.totalDePlata )})
          .attr('font-size', '9px')

          bar_container.append('rect')
          .attr("class", "bar")
          .attr("x", function(d) { return x(d.Date) })
          .attr("y", function(d) { return y(-d.totalDePlata )})
          .attr("width", 70)
          .attr("height", function(d) { return height - y(-d.totalDePlata) });
    },


    aniInLuni(ani) {
      this.robor.perioada = ani * 12
    }
  },

  data () {
    return {

    }
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

<style lang="css" scoped>
</style>
