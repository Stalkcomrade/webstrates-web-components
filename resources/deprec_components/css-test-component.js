window.CssTestComponent = Vue.component('css-test', {
    template: `<div class="treeUnique" id=treeUnique>
 
<div id="som">HAH</div>

<h2>s</h2>
<h3>n</h3>

</div>`,

    data: () => ({
        finalHtml: '',
        htmlObjectReady: false,
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
        secondStyle: {

        }
    }),
    computed: {
        htmlFromData: function() {
            const htmlObject = new DOMParser().parseFromString(this.htmlString, "text/html")
            this.htmlObjectReady = true
            return {
                htmlObject
            }
        }
    },
    watch: {
        htmlObjectReady() {
            this.init()
            console.dir("watched!")
        },
    },
    methods: {

        getLevelNodes: function(node) { // used for indexing
            return Array.from(node.parentNode.children)
        },

        getChildIndex: function(node) { // used for indexing
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
        // used for recursive walk
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
            var $el = document.getElementById('treeUnique')
            // var $el = document.getElementsByClassName('treeUnique')[0].children
            // window.element = this.htmlFromData.htmlObject.getElementById('tree')
            // d3.selectAll('div')
            this.walk($el.children[0], node => {
                // d3.select(node)
                //     .attr("wsId", node.attributes[2].value)
                var levelNodes = this.getLevelNodes(node)
                var childIndex = this.getChildIndex(node)
                var width = 90 / levelNodes.length
                var leftSlice = 100 / levelNodes.length
                var left = leftSlice * childIndex
                this.clearInside(node)
                this.tagNodeName(node)
                this.handleImage(node)
                node.style.cssText += `;
        width: ${width}%;
        left: ${left}%;
        boxSizing: border-box;
        position: absolute;
        display: block;
        height: 4.5vw;
        bottom: 4.5vw * -2;
        transform: translateX(5%);
        fontSize: .95em;
        textAlign: center;
        lineHeight: 4.5vw;
        border: 1px solid transparent;
        border-radius: 3px;
        color: #fff;
        transition: all .3s;
      `
            })
            this.finalHtml = $el.innerHTML
        }
    },
    beforeCreate() {},
    created() {},
    mounted() {
        this.init()
    }



})