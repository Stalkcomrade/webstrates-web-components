webstrate.on('loaded', () => {

    window.store = new Vuex.Store({
        state: {
            currentNode: '',
            webstrateId: '',
            sessionObject: ''
        },
        getters: {
            currentNodeGet: state => {
                return state.currentNode
            }
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
            }
        }
    })


})
