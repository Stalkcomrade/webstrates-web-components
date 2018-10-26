const webstrateIdProp = "terrible-chipmunk-57"
var view = "overview"


// var mixin = {
//   methods: {
//     changeView: function() {
//       this.view = "time-machine"
//       console.dir("clicked")
//     }
//   }
// }


window.mixin = Vue.mixin({
    methods: {
    changeView: function() {
      this.view = "time-machine"
      console.dir("clicked")
    }
  }
})


const mixin = Vue.mixin({
    methods: {
    changeView: function() {
      this.view = "time-machine"
      console.dir("clicked")
    }
  }
})
