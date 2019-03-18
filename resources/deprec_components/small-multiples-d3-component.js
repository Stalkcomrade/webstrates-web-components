window.smallMultiplesD3Component = Vue.component('small-multiples-d3', {
    mixins: [window.dataFetchMixin],
    props: {
        dataObject: Object,
        x: Object
    },
    // SOLVED: data transition from parent to children components
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
                      :d="symbol.path">
                  </path>
                  <path
                      class=line
                      fill=none
                      stroke=#666
                      stroke-width=1.5px
                      :d="symbol.line">
                  </path>
                  <text
                       :x="width - 6"
                       :y="height - 6"
                       style="text-anchor: end;">
                   {{ symbol.key }}
                 </text>
            </g>
          </svg>    
    </div>
    </div>
    
`,
    data: () => ({
        margin: {
            top: 8,
            right: 10,
            bottom: 2,
            left: 10
        },
        symbol: '',
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
            var y = d3.scaleLinear().range([this.height, 0])
            return {
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
    mounted() {

        // SOLVED: rewrite fully in Vue JS using Virtual DOM
        // SOLVED: figured out how to combine d3 + natural VUE approach
        // SOLVED: rebuild parser, include days

        var symbol = this.dataObject // INFO: getting data from prop
        this.scaled.x = this.x.scaledProp // INFO: getting method from a parent (sending objects and extracting function)

        // INFO: minimum and maximum date across symbol are computed on a parent side
        // INFO: We assume values are sorted by date.

        // Compute the maximum price per symbol, needed for the y-domain.
        symbol.maxPrice = d3.max(symbol.values, function(d) {
            return d.price
        });

        // SOLVED: does not work for some reason
        // I used maxPrice which is not yet declared
        this.scaled.y.domain([0, symbol.maxPrice])

        symbol.path = this.area(symbol.values)
        symbol.line = this.line(symbol.values)

        // Assigning to global
        this.symbol = symbol

    }
})