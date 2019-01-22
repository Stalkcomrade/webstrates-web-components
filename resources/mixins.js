var webstrateIdProp = "terrible-chipmunk-57"
var view = "overview"

window.mixin = Vue.mixin({
    props: ['value', 'relationName'],
    data: () => ({
        inputVal: this.value,
        view
    }),
    methods: {
        changeView: function(value, webstrateId) {
            this.$parent.$emit('input', value)
            this.$parent.$emit('update:relationName', webstrateId)
            this.$parent.$emit('click', webstrateId)
        },
        testSync: function(value) {
            this.$parent.$emit('update:relationName', value)

        },
        checkEvent: function(valueCheck) {
            this.$parent.$emit('click', valueCheck)
        }
    }
})


window.dataFetchMixin = Vue.mixin({
    props: ["monthProp", "yearProp", "maxWebstratesProp"],
    data: () => ({
        selectOptions: '',
        month: '',
        year: '',
        maxWebstrates: '',
        usersPerWs: ''
    }),
    methods: {
        fetchTags: async function(selected) {
            let tags = await fetch("https://webstrates.cs.au.dk/" + selected  + "/?tags").then(results => results.json())
            return tags
        },
        // SOLVED: range of version instead of a single version
        fetchRangeOfTags: async function(selected) {
            let tags = await fetch("https://webstrates.cs.au.dk/" + selected  + "/?tags").then(results => results.json())
            let vSession = []
            tags.forEach(el => vSession.push(el.v))
            
            return vSession
        },
        // SOLVED: userGeneratedTags
        // SOLVED: automaticTags - session labels
        filterTags: function(tags) {
            var sessions = tags.filter((el) => {
                return el.label.indexOf("Session of ") >= 0
            }),
            custom = tags.filter((el) => {
                return el.label.indexOf("Session of ") < 0
            })
            return {sessions: sessions, custom: custom}
        },
        // TOOD: range of version instead of a single version
        lastVersion: async function(selected) {
            var versionmax = await fetch("https://webstrates.cs.au.dk/" + selected + "/?v")
                .then(body => body.json())
            return versionmax.version
        },
        getHtmlsPerSessionMixin: async function(selected, initialVersion, finalVersion, snapshot) {

            // FIXME: fetching range of possible versions for the webstrate
            // INFO: currently last one is fetched
            // INFO: use default value if no selected id is specified
            let wsId = typeof selected === "undefined" ? "wonderful-newt-54" : selected
            
            // INFO: use last version available if no is specified
            var versionmax = await fetch("https://webstrates.cs.au.dk/" + wsId + "/?v").then(body => body.json())
            let version = typeof versionmax === "undefined" ? 1 : versionmax.version

            console.dir("VERSION INPUT")
            console.dir(initialVersion)
            
            if (snapshot === true){

                console.dir("SINGLE VERSION inside SESSION FETCHING")

                let webpageInitial = await fetch("https://webstrates.cs.au.dk/" + wsId + "/" + version + "/?raw")
                let htmlResultInitial = await webpageInitial.text()
                console.dir('html is fetched successfully')
                
                return htmlResultInitial
                
            } else {

                console.dir("MULTIPLE VERSION inside SESSION FETCHING")

                // TODO: check whether versions are correct and fetched in the right time
                
                // SOLVED: transform into parameters
                let numberInitial = typeof initialVersion === "undefined"  ? 1 : initialVersion
                let numberLast = typeof finalVersion === "undefined" ? 2 : finalVersion // INFO: if undefined, simply last version

                let webpageInitial = await fetch("https://webstrates.cs.au.dk/" + wsId + "/" + numberInitial + "/?raw")
                let htmlResultInitial = await webpageInitial.text()
                let webpageInitialJson = await fetch("https://webstrates.cs.au.dk/" + wsId + "/" + numberInitial + "/?json")
                let htmlResultInitialJson = await webpageInitialJson.text()

                let webpageLast = await fetch("https://webstrates.cs.au.dk/" + wsId + "/" + numberLast + "/?raw")
                let htmlResultLast = await webpageLast.text()
                let webpageLastJson = await fetch("https://webstrates.cs.au.dk/" + wsId + "/" + numberLast + "/?json")
                let htmlResultLastJson = await webpageLastJson.text()

                let results = await Promise.all([
                    htmlResultInitial,
                    htmlResultLast,
                    htmlResultInitialJson,
                    htmlResultLastJson
                ])
                
                this.$emit('update', results) // INFO: used in timeline-component.js
                
                return [
                    results[0],
                    results[1]
                ]

            }
            
        },
        
        fetchActivityMixin: function(webstrateIdInst) {
            
            const toDate = new Date()
            const fromDate = new Date()
            fromDate.setDate(fromDate.getDate() - 30)

            return dataFetcher('activities', {
                webstrateId: webstrateIdInst,
                toDate,
                fromDate
            })
        },
        // TODO: look for it's use in components
        // INFO: if there is no input, date/month is calculated automatically
        // If there isg, use input value
        fetchDaysOverview: function(inputDate) {

            this.month = month = typeof inputDate === "undefined" ? this.monthProp : inputDate.getMonth()
            this.year = year = typeof inputDate === "undefined" ? this.yearProp : inputDate.getFullYear()
            this.date = typeof inputDate === "undefined" ? new Date(this.year, this.month - 1) : inputDate
            this.maxWebstrates = maxWebstrates = this.maxWebstratesProp

            console.dir("DAY MIXIN")
            console.dir(this.date.getDate())
            console.dir("MONTH MIXIN")
            console.dir(this.month)
            console.dir("YEAR MIXIN")
            console.dir(this.year)
            

            return dataFetcher('month', {
                month,
                year,
                maxWebstrates
            })

        },
        getToday: function() {
            return new Date()
        },
        monthBack: function(date){
            return date.setMonth(date.getMonth() - 1)
        },
        monthForward: function(date){
            return date.setMonth(date.getMonth() + 1)
        },
        // FIXME: remove this.versioningRaw
        getOpsJsonMixin: function(input) {
            var current = input !== "undefined" ? input : this.selected
            return fetch("https://webstrates.cs.au.dk/" + current + "/?ops")
                .then((html) => { return html.json() })
                .then((body) => {
                    console.log('Fetched:\n', current)
                    this.versioningRaw = body
                    return body
                })
        }
    }
})

