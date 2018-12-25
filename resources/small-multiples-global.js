// SOLVED: use datum
// SOLVED: use data as the prop
//// SOLVED: declare x scaling method in the global
////// SOLVED: use v-for once, just in a row

window.smallMultiplesGlobalComponent = Vue.component('small-multiples-global', {
    mixins: [dataFetchMixin],
    template: `
  
<div>

  <b-container class="container-fluid" v-for="(d,i) in symbols">
     <b-row>
        <b-col class="col-md-10">
               <small-multiples-d3 :dataObject="symbols[i]" :x="scaledProp">
               </small-multiples-d3>
        </b-col>
        <b-col class="col-md-2 text-left">
             <d3-metric :data="counter" 
                        width="25%" height="50px" 
                        :options="optionsCustom">
             </d3-metric>
       </b-col>
     </b-row>
  </b-container>
</div>

`,
    components: {
        'small-multiples-d3': window.smallMultiplesD3Component,
        'd3-metric': window.d3Metric
    },

    data: () => ({
        days: '',
        optionsCustom: {
            axisLabelFontSize: 2,
            metricLabelFontSize: 30
        },
        counter: 300,
        fetchedData: [],
        waitData: '',
        scaledProp: '',
        symbols: '',
        instance: '',
        margin: {
            top: 8,
            right: 10,
            bottom: 2,
            left: 10
        },
    }),
    computed: {
        width() {
            return 960 - this.margin.left - this.margin.right
        },
        // SOLVED: scaledProp is assigned to the object later in order to avoid early sending of scaled before applying .domain
        scaled() {
            var x = d3.scaleTime().range([0, this.width])
            return {
                x
            }
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
            // SOLVED: this should be global
            this.scaled.x.domain([
                d3.min(symbols, function(s) {
                    return s.values[0].date
                }),
                d3.max(symbols, function(s) {
                    return s.values[s.values.length - 1].date
                })
            ]);

            // INFO: I cannot use functions in props, so, sending objects instead
            var container = {}
            container.scaledProp = this.scaled.x.domain([
                d3.min(symbols, function(s) {
                    return s.values[0].date
                }),
                d3.max(symbols, function(s) {
                    return s.values[s.values.length - 1].date
                })
            ]);
            this.scaledProp = container

            this.symbols = symbols

        })
    }

})