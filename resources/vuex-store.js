webstrate.on('loaded', () => {

    window.store = new Vuex.Store({
        state: {
            currentNode: ''
        },
        getters: {
            currentNodeGet: state => {
                return state.currentNode
            }
        },
        mutations: {
            changeCurrentNode (state, payload) {
                state.currentNode = payload
            }
        }
    })


})
