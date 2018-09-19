// const d3Metric = () => import('../node_modules/d3-vs/src/components/d3Metric/d3Metric.vue')
// import Vs from 'd3-vs';


webstrate.on('loaded', () => {

    Vue.config.ignoredElements = ['transient'];
    // Create container and instantiate template.
    const containerElement = document.createElement('transient');
    containerElement.setAttribute('id', 'container');
    const appTemplate = document.querySelector('#appTemplate');
    containerElement.appendChild(appTemplate.content.cloneNode(true));
    document.body.appendChild(containerElement);
    

  console.dir(window.d3InstanceComponent)
  console.dir(window.d3InstanceTimelineComponent)
  
    // Vue.component('d3Metric', (resolve) => {
    //   import(/* webpackChunkName: "d3Metric" */ '../node_modules/d3-vs/src/components/d3Metric/d3Metric.vue')
    //   // import(/* webpackChunkName: "d3Metric" */ '../node_modules/d3-vs')
    //     // .then(( { d3Metric }) => {
    //     //   console.dir("smth");
    //     //   resolve(d3Metric.default);
    //     });
        // import(/* webpackChunkName: "d3Metric" */ 'd3-vs')
        // .then(( {d3Metric }) => {
        //     console.dir("smth");
        //     console.dir(d3Metric.default.template);
        //     console.dir(d3Metric.default);
        //     resolve(d3Metric.default);
        //     // console.dir(d3Metric.default);
        // });
    // });
 
    // Define Vue Router.
    const router = new VueRouter({
        routes: [{
                path: '/',
                component: OverviewComponent
            },
            {
                path: '/calendar',
                component: CalendarView
            },
            {
                path: '/real-time',
              component: RealtimeComponent
            },
            {
                path: '*',
                component: {
                    template: '#template-page-not-found '
                }
            }
        ],
        linkExactActiveClass: 'active'
    });


    // Create Vue application and mount in container.
    const app = new Vue({
        router
    }).$mount(containerElement)

  // app.use(Vs)

});
