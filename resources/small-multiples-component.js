window.smallMultiplesComponent = Vue.component('small-multiples', {
    mixins: [dataFetchMixin],
    template: `
<div class="smallMultiples" v-bind:monthProp="Number(this.month) || ((new Date).getMonth() + 1)" 
                    v-bind:yearProp="Number(this.year) || (new Date).getFullYear()"
                    v-bind:maxWebstratesProp="20" >
</div>

`,
    data: () => ({
        parseDate: '',
        days: '',
        fetchedData: [],
        waitData: ''
    }),
    methods: {},
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



                // this.fetchedData = this.fetchedData.forEach(el => {
                //     return el.sort(values => {
                //         a.date - b.date
                //     })
                // })

                console.dir(this.fetchedData)


            }).then(() => resolve())
        })
    },
    mounted() {

        // TODO: rebuild parser, include days

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

            var data = this.fetchedData

            data.forEach(type) // applying data parsing

            // d3.csv("stock_tmp.csv", type, function(data) {
            // Nest data by symbol.
            // console.dir(data)

            // var process = function(data) {

            var symbols = d3.nest()
                .key(function(d) {
                    return d.symbol;
                })
                .entries(data);

            symbols = symbols.map(el => {
                return {
                    ...el,
                    values: _.orderBy(el.values, "date")
                }
            })


            window.symbols = symbols

            // Compute the maximum price per symbol, needed for the y-domain.
            symbols.forEach(function(s) {
                s.maxPrice = d3.max(s.values, function(d) {
                    return d.price
                });
            });

            // Compute the maximum for selectedAread

            symbols.forEach(function(s) {
                var parseDate = d3.timeParse("%b %Y")
                s.maxPriceSelected = d3.max(s.values, function(d) {
                    if (d.date > parseDate('Jan 2002') && d.date < parseDate('Jan 2003')) {
                        return d.price
                    }
                });
            });

            // SOLVED: var for selected (user) area
            var symbols = symbols.map(object => ({
                key: object.key,
                maxPrice: object.maxPrice,
                maxPriceSelected: object.maxPriceSelected,
                values: object.values,
                valuesFiltered: _.filter(object.values, function(el) {
                    return el.date > parseDate('Jan 2002') &&
                        el.date < parseDate('Jan 2003')
                }),
            })).filter(object => {
                return object.values.some((el) => { // filters objects without this date
                    return el.date > parseDate('Jan 2002') &&
                        el.date < parseDate('Jan 2003')
                })
            })

            window.symbols = symbols

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

            // Add an SVG element for each symbol, with the desired dimensions and margin.
            var svg = d3.select(".smallMultiples")
                .selectAll("svg")
                .data(symbols)
                .enter().append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


            // Add the area path elements. Note: the y-domain is set per element.
            svg.append("path")
                .attr("class", "area")
                .attr("fill", "blue")
                .attr("d", function(d) {
                    y.domain([0, d.maxPrice]);
                    return area(d.values);
                });

            // Add the line path elements. Note: the y-domain is set per element.
            svg.append("path")
                .attr("class", "line")
                .attr("fill", "none")
                .attr("stroke", "#666")
                .attr("stroke-width", "1.5px")
                .attr("d", function(d) {
                    y.domain([0, d.maxPrice]);
                    return line(d.values);
                });

            // Making highlighted periods.
            // Add Selected Area

            svg.append("path")
                .attr("class", "area")
                .attr("fill", "red")
                .attr("d", function(d) {
                    y.domain([0, d.maxPrice]);
                    return areaSelected(d.valuesFiltered); // d.values
                });

            // add a small label for the symbol name.
            svg.append("text")
                .attr("x", width - 6)
                .attr("y", height - 6)
                .style("text-anchor", "end")
                .text(function(d) {
                    return d.key;
                });

        });
    }
})