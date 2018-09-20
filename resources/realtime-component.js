import { d3Timeline } from '../node_modules/d3-vs';

window.RealtimeComponent = Vue.component('realtime', {  
  props: {

    monthProp: '9',
    yearProp: '2018',
    maxWebstratesProp: '20'
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
    margin:{ 
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
      intPerWs: [],
      dt: []
  }),
  
  template: `
<div>
<d3-timeline
    v-bind:data="dt"
    width="100%"
    height="300px">
</d3-timeline>
</div>
  `,
    components: {
    'd3-timeline': d3Timeline
    },


    created: function() {

    this.waitData = new Promise((resolve,reject) => {
    
      this.month = this.monthProp
      this.year = this.yearProp
      this.maxWebstrates = this.maxWebstratesProp
      this.date = (new Date(this.year, this.month - 1)).toLocaleDateString(undefined, {
        month: 'long', year: 'numeric'})

      // this.fetchActivity()

      let tmpWebstrateId = 'jolly-fish-42'

      this.fetchActivity(tmpWebstrateId)
      
      dataFetcher('month').then((days) => {
      
      let webstrateIds = new Set();
      let effortTotal = new Set();
      
      Object.values(days).forEach(day => {
        Object.keys(day).forEach(webstrateId => {
          webstrateIds.add(webstrateId)
          // console.dir(webstrateId)
        });

        Object.values(day).forEach(singleEffort => {
          effortTotal.add(singleEffort)
        })
      })

      
      webstrateIds = Array.from(webstrateIds).sort()
        this.test = Array.from(webstrateIds).sort()

      
    }).then(() => resolve())
    })
    },

  methods: {


    fetchActivity: function(webstrateIdInst) {

      const toDate = new Date()
      const fromDate = new Date()
      fromDate.setDate(fromDate.getDate() - 7)

      // console.dir()

      const activityPromise = dataFetcher('activities', { webstrateId: webstrateIdInst, toDate, fromDate })

      // let intPerWsInst = []
      // let arrFromSet = []
      
      activityPromise.then((data) => {

        Object.values(data).forEach(int => {
          Object.values(int).forEach(intN => {
            this.intPerWs.push(intN)
            // console.dir(intN.userId)
          })
        })

        console.dir(this.intPerWs)
        console.dir(this.intPerWs[0])

        this.dt = this.intPerWs.map(int => ({
          at:  new Date(int.timestamp),
          title: int.userId + "_" + Math.random().toString(),
          group: int.type,
          className: (int.type === "clientPart") ? 'entry--point--success' : 'entry--point--default',
          symbol:    (int.type === "clientPart") ? 'symbolCross' : 'symbolTriangle'
      }))

       
         })

    },

    
  },

  mounted() {
   
  }
          
});
