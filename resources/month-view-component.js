window.MonthViewComponent = Vue.component('month-view', {
  props: ['month', 'year', 'maxWebstrates'],
  template: `<div>
		<h2>{{ date }}</h2>
		<button @click="">Prev</button>
        // <webstrate-scaling/>
		<svg></svg>
		<webstrate-legend/>
	         </div>`,
  components: {
    'webstrate-legend-component':  WebstrateLegendComponent,
    // 'webstrate-scaling-component': WebstrateScalingComponent
  },
  watch: {
    month: (oldValue, newValue) => {
      // console.log(oldValue, newValue)
    }
  },
  data: () => ({
    date: ''
  }),
  async mounted() {
    const month = Number(this.month) || ((new Date).getMonth() + 1);
    const maxWebstrates = this.maxWebstrates || 20;
    const year = Number(this.year) || (new Date).getFullYear();

    this.date = (new Date(year, month - 1)).toLocaleDateString(undefined, {
      month: 'long', year: 'numeric'
    });

    dataFetcher('month', { month, year, maxWebstrates }).then(async (days) => {


      let webstrateIds = new Set();
      let effortTotal = new Set();

      let webstrateIdsArray = new Array();
      let effortTotalArray = new Array();


      Object.values(days).forEach(day => {

        Object.keys(day).forEach(webstrateId => {
          webstrateIds.add(webstrateId)
          webstrateIdsArray.push(webstrateId)
        });

        Object.values(day).forEach(singleEffort => {
          effortTotal.add(singleEffort)
          effortTotalArray.push(singleEffort)
        })

      })

      

      let df = {}
      webstrateIdsArray.forEach((id, value) => df[id] = effortTotalArray[value])


      effortTotalArray = effortTotalArray.sort((a, b) => a - b);


      // version based on webstrate id
      // ?

      webstrateIds = Array.from(webstrateIds).sort();

      d3colors = d3.scaleOrdinal(d3.schemeCategory20);
      d3colors.domain(webstrateIds);
      // console.log('emit', this.$refs);
      setTimeout(() => console.log(this.$refs), 1000);
      this.$emit('webstrateIds', webstrateIds);
      // this.$emit('webstrateIds', webstrateIds, d3colors); // old version




      const cellSize = 185;
      const margin = { top: cellSize, right: 0, bottom: 0, left: 0 };
      const width = cellSize * 7 - margin.right - margin.left; // width
      const height = cellSize * 5 - margin.top - margin.bottom; // height

      // scalar is used to calculate the sizes of the circles. They need to be different sizes,
      // so we can distinguish very active webstrates from not-so-active webstrates. However, a
      // linear scaling usually doesn't give us a very good representation, so we just do some
      // random trial-and-error Math here. There's no great insight to be had, other than the fact
      // that we're using a logarithmic scale.
      const maxOps = Math.log(d3.max(Object.values(days), (day) => d3.max(Object.values(day)))) / 2;
      const scalar = 1 / (maxOps / (cellSize / 19)); // after all, changes the diameter of the webstrates actitivity

      // days is here indexed properly, starting from 1.
      const promises = Object.keys(days).map(day =>
        calculateCircleCoordinates(days[day], scalar, cellSize));

      // days has now become zero-indexed, so the data for the 1st of the month is at index position
      // 0 and so on. We'll correct this, so it now corresponds to what days looked like above.
      days = await Promise.all(promises);
      for (let i = days.length; i; --i) {
        days[i + 1] = days[i];
      }
      delete days[0];


      const totalAcitvityPerMotnh = []


      try {
        
        Object.values(days).forEach(day => {
          // console.log(day)
          Object.keys(day).forEach(webstrateId => {
            // console.log(webstrateId)
            // webstrateIds.add(webstrateId)
            // webstrateIdsArray.push(webstrateId)
          });
          Object.values(day).forEach(singleEffort => {
            // console.dir(singleEffort)
            // console.dir(Object.values(singleEffort)[2])// .forEach(wtf => {
            // console.dir(typeof((Object.values(singleEffort)[2])))
            totalAcitvityPerMotnh.push(Object.values(singleEffort)[2]) 
            //   console.dir(wtf)
            // })
            // effortTotal.add(singleEffort)
            // effortTotalArray.push(singleEffort)
          })
        })
      }
      catch(err){
        console.dir("Undefined is caught")
      }

      console.dir(totalAcitvityPerMotnh)


      // ----- Monthly Basis

      var d3colorsQuantizeMonth = d3.scaleQuantize()
          .domain(d3.extent(totalAcitvityPerMotnh)) // mix and man of data
          .range(['blue', 'red', "yellow"])

      var d3colorsQuantileMonth = d3.scaleQuantile()
          .domain(totalAcitvityPerMotnh) // pass the whole dataset
          .range(['blue', 'red', "yellow"])

      // ----- Monthly Basis      

      
            
      const d3format = d3.timeFormat("%Y-%m-%d");
      const d3day = (date) => d3.timeFormat("%u")(date) - 1;

      const d3week = d3.timeFormat("%V");
      const monthName = d3.timeFormat("%B");
      const dayRange = d3.timeDays(new Date(year, month - 1, 1), new Date(year, month, 1));
      

      const svg = d3.select(this.$el.querySelector('svg'))
        .attr("width", width + margin.right + margin.left)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + (margin.left + (width - cellSize * 7) / 2) + ","
          + (margin.top + (height - cellSize * 6) / 2) + ")");

      const groups = svg.selectAll("g.day")
        .data(dayRange)
        .enter()
        .append("g")
        .attr('day', d => d.getDate());

      groups
        .append('rect')
        .attr("class", "day")
        .attr("width", cellSize)
        .attr("height", cellSize)
        .attr("x", date => d3day(date) * cellSize)
        .attr("y", date => (d3week(date) - d3week(new Date(date.getFullYear(),
          date.getMonth(), 1))) * cellSize)

      groups
        .append('text')
        .attr("x", date => 5 + d3day(date) * cellSize)
        .attr("y", date => 15 + (d3week(date) - d3week(new Date(date.getFullYear(),
          date.getMonth(), 1))) * cellSize)
        .text(d => d.getDate())

      const today = new Date();
      const isSameDay = (a, b = today) =>
        a.getDate() === b.getDate()
        && a.getMonth() === b.getMonth()
        && a.getFullYear() === b.getFullYear();

      groups.selectAll('circle.activity')
        .data((index, data, x, y, z) => {
          const date = index;
          var x = Object.keys(days[date.getDate()] || {})
            .map(webstrateId => ({
              date, webstrateId, activities: days[date.getDate()][webstrateId],
            }))
            .sort((a, b) => b.activities - a.activities)


          x.forEach(webstrateId => { webstrateId.radius = webstrateId.activities.radius; })
          var arrayRadius = x.map(webstrateId => webstrateId.radius)

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
        .attr('cx', ({ date, activities }) => d3day(date) * cellSize + activities.position.x + activities.radius / 2)
        .attr('cy', ({ date, activities }) => (d3week(date) - d3week(new Date(date.getFullYear(),
          date.getMonth(), 1))) * cellSize + activities.position.y + activities.radius / 2)
        .attr('r', ({ activities }) => activities.radius)
        // .style('fill', ({ webstrateId }) => d3colors(webstrateId)) // OLD VERSION
        // .style('fill', ({ colorQ }) => colorQ) // DAILY BASIS
        .style('fill', ({ colorMonthQ }) => colorMonthQ) // MONTHLY BASIS
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

function random(min, max, intResult) {
  if (typeof min !== 'number' && typeof max !== 'number') {
    min = 0;
    max = 1;
  }
  if (typeof max !== 'number') {
    max = min;
    min = 0;
  }
  var result = min + Math.random() * (max - min);
  if (intResult) {
    result = parseInt(result, 10);
  }
  return result;
}

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
