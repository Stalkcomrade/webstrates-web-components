window.OverviewComponent = Vue.component('overview', {
    template: `

<div>


  <d3-metric
  :data="counter"
  width="100%"
  height="600px"> 
  </d3-metric>

<vue-slider v-model="value" ref="slider"> </vue-slider>

</div>
  `,
    components: {
        'd3-metric': window.d3Metric,
        'vue-slider': window.vueSlider,
        'context-menu-component': window.contextMenu
    },
    data: () => ({
        counter: '35000',
        value: 1
    }),

    mounted() {
        this.counter = 45000
    }

});
