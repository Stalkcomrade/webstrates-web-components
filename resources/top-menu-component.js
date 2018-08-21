const topMenuComponent = Vue.component('top-menu', {
	template: '#template-topmenu',
	data: () => ({

	}),
	watch: {
		'$router'() {
			console.log('wtf');
			this.isActive = this.$router.currentRoute.path;
		}
	},
	methods: {
		isActive(path) {
			console.log('isActive', path);
			return this.$router.currentRoute.path === path;
		}
	},
	events: {
		'blah': (data) => {
			console.log('got data', data, this);
		}
	}
});