webstrate.on("loaded", function() {

  console.dir("!!!!");

Vue.component('d3Metric', (resolve) => {
    import(/* webpackChunkName: "d3Metric" */ '../node_modules/d3-vs/src/components/d3Metric/d3Metric.vue')
      .then((d3Metric) => {
        console.dir(d3Metric.default.template);
        console.dir(d3Metric.default)
        resolve(d3Metric.default);
        // console.dir(d3Metric.default);
      });
  });
  
  console.dir("!!!!");

});

// window.d3InstanceComponent = Vue.component('d3Instance', {
//     template: `
// <div> HLLO 
//   <d3-metric
//       :data=4000
//       width="100%"
//       height="300px">
//   </d3-metric>
// </div>
// `,

//     components: {
//       'd3-metric': d3MetricComponent
//     }
  
  // components: {
  //   'd3-metric': () => import('../node_modules/d3-vs/src/components/d3Metric/d3Metric.vue').then(({{ d3Metric }}))

  // }



// Vue.component('d3Metric', (resolve) => {
//   import(/* webpackChunkName: "d3Metric" */ '../node_modules/d3-vs/src/components/d3Metric/d3Metric.vue')
//     .then((d3Metric) => {
//       console.log(d3Metric.default.template)
//       resolve(d3Metric.default)
//     })
//   // () => import(/* webpackChunkName: "d3Metric" */ '../node_modules/d3-vs/src/components/d3Metric/d3Metric.vue')
//   // require(['../node_modules/d3-vs/src/components/d3Metric/d3Metric.vue'], resolve)
// })
// window.d3MetricComponent = Vue.component('d3Metric', function(resolve) {
//   setTimeout(() => {
//     require(['../node_modules/d3-vs/src/components/d3Metric/d3Metric.vue'], resolve)
//     console.log('resolved!')
//   }, 5000)  
// })
// Vue.component('d3Metric', () => import(/* webpackChunkName: "d3Metric" */ '../node_modules/d3-vs')
//               .then(({{ d3Metric }}  => d3Metric)))
//   window.d3InstanceComponent = Vue.component('d3Instance', {
//     template: `
//     // components: {
//   //   // d3Metric: () => import('../node_modules/d3-vs/src/components/d3Metric/index.js')
//   //   // d3Metric: () => import('../node_modules/d3-vs/src/components/d3Metric/d3Metric.vue')
//   // }
//   })
// // })
// })
