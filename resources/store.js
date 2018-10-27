const webstrateIdProp = "terrible-chipmunk-57"
var view = "overview"


const mixin = Vue.mixin({
  props: ['value'],
  data: () => ({
    inputVal: this.value,
    view
  }),
  // watch: {
  //   inputVal(val) {
  //     this.$emit("input", val)
  //   }
  // },
    methods: {
      changeView: function(value) {
        this.$emit('input', value)
        this.$parent.$emit('input', value)
        this.$parent.view = "test"
        this.$parent.is = "test"
        console.dir("clicked" + this.view)
        console.dir(this.$parent.view + " it is parent view")
        this.view = "time-machine"
        view = "time-machine"
    }
  }
})
