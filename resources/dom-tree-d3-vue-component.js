// SOLVED: make a new component
// SOLVED: initiate new nested component for diffs
// SOLVED: try to use render for this purpose

// FIXME: conisider different versions
//// TODO: prepare data structure for the versions

window.DomTreeD3VueComponent = Vue.component('dom-tree-d3-vue', {
    mixins: [window.dataFetchMixin, window.network],
    components: {
        'diff-vue-component': window.diffVueComponent
    },
    template: `

<div>

<br>
<br>

<b-container class="container-fluid">

<b-row>
  <b-col sm="3">
    <diff-vue-component 
              :rootInstanceProp="currentToChild"
              :currentNode="$store.state.currentNode"
              mode="patch">
    </diff-vue-component>
  </b-col>
</b-row>

  <b-row>
    <b-col class="col-md-6">
      <div class="treeD3" id="tree-container">
      </div>
      <svg
        id="svgMain"
        :width="width" :height="dx" 
        :viewBox="svgViewBox"
        style="font: 10px sans-serif; user-select: none;">

        <g
          id="gLink"
          fill="none" stroke="#555" stroke-opacity="0.4" stroke-width="1.5"> </g>
        <g
          id="gNode"
          cursor="pointer"> </g> 
      </svg>
    </b-col>

<b-col class="col-md-6">
      <div class="treeD3" id="tree-container">
      </div>
      <svg
        id="svgMainLatest"
        :width="width" :height="dx" 
        :viewBox="svgViewBox"
        style="font: 10px sans-serif; user-select: none;">

        <g
          id="gLinkLatest"
          fill="none" stroke="#555" stroke-opacity="0.4" stroke-width="1.5"> </g>
        <g
          id="gNodeLatest"
          cursor="pointer"> </g> 
      </svg>
    </b-col>
  </b-row>

</b-container>

</div>
        `,
    data: () => ({
        inputVersion: '',
        currentInnerText: '',
        htmlString: '',
        htmlStringLatest: '',
        currentVersionSentences: [],
    }),
    watch: {
        d3Data() {

            console.dir("d3Data 've been watched")
            
            var container = {
                name: "main",
                children: this.d3Data
            }

            var selectorsInst = this.getSelectors(false, "initial")
            // console.log("Selectors Initial: \n", selectorsInst)
            
            this.rootInstance = this.root(container)
            this.update(this.rootInstance, "right", selectorsInst)
        },
        // SOLVED: add second watcher
        d3DataLatest() {
            
            console.dir("d3DataLatest 've been watched")
            
            var containerLatest = {
                name: "main",
                children: this.d3DataLatest
            }

            var selectorsInst = this.getSelectors(false, "latest")
            // console.log("Selectors: \n", selectorsInst)
            
            this.rootInstanceLatest = this.root(containerLatest)
            this.update(this.rootInstanceLatest, "left", selectorsInst)
            
            
        },
    },
    computed: {
        currentToChild() {
            return this.currentVersionSentences
        },
    },
    async mounted() {

        // SOLVED: check where diagonal is calculated
        // this.tree = d3.tree().nodeSize([this.dx, this.dy])
        // this.getSelectors()
        // this.getSelectors(true)
        
        let containerTmp = await this.getHtmlsPerSessionMixin("wonderful-newt-54", 3, undefined, false)
        this.htmlString = containerTmp[0]
        this.htmlStringLatest = containerTmp[1]
        
        // TODO: for now, I am just making object with a different name for a the next/previous version of a webstrate
        // Later on, I need to integrate it into one data structure
        
        this.htmlObject = new DOMParser().parseFromString(this.htmlString, "text/html")
        this.htmlObjectVersioned = new DOMParser().parseFromString(this.htmlStringLatest, "text/html")

        // SOLVED: make init to have an input
        this.d3Data = await this.init(this.htmlObject, undefined, undefined, undefined)
        this.d3DataLatest = await this.init(this.htmlObjectVersioned, undefined, undefined, undefined)

        this.$watch(

            // INFO: watching for data and creating prop for child component
            vm => ([vm.rootInstanceLatest, vm.rootInstance].join()), val =>  {
                
                // INFO: this as a prop to childthis.currentVersionSentences
                // INFO: first goes earlier versions
                var containerVersionSentences = []

                console.dir(this.rootInstanceLatest)

                // FIXME: eliminate
                containerVersionSentences.push({
                    'data': this.rootInstanceLatest.data,
                    // 'field': "name",
                    // 'value': "VDnPvJ36"
                })
                
                containerVersionSentences.push({
                    'data': this.rootInstance.data,
                    // 'field': "name",
                    // 'value': "VDnPvJ36"
                })
                
                this.currentVersionSentences = containerVersionSentences // INFO: to avoid evoking component before data is ready
            
            },
        )
        
    }
})
