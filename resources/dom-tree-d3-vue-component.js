// SOLVED: make a new component
// SOLVED: initiate new nested component for diffs
// SOLVED: try to use render for this purpose
// SOLVED: conisider different versions
//// SOLVED: prepare data structure for the versions

window.DomTreeD3VueComponent = Vue.component('dom-tree-d3-vue', {
    mixins: [window.dataFetchMixin, window.network],
    props: ["webstrateId", "initialVersion", "latestVersion"], 
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
        initSelected: '',
        isInitiated: false,
        inputVersion: '',
        currentInnerText: '',
        htmlString: '',
        htmlStringLatest: '',
        currentVersionSentences: [],
    }),
    watch: {
        d3Data() {

            this.removeChildren("initial")
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

            this.removeChildren("latest")
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

        // FIXME: divide update logic into new Webstrate and
        // sliderUpdate(twice, cause we have 2 trees)

        // INFO: watcher for Initial version update
        this.$watch(
            (vm) => (vm.$store.getters.initialVersionGet), async val => {

                console.dir("Initial Version Update")
                
                var webstrateId = this.$store.state.webstrateId
                var initialVersion = store.getters.initialVersionGet
                
                let containerTmp = await this.getHtmlsPerSessionMixin(webstrateId,
                                                                      undefined, undefined,
                                                                      true, initialVersion)
                
                this.htmlString = containerTmp
                this.htmlObject = new DOMParser().parseFromString(this.htmlString, "text/html")
                this.d3Data = await this.init(this.htmlObject, undefined, undefined)
                
            }, {immediate: true}
        )
        
        // INFO: watcher for Latest version update
        this.$watch(
            (vm) => (vm.$store.getters.latestVersionGet), async val => {

                console.dir("Latest Version update")
                
                var webstrateId = this.$store.state.webstrateId
                var latestVersion = store.getters.latestVersionGet

                let containerTmp = await this.getHtmlsPerSessionMixin(webstrateId,
                                                                      undefined, undefined,
                                                                      true, latestVersion)
                this.htmlStringLatest = containerTmp
                this.htmlObjectVersioned = new DOMParser().parseFromString(this.htmlStringLatest, "text/html")
                this.d3DataLatest = await this.init(this.htmlObjectVersioned, undefined, undefined)
                
            }, {immediate: true}
        )

        
        // INFO: watcher for webstrate update
        this.$watch(
            (vm) => (vm.$store.state.webstrateId), async val => {

                console.dir("dom tree first watcher")
                
                var webstrateId = this.$store.state.webstrateId
                var initialVersion = store.getters.initialVersionGet,
                    latestVersion = store.getters.latestVersionGet

                let containerTmp = await this.getHtmlsPerSessionMixin(webstrateId,
                                                                      initialVersion, latestVersion, false)
                
                this.htmlString = containerTmp[0]
                this.htmlStringLatest = containerTmp[1]
                
                this.htmlObject = new DOMParser().parseFromString(this.htmlString, "text/html")
                this.htmlObjectVersioned = new DOMParser().parseFromString(this.htmlStringLatest, "text/html")

                // SOLVED: make init to have an input
                this.d3Data = await this.init(this.htmlObject, undefined, undefined)
                this.d3DataLatest = await this.init(this.htmlObjectVersioned, undefined, undefined)
                
            }, {immediate: true}
        )
        
        this.$watch(

            // INFO: watching for data and creating prop for child component
            vm => ([vm.rootInstanceLatest, vm.rootInstance].join()), val =>  {

                console.dir("Inside diff-version watcher")
                
                // INFO: this as a prop to childthis.currentVersionSentences
                // INFO: first goes earlier versions
                var containerVersionSentences = []

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
