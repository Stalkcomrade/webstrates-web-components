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
        selectOptions: '',
        month: '',
        year: '',
        maxWebstrates: '',
        // data: '', // FIXME: might produce issues
        usersPerWs: ''
    }),
    methods: {
        getHtmlsPerSessionMixin: async function(selected) {

            // SOLVED: transform into parameters
            this.wsId = selected
            // this.wsId = "hungry-cat-75"
            // this.wsId = "massive-skunk-85"

            // FIXME: transform into parameters
            // TODO: fetching range of possible versions for the webstrate
            // TODO: check whether versions are correct and fetched in the right time

                let numberInitial = 1
                let numberLast = 200

                // let webpageInitial = await fetch("https://webstrates.cs.au.dk/hungry-cat-75/" + "10/")
                // let webpageInitial = await fetch("https://webstrates.cs.au.dk/wicked-wombat-56/" + "3000/?raw")
                let webpageInitial = await fetch("https://webstrates.cs.au.dk/" + this.wsId + "/" + numberInitial + "/?raw")
                let htmlResultInitial = await webpageInitial.text()
                let webpageInitialJson = await fetch("https://webstrates.cs.au.dk/" + this.wsId + "/" + numberInitial + "/?json")
                let htmlResultInitialJson = await webpageInitialJson.text()

                // let webpageLast = await fetch("https://webstrates.cs.au.dk/hungry-cat-75/" + "4000/")
                let webpageLast = await fetch("https://webstrates.cs.au.dk/" + this.wsId + "/" + numberLast + "/?raw")
                let htmlResultLast = await webpageLast.text()
                let webpageLastJson = await fetch("https://webstrates.cs.au.dk/" + this.wsId + "/" + numberLast + "/?json")
                let htmlResultLastJson = await webpageLastJson.text()

                let results = await Promise.all([
                    htmlResultInitial,
                    htmlResultLast,
                    htmlResultInitialJson,
                    htmlResultLastJson
                ])
            // console.dir(results)
            // this.$emit('update', results)
            return [
                results[0],
                results[1]
            ]
        },
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
        // TODO: change name of the function
        fetchActivityTimeline: function() {

            return new Promise((resolve, reject) => {

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
                    this.selectOptions = webstrateIds
                    console.dir('List of Webstrates Ids is Fetched Successfully')
                }).then(() => resolve())
            })

        },

        getOpsJsonMixin: function() {
            fetch("https://webstrates.cs.au.dk/" + this.selected + "/?ops")
                .then(html => html.text())
                .then(body => {
                    console.log('Fetched:\n', this.selected)
                    this.versioningRaw = body
                })
        }
    }
})
