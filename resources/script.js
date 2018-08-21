webstrate.on('loaded', () => {

	Vue.config.ignoredElements = ['transient'];

	// Create container and instantiate template.
	const containerElement = document.createElement('transient');
	containerElement.setAttribute('id', 'container');
	const appTemplate = document.querySelector('#appTemplate');
	containerElement.appendChild(appTemplate.content.cloneNode(true));
	document.body.appendChild(containerElement);

	// Define Vue Router.
	const router = new VueRouter({
		routes: [
			{ path: '/', component: OverviewComponent },
			{ path: '/calendar', component: CalendarView },
			{ path: '*', component: { template: '#template-page-not-found '}}
		],
		linkExactActiveClass: 'active'
	});

	// Create Vue application and mount in container.
	const app = new Vue({ router }).$mount(containerElement)

});