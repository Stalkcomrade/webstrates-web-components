// SOLVED: import timeline in a different file
// SOLVED: mixing for fetched data
// SOLVED: make a simple interface for selections
// SOLVED: make watchers for selections
//// SOLVED: fetch htmls on update
//// INFO: don't need them, v-model brings this functionality

window.TimelineComponent = Vue.component('timeline', {
    mixins: [window.dataFetchMixin, window.dataObjectsCreator],
    props: ["htmlForParent"],
    components: {
        'd3-timeline': window.d3Timeline,
        'sliderConfigured': window.slider,
    },
    data: () => ({
        selected: 'hungry-cat-75', // INFO: initial value
        // sessionObject: {}, // INFO: use value from store instead
        options: [],
        dt: [],
        sessionGrouped: '',
        versioningParsed: "",
    }),
    // :sessionObject='sessionObjectComp'
    template: `

<b-container class="container-fluid">

<vue-slider-configured
           :webstrateId='selected'
>
  </vue-slider-configured>

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
        // valueSlider() {
        //     console.dir("Inside value slider")
        //     this.getHtmlsPerSessionMixin(this.selected,
        //                                  this.valueSlider[0], this.valueSlider[1],
        //                                  false)
        // },
        selected: async function() {
            // INFO: why emit?
            // this.$emit('update', this.getHtmlsPerSessionMixin(this.selected, undefined, undefined, true))
            
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

            // this.sessionObject = sessionObject // INFO: used to transfer data to slider
            store.commit("changeCurrentSessionObject", sessionObject)

            // var counter = 0,
            //     sessionIds = []

            // sessionObject.forEach((el, index) => {
            //     counter = counter + 1
            //     sessionIds.push(counter)
            // })
            

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

        console.dir(this.fetchRangeOfTags("wicked-wombat-56"))
        
        let versioningParsed = await this.getOpsJsonMixin(this.selected)
        let sessionGrouped = await this.processData(versioningParsed)
        this.dt = await this.createDataObject(sessionGrouped)
    },
});
