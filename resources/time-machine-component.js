// SOLVED: try to avoid calling for methods inside other methods
// SOLVED: use input/output model instead of watchers
// TODO: change names and write docs

window.TimeMachineComponent = Vue.component('time-machine', {
    mixins: [window.dataFetchMixin],
    data: () => ({
        date: '',
        wbsAuthor: '',
        month: '',
        year: '',
        selected: 'warm-liger-47', // default value
        options: [],
        maxWebstrates: '',
        dt: [],
    }),
    template: `
    <div>
    <br>
    <br>
    <br>
    <d3-timeline
       v-bind:data="dt"
       width="100%"
       height="300px">
   </d3-timeline>
    <select v-model="selected">
          <option v-for="option in options" v-bind:value="option">
               {{ option }}
          </option>
        </select>

</div>
  `,
    components: {
        'd3-timeline': window.d3Timeline
    },
    watch: {
        selected: function(newValue, oldValue) {
            console.dir("Initial State Watch in time-machine-component.js")
            this.fetchAll(newValue)
        },
    },
    async created() {
        this.options = await this.fetchActivityTimeline()
    },
    methods: {
        // SOLVED: divide into several sections
        // TODO: put into mixins
        fetchActivity: function(webstrateIdInst) {

            const toDate = new Date()
            const fromDate = new Date()
            fromDate.setDate(fromDate.getDate() - 30)

            return activityPromise = dataFetcher('activities', {
                webstrateId: webstrateIdInst,
                toDate,
                fromDate
            })
        },
        // INFO: used for building clientJoins/Leaves
        createDataObject: function(acitvityPromise) {
            
            return activityPromise.then((data) => {

                var intPerWs = []
                
                Object.values(data).forEach(int => {
                    Object.values(int).forEach(intN => {
                        intPerWs.push(intN)
                    })
                })

                return intPerWs.map(int => ({
                    at: new Date(int.timestamp),
                    title: Math.random().toString(),
                    group: int.type,
                    className: (int.type === "clientPart") ? 'entry--point--warn' : 'entry--point--info',
                    symbol: (int.type === "clientPart") ? 'symbolDiamond' : 'symbolSquare',
                    link: 0,
                    webstrateId: this.selected
                }))
            })
        },
        fetchAndCreateData: async function(webstrateId){
            var activityPromiceInst = await this.fetchActivity(webstrateId)
            return this.createDataObject(activityPromiceInst)
        },

        getOpsJson: async function(input) {
            return fetch("https://webstrates.cs.au.dk/" + input + "/?ops")
                .then(html => html.json())
                .then(body => {
                    return body
                })
        },

        // INFO: used for mapping opsp log
        createDataObject2: function(promise) {
            
            var versioningRaw = promise
            
            // INFO: if session exists, checking for author of webstrate
            this.wbsAuthor = (typeof versioningRaw[0].session !== "undefined") ?
                (typeof versioningRaw[0].session.userId === "undefined") ? "unknown" :  versioningRaw[0].session.userId
            : "unknown"

            return versioningRaw.map(int => ({
                at: new Date(int.m.ts),
                title: int.v,
                group: (Object.keys(int).indexOf('create') !== -1) ? 'create' : 'edition',
                className: (Object.keys(int).indexOf('create') !== -1) ? 'entry--point--success' : 'entry--point--default',
                symbol: (Object.keys(int).indexOf('create') !== -1) ? 'symbolCross' : 'symbolTriangle',
                link: int.v,
                webstrateId: this.selected
            }))
        }, 

        // TODO: divide and into mixins
        getVersioningJson: async function(webstrateId) {
            var fetchOpsPromise = await this.getOpsJson(webstrateId)
            return this.createDataObject2(fetchOpsPromise)
        },
       
        fetchAll: async function(webstrateId) {
            
            this.dt.length = 0 // INFO: in order to avoid stacking
            var dt1 = await this.fetchAndCreateData(webstrateId)
            var dt2 = await this.getVersioningJson(webstrateId)
            this.dt = this.dt.concat(dt1, dt2)
            
        }
    },
    async mounted() {
        this.selected = this.$parent.relationName
    },
});
