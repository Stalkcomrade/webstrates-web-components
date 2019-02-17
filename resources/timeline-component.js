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
        'c-m-c': window.cmc
    },
    data: () => ({
        // sessionObject: {}, // INFO: use value from store instead
        // selected: 'hungry-cat-75', // INFO: initial value
        options: [],
        dt: [],
        sessionGrouped: '',
        versioningParsed: "",
    }),
    watch: {
        '$route'(to, from) {
            // this.$route.params.id,
            // console.log("Watched Route Change: ", this.$store.state.contextMenuContext)
            // this.selected = this.$store.state.contextMenuContext
            // console.log("Watched Route Change: ", this.$store.state.contextMenuContext)
        }
    },
    // beforeRouteEnter (to, from, next) {
    //       // console.log("Watched Route Change: ", this.$store.state.webstrateId)
    //       // this.selected = this.$store.state.contextMenuContext
    //       // console.log("Watched Route Change: ", this.$store.state.contextMenuContext)
    // },
    template: `

<b-container class="container-fluid" @contextmenu.prevent="$refs.ct.$refs.menu.open($event, $store.state.contextMenuObject)">

<br>
<br>

<c-m-c ref='ct'/>

  <b-row>
    <d3-timeline
      v-bind:data="dt"
      width="100%"
      height="300px"
      @range-updated="(dateTimeStart, dateTimeEnd) => testSelectRangeMethodSessions(dateTimeStart, dateTimeEnd)">
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
        selected: { // INFO: if contextMenuContext is "", then default
            get() {
                // return this.$store.state.obj.message
                return this.$store.state.contextMenuObject === '' ?
                    this.$store.state.webstrateId :
                    this.$store.state.contextMenuObject
            },
            set(value) {
                this.$store.commit('changeCurrentWebstrateId', value)
            }
        },
        sessionObjectComp() {
            return this.sessionObject
        }
    },
    // SOLVED: get rid of some of the watchers
    // TODO: keep data of the webstrate
    watch: {
        selected: async function() {

            this.$store.commit("changeCurrentWebstrateId", this.selected)

            let versioningParsed = await this.getOpsJsonMixin(this.selected)
            let sessionGrouped = await this.processData(versioningParsed)
            // this.sessionGrouped = sessionGrouped

            // this.

            this.dt = await this.createDataObject(sessionGrouped)
            console.dir("Updated in timeline-component")
        }
    },
    created: async function() {
            var DaysPromise = await this.fetchDaysOverview((new Date))
            this.options = this.listOfWebstrates(DaysPromise)
        },
        methods: {

            testSelectRangeMethodSessions: function(dateTimeStart, dateTimeEnd) {

                var session = this.sessionGrouped
                console.log("session = ", session);
                // console.log(this.data)

                var filtered = session.filter(object => {
                    // return object.values.some((el) => { // filters objects without this date
                    return object.connectTime > dateTimeStart &&
                        object.maxConnectTime < dateTimeEnd
                    // })
                })

                console.dir(filtered)
                this.$store.commit("changeSliderVersions", [filtered[0].minVersion, filtered[filtered.length - 1].maxVersion])
                console.log(this.$store.state.sliderVersions)

                console.log("selected timeline:", this.$store.state.webstrateId)

                this.$refs.ct.$refs.menu.open(this.$event, this.$store.state.contextMenuObject)


            },

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

                console.log("sessionObject = ", sessionObject);

                this.$store.commit("changeCurrentSessionObject", sessionObject)

                // making Set to identify unique session and max/min
                var sessionGrouped = _.chain(sessionObject)
                    .groupBy("sessionId")
                    .map(session => ({
                        "sessionId": session[0]['sessionId'],
                        "connectTime": session[0]['connectTime'],
                        "users": [...new Set(_.map(session, "userId"))],
                        "maxConnectTime": _.maxBy(session, "timestamp")['timestamp'],
                        "minConnectTime": _.minBy(session, "timestamp")['timestamp'],
                        "maxVersion": _.maxBy(session, "timestamp")['version'],
                        "minVersion": _.minBy(session, "timestamp")['version']
                    })).value()

                console.log("sessionGrouped = ", sessionGrouped);
                console.dir('Data is Processed Successfully, session-grouped:', sessionGrouped)

                this.sessionGrouped = sessionGrouped
                return sessionGrouped
            },
            createDataObject: function(sessionGrouped) { // INFO: updating vue vis component

                return sessionGrouped.map(int => ({
                    from: new Date(int.minConnectTime),
                    to: new Date(int.maxConnectTime),
                    title: int.sessionId,
                    label: int.users,
                    group: int.users,
                    className: 'entry--point--default'
                }))

                console.dir('Data Object is Created Successfully: ', sessionGrouped)
            },
        },
        async mounted() {

                // console.dir(this.fetchRangeOfTags("wicked-wombat-56"))

                let versioningParsed = await this.getOpsJsonMixin(this.selected)
                let sessionGrouped = await this.processData(versioningParsed)
                this.dt = await this.createDataObject(sessionGrouped)

                // window.self = this
                // self = this
                // console.log("this.$refs.ct.$refs.menu = ", this.$refs.ct.$refs.menu);

                // this.$watch(
                //     (vm) => (vm.dt, Date.now()), val => {
                //         console.dir("WATCHER!!!")
                //         // window.self.$refs.ct.$event
                //         setTimeout(function () {
                //             console.log("WIND S: ", window.self.$refs.ct.$refs.menu)
                //             console.log("window.self.refs = ", window.self.$refs.ct);
                //         console.log("window.self.even = ", window.self.$event);
                //             d3.selectAll("path.entry--point--default")
                //                 .on("click", () => {
                //                     console.log("TEEEEEEEEEEEEE")
                //                     console.log(this.$refs.ct.$refs.menu)
                //                 })
                //                 .on("contextmenu", function() {
                //                     d3.event.preventDefault();
                //                     window.self.$refs.ct.$refs.menu.open(window.self.$event, "1")
                //                     console.log("TEEEEEEEEEEEEE")
                //                 })
                //         }, 4000)
                //         // Executes if YY, YY, or Y have changed.
                //     }, {immediate: true}
                // )

            },
            update() {


            }
});