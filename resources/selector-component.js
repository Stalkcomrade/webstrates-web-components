window.selectorComponent = Vue.component('selector-component', {
    mixins: [window.dataFetchMixin, window.dataObjectsCreator],
    template: `
        <div>
              <select v-model="selected">
                 <option v-for="option in options" v-bind:value="option">
                    {{ option }}
                 </option>
              </select>
        </div>
        `,
    computed: {
        selected: { // INFO: if contextMenuContext is "", then default
            get() {
                // return this.$store.state.obj.message
                return this.$store.state.contextMenuObject === '' ?
                    this.$store.state.webstrateId :
                    this.$store.state.contextMenuObject
            },
            set(value) {
                this.$store.commit('changeCurrentWebstrateId', value)
            }
        },
        sessionObjectComp() {
            return this.sessionObject
        }
    },
    // SOLVED: get rid of some of the watchers
    // TODO: keep data of the webstrate
    watch: {
        selected: async function() {

            this.$store.commit("changeCurrentWebstrateId", this.selected)

            let versioningParsed = await this.getOpsJsonMixin(this.selected)
            let sessionGrouped = await this.processData(versioningParsed)

            this.dt = await this.createDataObject(sessionGrouped)
            console.log("Updated in SelectorComponent")
        }
    },
    data: () => ({}),
    methods: {},
    created: async function() {
            var DaysPromise = await this.fetchDaysOverview((new Date))
            this.options = this.listOfWebstrates(DaysPromise)
        },
        async mounted() {}
})