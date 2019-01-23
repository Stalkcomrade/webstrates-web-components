window.transclusionComponent = Vue.component('transclusion', {
    mixins: [window.dataFetchMixin, window.dataObjectsCreator, window.network],
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

<b-btn variant="info" @click="updateView(selected, 'copy')">Show Copies</b-btn>
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
        selected: function(newValue, oldValue) {
            console.dir("Initial State Watch in time-machine-component.js")
            // this.updateView(newValue)
        },
    },
    data: () => ({
        selected: 'short-turtle-55', // INFO: default value
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

                 var wid =  (input.match(regWid) || []).map(e => {
                     return {
                         wid: e.replace(regWid, '$1'),
                     }
                 })

                 var tt = wid.map((el, index) => {
                     return {
                         ... el,
                         src: src[index].src
                     }
                 })

                 return tt

             } catch (err) {
                 return null
             }
        },
        
        searchCopies: async function(input){

            console.dir("Copies")
            
            var target = [],
                children = []
            
            var cpsWs = await this.getOpsJsonMixin(input)
            
            children = {
                value: (typeof cpsWs[0].create !== "undefined" && typeof cpsWs[0].create.id !== "undefined"
                        ? cpsWs[0].create.id
                        : "no copies found"),
                name: (typeof cpsWs[0].create !== "undefined" && typeof cpsWs[0].create.id !== "undefined"
                       ? cpsWs[0].create.id
                       : "no copies found"),
                children: (cpsWs[0].create.id !== input && await this.searchCopies(cpsWs[0].create.id))
            }

            target.push(children)

            return target
        },

        sqt: async function(input){

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

        updateView: async function(selected, mode){

            this.removeChildren() // INFO: Deleting old DOM nodes
            
            var input = typeof selected !== "undefined"
                ? this.selected
                : selected

            this.d3Data = mode == "copy"
                ? await this.init(input, "type", this.searchCopies)
                : await this.init(input, "type", this.sqt)
        }
    },
    async created() {
        var DaysPromise = await this.fetchDaysOverview((new Date))
        this.options = this.listOfWebstrates(DaysPromise)
    },
    mounted() {
        // debugger

        // this.initiateTransclusion()
        // this.createIframe("tasty-lionfish-70")
        // this.receiveTags("tasty-lionfish-70")
        
        this.tree = d3.tree().nodeSize([this.dx, this.dy])
        this.diagonal = d3.linkHorizontal().x(d => d.y).y(d => d.x)
        this.getSelectors()

        // INFO: Creating graph
        // INFO: searching for copies by default
        this.d3Data = this.init("short-turtle-55", "type", this.searchCopies, undefined)

        // let wsId = "massive-skunk-85"
        // let wsId = "hungry-cat-75"
        // let wsId = "wonderful-newt-54/"
        // let wsId = "tasty-lionfish-70" // copies
        // let wsId = "short-turtle-55" // transclusions
        
    }
})
