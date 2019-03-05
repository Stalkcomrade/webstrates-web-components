window.layoutGridComponent = Vue.component('layout-grid-component', {
    // mixins: [window.transclusion, window.networkUpd],
    components: {
        // 'd3-timeine': window.d3Timeline,
        'd3-player': window.d3Player,
        // 'd3-icicle-vertical': window.d3ICicleVertical,
        // 'd3-vertical-slider': window.d3VerticalSlider,
        // 'layout-grid': window.layoutGridComponent
    },
    template: `
        <div>

<layout-grid
    :editable="true"
    :margin="[10, 30]"
    :row-height="100"
    :min-w="1">
</layout-grid>

                 </div>
`,

    mounted() {

        // this.$store.commit('LayoutGrid/ADD_LAYOUT_ITEM', {
        //         title: 'Alerts',
        //         is: 'd3-player',
        //         w: 12,
        //         h: 3,
        //         data: {
        //             // props of d3-timeline
        //             data: [{
        //                     from: new Date() - 10,
        //                     to: new Date(),
        //                     // tooltip
        //                     title: 'new',
        //                     label: 'new',
        //                     group: 'new',
        //                     // internally we have 4 className, they are 'entry--point--default', 'entry--point--success', 'entry--point--warn', 'entry--point--info'
        //                     // you can also specify your own class and add it to SPA. The class shouldn't be in scoped style
        //                     className: 'entry--point--default'
        //                 },
        //                 {
        //                     from: new Date() - 100,
        //                     to: new Date(),
        //                     // tooltip
        //                     title: 'new1',
        //                     label: 'new1',
        //                     group: 'new1',
        //                     // internally we have 4 className, they are 'entry--point--default', 'entry--point--success', 'entry--point--warn', 'entry--point--info'
        //                     // you can also specify your own class and add it to SPA. The class shouldn't be in scoped style
        //                     className: 'entry--point--default'
        //                 }
        //             ],
        //             // options: {...},
        //             width: '100%',
        //             height: '100%'
        //         }
        //     });


    }

})