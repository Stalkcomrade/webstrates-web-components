window.network = Vue.mixin({
    data: () => ({
        d3Data: [],
        d3Object: {},
        finalHtml: '',
        htmlObjectReady: false,
        htmlObject: '',
        currentInnerText: '',
        currentVersionSpan: '',
        currentVersionSentences: ["test", "test"],
        svg: "",
        rootInstance: '',
        rootInstanceLatest: '',
        gLink: "",
        gNode: "",
        d3Data: [],
        d3DataLatest: [],
        d3Object: {},
        tree: '',
        diagonal: '',
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
    // TODO: decide on whether to merge watchers
    // watch: {
    //     d3Data() {
    //         console.dir("INSIDE d3Data Watcher")
    //         var container = {
    //             name: "main",
    //             children: this.d3Data
    //         }
    //         this.rootInstance = this.root(container)
    //         this.update(this.rootInstance)
    //     }},
    // TODO: add second watcher
    computed: {
        viewBox() {
            return [-this.margin.left*20, -this.margin.top, this.width, this.dx]
        },
        svgViewBox() {
            return [-this.margin.left*12, -this.margin.top, this.width, this.dx]
        }
    },
    methods: {
        onChildUpdate (newValue) { // INFO: it is used to catch htmls from timeline component
            console.dir("Updated")
            this.htmlString = newValue[0] // SOLVED: make a parent listen to child instead of using global scopes
            this.htmlObject = new DOMParser().parseFromString(this.htmlString, "text/html")
            this.d3Data = this.init()
        },
        /**
         * use this to pointer to dom elements
         * 
         * @param {string} version - whether to return selectors for initial vs. latest dom tree
         * @param {boolean} legacy - indicate wheather select second tree, backward compatability, eliminate later
         * @return {array} domSelectors - object with selectors per each element
         */
        getSelectors: function(legacy, version) {

            var domSelectors = {}
            
            if (legacy === true) {
                
                this.svg = d3.select("#svgMain")
                this.gLink = d3.select("#gLink")
                this.gNode = d3.select("#gNode")
                
            } else if(version === "initial") {
                
                domSelectors.svg = d3.select("#svgMain")
                domSelectors.gLink = d3.select("#gLink")
                domSelectors.gNode = d3.select("#gNode")
                
                // this.svg = d3.select("#svgMain")
                // this.gLink = d3.select("#gLink")
                // this.gNode = d3.select("#gNode")
                
            } else {

                domSelectors.svg = d3.select("#svgMainLatest")
                domSelectors.gLink = d3.select("#gLinkLatest")
                domSelectors.gNode = d3.select("#gNodeLatest")
                
            }

            return domSelectors
        },
        
        changeCurrent: function(innerText) {
            this.currentInnerText = `${innerText}`
        },
        
        handler: function(e) {
            e.preventDefault();
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

        // TODO: rewrite considering several trees
        /**
         * 
         * @param {string} type - whether delete children of initial or latest tree
         */
        removeChildren: function(type) {

            var myNode;
            
            if (type === "initial") {

                myNode = document.getElementById("gLink")
                while (myNode.firstChild) {
                    myNode.removeChild(myNode.firstChild);
                }

                myNode = document.getElementById("gNode")
                while (myNode.firstChild) {
                    myNode.removeChild(myNode.firstChild);
                }
                
            } else if (type === "latest") {

                myNode = document.getElementById("gLinkLatest")
                while (myNode.firstChild) {
                    myNode.removeChild(myNode.firstChild);
                }

                myNode = document.getElementById("gNodeLatest")
                while (myNode.firstChild) {
                    myNode.removeChild(myNode.firstChild);
                }
            } else { // INFO: used for compatability with old functions

                myNode = document.getElementById("gLink")
                while (myNode.firstChild) {
                    myNode.removeChild(myNode.firstChild);
                }

                myNode = document.getElementById("gNode")
                while (myNode.firstChild) {
                    myNode.removeChild(myNode.firstChild);
                }

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

        // SOLVED: changing root from computed to function
        root: function(data) {
            var hierarchyTemp = d3.hierarchy(data)
            hierarchyTemp.x0 = this.dy / 2 + 500
            hierarchyTemp.y0 = 0 + 500
            hierarchyTemp.descendants().forEach((d, i) => {
                d.id = i
                d._children = d.children
                if (d.depth && d.data.name.length !== 7) d.children = null
            })
            return hierarchyTemp
        },

        // INFO: copy or transclusion are local functions
        /**
         * 
         * @param {any} input - object for dom tree creation
         * @param {str} type 
         * @param {string} mode - used for building tree in case of copies/transclusions
         */
        init: function(input, type, mode) {

            if (typeof type !== "undefined") {

                return mode(input)

            } else {
                
                if (typeof input !== "undefined"){
                    console.dir(input)
                    var $el = input.getElementsByTagName("BODY")[0]
                    var el = $el.children[0]
                    return this.sq(el.children)
                    
                } else {
                    
                    // console.dir("init starts")
                    var $el = this.htmlObject.getElementsByTagName("BODY")[0]
                    window.el = $el.children[0]
                    return this.sq(window.el.children)
                    
                }
            }
        },

        layoutLinks: function(alignment) {    // INFO: firstly, I need to wrap diagonal to method with the alignment side (lef/right)
            var linkFun = alignment === "left"
                ? d3.linkHorizontal().x(d => d.y).y(d => d.x)
                : d3.linkHorizontal().x(d => -d.y).y(d => d.x)
            return linkFun
        },

        // SOLVED: selectors on input
        /**
         * 
         * @param {object} source - data structure for tree building
         * @param {string} alignment - direction of transtion - left or right
         * @param {object} selectors - object with selectors
         */
        update: function(source, alignment, selectors) { // INFO: update now has input for different graph alignment
            // SOLVED: root is not calculated

            // SOLVED: const for selectors
            // SOLVED: eliminate this.diagonal and this.rootInstance and this.tree
            // !!! CRITICAL
            // SOLVED: Messed up source and root
            // SOLVED: one of the variables 
            // SOLVED: this.rootInstance

            // INFO: this works assuming the premise that latest is always rendered on the left side
            const root = alignment === "left" ? this.rootInstanceLatest  : this.rootInstance
            // source???
            // const root = source
            
            // INFO: Checking, which version of diagonal fun is used
            // SOLVED: this.diagonal
            const diagonal = this.layoutLinks(alignment)
            
            const duration = d3.event && d3.event.altKey ? 2500 : 250;
            // const nodes = this.rootInstance.descendants().reverse()
            // const links = this.rootInstance.links()
            const nodes = root.descendants().reverse()
            const links = root.links()

            // SOLVED: tree
            const tree = d3.tree().nodeSize([this.dx, this.dy])
            tree(root)
            // tree(this.rootInstance)
            // this.tree(this.rootInstance) // Compute the new tree layout.

            // let left = this.rootInstance
            // let right = this.rootInstance
            // this.rootInstance.eachBefore(node => {
                
            //     if (node.x < left.x) left = node;
            //     if (node.x > right.x) right = node
                
            // });

            let left = root
            let right = root
            root.eachBefore(node => {
                
                if (node.x < left.x) left = node;
                if (node.x > right.x) right = node
                
            });

            const height = right.x - left.x + this.margin.top + this.margin.bottom + 250

            var self = this

            // INFO: compute viewBox params here
            let viewBoxInst = alignment === "left" ? -this.margin.left : -this.margin.left * 20
            
            // const transition = this.svg
            const transition = selectors.svg
                  .transition()
                  .duration(duration)
                  .attr("height", height)
                  .attr("viewBox", [viewBoxInst,
                                        left.x - this.margin.top,
                                        this.width,
                                        height])
            // .tween("resize", window.ResizeObserver ? null : () => () => self.svg
            .tween("resize", window.ResizeObserver ? null : () => () => selectors.svg
                           .dispatch("toggle"));

                // Update the nodes…
                const node = selectors.gNode.selectAll("g")
                    .data(nodes, d => d.id);

            // Enter any new nodes at the parent's previous position.
            const nodeEnter = node.enter().append("g")
                  .attr("transform", d => alignment === "left"
                        ? `translate(${source.y0},${source.x0})`
                        : `translate(${source.y0 - 2*source.y0},${source.x0})`)
                  .attr("fill-opacity", 0)
                  .attr("stroke-opacity", 0)
                  .on("click", (d) => {
                      store.commit('changeCurrentNode', d.data.name)
                      d.children = d.children ? null : d._children
                      self.update(d, alignment, selectors)
                      this.currentInnerText = d.data.innerText
                      console.dir(d.data.innerText)
                  })
                  .on("contextmenu", function(d, i) { // INFO: binding listeners to nodes
                      d3.event.preventDefault();
                      if (typeof self !== "undefined"){
                          self.$refs.ct.$refs.menu.open(self.$event, d.data.value)
                      }
                  })

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
                      .attr("transform", d => alignment === "left"
                            ? `translate(${d.y},${d.x})`
                            : `translate(${d.y - 2*d.y},${d.x})`)
                    .attr("fill-opacity", 1)
                    .attr("stroke-opacity", 1);

                // Transition exiting nodes to the parent's new position.
                const nodeExit = node.exit().transition(transition).remove()
                      .attr("transform", d => alignment === "left"
                            ? `translate(${source.y},${source.x})`
                            : `translate(${source.y - 2*source.y},${source.x})`)
                    .attr("fill-opacity", 0)
                    .attr("stroke-opacity", 0);

                // Update the links…
                const link = selectors.gLink.selectAll("path")
                    .data(links, d => d.target.id);

                // Enter any new links at the parent's previous position.
                const linkEnter = link.enter().append("path")
                    .attr("d", d => {
                        const o = {
                            x: source.x0,
                            y: source.y0
                        };
                        // return this.diagonal({
                        // return self.diagonal({
                        return diagonal({
                            source: o,
                            target: o
                        });
                    });

                // Transition links to their new position.
                link.merge(linkEnter).transition(transition)
            // .attr("d", self.diagonal);
                .attr("d", diagonal)

                // Transition exiting nodes to the parent's new position.
                link.exit().transition(transition).remove()
                    .attr("d", d => {
                        const o = {
                            x: source.x,
                            y: source.y
                        };
                        // return this.diagonal({
                        // return self.diagonal({
                        return diagonal({
                            source: o,
                            target: o
                        });
                    });

                // Stash the old positions for transition.
            // this.rootInstance.eachBefore(d => {
            root.eachBefore(d => {
                d.x0 = d.x;
                d.y0 = d.y;
            });

        },
    }
})
