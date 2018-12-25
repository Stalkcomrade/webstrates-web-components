window.smallMultiplesD3Component = Vue.component('small-multiples-d3', {
    mixins: [dataFetchMixin],
    template: `
    <div class="main" ref="container">

    <div class="smallMultiples" v-bind:monthProp="Number(this.month) || ((new Date).getMonth() + 1)" 
                    v-bind:yearProp="Number(this.year) || (new Date).getFullYear()"
                    v-bind:maxWebstratesProp="20" >
          <svg v-for="(d,i) in symbols"
               :width="width"
               :d="d.maxPrice"
               :height="height">
             <g
               class=chosen
               :transform="transform">      
                  <path
                      class=area
                      fill=blue
                      :d="d.path">
                  </path>
         
            </g>
          </svg>    
    </div>
    </div>
    
`,

    //     <path
    //     class=area
    //     fill=blue>
    // </path>



    //   <path v-for="(d,i) in symbols"
    //     class=area
    //     fill=blue
    //     >
    // </path>



    // FIXME: add margin calculations for svg and g

    // SOLVED: +
    // var svg = d3.select(".smallMultiples")
    //     .selectAll("svg")
    //     .data(symbols)
    //     .enter().append("svg")
    //     .attr("width", width + margin.left + margin.right)
    //     .attr("height", height + margin.top + margin.bottom)
    //     .attr("v-bind:ref", function(d) {
    //         return _.camelCase(d.key)
    //     })
    //     .append("g")
    //     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Add the area path elements. Note: the y-domain is set per element.
    // svg.append("path")
    //     .attr("class", "area")
    //     .attr("fill", "blue")
    //     .attr("d", function(d) {
    //         y.domain([0, d.maxPrice]);
    //         return area(d.values);
    //     });



    // <b-container class="bv-example-row">
    //             <b-row>
    //                <b-col>   </b-col>
    //                <b-col>   </b-col>
    //             </b-row>
    //     </b-container>

    // <button @click="test"> add metric </button>
    // <button @click="test2"> test metric </button>

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
        data: '',
        paths: '',
        // parseDate: '',
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

        // xon() {
        //     return d3.scaleTime().range([0, this.width])
        // },
        // y() {
        //     return d3.scaleLinear().range([this.height, 0])
        // },
        // x: function() {
        //     return d3.scaleTime().range([0, this.width])
        // },
        // y: function() {
        //     return d3.scaleLinear().range([this.height, 0])
        // },

        // yW() {
        //     return d3.scaleLinear().range([this.height, 0])
        // },
        area() {
            return d3.area() // returns only part of values
                .x(function(d) {
                    return this.xon(d.date);
                })
                .y0(this.height)
                .y1(function(d) {
                    return this.yon(d.price)
                })
        },
        // area: function() { // returns only part of values
        //     return d3.area()
        //         .x(function(d) {
        //             return this.x(d.date);
        //         })
        //         .y0(this.height)
        //         .y1(function(d) {
        //             return this.y(d.price)
        //         })
        // },
        // sss(d) {
        //     this.y().domain([0, d.maxPrice])
        //     return this.area(d.values)
        // },
        // dPath(d) {
        //     y.domain([0, d.maxPrice]);
        //     return area(d.values);
        // }
        //         y.domain([0, d.maxPrice]);
        //         return area(d.values);
        //     });
    },
    methods: {
        // sh: this.area(d.values),
        // sss: function(d) {
        //     this.y().domain([0, d.maxPrice])
        //     return this.area(d.values)
        // },
        test2: function() {
            this.$refs.container.appendChild(this.instance)
        },
        test: function() {
            var ComponentClass = Vue.extend(window.d3Metric)
            var instance = new ComponentClass({
                propsData: {
                    data: 3500
                }
            })
        },

        // area() {
        //     d3.area() // returns only part of values
        //         .x(function(d) {
        //             return this.x(d.date);
        //         })
        //         .y0(this.height)
        //         .y1(function(d) {
        //             return this.y(d.price)
        //         })
        // },
        // INFO: if it is statement, this.method is undefined
        // area: d3.area() // returns only part of values
        //     .x(function(d) {
        //         return this.x(d.date);
        //     })
        //     .y0(this.height)
        //     .y1(function(d) {
        //         return this.y(d.price)
        //     }),
        // area: function() {
        //     return d3.area() // returns only part of values
        //         .x(function(d) {
        //             return this.x(d.date);
        //         })
        //         .y0(this.height)
        //         .y1(function(d) {
        //             return this.y(d.price)
        //         })
        // },
        // x: function() {
        //     return d3.scaleTime().range([0, this.width])
        // },
        // y: function() {
        //     return d3.scaleLinear().range([this.height, 0])
        // },
        xon: d3.scaleTime().range([0, this.width]),
        yon: d3.scaleLinear().range([this.height, 0]),

        // area: d3.area() // returns only part of values
        //     .x(function(d) {
        //         return this.x(d.date);
        //     })
        //     .y0(this.height)
        //     .y1(function(d) {
        //         return this.y(d.price)
        //     }),

        parseDate: d3.timeParse("%d %b %Y"),

        //     var areaSelected = d3.area()
        //         .x(function(d) {
        //             return x(d.date);
        //         })
        //         .y0(height)
        //         .y1(function(d) {
        //             return y(d.price)
        //         });


        line: d3.line()
            .x(function(d) {
                return this.x(d.date);
            })
            .y(function(d) {
                return this.y(d.price);
            }),

        type: function(d) {
            var parseDate = d3.timeParse("%d %b %Y")
            d.price = +d.price
            d.date = parseDate(d.dateInstance)
            return d
        },

        // var fetchedData = this.fetchedData
        // fetchedData.forEach(type) // applying data parsing

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

                console.dir(this.fetchedData)

            }).then(() => resolve())
        })
    },
    mounted() {

        /// TODO: rewrite fully in Vue JS using Virtual DOM
        // https://codepen.io/terrymun/pen/gmBdKq
        // SOLVED: figured out how to combine d3 + natural VUE approach
        // SOLVED: rebuild parser, include days

        window.xon = this.xon
        window.area = this.area

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

            // d3.csv("stock_tmp.csv", type, function(data) {
            // Nest data by symbol.
            // console.dir(data)

            var symbols = d3.nest()
                .key(function(d) {
                    return d.symbol;
                })
                .entries(fetchedData);

            // SOLVED: change this to another name
            // var symbols = this.symbolsNest(fetchedData)

            symbols = symbols.map(el => {
                return {
                    ...el,
                    values: _.orderBy(el.values, "date")
                }
            })


            window.yon = this.yon
            // this.yon().domain([0, 5])
            // Compute the maximum price per symbol, needed for the y-domain.
            symbols.forEach(function(s) {
                y.domain([0, s.maxPrice])
                s.path = area(s.values)
                // s.pathTest = this.area(s.values)
                s.maxPrice = d3.max(s.values, function(d) {
                    return d.price
                });
            });

            // Compute the maximum for selectedAread

            symbols.forEach(function(s) {
                var parseDate = d3.timeParse("%d %b %Y")
                s.maxPriceSelected = d3.max(s.values, function(d) {
                    if (d.date > parseDate('Jan 2002') && d.date < parseDate('Jan 2003')) {
                        return d.price
                    }
                });
            });

            // create path

            // symbols.map(el => {
            //     y.domain([0, el.maxPrice]);
            //     return {
            //         ...el,
            //         path: area(el.values)
            //     }
            // })


            window.symbols = symbols
            this.symbols = symbols



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

            // window.symbols = symbols

            // Compute the minimum and maximum date across symbols.
            // We assume values are sorted by date.

            x.domain([
                d3.min(symbols, function(s) {
                    return s.values[0].date;
                }),
                d3.max(symbols, function(s) {
                    return s.values[s.values.length - 1].date;
                })
            ]);

            // INFO: binding symbols to data
            this.data = symbols

            // window.area = this.area

            // (symbols => ((d, i), {
            //     return this.sss(d)
            // })



            // sss: function(d) {
            //     this.y().domain([0, d.maxPrice])
            //     return this.area(d.values)
            // }


            // Add an SVG element for each symbol, with the desired dimensions and margin.
            // var svg = d3.select(".smallMultiples")
            //     .selectAll("svg")
            //     .data(symbols)
            //     .enter().append("svg")
            //     .attr("width", width + margin.left + margin.right)
            //     .attr("height", height + margin.top + margin.bottom)
            //     .attr("v-bind:ref", function(d) {
            //         return _.camelCase(d.key)
            //     })
            //     .append("g")
            //     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


            // Add the area path elements.Note: the y - domain is set per element.
            // svg.append("path")

            // d3.select(".main")
            //     .select(".smallMultiples")
            //     .selectAll(".chosen")
            //     .selectAll("path")
            //     .data(this.data)
            //     .enter()
            //     .append("path")
            //     .attr("class", "area")
            //     .attr("fill", "red")
            //     .attr("d", function(d) {
            //         y.domain([0, d.maxPrice]);
            //         return area(d.values);
            //     });



            this.paths.area = this.area(symbols.values)

            // Add the line path elements. Note: the y-domain is set per element.
            // svg.append("path")
            //     .attr("class", "line")
            //     .attr("fill", "none")
            //     .attr("stroke", "#666")
            //     .attr("stroke-width", "1.5px")
            //     .attr("d", function(d) {
            //         y.domain([0, d.maxPrice]);
            //         return line(d.values);
            //     });

            // Making highlighted periods.
            // Add Selected Area

            // svg.append("path")
            //     .attr("class", "area")
            //     .attr("fill", "red")
            //     .attr("d", function(d) {
            //         y.domain([0, d.maxPrice]);
            //         return areaSelected(d.valuesFiltered); // d.values
            //     });

            // add a small label for the symbol name.
            // svg.append("text")
            //     .attr("x", width - 6)
            //     .attr("y", height - 6)
            //     .style("text-anchor", "end")
            //     .text(function(d) {
            //         return d.key;
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