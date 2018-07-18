<template>
  <div class="container">
    <bars></bars>
    <!-- <barchart></barchart> -->
  </div>
</template>

<script>

import BarChart from './BarChart'
import Bars from './Bars'

export default {
  name: 'Main',

  components: {
    barchart: BarChart,
    bars: Bars
  },


  created(){

  },

  data () {
    return {
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
