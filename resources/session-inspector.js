// SOLVED: make a new component
// SOLVED: avoid using await and calling other functions from inside functions
// SOLVED: wait for data from session inspector

webstrate.on("loaded", () => {

    window.SessionInspectorComponent = Vue.component('session-inspector', {
        components: {
            'TimelineComponent': window.TimelineComponent,
            'vueSliderConfigured': window.slider,
            'dom-tree-d3': window.DomTreeD3Component
        },
        template: `
<div>
<br>
<br>
<br>
<br>

<dom-tree-d3>
</dom-tree-d3>

<b-container class="container-fluid">

<br>
<br>

<!-- <vue-slider-configured > -->
<!--   </vue-slider-configured> -->

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
        methods: {},
        beforeCreate() {},
        async created() {},
        async mounted() {}
    })

})