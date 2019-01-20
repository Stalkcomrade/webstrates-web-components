// SOLVED: use datum
// SOLVED: use data as the prop
//// SOLVED: declare x scaling method in the global
////// SOLVED: use v-for once, just in a row
// TODO: instantiate d3-metric
// TODO: ease the null values per month

window.smallMultiplesGlobalComponent = Vue.component('small-multiples-global', {
    mixins: [window.dataFetchMixin],
    template: `
  
<div>

  <b-container class="container-fluid" v-for="(d,i) in symbols">
     <b-row>
        <b-col class="col-md-10">
               <small-multiples-d3 :dataObject="symbols[i]" :x="scaledProp">
               </small-multiples-d3>
        </b-col>
        <b-col class="col-md-2 text-left">
          <component :is="dynamicComponentInstance" />
          <!-- <d3-metric :data="maxActivity[i].maxPrice" 
               width="25%" height="50px" 
               :options="optionsCustom">
               </d3-metric> -->
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
        fetchedDataWatched: "",
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
        },
        maxActivity() {
            var maxActivity = this.symbols
            return maxActivity
        }
    },
    methods: {
        dynamicComponent: function() {

            console.dir("!!!updated")

            var manequen = this.symbols
            console.dir(this.symbols)
            
            return {
                render(h) {
                    return this.symbols.map(el => (h('d3-metric', {
                        props: {
                            'data': el.maxPrice,
                            'options': this.optionsCustom
                        },
                        
                        style: {
                            'width': "25%",
                            'height': "50px"
                        }
                    }
                                            ))
                                    )
                }}
            
        },
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
    created: async function() {

        var currDate = new Date(2018, 11)
        currDate.setDate(30)

        var days = await this.fetchDaysOverview(currDate)
        
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

        this.fetchedDataWatched = 1 // INFO: activating watcher after array is filled
        
    },
    async mounted() {


        this.$watch(
            (vm) => (vm.fetchedDataWatched), val => {
                
                this.fetchedData.forEach(this.type)
                var symbols = this.symbolsNest(this.fetchedData)

                // sorting by date
                symbols = symbols.map(el => {
                    return {
                        ...el,
                        values: _.orderBy(el.values, "date")
                    }
                })

                console.dir(symbols)

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

                this.dynamicComponentInstance = this.dynamicComponent()
                
            }, {immediate: true}
        )
        
    }

})
