window.RealtimeComponent = Vue.component('realtime', {  
    // :options="options"
    // @range-updated="(dateTimeStart, dateTimeEnd) => yourMethod(dateTimeStart, dateTimeEnd)">
    // :margin="margin"
  template: `
<d3-timeline
    width="100%"
    height="300px"
    :data="[{ at: 'Sun Oct 01 2017 02:00:00 GMT+0200 (Central European Summer Time)', title: 'String1', group: 'group', className: 'entry--point--default', symbol: 'symbolCircle'}, { at: 'Mon Oct 02 2017 02:00:00 GMT+0200 (Central European Summer Time)', title: 'String', group: 'group', className: 'entry--point--default', symbol: 'symbolCircle'}]"
</d3-timeline>
  `,
  // data: {
    
  //   [{ at: "Sun Oct 01 2017 02:00:00 GMT+0200 (Central European Summer Time)",
  //      title: 'String',
  //      group: 'group',
  //      className: 'entry--point--default',
  //      symbol: 'symbolCircle'
  //    }, 
  //    { at: "Mon Oct 02 2017 02:00:00 GMT+0200 (Central European Summer Time)",
  //      title: 'String2',
  //      group: 'group',
  //      className: 'entry--point--default',
  //      symbol: 'symbolCircle'
  //    }]

  // }
    // components: {
    // 'd3-timeline': d3InstanceTimelineComponent
    // },

  // data: () => ( {
  //   //   [
  //   // {
  //     at: '24-06-1995',
  //     // tooltip
  //     title: 'String',
  //     group: 'group',
  //     // internally we have 4 className, they are 'entry--point--default', 'entry--point--success', 'entry--point--warn', 'entry--point--info'
  //     // you can also specify your own class and add it to SPA. The class shouldn't be in scoped style
  //     className: 'entry--point--default',
  //     // it supports 7 symbols, they are 'symbolCircle', 'symbolCross', 'symbolDiamond', 'symbolSquare', 'symbolStar', 'symbolTriangle', 'symbolWye'
  //     symbol: 'symbolCircle'
  //   // }
  //   //   ]
  // })

  // {

        // 

  
    //   [{ 
    //   at: '24-06-1995',
    //   // tooltip
    //   title: 'String',
    //   group: 'group',
    //   // internally we have 4 className, they are 'entry--point--default', 'entry--point--success', 'entry--point--warn', 'entry--point--info'
    //   // you can also specify your own class and add it to SPA. The class shouldn't be in scoped style
    //   className: 'entry--point--default',
    //   // it supports 7 symbols, they are 'symbolCircle', 'symbolCross', 'symbolDiamond', 'symbolSquare', 'symbolStar', 'symbolTriangle', 'symbolWye'
    //   symbol: 'symbolCircle'
    // }]
  // }

  
  // data: function () {

  //   return {
  //     [
  //   {
  //     at: '24-06-1995',
  //     // tooltip
  //     title: 'String',
  //     group: 'group',
  //     // internally we have 4 className, they are 'entry--point--default', 'entry--point--success', 'entry--point--warn', 'entry--point--info'
  //     // you can also specify your own class and add it to SPA. The class shouldn't be in scoped style
  //     className: 'entry--point--default',
  //     // it supports 7 symbols, they are 'symbolCircle', 'symbolCross', 'symbolDiamond', 'symbolSquare', 'symbolStar', 'symbolTriangle', 'symbolWye'
  //     symbol: 'symbolCircle'

  //   }
  //     ]

  //   }
  // }
        
});
