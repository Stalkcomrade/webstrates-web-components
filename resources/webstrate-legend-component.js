window.WebstrateLegendComponent = Vue.component('webstrate-legend', {
    inherit: true,
    template: '<ul id="legend"></ul>',
    created() {
        console.log('listen to ', this.$parent)
        // this.$parent.$on('webstrateIds', (webstrateIds) => {
        //   console.log('got it?', webstrateIds)
        // })
    },

    methods: {
        mainLegend() {

            this.$parent.$on('webstrateIds', () => {
                // console.log('got it?', this.$parent.arrayRadius)

                var lineheight = 14,
                    boxmargin = 4

                var title = ['Activity Thresholds'],
                    titleheight = title.length * lineheight + boxmargin

                const legend = d3.select('ul#legend')

                legend.selectAll("text")
                    .data(title)
                    .enter()
                    .append("text")
                    .attr("class", "legend-title")
                    .attr("y", (d, i) => {
                        return (i + 1) * lineheight - 2
                    })
                    .text((d) => {
                        return d
                    })


                const legendList = legend.selectAll('div')
                    .data(this.$parent.breaks)
                    .enter()
                    .append('div')
                    .attr('break', d => d)

                legendList
                    .append('svg')
                    .attr('height', 20)
                    .attr('width', 20)
                    .append('circle')
                    .attr('cx', 10)
                    .attr('cy', 14.5)
                    .attr('r', 5)
                    .style('fill', d => this.$parent.d3colorsQuantizeMonth(d))

                legendList
                    .append('span')
                    .attr('class', 'title')
                    // .text(d => d)
                    .text(function(d, i) {
                        if (i == 0) {
                            return "low"
                        }
                        if (i == 1) {
                            return "med"
                        }

                        if (i == 2) {
                            return "high"
                        }
                    })


            })

        }
    },

    mounted() {
        this.mainLegend()
    }

})