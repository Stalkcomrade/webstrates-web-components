import { d3Timeline } from '../node_modules/d3-vs';

window.RealtimeComponent = Vue.component('realtime', {  
    // :options="options"
    // @range-updated="(dateTimeStart, dateTimeEnd) => yourMethod(dateTimeStart, dateTimeEnd)">
    // :margin="margin"
  template: `
<d3-timeline
    width="100%"
    height="300px"
    :data="dt">
</d3-timeline>
  `,
    components: {
    'd3-timeline': d3Timeline
    },
    
  // data() {
    
  //   return {
      
  //     dt: [{at: new Date(2011, 01, 10),
  //           title: 'String',
  //           group: 'group',
  //           className: 'entry--point--default',
  //           symbol: 'symbolCircle'},
  //          {at: new Date(2011, 01, 11),
  //           title: 'String1',
  //           group: 'group',
  //           className: 'entry--point--default',
  //           symbol: 'symbolCircle'}]

  //   }
  // }
        
});
