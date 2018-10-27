window.Embedded = Vue.component('embedded', {
  props: ["smth"],
  template: `
<div @input="changeView()">
  <h2> {{ testProp }} </h2>
  <h3> {{ view }} </h3>
<transition name="component-fade" mode="out-in">
  <component v-bind:is="view" v-model="view" :relation-name.sync="testProp"></component>
</transition>
</div>
`,
  components: {
    'overview': {
      template: 
      `<month-view v-bind:monthProp="Number(this.month) || ((new Date).getMonth() + 1)" 
                   v-bind:yearProp="Number(this.year) || (new Date).getFullYear()"
                   v-bind:maxWebstratesProp="20"
                   v-bind:smth.sync="testProp"
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
    testProp,
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
