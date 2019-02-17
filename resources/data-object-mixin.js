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

            var externalContributors = arrFromSet.indexOf(userId) > -1 ?
                true :
                false

            return externalContributors

        },
        // /**
        //  * function is used for:
        //  *   making intermediate object for timeline component
        //  *   making object for slider component
        //  * @param {any} versioningParsed
        //  */
        // processData: function(versioningParsed) {

        //     // TODO: put into mixins later
        //     var sessionObject = versioningParsed.map(element => ({
        //         timestamp: element.m.ts,
        //         version: element.v,
        //         sessionId: (Object.keys(element).indexOf("session") !== -1) ? element.session.sessionId : 0,
        //         connectTime: (Object.keys(element).indexOf("session") !== -1) ? element.session.connectTime : 0,
        //         userId: (Object.keys(element).indexOf("session") !== -1) ? element.session.userId : 0
        //     }))

        //     // INFO: filtering non-sessions
        //     sessionObject = Object.keys(sessionObject).map(key => sessionObject[key])
        //         .filter(element => (element.sessionId !== 0))

        //     console.log("sessionObject = ", sessionObject);

        //     this.$store.commit("changeCurrentSessionObject", sessionObject)

        //     // making Set to identify unique session and max/min
        //     var sessionGrouped = _.chain(sessionObject)
        //         .groupBy("sessionId")
        //         .map(session => ({
        //             "sessionId": session[0]['sessionId'],
        //             "connectTime": session[0]['connectTime'],
        //             "users": [...new Set(_.map(session, "userId"))],
        //             "maxConnectTime": _.maxBy(session, "timestamp")['timestamp'],
        //             "minConnectTime": _.minBy(session, "timestamp")['timestamp'],
        //             "maxVersion": _.maxBy(session, "timestamp")['version'],
        //             "minVersion": _.minBy(session, "timestamp")['version']
        //         })).value()

        //     console.log("sessionGrouped = ", sessionGrouped);
        //     console.dir('Data is Processed Successfully, session-grouped:', sessionGrouped)

        //     this.sessionGrouped = sessionGrouped
        //     return sessionGrouped
        // }
})