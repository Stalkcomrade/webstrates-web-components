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
        this.$parent.$emit('input', value)
    }
  }
})
