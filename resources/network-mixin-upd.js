window.networkUpd = Vue.mixin({
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
        // dy: 162.5,
        width: 1800,
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
    computed: {
        dy() {
            return this.width / 6
        },
        viewBoxConst() {
            return [-this.margin.left * 20, -this.margin.top, this.width, this.dx]
        },
        viewBox() {
            return [-this.margin.left, -this.margin.top, this.width, this.dx]
        },
        svgViewBox() {
            return [this.margin.left, -this.margin.top, this.width, this.dx + 200]
        }
    },
    methods: {
        onChildUpdate(newValue) { // INFO: it is used to catch htmls from timeline component
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

            } else if (version === "initial") {

                domSelectors.svg = d3.select("#svgMain")
                domSelectors.gLink = d3.select("#gLink")
                domSelectors.gNode = d3.select("#gNode")

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
            // Array.from(node.childNodes).forEach(child => {
            //     if (child.nodeName === '#text') {
            //         child.remove()
            //     }
            // })
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
        /**
         * filteres codestrate div to get code desired chunks 
         * @param {any} input - item dom element
         */
        filterDefaultCategories: function(input) {

            var filter = ["Global Menu Utils", "system", "Documentation", "Properties", "Migration Loader",
                "Migration", "migration", "Migration - Pull beatify libraries", "Migration - Add section-visible to sections",
                "Migration - Pull linter libraries", "Migration - Pull active line addon", "Migration - Update sortable.js",
                "Migration - CodeMirror Addons", "Migration - Extended Material Icons", "Migration - CodeMirror Markdown Modes",
                "Migration - Roboto Fonts", "Migration - Missing Roboto Regular Font", "Migration - JSZip and FileSaver libraries",
                "Migration - Favicons", "Migration - Pull new CodeMirror version",
                "Migration - Pull Monaco Editor version and protect codestrate",
                "Migration - Pull new material icons archive", "Migration - Clear Settings Editor Name",
                "Migration - Add document title if not exist", "Migration - Protect the document",
                "Migration - Pull new monaco editor version", "Migration - Pull monaco-themes archive",
                "Console", "User & Client Manager", "Client Manager Global", "User Manager Global",
                "User Manager", "Idle Timer", ""
            ]


            var ctl = "section section-hidden"

            // input.

        },

        sq: function(input) {

            // window.input = input

            var target = [] // INFO: local-global scope
            var children = []

            for (var i = 0, len = input.length; i < len; ++i) {
                var item = input[i]

                children = {
                    value: item,
                    unapproved: item.getAttribute("unapproved") === null ?
                        null : item.getAttribute("unapproved"),
                    class: typeof item.getAttribute("class") === undefined ?
                        null : item.getAttribute("class"),
                    nameAttr: typeof item.getAttribute("name") === undefined ?
                        null : item.getAttribute("name"),
                    name: item.getAttribute("__wid"),
                    parent: item.parentElement.getAttribute("__wid"),
                    children: (item.children ? this.sq(item.children) : "No Children"),
                    innerText: item.innerText,
                }
                target.push(children)
            }

            return target
        },

        // SOLVED: changing root from computed to function
        // TODO: 
        root: function(data) {
            var hierarchyTemp = d3.hierarchy(data)
            hierarchyTemp.x0 = this.dy / 2 + 500
            hierarchyTemp.y0 = 0 + 500
            hierarchyTemp.descendants().forEach((d, i) => {
                d.name = d.data.name
                d.class = d.data.class
                d.unapproved = d.data.unapproved
                d.id = i
                d._alignment = d.data.alignment;
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

                if (typeof input !== "undefined") {
                    console.dir(input)
                    var $el = input.getElementsByTagName("BODY")[0]
                    var el = $el.children[0]
                    window.el = el
                    return this.sq(el.children)

                } else {

                    // console.dir("init starts")
                    var $el = this.htmlObject.getElementsByTagName("BODY")[0]
                    window.el = $el.children[0]
                    return this.sq(window.el.children)

                }
            }
        },

        checkNested: function(obj /*, level1, level2, ... levelN*/ ) {
            var args = Array.prototype.slice.call(arguments, 1);
            for (var i = 0; i < args.length; i++) {
                if (!obj || !obj.hasOwnProperty(args[i])) {
                    return false;
                }
                obj = obj[args[i]];
            }
            return true;
        },

        // TODO: optimise search by including type of the alignment
        // TODO: check whether this is working
        // if differs from initial - do not go into array
        findSelectedInList: function(selected, list, propertyName, valueFilter) {

            Object.values(list).some((currentItem) => {

                // // INFO: using this in order to parse 1-level svg elements
                if (this.checkNested(currentItem, 'data', propertyName)) {
                    currentItem.data[propertyName] === valueFilter ?
                        selected.push(currentItem) // ? selected = currentItem.__data__.data.name
                        :
                        (typeof currentItem._children != "undefined" && this.findSelectedInList(selected, currentItem._children, propertyName, valueFilter))
                }
            })
            return selected
        },


        /**
         * 
         * @param {object} source - data structure for tree building
         * @param {string} alignment - direction of transtion - left or right
         * @param {object} selectors - object with selectors
         */
        update: function(source, selectors) { // INFO: update now has input for different graph alignment
            // SOLVED: selectors on input
            // SOLVED: root is not calculated

            // SOLVED: const for selectors
            // SOLVED: eliminate this.diagonal and this.rootInstance and this.tree

            // INFO:   !!! CRITICAL
            // SOLVED: Messed up source and root
            // SOLVED: one of the variables 
            // SOLVED: this.rootInstance

            var self = this

            // INFO: this works assuming the premise that latest is always rendered on the left side
            // TODO:
            const root = this.rootInstance
            root.x0 = this.dy / 2
            root.y0 = 0


            const alignment = "right"
            // const root = source
            // const root = alignment === "left" ? this.rootInstanceLatest  : this.rootInstance

            // INFO: Checking, which version of diagonal fun is used
            // TODO: 
            // SOLVED: this.diagonal
            // const diagonal = this.layoutLinks()
            // const diagonal = this.diagonalS
            const diagonal = d3.linkHorizontal()
                .x(d => {
                    return d._alignment === alignment ? d.y : -d.y
                })
                .y(d => {
                    return d.x
                })

            const duration = d3.event && d3.event.altKey ? 2500 : 250;
            const nodes = root.descendants().reverse()
            const links = root.links()

            // SOLVED: tree
            const tree = d3.tree().nodeSize([this.dx, this.dy])
            tree(root)


            let left = root
            let right = root

            root.eachBefore(node => {

                if (node.x < left.x) left = node;
                if (node.x > right.x) right = node

            });

            const height = right.x - left.x + this.margin.top + this.margin.bottom



            // INFO: compute viewBox params here
            // TODO: fix global alignment
            // let viewBoxInst = alignment === "left" ? -this.margin.left : -this.margin.left * 20
            // let viewBoxInst = -this.margin.left * 20

            // const transition = this.svg
            const transition = selectors.svg
                .transition()
                .duration(duration)
                .attr("height", height)
                .attr("viewBox", [-this.margin.left, // TODO: from computed
                    left.x - this.margin.top,
                    this.width,
                    height + 400
                ])
                // .tween("resize", window.ResizeObserver ? null : () => () => self.svg
                .tween("resize", window.ResizeObserver ? null : () => () => selectors.svg
                    .dispatch("toggle"));

            // Update the nodes…
            const node = selectors.gNode.selectAll("g")
                .data(nodes, d => d.id);

            // Enter any new nodes at the parent's previous position.
            // TODO: check whether d._alignment is available
            // TODO: fix store commit for diff component
            // TODO: fix store commit for context menu
            const nodeEnter = node.enter().append("g")
                .attr("transform", d => d._alignment === alignment ?
                    `translate(${source.y0},${source.x0})` :
                    `translate(${source.y0 - 2*source.y0},${source.x0})`)
                .attr("fill-opacity", 0)
                .attr("stroke-opacity", 0)
                .attr("id", d => d.id) // INFO: binding ID for selection
                .on("click", (d, i, nodes) => {

                    this.$store.commit('changeCurrentNode', d.data.name)
                    console.log(d)


                    let selected = []
                    var re = self.findSelectedInList(selected, root.children, "name", d.data.name)

                    // TODO: ??
                    re.forEach((el) => {
                        el.children = el.children ? null : el._children;
                        self.update(el, selectors)


                        // store.commit('changeCurrentNode', d.data.name)

                        // el._alignment === "left" ?
                        // store.commit('changeCurrentNodeInitial', d.data.name) :
                        // store.commit('changeCurrentNodeLatest', d.data.name)

                        // this.currentInnerText = d.data.innerText
                        // console.dir(d.data.innerText)

                    })

                    this.codestrateModeFlag === true && this.codestrateMode()



                })
                // TODO: 
                .on("contextmenu", function(d, i) { // INFO: binding listeners to nodes
                    // d3.event.preventDefault();
                    // if (typeof self !== "undefined"){
                    // self.$refs.ct.$refs.menu.open(self.$event, d.data.value)
                    // }
                })

            nodeEnter.append("circle")
                .attr("r", 2.5)
                .attr("fill", d => d._children ? "#555" : "#999")
            // .attr("fill", d => d.data.nameAttr === null ? "red" : "blue")

            nodeEnter.append("text")
                .attr("dy", "0.31em")
                .attr("x", d => d._children ? -6 : 6)
                .attr("text-anchor", d => d._children ? "end" : "start")
                .text(d => d.data.name)
                // .attr("stroke", d => {
                //     if (d.data.class === "section section-hidden") {
                //         return "blue"
                //     } else if (d.data.unapproved === "") {
                //         return "yellow"
                //     } else {
                //         return "red"
                //     }
                // })
                // .style("fill", d => d.data.class == "paragraph code-paragraph" ? "red" : "black")
                .clone(true).lower()
                .attr("stroke-linejoin", "round")
                .attr("stroke-width", 3)
            // .attr("stroke", "white");

            // TODO: check prop name
            // Transition nodes to their new position.
            const nodeUpdate = node.merge(nodeEnter).transition(transition)
                .attr("transform", d => d._alignment === alignment ?
                    `translate(${d.y},${d.x})` :
                    `translate(${d.y - 2*d.y},${d.x})`)
                .attr("fill-opacity", 1)
                .attr("stroke-opacity", 1);

            // TODO: check prop name
            // Transition exiting nodes to the parent's new position.
            const nodeExit = node.exit().transition(transition).remove()
                .attr("transform", d => d._alignment === alignment ?
                    `translate(${source.y},${source.x})` :
                    `translate(${source.y - 2*source.y},${source.x})`)
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
                .attr("d", diagonal)
            // .attr("d", self.diagonal);

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
            root.eachBefore(d => {
                d.x0 = d.x;
                d.y0 = d.y;
            });

        },
    }
})