window.dataObjectsCreator = Vue.mixin({
    methods: {
        listOfWebstrates: function(days) { // INFO: resulted fetched promise should be days object

            let webstrateIds = new Set();

            Object.values(days).forEach(day => {
                Object.keys(day).forEach(webstrateId => {
                    webstrateIds.add(webstrateId)
                })
            })
            
            webstrateIds = Array.from(webstrateIds).sort()
            console.dir('List of Webstrates Ids is Fetched Successfully')
            
            return webstrateIds
            
        }
    },

    /**
     * 
     * @param {any} fetchActivityMixinPromise - promise from fetch activity
     */
    extractContributors: async function(fetchActivityMixinPromise) {

        console.log("!!!!")
        
        let usersPerWsSet = new Set()
        let arrFromSet = []

        var dataFetched = await fetchActivityMixinPromise
        console.log("dataFetched = ", dataFetched);
        

        Object.values(dataFetched).forEach(int => {
            Object.values(int).forEach(intN => {
                usersPerWsSet.add(intN.userId)
            })
        })

        arrFromSet = Array.from(usersPerWsSet)

        var externalContributors = arrFromSet.indexOf(userId) > -1
            ? true
            : false
        
        return externalContributors

    },
})
