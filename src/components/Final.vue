<template>
	<div class="page-container final-wrapper" v-if="robor">
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
				<a class="facebook-share" @click="shareFb" href="#">Distribuie pe Facebook</a>
			</div>
			<div class="section">
        <div class="img-wrapper">
          <img :src="cumparat.img">
          <div class="object-price">{{parseInt(robor.totalCuPSD - robor.totalFaraPSD)}} lei</div>
        </div>
				<h2 style="color: white">{{cumparat.nume}}</h2>
			</div>

      <button ref="navigation" class="btn-navigation not-shown" @click='changeChart'> < </button>

		</div>
	</div>
</template>

<script>
export default {


  props: {
  	robor: null,
    showFinal: false,
  },

  created(){
  	// console.log(this.robor)
  	this.calculeazaProcente()
  },

  methods: {
  	calculeazaProcente(){
  		let platitInPlus = this.robor.totalCuPSD - this.robor.totalFaraPSD
  		let total = this.robor.totalCuPSD
  		let procentaj  = (platitInPlus * 100)/total 
      this.calculeazaCumparat(platitInPlus)
  		return parseInt(procentaj)
  	},

    changeChart(){
      this.$emit('update:showFinal', false)
    },

    calculeazaCumparat(total) {
      // console.log(total);
      if(total < 300) {
        this.cumparat.img = "/static/casti.jpg"
        this.cumparat.nume = "Casti wireless cu bluetooth"
      } else if(total > 300 && total < 700) {
        this.cumparat.img = "/static/imprimanta.jpg"
        this.cumparat.nume = "Imprimanta"
      } else if(total > 700 && total < 1300) {
        this.cumparat.img = "/static/tableta.jpg"
        this.cumparat.nume = "Tableta ~10inch"
      } else if(total > 1300 && total < 1700) {
        this.cumparat.img = "/static/tv.jpg"
        this.cumparat.nume = "Televizor cu diagonala de ~100cm"
      } else if(total > 1700 && total < 2300) {
        this.cumparat.img = "/static/camera.jpg"
        this.cumparat.nume = "Camera GoPro de ultima generatie"
      }  else if(total > 2300) {
        this.cumparat.img = "/static/vacanta.jpg"
        this.cumparat.nume = "cel puin o vacanta în Tenerife"
      }
    },

    shareFb(){
    let sharePage = this.cumparat.img.split('.')[0] + '.html'
    let imageUrl = window.location
          window.open('http://www.facebook.com/sharer.php?m2w&u=' + encodeURIComponent(imageUrl + sharePage), 'sharer', 'toolbar=0,status=0,width=626,height=436');
            return false;
    },
  },

  data () {
    return {
    	procent: null,
      cumparat: {
        img: null,
        nume: null,
      }
    }
  },

  watch: {
    showFinal: {
      handler(val) {
        if(val === true) {
          setTimeout(() => {
                this.$nextTick(() => {
                  this.$refs.navigation.classList.remove('not-shown')
                });
          },900) 
        } else {
          this.$refs.navigation.classList.add('not-shown')
        }
        
      },
    }
  },

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
    /*bottom: 54px;*/
    height: initial;
    padding-left: 2rem;
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
    /*width: auto;*/

  }

  .img-wrapper {
    max-height: 400px;
    max-width: 400px;
    border-radius: 1rem;
    box-shadow: 1px 1px 6px #444;
    overflow: hidden;
    position: relative;
  }

  .object-price {
    position: absolute;
    top: 40px;
    left: -114px;
    width: 100%;
    background: #f2cb3e;
    color: black;
    font-weight: bold;
    font-size: 3rem;
    transform: rotate(-37deg);
    text-align: center;
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

  @media (max-width: 768px) {
      .object-price {
        font-size: 1.5rem;
      }
  }

  @media (min-width: 1222px) {
        .page-container {
            bottom: 54px;
        }
  }



</style>