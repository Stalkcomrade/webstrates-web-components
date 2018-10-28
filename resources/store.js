var webstrateIdProp = "terrible-chipmunk-57"
var view = "overview"


const mixin = Vue.mixin({
  props: ['value', 'smth', 'relationName', 'testProp'],
  data: () => ({
    inputVal: this.value,
    view
  }),
    methods: {
      changeView: function(value, webstrateId) {
        this.$parent.$emit('input', value)
        this.$parent.$emit('update:relationName', webstrateId)
        this.$parent.$emit('click', webstrateId)
      },
      testSync: function(value) {
        this.$parent.$emit('update:relationName', value)

      },
      checkEvent: function(valueCheck) {
        this.$parent.$emit('click', valueCheck)
      }
  }
})
