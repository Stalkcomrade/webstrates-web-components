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
            console.dir(tags)
        },
        // TOOD: range of version instead of a single version
        lastVersion: async function(selected) {
            var versionmax = await fetch("https://webstrates.cs.au.dk/" + selected + "/?v").then(body => body.json())
            return versionmax.version
        },
        getHtmlsPerSessionMixin: async function(selected, initialVersion, finalVersion, snapshot) {

            // FIXME: fetching range of possible versions for the webstrate
            // INFO: currently last one is fetched

            // INFO: use default value if no selected id is specified
            let wsId = typeof selected === "undefined" ? "wonderful-newt-54" : selected
            
            // INFO: use last version available if no is specified
            var versionmax = await fetch("https://webstrates.cs.au.dk/" + wsId + "/?v").then(body => body.json())
            let version = typeof versionmax === "undefined" ? 305 : versionmax.version

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
        // TODO: change name of the function
        fetchActivityTimeline: function() {

            const month = ((new Date).getMonth() + 1);
            const maxWebstrates = this.maxWebstrates || 20;
            const year = Number(this.year) || (new Date).getFullYear();

            return dataFetcher('month').then((days) => {

                let webstrateIds = new Set();
                let effortTotal = new Set();

                Object.values(days).forEach(day => {
                    Object.keys(day).forEach(webstrateId => {
                        webstrateIds.add(webstrateId)
                    });

                    Object.values(day).forEach(singleEffort => {
                        effortTotal.add(singleEffort)
                    })
                })
                webstrateIds = Array.from(webstrateIds).sort()
                console.dir('List of Webstrates Ids is Fetched Successfully')
                return webstrateIds
            })
                .then((body) => {
                    return body
                })
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


window.network = Vue.mixin({
    data: () => ({
        d3Data: [],
        d3Object: {},
        finalHtml: '',
        htmlObjectReady: false,
        htmlObject: '',
        htmlString: '',
    }),
    methods: {
        
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

        // TODO: sq for webstrates copy and transclussion
        // TODO: use fetch html

        sqEnhanced: async function(input){

            // TODO: use fetch html
            var vsd = await this.getOpsJsonMixin(input)
            console.dir("VSD")
            
            var tmp = vsd[0]
            // typeof 
            // console.dir(tmp)
            
            // var target = [] // INFO: local-global scope
            // var children = []

            // for (var i = 0, len = input.length; i < len; ++i) {
            //     var item = input[i]

            //     children = {
            //         value: item,
            //         name: item.getAttribute("__wid"),
            //         parent: item.parentElement.getAttribute("__wid"),
            //         children: (item.children ? this.sq(item.children) : "No Children")
            //     }
            //     target.push(children)
            // }

            // return target

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
                    children: (item.children ? this.sq(item.children) : "No Children")
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
        
        funTree: function(data) {

            var dx = 10
            var dy = 162.5
            var margin = {
                top: 10,
                right: 120,
                bottom: 10,
                left: 40
            }

            var width = 900

            var tree = d3.tree().nodeSize([dx, dy])
            var diagonal = d3.linkHorizontal().x(d => d.y).y(d => d.x)

            const root = d3.hierarchy(data);

            root.x0 = dy / 2;
            root.y0 = 0;
            root.descendants().forEach((d, i) => {
                d.id = i;
                d._children = d.children;
                if (d.depth && d.data.name.length !== 7) d.children = null;
            });

            // d3.select(".treeUnique").append()
            // const svg = d3.select(".treeD3")
            const svg = d3.create("svg")
                  .append("svg")
                  .attr("width", width)
                  .attr("height", dx)
                  .attr("viewBox", [-margin.left, -margin.top, width, dx])
                  .style("font", "10px sans-serif")
                  .style("user-select", "none");

            const gLink = svg.append("g")
                  .attr("fill", "none")
                  .attr("stroke", "#555")
                  .attr("stroke-opacity", 0.4)
                  .attr("stroke-width", 1.5);

            const gNode = svg.append("g")
                  .attr("cursor", "pointer");

            function update(source) {
                const duration = d3.event && d3.event.altKey ? 2500 : 250;
                const nodes = root.descendants().reverse();
                const links = root.links();

                // Compute the new tree layout.
                tree(root);

                let left = root;
                let right = root;
                root.eachBefore(node => {
                    if (node.x < left.x) left = node;
                    if (node.x > right.x) right = node;
                });

                const height = right.x - left.x + margin.top + margin.bottom;

                const transition = svg.transition()
                      .duration(duration)
                      .attr("height", height)
                      .attr("viewBox", [-margin.left, left.x - margin.top, width, height])
                      .tween("resize", window.ResizeObserver ? null : () => () => svg.dispatch("toggle"));

                // Update the nodes…
                const node = gNode.selectAll("g")
                      .data(nodes, d => d.id);

                // Enter any new nodes at the parent's previous position.
                const nodeEnter = node.enter().append("g")
                      .attr("transform", d => `translate(${source.y0},${source.x0})`)
                      .attr("fill-opacity", 0)
                      .attr("stroke-opacity", 0)
                      .on("click", d => {
                          d.children = d.children ? null : d._children;
                          update(d);
                      })
                      .on("contextmenu", function(d, i) {
                          d3.event.preventDefault();
                          // console.dir("right click")
                      });

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
                const link = gLink.selectAll("path")
                      .data(links, d => d.target.id);

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
                    .attr("d", diagonal);

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
            }

            update(root);
            d3.select(".treeD3").node().appendChild(svg.node())
        }
    }

})


window.dataObjectsCreator = Vue.mixin({
})

window.animationMixin = Vue.mixin({
})


