window.DomTreeD3Component = Vue.component('dom-tree-d3', {
    mixins: [window.dataFetchMixin, window.network],
    props: ['InnerTextToShow'],
    template: `
<div>
<br>
<br>
<br>
<br>
<button @contextmenu="handler($event)">r-click</button>
  

<b-container class="container-fluid">
  <b-row>
    <b-col class="col-md-10">
      <div class="treeD3" id="tree-container">
      </div>
    </b-col>
    <b-col class="col-md-2 text-left">
      <p> {{ currentInnerText }} </p>
    </b-col>
  </b-row>
</b-container>


</div>
`,
    // <p> {{ InnerTextToShow }} </p>
    data: () => ({
        currentInnerText: '',
        d3Data: [],
        d3Object: {},
        finalHtml: '',
        htmlObjectReady: false,
        htmlObject: '',
        htmlString: '',
    }),
    watch: {
        d3Data() {
            var container = {
                name: "main",
                children: this.d3Data
            }
            // this.Id = this.funTree(this.d3Data)
            this.Id = this.funTree(container)
        },
        // currentInnerText() {
        //     this.InnerTextToShow = this.currentInnerText
        //     console.dir(this.InnerTextToShow)
        // }
    },
    methods: {
    },
    beforeCreate() {},
    async created() {},
    async mounted() {
        
        this.htmlString = await this.getHtmlsPerSessionMixin("wonderful-newt-54", undefined, undefined, true)
        this.htmlObject = new DOMParser().parseFromString(this.htmlString, "text/html")
        this.d3Data = await this.init()
        
    }
})
