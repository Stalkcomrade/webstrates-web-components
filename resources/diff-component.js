// SOLVED: declare props
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

</div>
`,
    components: {
    },
    data: () => ({
        preDiff: [],
        diff: ''
    }),
    watch: {},
    computed: {
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

        this.$watch(
            vm => ([1, vm.counter].join()), val => {
                
                var preDiffLocal = []
                preDiffLocal.push(this.findSelectedInList(this.counter[0].data.children, "name", "VDnPvJ36")) // INFO: initial version
                preDiffLocal.push(this.findSelectedInList(this.counter[1].data.children, "name", "VDnPvJ36") + "NEW") // INFO: later version

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
                
                var funDiff = calculateDiff(this.mode)

                this.diff = this.mode === 'patch'
                    ? funDiff("test", preDiffLocal[0], preDiffLocal[1], "old", "new" )
                    : funDiff(preDiffLocal[0], preDiffLocal[1])

                
                if (this.mode === 'patch') {
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
