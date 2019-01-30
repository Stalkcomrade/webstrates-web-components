// This component intended to be used with dom-tree
// in order to eliminate repetitive data creation I connected its logic with
// timeline-component, seens needed data is fetched there

// SOLVED: try range mode
// TODO: emit current version for use cases with dom-d3-vue
// webstrate.on('loaded', () => {

window.slider = Vue.component('vue-slider-configured', {
    components: {
        'vue-slider': window.vueSlider
    },
    template: `
<div>

 <vue-slider v-model="valueSlider" ref="slider" 
              :options="sliderOptionsComp" :piecewise="true" :interval="2"
              :min="sliderOptionsComp.min" :max="sliderOptionsComp.max"> 
  </vue-slider>

</div>
`,
    data: () => ({
        valueSlider: [1, 3],
        sliderOptionsComp: { 
            data: '',
            min: 0,
            max: 100
        },
    }),
    methods: {
    },
    async mounted() {

        // INFO: Receiveing session-object from timeline-component
        this.$watch(
            (vm) => (vm.$store.state.sessionObject, Date.now()), val => {

                console.dir("SLIDER")
                var sessionObject = this.$store.state.sessionObject // INFO: getting from store
                
                var counter = 0,
                    sessionIds = []

                sessionObject.forEach((el, index) => {
                    counter = counter + 1
                    sessionIds.push(counter)
                })
                
                this.sliderOptionsComp.data = sessionIds
                
                console.log("Slider Options")
                // console.dir(sessionIds)
                
                this.sliderOptionsComp.min = this.valueSlider[0] = sessionIds[0]
                this.sliderOptionsComp.max = this.valueSlider[1] = sessionIds[sessionIds.length - 1]
                
            }, {immediate: true}
        )
        
    }
})

