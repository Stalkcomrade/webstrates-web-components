// SOLVED: declare props
// SOLVED: add reactivity and add possible options

window.diffVueComponent = Vue.component('diff-vue-component', {
    props: {
        rootInstanceProp: Array,
        mode: String
    },
    template: `
<div>

  <component :is="dynamicComponentDiff" />
   
  <div id="pretty-diff-custom">
  </div>

  <select v-model="selected" type="button" class="btn dropdown-toggle btn-primary">
          <option v-for="option in options" v-bind:value="option">
               {{ option }}
          </option>
        </select>

</div>
`,
    data: () => ({
        preDiff: [],
        diff: '',
        options: ['char', 'sentence', 'line', 'patch'],
        isUpdated: false, // INFO: in order to keep info about prop and selected I use this
        selected: this.mode // INFO: important for first init
    }),
    watch: {
        // selected: function(newValue, oldValue){
        //     return newValue
        // }
    },
    computed: {
        currentNodeComputed () {
            return this.$store.getters.currentNodeGet
        },
        counter() {
            return this.rootInstanceProp
        },
        dynamicComponentDiff() {

            console.dir("DYNAMIC COMPONENT")

            var diff = this.diff
            
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
        
        // FIXME: this is used only once
        this.$watch(
            vm => ([vm.currentNodeComputed, vm.selected, vm.counter].join()), val => {

                console.dir("Watched")
                console.dir("STATE:")
                console.dir(this.$store.state.currentNode)

                // INFO: mechanism to keep both prop and selected
                var localMode
                console.dir(this.isUpdated === false)
                if (this.isUpdated === false) {
                    localMode = this.mode
                    this.isUpdated = true
                } else {
                    localMode = this.selected
                } 
                
                var preDiffLocal = []
                preDiffLocal.push(this.findSelectedInList(this.counter[0].data.children,
                                                          "name",
                                                          this.currentNodeComputed)) // INFO: initial version
                preDiffLocal.push(this.findSelectedInList(this.counter[1].data.children,
                                                          "name",
                                                          this.currentNodeComputed) + "NEW") // INFO: later version

                // FIXME: fix order of arguments (old, new)
                var calculateDiff = function(mode) {
                    var funToReturn;

                    switch (mode) {
                    case "patch":
                        funToReturn = window.jsdiffTrue.createPatch
                        break;
                    case "sentence":
                        funToReturn = window.jsdiffTrue.diffSentences
                        break;
                    case "line":
                        funToReturn = window.jsdiffTrue.diffLines
                        break;
                    case "char":
                        funToReturn = window.jsdiffTrue.diffChars
                        break;
                    }
                    return funToReturn
                }
                
                var funDiff = calculateDiff(localMode)
                // console.dir(funDiff)
                // console.dir("nmew fund idff")
                // console.dir(localMode)

                this.diff = localMode === 'patch'
                    ? funDiff("test", preDiffLocal[0], preDiffLocal[1], "old", "new" )
                    : funDiff(preDiffLocal[0], preDiffLocal[1])

                
                if (localMode === 'patch') {
                    var diffHtml = Diff2Html.getPrettyHtml(
                        this.diff,
                        {inputFormat: 'diff', showFiles: false, matching: 'lines', outputFormat: 'side-by-side'}
                    )
                    document.getElementById("pretty-diff-custom").innerHTML = diffHtml;
                } else {
                    console.dir("Not a patch, skipping diff2html")
                }

            })

    }
})
