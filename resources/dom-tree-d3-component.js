window.DomTreeD3Component = Vue.component('dom-tree-d3', {
    template: `
<div>
<br>
<br>
<br>
<br>
  <div class="treeUnique"></div>
</div>
`,
    data: () => ({
        d3Data: [],
        d3Object: {},
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
                let version = 305
                let webpageInitial = await fetch("https://webstrates.cs.au.dk/" + wsId + "/" + version + "/?raw")
                let htmlResultInitial = await webpageInitial.text()
                console.dir('html is fetched successfully')
                return htmlResultInitial
            },

            // get children from parentnoted
            getLevelNodes: function(node) {
                return Array.from(node.parentNode.children)
            },

            // get index of child
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
            // recurcive functions are awesome
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
                window.el = $el.children[0]
                // checking inner HTML or code block

                this.walk($el.children[0], node => {
                    // this.d3Data = Array.push()

                    var levelNodes = this.getLevelNodes(node)

                    this.d3Data.push(levelNodes)
                    // console.dir(levelNodes)
                    // this.d3Object.name = Object.values(levelNodes) // get type and class of element
                    // this.d3Object.children.push()

                })
                this.finalHtml = $el.innerHTML
            },
            // aggregateData: function() {}
    },
    beforeCreate() {},
    async created() {},
    async mounted() {
        this.htmlString = await this.getHtmlsPerSession()
        this.htmlObject = new DOMParser().parseFromString(this.htmlString, "text/html")
        this.init()
        window.d3Data = this.d3Data
    }
})