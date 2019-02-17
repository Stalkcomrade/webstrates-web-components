// SOLVED: make a new component
// SOLVED: initiate new nested component for diffs
// SOLVED: try to use render for this purpose
// SOLVED: conisider different versions
//// SOLVED: prepare data structure for the versions

window.DomTreeD3Component = Vue.component('dom-tree-d3', {
    mixins: [window.dataFetchMixin, window.networkUpd],
    props: ["webstrateId", "initialVersion", "latestVersion"],
    components: {
        'diff-vue-component': window.diffVueComponent,
        'vue-slider': window.vueSlider
    },
    template: `

<div>

<br>
<br>

<vue-slider-configured >
  </vue-slider-configured>

<br>
<br>

    <button @click="codestrateMode">Codestrate Mode</button>

<br>
<br>

<b-container class="container-fluid">

<b-row>
  <b-col sm="9">
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
        :viewBox="viewBoxConst"
        style="font: 10px sans-serif; user-select: none;">

        <g
          id="gLink"
          fill="none" stroke="#555" stroke-opacity="0.4" stroke-width="1.5"> </g>
        <g
          id="gNode"
          cursor="pointer"> </g> 
      </svg>
    </b-col>


    <!-- <b-col class="col-md-6">
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
         </b-col> -->
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
        codestrateModeFlag: false, // INFO: used to color/filter children if codestrate mode is enabled
        webstrateId: ''
    }),
    methods: {
        codestrateMode() {

            this.codestrateModeFlag = true

            var tw = d3.selectAll("#gNode")

            tw.select("text")
                .attr("stroke", d => {
                    if (d.class === "section section-hidden") {
                        return "blue"
                    } else if (d.unapproved === "") {
                        return "yellow"
                    } else {
                        return "red"
                    }
                })

            var checkNested = function(obj /*, level1, level2, ... levelN*/ ) {
                var args = Array.prototype.slice.call(arguments, 1);
                for (var i = 0; i < args.length; i++) {
                    if (!obj || !obj.hasOwnProperty(args[i])) {
                        return false;
                    }
                    obj = obj[args[i]];
                }
                return true;
            }

            var findSelectedInList = function(selected, list, propertyName, valueFilter) {

                Object.values(list).some((currentItem) => {

                    // // INFO: using this in order to parse 1-level svg elements
                    if (checkNested(currentItem, 'data', propertyName)) {
                        currentItem.data[propertyName] === valueFilter ?
                            selected.push(currentItem) // ? selected = currentItem.__data__.data.name
                            :
                            (typeof currentItem._children != "undefined" && findSelectedInList(selected, currentItem._children, propertyName, valueFilter))
                    }
                })
                return selected
            }

            var selected = []
            console.log(findSelectedInList(selected, this.rootInstance.children, "unapproved", ""))

        }
    },
    computed: {
        currentToChild() {
            return this.currentVersionSentences
        },
    },
    created() {
        // this.webstrateId = this.$store.state.webstrateId
        this.webstrateId = "cowardly-octopus-29"
        this.$store.commit('changeCurrentWebstrateId', "cowardly-octopus-29")
    },
    async mounted() {


        function findSelectedInList(list, propertyName, newPropertyName, newPropertyValue) {
            let condition;
            if (typeof Object.values(list) != "undefined" && typeof Object.values(list) != null) {
                Object.values(list).some((currentItem) => {
                    if (typeof currentItem != null) {
                        if (typeof currentItem[propertyName] != "undefined" | typeof currentItem[propertyName] != null) {

                            if (Array.isArray(currentItem) !== true) {
                                currentItem[newPropertyName] = newPropertyValue
                            }; // INFO: important to put semicolon

                            if (typeof currentItem.children != "undefined") {
                                findSelectedInList(currentItem.children, propertyName, newPropertyName, newPropertyValue)
                            }

                        }
                    }
                })
            }
            return list
        }

        // INFO: I am waiting for data processing above and building united tree here
        this.$watch(
            (vm) => ([vm.d3Data, vm.d3DataLatest]), val => {

                this.removeChildren("initial")

                // FIXME: WTF?
                var t1 = findSelectedInList(this.d3Data, "name", "alignment", "left"),
                    t2 = findSelectedInList(this.d3DataLatest, "name", "alignment", "right")

                var merged = [];
                merged = merged.concat(t1, t2)

                var containerLatest = {
                    name: "main",
                    children: merged
                }
                console.log("containerLatest = ", containerLatest);

                var selectorsInst = this.getSelectors(false, "initial")
                this.rootInstance = this.root(containerLatest)
                this.update(this.rootInstance, selectorsInst)

            }, {
                immediate: true
            }
        )

        // TODO: 
        // SOLVED: divide update logic into new Webstrate and
        // INFO: watcher for Initial version update
        this.$watch(
            (vm) => (vm.$store.getters.initialVersionGet), async val => {

                console.dir("Initial Version Update")

                var webstrateId = this.$store.state.webstrateId
                console.log("webstrateId = ", webstrateId);
                // var initialVersion = this.$store.getters.initialVersionGet
                var initialVersion = this.$store.state.sliderVersions[0]
                console.log("initialVersion = ", initialVersion);

                var containerTmp = await this.getHtmlsPerSessionMixin(webstrateId,
                    undefined, undefined,
                    true, initialVersion)

                this.htmlString = containerTmp
                this.htmlObject = new DOMParser().parseFromString(this.htmlString, "text/html")
                this.d3Data = await this.init(this.htmlObject, undefined, undefined)

            }, {
                immediate: true
            }
        )

        // INFO: watcher for Latest version update
        // TODO: 
        this.$watch(
            (vm) => (vm.$store.getters.latestVersionGet), async val => {

                console.dir("Latest Version update")

                var webstrateId = this.$store.state.webstrateId
                // var latestVersion = this.$store.getters.latestVersionGet
                var latestVersion = this.$store.state.sliderVersions[1]

                var containerTmp = await this.getHtmlsPerSessionMixin(webstrateId,
                    undefined, undefined,
                    true, latestVersion)
                this.htmlStringLatest = containerTmp
                this.htmlObjectVersioned = new DOMParser().parseFromString(this.htmlStringLatest, "text/html")

                // console.log("wsID", webstrateId)
                // console.log("!!!!!", this.htmlObjectVersioned)

                this.d3DataLatest = await this.init(this.htmlObjectVersioned, undefined, undefined)

            }, {
                immediate: true
            }
        )


        // INFO: watcher for webstrate update
        // TODO: 
        this.$watch(
            (vm) => (vm.$store.state.webstrateId), async val => {

                console.dir("watcher for webstrate update")

                var webstrateId = this.$store.state.webstrateId
                var initialVersion = this.$store.getters.initialVersionGet,
                    latestVersion = this.$store.getters.latestVersionGet

                let containerTmp = await this.getHtmlsPerSessionMixin(webstrateId,
                    initialVersion, latestVersion, false)

                this.htmlString = containerTmp[0]
                this.htmlStringLatest = containerTmp[1]

                this.htmlObject = new DOMParser().parseFromString(this.htmlString, "text/html")
                this.htmlObjectVersioned = new DOMParser().parseFromString(this.htmlStringLatest, "text/html")

                // SOLVED: make init to have an input
                this.d3Data = await this.init(this.htmlObject, undefined, undefined)
                this.d3DataLatest = await this.init(this.htmlObjectVersioned, undefined, undefined)

            }, {
                immediate: true
            }
        )

        this.$watch(
            // TODO: 
            // INFO: watching for data and creating prop for child component
            vm => (vm.rootInstance), val => {

                console.dir("Inside diff-version watcher", this.rootInstance)

                // INFO: this as a prop to childthis.currentVersionSentences
                // INFO: first goes earlier versions
                var containerVersionSentences = []

                // FIXME: eliminate
                containerVersionSentences.push({
                    'data': this.rootInstance.data,
                    // 'field': "name",
                    // 'value': "VDnPvJ36"
                })

                // containerVersionSentences.push({
                //     'data': this.rootInstance.data,
                //     // 'field': "name",
                //     // 'value': "VDnPvJ36"
                // })

                console.log("currentVersionSentences !!!!", this.currentVersionSentences)
                this.currentVersionSentences = containerVersionSentences // INFO: to avoid evoking component before data is ready

            },
        )

    }
})