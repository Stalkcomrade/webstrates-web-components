window.Embedded = Vue.component('embedded', {
  template: `
<div>
  <h2> {{ testProp }} </h2>
  <h3> {{ view }} </h3>
  <h3> {{ webstrateIdProp }} </h3>
<transition name="component-fade" mode="out-in">
  <component v-bind:is="view" v-model="view" :relation-name.sync="testProp" :relation-name.sync="webstrateIdProp" @click="changeId"></component>
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
    'time-machine': {
      
      template: `
		<time-machine :selectedProp="webstrateIdProp"/>
	`
    }
  },
  data: {
    view,
    webstrateIdProp,
    tm: "time-machine",
    Id: ""
  },
  methods: {
    changeView: function() {
      this.view = "time-machine"
      console.dir("I've heard!")
    },
  changeId(value) {
    this.Id = value
    console.dir("parent Event:" + this.Id)
  }
  },
  // computed: {
  //   ws() {
  //     const Id = this.testProp
  //     return { Id }
  //   }
  // },
  // watch: {
  //   testProp() {
  //     this.Id = this.testProp
  //   }
  // },
  mounted() {
    // this.$watch(
    // )
  },
  created() {
    // this.changeView()
  }
})
