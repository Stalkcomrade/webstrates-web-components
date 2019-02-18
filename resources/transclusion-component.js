// FIXME: transient tags is invisible
// FIXME: migrate to window.network updated

window.transclusionComponent = Vue.component('transclusion', {
    mixins: [window.dataFetchMixin, window.dataObjectsCreator],
    props: ["modeProp"],
    components: {
        'c-m-c': window.cmc
    },
    template: `
<div>

<br>
<br>
<br>
<br>

<c-m-c ref='ct'/>

<b-btn variant="info"    @click="updateView(selected, 'copy')">Show Copies</b-btn>
<b-btn variant="primary" @click="updateView(selected, 'transclusions')">Show Transclusions</b-btn>

<br>
<br>
<br>

    <select v-model="selected">
          <option v-for="option in options" v-bind:value="option">
               {{ option }}
          </option>
        </select>

<br>
<br>
<br>

   <b-container class="bv-example-row">
                <b-row>
                   <b-col>   
                      <div class="treeD3" id="tree-container"></div>
  <svg
        id="svgMain"
        ref="svgMain"
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
                   <b-col>
                   </b-col>
                </b-row>
   </b-container>

</div>
`,
    watch: {
        d3Data() {

            console.dir("INSIDE d3Data Watcher")
            // this.removeChildren("initial")

            var container = {
                name: "main",
                children: this.d3Data
            }

            var selectors = this.getSelectors(false, "initial")
            console.log("selectors = ", selectors);

            this.rootInstance = this.root(container)
            // console.log("this.rootInstance = ", this.rootInstance);
            // INFO: right - important here cause is used in versioning


            // FIXME: for some reason, network-upd mixin is used
            // INFO: NO CLUE HOW IS THAT POSSIBLE
            // setTimeout(() => {
            // this.update(this.rootInstance, "right", selectors)
            this.update(this.rootInstance, selectors)
            // }, 500)


        },
        selected: function(newValue, oldValue) {
            console.dir("Initial State Watch in time-machine-component.js")
            // this.updateView(newValue)
        },
    },
    computed: {
        selected: {
            get() {
                return this.$store.state.contextMenuObject === '' ?
                    this.$store.state.webstrateId :
                    this.$store.state.contextMenuObject
            },

            set(value) {
                this.$store.commit('changeCurrentWebstrateId', value)
            }
        }
    },
    data: () => ({
        // selected: 'short-turtle-55', // INFO: default value
        d3Data: "",
        options: ''
    }),
    methods: {

        extractSummary: function(input) {

            // var reg = /(?=\<iframe.*?src="\/(.*?)\/*?".*?<\/iframe\>)|(?=\<iframe.*?wid="(.*?)".*?<\/iframe\>)/gi
            // var reg = /\<iframe src="\/(.*?)\/".*?\_\_wid="(.*?)".*?<\/iframe\>/gi // INFO: two groups
            var regSrc = /\<iframe.*?src="\/(.*?)\/*?".*?<\/iframe\>/gi
            var regWid = /\<iframe.*?wid="(.*?)".*?<\/iframe\>/gi

            try {

                var src = (input.match(regSrc) || []).map(e => {
                    return {
                        src: e.replace(regSrc, '$1'),
                    }
                })
                console.log("src = ", src);

                var wid = (input.match(regWid) || []).map(e => {
                    return {
                        wid: e.replace(regWid, '$1'),
                    }
                })
                console.log("wid = ", wid);

                var tt = wid.map((el, index) => {
                    return {
                        ...el,
                        src: src[index].src
                    }
                })
                console.log("tt = ", tt);


                return tt

            } catch (err) {
                return null
            }
        },
        searchCopies: async function(input) {

                console.dir("Copies")

                var target = [],
                    children = []

                var cpsWs = await this.getOpsJsonMixin(input)
                // console.log("cpsWs = ", cpsWs);


                children = {
                    value: (typeof cpsWs[0].create !== "undefined" && typeof cpsWs[0].create.id !== "undefined" ?
                        cpsWs[0].create.id :
                        "no copies found"),
                    name: (typeof cpsWs[0].create !== "undefined" && typeof cpsWs[0].create.id !== "undefined" ?
                        cpsWs[0].create.id :
                        "no copies found"),
                    children: (cpsWs[0].create.id !== input && await this.searchCopies(cpsWs[0].create.id))
                }

                target.push(children)
                console.dir(target)

                return target
            },
            sqt: async function(input) {

                    console.dir("Transclusion")

                    var htmlParsed = await this.getHtmlsPerSessionMixin(input, undefined, undefined, true)
                    var prs = this.extractSummary(htmlParsed)

                    var target = [],
                        children = []

                    if (prs !== null && typeof prs !== "undefined") {

                        for (var i = 0, len = prs.length; i < len; ++i) {

                            var el = prs[i]

                            children = {
                                value: el.src,
                                name: el.wid,
                                children: (typeof el.src !== "undefined" ? await this.sqt(el.src) : "no transclusions")
                            }

                            target.push(children)
                        }
                    } else {

                        console.dir("else statement")

                    }
                    return target

                },
                updateView: async function(selected, mode) {

                    console.log("updateView = ", );
                    // this.removeChildren("initial") // INFO: Deleting old DOM nodes

                    var input = typeof selected !== undefined ?
                        this.selected :
                        selected

                    this.d3Data = mode == "copy" ?
                        await this.init(input, "type", this.searchCopies) :
                        await this.init(input, "type", this.sqt)

                    console.log("this.d3Data = ", this.d3Data);
                }
    },
    async created() {

        var DaysPromise = await this.fetchDaysOverview((new Date))
        this.options = this.listOfWebstrates(DaysPromise)

    },
    async mounted() {

        // debugger
        // this.initiateTransclusion()
        // this.createIframe("tasty-lionfish-70")
        // this.receiveTags("tasty-lionfish-70")
        // let wsId = "massive-skunk-85"
        // let wsId = "hungry-cat-75"
        // let wsId = "wonderful-newt-54/"
        // let wsId = "tasty-lionfish-70" // copies
        // let wsId = "short-turtle-55" // transclusions

        this.$store.commit("changeCurrentWebstrateId", "splendid-quail-43") // FIXME: temporary

        this.tree = d3.tree().nodeSize([this.dx, this.dy])
        this.diagonal = d3.linkHorizontal().x(d => d.y).y(d => d.x)
        this.selectors = this.getSelectors(true)

        // INFO: Creating graph
        // INFO: searching for copies by default
        // this.d3Data = await this.init("short-turtle-55", "type", this.searchCopies)
        // this.d3Data = await this.init(this.selected, "type", this.searchCopies)

        this.modeProp === "copy" ?
            this.d3Data = await this.init(this.selected, "type", this.searchCopies) :
            this.d3Data = await this.init(this.selected, "type", this.sqt)

        // this.d3Data = await this.init(this.selected, "type", this.searchCopies)

        this.updateView()



    }
})