window.player = Vue.component('player', {
    components: {
        'd3-player': window.d3Player,
        'd3-vertical-slider': window.d3VerticalSlider
    },
    template: `
        <div>

 <!-- <d3-player  -->
 <!--     :data="data"  -->
 <!--     width="100%"  -->
 <!--     height="300px"> -->
 <!-- </d3-player>  -->

<br>
<br>

<d3-vertical-slider
    :min="min"
    :max="max"
    :margin="margin"
    width="100%"
    height="100%">
</d3-vertical-slider>

<h2>Time</h2>
  <div class="row align-items-center">
    <div class="col-sm-2"><p id="value-time"></p></div>
    <div class="col-sm"><div id="slider-time"></div></div>
  </div>

        </div>
        `,
    data: () => ({
        min: 0,
        targetParsed: '',
        max: 20,
        webstrateIdRemove: '',
        data: '',
        dataPlayer: '',
        realDataPlayer: '',
        gl: []
    }),
    methods: {
        range: function(start, stop, step = 1) {
            Array(Math.ceil((stop - start) / step)).fill(start).map((x, y) => x + y * step)
        },
    },
    watch: {
        async gl() {

            var cont = {
                key: "main",
                children: this.targetParsed
            }

            console.log("Watched")
            this.data = this.gl

        },
    },
    computed: {},
    created() {

        this.gl = [{
                from: new Date() - 10,
                to: new Date(),
                title: 'new',
                label: 'new',
                className: 'new'
            },

            {
                from: new Date() - 10,
                to: new Date(),
                title: 'new1',
                label: 'new2',
                className: 'new2'
            }

        ]

        console.log(this.gl)

    },

    async mounted() {

        // Time
        var dataTime = d3.range(0, 10).map(function(d) {
            return new Date(1995 + d, 10, 3);
        });

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
            .append('svg')
            .attr('width', 500)
            .attr('height', 100)
            .append('g')
            .attr('transform', 'translate(30,100)');

        gTime.call(sliderTime);

        d3.select('p#value-time').text(d3.timeFormat('%Y')(sliderTime.value()));


    }

})