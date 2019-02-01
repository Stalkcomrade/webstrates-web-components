// SOLVED: make a new component
// SOLVED: avoid using await and calling other functions from inside functions
// SOLVED: wait for data from session inspector
//// TODO: make a child component emit every time data is fetched 
// TODO: choose initial version/session

window.SessionInspectorComponent = Vue.component('session-inspector', {
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

<vue-slider-configured >
  </vue-slider-configured>

 <b-row>
<timeline-component @update="onChildUpdate"> </timeline-component>
</b-row>

</b-container>

</div>
        `,
    data: () => ({
        inputVersion: '',
        currentInnerText: '',
        htmlString: '',
        htmlForParent: '',
    }),
    methods: {
    },
    beforeCreate() {},
    async created() {},
    async mounted() {
    }
})
