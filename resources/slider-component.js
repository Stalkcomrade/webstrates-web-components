// This component intended to be used with dom-tree
// in order to eliminate repetitive data creation I connected its logic with
// timeline-component, seens needed data is fetched there

// SOLVED: try range mode
// TODO: emit current version for use cases with dom-d3-vue
// webstrate.on('loaded', () => {

window.slider = Vue.component('vue-slider-configured', {
    mixins: [window.dataFetchMixin],
    components: {
        'vue-slider': window.vueSlider
    },
                  // :min="sliderOptionsComp.min" :max="sliderOptionsComp.max"  :interval="sliderOptionsComp.interval"
    template: `
<div>

 <vue-slider v-model="valueSlider" ref="slider" 
              :options="sliderOptionsComp" :piecewise="true" :piecewiseLabel="sliderOptionsComp.piecewiseLabel"  :piecewiseLabel="sliderOptionsComp.piecewiseLabel"

              :formatter="sliderOptionsComp.formatter" 
              mergeFormatter="¥{value[0]} ~ ¥{value[1]}"
              :piecewiseStyle="sliderOptionsComp.piecewiseStyle"
              :piecewiseActiveStyle="sliderOptionsComp.piecewiseActiveStyle"
              :labelActiveStyle="sliderOptionsComp.labelActiveStyle"
              :enableCross="false"> 
  </vue-slider>

    <button @click="fetchActivity(selected)">Version Mode</button>
    <button @click="changeMode('sessions')">Auto-Tag aka Sessions Mode</button>
    <button @click="changeMode('tags')">Tags Mode</button>

</div>
`,
    data: () => ({
        valueSlider: [1, 3],
        currentMode: "default",
        sliderOptionsComp: {
            value: '',
            data: '',
            interval: 1,
            min: 0,
            max: 100,
            formatter: ""
        },
    }),
    computed: {
        // currentModeComp() {
        //     return this.currentMode === "default"
        //         ? {data: this.sliderOptionsComp.data,
        //            min: this.sliderOptionsComp.min,
        //            max: this.sliderOptionsComp.max}
        //     : {data: this.sliderOptionsComp.data,
        //            min: this.sliderOptionsComp.min,
        //        max: this.sliderOptionsComp.max,
        //        formatter: "¥{value}"}
        // }
    },
    methods: {
        changeMode: async function(mode) {
            
            if (mode === "tags") {
                
                var tags = await this.fetchTags(this.$store.state.webstrate) // FIXME:
                console.log("tags = ", tags);

                try {
                    var tt = tags.forEach(el => {
                        return el.label

                        this.sliderOptionsComp.min = tags[0].v
                        this.sliderOptionsComp.max = tags[tags.length - 1].v


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
                        
                        this.sliderOptionsComp.labelActiveStyle =  {
                            "color": "#3498db"
                        }
                        
                        
                        this.sliderOptionsComp.formatter = "¥{value}"
                        
                    })
                    console.log("tt = ", tt);
                } catch (err) {
                    console.error("Probably, issue is that there is only 1 tag:\n", err)
                } finally {
                }
               

                // this.sliderOptionsComp.data = sessionIds // FIXME: delete
                // this.sliderOptionsComp.value = sessionIds
                // this.sliderOptionsComp.formatter = "¥" {{ this.sliderOptionsComp.value }}
                
                
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
                
                // var rTags = await this.fetchRangeOfTags(wsId)
                // console.log("rTags = ", rTags);

                var vUnited = [];
                
                
                tags.forEach(el => {
                    vUnited.push(el.v + "||" + el.label)
                })

                console.log("vUnited = ", vUnited);

                this.sliderOptionsComp.data = vUnited // FIXME: delete
                // this.sliderOptionsComp.formatter = "¥" {{ this.sliderOptionsComp.value }}
                // this.sliderOptionsComp.value = vUnited

                // this.refresh()
                
                // this.sliderOptionsComp.min = 0
                // this.sliderOptionsComp.max = tags.length - 1
                // this.sliderOptionsComp.interval = 1
                this.sliderOptionsComp.piecewiseLabel = true

                // this.sliderOptionsComp.min = tags[0].v
                // this.sliderOptionsComp.max = tags[tags.length - 1].v

                
                this.sliderOptionsComp.piecewiseStyle = {
                    "backgroundColor": "#ccc",
                    "visibility": "visible",
                    "width": "12px",
                    "height": "12px"
                }

                
                this.sliderOptionsComp.piecewiseStyle = {
                    "backgroundColor": "#3498db"
                }
                
                this.sliderOptionsComp.piecewiseStyle =  {
                    "color": "#3498db"
                }
                
                
                this.sliderOptionsComp.formatter = "{value}"

                
                
            } else {
                
                this.sliderOptionsComp.formatter = "{value}"
                
            }
        }
    },
    async mounted() {

        // INFO: watching for manipulations made with slider
        // and mutating corresponding state in store
        
        this.$watch((vm) => (vm.valueSlider), val => {

            setTimeout(function () {
                console.dir("Slider shifted!")
                store.commit("changeSliderVersions", this.valueSlider)
            }, 3000)
            
            
        })

        // INFO: Receiveing session-object from timeline-component
        this.$watch(
            (vm) => (vm.$store.state.sessionObject, Date.now()), async val => {

                console.dir("SLIDER")
                var sessionObject = this.$store.state.sessionObject
                console.log("sessionObject = ", sessionObject);// INFO: getting from store

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
                
                
            }, {immediate: true}
        )
        
    }
})

