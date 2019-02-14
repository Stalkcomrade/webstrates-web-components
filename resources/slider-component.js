// This component intended to be used with dom-tree
// in order to eliminate repetitive data creation I connected its logic with
// timeline-component, seens needed data is fetched there
// SOLVED: try range mode

// webstrate.on('loaded', () => {

window.slider = Vue.component('vue-slider-configured', {
    mixins: [window.dataFetchMixin],
    components: {
        'vue-slider': window.vueSlider
    },
    // :min="sliderOptionsComp.min" :max="sliderOptionsComp.max"
    // :options="sliderOptionsComp"
    template: `
<div>

 <vue-slider v-model="valueSlider" ref="slider" 
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

    <button @click="changeMode('versions')">Version Mode</button>
    <button @click="changeMode('sessions')">Sessions aka Auto-Tag Mode</button>
    <button @click="changeMode('tags')">Users Tags Mode</button>

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
    methods: {
        changeMode: async function(mode) {
            
            if (mode === "tags") { // INFO: user Tags Mode
                
                var tags = await this.fetchTags(this.$store.state.webstrate) // FIXME:
                console.log("tags = ", tags);

                // var regSrc = /\<iframe.*?src="\/(.*?)\/*?".*?<\/iframe\>/gi
                // var regSrc = /.*Session of smth.*/gi
                // input.match(regSrc)
                
                var regSrc = /.*?Session.*?/gi

                this.sliderOptionsComp.mergeFormatter = "¥{value[0]} ~ ¥{value[1]}"
                
                try {
                    var tt = tags.forEach((el, i, tags) => {
                        return el.label.match(regSrc).length === null && tags[i].label
                    })

                    if (typeof tt === "undefined") {
                        
                        console.log("NO User-Defined Tags")
                        console.log("tt = ", tt);

                        this.sliderOptionsComp.data = [1]
                        this.sliderOptionsComp.min = 0
                        this.sliderOptionsComp.max = 1

                        
                    } else {
                        
                        console.log("There User-Defined Tags")
                        console.log("tt = ", tt);

                        this.sliderOptionsComp.data = tt
                        this.sliderOptionsComp.interval = 1
                        this.sliderOptionsComp.piecewiseLabel = true
                        this.sliderOptionsComp.min = tags[0].v
                        this.sliderOptionsComp.max = tags[tags.length - 1].v
                        this.sliderOptionsComp.formatter = "¥{value}"
                        this.sliderOptionsComp.mergeFormatter = "¥{value[0]} ~ ¥{value[1]}"


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
                        
                    }

                    
                } catch (err) {
                    console.error("Probably, issue is that there is only 1 tag:\n", err)
                } finally { }
               
                
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

                this.sliderOptionsComp.data = vUnited // FIXME: delete
                this.sliderOptionsComp.interval = 1
                this.sliderOptionsComp.piecewiseLabel = true
                this.sliderOptionsComp.mergeFormatter = "¥{value[0]} ~ ¥{value[1]}"

                
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

                
                
            } else { // INFO: just raw versions

                console.log("raw versions")

                this.sliderOptionsComp.min = 1
                this.sliderOptionsComp.max = await this.lastVersion(wsId)

                const range = (start, stop, step = 1) =>
                      Array(Math.ceil((stop - start) / step)).fill(start).map((x, y) => x + y * step)
                
                this.sliderOptionsComp.data = range(this.sliderOptionsComp.min, this.sliderOptionsComp.max)
                    
                this.sliderOptionsComp.interval = 30
                this.sliderOptionsComp.piecewiseLabel = false
                this.sliderOptionsComp.formatter = "{value}"
                this.sliderOptionsComp.mergeFormatter = "¥{value[0]} ~ ¥{value[1]}"
                
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

