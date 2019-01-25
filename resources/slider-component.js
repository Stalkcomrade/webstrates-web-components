window.slider = new Vue.component('slider', {
    components: {
        'vue-slider': window.vueSlider
    },
    props: ["sliderOptions", "sliderOptions.min", "sliderOptions.max"],
    template: `

  <vue-slider v-model="valueSlider" 
              ref="slider" 
              :options="sliderOptions" :piecewise="true" :interval="2"
              :min="sliderOptions.min" :max="sliderOptions.max"> 
  </vue-slider>
`


})
