// const d3Metric = () => import('../node_modules/d3-vs/src/components/d3Metric/d3Metric.vue')
// const d3Metric = () => import('../node_modules/d3-vs/src/components/d3Metric/d3Metric.js')

import Vs from 'd3-vs'


webstrate.on('loaded', (Vs) => {

  // console.dir(d3Metric)

    Vue.config.ignoredElements = ['transient'];

    // Create container and instantiate template.
    const containerElement = document.createElement('transient');
    containerElement.setAttribute('id', 'container');
    const appTemplate = document.querySelector('#appTemplate');
    containerElement.appendChild(appTemplate.content.cloneNode(true));
    document.body.appendChild(containerElement);


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
                path: '/dt',
                component: d3InstanceComponent
            },

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

  app.use(Vs)

});
