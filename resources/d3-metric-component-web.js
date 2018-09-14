window.d3MetricComponent = Vue.component('d3Metric', (resolve) => {
  import(/* webpackChunkName: "d3Metric" */ '../node_modules/d3-vs/src/components/d3Metric/d3Metric.vue')
    .then((d3Metric) => {
      resolve(d3Metric.default)
    })
  // () => import(/* webpackChunkName: "d3Metric" */ '../node_modules/d3-vs/src/components/d3Metric/d3Metric.vue')
  // require(['../node_modules/d3-vs/src/components/d3Metric/d3Metric.vue'], resolve)
  
})

// Vue.component('d3Metric', (resolve) => {
//   // require(['../node_modules/d3-vs/src/components/d3Metric/d3Metric.vue'], resolve)
// }).then((resolve) => {


//   window.d3InstanceComponent = Vue.component('d3Instance', {
//     template: `

//   <d3-metric
//       :data=4000
//       width="100%"
//       height="300px">
//    </d3-metric>

// `,
//   components: {
//     'd3MetricComponent': d3Metric
//   }

//     // components: {
//   //   // d3Metric: () => import('../node_modules/d3-vs/src/components/d3Metric/index.js')
//   //   // d3Metric: () => import('../node_modules/d3-vs/src/components/d3Metric/d3Metric.vue')
//   // }


//   })
 

// // })





// })

// import(/* webpackChunkName: "d3Metric" */ '../node_modules/d3-vs/src/components/d3Metric/d3Metric.vue')
//     .then((d3Metric) => {
//       resolve(d3Metric.default)
//     })
