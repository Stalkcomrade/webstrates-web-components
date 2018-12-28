// SOLVED: import timeline in a different file
// SOLVED: mixing for fetched data

window.TimelineComponent = Vue.component('timeline', {
    mixins: [window.dataFetchMixin],
    data: () => ({
        date: '',
        month: '',
        year: '',
        selected: '',
        options: [],
        maxWebstrates: '',
        test: [],
        waitData: [],
        dt: [],
        versioningRaw: '',
        htmlData: "",
        sessionGrouped: '',
        options: '',
        versioningParsed: "",
        intermSession: "",
        wsId: ''
    }),
    // TODO: make a simple interface for selections
    template: `
      <d3-timeline
          v-bind:data="dt"
        width="100%"
        height="300px">
      </d3-timeline>
  `,
    components: {
        'd3-timeline': window.d3Timeline
    },
    watch: {
        // TODO: make watchers for selections
        versioningParsed() {
            this.processData()
        },
        sessionGrouped() {
            this.createDataObject()
        }
    },
    beforeCreate: function() {},
    created: function() {
        this.waitData = this.fetchActivityTimeline()
    },
    methods: {
        processData: function() {
            var sessionObject = this.versioningParsed.map(element => ({
                timestamp: element.m.ts,
                version: element.v,
                sessionId: (Object.keys(element).indexOf("session") !== -1) ? element.session.sessionId : 0,
                connectTime: (Object.keys(element).indexOf("session") !== -1) ? element.session.connectTime : 0,
                userId: (Object.keys(element).indexOf("session") !== -1) ? element.session.userId : 0
            }))

            sessionObject = Object.keys(sessionObject).map(key => sessionObject[key]).filter(element => (element.sessionId !== 0))

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
        getHtmlsPerSession: async function() {

                // FIXME: transform into parameters
                this.wsId = this.selected
                // this.wsId = "hungry-cat-75"
                // this.wsId = "massive-skunk-85"

                // FIXME: transform into parameters
                let numberInitial = 2
                let numberLast = 177


                // let webpageInitial = await fetch("https://webstrates.cs.au.dk/hungry-cat-75/" + "10/")
                // let webpageInitial = await fetch("https://webstrates.cs.au.dk/wicked-wombat-56/" + "3000/?raw")
                let webpageInitial = await fetch("https://webstrates.cs.au.dk/" + this.wsId + "/" + numberInitial + "/?raw")
                let htmlResultInitial = await webpageInitial.text()

                let webpageInitialJson = await fetch("https://webstrates.cs.au.dk/" + this.wsId + "/" + numberInitial + "/?json")
                let htmlResultInitialJson = await webpageInitialJson.text()

                // let webpageLast = await fetch("https://webstrates.cs.au.dk/hungry-cat-75/" + "4000/")
                let webpageLast = await fetch("https://webstrates.cs.au.dk/" + this.wsId + "/" + numberLast + "/?raw")
                let htmlResultLast = await webpageLast.text()

                let webpageLastJson = await fetch("https://webstrates.cs.au.dk/" + this.wsId + "/" + numberLast + "/?json")
                let htmlResultLastJson = await webpageLastJson.text()


                let results = await Promise.all([
                    htmlResultInitial,
                    htmlResultLast,
                    htmlResultInitialJson,
                    htmlResultLastJson
                ])
                console.dir(results)
                return results
            },
            getOpsJson: function() {
                this.selected = "hungry-cat-75"
                fetch("https://webstrates.cs.au.dk/" + this.selected + "/?ops")
                    .then(html => html.text())
                    .then(body => {
                        console.log('Ops History is Fetched Successfully')
                        this.versioningRaw = body
                    })
                    .then(() => {
                        this.versioningParsed = JSON.parse(this.versioningRaw)
                    })
            },
            createDataObject: function() {
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
        this.getOpsJson()
        this.intermSession = await this.getHtmlsPerSession()
        window.intermSession = this.intermSession

        // TODO: parse all the stuff

    },
    updated() {}
});