window.smallMultiplesD3Component = Vue.component('small-multiples-d3', {
    mixins: [dataFetchMixin],
    // TODO: data transition from parent to children components
    template: `

    <div class="smallMultiples" v-bind:monthProp="Number(this.month) || ((new Date).getMonth() + 1)" 
                    v-bind:yearProp="Number(this.year) || (new Date).getFullYear()"
                    v-bind:maxWebstratesProp="20" >

          <svg 
               :width="widthSvg"
               :height="heightSvg">
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
        data: '',
        paths: '',
        counter: '35000',
        days: '',
        fetchedData: [],
        waitData: '',
        symbols: '',
        instance: ''
    }),

    // SOLVED: cannot return value for the path element

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
        scaled() {
            var x = d3.scaleTime().range([0, this.width]),
                y = d3.scaleLinear().range([this.height, 0])

            return {
                x,
                y
            }
        },
        area() {

            // TODO: add into knowledge base
            var self = this

            return d3.area() // returns only part of values
                .x((d) => {
                    return this.scaled.x(d.date)
                })
                .y0(this.height)
                .y1((d) => {
                    return this.scaled.y(d.price)
                })

        },
        line() {

            var self = this

            return d3.line()
                .x((d) => {
                    return this.scaled.x(d.date)
                })
                .y((d) => {
                    return this.scaled.y(d.price)
                })
        },
        parseDate() {
            return d3.timeParse("%d %b %Y")
        }
    },
    methods: {
        type: function(d) {
            var parseDate = d3.timeParse("%d %b %Y")
            d.price = +d.price
            d.date = parseDate(d.dateInstance)
            return d
        },
        symbolsNest: function(fetchedData) {
            return d3.nest()
                .key(function(d) {
                    return d.symbol
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

        // SOLVED: rewrite fully in Vue JS using Virtual DOM
        // SOLVED: figured out how to combine d3 + natural VUE approach
        // SOLVED: rebuild parser, include days

        this.waitData.then(() => {

            var fetchedData = this.fetchedData
            fetchedData.forEach(this.type)
            var symbols = this.symbolsNest(fetchedData)

            // sorting by date
            symbols = symbols.map(el => {
                return {
                    ...el,
                    values: _.orderBy(el.values, "date")
                }
            })


            // Compute the minimum and maximum date across symbols.
            // INFO: We assume values are sorted by date.

            // SOLVED: problem is probably with x
            // Problem was with the order of code (price assignment)
            this.scaled.x.domain([
                d3.min(symbols, function(s) {
                    return s.values[0].date
                }),
                d3.max(symbols, function(s) {
                    return s.values[s.values.length - 1].date
                })
            ]);

            // Compute the maximum price per symbol, needed for the y-domain.
            symbols.forEach((s) => {

                s.maxPrice = d3.max(s.values, function(d) {
                    return d.price
                });

                // SOLVED: does not work for some reason
                // I use maxPrice which is not yet declared
                this.scaled.y.domain([0, s.maxPrice])

                s.path = this.area(s.values)
                s.line = this.line(s.values)

            });

            // Assigning to global
            this.symbols = symbols

        })
    }
})