window.dataObjectsCreator = Vue.mixin({
    methods: {
        listOfWebstrates: function(days) { // INFO: resulted fetched promise should be days object

            let webstrateIds = new Set();

            Object.values(days).forEach(day => {
                Object.keys(day).forEach(webstrateId => {
                    webstrateIds.add(webstrateId)
                })
            })
            
            webstrateIds = Array.from(webstrateIds).sort()
            console.dir('List of Webstrates Ids is Fetched Successfully')
            
            return webstrateIds
            
        }
    }
})


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
    watch: {
        d3Data() {
            console.dir("INSIDE d3Data Watcher")
            var container = {
                name: "main",
                children: this.d3Data
            }
            this.rootInstance = this.root(container)
            this.update(this.rootInstance)

        }},
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

        // INFO: copy or transclusion are local functions
        // init: function(input, type, copy, transclusion) {
        init: function(input, type, copy, transclusion) {

            if (typeof type !== "undefined") {
                
                // TODO: swtich case
                return copy(input)

            } else {

            
            if (typeof input !== "undefined"){
                console.dir("init starts")
                var $el = input.getElementsByTagName("BODY")[0]
                var el = $el.children[0]
                return this.sq(el.children)
            } else {
                console.dir("init starts")
                var $el = this.htmlObject.getElementsByTagName("BODY")[0]
                window.el = $el.children[0]
                return this.sq(window.el.children)
            }
            }
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
                    .on("contextmenu", function(d, i) { // INFO: binding listeners to nodes
                        d3.event.preventDefault();
                        if (typeof self !== "undefined"){
                            // console.dir(d.data)
                            self.$refs.ct.$refs.menu.open(self.$event, d.data.value)
                        }
                        console.dir(d)
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
    }
})

window.animationMixin = Vue.mixin({
})

window.transclusion = Vue.mixin({
    data: () => ({
        docContainer: '',
        docIframeTransient: ''
    }),
    methods: {
        initiateTransclusion: function() {
            // this.docContainer = document.getElementById("trans-container")
            this.docContainer = document.getElementById("mainBody")
            this.docIframeTransient = document.createElement("transient")
            this.docContainer.appendChild(this.docIframeTransient)
        },
        createIframe: function(webstrateId){

            var docIframe = document.createElement("iframe")
            
	    docIframe.setAttribute("src",  "/" + webstrateId + "/")
	    docIframe.setAttribute("id", webstrateId)
            docIframe.setAttribute("style", "display: none;")
            
	    this.docIframeTransient.appendChild(docIframe)

        },
        receiveTags: function(webstrateId){

            var tr = document.getElementById(webstrateId)

            tr.webstrate.on("transcluded", (iframeWebstrateId) => {
                
                console.dir("Transclusion done")
                console.dir(iframeWebstrateId)
                console.dir(tr.contentWindow.webstrate.tags())
                
                tr.contentWindow.webstrate.tag("CUSTOM")
                tr.remove()
            })
            
        }
    }
})

