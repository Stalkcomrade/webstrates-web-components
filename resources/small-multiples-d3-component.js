window.smallMultiplesD3Component = Vue.component('small-multiples-d3', {
    mixins: [dataFetchMixin],
    // TODO: data transition from parent to children components
    template: `

    <div class="smallMultiples" v-bind:monthProp="Number(this.month) || ((new Date).getMonth() + 1)" 
                    v-bind:yearProp="Number(this.year) || (new Date).getFullYear()"
                    v-bind:maxWebstratesProp="20" >

          <svg 
               :width="widthSvg"
               :height="heightSvg"
               :id="symbols[1].maxPrice">
             <g
               class=chosen
               :transform="transform">      
                  <path
                      class=area
                      fill=blue
                      :d="symbols[1].path">
                  </path>
                  <path
                      class=line
                      fill=none
                      stroke=#666
                      stroke-width=1.5px
                      :d="symbols[1].line">
                  </path>
                  <text
                       :x="width - 6"
                       :y="height - 6"
                       style="text-anchor: end;">
                   {{ symbols[1].key }}
                 </text>
            </g>
          </svg>    
    </div>
    </div>
    
`,
    components: {
        'd3-metric': window.d3Metric
    },
    data: () => ({
        margin: {
            top: 8,
            right: 10,
            bottom: 2,
            left: 10
        },
        scaled: {
            x: '',
            y: ''
        },
        data: '',
        paths: '',
        counter: '35000',
        days: '',
        fetchedData: [],
        waitData: '',
        symbols: '',
        instance: ''
    }),

    // TODO: cannot return value for the path element

    computed: {
        width() {
            return 960 - this.margin.left - this.margin.right
        },
        height() {
            return 69 - this.margin.top - this.margin.bottom
        },
        transform() {
            return "translate(" + this.margin.left + ", " + this.margin.top + ")"
        },
        widthSvg() {
            return this.width + this.margin.left + this.margin.right
        },
        heightSvg() {
            return this.height + this.margin.top + this.margin.bottom
        },
        area() {
            const Inst = d3.area() // returns only part of values
                .x(function(d) {
                    return this.scaled.x(d.date);
                })
                .y0(this.height)
                .y1(function(d) {
                    this.scaled.y.domain([0, d.maxPrice])
                    return this.scaled.y(d.price)
                })

            return Inst
        },

        // xon() {
        //     return d3.scaleTime().range([0, this.width])
        // },
        // yon() {
        //     return d3.scaleLinear().range([this.height, 0])
        // },
        parseDate() {
            return d3.timeParse("%d %b %Y")
        }
    },
    methods: {
        initialise() {
            this.scaled.x = d3.scaleTime().range([0, this.width])
            this.scaled.y = d3.scaleLinear().range([this.height, 0])
        },
        // area: d3.area() // returns only part of values
        //     .x(function(d) {
        //         return this.scaled.x(d.date);
        //     })
        //     .y0(this.height)
        //     .y1(function(d) {
        //         this.scaled.y.domain([0, d.maxPrice])
        //         return this.scaled.y(d.price)
        //     }),
        line: d3.line()
            .x(function(d) {
                return this.scaled.x(d.date);
            })
            .y(function(d) {
                return this.scaled.y(d.price);
            }),

        type: function(d) {
            var parseDate = d3.timeParse("%d %b %Y")
            d.price = +d.price
            d.date = parseDate(d.dateInstance)
            return d
        },
        symbolsNest: function(fetchedData) {
            return d3.nest()
                .key(function(d) {
                    return d.symbol;
                })
                .entries(fetchedData)
        },
    },
    created: function() {

        this.waitData = new Promise((resolve, reject) => {

            this.month = month = (new Date).getMonth()
            this.year = year = (new Date).getFullYear()
            this.maxWebstrates = this.maxWebstratesProp

            this.fetchActivity()

            window.d = this.fetchedData

            dataFetcher('month', {
                month,
                year
            }).then((days) => {

                Object.keys(days).forEach(day => {
                    Object.values(days[day]).map((webstrate, index) => {

                        this.fetchedData.push({
                            symbol: Object.keys(days[day])[index],
                            price: webstrate, // FIXME:  get rid of all variables' names
                            dateInstance: (new Date(this.year, this.month, parseInt(Object.keys(days)[index]))).toLocaleDateString(undefined, {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                            }).toString()
                        })
                    })
                })

            }).then(() => resolve())
        })
    },
    mounted() {

        /// TODO: rewrite fully in Vue JS using Virtual DOM
        // SOLVED: figured out how to combine d3 + natural VUE approach
        // SOLVED: rebuild parser, include days


        this.initialise()

        this.waitData.then(() => {

            var margin = {
                    top: 8,
                    right: 10,
                    bottom: 2,
                    left: 10
                },
                width = 960 - margin.left - margin.right,
                height = 69 - margin.top - margin.bottom;

            var x = d3.scaleTime()
                .range([0, width]);

            var y = d3.scaleLinear()
                .range([height, 0]);

            // returns only part of values
            var area = d3.area()
                .x(function(d) {
                    return x(d.date);
                })
                .y0(height)
                .y1(function(d) {
                    y.domain([0, d.maxPrice])
                    return y(d.price)
                });

            var parseDate = d3.timeParse("%d %b %Y")

            var areaSelected = d3.area()
                .x(function(d) {
                    return x(d.date);
                })
                .y0(height)
                .y1(function(d) {
                    return y(d.price)
                });

            var line = d3.line()
                .x(function(d) {
                    return x(d.date);
                })
                .y(function(d) {
                    return y(d.price);
                });

            function type(d) {
                var parseDate = d3.timeParse("%d %b %Y")
                d.price = +d.price;
                d.date = parseDate(d.dateInstance);
                return d;
            }

            var fetchedData = this.fetchedData
            fetchedData.forEach(type) // applying data parsing

            // SOLVED: change this to another name
            var symbols = this.symbolsNest(fetchedData)

            symbols = symbols.map(el => {
                return {
                    ...el,
                    values: _.orderBy(el.values, "date")
                }
            })


            // Compute the maximum for selectedAread

            // symbols.forEach(function(s) {
            //     var parseDate = d3.timeParse("%d %b %Y")
            //     s.maxPriceSelected = d3.max(s.values, function(d) {
            //         if (d.date > parseDate('Jan 2002') && d.date < parseDate('Jan 2003')) {
            //             return d.price
            //         }
            //     });
            // });

            // create path

            // symbols.map(el => {
            //     y.domain([0, el.maxPrice]);
            //     return {
            //         ...el,
            //         path: area(el.values)
            //     }
            // })


            // SOLVED: var for selected (user) area
            // var symbols = symbols.map(object => ({
            //     key: object.key,
            //     maxPrice: object.maxPrice,
            //     maxPriceSelected: object.maxPriceSelected,
            //     values: object.values,
            //     valuesFiltered: _.filter(object.values, function(el) {
            //         return el.date > parseDate('Jan 2002') &&
            //             el.date < parseDate('Jan 2003')
            //     }),
            // })).filter(object => {
            //     return object.values.some((el) => { // filters objects without this date
            //         return el.date > parseDate('Jan 2002') &&
            //             el.date < parseDate('Jan 2003')
            //     })
            // })

            // Compute the minimum and maximum date across symbols.
            // We assume values are sorted by date.

            this.scaled.x.domain([
                d3.min(symbols, function(s) {
                    return s.values[0].date;
                }),
                d3.max(symbols, function(s) {
                    return s.values[s.values.length - 1].date;
                })
            ]);

            window.y = this.scaled.y
            console.dir(this.scaled.y)
            // console.dir(this.scaled.y.domain([0, symbols[1].maxPrice]))

            // Compute the maximum price per symbol, needed for the y-domain.
            symbols.forEach(function(s) {
                // s.pathTest = this.area(s.values)

                // this.scaled.y.domain([0, s.maxPrice]) // FIXME: does not work for some reason
                s.path = this.area.Inst(s.values)
                s.line = this.line(s.values)

                // console.dir(y.domain([0, s.maxPrice])) // FIXME: does not work for some reason
                // console.dir(s.path = area(s.values))
                // s.line = line(s.values)

                // s.path = pathNline(s).path
                // s.line = pathNline(s).line
                s.maxPrice = d3.max(s.values, function(d) {
                    return d.price
                });
            });



            // INFO: binding symbols to data

            window.symbols = symbols
            this.symbols = symbols
            this.data = symbols

            console.dir(this.area(symbols[1].values))

            // Making highlighted periods.
            // Add Selected Area

            // svg.append("path")
            //     .attr("class", "area")
            //     .attr("fill", "red")
            //     .attr("d", function(d) {
            //         y.domain([0, d.maxPrice]);
            //         return areaSelected(d.valuesFiltered); // d.values
            //     });


            // Attach element to DOM.
            // d3.select(".smallMultiples")
            //     .append(() => svg.node());

            // TODO: select element by some attrbute or reference from d3
            // this.test()
            // console.dir(svg)

            // this.$forceUpdate()
            // console.dir(this.$refs);
            // window.rt = this.$refs
            // window.svg = svg
            // window.svg._groups[0][0]
            // this.$refs.container.appendChild(instance.$el)

            // svg.append("component")
            //     // .class("d3-metric")
            //     .attr("v-bind:is", "d3-metric")
            //     // .attr("v-model", "d3-metric")
            //     .attr("v-bind:data", this.counter)
            //     .style("width", "100%")
            //     .style("height", "600px")

            // svg.append("div")
            //     .attr("class", "d3-metric")
            //     .attr("v-bind:data", this.counter)
            //     .style("width", "100%")
            //     .style("height", "600px")

        })
    }
})