// SOLVED: make a new component
// SOLVED: initiate new nested component for diffs
// SOLVED: try to use render for this purpose
// SOLVED: conisider different versions
//// SOLVED: prepare data structure for the versions

// TODO: set true timeout


webstrate.on("loaded", () => {

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

    <!-- <button @click="codestrateMode">Codestrate Mode</button> -->


<br>
<br>
         <input v-model="selectedFilterOptions" placeholder="html element">
         <p>Message is: {{ selectedFilterOptions }}</p>


<br>
<br>

         <input v-model="selectedElementFilterOptions" placeholder="element attribute">
         <p>Message is: {{ selectedElementFilterOptions }}</p>

<br>
<br>

         <input v-model="selectedElementValueOptions" placeholder="value">
         <p>Message is: {{ selectedElementValueOptions }}</p>

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

  </b-row>

</b-container>

</div>
        `,
        data: () => ({
            selectedFilterOptions: '',
            selectedElementFilterOptions: '',
            selectedElementValueOptions: '',
            initSelected: '',
            isInitiated: false,
            inputVersion: '',
            currentInnerText: '',
            htmlString: '',
            htmlStringLatest: '',
            currentVersionSentences: [],
            codestrateModeFlag: false, // INFO: used to color/filter children if codestrate mode is enabled
        }),
        methods: {
            debounce: function(func, wait, immediate) {

                var timeout;

                return function() {
                    var context = this,
                        args = arguments;

                    var callNow = immediate && !timeout;

                    clearTimeout(timeout);

                    timeout = setTimeout(function() {

                        timeout = null;

                        if (!immediate) {
                            func.apply(context, args);
                        }
                    }, wait);

                    if (callNow) func.apply(context, args);
                }
            },
            /**
             * used to bind sqEnhanced for Codestrate mode
             * @param {any} codestrateMode
             */
            instantiateWatchers: function(codestrateMode) {

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

                var initFun,
                    arguments;

                // INFO: if method is called with the webstrate mode
                // assigning corresponding function with arguments
                if (codestrateMode === true) {

                    initFun = this.initEnhanced
                    arguments = [undefined, undefined, {
                        attributeName: "class",
                        attributeValue: "section section-visible"
                    }, true]

                } else {

                    initFun = this.init
                    arguments = [undefined, undefined]

                }


                // INFO: I am waiting for data processing above and building united tree here
                this.$watch(
                    (vm) => ([vm.d3Data, vm.d3DataLatest]), val => {

                        // let typingTimer; // timer identifier
                        // let doneTypingInterval = 1000; // time in ms (5 seconds)

                        // function accomplish() {
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

                        var selectorsInst = this.getSelectors(false, "initial")
                        this.rootInstance = this.root(containerLatest)
                        this.update(this.rootInstance, selectorsInst)
                        // }

                        // clearTimeout(typingTimer);
                        // typingTimer = setTimeout(accomplish.bind(this), doneTypingInterval);


                    }, {
                        immediate: false
                    }
                )

                // SOLVED: divide update logic into new Webstrate and
                // INFO: watcher for Initial version update
                this.$watch(
                    (vm) => (vm.$store.getters.initialVersionGet), async val => {

                        console.dir("Initial Version Update")

                        var webstrateId = this.$store.state.webstrateId
                        var initialVersion = this.$store.state.sliderVersions[0]

                        var containerTmp = await this.getHtmlsPerSessionMixin(webstrateId,
                            undefined, undefined,
                            true, initialVersion)

                        this.htmlString = containerTmp
                        this.htmlObject = new DOMParser().parseFromString(this.htmlString, "text/html")

                        this.d3Data = await initFun(...[this.htmlObject].concat(arguments))

                    }, {
                        immediate: false
                    }
                )

                // INFO: watcher for Latest version update
                this.$watch(
                    (vm) => (vm.$store.getters.latestVersionGet), async val => {

                        var smth = this.debounce(async () => {

                            console.log("Latest Version update")
                            var webstrateId = this.$store.state.webstrateId
                            var latestVersion = this.$store.state.sliderVersions[1]

                            var containerTmp = await this.getHtmlsPerSessionMixin(webstrateId,
                                undefined, undefined,
                                true, latestVersion)

                            this.htmlStringLatest = containerTmp
                            this.htmlObjectVersioned = new DOMParser().parseFromString(this.htmlStringLatest, "text/html")
                            this.d3DataLatest = await initFun(...[this.htmlObjectVersioned].concat(arguments))

                        }, 1000)

                        smth()


                    }, {
                        immediate: false
                    }
                )


                // FIXME: it seems that the main issue here is that html.Object is not created or is wrong
                this.$watch((vm) => (vm.selectedFilterOptions, vm.selectedElementFilterOptions, vm.selectedElementValueOptions), async val => {


                    console.dir("Dom Filter is Applied, Tree is processing")
                    this.removeChildren("initial")

                    var filter = {
                        attributeName: this.selectedElementFilterOptions,
                        attributeValue: this.selectedElementValueOptions
                    }

                    // TODO: filter is not working right now
                    // FIXME: multiple filters
                    this.d3Data = await this.initEnhanced(this.htmlObject, undefined, undefined, filter, true)
                    this.d3DataLatest = await this.initEnhanced(this.htmlObjectVersioned, undefined, undefined, filter, true)
                    // }

                    // clearTimeout(typingTimer);
                    // typingTimer = setTimeout(accomplish.bind(this), doneTypingInterval);


                })


                // INFO: watcher for webstrate update
                // INFO: also, if WS is trancluded, use different mechanism of accessing the dom 
                this.$watch(
                    (vm) => (vm.$store.state.webstrateId), async val => {

                        // setup before functions
                        // let typingTimer; // timer identifier
                        // let doneTypingInterval = 1000; // time in ms (5 seconds)

                        // async function accomplish() {
                        console.dir("watcher for webstrate update")

                        var webstrateId = this.$store.state.webstrateId,
                            initialVersion = this.$store.getters.initialVersionGet,
                            latestVersion = this.$store.getters.latestVersionGet

                        let containerTmp = await this.getHtmlsPerSessionMixin(webstrateId,
                            initialVersion, latestVersion, false)

                        this.htmlString = containerTmp[0]
                        this.htmlStringLatest = containerTmp[1]

                        this.htmlObject = new DOMParser().parseFromString(this.htmlString, "text/html")
                        this.htmlObjectVersioned = new DOMParser().parseFromString(this.htmlStringLatest, "text/html")

                        // SOLVED: make init to have an input

                        this.d3Data = await initFun(...[this.htmlObject].concat(arguments))
                        this.d3DataLatest = await initFun(...[this.htmlObjectVersioned].concat(arguments))
                        // }

                        // clearTimeout(typingTimer);
                        // typingTimer = setTimeout(accomplish.bind(this), doneTypingInterval);

                    }, {
                        immediate: false
                    }
                )

                this.$watch(
                    // INFO: watching for data and creating prop for child component
                    vm => (vm.rootInstance), val => {

                        // let typingTimer; // timer identifier
                        // let doneTypingInterval = 1000; // time in ms (5 seconds)
                        // function accomplish() {

                        // INFO: this as a prop to childthis.currentVersionSentences
                        // INFO: first goes earlier versions
                        var containerVersionSentences = []

                        // FIXME: eliminate
                        containerVersionSentences.push({
                            'data': this.rootInstance.data,
                            // 'field': "name",
                            // 'value': "VDnPvJ36"
                        })

                        this.currentVersionSentences = containerVersionSentences // INFO: to avoid evoking component before data is ready
                        // }

                        // clearTimeout(typingTimer);
                        // typingTimer = setTimeout(accomplish.bind(this), doneTypingInterval);

                    },
                )

            }

        },
        computed: {
            currentToChild() {
                return this.currentVersionSentences
            },
        },
        created() {},
        async mounted() {

            if (this.$route.path === "/transclude-codestrate-component") {
                this.instantiateWatchers(true)
            } else {
                this.instantiateWatchers(false)
            }

        }
    })

})