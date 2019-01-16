window.RealtimeComponent = Vue.component('realtime', {
    mixins: [window.dataFetchMixin],
    props: {
        monthProp: '9',
        yearProp: '2018',
        maxWebstratesProp: '20'
    },
    data: () => ({
        date: '',
        month: '',
        year: '',
        maxWebstrates: '',
        intPerWs: [],
        dt: [],
        versioningRaw: '',
        versioningArray: []
    }),

    template: `
       <div>

              <d3-timeline
                     v-bind:data="dt"
                     width="100%"
                     height="300px">
             </d3-timeline>

       </div>

  `,
    // <pre>{{ this.versioningArray }}</pre>
    components: {
        'd3-timeline': window.d3Timeline
    },

    created: async function() {
        this.getVersioningJson()
    },

    methods: {
        // TODO: remove with one in mixin
        // TODO: input/output
        getVersioningJson: async function() {
            
            this.versioningRaw = await this.getOpsJsonMixin("black-frog-24")

            this.dt = this.versioningRaw.map(event => ({
                at: new Date(event.m.ts),
                title: event.v,
                group: (Object.keys(event).indexOf('create') !== -1) ? 'create' : 'edit',
                className: (Object.keys(event).indexOf('create') !== -1) ? 'entry--point--success' : 'entry--point--default',
                symbol: (Object.keys(event).indexOf('create') !== -1) ? 'symbolCross' : 'symbolTriangle',
                link: event.v
            }))
        },
        },
    mounted() {}
});
