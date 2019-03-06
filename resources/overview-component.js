window.OverviewComponent = Vue.component('overview', {
    template: `

<div>

<script src="https://d3js.org/d3.v5.min.js"></script>
<script src="https://unpkg.com/d3-simple-slider"></script>


  <d3-metric
  id="tmp"
  :data="counter"
  width="100%"
  height="600px"> 
  </d3-metric>




  <h2>Time</h2>
  <div class="row align-items-center">
    <div class="col-sm-2"><p id="value-time"></p></div>
    <div class="col-sm"><div id="slider-time"></div></div>
  </div>

</div>
  `,
    components: {
        'd3-metric': window.d3Metric,
        'vue-slider': window.vueSlider,
        'context-menu-component': window.contextMenu
    },
    data: () => ({
        counter: '35000',
        value: 1
    }),
    // <vue-slider v-model="value" ref="slider"> </vue-slider>
    mounted() {
        this.counter = 45000


        // Time
        var dataTime = d3.range(0, 10).map(function(d) {
            return new Date(1995 + d, 10, 3);
        });

        // var tmp = document.getElementById("tmp").getBoundingClientRect().right,
        //     tmpL = document.getElementById("tmp").getBoundingClientRect().right + 30;

        var tmp = document.getElementById("tmp").getBoundingClientRect().x - 300,
            tmpL = document.getElementById("tmp").getBoundingClientRect().y - 300;


        var sliderTime = d3
            .sliderBottom()
            .min(d3.min(dataTime))
            .max(d3.max(dataTime))
            .step(1000 * 60 * 60 * 24 * 365)
            .width(300)
            .tickFormat(d3.timeFormat('%Y'))
            .tickValues(dataTime)
            .default(new Date(1998, 10, 3))
            .on('onchange', val => {
                d3.select('p#value-time').text(d3.timeFormat('%Y')(val));
            });

        var gTime = d3
            .select('div#slider-time')
            // .select('#tmp')
            .append('svg')
            .attr('width', 500)
            .attr('height', 100)
            .append('g')
            .attr('transform', 'translate(250,100)');
        // .attr('transform', "translate(" + tmp + "," + tmpL + ")");

        gTime.call(sliderTime);

        d3.select('p#value-time').text(d3.timeFormat('%Y')(sliderTime.value()));

        // var dataTime = d3.range(0, 10).map(function(d) {
        //     return new Date(1995 + d, 10, 3);
        // });

        // var sliderTime = d3
        //     .sliderBottom()
        //     .min(d3.min(dataTime))
        //     .max(d3.max(dataTime))
        //     .step(1000 * 60 * 60 * 24 * 365)
        //     .width(300)
        //     .tickFormat(d3.timeFormat('%Y'))
        //     .tickValues(dataTime)
        //     .default(new Date(1998, 10, 3))
        //     .on('onchange', val => {
        //         d3.select('p#value-time').text(d3.timeFormat('%Y')(val));
        //     });



        // // document.getElementById("main").getBoundingClientRect().y


        // // var tmp2 = document.getElementById("k").getBoundingClientRect().x,
        // //     tmp2L = document.getElementById("k").getBoundingClientRect().y



        // var gTime = d3
        //     .select("div#value-time")
        //     .append('svg')
        //     .attr('width', 500)
        //     .attr('height', 100)
        //     .append('g')
        //     .attr("transform", "translate(30, 30)")
        // // .attr('transform', "translate(" + tmp2 + "," + tmp2L + ")");

        // gTime.call(sliderTime);
        // d3.select('div#slider-value').text(d3.timeFormat('%Y')(sliderTime.value()));


    }

});