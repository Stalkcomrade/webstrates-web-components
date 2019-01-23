window.cmc = Vue.component('c-m-c', {
    mixins: [window.transclusion],
    components: {
        'context-menu-component-imported': window.vueContext.VueContext
    },
    template: `

<div>
<context-menu-component-imported ref="menu">
  <ul slot-scope="child">
    <li @click="onClick(child.data)">Option 1</li>
    <li @click="bookmarkCurrentWebstrate(child.data)">Bookmark Webstrate</li>
    <li @click="visitCurrentWebstrate(child.data)">Visit Webstrate</li>
  </ul>
</context-menu-component-imported>
</div>
`,
    methods: {
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
    }

})
