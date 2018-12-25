// SOLVED: use datum


window.smallMultiplesGlobalComponent = Vue.component('small-multiples-global', {
    mixins: [dataFetchMixin],
    template: `
  
       <div class="global">

    <b-container class="bv-example-row">
          <b-row v-for="(d,i) in symbols">
               <small-multiples-d3 id="1">
          </b-row>
    </b-container>


    <b-container class="bv-example-row">
                <b-row>
                   <small-multiples-d3 id="1" :datum="0">
                </b-row>
                 <b-row>
                   <small-multiples-d3 id="2" :datum="1">
                </b-row>
                <b-row>
                   <small-multiples-d3 id="2" :datum="2">
                </b-row>
        </b-container>

       </div>

`,
    components: {
        'small-multiples-d3': window.smallMultiplesD3Component
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