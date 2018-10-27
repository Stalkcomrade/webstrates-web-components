window.Embedded = Vue.component('embedded', {
  template: `
<div @input="changeView()">
  <h2> {{ view }} </h2>
<transition name="component-fade" mode="out-in">
  <component v-bind:is="view" v-model="view"></component>
</transition>
</div>
`,
  components: {
    'overview': {
      template: 
      `<month-view v-bind:monthProp="Number(this.month) || ((new Date).getMonth() + 1)" 
                   v-bind:yearProp="Number(this.year) || (new Date).getFullYear()"
                   v-bind:maxWebstratesProp="20" 
        />
`
    },
    'time-machine': TimeMachineComponent,
    'test': {
      template: `
		<time-machine>
        </time-machine>
	`
    }
  },
  data: {
    view,
    tm: "time-machine",
    webstrateIdProp,
  },
  methods: {
    changeView: function() {
      this.view = "time-machine"
      console.dir("I've heard!")
    }
  },
  mounted() {

    // this.$watch(
    // )

  },
  created() {
    // this.changeView()
  }
})
