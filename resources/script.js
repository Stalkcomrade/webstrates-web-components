Vue.config.devtools = true;
webstrate.on('loaded', () => {

    Vue.config.devtools = true;
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
                path: '/small-multiples',
                component: smallMultiplesComponent
            },
            {
                path: '/small-multiples-d3',
                component: smallMultiplesD3Component
            },
            {
                path: '/small-multiples-global',
                component: smallMultiplesGlobalComponent
            },
            {
                path: '/time-machine',
                component: TimeMachineComponent
            },
            {
                path: '/timeline',
                component: TimelineComponent
            },
            {
                path: '/dom-tree-d3',
                component: DomTreeD3Component
            },
            {
                path: '/dom-tree-d3-vue',
                component: DomTreeD3VueComponent
            },
            {
                path: '/css-test',
                component: CssTestComponent
            },
            {
                path: '/embedded',
                component: Embedded
            },
            {
                path: '/session-inspector',
                component: SessionInspectorComponent
            },
            {
                path: '/transclusion1',
                component: transclusionComponent,
                props: true
            },
            {
                path: '/recent',
                component: recentComponent
            },
            {
                path: '/transclude-webstrate-component',
                component: transcludeWebstrateComponent
            },
            {
                path: '/transclude-and-read-dom',
                component: transcludeAndReadDom
            },
            {
                path: '/cs-vs-ift-patching',
                component: csVsIftPatching
            },
            {
                path: '/layout-grid-component',
                component: layoutGridComponent
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

    const store = window.store
    const mapState = window.Vuex.mapState

    Vue.use(Vuex);
    Vue.use(window.LayoutGrid, {
        store
    });


    // Create Vue application and mount in container.
    const app = new Vue({
        router,
        store
    }).$mount(containerElement)

    window.app = app
    window.__VUE_DEVTOOLS_GLOBAL_HOOK__.Vue = app.constructor;

});