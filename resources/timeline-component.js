import {
    d3Timeline
} from '../node_modules/d3-vs';

window.jsdiff = require('json0-ot-diff')
// window.path = require('path') // FIXME get rid of it
// window.coreJsonML = require.resolve(window.path.resolve("/home/stlk/Downloads/node_modules/webstratesModules/coreJsonML.js"));
// window.coreJsonML = require.resolve('coreJsonML')

window.TimelineComponent = Vue.component('timeline', {
    props: [
        "monthProp",
        "yearProp",
        "maxWebstratesProp",
        "selectedProp"
    ],
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
        intermSession: ""
    }),
    template: `
      <d3-timeline
          v-bind:data="dt"
        width="100%"
        height="300px">
      </d3-timeline>
  `,
    components: {
        'd3-timeline': d3Timeline
    },
    watch: {
        versioningParsed() {
            this.processData()
        },
        sessionGrouped() {
            this.createDataObject()
        }
    },
    beforeCreate: function() {},
    created: function() { // FIXME: in future eliminate created
        this.waitData = new Promise((resolve, reject) => {

            this.date = (new Date(this.year, this.month - 1)).toLocaleDateString(undefined, {
                month: 'long',
                year: 'numeric'
            })

            const month = Number(this.month) || ((new Date).getMonth() + 1);
            const maxWebstrates = this.maxWebstrates || 20;
            const year = Number(this.year) || (new Date).getFullYear();

            dataFetcher('month').then((days) => {

                let webstrateIds = new Set();
                let effortTotal = new Set();

                Object.values(days).forEach(day => {
                    Object.keys(day).forEach(webstrateId => {
                        webstrateIds.add(webstrateId)
                    });

                    Object.values(day).forEach(singleEffort => {
                        effortTotal.add(singleEffort)
                    })
                })
                webstrateIds = Array.from(webstrateIds).sort()
                this.options = webstrateIds
                console.dir('List of Webstrates Ids is Fetched Successfully')
            }).then(() => resolve())
        })
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
                let webpageInitial = await fetch("https://webstrates.cs.au.dk/hungry-cat-75/" + "10/")
                let htmlResultInitial = await webpageInitial.text()

                let webpageLast = await fetch("https://webstrates.cs.au.dk/hungry-cat-75/" + "4000/")
                let htmlResultLast = await webpageLast.text()

                let results = await Promise.all([
                    htmlResultInitial,
                    htmlResultLast
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
        this.getHtmlsPerSession()
        this.intermSession = await this.getHtmlsPerSession()
        window.intermSession = this.intermSession
    },
    updated() {}
});