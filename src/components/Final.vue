<template>
	<div class="page-container" v-if="robor">
		<div class="final-page">
			<div class="section text-section">
				<h1 style="margin-bottom: 4rem">Cât ai plătit în plus anul acesta</h1>
				<h1 style="color: white">
					{{parseInt(robor.totalCuPSD - robor.totalFaraPSD)}} lei
				</h1>
				<h3 style="color: white; margin-bottom:2rem;">
					Ianuarie - Iulie 2018
				</h3>
				<h3 style="max-width: 477px">
					Din {{parseInt(robor.totalCuPSD)}} lei cat ai plătit rate anul acesta, {{calculeazaProcente()}}% trebuiau să rămânâ ai tâi.
				</h3>
				<a class="facebook-share" href="#">Distribuie pe Facebook</a>
			</div>
			<div class="section">
				<img src="../assets/samsung.jpg">
				<h2 style="color: white">Televizor LED Smart Samsung, 80 cm, HD</h2>
			</div>
		</div>
	</div>
</template>

<script>
export default {


  props: {
  	robor: null,
  },

  created(){
  	console.log(this.robor)
  	this.calculeazaProcente()
  },

  methods: {
  	calculeazaProcente(){
  		let platitInPlus = this.robor.totalCuPSD - this.robor.totalFaraPSD
  		let total = this.robor.totalCuPSD
  		let procentaj  = (platitInPlus * 100)/total 
  		return parseInt(procentaj)
  	},
  },

  data () {
    return {
    	procent: null,
    }
  }
}
</script>

<style lang="css" scoped>
  .page-container {
    flex-direction: column;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
    background: #e32b25;
    bottom: 54px;
  }

  .final-page {
  	display: flex;
  	justify-content: center;
  	align-items: center;
  	flex-grow: 1;
  }



  .final-page .section {
  	flex-basis: 50%;
  	padding: 2rem;
  }

  img {
  	max-width: 100%;
  }

  .facebook-share {
  	text-decoration: none;
  	background: black;
  	color: white;
  	font-weight: bold;
  	font-size: 1rem;
  	padding: 1rem 2rem;
  	box-shadow: 2px 2px 1px rgba(0,0,0,0.5);
  	margin-top: 2rem;
  	display: inline-block;
  }

</style>