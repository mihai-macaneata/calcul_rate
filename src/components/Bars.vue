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
			credit de <input type="number" v-model="robor.credit"/> pe  <input type="number" v-model="robor.ani" @change="aniInLuni(robor.ani)" /> de ani inceput in  <input type="date" v-model="robor.dataInceput"/> <button type="button" @click="calculeazaRate(robor.credit)">Calculeaza</button>
		</div>
		<pre>
			{{robor.valoriRoborUtilizator}}
		</pre>
	</div>
</template>

<script>

import * as d3 from "d3"
import roborMixin from './RoborMixin.js'

export default {

  name: 'Bars',
  mixins: [roborMixin],

  created(){
  	console.log(this.robor)
  },

  data () {
    return {

    }
  }
}
</script>

<style lang="css" scoped>
</style>