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
                let tags = await fetch(window.serverAddress + selected + "/?tags").then(results => results.json())
                return tags
            },
            // SOLVED: range of version instead of a single version
            fetchRangeOfTags: async function(selected) {
                    let tags = await fetch(window.serverAddress + selected + "/?tags").then(results => results.json())
                    let vSession = []
                    tags.forEach(el => vSession.push(el.v))

                    return vSession
                },
                // SOLVED: userGeneratedTags
                // SOLVED: automaticTags - session labels
                filterTags: function(tags) {
                    var sessions = tags.filter((el) => {
                            return el.label.indexOf("Session of ") >= 0
                        }),
                        custom = tags.filter((el) => {
                            return el.label.indexOf("Session of ") < 0
                        })
                    return {
                        sessions: sessions,
                        custom: custom
                    }
                },
                // TOOD: range of version instead of a single version
                lastVersion: async function(selected) {
                        var versionmax = await fetch(window.serverAddress + selected + "/?v")
                            .then(body => body.json())
                        return versionmax.version
                    },
                    /**
                     * 
                     * @param {any} selected - webstrate Id
                     * @param {any} initialVersion - first version to compare
                     * @param {any} finalVersion - second version to compare
                     * @param {boolean} snapshot - whether fetch only last version
                     * @param {numeric} snapshotCustom - fetch input version
                     */
                    getHtmlsPerSessionMixin: async function(selected, initialVersion, finalVersion, snapshot, snapshotCustom) {

                            let tmp = await fetch("https://webstrates.cs.au.dk/horrible-dingo-75/")
                            let tmp1 = await tmp.text()
                            window.tmp2 = new DOMParser().parseFromString(tmp1, "text/html")

                            console.log("tmp2!!!! = ", window.tmp2);

                            let tmpR = await fetch("https://webstrates.cs.au.dk/horrible-dingo-75/3000/?raw")
                            let tmpR1 = await tmpR.text()
                            window.tmpR2 = new DOMParser().parseFromString(tmpR1, "text/html")
                            console.log("tmpR2!!!! = ", tmp2);

                            // FIXME: fetching range of possible versions for the webstrate
                            // INFO: currently last one is fetched
                            // INFO: use default value if no selected id is specified
                            let wsId = typeof selected === "undefined" ? "wonderful-newt-54" : selected

                            // INFO: use last version available if no is specified
                            var versionmax = await fetch(window.serverAddress + wsId + "/?v").then(body => body.json())
                            let version = typeof versionmax === "undefined" ? 1 : versionmax.version

                            console.dir("VERSION INPUT")

                            if (snapshot === true && typeof snapshotCustom !== "undefined" && snapshotCustom !== null) {

                                let webpageInitial = await fetch(window.serverAddress + wsId + "/" + snapshotCustom + "/?raw")
                                let htmlResultInitial = await webpageInitial.text()



                                console.dir('html is fetched successfully')

                                return htmlResultInitial

                            } else if (snapshot === true) {

                                console.dir("SINGLE VERSION inside SESSION FETCHING")

                                let webpageInitial = await fetch(window.serverAddress + wsId + "/" + version + "/?raw")
                                let htmlResultInitial = await webpageInitial.text()
                                console.dir('html is fetched successfully')

                                return htmlResultInitial

                            } else {

                                console.dir("MULTIPLE VERSION inside SESSION FETCHING")

                                // TODO: check whether versions are correct and fetched in the right time

                                // SOLVED: transform into parameters
                                let numberInitial = typeof initialVersion === "undefined" ? 1 : initialVersion
                                let numberLast = typeof finalVersion === "undefined" ? 2 : finalVersion // INFO: if undefined, simply last version

                                let webpageInitial = await fetch(window.serverAddress + wsId + "/" + numberInitial + "/?raw")
                                let htmlResultInitial = await webpageInitial.text()
                                let webpageInitialJson = await fetch(window.serverAddress + wsId + "/" + numberInitial + "/?json")
                                let htmlResultInitialJson = await webpageInitialJson.text()

                                let webpageLast = await fetch(window.serverAddress + wsId + "/" + numberLast + "/?raw")
                                let htmlResultLast = await webpageLast.text()
                                let webpageLastJson = await fetch(window.serverAddress + wsId + "/" + numberLast + "/?json")
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
                        getToday: function() {
                            return new Date()
                        },
                        monthBack: function(date) {
                            return date.setMonth(date.getMonth() - 1)
                        },
                        monthForward: function(date) {
                            return date.setMonth(date.getMonth() + 1)
                        },
                        // FIXME: remove this.versioningRaw
                        getOpsJsonMixin: function(input) {
                            var current = input !== "undefined" ? input : this.selected
                            return fetch(window.serverAddress + current + "/?ops")
                                .then((html) => {
                                    return html.json()
                                })
                                .then((body) => {
                                    console.log('Fetched:\n', current)
                                    this.versioningRaw = body
                                    return body
                                })
                        }
    }
})

window.transclusion = Vue.mixin({
    data: () => ({
        docContainer: '',
        docIframeTransient: ''
    }),
    methods: {
        initiateTransclusion: function() {
            // this.docContainer = document.getElementById("trans-container")
            this.docContainer = document.getElementById("mainBody")
            this.docIframeTransient = document.createElement("transient")
            this.docContainer.appendChild(this.docIframeTransient)
        },
        createIframe: function(webstrateId) {

            var docIframe = document.createElement("iframe")

            docIframe.setAttribute("src", "/" + webstrateId + "/")
            docIframe.setAttribute("id", webstrateId)
            docIframe.setAttribute("style", "display: none;")

            this.docIframeTransient.appendChild(docIframe)

        },
        receiveTags: function(webstrateId) {

            var tr = document.getElementById(webstrateId)

            tr.webstrate.on("transcluded", (iframeWebstrateId) => {

                console.dir("Transclusion done")
                console.dir(iframeWebstrateId)
                console.dir(tr.contentWindow.webstrate.tags())

                tr.contentWindow.webstrate.tag("CUSTOM")
                tr.remove()
            })

        }
    }
})