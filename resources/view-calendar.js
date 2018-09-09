window.CalendarView =  Vue.component('overview', {
	template: `
		<month-view v-bind:monthProp="Number(this.month) || ((new Date).getMonth() + 1)" 
                    v-bind:yearProp="Number(this.year) || (new Date).getFullYear()"
                    v-bind:maxWebstratesProp="20" 
        />
	`,
});
