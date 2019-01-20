// SOLVED: make a new component
////// SOLVED: initiate new nested component for diffs
////// SOLVED: try to use render for this purpose
//// TODO: prepare data structure for the versions

// INFO: if there are gonna be issues, check mixins
window.DomTreeD3VueComponent = Vue.component('dom-tree-d3-vue', {
    mixins: [window.dataFetchMixin, window.network],
    template: `
<div>
<br>
<br>

<b-container class="container-fluid">

<b-row>
 <component :is="dynamicComponent" />
</b-row>

<b-row>
 <component :is="dynamicComponentDiff" />
</b-row>

  <b-row>
    <b-col class="col-md-10">
      <div class="treeD3" id="tree-container">
      </div>
      <svg
        id="svgMain"
        :width="width" :height="dx" :viewBox="viewBox"
        style="font: 10px sans-serif; user-select: none;">

        <g
          id="gLink"
          fill="none" stroke="#555" stroke-opacity="0.4" stroke-width="1.5"> </g>
        <g
          id="gNode"
          cursor="pointer"> </g> 
      </svg>
    </b-col>
    <b-col class="col-md-2 text-left">
      <p> {{ currentInnerText }} </p>
    </b-col>
  </b-row>

</b-container>

</div>
        `,
    components: {
        'TimelineComponent': window.TimelineComponent
    },
    data: () => ({
        inputVersion: '',
        currentInnerText: '',
        htmlString: '',
        htmlStringLatest: '',
    }),
    watch: {
        d3Data() {
            var container = {
                name: "main",
                children: this.d3Data
            }
            this.rootInstance = this.root(container)
            this.update(this.rootInstance)
        },
        // SOLVED: add second watcher
        d3DataLatest() {
            console.dir("d3DataLatest 've been watched")
            var containerLatest = {
                name: "main",
                children: this.d3DataLatest
            }
            this.rootInstanceLatest = this.root(containerLatest)
        },
    },
    computed: {
        dynamicComponent: function() {
            return {
                template: `<div>${this.currentVersionSpan}</div>`,
                }
        },
        dynamicComponentDiff: function() {
            
            var one = 'beep boop',
                other = 'beep boob blah'

            // var diff = window.jsdiffTrue.diffChars(one, other)
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
    },
    async mounted() {

        this.tree = d3.tree().nodeSize([this.dx, this.dy])
        this.diagonal = d3.linkHorizontal().x(d => d.y).y(d => d.x)
        this.getSelectors()

        // INFO: Here I am waiting for data from a child component
        // FIXME: conisider different versions
        // timeline-component.js - after that I am reading parsing htmls and building trees

        let containerTmp = await this.getHtmlsPerSessionMixin("wonderful-newt-54", 3, undefined, false)
        this.htmlString = containerTmp[0]
        this.htmlStringLatest = containerTmp[1]
        
        // TODO: for now, I am just making object with a different name for a the next/previous version of a webstrate
        // Later on, I need to integrate it into one data structure
        
        this.htmlObject = new DOMParser().parseFromString(this.htmlString, "text/html")
        this.htmlObjectVersioned = new DOMParser().parseFromString(this.htmlStringLatest, "text/html")

        // SOLVED: make init to have an input
       
        this.d3Data = await this.init(this.htmlObject)
        this.d3DataLatest = await this.init(this.htmlObjectVersioned)

        function findSelectedInList(list, propertyName, valueFilter){
            let selected;
            if (typeof Object.values(list) != "undefined" && typeof Object.values(list) != "undefined") {
                Object.values(list).some((currentItem) => {
                    if (typeof currentItem != null) {
                        if (typeof currentItem[propertyName] != "undefined" | typeof currentItem[propertyName] != null) {
                            currentItem[propertyName] === valueFilter ?
                            selected = currentItem.innerText :
                                (typeof currentItem.children != "undefined" && findSelectedInList(currentItem.children, propertyName, valueFilter))
                        }
                    }
                }
                                        )}
            return selected
        }
        
        this.$watch(
            vm => ([vm.rootInstanceLatest, vm.rootInstance].join()), val =>  {
                console.dir("WATCHER!!!")

                this.currentVersionSentences = []
                this.currentVersionSentences.push(findSelectedInList(this.rootInstanceLatest.data.children, "name", "VDnPvJ36"))
                this.currentVersionSentences.push(findSelectedInList(this.rootInstance.data.children, "name", "VDnPvJ36"))
                
                var diff = new window.Diff(); 
                var textDiff = diff.main("tre[0]", "tre[1]"); // produces diff array
                this.currentVersionSpan = diff.prettyHtml(textDiff)

            },
        )
        
    }
})
