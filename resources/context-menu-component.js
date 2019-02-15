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
      <li @click="visitCurrentWebstrate(child.data)">Visit Webstrate</li>
      <li @click="visitCurrentWebstrate(child.data)">Inspect Sessions</li>
      <li @click="visitCurrentWebstrate(child.data)">Inspect Versions</li>
      <li @click="visitCurrentWebstrate(child.data)">Compare Changes</li>
      <li> ---- </li>
      <li @click="visitCurrentWebstrate(child.data)">Copy Webstrate</li>
      <li @click="inspectSessions">Inspect Sessions</li>
      <li @click="inspectVersions">Inspect Versions</li>
      <li @click="goBack">Go Back</li>
  </ul>
  <ul v-else slot-scope="child">
    <li @click="onClick(child.data)">Option 1</li>
    <li @click="bookmarkCurrentWebstrate(child.data)">Bookmark Webstrate</li>
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
        inspectVersions() {
            this.$router.push({ path: '/time-machine' })
            
        },
        inspectSessions() {
            this.$router.push({ path: '/timeline' })
            
        },
        onClick (data) {
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
            window.location.replace(window.serverAddress + webstrateId + "/")
        },
        copyCurrentWebstrate: function(webstrateId) {
            // http://<hostname>/<webstrateId>?restore=<versionOrTag>
        }
    },
    mounted(){
    }

})
