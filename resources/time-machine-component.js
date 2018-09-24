import { d3Timeline } from '../node_modules/d3-vs';

window.TimeMachineComponent = Vue.component('time-machine', {  
  props: {

    monthProp: '9',
    yearProp: '2018',
    maxWebstratesProp: '20'
  },

    data: () => ({
    date: '',
    month: '',
    year: '',
    selected: '',
    options: [
      // { text: 'Default', value: 'A' },
      // { text: 'Month',   value: 'B' },
      // { text: 'Yellow',  value: 'C' }
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
      dt: [],
      versioningRaw: '',
      versioningArray: []
  }),
  
  template: `
<div>

<d3-timeline
    v-bind:data="dt"
    width="100%"
    height="300px">
</d3-timeline>

        <select v-model="selected" @change="getVersioningJson()">
          <option v-for="option in options" v-bind:value="option">
               {{ option }}
          </option>
        </select>


</div>


  `,
    components: {
    'd3-timeline': d3Timeline
    },


  // watch: {

  //   selected: function(oldValue, newValue) {

      

  //   }
    
  // },
  
  created: function() {

    this.waitData = new Promise((resolve,reject) => {
    
      this.date = (new Date(this.year, this.month - 1)).toLocaleDateString(undefined, {
        month: 'long', year: 'numeric'})
      
          
      const month = Number(this.month) || ((new Date).getMonth() + 1);
      const maxWebstrates = this.maxWebstrates || 20;
      const year = Number(this.year) || (new Date).getFullYear();

     
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
        this.options = webstrateIds
        // this.test = Array.from(webstrateIds).sort()        
      
    }).then(() => resolve())
    })


    
    // this.getVersioningJson()
    
    // this.waitData = new Promise((resolve, reject) => {
      
    //   this.getVersioningJson()
    //   resolve()

    // })
    

    },

  methods: {

    getVersioningJson: function() {

      fetch("https://webstrates.cs.au.dk/" + this.selected + "/?ops")
        .then(html => html.text())
        .then(body => {
          console.log('Fetched:')
          this.versioningRaw = body
        })
        .then(() => {

          this.versioningRaw = JSON.parse(this.versioningRaw)

          this.dt = this.versioningRaw.map(int => ({
            at:        new Date(int.m.ts),
            title:     int.v,
            group:     (Object.keys(int).indexOf('create') !== -1) ? 'create' : 'edition',
            className: (Object.keys(int).indexOf('create') !== -1) ? 'entry--point--success' : 'entry--point--default',
            symbol:    (Object.keys(int).indexOf('create') !== -1) ? 'symbolCross' : 'symbolTriangle',
            link:      int.v
          }))
          

        })
    },
            
  mounted() {

    // this.getVersioningJson()

    // this.waitData.then(() => {
    
      // d3.selectAll('path.entry.entry--point--default')
      //   .data(this.dt)
      //   .attr('href', ({ int }) => "https://webstrates.cs.au.dk/black-frog-24/?v:" + int.v )
  
    // })
    
    
  }
  }
          
  });
