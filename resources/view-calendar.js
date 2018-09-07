window.CalendarView =  Vue.component('overview', {
	template: `
		<month-view v-bind:month="Number(this.month) || ((new Date).getMonth() + 1)" 
                    v-bind:year="Number(this.year) || (new Date).getFullYear()"
                    v-bind:maxWebstrates="20" 
        />
	`,
});

		// <month-view month=8 maxWebstrates=20 />
