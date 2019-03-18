window.networkUpd = Vue.mixin({
    data: () => ({
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
        width: 900,
        margin: {
            top: 10,
            right: 120,
            bottom: 10,
            left: 40
        }
    }),
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

        clearInside: function(node) {},
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
         * used to build filtered dom represenation
         * @param {any} input
         * @param {any} attributeName
         * @param {any} attributeValue
         * @param {boolean} includeNot - not include elements with current attributes
         * @param {any} filterArray    - array of of objects {attributeName, attributeValue}
         */
        sqEnhanced: function(input, attributeName, attributeValue, includeNot, filterArray) {

            // var fltArray = []
            // fltArray.name = []
            // fltArray.value = []
            // filterArray.forEach(el => {
            //     fltArray.name = el.name
            //     fltArray.value = el.value
            // })
            // att.nodeName

            if (includeNot === true) {
                console.log(input)
                input = input[0].children
                // input = input[0].children[0].children[1].children[0] // .children
            }

            var target = [], // INFO: local-global scope
                flag = false,
                flagCS = false

            for (var i = 0, len = input.length; i < len; ++i) {

                flag = false
                var item = input[i]
                var children = {}

                for (var att, k = 0, atts = item.attributes, n = atts.length; k < n; k++) {

                    att = atts[k];

                    // INFO: Used for Codestrates Filtering
                    if (includeNot === true &&
                        att.nodeName === attributeName && att.nodeValue === attributeValue) {
                        // fltArray.name.indexOf(att.nodeName) > -1 && fltArray.value.indexOf(att.attributeValue) === -1) {

                        flagCS = true
                        flag = true
                        var contObj = {};

                        if (typeof att !== undefined) {
                            if (att.nodeName !== "children") {
                                contObj[att.nodeName] = att.nodeValue
                            }
                        }

                    } else if (att.nodeName === attributeName && att.nodeValue === attributeValue) { // INFO: used for webstrate

                        flag = true
                        var contObj = {};

                        if (typeof att !== undefined) {
                            if (att.nodeName !== "children") {
                                contObj[att.nodeName] = att.nodeValue
                            }
                        }
                    }
                }

                if (flag === true || flagCS === true) {

                    Object.assign(children, contObj)

                    children.value = item
                    children.parent = item.parentElement.getAttribute("__wid")
                    children.innerText = item.innerText
                }

                children.children = item.children ?
                    this.sq(item.children) :
                    "No Children"

                if (flag === true || flagCS === true) {
                    target.push(children)
                }

            }

            console.log("filter target", target)
            return target
        },

        /**
         * parse node attributes
         * @param {any} input
         */
        sq: function(input) {

            var target = [] // INFO: local-global scope
            // var children = []
            // var children = {}

            for (var i = 0, len = input.length; i < len; ++i) {
                var item = input[i]

                var children = {}

                for (var att, k = 0, atts = item.attributes, n = atts.length; k < n; k++) {

                    var contObj = {};
                    att = atts[k];

                    if (typeof att !== undefined) {

                        // SOLVED: consider children
                        // TODO: consider search for reflected nodes
                        if (att.nodeName !== "children") {

                            if (att.nodeName === "__wid") {
                                contObj["name"] = att.nodeValue
                            } else {
                                contObj[att.nodeName] = att.nodeValue
                            }

                        }
                    }
                }


                Object.assign(children, contObj)

                children.value = item
                children.parent = item.parentElement.getAttribute("__wid")
                children.innerText = item.innerText
                children.children = item.children ?
                    this.sq(item.children) :
                    "No Children"

                target.push(children)
            }

            return target
        },

        // SOLVED: changing root from computed to function
        /**
         * creates structure for dom-tree
         * @param {any} data
         */
        root: function(data) {
            var hierarchyTemp = d3.hierarchy(data)
            hierarchyTemp.x0 = this.dy / 2 + 500
            hierarchyTemp.y0 = 0 + 500
            hierarchyTemp.descendants().forEach((d, i) => {
                d.name = d.data.name
                d.class = d.data.class
                d.id = i
                d._alignment = d.data.alignment;
                d._children = d.children
                try {
                    if (d.depth && d.data.name.length !== 7) d.children = null
                } catch (err) {
                    console.error("No d.name.length in Hierarchy")
                } finally {}

            })
            return hierarchyTemp
        },

        /**
         * use this for creating filtered tree
         * @param {any} input
         * @param {any} type
         * @param {any} mode - copy vs transclusion mode
         * @param {object} filter - attributeName and attributeValue to search to
         * @param {boolean} codestrateMode - attributeName and attributeValue to search to
         */
        initEnhanced: function(input, type, mode, filter, codestrateMode) {

            // class section vissible

            console.log(input)
            var $el;

            // INFO: codestrate mode
            if (codestrateMode === true) {

                // var filterArray = [{"class", ""}, {"class", ""}]

                $el = input.getElementsByTagName("BODY")[0]
                return this.sqEnhanced($el.children, filter.attributeName, filter.attributeValue, true)

            }

            // INFO: ordinary call
            if (typeof type !== "undefined") {

                return mode(input)

            } else {

                $el = input.getElementsByTagName("BODY")[0]
                return this.sqEnhanced($el.children, filter.attributeName, filter.attributeValue)

            }
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
                    // INFO: if current webstrate or el undefined (html body) is undefined, used precestor object
                    if (this.$store.state.webstrateId === "dry-goat-98" || typeof el === undefined) {
                        // debugger
                        return this.sq($el.children)
                    } else {
                        return this.sq(el.children)
                    }


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
         * defacto, builds dom-tree
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



            selectors.svg
                .call(d3.zoom().on("zoom", () => {

                    let t = d3.event.transform;

                    t.x = t.x < this.viewBoxConst[0] ? this.viewBoxConst[0] : t.x;
                    t.x = t.x > this.viewBoxConst[2] ? this.viewBoxConst[2] : t.x;
                    t.y = t.y < this.viewBoxConst[1] ? this.viewBoxConst[1] : t.y;
                    t.y = t.y > this.viewBoxConst[3] ? this.viewBoxConst[3] : t.y;

                    if (t.k === 1) t.x = t.y = 0;
                    console.log(t.x, t.y)

                    const vb = [t.x, t.y, this.viewBoxConst[2] * t.k, this.viewBoxConst[3] * t.k];


                    selectors.svg.attr("viewBox", vb.join(' '));

                    // selectors.svg.attr('viewBox', newViewBox);


                }))
            // .call(d3.zoom().on("zoom", function() {
            //     selectors.svg.attr("transform", d3.event.transform)
            // }))

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
                    .dispatch("toggle"))

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

            nodeEnter.append("text")
                .attr("dy", "0.31em")
                .attr("x", d => d._children ? -6 : 6)
                .attr("text-anchor", d => d._children ? "end" : "start")
                .text(d => d.data.name)
                .clone(true).lower()
                .attr("stroke-linejoin", "round")
                .attr("stroke-width", 3)

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
                .data(links, d => d.target.id)

            // Enter any new links at the parent's previous position.
            const linkEnter = link.enter().append("path")
                .attr("d", d => {
                    const o = {
                        x: source.x0,
                        y: source.y0
                    };
                    return diagonal({
                        source: o,
                        target: o
                    });
                });

            // Transition links to their new position.
            link.merge(linkEnter).transition(transition)
                .attr("d", diagonal)

            // Transition exiting nodes to the parent's new position.
            link.exit().transition(transition).remove()
                .attr("d", d => {
                    const o = {
                        x: source.x,
                        y: source.y
                    };
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

        /**
         * TODO: check for commented transclusions
         * extracting transcluded webstrateIds using regExps
         * @param {any} input
         */
        extractSummary: function(input) {

            var regSrc = /\<iframe.*?src="\/(.*?)\/*?".*?<\/iframe\>/gi
            var regWid = /\<iframe.*?wid="(.*?)".*?<\/iframe\>/gi

            try {

                var src = (input.match(regSrc) || []).map(e => {
                    return {
                        src: e.replace(regSrc, '$1'),
                    }
                })
                console.log("src = ", src);

                var wid = (input.match(regWid) || []).map(e => {
                    return {
                        wid: e.replace(regWid, '$1'),
                    }
                })

                var tt = wid.map((el, index) => {
                    return {
                        ...el,
                        src: src[index].src
                    }
                })

                // INFO: supporting legacy code
                if (this.$route.path === "/transclusion1") {
                    return tt
                } else {

                    return {
                        tt: tt,
                        src: src
                    }

                }

            } catch (err) {
                return null
            }
        },

        /**
         * used for recursive finding of transclusions 
         * v1 with this.getHtmlsPerSessionMixin is used webstrates API, searching for static page
         * this means, that is transclusions are created programmatically or exist under <transient> tag
         * it will fail to find them
         * v2 read transcluded DOM to avoid this
         * if statement in the begining used to support both uses
         * @param {any} input
         */
        sqt: async function(input) {

                console.dir("Transclusion")

                var prs;

                if (this.$route.path === "/transclusion1") {

                    var htmlParsed = await this.getHtmlsPerSessionMixin(input, undefined, undefined, true)
                    prs = this.extractSummary(htmlParsed)

                } else {

                    prs = this.extractSummary(input)

                }

                var target = [],
                    children = []

                if (prs !== null && typeof prs !== "undefined") {

                    for (var i = 0, len = prs.length; i < len; ++i) {

                        var el = prs[i]

                        children = {
                            value: el.src,
                            name: el.wid,
                            children: (typeof el.src !== "undefined" ? await this.sqt(el.src) : "no transclusions")
                        }

                        target.push(children)
                    }
                } else {

                    console.dir("else statement")

                }
                return target

            },


    }
})