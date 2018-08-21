window.WebstrateLegendComponent = Vue.component('webstrate-legend', {
	inherit: true,
	template: '<ul id="legend"></ul>',
	methods: {
		draw: () => {
			console.log('yeah');
		}
	},
	created() {

		console.log('listen', this.$parent);
		this.$on('webstrateIds', (webstrateIds, d3colors) => {
			console.log('got it?', webstrateIds);
		});
	}
});
/*
var ChildComponent = {
  template: '<div>{{value}}</div>',
  data: function () {
    return {
      value: 0
    };
  },
  methods: {
    setValue: function(value) {
        this.value = value;
    }
  }
}

new Vue({
  el: '#app',
  components: {
    'child-component': ChildComponent
  },
  created: {
   	console.log(this.$refs);
  }
});
*/
/*
			const legend = d3.select('ul#legend');

			const legendList = legend.selectAll('li')
				.data(webstrateIds)
				.enter()
				.append('li')
				.attr('webstrateId', d => d)

			legendList
					.append('span')
					.attr('class', 'color')
					.style('background-color', d => d3colors(d))

			legendList
					.append('span')
					.attr('class', 'title')
					.text(d => d);
*/