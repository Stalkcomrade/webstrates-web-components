window.MonthViewComponent = Vue.component('month-view', {
  
  props: ['monthProp', 'yearProp', 'maxWebstratesProp'],
  
  template: `<div>
		<h2>{{ date }}</h2>
		<h3>{{ month }}</h3>
        <p> Message: {{ todoHovered }} </p>

        <select v-model="selected">
          <option v-for="option in options" v-bind:value="option.value">
               {{ option.text }}
          </option>
        </select>

        <span>Selected: {{ selected }}</span>
        <br><br>

		<button @click="previousMonth()">Prev</button>
        <button @click="update()">scl</button>
        <button @click="updateScaling()">UPD SCL</button>

		<svg></svg>

         
       <p> Message: {{ usersPerWs }} </p>

		<webstrate-legend/>
            	</div>`,  
  components: {
    'webstrate-legend-component': WebstrateLegendComponent
  },

  data: () => ({
    date: '',
    month: '',
    year: '',
    selected: 'A',
    options: [
      { text: 'Default', value: 'A' },
      { text: 'Month',   value: 'B' },
      { text: 'Yellow',  value: 'C' }
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
    month: function(oldValue, newValue) {
      console.log(oldValue, newValue)
    },
    selected: function(oldValue, newValue) {
      
      if (this.selected == "A") {
        this.groups.selectAll('circle.activity')
          .style('fill', ({ scaling, colorMonthQ, colorQ }) => ("yellow"))
      } else if (this.selected == "B") {
        this.groups.selectAll('circle.activity')
          .style('fill', ({ scaling, colorMonthQ, colorQ }) => (colorMonthQ))
      } else {
        this.groups.selectAll('circle.activity')
          .style('fill', ({ scaling, colorMonthQ, colorQ }) => (colorQ))
      }
    }
  },
  
  // computed properties are cached, so, it seems reasonable to use them for parameters and functions
  // storing. Could be accessed in mounted using this.
  
  created: function() {

    this.waitData = new Promise((resolve,reject) => {
    
      this.month = this.monthProp
      this.year = this.yearProp
      this.maxWebstrates = this.maxWebstratesProp
      this.date = (new Date(this.year, this.month - 1)).toLocaleDateString(undefined, {
        month: 'long', year: 'numeric'})

      this.fetchActivity()
      
      // const t = ((new Date).getMonth())
      // console.log(t)
      // const y = Number(this.year) || (new Date).getFullYear()
      // const m = 20

      // const month = Number(this.month) || ((new Date).getMonth() + 1);
      // const maxWebstrates = this.maxWebstrates || 20;
      // const year = Number(this.year) || (new Date).getFullYear();

      // dataFetcher('month', {t, y, m}).then((days) => {
      dataFetcher('month').then((days) => {
      
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
        this.test = Array.from(webstrateIds).sort()

        // const date = index;
        // var x = Object.keys(days[date.getDate()] || {})
        //     .map(webstrateId => ({
        //       date, webstrateId, activities: days[date.getDate()][webstrateId],
        //     }))
        //     .sort((a, b) => b.activities - a.activities)


        // x.forEach(webstrateId => { webstrateId.radius = webstrateId.activities.radius; })
        // var arrayRadius = x.map(webstrateId => webstrateId.radius) // ADDED THIS TO DATA
        
        // var d3colorsQuantile = this.d3Scaling.colorQuantileScaling(arrayRadius)
        // var d3colorsQuantize = this.d3Scaling.colorQuantizeScaling(arrayRadius)

        // // ----------- Day-based Scaling
        // x.forEach(webstrateId => { webstrateId.color = d3colorsQuantile(webstrateId.radius) })
        // x.forEach(webstrateId => { webstrateId.colorQ = d3colorsQuantize(webstrateId.radius) })
        // // ----------- Month-based Scaling
        // x.forEach(webstrateId => { webstrateId.colorMonth = d3colorsQuantileMonth(webstrateId.radius) })
        // x.forEach(webstrateId => { webstrateId.colorMonthQ = d3colorsQuantizeMonth(webstrateId.radius) })




        
      
    }).then(() => resolve())
    })

  },
  computed: {
    padded() {
      const width = this.cellSize * 7 - this.margin.right - this.margin.left
      const height = this.cellSize * 5 - this.margin.top - this.margin.bottom
      return { width, height }
    },
    d3Const() {
      const d3week = d3.timeFormat("%V")
      const dayRange = d3.timeDays(new Date(this.year, this.month - 1, 1), new Date(this.year, this.month, 1))
      const d3day = (date) => d3.timeFormat("%u")(date) - 1
      return { d3week, dayRange, d3day }
    },
    d3Scaling() {
      const colorQuantileScaling = (data) => d3.scaleQuantile().domain(data).range(['blue', 'red', "yellow"])
      const colorQuantizeScaling = (data) => d3.scaleQuantize().domain(d3.extent(data)).range(['blue', 'red', "yellow"])
      return { colorQuantileScaling, colorQuantizeScaling }
    },
    circleCoords() {

      var calculateCircleCoodrinates = (circles, scalar, cellSize) => new Promise((accept, reject) => {
        
        if (!circles || Object.keys(circles).length === 0) {
          accept([]);
        }

        let x = 0, y = -100;
        
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
          target: { x: cellSize / 2, y: cellSize / 2 },
          bounds: { width: cellSize, height: cellSize },
          circles: circles,
          continuousMode: false,
          collisionPasses: 150,
          centeringPasses: 50,
          onMove: accept}
        
        const packer = new CirclePacker(packerOptions);
        packer.update()
        
      })
      return { calculateCircleCoodrinates }
    }
  },
  methods: {
    previousMonth() {
      console.dir(this.month)
    },
    updateScaling() {
      this.groups.selectAll('circle.activity')
        .style('fill', ({ scaling, colorMonthQ, colorQ }) => (colorMonthQ)) // MONTHLY BASIS
    },
    update() {
      this.groups.selectAll('circle.activity')
        .style('fill', ({}) => ("yellow"))
    },
    mainD3: function() {

      this.svg = d3.select(this.$el.querySelector('svg'))
        .attr("width", this.padded.width)
        .attr("height", this.padded.height)
        .append("g")
        .attr("transform", "translate(" + (this.margin.left + (this.padded.width - this.cellSize * 7) / 2) + ","
              + (this.margin.top + (this.padded.height - this.cellSize * 6) / 2) + ")")

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

      this.groups.selectAll('circle.activity')
        .data((index, data, x) => {
          // console.dir(x)
          const date = index
          
          date.setMonth(8)
          // console.log(date.getDate())
          
          var x = Object.keys(days[date.getDate()] || {})
              .map(webstrateId => ({
                date, webstrateId, activities: days[date.getDate()][webstrateId],
              }))
              .sort((a, b) => b.activities - a.activities)


          x.forEach(webstrateId => { webstrateId.radius = webstrateId.activities.radius; })
          var arrayRadius = x.map(webstrateId => webstrateId.radius) // ADDED THIS TO DATA
          
          var d3colorsQuantile = this.d3Scaling.colorQuantileScaling(arrayRadius)
          var d3colorsQuantize = this.d3Scaling.colorQuantizeScaling(arrayRadius)

          // ----------- Day-based Scaling
          x.forEach(webstrateId => { webstrateId.color = d3colorsQuantile(webstrateId.radius) })
          x.forEach(webstrateId => { webstrateId.colorQ = d3colorsQuantize(webstrateId.radius) })
          // ----------- Month-based Scaling
          x.forEach(webstrateId => { webstrateId.colorMonth = d3colorsQuantileMonth(webstrateId.radius) })
          x.forEach(webstrateId => { webstrateId.colorMonthQ = d3colorsQuantizeMonth(webstrateId.radius) })

          return x;
        }
             )
        .enter()
        .append('a')
        .attr('href', ({ webstrateId }) => `/${webstrateId}/`)
        .on("mouseover", ({webstrateId}) => this.showMessage(webstrateId))
        .append('circle')
        .attr('class', () => 'activity')
        .attr('cx', ({ date, activities }) => this.d3Const.d3day(date) * this.cellSize + activities.position.x + activities.radius / 2)
        .attr('cy', ({ date, activities }) => (this.d3Const.d3week(date) - this.d3Const.d3week(new Date(date.getFullYear(),
                                                                                                       date.getMonth(), 1))) * this.cellSize + activities.position.y + activities.radius / 2)
        .attr('r', ({ activities }) => activities.radius)
        .style('fill', ({ colorQ }) => colorQ) // DAILY BASIS
      // .style('fill', ({ scaling, colorMonthQ, colorQ }) => (transformedScaling == "changed") ? colorMonthQ : colorQ) // MONTHLY BASIS
        .attr('webstrateId', ({ webstrateId }) => webstrateId)
        .append('svg:title')
        .text(({ webstrateId, activities }) => webstrateId + "\n" + activities.radius) // added info about radius ~ to activity
      

    },
    showMessage: function(d) {
      this.todoHovered = `${d}`
      this.fetchActivity(d)      
    },
    resolvePromises: async function(promises, days) {
      days = await Promise.all(promises);
      for (let i = days.length; i; --i) {
        days[i + 1] = days[i];
      }      
      delete days[0];
    },
    fetchActivity: function(webstrateIdInst) {

      const toDate = new Date()
      const fromDate = new Date()
      fromDate.setDate(fromDate.getDate() - 7)

      const activityPromise = dataFetcher('activities', { webstrateId: webstrateIdInst, toDate, fromDate })

      let usersPerWsSet = new Set()
      let arrFromSet = []
      
      activityPromise.then((data) => {

        Object.values(data).forEach(int => {
          Object.values(int).forEach(intN => {
            usersPerWsSet.add(intN.userId)
            // console.dir(intN.userId)
          })
        })
       
        arrFromSet = Array.from(usersPerWsSet)
        this.usersPerWs = `${arrFromSet}`
      })

    }
  },
  
  // async mounted() {
  mounted() {
    
    this.waitData.then(() => console.dir(this.test))
      

    dataFetcher('month').then(async (days) => {
      
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
      
      // scalar is used to calculate the sizes of the circles. They need to be different sizes,
      // so we can distinguish very active webstrates from not-so-active webstrates. However, a
      // linear scaling usually doesn't give us a very good representation, so we just do some
      // random trial-and-error Math here. There's no great insight to be had, other than the fact
      // that we're using a logarithmic scale.

      this.maxOps = Math.log(d3.max(Object.values(days), (day) => d3.max(Object.values(day)))) / 2;
      this.scalar = 1 / (this.maxOps / (this.cellSize / 19)); // after all, changes the diameter of the webstrates actitivity

      
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
      }
      catch (err) {
        console.dir("Undefined is caught")
      }
      
      var d3colorsQuantizeMonth = this.d3Scaling.colorQuantizeScaling(this.totalAcitvityPerMotnh)
      var d3colorsQuantileMonth = this.d3Scaling.colorQuantileScaling(this.totalAcitvityPerMotnh)

      this.mainD3()
      this.mainD3Second(days, d3colorsQuantizeMonth, d3colorsQuantileMonth)
      
    })
  },

  updated() {}
    
})


