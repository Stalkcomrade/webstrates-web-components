window.Embedded = Vue.component('embedded', {
  template: `
<transition name="component-fade" mode="out-in">
  <component v-bind:is="view"></component>
</transition>
`,
  components: {
    'overview': CalendarView,
    'time-machine': TimeMachineComponent
  },
  data: () => ({
    view: "overview",
    tabs: ["month-view-component"]
  }),
  updated() {}
})
