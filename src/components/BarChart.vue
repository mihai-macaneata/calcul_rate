<template>
	<div>
		<svg class="bar-chart" width="960" height="500"></svg>
	</div>
</template>

<script>

import * as d3 from "d3"

export default {

  name: 'BarChart',


  props: {
    robor: null,
    genereazaGrafic: false
  },

  created() {
  },

  mounted(){
      console.log(this.genereazaGrafic)

  },

  methods: {
  	renderChart() {
		var svg = d3.select("svg.bar-chart"),
		    margin = {top: 20, right: 20, bottom: 30, left: 40},
		    width = +svg.attr("width") - margin.left - margin.right,
		    height = +svg.attr("height") - margin.top - margin.bottom;


		var x = d3.scaleBand().rangeRound([0, width]).padding(0.8),
		    y = d3.scaleLinear().rangeRound([height, 0]);

		var g = svg.append("g")
		    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


		let parsedData = JSON.parse(JSON.stringify(this.robor.valoriGrafic));

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
          .text(function(d){return parseInt(-d.totalDePlata).toFixed(2)})
          .attr("x", function(d) { return x(d.Date) })
          .attr("y", function(d) { return y(-d.totalDePlata )})
          .attr('font-size', '9px')


          bar_container.append('rect')
          .attr("class", "bar")
          .attr("x", function(d) { return x(d.Date) })
          .attr("y", function(d) { return y(-d.totalDePlata )})
          .attr("width", 35)
          .attr("height", function(d) { return height - y(-d.totalDePlata) });
  	},
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

<style>

.bar {
  fill: steelblue;
}

.bar:hover {
  fill: brown;
}

.axis--x path {
  display: none;
}

</style>
