// TODO: changing root from computed to function

window.DomTreeD3VueComponent = Vue.component('dom-tree-d3-vue', {
    template: `
<div>
<br>
<br>
<br>
<br>

<b-container class="container-fluid">
  <b-row>
    <b-col class="col-md-10">
      <div class="treeD3" id="tree-container">
      </div>
      <svg
        id="svgMain"
        :width="width" :height="dx" :viewBox="viewBox"
        style="font: 10px sans-serif, user-select: none;">

        <g
          id="gLink"
          fill="none" stroke="#555" stroke-opacity="0.4" stroke-width="1.5"> </g>
        <g
          id="gNode"
          cursor="pointer"> </g> 
      </svg>
    </b-col>
    <b-col class="col-md-2 text-left">
    </b-col>
  </b-row>
</b-container>


</div>
`,
    data: () => ({
        currentInnerText: '',
        d3Data: [],
        d3Object: {},
        finalHtml: '',
        htmlObjectReady: false,
        htmlObject: '',
        htmlString: '',
        dx: 10,
        dy: 162.5,
        width: 900,
        margin: {
            top: 10,
            right: 120,
            bottom: 10,
            left: 40
        }
    }),
    computed: {},
    watch: {
        d3Data() {
            var container = {
                name: "main",
                children: this.d3Data
            }
            this.update(this.root)

            // this.Id = this.funTree(container)
            // funTree: function(data) {
            //     this.update(this.root);
            // }
        },
    },
    computed: {

        viewBox() {
            return [-this.margin.left, -this.margin.top, this.width, this.dx]
        },

        tree() {
            return d3.tree().nodeSize([this.dx, this.dy])
        },
        diagonal() {
            return d3.linkHorizontal().x(d => d.y).y(d => d.x)
        },
        root() {
            return d3.hierarchy(this.data)
                .x0(this.dy / 2)
                .y0(0)
                .descendants().forEach((d, i) => {
                    d.id = i
                    d._children = d.children
                    if (d.depth && d.data.name.length !== 7) d.children = null
                })
        },
    },
    methods: {
        changeCurrent: function(innerText) {
            this.currentInnerText = `${innerText}`
        },

        handler: function(e) {
            e.preventDefault();
        },

        getHtmlsPerSession: async function() {
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
            sq: function(input) {

                var target = [] // INFO: local-global scope
                var children = []

                for (var i = 0, len = input.length; i < len; ++i) {
                    var item = input[i]

                    children = {
                        value: item,
                        name: item.getAttribute("__wid"),
                        parent: item.parentElement.getAttribute("__wid"),
                        children: (item.children ? this.sq(item.children) : "No Children"),
                        innerText: item.innerText
                    }
                    target.push(children)
                }
                return target
            },
            init: function() {
                console.dir("init starts")
                var $el = this.htmlObject.getElementsByTagName("BODY")[0]
                window.el = $el.children[0]
                return this.sq(window.el.children)
            },

            update: function(source) {

                const duration = d3.event && d3.event.altKey ? 2500 : 250;
                const nodes = this.root.descendants().reverse();
                const links = this.root.links();


                this.tree(this.root) // Compute the new tree layout.

                let left = this.root;
                let right = this.root;
                this.root.eachBefore(node => {
                    if (node.x < left.x) left = node;
                    if (node.x > right.x) right = node;
                });

                const height = right.x - left.x + this.margin.top + this.margin.bottom;

                // const svg = d3.select("#svgMain")
                // const gLink = svg.append("g")
                //     .attr("fill", "none")
                // const gNode = svg.append("g")
                //     .attr("cursor", "pointer");


                const transition = d3.select("#svgMain")
                    .transition()
                    .duration(duration)
                    .attr("height", height)
                    .attr("viewBox", [-this.margin.left, left.x - this.margin.top, this.width, height])
                    .tween("resize", window.ResizeObserver ? null : () => () => d3.select("#svgMain").dispatch("toggle"));

                // Update the nodes…
                const node = d3.select("gNode").selectAll("g")
                    .data(nodes, d => d.id);

                // Enter any new nodes at the parent's previous position.

                var self = this.changeCurrent

                const nodeEnter = node.enter().append("g")
                    .attr("transform", d => `translate(${source.y0},${source.x0})`)
                    .attr("fill-opacity", 0)
                    .attr("stroke-opacity", 0)
                    .on("click", d => {
                        d.children = d.children ? null : d._children
                        this.update(d)
                        // self.changeCurrent(d.data.innerText)
                        // console.dir(d.data.innerText)
                        // this.currentInnerText = d.data.innerText
                        // self.currentInnerText = d.data.innerText

                        // console.dir(this.currentInnerText)
                        // TODO: put into watch section
                    })
                    .on("contextmenu", function(d, i) {
                        d3.event.preventDefault();
                        // console.dir("right click")
                    })
                    .on("mouseover", (d) => {
                        // console.dir(self)
                        // self(d.data.innerText)
                    })


                nodeEnter.append("circle")
                    .attr("r", 2.5)
                    .attr("fill", d => d._children ? "#555" : "#999");

                nodeEnter.append("text")
                    .attr("dy", "0.31em")
                    .attr("x", d => d._children ? -6 : 6)
                    .attr("text-anchor", d => d._children ? "end" : "start")
                    .text(d => d.data.name)
                    .clone(true).lower()
                    .attr("stroke-linejoin", "round")
                    .attr("stroke-width", 3)
                    .attr("stroke", "white");

                // Transition nodes to their new position.
                const nodeUpdate = node.merge(nodeEnter).transition(transition)
                    .attr("transform", d => `translate(${d.y},${d.x})`)
                    .attr("fill-opacity", 1)
                    .attr("stroke-opacity", 1);

                // Transition exiting nodes to the parent's new position.
                const nodeExit = node.exit().transition(transition).remove()
                    .attr("transform", d => `translate(${source.y},${source.x})`)
                    .attr("fill-opacity", 0)
                    .attr("stroke-opacity", 0);

                // Update the links…
                const link = d3.select("#gLink").selectAll("path")
                    .data(links, d => d.target.id);

                // Enter any new links at the parent's previous position.
                const linkEnter = link.enter().append("path")
                    .attr("d", d => {
                        const o = {
                            x: source.x0,
                            y: source.y0
                        };
                        return this.diagonal({
                            source: o,
                            target: o
                        });
                    });

                // Transition links to their new position.
                link.merge(linkEnter).transition(transition)
                    .attr("d", this.diagonal);

                // Transition exiting nodes to the parent's new position.
                link.exit().transition(transition).remove()
                    .attr("d", d => {
                        const o = {
                            x: source.x,
                            y: source.y
                        };
                        return this.diagonal({
                            source: o,
                            target: o
                        });
                    });

                // Stash the old positions for transition.
                this.root.eachBefore(d => {
                    d.x0 = d.x;
                    d.y0 = d.y;
                });

            },
    },
    beforeCreate() {},
    async created() {},
    async mounted() {
        this.htmlString = await this.getHtmlsPerSession()
        this.htmlObject = new DOMParser().parseFromString(this.htmlString, "text/html")
        this.d3Data = await this.init()
    }
})