window.DomTreeComponent = Vue.component('dom-tree', {
    template: `
<div>
<br>
<br>
<br>
<br>
  <div class="treeUnique" v-html="finalHtml"></div>
</div>
`,
    data: () => ({
        finalHtml: '',
        htmlObjectReady: false,
        htmlObject: '',
        htmlString: '',
        customStyle: {
            height: "4.5vw",
            boxSizing: "border-box",
            position: "absolute",
            display: "block",
            height: "$height",
            bottom: "$height * -2",
            transform: "translateX(5%)",
            fontSize: ".95em",
            textAlign: "center",
            lineHeight: "$height",
            border: "1px solid transparent",
            borderRadius: "3px",
            background: "#999",
            color: "#fff",
            transition: "all .3s"
        },
    }),
    computed: {},
    watch: {},
    methods: {

        getHtmlsPerSession: async function() {
                // let wsId = "massive-skunk-85"
                // let wsId = "hungry-cat-75"
                let wsId = "wonderful-newt-54/"
                let webpageInitial = await fetch("https://webstrates.cs.au.dk/" + wsId + "/" + "282/?raw")
                let htmlResultInitial = await webpageInitial.text()
                console.dir('html is fetched successfully')
                return htmlResultInitial
            },

            getLevelNodes: function(node) {
                return Array.from(node.parentNode.children)
            },

            getChildIndex: function(node) {
                return this.getLevelNodes(node).indexOf(node)
            },

            tagNodeName: function(node) {
                node.innerHTML = node.nodeName + node.innerHTML
            },

            clearInside: function(node) {
                Array.from(node.childNodes).forEach(child => {
                    if (child.nodeName === '#text') {
                        child.remove()

                    }
                })
            },

            handleImage: function(node) {
                if (node.nodeName === 'IMG') {
                    node.src = ''
                    node.alt = 'IMG'
                }
            },

            walk: function(node, cb) {
                cb(node)
                if (node.children.length) {
                    this.walk(node.children[0], cb)
                }
                if (node.nextElementSibling) {
                    this.walk(node.nextElementSibling, cb)
                }
            },

            init: function() {
                console.dir("init starts")
                var $el = this.htmlObject.getElementsByTagName("BODY")[0]
                console.dir($el)
                this.walk($el.children[0], node => {
                    console.dir(node)
                    var levelNodes = this.getLevelNodes(node)
                    var childIndex = this.getChildIndex(node)
                    var width = 90 / levelNodes.length
                    var leftSlice = 100 / levelNodes.length
                    var left = leftSlice * childIndex
                    // var wsElementId = node.attributes[2].value // TODO: check that 2nd index is always wsID
                    this.clearInside(node)
                    this.tagNodeName(node)
                    this.handleImage(node)
                    // it is important not to specify color and background in case of :hover usage
                    node.style.cssText += `;
        width: ${width}%;
        left:  ${left}%;
        line-height: 2.5vw;
      `
                })
                this.finalHtml = $el.innerHTML
                // TODO: map w_ids
            }
    },
    beforeCreate() {},
    async created() {},
    async mounted() {
        this.htmlString = await this.getHtmlsPerSession()
        this.htmlObject = new DOMParser().parseFromString(this.htmlString, "text/html")
        this.init()
    }
})