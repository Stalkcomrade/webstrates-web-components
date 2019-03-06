// This component intended to be used with dom-tree
// in order to eliminate repetitive data creation I connected its logic with
// timeline-component, seens needed data is fetched there
// SOLVED: try range mode

// webstrate.on('loaded', () => {

window.slider = Vue.component('vue-slider-configured', {
    mixins: [window.dataFetchMixin, window.dataObjectsCreator, window.transclusion],
    props: ["webstrateIdSliderProp"],
    components: {
        'vue-slider': window.vueSlider
    },
    template: `
<div>

<br>

 <vue-slider v-model="valueSlider" ref="slider" v-if="webstrateIdSliderProp !== 'main'"
              :data="sliderOptionsComp.data"
              :interval="sliderOptionsComp.interval"
              :piecewise="true"
              :formatter="sliderOptionsComp.formatter" 
              :mergeFormatter="sliderOptionsComp.mergeFormatter"
              :piecewiseStyle="sliderOptionsComp.piecewiseStyle"
              :piecewiseActiveStyle="sliderOptionsComp.piecewiseActiveStyle"
              :labelActiveStyle="sliderOptionsComp.labelActiveStyle"
              :enableCross="false"> 
  </vue-slider>

<br>

    <button @click="changeMode('versions')" v-if="mode === 'global'">Version Mode</button>
    <button @click="changeMode('sessions')" v-if="mode === 'global'">Sessions aka Auto-Tag Mode</button>
    <button @click="changeMode('tags')"     v-if="mode === 'global'">Users Tags Mode</button>

</div>
`,
    data: () => ({
        mode: "global",
        valueSlider: [1, 3],
        currentMode: "default",
        sliderOptionsComp: {
            value: '',
            // data: [],
            data: "",
            interval: 1,
            min: 0,
            max: 100,
            formatter: ""
        },
    }),
    methods: {
        /**
         * function is used for:
         *   making intermediate object for timeline component
         *   making object for slider component
         * @param {any} versioningParsed
         */
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

            store.commit("changeCurrentSessionObject", sessionObject)

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
        changeMode: async function(mode) {

            if (mode === "tags") { // INFO: user Tags Mode

                var tags = await this.fetchTags(this.$store.state.webstrateId)
                // console.log("this.$store = ", this.$store.state.webstrateId); // FIXME:
                // console.log("tags = ", tags);

                var regSrc = /.*?Session.*?/gi

                // window.tags = tags
                // this.sliderOptionsComp.mergeFormatter = "¥{value[0]} ~ ¥{value[1]}"

                try {
                    var tt = tags.map((el, i, tags) => {
                        // return el.label.match(regSrc).length === null && tags[i].label
                        return el.label.match(regSrc) === null && {
                            v: tags[i].v,
                            label: tags[i].label
                        }
                    }).filter(el => el !== false)

                    // console.log("tt = ", tt);


                    if (typeof tt === "undefined") {

                        console.log("NO User-Defined Tags")
                        // console.log("tt = ", tt);

                        this.sliderOptionsComp.data = [1]
                        this.sliderOptionsComp.min = 0
                        this.sliderOptionsComp.max = 1


                    } else {

                        console.log("There User-Defined Tags")

                        // console.log("tt = ", tt);
                        // console.log("this.sliderOptionsComp = ", this.sliderOptionsComp.data);



                        this.sliderOptionsComp.data = tt
                        this.sliderOptionsComp.piecewiseLabel = true
                        this.sliderOptionsComp.min = tt[0].v
                        this.sliderOptionsComp.max = tt[tt.length - 1].v


                        this.$nextTick(() => {
                            this.sliderOptionsComp.formatter = (v) => `${v.label}`
                            this.sliderOptionsComp.mergeFormatter = (v1, v2) => `¥${v1.label} ~ ¥${v2.label}`
                        });

                        this.sliderOptionsComp.piecewiseStyle = {
                            "backgroundColor": "#ccc",
                            "visibility": "visible",
                            "width": "12px",
                            "height": "12px"
                        }

                        this.sliderOptionsComp.piecewiseLabel = true
                        this.sliderOptionsComp.piecewiseActiveStyle = {
                            "backgroundColor": "#3498db"
                        }

                        this.sliderOptionsComp.labelActiveStyle = {
                            "color": "#3498db"
                        }

                    }


                } catch (err) {
                    console.error("Probably, issue is that there is only 1 tag:\n", err)
                } finally {}


            } else if (mode === "sessions") {

                var wsId = this.$store.state.webstrateId
                var tags = await this.fetchTags(wsId)
                console.log(tags)

                var vSession = [];
                var vLabel = [];

                tags.forEach(el => {
                    vSession.push(el.v)
                    vLabel.push(el.label)
                })


                var vUnited = [];

                tags.forEach(el => {
                    vUnited.push(el.v + "||" + el.label)
                })

                console.log("vUnited = ", vUnited);

                // this.sliderOptionsComp.data = vUnited // FIXME: delete
                this.sliderOptionsComp.data = tags // FIXME: delete
                // this.sliderOptionsComp.interval = 1
                this.sliderOptionsComp.piecewiseLabel = true
                // this.sliderOptionsComp.formatter = "(v) => `¥{v.label}`"

                this.$nextTick(() => {
                    this.sliderOptionsComp.formatter = (v) => `${v.label}`
                    this.sliderOptionsComp.mergeFormatter = (v1, v2) => `¥${v1.label} ~ ¥${v2.label}`
                });

                // setTimeout(() => {
                //     this.sliderOptionsComp.formatter = (v) => `${v.label}`
                //     this.sliderOptionsComp.mergeFormatter = (v1, v2) => `¥${v1.label} ~ ¥${v2.label}`
                // }, 100)


                // this.sliderOptionsComp.mergeFormatter = "¥{value[0]} ~ ¥{value[1]}"


                this.sliderOptionsComp.piecewiseStyle = {
                    "backgroundColor": "#ccc",
                    "visibility": "visible",
                    "width": "12px",
                    "height": "12px"
                }


                this.sliderOptionsComp.piecewiseStyle = {
                    "backgroundColor": "#3498db"
                }

                this.sliderOptionsComp.piecewiseStyle = {
                    "color": "#3498db"
                }


            } else { // INFO: just raw versions

                console.log("raw versions")

                var lastVersion = await this.lastVersion(this.$store.state.webstrateId)

                this.sliderOptionsComp.piecewiseLabel = false
                this.sliderOptionsComp.min = 1
                this.sliderOptionsComp.max = lastVersion

                // console.log(this.getOpsJsonMixin(this.$store.state.webstrateId))
                // console.log("Last version", this.sliderOptionsComp.max)
                // console.log("this.sliderOptionsComp.data = ", this.sliderOptionsComp.data);

                const range = (start, stop, step = 1) =>
                    Array(Math.ceil((stop - start) / step)).fill(start).map((x, y) => x + y * step)

                this.sliderOptionsComp.data = range(this.sliderOptionsComp.min, this.sliderOptionsComp.max)

                this.sliderOptionsComp.interval = 20
                this.sliderOptionsComp.piecewiseLabel = false



                this.sliderOptionsComp.formatter = "{value}"
                this.sliderOptionsComp.mergeFormatter = "¥{value[0]} ~ ¥{value[1]}"

            }
        }
    },
    async mounted() {

        // INFO: if I am using this in the local mode (via prop)
        // I don't want to use store

        if (this.webstrateIdSliderProp !== undefined) {

            this.mode = "local"
            this.sliderOptionsComp.data = [1, 2, 3]
            console.log("Slider Local Mode")

            var wsId = this.webstrateIdSliderProp
            var tags = await this.fetchTags(wsId)
            console.log(tags)

            var vSession = [];
            var vLabel = [];

            tags.forEach(el => {
                vSession.push(el.v)
                vLabel.push(el.label)
            })


            var vUnited = [];

            tags.forEach(el => {
                vUnited.push(el.v + "||" + el.label)
            })

            console.log("vUnited = ", vUnited);

            this.sliderOptionsComp.data = tags // FIXME: delete
            this.sliderOptionsComp.piecewiseLabel = true

            this.$nextTick(() => {
                this.sliderOptionsComp.formatter = (v) => `${v.label}`
                this.sliderOptionsComp.mergeFormatter = (v1, v2) => `¥${v1.label} ~ ¥${v2.label}`
            });

            // setTimeout(() => {
            //     this.sliderOptionsComp.formatter = (v) => `${v.label}`
            //     this.sliderOptionsComp.mergeFormatter = (v1, v2) => `¥${v1.label} ~ ¥${v2.label}`
            // }, 100)


            this.sliderOptionsComp.piecewiseStyle = {
                "backgroundColor": "#ccc",
                "visibility": "visible",
                "width": "12px",
                "height": "12px"
            }


            this.sliderOptionsComp.piecewiseStyle = {
                "backgroundColor": "#3498db"
            }

            this.sliderOptionsComp.piecewiseStyle = {
                "color": "#3498db"
            }

            // INFO: LOCAL MODE (manipulates for construction)
            // INFO: watching for manipulations made with slider
            // and mutating corresponding state in store

            this.$watch((vm) => (vm.valueSlider), val => {

                console.log("this.valueSlider changed", this.valueSlider)
                console.log("Slider shifted, commited to store", this.valueSlider)

                // setTimeout(function() {

                // INFO: checking whether versions are wrapped in array of objects

                if (this.valueSlider[0].v !== undefined && this.valueSlider[0].v !== null) {

                    console.log(this.valueSlider)
                    console.log("CHECKING Slider type", typeof this.valueSlider[0].v !== undefined)

                    var parsedVersions = this.valueSlider.map(el => {
                        return el.v
                    })
                    console.log("this.valueSlider = ", this.valueSlider);
                    console.log("parsedVersions = ", parsedVersions);

                    setTimeout(() => {
                        this.$store.commit("changeSliderVersions", parsedVersions)
                    }, 3000)


                } else {
                    setTimeout(() => {
                        this.$store.commit("changeSliderVersions", this.valueSlider)
                    }, 3000)

                }

                console.log("SLIDER STORE:", this.$store.state.valueSlider)

            })



        } else {

            // INFO: if no information about versions is presented, fetch it

            if (typeof this.$store.state.sessionObject === undefined |
                this.$store.state.sessionObject === "") {

                console.log("Fetching Session Object in Slider Component")

                var selected = this.$store.state.webstrateId
                console.log("selected = ", selected);

                var versioningParsed = await this.getOpsJsonMixin(selected)
                var sessionGrouped = this.processData(versioningParsed)

                // this.$store.commit("changeCurrentSessionObject", sessionGrouped)

            } else {
                console.log("Session object for slider is already presented")
            }


            // INFO: watching for manipulations made with slider
            // and mutating corresponding state in store

            this.$watch((vm) => (vm.valueSlider), val => {

                console.log("this.valueSlider changed", this.valueSlider)
                console.log("Slider shifted, commited to store", this.valueSlider)

                // setTimeout(function() {

                // INFO: checking whether versions are wrapped in array of objects

                if (this.valueSlider[0].v !== undefined && this.valueSlider[0].v !== null) {

                    console.log(this.valueSlider)
                    console.log("CHECKING Slider type", typeof this.valueSlider[0].v !== undefined)

                    var parsedVersions = this.valueSlider.map(el => {
                        return el.v
                    })
                    console.log("this.valueSlider = ", this.valueSlider);
                    console.log("parsedVersions = ", parsedVersions);

                    setTimeout(() => {
                        this.$store.commit("changeSliderVersions", parsedVersions)
                    }, 3000)



                } else {
                    setTimeout(() => {
                        this.$store.commit("changeSliderVersions", this.valueSlider)
                    }, 3000)

                }

                console.log("SLIDER STORE:", this.$store.state.valueSlider)

                // debugger
                // }.bind(this), 3000)


            })

            // INFO: Receiveing session-object from timeline-component
            this.$watch(
                (vm) => (vm.$store.state.sessionObject, Date.now()), async val => {

                    console.dir("store.state.sessionObject is received")
                    var sessionObject = this.$store.state.sessionObject
                    console.log("sessionObject = ", sessionObject); // INFO: getting from store

                    // fetching tags
                    var wsId = this.$store.state.webstrateId
                    // console.log("wsId = ", wsId);
                    // var tags = await this.fetchTags(wsId)
                    // console.log("tags = ", tags);
                    // var rTags = await this.fetchRangeOfTags(wsId)
                    // console.log("rTags = ", rTags);
                    // fetching tags

                    var counter = 0,
                        sessionIds = []

                    sessionObject.forEach((el, index) => {
                        counter = counter + 1
                        sessionIds.push(counter)
                    })

                    console.log("Slider Options")
                    this.sliderOptionsComp.data = sessionIds // FIXME: delete
                    this.sliderOptionsComp.value = sessionIds
                    // this.sliderOptionsComp.formatter = "¥" {{ this.sliderOptionsComp.value }}
                    this.sliderOptionsComp.min = this.valueSlider[0] = sessionIds[0]
                    this.sliderOptionsComp.max = this.valueSlider[1] = sessionIds[sessionIds.length - 1]


                }, {
                    immediate: true
                }
            )

        }
    }
})