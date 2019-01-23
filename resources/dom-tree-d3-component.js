window.DomTreeD3Component = Vue.component('dom-tree-d3', {
    mixins: [window.dataFetchMixin, window.network],
    props: ['InnerTextToShow'],
    template: `
<div>
<br>
<br>
<br>
<br>

<b-container class="container-fluid">
  <b-row>
    <b-col class="col-md-10">
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
        htmlString: '',
    }),
    watch: {
        d3Data() {
            var container = {
                name: "main",
                children: this.d3Data
            }
            this.rootInstance = this.root(container)
            this.update(this.rootInstance)

        // currentInnerText() {
        //     this.InnerTextToShow = this.currentInnerText
        //     console.dir(this.InnerTextToShow)
            // }
        }
    },
    beforeCreate() {},
    async created() {},
    async mounted() {

        this.tree = d3.tree().nodeSize([this.dx, this.dy])
        this.diagonal = d3.linkHorizontal().x(d => d.y).y(d => d.x)
        this.getSelectors()
        
        this.htmlString = await this.getHtmlsPerSessionMixin("wonderful-newt-54", undefined, undefined, true)
        this.htmlObject = new DOMParser().parseFromString(this.htmlString, "text/html")
        this.d3Data = await this.init()
        
    }
})
