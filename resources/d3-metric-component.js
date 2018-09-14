window.d3InstanceComponent = Vue.component('d3Instance', {
    template: `
<div> HLLO 
  <d3-metric
      :data=4000
      width="100%"
      height="300px">
  </d3-metric>
</div>
`,
  // components: {
  //   'd3-metric': d3Metric
    // 'd3-metric': () => import('../node_modules/d3-vs')
    //   .then(({ d3Metric }) => d3Metric.default)

    // 'd3-metric': () => import('../node_modules/d3-vs/src/components/d3Metric/d3Metric.vue')
    //   .then(({ d3Metric }) => d3Metric)

//  },
  // components: {
  //   'd3MetricComponent': import(/* webpackChunkName: "d3Metric" */ '../node_modules/d3-vs/src/components/d3Metric/d3Metric.vue')
  // }

    // components: {
  //   // d3Metric: () => import('../node_modules/d3-vs/src/components/d3Metric/index.js')
  //   // d3Metric: () => import('../node_modules/d3-vs/src/components/d3Metric/d3Metric.vue')
  // }


  })
 

// })
