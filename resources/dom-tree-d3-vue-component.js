// SOLVED: make a new component
////// SOLVED: initiate new nested component for diffs
////// SOLVED: try to use render for this purpose
//// TODO: prepare data structure for the versions

// INFO: if there are gonna be issues, check mixins
window.DomTreeD3VueComponent = Vue.component('dom-tree-d3-vue', {
    mixins: [window.dataFetchMixin],
    template: `
<div>
<br>
<br>
<br>
<br>

<b-container class="container-fluid">

<b-row>
 <component :is="dynamicComponent" />
 <component :is="dynamicComponentDiff" />
</b-row>

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
        currentVersionSpan: '',
        svg: "",
        rootInstance: '',
        rootInstanceLatest: '',
        gLink: "",
        gNode: "",
        d3Data: [],
        d3DataLatest: [],
        tree: '',
        diagonal: '',
        d3Object: {},
        finalHtml: '',
        htmlObjectReady: false,
        htmlObject: '',
        htmlString: '',
        htmlStringLatest: '',
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
            var container = {
                name: "main",
                children: this.d3Data
            }
            this.rootInstance = this.root(container)
            window.rTrue = this.rootInstance
            this.update(this.rootInstance)
        },
        // SOLVED: add second watcher
        d3DataLatest() {
            console.dir("d3DataLatest 've been watched")
            var containerLatest = {
                name: "main",
                children: this.d3DataLatest
            }
            this.rootInstanceLatest = this.root(containerLatest)
        },
    },
    computed: {
        viewBox() {
            return [-this.margin.left, -this.margin.top, this.width, this.dx]
        },
        dynamicComponent: function() {
            return {
                template: `<div>${this.currentVersionSpan}</div>`,
                }
        },
        dynamicComponentDiff: function() {
            // [["br", "br", "br"].map(el => (h(el)))]) // SOLVED: returning array in a map 
            var one = 'beep boop',
                other = 'beep boob blah',
                color = '',
                span = null;

            var diff = window.jsdiffTrue.diffChars(one, other)

            return {
                render(h) {
                    return h('div', {
                        'class': 'omg'
                    },
                                 [h('pre', {'id': 'display'},
                                   diff.map(el => (h('span',
                                                    {
                                                        style: {'color': el.added ? 'green' :
                                                                el.removed ? 'red' : 'grey'},
                                                        domProps: {
                                                            innerHTML: el.value
                                                        }
                                                    }))
                                           ))]
                            )
                }
            }
            }
    },
    methods: {
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
            // console.dir(hierarchyTemp)
            return hierarchyTemp
        },
        changeCurrent: function(innerText) {
            this.currentInnerText = `${innerText}`

        },
        handler: function(e) {
            e.preventDefault();
        },

        getHtmlsPerSession: async function() {

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
            init: function(input) {
                console.dir("init starts")
                var $el = input.getElementsByTagName("BODY")[0]
                var el = $el.children[0]
                return this.sq(el.children)
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
        // FIXME: conisider different versions

        let containerTmp = await this.getHtmlsPerSessionMixin("wonderful-newt-54")

        this.htmlString = containerTmp[0]
        this.htmlStringLatest = containerTmp[1]
        
        // TODO: for now, I am just making object with a different name for a the next/previous version of a webstrate
        // Later on, I need to integrate it into one data structure
        
        this.htmlObject = new DOMParser().parseFromString(this.htmlString, "text/html")
        this.htmlObjectVersioned = new DOMParser().parseFromString(this.htmlStringLatest, "text/html")
        
        // TODO: make init to have an input
       
        this.d3Data = await this.init(this.htmlObject)
        this.d3DataLatest = await this.init(this.htmlObjectVersioned)

        var tre = []

        function findSelectedInList(list, propertyName, valueFilter){
            let selected;
            if (typeof Object.values(list) != "undefined" && typeof Object.values(list) != "undefined") {
                Object.values(list).some((currentItem) => {
                    if (typeof currentItem != null) {
                        if (typeof currentItem[propertyName] != "undefined" | typeof currentItem[propertyName] != null) {
                            currentItem[propertyName] === valueFilter ?
                                tre.push(currentItem.innerText) :
                                (typeof currentItem.children != "undefined" && findSelectedInList(currentItem.children, propertyName, valueFilter))
                        }
                    }
                }
                                        )}
            return selected
        }
        
        this.$watch(
            vm => ([vm.rootInstanceLatest, vm.rootInstance].join()), val =>  {
                console.dir("WATCHER!!!")
                
                // console.dir(this.rootInstanceLatest) // Executes if `x`, `y`, or `z` have changed.

                window.r = this.rootInstance
                window.r1 = this.rootInstanceLatest
                
                findSelectedInList(this.rootInstanceLatest.data.children, "name", "VDnPvJ36")
                findSelectedInList(this.rootInstance.data.children, "name", "VDnPvJ36")
                // // console.dir(tre)
                
                var diff = new window.Diff(); 
                var textDiff = diff.main("tre[0]", "tre[1]"); // produces diff array
                this.currentVersionSpan = diff.prettyHtml(textDiff)
                // console.dir(this.currentVersionSpan)
                // console.dir(diff.prettyHtml(textDiff)) // produces a formatted HTML string

            },
        )
        
    }
})
