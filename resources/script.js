// const d3Metric = () => import('../node_modules/d3-vs/src/components/d3Metric/d3Metric.vue')
// const d3Metric = () => import('../node_modules/d3-vs/src/components/d3Metric/d3Metric.js')
// import Vs from 'd3-vs'
// import { isNull, isNumber, debounce} from 'lodash';
// import { showTip, hideTip } from 'tooltip';

// import { debounce } from 'lodash';

webstrate.on('loaded', () => {
    

//   const d3Metric = () => import(/* webpackPreload: true */ '../node_modules/d3-vs/src/components/d3Metric/d3Metric.vue')
  // console.dir(d3Metric)
    Vue.config.ignoredElements = ['transient'];
    // Create container and instantiate template.
    const containerElement = document.createElement('transient');
    containerElement.setAttribute('id', 'container');
    const appTemplate = document.querySelector('#appTemplate');
    containerElement.appendChild(appTemplate.content.cloneNode(true));
    document.body.appendChild(containerElement);
    
    console.dir("!!!!");

    // Vue.component('d3Metric', (resolve) => {
    //     // import(/* webpackChunkName: "d3Metric" */ '../node_modules/d3-vs/src/components/d3Metric/d3Metric.vue')
    //     import(/* webpackChunkName: "d3Metric" */ 'keen-ui')
    //     .then(( {UiAlert }) => {
    //         console.dir("smth");
    //         console.dir(UiAlert);
    //         console.dir(UiAlert.default);
    //         resolve(UiAlert.default);
    //         // console.dir(d3Metric.default);
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
  
  console.dir("!!!!");


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
            // {
            //     path: '/dt',
            //     component: d3InstanceComponent
            // },

                 // {
                 //   path: '/dt',
                 //   component: d3InstanceComponent
                 //   // component: {
                 //     // d3Metric: () => import('../node_modules/d3-vs/src/components/d3Metric/index.js')
                 //     // d3Metric: () => import('../node_modules/d3-vs/src/components/d3Metric/d3Metric.vue')
                 //   // }
                 //   // component: () => import('../node_modules/d3-vs/src/components/d3Metric/d3Metric.vue')
                 // },

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
