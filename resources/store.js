const webstrateIdProp = "terrible-chipmunk-57"
var view = "overview"
var testProp = "Not Synchted"


const mixin = Vue.mixin({
  props: ['value', 'smth', 'testProp', 'relationName'],
  data: () => ({
    inputVal: this.value,
    view
  }),
    methods: {
      changeView: function(value) {
        this.$parent.$emit('input', value)
      },
      testSync: function(value) {
        this.$parent.$emit('update:relationName', value)

      }
  }
})
