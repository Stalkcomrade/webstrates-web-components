webstrate.on('loaded', () => {

    // SOLVED: dividing slider versions on initial and latest
    
    window.store = new Vuex.Store({
        state: {
            currentNode: '',
            webstrateId: 'hungry-cat-75',
            sessionObject: '',
            sliderVersions: [1,2],
            // currentRoute: 'default'
        },
        getters: {
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
            // currentRouteGet: state => {
            //     return state.currentRoute
            // }
        },
        mutations: {
            changeCurrentNode (state, payload) {
                state.currentNode = payload
            },
            changeCurrentSessionObject (state, payload) {
                state.sessionObject = payload
            },
            changeCurrentWebstrateId (state, payload) {
                state.webstrateId = payload
            },
            changeSliderVersions (state, payload) {
                state.sliderVersions = payload
            }
        }
    })


})
