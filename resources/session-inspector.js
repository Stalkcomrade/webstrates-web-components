// SOLVED: make a new component
// SOLVED: avoid using await and calling other functions from inside functions
// SOLVED: wait for data from session inspector
//// TODO: make a child component emit every time data is fetched 
// TODO: choose initial version/session

window.SessionInspectorComponent = Vue.component('session-inspector', {
    template: `
<div>
<br>
<br>
<br>
<br>

<b-container class="container-fluid">

 <b-row>
<timeline :value="htmlForParent" @update="onChildUpdate"> </timeline>
</b-row>

 <b-row>
     <input v-model="inputVersion" placeholder="edit me">
     <p> Message is: {{ inputVersion }}</p>
 </b-row

<br>
<br>
<br>
<br>

  <b-row>
    <b-col class="col-md-10">
      <div class="treeD3" id="tree-container">
      </div>
      <svg
        id="svgMain"
        :width="width" :height="dx" :viewBox="viewBox"
        style="font: 10px sans-serif; user-select: none;">

        <g
          id="gLink"
          fill="none" stroke="#555" stroke-opacity="0.4" stroke-width="1.5"> </g>
        <g
          id="gNode"
          cursor="pointer"> </g> 
      </svg>
    </b-col>
    <b-col class="col-md-2 text-left">
      <p> {{ currentInnerText }} </p>
    </b-col>
  </b-row>

</b-container>

</div>
        `,
    components: {
        'TimelineComponent': window.TimelineComponent
    },
    data: () => ({
        inputVersion: '',
        currentInnerText: '',
        svg: "",
        rootInstance: '',
        gLink: "",
        gNode: "",
        d3Data: [],
        tree: '',
        diagonal: '',
        d3Object: {},
        finalHtml: '',
        htmlObjectReady: false,
        htmlObject: '',
        htmlString: '',
        htmlForParent: '',
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
    watch: {
        d3Data() {
            console.dir("INSIDE d3Data Watcher")
            
            var container = {
                name: "main",
                children: this.d3Data
            }
            this.rootInstance = this.root(container)
            this.update(this.rootInstance)

        },
    },
    computed: {
        viewBox() {
            return [-this.margin.left, -this.margin.top, this.width, this.dx]
        }
    },
    methods: {
        onChildUpdate (newValue) { // INFO: it is used to catch htmls from timeline component
            console.dir("Updated")
            this.htmlString = newValue[0] // SOLVED: make a parent listen to child instead of using global scopes
            this.htmlObject = new DOMParser().parseFromString(this.htmlString, "text/html")
            this.d3Data = this.init()
        },
        getSelectors: function() {
            this.svg = d3.select("#svgMain")
            this.gLink = d3.select("#gLink")
            this.gNode = d3.select("#gNode")
        },
        // SOLVED: changing root from computed to function
        root: function(data) {
            var hierarchyTemp = d3.hierarchy(data)
            hierarchyTemp.x0 = this.dy / 2
            hierarchyTemp.y0 = 0
            hierarchyTemp.descendants().forEach((d, i) => {
                d.id = i
                d._children = d.children
                if (d.depth && d.data.name.length !== 7) d.children = null
            })
            console.dir(hierarchyTemp)
            return hierarchyTemp
        },
        changeCurrent: function(innerText) {
            this.currentInnerText = `${innerText}`

        },
        handler: function(e) {
            e.preventDefault();
        },

        // FIXME: here is already an html
        // FIXME: put into mixin with additional argument
        
        getHtmlsPerSession: async function() {

            // FIXME: comment this
            
                let wsId = "wonderful-newt-54"
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
                        class: item.getAttribute("class"),
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
                // SOLVED: root is not calculated
                // SOLVED: Messed up source and root
                const duration = d3.event && d3.event.altKey ? 2500 : 250;
                const nodes = this.rootInstance.descendants().reverse()
                const links = this.rootInstance.links()

                this.tree(this.rootInstance) // Compute the new tree layout.

                let left = this.rootInstance
                let right = this.rootInstance
                this.rootInstance.eachBefore(node => {
                    if (node.x < left.x) left = node;
                    if (node.x > right.x) right = node
                });

                const height = right.x - left.x + this.margin.top + this.margin.bottom

                var self = this

                const transition = this.svg
                    .transition()
                    .duration(duration)
                    .attr("height", height)
                    .attr("viewBox", [-this.margin.left, left.x - this.margin.top, this.width, height])
                    .tween("resize", window.ResizeObserver ? null : () => () => self.svg
                        .dispatch("toggle"));

                // Update the nodes…
                const node = this.gNode.selectAll("g")
                    .data(nodes, d => d.id);

                // Enter any new nodes at the parent's previous position.
                const nodeEnter = node.enter().append("g")
                    .attr("transform", d => `translate(${source.y0},${source.x0})`)
                    .attr("fill-opacity", 0)
                    .attr("stroke-opacity", 0)
                    .on("click", (d) => {
                        d.children = d.children ? null : d._children
                        self.update(d)
                        this.currentInnerText = d.data.innerText
                    })
                    .on("contextmenu", function(d, i) {
                        d3.event.preventDefault();
                    })
                    .on("mouseover", (d) => {})

                nodeEnter.append("circle")
                    .attr("r", 2.5)
                    .attr("fill", d => d._children ? "#555" : "#999");

                nodeEnter.append("text")
                    .attr("dy", "0.31em")
                    .attr("x", d => d._children ? -6 : 6)
                    .attr("text-anchor", d => d._children ? "end" : "start")
                    .text(d => d.data.name)
                    .style("fill", d => d.data.class == "paragraph code-paragraph" ? "red" : "black")
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
                const link = this.gLink.selectAll("path")
                    .data(links, d => d.target.id);

                // Enter any new links at the parent's previous position.
                const linkEnter = link.enter().append("path")
                    .attr("d", d => {
                        const o = {
                            x: source.x0,
                            y: source.y0
                        };
                        // return this.diagonal({
                        return self.diagonal({
                            source: o,
                            target: o
                        });
                    });

                // Transition links to their new position.
                link.merge(linkEnter).transition(transition)
                    .attr("d", self.diagonal);

                // Transition exiting nodes to the parent's new position.
                link.exit().transition(transition).remove()
                    .attr("d", d => {
                        const o = {
                            x: source.x,
                            y: source.y
                        };
                        // return this.diagonal({
                        return self.diagonal({
                            source: o,
                            target: o
                        });
                    });

                // Stash the old positions for transition.
                this.rootInstance.eachBefore(d => {
                    d.x0 = d.x;
                    d.y0 = d.y;
                });

            },
    },
    beforeCreate() {},
    async created() {},
    async mounted() {

        this.tree = d3.tree().nodeSize([this.dx, this.dy])
        this.diagonal = d3.linkHorizontal().x(d => d.y).y(d => d.x)
        this.getSelectors()

        // INFO: Here I am waiting for data from a child component
        // timeline-component.js - after that I am reading parsing htmls and building trees

        // FIXME: put functions back and watch only for component from a parent
        // // FIXME: put this into watched
        // this.htmlString = await this.getHtmlsPerSession()


        // FIXME: I am using only first html from an array, fix this either
        // this.htmlObject = new DOMParser().parseFromString(this.htmlString, "text/html")
        // FIXME: put into watched
        // this.htmlObject = new DOMParser().parseFromString(this.htmlString[2], "text/html")

        // FIXME: check whether it is working
        // this.d3Data = await this.init()

       
        
    }
})
