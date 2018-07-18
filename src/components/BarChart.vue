<template>
	<div>
		<svg width="960" height="500"></svg>
	</div>
</template>

<script>

import * as d3 from "d3"
import dataJson from '../../static/data.json'

export default {

  name: 'BarChart',

  created() {
  },

  mounted(){
  	this.renderChart();
  },

  methods: {
  	renderChart() {
		var svg = d3.select("svg"),
		    margin = {top: 20, right: 20, bottom: 30, left: 40},
		    width = +svg.attr("width") - margin.left - margin.right,
		    height = +svg.attr("height") - margin.top - margin.bottom;


		var x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
		    y = d3.scaleLinear().rangeRound([height, 0]);

		var g = svg.append("g")
		    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	

		let parsedData = JSON.parse(JSON.stringify(dataJson));
				
		  x.domain(parsedData.map(function(d) { return d.letter; }));
		  y.domain([0, d3.max(parsedData, function(d) { return d.frequency; })]);

		  g.append("g")
		      .attr("class", "axis axis--x")
		      .attr("transform", "translate(0," + height + ")")
		      .call(d3.axisBottom(x));

		  g.append("g")
		      .attr("class", "axis axis--y")
		      .call(d3.axisLeft(y).ticks(10, "%"))
		    .append("text")
		      .attr("transform", "rotate(-90)")
		      .attr("y", 6)
		      .attr("dy", "0.71em")
		      .attr("text-anchor", "end")
		      .text("frequency");

		  g.selectAll(".bar")
		    .data(parsedData)
		    .enter().append("rect")
		      .attr("class", "bar")
		      .attr("x", function(d) { return x(d.letter); })
		      .attr("y", function(d) { return y(d.frequency); })
		      .attr("width", x.bandwidth())
		      .attr("height", function(d) { return height - y(d.frequency); });
  	},
  },

  data () {
    return {

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