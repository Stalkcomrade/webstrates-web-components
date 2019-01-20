// TODO: entities are mapped only during first days

window.MonthViewComponent = Vue.component('month-view', {
    mixins: [window.mixin],
    inherit: true,
    props: ['monthProp', 'yearProp', 'maxWebstratesProp'],
    template: `
<transition name="fade">
  
  <div v-if="show" 
       v-bind:value="value" 
       v-on:input="$emit('input', $event.target.value)">

    <b-container class="container-fluid">
      <b-row>
        <b-col class="col-md-4">
          
          <h2> {{ this.dateToShow.toLocaleDateString(undefined, { month: 'long', year: 'numeric' }) }} </h2>
          
          <select v-model="selected">
            <option v-for="option in options" v-bind:value="option.value">
              {{ option.text }}
            </option>
          </select>

          <span>Selected Color Scaling: {{ selectedText }} </span>
          
          <br>
          <br>

          <button @click='changeView("time-machine")'> Change View </button>
          <button v-on:click="show = !show"> Toggle </button>

          <br>
          <br>

          <div class="dateButtons">
            <button class="btn btn-primary" @click="previousMonth()">Previous Month</button>
            <button class="btn btn-primary" @click="nextMonth()">Next Month</button>
          </div>
          
        </b-col>

        <b-col class="col-md-4">
          <p> version: {{ tags[tags.length-1].v }} </p>
          <p> label: {{ tags[tags.length-1].label }} </p>
        </b-col>

        <b-col class="col-md-4">
          <b-row> Contributors: {{ usersPerWs }} </b-row>
          
          <br>
          <br>
          <br>
          
          <b-row> <p> WebstrateId: {{ todoHovered }} </p> </b-row>

          <br>
          <br>
          
        </b-col>
      </b-row>

      <br>
      <br>
      <br>
      <br>
      <br>

      
      <b-row>
        <b-col class="col-md-10">
          <svg class="calendar"></svg>
        </b-col>
        <b-col class="col-md-2">
          <webstrate-legend/>
        </b-col>
      </b-row>
      
    </b-container>

  </div>

</transition>
`,
    // SOLVED: !use date instead of only month!
    components: {
        'webstrate-legend-component': WebstrateLegendComponent
    },

    data: () => ({
        webstrateIdProp,
        show: true,
        date: '',
        month: '',
        year: '',
        tags: [{
            v: '',
            label: ''
        }],
        selected: 'A',
        selectedText: '',
        options: [{
                text: 'Default',
                value: 'A'
            },
            {
                text: 'Month',
                value: 'B'
            },
            {
                text: 'Yellow',
                value: 'C'
            }
        ],
        maxWebstrates: '',
        scaling: ['default', 'yellow', 'month'],
        cellSize: 185,
        margin: {
            left: 0,
            right: 0,
            top: 185,
            bottom: 10
        },
        totalAcitvityPerMotnh: [],
        arrayRadius: [],
        breaks: [],
        colorQ: [],
        maxOps: 0,
        scalar: 0,
        svg: [],
        groups: [],
        test: [],
        waitData: [],
        todoHovered: "hover smth",
        usersPerWs: ""
    }),
    watch: {
        selected: function(oldValue, newValue) {

            if (this.selected == "A") {
                this.selectedText = "Default"
                this.groups.selectAll('circle.activity')
                    .style('fill', ({
                        scaling,
                        colorMonthQ,
                        colorQ
                    }) => ("yellow"))
            } else if (this.selected == "B") {
                this.selectedText = "Month"
                this.groups.selectAll('circle.activity')
                    .style('fill', ({
                        scaling,
                        colorMonthQ,
                        colorQ
                    }) => (colorMonthQ))
            } else {
                this.selectedText = "Day"
                this.groups.selectAll('circle.activity')
                    .style('fill', ({
                        scaling,
                        colorMonthQ,
                        colorQ
                    }) => (colorQ))
            }
        }
    },

    // computed properties are cached, so, it seems reasonable to use them for parameters and functions
    // storing. Could be accessed in mounted using this.

    // created: async function() {
    async created() {

        // TODO: replace with mixin api
        var daysFetched = await this.fetchDaysOverview()
        
        let webstrateIds = new Set();
        let effortTotal = new Set();

        Object.values(daysFetched).forEach(day => {
            Object.keys(day).forEach(webstrateId => {
                webstrateIds.add(webstrateId)
            });

            Object.values(day).forEach(singleEffort => {
                effortTotal.add(singleEffort)
            })
        })

        webstrateIds = Array.from(webstrateIds).sort()
        this.test = Array.from(webstrateIds).sort()

    },
    computed: {
        dateToShow() {
            var dateToShow = new Date(this.date.getFullYear(), this.date.getMonth() - 1)
            return dateToShow
        },
        padded() {
            const width = this.cellSize * 7 - this.margin.right - this.margin.left
            const height = this.cellSize * 5 - this.margin.top - this.margin.bottom
            return {
                width,
                height
            }
        },
        d3Const() {
            const d3week = d3.timeFormat("%V")
            const dayRange = d3.timeDays(new Date(this.date.getFullYear(),
                                                  this.date.getMonth() - 1, 1),
                                         new Date(this.date.getFullYear(), this.date.getMonth(), 1))
            const d3day = (date) => d3.timeFormat("%u")(date) - 1
            return {
                d3week,
                dayRange,
                d3day
            }
        },
        d3Scaling() {
            const colorQuantileScaling = (data) => d3.scaleQuantile().domain(data).range(['blue', 'red', "yellow"])
            const colorQuantizeScaling = (data) => d3.scaleQuantize()
                .domain(d3.extent(data))
                .range(['blue', 'red', "yellow"])
            return {
                colorQuantileScaling,
                colorQuantizeScaling
            }
        },
        circleCoords() {

            var calculateCircleCoodrinates = (circles, scalar, cellSize) => new Promise((accept, reject) => {

                if (!circles || Object.keys(circles).length === 0) {
                    accept([]);
                }

                let x = 0,
                    y = -100;

                circles = Object.keys(circles).map((webstrateId) => {
                    const radius = Math.max(cellSize / 25, Math.log(circles[webstrateId]) * scalar);
                    if (x + radius >= cellSize / 5) {
                        x = radius;
                        y += (cellSize / 6) % cellSize;
                    } else {
                        x += radius;
                    }
                    return {
                        id: webstrateId,
                        radius: radius,
                        position: {
                            x: x, //random( radius, cellSize - radius ),
                            y: y //random( radius, cellSize - radius )
                        }
                    }

                })

                const packerOptions = {
                    target: {
                        x: cellSize / 2,
                        y: cellSize / 2
                    },
                    bounds: {
                        width: cellSize,
                        height: cellSize
                    },
                    circles: circles,
                    continuousMode: false,
                    collisionPasses: 150,
                    centeringPasses: 50,
                    onMove: accept
                }

                const packer = new CirclePacker(packerOptions);
                packer.update()

            })
            return {
                calculateCircleCoodrinates
            }
        }
    },
    methods: {
        updateScaling() {
            this.groups.selectAll('circle.activity')
                .style('fill', ({
                    scaling,
                    colorMonthQ,
                    colorQ
                }) => (colorMonthQ)) // MONTHLY BASIS
        },
        update() {
            this.groups.selectAll('circle.activity')
                .style('fill', ({}) => ("yellow"))
        },
        mainD3: function() {
          

            this.svg = d3.select(this.$el.querySelector('.calendar'))
                .attr("width", this.padded.width)
                .attr("height", this.padded.height)
                .append("g")
                .attr("transform", "translate(" + (this.margin.left + (this.padded.width - this.cellSize * 7) / 2) + "," +
                    (this.margin.top + (this.padded.height - this.cellSize * 6) / 2) + ")")

            this.groups = this.svg.selectAll("g.day")
                .data(this.d3Const.dayRange)
                .enter()
                .append("g")
                .attr('day', d => d.getDate())

            this.groups
                .append('rect')
                .attr("class", "day")
                .attr("width", this.cellSize)
                .attr("height", this.cellSize)
                .attr("x", date => this.d3Const.d3day(date) * this.cellSize)
                .attr("y", date => (this.d3Const.d3week(date) - this.d3Const.d3week(new Date(date.getFullYear(),
                    date.getMonth(), 1))) * this.cellSize)

            this.groups
                .append('text')
                .attr("x", date => 5 + this.d3Const.d3day(date) * this.cellSize)
                .attr("y", date => 15 + (this.d3Const.d3week(date) - this.d3Const.d3week(new Date(date.getFullYear(),
                    date.getMonth(), 1))) * this.cellSize)
                .text(d => d.getDate())

        },
        mainD3Second: function(days, d3colorsQuantizeMonth, d3colorsQuantileMonth) {


            function pulsate(selection) {
                    /**
                     * input: selection
                     * attirbute: pulsate - boolean
                     */

                console.dir(selection.data()[0])
                recursive_transitions()
                
                function recursive_transitions() {
                    
                    if (selection.data()[0].customPulse !== 1) {
                        selection.transition()
                            .duration(400)
                            .style("customPulse", 1)
                            .attr("stroke", "#000000")
                            .attr("stroke-width", 16)
                            .attr("r", 32) // 8
                            .ease(d3.easeLinear)
                            .transition()
                            .duration(800)
                            .attr('stroke-width', 34)
                            .attr("r", 12) // 12
                            .ease(d3.easeBounceIn)
                            .duration(1600)
                            .attr("stroke", "#000000")
                            .attr("stroke-width", 0)
                            .attr("r", 8) // 8
                            .ease(d3.easeBounceIn)
                } else {
                    // transition back to normal
                    console.dir("INSIDE ELSE")
                    selection.transition()
                        .duration(200)
                        .attr("r", 8)
                        .attr("stroke-width", 2)
                        .attr("stroke-dasharray", "1, 0")
                }
                }
            }
            
            this.groups.selectAll('circle.activity')
                .data((index, data, x) => {
                    const date = index
                        var x = Object.keys(days[date.getDate()] || {})
                            .map(webstrateId => ({
                                date,
                                webstrateId,
                                activities: days[date.getDate()][webstrateId],
                            }))
                            .sort((a, b) => b.activities - a.activities)


                        x.forEach(webstrateId => {
                            webstrateId.radius = webstrateId.activities.radius;
                        })
                        var arrayRadius = x.map(webstrateId => webstrateId.radius) // ADDED THIS TO DATA
                        this.arrayRadius = arrayRadius

                        var d3colorsQuantile = this.d3Scaling.colorQuantileScaling(arrayRadius)
                        var d3colorsQuantize = this.d3Scaling.colorQuantizeScaling(arrayRadius)
                        let colorQSet = new Set()

                        // ----------- Day-based Scaling
                        x.forEach(webstrateId => {
                            webstrateId.color = d3colorsQuantile(webstrateId.radius)
                        })
                        x.forEach(webstrateId => {
                            webstrateId.colorQ = d3colorsQuantize(webstrateId.radius)
                            colorQSet.add(webstrateId.colorq)
                        })

                        this.colorQ = colorQSet
                        // ----------- Month-based Scaling
                        x.forEach(webstrateId => {
                            webstrateId.colorMonth = d3colorsQuantileMonth(webstrateId.radius)
                        })
                        x.forEach(webstrateId => {
                            webstrateId.colorMonthQ = d3colorsQuantizeMonth(webstrateId.radius)
                        })
                        // this.$emit('webstrateIds', this.colorQ, this.arrayRadius) // is used to trigger listener in another component
                        return x
                    }

                )
                .enter()
                .append('a')
                .on("mouseover", ({
                    webstrateId
                }) => {
                    this.$route.fullPath === "/embedded" ? this.testSync(webstrateId) : this.showMessage(webstrateId)
                })
                .on("click", (d, i, nodes, webstrateId) => {
                    this.$route.fullPath === "/embedded" ? this.changeView("time-machine", d.webstrateId) : pulsate(d3.select(nodes[i]))
                })
                .append('circle')
                .attr('class', () => 'activity')
                .attr('cx', ({
                    date,
                    activities
                }) => this.d3Const.d3day(date) * this.cellSize + activities.position.x + activities.radius / 2)
                .attr('cy', ({
                    date,
                    activities
                }) => (this.d3Const.d3week(date) - this.d3Const.d3week(new Date(date.getFullYear(),
                    date.getMonth(), 1))) * this.cellSize + activities.position.y + activities.radius / 2)
                .attr('r', ({
                    activities
                }) => activities.radius)
                .style('fill', ({
                    colorQ
                }) => colorQ) // DAILY BASIS
                // .style('fill', ({ scaling, colorMonthQ, colorQ }) => (transformedScaling == "changed") ? colorMonthQ : colorQ) // MONTHLY BASIS
                .attr('webstrateId', ({
                    webstrateId
                }) => webstrateId)
                .append('svg:title')
                .text(({
                    webstrateId,
                    activities
                }) => webstrateId + "\n" + activities.radius) // added info about radius ~ to activity

        },
        showMessage: async function(d) {
            this.todoHovered = `${d}`
            this.fetchActivity(d)
            this.tags = await this.fetchTags(d)
        },
        // SOLVED: replace with one in mixin
        // TODO: change name
        fetchActivity: async function(webstrateIdInst) {

            let usersPerWsSet = new Set()
            let arrFromSet = []

            var dataFetched = await this.fetchActivityMixin(webstrateIdInst)

                Object.values(dataFetched).forEach(int => {
                    Object.values(int).forEach(intN => {
                        usersPerWsSet.add(intN.userId)
                    })
                })

            arrFromSet = Array.from(usersPerWsSet)
            this.usersPerWs = `${arrFromSet}`

        },
        mainInit: async function(inputDate) {
            
            var month = this.date.getMonth()
            var year = this.date.getFullYear()

            console.dir("DAY FUN")
            console.dir(this.date.getDate())
            console.dir("MONTH FUN")
            console.dir(month)
            console.dir("YEAR FUN")
            console.dir(year)

            var days = await this.fetchDaysOverview(inputDate)
            
            // dataFetcher('month', {
            //     month,
            //     year
            // }).then(async (days) => {

                let webstrateIds = new Set()
                let effortTotal = new Set()

                Object.values(days).forEach(day => {
                    Object.keys(day).forEach(webstrateId => {
                        webstrateIds.add(webstrateId)
                    });

                    Object.values(day).forEach(singleEffort => {
                        effortTotal.add(singleEffort)
                    })
                })

                webstrateIds = Array.from(webstrateIds).sort()
                // this.$emit('webstrateIds', webstrateIds) // is used to trigger listener in another component

                // scalar is used to calculate the sizes of the circles. They need to be different sizes,
                // so we can distinguish very active webstrates from not-so-active webstrates. However, a
                // linear scaling usually doesn't give us a very good representation, so we just do some
                // random trial-and-error Math here. There's no great insight to be had, other than the fact
                // that we're using a logarithmic scale.

                this.maxOps = Math.log(d3.max(Object.values(days), (day) => d3.max(Object.values(day)))) / 2
                this.scalar = 1 / (this.maxOps / (this.cellSize / 19)) // after all, changes the diameter of the webstrates actitivity


                // days is here indexed properly, starting from 1.
                const promises = Object.keys(days).map(day => this.circleCoords.calculateCircleCoodrinates(days[day], this.scalar, this.cellSize));
                // days has now become zero-indexed, so the data for the 1st of the month is at index position
                // 0 and so on. We'll correct this, so it now corresponds to what days looked like above.


                days = await Promise.all(promises);
                for (let i = days.length; i; --i) {
                    days[i + 1] = days[i];
                }

                delete days[0];

                try {
                    Object.values(days).forEach(day => {
                        Object.values(day).forEach(singleEffort => {
                            this.totalAcitvityPerMotnh.push(Object.values(singleEffort)[2])
                        })
                    })
                } catch (err) {
                    console.dir("Undefined is caught")
                }

                var d3colorsQuantizeMonth = this.d3Scaling.colorQuantizeScaling(this.totalAcitvityPerMotnh)
                this.d3colorsQuantizeMonth = d3colorsQuantizeMonth

                var dom = d3colorsQuantizeMonth.domain(),
                    l = (dom[1] - dom[0]) / d3colorsQuantizeMonth.range().length,
                    breaks = d3.range(dom[0], dom[1], l)

                this.breaks = breaks
                this.$emit('webstrateIds', this.colorQ, this.breaks) // is used to trigger listener in another component

                var d3colorsQuantileMonth = this.d3Scaling.colorQuantileScaling(this.totalAcitvityPerMotnh)

                this.mainD3()
                this.mainD3Second(days, d3colorsQuantizeMonth, d3colorsQuantileMonth)

            // })

        },
        previousMonth: function() {

            var myNode = this.$el.querySelector('svg')
            while (myNode.firstChild) {
                myNode.removeChild(myNode.firstChild);
            }
            
            var containerMonth = this.date.getMonth()
            this.date = (new Date(this.date.setMonth(containerMonth - 1)))
            this.mainInit(this.date)
        },
        nextMonth: function() {

            var myNode = this.$el.querySelector('svg')
            while (myNode.firstChild) {
                myNode.removeChild(myNode.firstChild);
            }
            
            var containerMonth = this.date.getMonth()
            this.date = (new Date(this.date.setMonth(containerMonth + 1)))
            this.mainInit(this.date)
        },
    },
    mounted() {

        // FIXME: this duplicates created section, try to rewrite
        dataFetcher('month').then(async (days) => {

            let webstrateIds = new Set()
            let effortTotal = new Set()

            Object.values(days).forEach(day => {
                Object.keys(day).forEach(webstrateId => {
                    webstrateIds.add(webstrateId)
                });

                Object.values(day).forEach(singleEffort => {
                    effortTotal.add(singleEffort)
                })
            })

            webstrateIds = Array.from(webstrateIds).sort()
            // this.$emit('webstrateIds', webstrateIds) // is used to trigger listener in another component

            // scalar is used to calculate the sizes of the circles. They need to be different sizes,
            // so we can distinguish very active webstrates from not-so-active webstrates. However, a
            // linear scaling usually doesn't give us a very good representation, so we just do some
            // random trial-and-error Math here. There's no great insight to be had, other than the fact
            // that we're using a logarithmic scale.

            this.maxOps = Math.log(d3.max(Object.values(days), (day) => d3.max(Object.values(day)))) / 2
            this.scalar = 1 / (this.maxOps / (this.cellSize / 19)) // after all, changes the diameter of the webstrates actitivity


            // days is here indexed properly, starting from 1.
            const promises = Object.keys(days).map(day => this.circleCoords.calculateCircleCoodrinates(days[day], this.scalar, this.cellSize));
            // days has now become zero-indexed, so the data for the 1st of the month is at index position
            // 0 and so on. We'll correct this, so it now corresponds to what days looked like above.


            days = await Promise.all(promises);
            for (let i = days.length; i; --i) {
                days[i + 1] = days[i];
            }

            delete days[0];

            // ----- Monthly Basis
            try {
                Object.values(days).forEach(day => {
                    Object.values(day).forEach(singleEffort => {
                        this.totalAcitvityPerMotnh.push(Object.values(singleEffort)[2])
                    })
                })
            } catch (err) {
                console.dir("Undefined is caught")
            }

            var d3colorsQuantizeMonth = this.d3Scaling.colorQuantizeScaling(this.totalAcitvityPerMotnh)
            this.d3colorsQuantizeMonth = d3colorsQuantizeMonth


            var dom = d3colorsQuantizeMonth.domain(),
                l = (dom[1] - dom[0]) / d3colorsQuantizeMonth.range().length,
                breaks = d3.range(dom[0], dom[1], l)

            this.breaks = breaks
            this.$emit('webstrateIds', this.colorQ, this.breaks) // is used to trigger listener in another component

            var d3colorsQuantileMonth = this.d3Scaling.colorQuantileScaling(this.totalAcitvityPerMotnh)

            this.mainD3()
            this.mainD3Second(days, d3colorsQuantizeMonth, d3colorsQuantileMonth)

        })
    },

    updated() {
        console.dir("UPDATED")
    }

})
            
            
