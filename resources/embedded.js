window.Embedded = Vue.component('embedded', {
  // <component v-bind:is="view" ></component>
  template: `
<transition name="component-fade" mode="out-in">
  <component v-bind:is="view" ></component>
</transition>
`,
  components: {
    'overview': CalendarView,
    'time-machine': TimeMachineComponent,
    'test': {
      template: `
		<time-machine>
        </time-machine>
	`
    }
  },
  data: () => ({
    is: "",
    view,
    webstrateIdProp,
    tabs: ["month-view-component"]
  }),
  methods: {
    changeView() {
      this.view = "time-machine"
      console.dir("clicked")
    }

  },
  created() {
    // this.changeView()
  }
})
