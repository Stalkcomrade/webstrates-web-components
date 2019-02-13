webstrate.on('loaded', () => {

    // SOLVED: dividing slider versions on initial and latest
    
    window.store = new Vuex.Store({
        state: {
            contextMenuObject: '', // INFO: transfering data 
            contextMenuContext: '', // INFO: using this on order to pop-up approp version
            currentNode: '',
            webstrateId: 'hungry-cat-75',
            sessionObject: '',
            sliderVersions: [1,2],
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
        },
        mutations: {
            changeContextMenuContext (state, payload) {
                state.changeContextMenuContext = payload
            },
            changeContextMenuObject (state, payload) {
                state.contextMenuObject = payload
            },
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
