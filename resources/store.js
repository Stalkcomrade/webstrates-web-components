var webstrateIdProp = "terrible-chipmunk-57"
var view = "overview"


window.mixin = Vue.mixin({
    props: ['value', 'relationName'],
    data: () => ({
        inputVal: this.value,
        view
    }),
    methods: {
        changeView: function(value, webstrateId) {
            this.$parent.$emit('input', value)
            this.$parent.$emit('update:relationName', webstrateId)
            this.$parent.$emit('click', webstrateId)
        },
        testSync: function(value) {
            this.$parent.$emit('update:relationName', value)

        },
        checkEvent: function(valueCheck) {
            this.$parent.$emit('click', valueCheck)
        }
    }
})


window.dataFetchMixin = Vue.mixin({
    props: ["monthProp", "yearProp", "maxWebstratesProp"],
    data: () => ({
        options: '',
        month: '',
        year: '',
        maxWebstrates: '',
        // data: '', // FIXME: might produce issues
        usersPerWs: ''
    }),
    methods: {
        fetchActivity: function(webstrateIdInst) {

            const toDate = new Date()
            const fromDate = new Date()
            fromDate.setDate(fromDate.getDate() - 7)

            const activityPromise = dataFetcher('activities', {
                webstrateId: webstrateIdInst,
                toDate,
                fromDate,
                // userId: 'Stalkcomrade:github' // TODO: add userID
            })

            let usersPerWsSet = new Set()
            let arrFromSet = []

            activityPromise.then((data) => {

                Object.values(data).forEach(int => {
                    Object.values(int).forEach(intN => {
                        usersPerWsSet.add(intN.userId)
                    })
                })

                arrFromSet = Array.from(usersPerWsSet)
                this.usersPerWs = `${arrFromSet}`
            })

        },
        fetchActivityTimeline: function() {

            return new Promise((resolve, reject) => {

                this.date = (new Date(this.year, this.month - 1)).toLocaleDateString(undefined, {
                    month: 'long',
                    year: 'numeric'
                })

                const month = Number(this.month) || ((new Date).getMonth() + 1);
                const maxWebstrates = this.maxWebstrates || 20;
                const year = Number(this.year) || (new Date).getFullYear();

                dataFetcher('month').then((days) => {

                    let webstrateIds = new Set();
                    let effortTotal = new Set();

                    Object.values(days).forEach(day => {
                        Object.keys(day).forEach(webstrateId => {
                            webstrateIds.add(webstrateId)
                        });

                        Object.values(day).forEach(singleEffort => {
                            effortTotal.add(singleEffort)
                        })
                    })
                    webstrateIds = Array.from(webstrateIds).sort()
                    this.options = webstrateIds
                    console.dir('List of Webstrates Ids is Fetched Successfully')
                }).then(() => resolve())
            })

        }
    }
})