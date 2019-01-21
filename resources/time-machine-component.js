// SOLVED: try to avoid calling for methods inside other methods
// SOLVED: use input/output model instead of watchers
// TODO: change names and write docs

window.TimeMachineComponent = Vue.component('time-machine', {
    mixins: [window.dataFetchMixin],
    components: {
        'd3-timeline': window.d3Timeline,
    },
    data: () => ({
        wbsAuthor: '',
        slc: '',
        selected: 'warm-liger-47', // default value
        options: [],
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
       height="300px"
       @range-updated="(dateTimeStart, dateTimeEnd) => testSelectRangeMethod(dateTimeStart, dateTimeEnd)">
   </d3-timeline>
    <select v-model="selected">
          <option v-for="option in options" v-bind:value="option">
               {{ option }}
          </option>
        </select>

</div>
  `,
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
        testSelectRangeMethod: function(dateTimeStart, dateTimeEnd) {

            var filtered = this.slc.filter(object => {
                // return object.values.some((el) => { // filters objects without this date
                    return object.at > dateTimeStart  &&
                        object.at < dateTimeEnd
                // })
            })

            console.dir(filtered)
            console.dir(dateTimeStart)
            console.dir(dateTimeEnd)
            
        },
        // INFO: used for building clientJoins/Leaves
        createDataObject: function(activityPromise) {

            var data = activityPromise

                var intPerWs = []
                
                Object.values(data).forEach(int => {
                    Object.values(int).forEach(intN => {
                        intPerWs.push(intN)
                    })
                })

            
            console.dir(intPerWs)
            
                return intPerWs.map(int => ({
                    at: new Date(int.timestamp),
                    title: Math.random().toString(),
                    group: int.userId,
                    className: (int.type === "clientPart") ? 'entry--point--warn' : 'entry--point--info',
                    symbol: (int.type === "clientPart") ? 'symbolDiamond' : 'symbolSquare',
                    link: 0,
                    webstrateId: this.selected
                }))

           
            
        },
        fetchAndCreateData: async function(webstrateId){
            var activityPromiceInst = await this.fetchActivityMixin(webstrateId)
            return this.createDataObject(activityPromiceInst)
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
            var fetchOpsPromise = await this.getOpsJsonMixin(webstrateId)
            return this.createDataObject2(fetchOpsPromise)
        },
       
        fetchAll: async function(webstrateId) {
            
            this.dt.length = 0 // INFO: in order to avoid stacking
            var dt1 = await this.fetchAndCreateData(webstrateId)
            this.slc = dt1 // INFO: use for range updates
            
            var dt2 = await this.getVersioningJson(webstrateId)
            this.dt = this.dt.concat(dt1, dt2)
            
        }
    },
    async mounted() {
        this.selected = this.$parent.relationName
    },
});
