var webstrateIdProp = "terrible-chipmunk-57"
var view = "overview"


const mixin = Vue.mixin({
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


const dataFetchMixin = Vue.mixin({
    props: ["monthProp", "yearProp", "maxWebstratesProp"],
    data: () => ({
        month: '',
        year: '',
        maxWebstrates: '',
        data: '',
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

        }
    }
})