import { d3Timeline } from '../node_modules/d3-vs';

window.TimeMachineComponent = Vue.component('time-machine', {  
  props: {

    monthProp: '9',
    yearProp: '2018',
    maxWebstratesProp: '20'
  },

    data: () => ({
      date: '',
      wbsAuthor: '',
      month: '',
      year: '',
      selected: '',
      options: [],
      maxWebstrates: '',
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

        <button @click="fetchActivity(selected)">UPD SCL</button>

</div>


  `,
    components: { 'd3-timeline': d3Timeline },

        // <select v-model="selected" @change="fetchAll(selected)">
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
            
    }).then(() => resolve())
    })    

    },

  methods: {


    fetchActivity: function(webstrateIdInst) {

      const toDate = new Date()
      const fromDate = new Date()
      fromDate.setDate(fromDate.getDate() - 14)

      const activityPromise = dataFetcher('activities', { webstrateId: webstrateIdInst, toDate, fromDate })
      
      activityPromise.then((data) => {

        Object.values(data).forEach(int => {
          Object.values(int).forEach(intN => {
            this.intPerWs.push(intN)
          })
        })

        // console.dir(this.intPerWs)
        // console.dir(this.intPerWs[0])

        var dt1 = this.intPerWs.map(int => ({
          at:        new Date(int.timestamp),
          title:     Math.random().toString(),
          group:     int.type,
          className: (int.type === "clientPart") ? 'entry--point--warn' : 'entry--point--info',
          symbol:    (int.type === "clientPart") ? 'symbolDiamond' : 'symbolSquare',
          link:      0
        }))

        // return dt1
        console.dir(dt1)
        this.dt = this.dt.concat(dt1)
        
      })

    },
    
    getVersioningJson: function() {

      fetch("https://webstrates.cs.au.dk/" + this.selected + "/?ops")
        .then(html => html.text())
        .then(body => {
          console.log('Fetched:')
          this.versioningRaw = body
        })
        .then(() => {

          this.versioningRaw = JSON.parse(this.versioningRaw)

          try {
            
            this.wbsAuthor = this.versioningRaw[0].session.userId
            console.dir(this.wbsAuthor)
            
          } catch(err) {
            console.error(err)
          }
          

          this.dt = this.versioningRaw.map(int => ({
            at:        new Date(int.m.ts),
            title:     int.v,
            group:     (Object.keys(int).indexOf('create') !== -1) ? 'create' : 'edition',
            className: (Object.keys(int).indexOf('create') !== -1) ? 'entry--point--success' : 'entry--point--default',
            symbol:    (Object.keys(int).indexOf('create') !== -1) ? 'symbolCross' : 'symbolTriangle',
            link:      int.v
          }))

          
          
          // return dt2 

        })
    },

    fetchAll: function(webstrateIdInst) {

      // new Promise((resolve, reject) => {
      // const [ dt1Promise, dt2Promise ] = await Promise.all([this.getVersioningJson() , this.fetchActivity(webstrateIdInst) ]);
      // thsi.getVersioningJson
        // resolve()
      // }).then((response) => {
        // console.dir('after promise')
        // console.dir(response.dt2, "Dt 2")
      // let dt2Promise = await this.fetchActivity(webstrateIdInst)
      let dt1Inst = this.getVersioningJson()
      let dt2Inst = this.fetchActivity(webstrateIdInst)
      this.dt = dt1Inst.concat(dt2Inst)
        
      // }).then((dt1, dt2) => {
        // console.dir(dt1, "Dt1")
      // Promise.all(dt1, dt2)
      // try {
      // Promise.all([this.getVersioningJson() , this.fetchActivity(webstrateIdInst) ].then((results) => {
      //   this.dt = results[0].concat(results[1])
      // })
      // } catch(err) {
        // console.error(err)
        // this.dt = dt1Promise
      // }
        // })

      }
    
  },
  
  mounted() {}
          
  });