// SOLVED: import timeline in a different file
// SOLVED: mixing for fetched data
// SOLVED: make a simple interface for selections
// SOLVED: make watchers for selections
//// SOLVED: fetch htmls on update
// TODO: try use realtime component instead
//// INFO: don't need them, v-model brings this functionality

window.TimelineComponent = Vue.component('timeline', {
    mixins: [window.dataFetchMixin],
    props: ["htmlForParent"],
    data: () => ({
        date: '',
        month: '',
        year: '',
        selected: 'hungry-cat-75', // INFO: initial value
        valueSlider: [1, 3],
        sliderOptions: { // INFO: used by vue-slider component
            data: '',
            min: 0,
            max: 100
        },
        sessionTimeline: '',
        maxWebstrates: '',
        test: [],
        waitData: [],
        dt: [],
        versioningRaw: '',
        htmlData: "",
        sessionGrouped: '',
        versioningParsed: "",
        intermSession: "",
        wsId: ''
    }),
    // SOLVED: try range mode
    template: `


<b-container class="container-fluid">

<vue-slider v-model="valueSlider" ref="slider" 
              :options="sliderOptions" :piecewise="true" :interval="2"
              :min="sliderOptions.min" :max="sliderOptions.max"> 
</vue-slider>

  <b-row>
<select v-model="selected" @change="getOpsJsonTimeline()">
          <option v-for="option in selectOptions" :value="option">
               {{ option }}
          </option>
        </select>
  </b-row>

  <b-row>
   <div>

   </div>
  </b-row>

<br>
<br>
<br>
<br>
<br>

<b-row>
<d3-timeline
        v-bind:data="dt"
        width="100%"
        height="300px">
      </d3-timeline>
  </b-row>
</b-container>
  `,
    components: {
        'd3-timeline': window.d3Timeline,
        'vue-slider': window.vueSlider
    },
    // TODO: get rid of some of the watchers
    watch: {
        versioningParsed() {
            this.processData()
        },
        sessionGrouped() {
            this.createDataObject()
        },
        valueSlider() {
            console.dir("Inside value slider")
            this.getHtmlsPerSession()
        },
        selected() {
            this.$emit('update', this.getHtmlsPerSession())
            console.dir("Updated in timeline-component")
        }
    },
    beforeCreate: function() {},
    created: function() {
        this.waitData = this.fetchActivityTimeline()
    },
    methods: {
        processData: function() {

            // TODO: put into mixins later
            var sessionObject = this.versioningParsed.map(element => ({
                timestamp: element.m.ts,
                version: element.v,
                sessionId: (Object.keys(element).indexOf("session") !== -1) ? element.session.sessionId : 0,
                connectTime: (Object.keys(element).indexOf("session") !== -1) ? element.session.connectTime : 0,
                userId: (Object.keys(element).indexOf("session") !== -1) ? element.session.userId : 0
            }))

            // INFO: filtering non-sessions
            sessionObject = Object.keys(sessionObject).map(key => sessionObject[key]).filter(element => (element.sessionId !== 0))

            // this.sliderOptions.data = sessionObject.map(el => el.sessionId)

            var counter = 0,
                sessionIds = []

            sessionObject.forEach((el, index) => {
                counter = counter + 1
                sessionIds.push(counter)
            })

            this.sliderOptions.data = sessionIds
            
            // console.dir("Look here!")
            // console.dir(this.sliderOptions.data[0])
            // console.dir(this.sliderOptions.data[this.sliderOptions.data.length - 1])
            // this.sliderOptions.data[0]
            
            this.sliderOptions.min = this.sliderOptions.data[0]
            this.sliderOptions.max = this.sliderOptions.data[this.sliderOptions.data.length - 1]
            
            // this.valueSlider = this.sliderOptions.data[0]

            // making Set to identify unique session and max/min
            this.sessionGrouped = _.chain(sessionObject)
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
        },
        // INFO: motivation for this method is to return fetched into
        // component data 
        getOpsJsonTimeline: async function() {
            this.versioningParsed = await this.getOpsJsonMixin(this.selected)
        },
        createDataObject: function() { // INFO: updating vue vis component
            this.dt = this.sessionGrouped.map(int => ({
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
        this.getOpsJsonTimeline()
        // this.intermSession = await this.getHtmlsPerSession()
    },
    updated() {
        // INFO: every time vis is updated, I am translating html objects to parent
        // FIXME: use different mechanism in the future
        // this.$emit('update', this.getHtmlsPerSession())
        // console.dir("Updated in timeline-component")
        // console.dir(this.valueSlider)
    }
});
