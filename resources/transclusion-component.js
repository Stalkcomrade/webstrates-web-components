// SOLVED: migrate to window.network updated
// FIXME: transient tags is invisible

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

<c-m-c ref='ct'/>

<b-btn variant="info"    @click="updateView(selected, 'copy')">Show Copies</b-btn>
<b-btn variant="primary" @click="updateView(selected, 'transclusions')">Show Transclusions</b-btn>

<br>
<br>

    <select v-model="selected">
          <option v-for="option in options" v-bind:value="option">
               {{ option }}
          </option>
        </select>

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

            console.dir("Inside d3Data Watcher")

            var container = {
                name: "main",
                children: this.d3Data
            }

            var selectors = this.getSelectors(false, "initial")
            console.log("selectors = ", selectors);

            this.rootInstance = this.root(container)
            // INFO: right - important here cause is used in versioning

            this.update(this.rootInstance, selectors)


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
        /**
         * search for copies given a operational history of a webstrate
         * @param {any} input
         * @returns {array} array of copies given a webstrate
         */
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
                // console.dir(target)

                return target
            },
            /**
             * helper function for updating tree component
             * @param {any} selected - selected webstrate
             * @param {any} mode - show copy or transclusion
             */
            updateView: async function(selected, mode) {

                console.log("updateView = ", mode);
                // this.removeChildren("initial") // INFO: Deleting old DOM nodes

                var input = typeof selected !== undefined ?
                    this.selected :
                    selected

                this.d3Data = mode == "copy" ?
                    await this.init(input, "type", this.searchCopies) :
                    await this.init(input, "type", this.sqt)

                // console.log("this.d3Data = ", this.d3Data);
            }
    },
    async created() {

        var DaysPromise = await this.fetchDaysOverview((new Date))
        this.options = this.listOfWebstrates(DaysPromise)

    },
    async mounted() {

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

        // INFO: default mode
        this.modeProp === "copy" ?
            this.d3Data = await this.init(this.selected, "type", this.searchCopies) :
            this.d3Data = await this.init(this.selected, "type", this.sqt)

        this.updateView()



    }
})