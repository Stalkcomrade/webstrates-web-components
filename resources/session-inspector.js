// SOLVED: make a new component
// SOLVED: avoid using await and calling other functions from inside functions
// SOLVED: wait for data from session inspector
//// TODO: make a child component emit every time data is fetched 
// TODO: choose initial version/session

window.SessionInspectorComponent = Vue.component('session-inspector', {
    // mixins: [window.dataFetchMixin],
    components: {
        'TimelineComponent': window.TimelineComponent,
        'vueSliderConfigured': window.slider,
        'dom-tree-d3-vue': window.DomTreeD3VueComponent
    },
    template: `
<div>
<br>
<br>
<br>
<br>

<dom-tree-d3-vue>
</dom-tree-d3-vue>

<b-container class="container-fluid">

<br>
<br>

<b-row>

<vue-slider-configured 
           :webstrateId='selected'>
  </vue-slider-configured>

</b-row>

 <b-row>
<timeline-component @update="onChildUpdate"> </timeline-component>
</b-row>

</b-container>

</div>
        `,
    data: () => ({
        selected: 'hungry-cat-75',
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

        
        // this.tree = d3.tree().nodeSize([this.dx, this.dy])
        // this.diagonal = d3.linkHorizontal().x(d => d.y).y(d => d.x)
        // this.getSelectors()
        // INFO: watcher for dom-tree is initialised in mixins
        // this.d3Data = this.getHtmlsPerSessionMixin(this.selected, undefined, undefined, true)
        // FIXME: check whether it is working
        // this.d3Data = await this.init()
        // INFO: Here I am waiting for data from a child component
        // timeline-component.js - after that I am reading parsing htmls and building trees
        // FIXME: put functions back and watch only for component from a parent
        // // FIXME: put this into watched
        // this.htmlString = await this.getHtmlsPerSession()
        // FIXME: I am using only first html from an array, fix this either
        // this.htmlObject = new DOMParser().parseFromString(this.htmlString, "text/html")
        // FIXME: put into watched
        // this.htmlObject = new DOMParser().parseFromString(this.htmlString[2], "text/html")

        

    }
})
