// import {
//     d3Metric
// } from '../node_modules/d3-vs';
// var d3Metric = require("/home/stlk/Downloads/node_modules/d3-vs/src/components/d3Metric")

// window.d3Metric = d3Metric

window.OverviewComponent = Vue.component('overview', {
    // :margin="margin"
    // :data=40000
    // :options="{ axisLabelFontSize: 100 }"
    template: `
  <d3-metric
  v-bind:data="counter"
  width="100%"
  height="600px"> 
  </d3-metric>
  `,
    components: {
        'd3-metric': window.d3Metric
    },
    data: () => ({
        counter: '35000'
    }),

    mounted() {
        this.counter = 45000
    }

});