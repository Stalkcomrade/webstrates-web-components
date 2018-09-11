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

        const legend = d3.select('ul#legend')

	    const legendList = legend.selectAll('li')
			  .data(this.$parent.breaks)
			  .enter()
			  .append('li')
			  .attr('break', d => d)

	    // legendList
		//   .append('span')
		//   .attr('class', 'color')
		//   .style('background-color', d => this.$parent.d3colorsQuantizeMonth(d+0.1))

        legendList
		  .append('svg')
          .attr('height', 20)
          .attr('width', 20)

        // legendListItems = legend.list.selectAll("")
        
          .append('circle')
          .attr('cx', 10)
          .attr('cy', 14.5)
          .attr('r', 5)
		  // .attr('class', 'color')
		  .style('fill', d => this.$parent.d3colorsQuantizeMonth(d))

        console.dir(this.$parent.d3colorsQuantizeMonth(0))
        console.dir(this.$parent.d3colorsQuantizeMonth(5))
        console.dir(this.$parent.d3colorsQuantizeMonth(15))
        
	    legendList
		  .append('span')
		  .attr('class', 'title')
		  .text(d => d)

        
	  })

    }
  },

  mounted() {
    
    this.mainLegend()
    
  }
  
})
