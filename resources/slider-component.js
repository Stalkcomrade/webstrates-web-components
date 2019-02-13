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
    template: `
<div>

 <vue-slider v-model="valueSlider" ref="slider" 
              :options="sliderOptionsComp" :piecewise="true" :interval="2"
              :min="sliderOptionsComp.min" :max="sliderOptionsComp.max" 
              :formatter="sliderOptionsComp.formatter" 
              mergeFormatter="¥{value[0]} ~ ¥{value[1]}"
              :enableCross="false"> 
  </vue-slider>

    <button @click="fetchActivity(selected)">Version Mode</button>
    <button @click="fetchActivity(selected)">Auto-Tag Mode</button>
    <button @click="changeMode('tags')">Tags Mode</button>

</div>
`,
    data: () => ({
        valueSlider: [1, 3],
        currentMode: "default",
        sliderOptionsComp: {
            value: '',
            data: '',
            min: 0,
            max: 100,
            formatter: ""
        },
    }),
    computed: {
        currentModeComp() {
            return this.currentMode === "default"
                ? {data: this.sliderOptionsComp.data,
                   min: this.sliderOptionsComp.min,
                   max: this.sliderOptionsComp.max}
            : {data: this.sliderOptionsComp.data,
                   min: this.sliderOptionsComp.min,
               max: this.sliderOptionsComp.max,
               formatter: "¥{value}"}
        }
    },
    methods: {
        changeMode: async function(mode) {
            if (mode === "tags") {
                
                var tags = await this.fetchTags(this.$store.state.webstrate) // FIXME:
                console.log("tags = ", tags);

                var tt = tags.forEach(el => {
                    return el.label
                })
                console.log("tt = ", tt);

                // this.sliderOptionsComp.data = sessionIds // FIXME: delete
                // this.sliderOptionsComp.value = sessionIds
                
                // this.sliderOptionsComp.formatter = "¥" {{ this.sliderOptionsComp.value }}
                this.sliderOptionsComp.min = tags[0].v
                this.sliderOptionsComp.max = tags[tags.length - 1].v
                
                this.sliderOptionsComp.formatter = "¥{value}"
                
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
            }.bind(this), 3000)
            
            
        })

        // INFO: Receiveing session-object from timeline-component
        this.$watch(
            (vm) => (vm.$store.state.sessionObject, Date.now()), async val => {

                console.dir("SLIDER")
                var sessionObject = this.$store.state.sessionObject
                console.log("sessionObject = ", sessionObject);// INFO: getting from store

                // fetching tags
                // var wsId = this.$store.state.webstrateId
                // console.log("wsId = ", wsId);

                // var tags = await this.fetchTags(wsId)
                // console.log("tags = ", tags);
                var rTags = await this.fetchRangeOfTags(wsId)
                console.log("rTags = ", rTags);
                
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

