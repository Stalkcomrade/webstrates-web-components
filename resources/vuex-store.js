webstrate.on('loaded', () => {

    // SOLVED: dividing slider versions on initial and latest
    Vue.config.devtools = true;

    window.store = new Vuex.Store({
        state: {
            listWebstrates: '', // INFO: list of webstrates
            contextMenuObject: '', // INFO: transfering data 
            contextMenuContext: '', // INFO: using this on order to pop-up approp version
            currentGraphData: '',
            currentNode: '',
            currentNodeInitial: '',
            currentNodeLatest: '',
            // webstrateId: 'hungry-cat-75',
            webstrateId: 'dry-goat-98',
            sessionObject: '',
            sliderVersions: [1, 2], // INFO: versioning
        },
        getters: {
            // FIXME:
            currentNodeGet: state => {
                return state.currentNode
            },
            initialVersionGet: state => {
                return state.sliderVersions[0]
            },
            latestVersionGet: state => {
                return state.sliderVersions[1]
            },
            sliderVersionsFullGet: state => {
                return [getters.initialVersionGet, getters.latestVersionGet]
            },
        },
        mutations: {
            changeGraphData(state, payload) {
                state.GraphData = payload
            },
            changeWebstratesList(state, payload) {
                state.listWebstrates = payload
            },
            changeContextMenuContext(state, payload) {
                state.contextMenuContext = payload
            },
            changeContextMenuObject(state, payload) {
                state.contextMenuObject = payload
            },
            // FIXME: legacy
            changeCurrentNode(state, payload) {
                state.currentNode = payload
            },
            changeCurrentNodeInitial(state, payload) {
                state.currentNodeInitial = payload
            },
            changeCurrentNodeLatest(state, payload) {
                state.currentNodeLatest = payload
            },
            changeCurrentSessionObject(state, payload) {
                state.sessionObject = payload
            },
            changeCurrentWebstrateId(state, payload) {
                state.webstrateId = payload
            },
            changeSliderVersions(state, payload) { // INFO: change both versions
                state.sliderVersions = payload
            },
            changeInitialVersion(state, payload) { // INFO: change intial version
                state.sliderVersions[0] = payload
            },
            changeLatestVersion(state, payload) { // INFO: change intial version
                state.sliderVersions[1] = payload
            }

        },
        actions: {
            async getWebstratesList(context) {

                if (this.$store.state.listWebstrates === '') {

                    var inputDate = new Date()

                    var month = typeof inputDate === "undefined" ?
                        this.monthProp :
                        inputDate.getMonth()
                    var year = typeof inputDate === "undefined" ?
                        this.yearProp :
                        inputDate.getFullYear()
                    var date = typeof inputDate === "undefined" ?
                        new Date(this.year, this.month - 1) :
                        inputDate
                    var maxWebstrates = 50

                    var days = await dataFetcher('month', {
                        month,
                        year,
                        maxWebstrates
                    })


                    let webstrateIds = new Set();

                    Object.values(days).forEach(day => {
                        Object.keys(day).forEach(webstrateId => {
                            webstrateIds.add(webstrateId)
                        })
                    })

                    webstrateIds = Array.from(webstrateIds).sort()

                    console.log('List of Webstrates Ids is Fetched Successfully via Vuex Store', webstrateIds)
                    context.commit('changeWebstratesList', webstrateIds)

                } else {
                    console.log("No need to update webstrates list")
                }


            }
        }
    })
})