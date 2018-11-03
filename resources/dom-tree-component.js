window.DomTreeComponent = Vue.component('dom-tree', {
    template: `
  <span v-html="finalHtml"></span>
`,
    // template: `
    // <div id="tree" class="tree">
    //    <div v-bind:style="customStyle">
    //     <h2 v-bind:style="customStyle"> </h2>
    //     <h3 v-bind:style="customStyle"> </h3>
    //   </div>
    // </div>
    // `,
    data: () => ({
        finalHtml: '',
        htmlObjectReady: false,
        htmlString: `<!doctype html>
<html>
<body>
<p>Loading Webstrates</p>

<div id="tree" class="tree">
   <div v-bind:style="customStyle">
    <h2 v-bind:style="customStyle"> </h2>
    <h3 v-bind:style="customStyle"> </h3>
  </div>

<div class="spinner"></div>
<style type="text/css" media="screen">
body {
	font-family: sans-serif;
	font-weight: 200;
	-webkit-font-smoothing: antialiased;
	text-align: center;
	margin-top: 15%;
	animation: fadein 1s;
}
@keyframes fadein {
	0% { opacity: 0; }
	100% { opacity: 1; }
}
.spinner {
	width: 40px;
	height: 40px;
	margin: 0 auto;
	background-color: #31a46f;
	animation: rotateplane 1.2s infinite ease-in-out;
}
@keyframes rotateplane {
	0% { transform: perspective(120px) rotateX(0deg) rotateY(0deg); }
	50% { transform: perspective(120px) rotateX(-180.1deg) rotateY(0deg); }
	100% { transform: perspective(120px) rotateX(-180deg) rotateY(-179.9deg); }
}
</style>

</div>

<script src="/webstrates.js?480cb9f456033650d197"></script>
</body></html>`,
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
            var $el = this.htmlFromData.htmlObject.getElementById('tree')
            // var $el = document.getElementById('tree')
            this.walk($el.children[0], node => {
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
      `
                // populate children with v-style tag
                // node.setAttribute('style', 'color: red')
                // node.setAttribute('v-bind:style', 'customStyle')
                // v-bind:style="customStyle"
            })
            console.dir($el)
            this.finalHtml = $el.innerHTML
        }
    },
    beforeCreate() {},
    created() {},
    mounted() {
        console.dir(this.htmlFromData.htmlObject)
        // document.addEventListener(
        //     'DOMContentLoaded',
        //     App.init.bind(App)
        // )
    }
})