window.cmc = Vue.component('c-m-c', {
    mixins: [window.transclusion],
    components: {
        'context-menu-component-imported': window.vueContext.VueContext
    },
    template: `

<div>

<context-menu-component-imported ref="menu">

 <ul v-if="currentRoute === '/dom-tree-d3'" slot-scope="child">
      <li @click="onClick(child.data)">Option 1</li>
  </ul>
  <ul v-else-if="currentRoute === '/calendar'" slot-scope="child">
      <li @click="visitCurrentWebstrate">Visit Webstrate</li>
      <li @click="visitCurrentWebstrate(child.data)">Copy Webstrate</li>
      <li> ---- </li>
      <li @click="inspectSessions">Inspect Sessions</li>
      <li @click="inspectVersions">Inspect Versions</li>
      <li @click="inspectTree">Inspect Tree</li>
      <li @click="inspectTransclusions">Inspect Transclusions</li>
      <li @click="inspectCopies">Inspect Copies</li>
      <li @click="inspectComplex">Inspect Complex</li>
      <li> ---- </li>
      <li @click="goBack">Go Back</li>
      <li> ---- </li>
      <li @click="$store.dispatch('getWebstratesList')">Store</li>
  </ul>
  <ul v-else slot-scope="child">
    <li @click="inspectTree">Inspect Diff in Selected Sessions</li>
    <li @click="visitCurrentWebstrate(child.data)">Visit Webstrate</li>
  </ul>

</context-menu-component-imported>
</div>
`,
    computed: {
        currentRoute() {
            return this.$route.path
        }
    },
    methods: {
        goBack() {
            this.$router.go(-1)
        },
        inspectTransclusions() {
            this.$store.commit("changeCurrentWebstrateId", this.$store.state.contextMenuObject)
            // this.$router.push({ name: 'foo', })
            this.$router.push({
                path: '/transclusion1',
                params: {
                    modeProp: 'transclusion'
                }
            })
        },
        inspectCopies() {
            this.$store.commit("changeCurrentWebstrateId", this.$store.state.contextMenuObject)
            this.$router.push({
                path: '/transclusion1',
                params: {
                    modeProp: 'copy'
                }
            })
            // INFO: if it is called from calendar - mutate webstrateId from node, if not - use current wsId
        },
        inspectTree() {
            this.$route === "/calendar" && this.$store.commit("changeCurrentWebstrateId", this.$store.state.contextMenuObject)
            this.$router.push({
                path: '/dom-tree-d3'
            })
        },
        inspectComplex() {
            this.$store.commit("changeCurrentWebstrateId", this.$store.state.contextMenuObject)
            this.$router.push({
                path: '/session-inspector'
            })
        },
        inspectVersions() {
            this.$router.push({
                path: '/time-machine'
            })
        },
        inspectSessions() {
            this.$router.push({
                path: '/timeline'
            })
        },
        onClick(data) {
            console.dir("!!!")
            console.dir(data)
        },
        bookmarkCurrentWebstrate: function(webstrateId) {
            this.initiateTransclusion()
            this.createIframe(webstrateId)
            this.receiveTags(webstrateId)
            console.dir(webstrateId)
        },
        visitCurrentWebstrate: function(webstrateId) {
            window.open(window.serverAddress + this.$store.state.contextMenuObject + "/", '_blank') // INFO: new tabs
        },
        // TODO: 
        copyCurrentWebstrate: function(webstrateId) {
            // http://<hostname>/<webstrateId>?restore=<versionOrTag>
        }
    },
    mounted() {}

})