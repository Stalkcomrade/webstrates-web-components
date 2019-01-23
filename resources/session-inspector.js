// SOLVED: make a new component
// SOLVED: avoid using await and calling other functions from inside functions
// SOLVED: wait for data from session inspector
//// TODO: make a child component emit every time data is fetched 
// TODO: choose initial version/session

window.SessionInspectorComponent = Vue.component('session-inspector', {
    template: `
<div>
<br>
<br>
<br>
<br>

<b-container class="container-fluid">

 <b-row>
<timeline :value="htmlForParent" @update="onChildUpdate"> </timeline>
</b-row>

 <b-row>
     <input v-model="inputVersion" placeholder="edit me">
     <p> Message is: {{ inputVersion }}</p>
 </b-row

<br>
<br>
<br>
<br>

  <b-row>
    <b-col class="col-md-10">
      <div class="treeD3" id="tree-container">
      </div>
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
    components: {
        'TimelineComponent': window.TimelineComponent
    },
    data: () => ({
        inputVersion: '',
        currentInnerText: '',
        htmlString: '',
        htmlForParent: '',
    }),
    methods: {
        // getHtmlsPerSession: async function() {
        //     // FIXME: comment this
        //     let wsId = "wonderful-newt-54"
        //     let version = 305
        //     let webpageInitial = await fetch(window.serverAddress + wsId + "/" + version + "/?raw")
        //     let htmlResultInitial = await webpageInitial.text()
        //     console.dir('html is fetched successfully')
        //     return htmlResultInitial
        // },
    },
    beforeCreate() {},
    async created() {},
    async mounted() {

        this.tree = d3.tree().nodeSize([this.dx, this.dy])
        this.diagonal = d3.linkHorizontal().x(d => d.y).y(d => d.x)
        this.getSelectors()

        // INFO: Here I am waiting for data from a child component
        // timeline-component.js - after that I am reading parsing htmls and building trees

        // FIXME: put functions back and watch only for component from a parent
        // // FIXME: put this into watched
        // this.htmlString = await this.getHtmlsPerSession()


        // FIXME: I am using only first html from an array, fix this either
        // this.htmlObject = new DOMParser().parseFromString(this.htmlString, "text/html")
        // FIXME: put into watched
        // this.htmlObject = new DOMParser().parseFromString(this.htmlString[2], "text/html")

        // FIXME: check whether it is working
        // this.d3Data = await this.init()

       
        
    }
})
