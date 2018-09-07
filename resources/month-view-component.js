window.MonthViewComponent = Vue.component('month-view', {
  
  props: ['month', 'year', 'maxWebstrates'],
  
  template: `<div>
		<h2>{{ date }}</h2>
		<h3>{{ month }}</h3>
		<button @click="">Prev</button>
        <button @click="changeScaling()">scl</button>
		<svg></svg>
		<webstrate-legend/>
            	</div>`,  
  components: {
    'webstrate-legend-component': WebstrateLegendComponent
  },

  data: () => ({
    date: '',
    scaling: 'default',
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
    groups: []
  }),

  // created: function(month, year, maxWebstrates) {
  //     return {month, year, maxWebstrates}
  // },

  watch: {
    month: function(oldValue, newValue) {},    
    transformedScaling: function(newValue, oldValue) {
      this.update()
      console.log("Scaling has changed")
      console.log(newValue, oldValue)
    }
  },

  
  // computed properties are cached, so, it seems reasonable to use them for parameters storing
  // could be accessed in mounted using this.
  // padded.width or padded.height are accessible later
  
  computed: {
    padded() {
      const width = this.cellSize * 7 - this.margin.right - this.margin.left
      const height = this.cellSize * 5 - this.margin.top - this.margin.bottom
      return { width, height }
    },
    transformedScaling: {
      get: function () {
        return this.scaling
      },
      set: function (newValue) { // FIXME: set newValue instead of just returning scaling
        return this.scaling
      }
    }
  },

  methods: {
    update() {
      this.groups.selectAll('circle.activity')
        .style('fill', ({}) => ("yellow"))
    },
    firstMethod: function(groups, cellSize, date, d3week, d3day) {
      groups
        .append('rect')
        .attr("class", "day")
        .attr("width", cellSize)
        .attr("height", cellSize)
        .attr("x", date => d3day(date) * cellSize)
        .attr("y", date => (d3week(date) - d3week(new Date(date.getFullYear(),
                                                          date.getMonth(), 1))) * cellSize)
      console.log('success')
    },
    // calculateCircleCoodrinates: function(circles, scalar, cellSize) {
    // (circles, scalar, cellSize) => new Promise((accept, reject) => {
    calculateCircleCoodrinates: function(circles, scalar, cellSize) {

      new Promise((accept, reject) => {
        
        if (!circles || Object.keys(circles).length === 0) {
          accept([]);
        }

        let x = 0, y = -100;
        // console.log(x)
        
        circles = Object.keys(circles).map((webstrateId) => {
          
          const radius = Math.max(cellSize / 25, Math.log(circles[webstrateId]) * scalar);
          
          if (x + radius >= cellSize / 5) {
            x = radius;
            // console.log("Inside if stm")
            y += (cellSize / 6) % cellSize;
          } else {
            x += radius;
            // console.log("Inside else stm")
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

        // console.log(y,x)
        
        const packerOptions = {
          target: { x: cellSize / 2, y: cellSize / 2 },
          bounds: { width: cellSize, height: cellSize },
          circles: circles,
          continuousMode: false,
          collisionPasses: 150,
          centeringPasses: 50,
          onMove: accept
        }

        const packer = new CirclePacker(packerOptions);
        packer.update()
        
      })
    },
    resolvePromises: async function(promises, days){
      days = await Promise.all(promises);
      for (let i = days.length; i; --i) {
        days[i + 1] = days[i];
      }      
      delete days[0];
    },
    changeScaling: function() {
      this.scaling = "changed" // FIXME: fix the absolute 
    },
    methodMonth: function() {
      return new Promise((resolve,reject) => {
        setTimeout(() => {
          const month = this.month
          const year = this.year
          const maxWebstrates = this.maxWebstrates
          console.log(month)
        }, 6000) 
      })       
    },

    async callDays(days){
      let call1 = await this.getMonth() // let call = await dataFetcher('month', { month, year, maxWebstrates })
    },
    
    async nestedFunction() {
      // const month = this.month
      // const year = this.year
      // const maxWebstrates = this.maxWebstrates      
      // console.log(this.month)
      await dataFetcher('month', {month, year, maxWebstrates })
      console.log('success')
      
    },
    // I am using this for construction of async functions
    getMonthAsync: function() {
      this.getMonth().then(this.nestedFunction())
    }
  },

  
  async mounted() {
    let transformedScaling = "default"
  
    // var1 = new Promise((resolve,reject) => {
    //    setTimeout(() => {
    //      const month = this.month
    //      const year = this.year
    //      const maxWebstrates = this.maxWebstrates
    //      console.log(month)
    //      resolve()
    //    }, 6000) 
    // })
    // main issue here is that month is not defined right from start, so
    // do chaining


    // var1.then((month, year, maxWebstrates) => {dataFetcher('month', {month, year, maxWebstrates })}
    //          )
    
    
    // main issue here is that month is not defined right from start, so
    // do chaining    
    // var1.then((month, year, maxWebstrates) => {dataFetcher('month', {month, year, maxWebstrates })}
    //          )
    // this.date = (new Date(this.year, this.month - 1)).toLocaleDateString(undefined, {
    //   month: 'long', year: 'numeric'})
    
    const month = this.month
    const year = this.year
    const maxWebstrates = this.maxWebstrates    
    this.date = (new Date(this.year, this.month - 1)).toLocaleDateString(undefined, {
      month: 'long', year: 'numeric'})
    
    dataFetcher('month', { month, year, maxWebstrates}).then(async (days) => {


      // this.test = 2
      // console.log(this.test)
      // console.log(this.totalAcitvityPerMotnh)
      
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

      

      // console.log('emit', this.$refs);
      // setTimeout(() => console.log(this.$refs), 1000);
      // this.$emit('webstrateIds', webstrateIds, d3colorsQuant);

      webstrateIds = Array.from(webstrateIds).sort();
      
      d3colors = d3.scaleOrdinal(d3.schemeCategory20);
      d3colors.domain(webstrateIds)
      // console.log('emit', this.$refs);
      setTimeout(() => console.log(this.$refs), 1000);
      this.$emit('webstrateIds', webstrateIds);
      // this.$emit('webstrateIds', webstrateIds, d3colors); // old version


      // scalar is used to calculate the sizes of the circles. They need to be different sizes,
      // so we can distinguish very active webstrates from not-so-active webstrates. However, a
      // linear scaling usually doesn't give us a very good representation, so we just do some
      // random trial-and-error Math here. There's no great insight to be had, other than the fact
      // that we're using a logarithmic scale.

      this.maxOps = Math.log(d3.max(Object.values(days), (day) => d3.max(Object.values(day)))) / 2;
      this.scalar = 1 / (this.maxOps / (this.cellSize / 19)); // after all, changes the diameter of the webstrates actitivity



      // ALL IN THE ABOVE MIGHT BE MOVED to ANOTHER BLOCK
      
      // days is here indexed properly, starting from 1.
      const promises = Object.keys(days).map(day =>
        calculateCircleCoordinates(days[day], this.scalar, this.cellSize));
      // days has now become zero-indexed, so the data for the 1st of the month is at index position
      // 0 and so on. We'll correct this, so it now corresponds to what days looked like above.

      // this.resolvePromises(promises, days)
      
      days = await Promise.all(promises);
      for (let i = days.length; i; --i) {
        days[i + 1] = days[i];
      }
      
      // delete days[0];

      // console.dir(days)
      // const totalAcitvityPerMotnh = []
      
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
      
      var d3colorsQuantizeMonth = d3.scaleQuantize()
        .domain(d3.extent(this.totalAcitvityPerMotnh)) // mix and man of data
        .range(['blue', 'red', "yellow"])
      var d3colorsQuantileMonth = d3.scaleQuantile()
        .domain(this.totalAcitvityPerMotnh) // pass the whole dataset
        .range(['blue', 'red', "yellow"])

      

      
      const d3format = d3.timeFormat("%Y-%m-%d");
      const d3week = d3.timeFormat("%V");
      const dayRange = d3.timeDays(new Date(year, month - 1, 1), new Date(year, month, 1));
      const d3day = (date) => d3.timeFormat("%u")(date) - 1;

      const svg = d3.select(this.$el.querySelector('svg'))
        .attr("width", this.padded.width)
        .attr("height", this.padded.height)
            .append("g")
            .attr("transform", "translate(" + (this.margin.left + (this.padded.width - this.cellSize * 7) / 2) + ","
                  + (this.margin.top + (this.padded.height - this.cellSize * 6) / 2) + ")");

      this.groups = svg.selectAll("g.day")
        .data(dayRange)
        .enter()
        .append("g")
        .attr('day', d => d.getDate());


      this.firstMethod(this.groups, this.cellSize, this.date, d3week, d3day)      
      // groups
      //   .append('rect')
      //   .attr("class", "day")
      //   .attr("width", this.cellSize)
      //   .attr("height", this.cellSize)
      //   .attr("x", date => d3day(date) * this.cellSize)
      //   .attr("y", date => (d3week(date) - d3week(new Date(date.getFullYear(),
      //     date.getMonth(), 1))) * this.cellSize)

      this.groups
        .append('text')
        .attr("x", date => 5 + d3day(date) * this.cellSize)
        .attr("y", date => 15 + (d3week(date) - d3week(new Date(date.getFullYear(),
          date.getMonth(), 1))) * this.cellSize)
        .text(d => d.getDate())

      // const today = new Date();      
      // const isSameDay = (a, b = today) =>
      //   a.getDate() === b.getDate()
      //   && a.getMonth() === b.getMonth()
      //   && a.getFullYear() === b.getFullYear();

      this.groups.selectAll('circle.activity')
        .data((index, data, x) => {
          const date = index;
          var x = Object.keys(days[date.getDate()] || {})
            .map(webstrateId => ({
              date, webstrateId, activities: days[date.getDate()][webstrateId],
            }))
            .sort((a, b) => b.activities - a.activities)


          x.forEach(webstrateId => { webstrateId.radius = webstrateId.activities.radius; })
          var arrayRadius = x.map(webstrateId => webstrateId.radius) // ADDED THIS TO DATA
          // var arrayRadius = x.map(webstrateId => webstrateId.radius) // ADDED THIS TO DATA
        
          
          var d3colorsQuantile = d3.scaleQuantile()
              .domain(arrayRadius) // pass the whole dataset
              .range(['blue', 'red', "yellow"])


          var d3colorsQuantize = d3.scaleQuantize()
              .domain(d3.extent(arrayRadius)) // mix and man of data
              .range(['blue', 'red', "yellow"])

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
        .append('circle')
        .attr('class', () => 'activity')
        .attr('cx', ({ date, activities }) => d3day(date) * this.cellSize + activities.position.x + activities.radius / 2)
        .attr('cy', ({ date, activities }) => (d3week(date) - d3week(new Date(date.getFullYear(),
          date.getMonth(), 1))) * this.cellSize + activities.position.y + activities.radius / 2)
        .attr('r', ({ activities }) => activities.radius)
        // .style('fill', ({ webstrateId }) => d3colors(webstrateId)) // OLD VERSION
        // .style('fill', ({ colorQ }) => colorQ) // DAILY BASIS
        .style('fill', ({ scaling, colorMonthQ, colorQ }) => (transformedScaling == "changed") ? colorMonthQ : colorQ) // MONTHLY BASIS
        // .style('fill', ({ webstrateId, radius }) => {
        //   d3ColorsQuantile = d3.scaleQuantize()
        //     .domain(d3.extent(radius))
        //     .range(['blue', 'red'])

        // })
        .attr('webstrateId', ({ webstrateId }) => webstrateId)
        .append('svg:title')
        .text(({ webstrateId, activities }) => webstrateId + "\n" + activities.radius) // added info about radius ~ to activity
    });
  }
});
    // });

// function random(min, max, intResult) {
//   if (typeof min !== 'number' && typeof max !== 'number') {
//     min = 0;
//     max = 1;
//   }
//   if (typeof max !== 'number') {
//     max = min;
//     min = 0;
//   }
//   var result = min + Math.random() * (max - min);
//   if (intResult) {
//     result = parseInt(result, 10);
//   }
//   return result;
    // }

const calculateCircleCoordinates = (circles, scalar, cellSize) => new Promise((accept, reject) => {
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
    };
  });

  const packerOptions = {
    target: { x: cellSize / 2, y: cellSize / 2 },
    bounds: { width: cellSize, height: cellSize },
    circles: circles,
    continuousMode: false,
    collisionPasses: 150,
    centeringPasses: 50,
    onMove: accept
  };

  const packer = new CirclePacker(packerOptions);
  packer.update();
});
