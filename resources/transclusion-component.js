window.transclusionComponent = Vue.component('transclusion', {
    mixins: [window.dataFetchMixin, window.network],
    template: `
<div>
<br>
<br>
<br>
<br>
<button @contextmenu="handler($event)">r-click</button>

   <b-container class="bv-example-row">
                <b-row>
                   <b-col>   
                      <div class="treeD3" id="tree-container"></div>
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
                   <b-col>
                   </b-col>
                </b-row>
   </b-container>

</div>
`,
    methods: {},
    async created() {},
    async mounted() {

        this.tree = d3.tree().nodeSize([this.dx, this.dy])
        this.diagonal = d3.linkHorizontal().x(d => d.y).y(d => d.x)
        this.getSelectors()

        // let wsId = "massive-skunk-85"
        // let wsId = "hungry-cat-75"
        // let wsId = "wonderful-newt-54/"
        // let wsId = "tasty-lionfish-70" // copies
        // let wsId = "short-turtle-55" // transclusions
        
        // SOLVED: parse tags
        // this.fetchTags("wicked-wombat-56")
        // this.htmlString = await this.getHtmlsPerSessionMixin("short-turtle-55", undefined, undefined, true)

        // SOLVED: main issue is that the order of attributes should be avoided
        var extractSummary = function(input) {

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
        }

        // window.extractSummary = extractSummary
        // window.df = await this.getHtmlsPerSessionMixin("tasty-lionfish-70", undefined, undefined, true)
        // this.htmlString = await this.getHtmlsPerSessionMixin("tasty-lionfish-70", undefined, undefined, true)
        // window.dswre = extractSummary(this.htmlString)
        // this.sqEnhanced("soft-catfish-41")

        
        self = this

        var sqt = async function(input){

            var htmlParsed = await self.getHtmlsPerSessionMixin(input, undefined, undefined, true)
            var prs = extractSummary(htmlParsed)

            var target = [],
                children = []

            if (prs !== null && typeof prs !== "undefined") {

                for (var i = 0, len = prs.length; i < len; ++i) {
                    
                    var el = prs[i]

                    children = {
                        value: el.src,
                        name: el.wid,
                        children: (typeof el.src !== "undefined" ? await sqt(el.src) : "no transclusions")
                    }

                    target.push(children)
                }
            } else {
                console.dir("else statement")
            }
            return target

        }

        // window.sqt = await sqt("short-turtle-55")
        // window.sqt = sqt("tasty-lionfish-70")

        // SOLVED: parse copies
        // SOLVED: make a recursive function
        // tasty-lionfish-70
        var searchCopies = async function(input){

            var target = [],
                children = []
            
            var cpsWs = await self.getOpsJsonMixin(input)
            
            children = {
                value: (typeof cpsWs[0].create !== "undefined" && typeof cpsWs[0].create.id !== "undefined"
                        ? cpsWs[0].create.id
                        : "no copies found"),
                name: (typeof cpsWs[0].create !== "undefined" && typeof cpsWs[0].create.id !== "undefined"
                       ? cpsWs[0].create.id
                       : "no copies found"),
                children: (cpsWs[0].create.id !== input && await searchCopies(cpsWs[0].create.id))
            }

            target.push(children)

            return target
        }

        // INFO: Creating graph
        this.d3Data = await this.init("short-turtle-55", "type", searchCopies, undefined)
       
    }
})
