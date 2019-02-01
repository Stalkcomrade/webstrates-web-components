// SOLVED: import timeline in a different file
// SOLVED: mixing for fetched data
// SOLVED: make a simple interface for selections
// SOLVED: make watchers for selections
//// SOLVED: fetch htmls on update
//// INFO: don't need them, v-model brings this functionality

window.TimelineComponent = Vue.component('timeline', {
    mixins: [window.dataFetchMixin, window.dataObjectsCreator],
    components: {
        'd3-timeline': window.d3Timeline,
    },
    data: () => ({
        // sessionObject: {}, // INFO: use value from store instead
        selected: 'hungry-cat-75', // INFO: initial value
        options: [],
        dt: [],
        sessionGrouped: '',
        versioningParsed: "",
    }),
    template: `

<b-container class="container-fluid">

<br>
<br>

  <b-row>
    <d3-timeline
      v-bind:data="dt"
      width="100%"
      height="300px">
    </d3-timeline>
  </b-row>

<br>
<br>

 <b-row>
        <select v-model="selected">
          <option v-for="option in options" v-bind:value="option">
               {{ option }}
          </option>
        </select>
  </b-row>

</b-container>
  `,
    computed: {
        sessionObjectComp(){
            return this.sessionObject
        }
    },
    // SOLVED: get rid of some of the watchers
    watch: {
        selected: async function() {

            store.commit("changeCurrentWebstrateId", this.selected)
            
            let versioningParsed = await this.getOpsJsonMixin(this.selected)
            let sessionGrouped = await this.processData(versioningParsed)
            this.dt = await this.createDataObject(sessionGrouped)
            console.dir("Updated in timeline-component")
        }
    },
    created: async function() {
        var DaysPromise = await this.fetchDaysOverview((new Date))
        this.options = this.listOfWebstrates(DaysPromise)
    },
    methods: {
        processData: function(versioningParsed) {

            // TODO: put into mixins later
            var sessionObject = versioningParsed.map(element => ({
                timestamp: element.m.ts,
                version: element.v,
                sessionId: (Object.keys(element).indexOf("session") !== -1) ? element.session.sessionId : 0,
                connectTime: (Object.keys(element).indexOf("session") !== -1) ? element.session.connectTime : 0,
                userId: (Object.keys(element).indexOf("session") !== -1) ? element.session.userId : 0
            }))

            // INFO: filtering non-sessions
            sessionObject = Object.keys(sessionObject).map(key => sessionObject[key])
                .filter(element => (element.sessionId !== 0))

            store.commit("changeCurrentSessionObject", sessionObject)

            // making Set to identify unique session and max/min
            var sessionGrouped = _.chain(sessionObject)
                .groupBy("sessionId")
                .map(session => ({
                    "sessionId": session[0]['sessionId'],
                    "connectTime": session[0]['connectTime'],
                    "maxConnectTime": _.maxBy(session, "timestamp")['timestamp'],
                    "minConnectTime": _.minBy(session, "timestamp")['timestamp'],
                    "maxVersion": _.maxBy(session, "timestamp")['version'],
                    "minVersion": _.minBy(session, "timestamp")['version']
                })).value()

            console.dir('Data is Processed Successfully')
            return sessionGrouped
        },
        createDataObject: function(sessionGrouped) { // INFO: updating vue vis component
            
            return sessionGrouped.map(int => ({
                from: new Date(int.minConnectTime),
                to: new Date(int.maxConnectTime),
                title: "new",
                label: "new",
                group: 'edition',
                className: 'entry--point--default'
            }))
            
            console.dir('Data Object is Created Successfully')
        },
    },
    async mounted() {

        // console.dir(this.fetchRangeOfTags("wicked-wombat-56"))
        
        let versioningParsed = await this.getOpsJsonMixin(this.selected)
        let sessionGrouped = await this.processData(versioningParsed)
        this.dt = await this.createDataObject(sessionGrouped)
    },
});
