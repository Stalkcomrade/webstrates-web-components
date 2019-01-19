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
                   </b-col>
                   <b-col>
                   </b-col>
                </b-row>
   </b-container>

</div>
`,
    // data: () => ({
    //     d3Data: [],
    //     d3Object: {},
    //     finalHtml: '',
    //     htmlObjectReady: false,
    //     htmlObject: '',
    //     htmlString: '',
    // }),
    computed: {},
    watch: {
        d3Data() {
            var container = {
                name: "main",
                children: this.d3Data
            }
            // this.Id = this.funTree(this.d3Data)
            this.Id = this.funTree(container)
        }
    },
    methods: {

        getHtmlsPerSession: async function() {
            // let wsId = "massive-skunk-85"
            // let wsId = "hungry-cat-75"
            // let wsId = "wonderful-newt-54/"
            // let wsId = "tasty-lionfish-70" // copies
            let wsId = "short-turtle-55" // transclusions
            let version = await fetch("https://webstrates.cs.au.dk/" + wsId + "/?v").then(response => response.json())
            let webpageInitial = await fetch("https://webstrates.cs.au.dk/" + wsId + "/" + version.version + "/?raw")
            let htmlResultInitial = await webpageInitial.text()
            console.dir('html is fetched successfully')
            return htmlResultInitial
        },
    },
    async created() {},
    async mounted() {
        
        this.htmlString = await this.getHtmlsPerSession()

        // console.dir(this.htmlString)
        
        var extractSummary = function(iCalContent) {
            var arr = iCalContent.match(/\<iframe src="\/(.*?)\/".*/gi)
            arr !== null && arr.map(string => string.replace(/^\<iframe src="\//gi, '').replace(/\//g, ''))
            
            return(arr);
        }

        // var string = '<iframe src="/wicked-wombat-56/"></iframe>'

        console.dir(this.htmlString)
        console.dir(extractSummary(this.htmlString))
        
        
        this.htmlObject = new DOMParser().parseFromString(this.htmlString, "text/html")
        this.d3Data = await this.init()

        // SOLVED: parse tags
        this.fetchTags("wicked-wombat-56")

        this.sqEnhanced("soft-catfish-41")
    }
})
