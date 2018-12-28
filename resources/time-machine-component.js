// require('/wicked-wombat-56/d3-vs.zip/src/components/d3Timeline/index.js');
// /webstrateId/d3-vs.zip
// import { d3Timeline } from '/wicked-wombat-56/Vs.min.js';
// import d3Timeline from 'Vs.min.js';
// import { d3Timeline } from '/wicked-wombat-56/d3-vs.zip/src/components/d3Timeline';
// import {
//     d3Timeline
// } from '../node_modules/d3-vs';

window.TimeMachineComponent = Vue.component('time-machine', {
    props: [
        "monthProp",
        "yearProp",
        "maxWebstratesProp",
        "selectedProp"
    ],
    data: () => ({
        date: '',
        wbsAuthor: '',
        lastChange: '',
        month: '',
        year: '',
        selected: '',
        options: [],
        maxWebstrates: '',
        totalAcitvityPerMotnh: [],
        arrayRadius: [],
        breaks: [],
        colorQ: [],
        maxOps: 0,
        scalar: 0,
        svg: [],
        groups: [],
        test: [],
        waitData: [],
        todoHovered: "hover smth",
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
    <select v-model="selected" @change="getVersioningJson()">
          <option v-for="option in options" v-bind:value="option">
               {{ option }}
          </option>
        </select>
        <button @click="fetchActivity(selected)">UPD SCL</button>

</div>
  `,
    components: {
        'd3-timeline': window.d3Timeline
    },
    watch: {
        selected: function(newValue, oldValue) {
            this.getVersioningJson()
            console.dir(newValue + " :this.selected")
        }
    },

    beforeCreate: function() {},
    created: function() {
        console.dir(this.$parent.Id + "TEST!!!")
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

            }).then(() => resolve())
        })

    },

    methods: {


        fetchActivity: function(webstrateIdInst) {

            const toDate = new Date()
            const fromDate = new Date()
            fromDate.setDate(fromDate.getDate() - 14)

            const activityPromise = dataFetcher('activities', {
                webstrateId: webstrateIdInst,
                toDate,
                fromDate
            })

            activityPromise.then((data) => {

                Object.values(data).forEach(int => {
                    Object.values(int).forEach(intN => {
                        this.intPerWs.push(intN)
                    })
                })

                var dt1 = this.intPerWs.map(int => ({
                    at: new Date(int.timestamp),
                    title: Math.random().toString(),
                    group: int.type,
                    className: (int.type === "clientPart") ? 'entry--point--warn' : 'entry--point--info',
                    symbol: (int.type === "clientPart") ? 'symbolDiamond' : 'symbolSquare',
                    link: 0,
                    webstrateId: this.selected
                }))

                console.dir(dt1)
                this.dt = this.dt.concat(dt1)

            })

        },

        getVersioningJson: function() {

            fetch("https://webstrates.cs.au.dk/" + this.selected + "/?ops")
                .then(html => html.text())
                .then(body => {
                    console.log('Fetched:')
                    this.versioningRaw = body
                })
                .then(() => {

                    this.versioningRaw = JSON.parse(this.versioningRaw)

                    try {

                        // parsing author of webstrate
                        this.wbsAuthor = this.versioningRaw[0].session.userId
                        console.dir(this.wbsAuthor)

                        // parsing the last change made on the webstrate
                        // tmp[tmp.length - 1].op[tmp[tmp.length - 1].op.length - 1].
                        // last element            Object.keys(tmp[tmp.length - 1].op[tmp[tmp.length - 1].op.length - 1])[Object.keys(tmp[tmp.length - 1].op[tmp[tmp.length - 1].op.length - 1]).length - 1]

                        this.lastChange = this.versioningRaw[this.versioningRaw.length - 1].
                        op[this.versioningRaw[this.versioningRaw.length - 1].op.length - 1][Object.keys(this.versioningRaw[this.versioningRaw.length - 1].op[this.versioningRaw[this.versioningRaw.length - 1].op.length - 1])[Object.keys(this.versioningRaw[this.versioningRaw.length - 1].op[this.versioningRaw[this.versioningRaw.length - 1].op.length - 1]).length - 1]]

                        // this.lastChange = this.versioningRaw[this.versioningRaw.length - 1].op[this.versioningRaw[this.versioningRaw.length - 1].op.length - 1].sd
                        // this.lastChange = this.versioningRaw[this.versioningRaw.length - 1].op[this.versioningRaw[this.versioningRaw.length - 1].op.length - 1].sd
                        console.dir(this.lastChange)

                    } catch (err) {
                        console.error(err)
                    }


                    this.dt = this.versioningRaw.map(int => ({
                        at: new Date(int.m.ts),
                        title: int.v,
                        // title: 
                        group: (Object.keys(int).indexOf('create') !== -1) ? 'create' : 'edition',
                        className: (Object.keys(int).indexOf('create') !== -1) ? 'entry--point--success' : 'entry--point--default',
                        symbol: (Object.keys(int).indexOf('create') !== -1) ? 'symbolCross' : 'symbolTriangle',
                        link: int.v,
                        webstrateId: this.selected
                    }))
                })
        },

        getOpsJson: function() {

            fetch("https://webstrates.cs.au.dk/" + this.selected + "/?ops")
                .then(html => html.text())
                .then(body => {
                    console.log('Fetched:')
                    this.versioningRaw = body
                })

        },

        fetchAll: function(webstrateIdInst) {
            let dt1Inst = this.getVersioningJson()
            let dt2Inst = this.fetchActivity(webstrateIdInst)
            this.dt = dt1Inst.concat(dt2Inst)
        }

    },
    mounted() {
        this.selected = this.$parent.relationName
    },
    updated() {}
});