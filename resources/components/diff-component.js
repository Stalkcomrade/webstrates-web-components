//// TODO: check prettyHtml
// var diff = new window.Diff(); 
                // var textDiff = diff.main("tre[0]", "tre[1]"); // produces diff array
                // this.currentVersionSpan = diff.prettyHtml(textDiff)
// timeline-component.js - after that I am reading parsing htmls and building trees
////
// <b-row>
        // <component :is="dynamicComponent" />
        // </b-row>
        // dynamicComponent: function() {
        //     return {
        //         template: `<div>${this.currentVersionSpan}</div>`,
        //         }
// },


// TODO: declare props
// vm.rootInstanceLatest, vm.rootInstance

// TODO: $even emitters

window.diffVueComponent = Vue.component('diff-vue-component', {
    // mixins: [window.dataFetchMixin, window.network],
    props: {
        rootInstanceProp: Object,
        rootInstanceLatestProp: Object
    },
    template: `

<div>

<b-container class="container-fluid">

<b-row>
  <b-col sm="6">
 <component :is="dynamicComponentDiff" />
  </b-col>
</b-row>

<!-- <b-row>
     </b-col>
     <b-col class="col-md-2 text-left">
     <p> {{ currentInnerText }} </p>
     </b-col>
     </b-row> -->

</b-container>

</div>
        `,
    components: {
    },
    data: () => ({
        currentVersionSentences: []
    }),
    watch: {},
    computed: {
        dynamicComponentDiff: function() {
            
            // TODO: diff chars
            // var one = 'beep boop',
            //     other = 'beep boob blah'
            // var diff = window.jsdiffTrue.diffChars(one, other)
            // window.ttt = diff
            
            var diff = window.jsdiffTrue.diffLines(this.currentVersionSentences[0], this.currentVersionSentences[1])

            return {
                render(h) {
                    return h('div', {
                        'class': 'omg'
                    },
                                 [h('pre', {'id': 'display'},
                                   diff.map(el => (h('span', // SOLVED: returning array in a map 
                                                    {
                                                        style: {'color': el.added ? 'green' :
                                                                el.removed ? 'red' : 'grey'},
                                                        domProps: {
                                                            innerHTML: el.value
                                                        }
                                                    }))
                                           ))]
                            )
                }
            }
            }
    },
    methods: {
        findSelectedInList: function(list, propertyName, valueFilter){
            let selected
            
            if (typeof Object.values(list) != "undefined") {
                Object.values(list).some((currentItem) => {
                    if (typeof currentItem != null) {
                        if (typeof currentItem[propertyName] !== "undefined" | typeof currentItem[propertyName] != null) {
                            currentItem[propertyName] === valueFilter ?
                                selected = currentItem.innerText :
                                (typeof currentItem.children != "undefined" && this.findSelectedInList(currentItem.children, propertyName, valueFilter))
                        }
                    }
                }
                                        )}
            return selected
        }
    },
    async mounted() {

        this.$watch(
            // TODO: this happens in parent
            // TODO: emit props from parent to child


            // Watcher also might be in a need in here
            
            vm => ([vm.rootInstanceLatest, vm.rootInstance].join()), val =>  {
                
                // console.dir(findSelectedInList(this.rootInstanceLatest.data.children, "name", "VDnPvJ36"))
                console.dir("WATCHER IN DIFF COMPONENT!!!")
                
                this.currentVersionSentences = []
                
                // TODO: delcare as props
                this.currentVersionSentences.push(this.findSelectedInList(this.rootInstanceLatest.data.children, "name", "VDnPvJ36"))
                this.currentVersionSentences.push(this.findSelectedInList(this.rootInstance.data.children, "name", "VDnPvJ36"))

            },
        )
        
    }
})
