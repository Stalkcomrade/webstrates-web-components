window.Embedded = Vue.component('embedded', {
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
    view: "test",
    // webstrateId: "terrible-chipmunk-57",
    webstrateIdProp,
    tabs: ["month-view-component"]
  }),
  updated() {}
})
