window.Embedded = Vue.component('embedded', {
  template: `
<div id="dynamic-component-demo" class="demo">
  <button
    v-for="tab in tabs"
    v-bind:key="tab"
    v-bind:class="['tab-button', { active: currentTab === tab }]"
    v-on:click="currentTab = tab"
  >{{ tab }}</button>

  <component
    v-bind:is="currentTabComponent"
    class="tab"
  ></component>
</div>

`,

  components: {
    'webstrate-legend-component': WebstrateLegendComponent,
    'calenadr-component': CalendarView,
    // 'time-machine': TimeMachineComponent
  },
  data: () => ({
    currrentTab: "CalendarView",
    tabs: ["CalendarView", "webstrate-legend-component"]
  }),
  computed: {
    currentTabComponent: function () {
      return this.currentTab
    }
  },
  updated() {}
})


