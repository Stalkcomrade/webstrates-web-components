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
        usersPerWs: ''
    }),
    methods: {
        fetchTags: async function(selected) {
            let tags = await fetch("https://webstrates.cs.au.dk/" + selected  + "/?tags").then(results => results.json())
            console.dir(tags)
        },
        // TOOD: range of version instead of a single version
        lastVersion: async function(selected) {
            var versionmax = await fetch("https://webstrates.cs.au.dk/" + selected + "/?v").then(body => body.json())
            return versionmax.version
        },
        getHtmlsPerSessionMixin: async function(selected, initialVersion, finalVersion, snapshot) {

            // FIXME: fetching range of possible versions for the webstrate
            // INFO: currently last one is fetched

            // INFO: use default value if no selected id is specified
            let wsId = typeof selected === "undefined" ? "wonderful-newt-54" : selected
            
            // INFO: use last version available if no is specified
            var versionmax = await fetch("https://webstrates.cs.au.dk/" + wsId + "/?v").then(body => body.json())
            let version = typeof versionmax === "undefined" ? 305 : versionmax.version

            console.dir("VERSION INPUT")
            console.dir(initialVersion)
            
            if (snapshot === true){

                console.dir("SINGLE VERSION inside SESSION FETCHING")

                let webpageInitial = await fetch("https://webstrates.cs.au.dk/" + wsId + "/" + version + "/?raw")
                let htmlResultInitial = await webpageInitial.text()
                console.dir('html is fetched successfully')
                
                return htmlResultInitial
                
            } else {

                console.dir("MULTIPLE VERSION inside SESSION FETCHING")

                // TODO: check whether versions are correct and fetched in the right time
                
                // SOLVED: transform into parameters
                let numberInitial = typeof initialVersion === "undefined"  ? 1 : initialVersion
                let numberLast = typeof finalVersion === "undefined" ? 2 : finalVersion // INFO: if undefined, simply last version

                let webpageInitial = await fetch("https://webstrates.cs.au.dk/" + wsId + "/" + numberInitial + "/?raw")
                let htmlResultInitial = await webpageInitial.text()
                let webpageInitialJson = await fetch("https://webstrates.cs.au.dk/" + wsId + "/" + numberInitial + "/?json")
                let htmlResultInitialJson = await webpageInitialJson.text()

                let webpageLast = await fetch("https://webstrates.cs.au.dk/" + wsId + "/" + numberLast + "/?raw")
                let htmlResultLast = await webpageLast.text()
                let webpageLastJson = await fetch("https://webstrates.cs.au.dk/" + wsId + "/" + numberLast + "/?json")
                let htmlResultLastJson = await webpageLastJson.text()

                let results = await Promise.all([
                    htmlResultInitial,
                    htmlResultLast,
                    htmlResultInitialJson,
                    htmlResultLastJson
                ])
                
                this.$emit('update', results) // INFO: used in timeline-component.js
                
                return [
                    results[0],
                    results[1]
                ]

            }
            
        },
        
        fetchActivityMixin: function(webstrateIdInst) {
            
            const toDate = new Date()
            const fromDate = new Date()
            fromDate.setDate(fromDate.getDate() - 30)

            return dataFetcher('activities', {
                webstrateId: webstrateIdInst,
                toDate,
                fromDate
            })
        },
        // TODO: look for it's use in components
        // INFO: if there is no input, date/month is calculated automatically
        // If there isg, use input value
        fetchDaysOverview: function(inputDate) {

            this.month = month = typeof inputDate === "undefined" ? this.monthProp : inputDate.getMonth()
            this.year = year = typeof inputDate === "undefined" ? this.yearProp : inputDate.getFullYear()
            this.date = typeof inputDate === "undefined" ? new Date(this.year, this.month - 1) : inputDate
            this.maxWebstrates = maxWebstrates = this.maxWebstratesProp

            console.dir("DAY MIXIN")
            console.dir(this.date.getDate())
            console.dir("MONTH MIXIN")
            console.dir(this.month)
            console.dir("YEAR MIXIN")
            console.dir(this.year)
            

            return dataFetcher('month', {
                month,
                year,
                maxWebstrates
            })

        },
        // TODO: change name of the function
        fetchActivityTimeline: function() {

            const month = ((new Date).getMonth() + 1);
            const maxWebstrates = this.maxWebstrates || 20;
            const year = Number(this.year) || (new Date).getFullYear();

            return dataFetcher('month').then((days) => {

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
                console.dir('List of Webstrates Ids is Fetched Successfully')
                return webstrateIds
            })
                .then((body) => {
                    return body
                })
        },

        // FIXME: remove this.versioningRaw
        getOpsJsonMixin: function(input) {
            var current = input !== "undefined" ? input : this.selected
            return fetch("https://webstrates.cs.au.dk/" + current + "/?ops")
                .then((html) => { return html.json() })
                .then((body) => {
                    console.log('Fetched:\n', current)
                    this.versioningRaw = body
                    return body
                })
        }
    }
})

window.dataObjectsCreator = Vue.mixin({
})

window.animationMixin = Vue.mixin({
})


