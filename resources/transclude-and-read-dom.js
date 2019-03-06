// webstrate.on("loaded", () => {
window.transcludeAndReadDom = Vue.component('transclude-and-read-dom', {
    mixins: [window.transclusion, window.networkUpd],
    components: {
        'd3-player': window.d3Player,
        'd3-icicle-vertical': window.d3ICicleVertical,
        'd3-vertical-slider': window.d3VerticalSlider,
        "vue-slider-configured": window.slider
    },
    //     :options="options"
    // :margin="margin"
    template: `
        <div>

   <!-- <script src="https://unpkg.com/d3-simple-slider"></script> -->

<h2>Time</h2>

               <div id="mainBody">
                 </div>

     <!-- @range-updated="(dateTimeStart, dateTimeEnd) => yourMethod(dateTimeStart, dateTimeEnd)"  -->
     <!-- @reference-updated="(dateTimeRange, entries) => yourMethod(dateTimeRange, entries)">  -->

 <d3-player 
     :data="gl" 
     width="100%" 
     height="300px">
 </d3-player> 

<br>
<br>


<br>
<br>

<b-container class="container-fluid">
  <b-row>
    <b-col class="col-md-6">

<d3-icicle-vertical
    :data="data"
    :margin="margin"
    width="100%"
    height="300px">
</d3-icicle-vertical>

    </b-col>

      <b-col class="col-md-6">

    <b-row v-for="id in gl">
             <b-col>
           <vue-slider-configured :webstrateIdSliderProp="id.title"> 
           </vue-slider-configured>
             </b-col>

     </b-row>


  <!-- <div class="row align-items-center"> -->
  <!--   <div class="col-sm-2"><p id="value-time"></p></div> -->
  <!--   <div class="col-sm"><div id="slider-time"></div></div> -->
  <!-- </div> -->

    </b-col>

  </b-row>
</b-container>


<div id="t">

<d3-vertical-slider
    :min="min"
    :max="max"
    width="100%"
    height="100%">
</d3-vertical-slider>

</div>

    <button @click="composeNewWebstrate()">Compose New Webstrate</button>

<div id="k">
</div>

        </div>
        `,
    // <!-- @input="(val) => yourMethod(val)" -->
    // <!-- :margin="margin" -->
    data: () => ({
        // options: '',
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
        /**
         * assemble new webstrate with custom versions for transclusions
         * @param {any} wsId - desired Webstrate Title 
         */
        composeNewWebstrate: function(wsId) {

        },
        /**
         * extracting transcluded webstrateIds using regExps
         * @param {any} input - 
         */
        extractSummary: function(input) {

            // var reg = /(?=\<iframe.*?src="\/(.*?)\/*?".*?<\/iframe\>)|(?=\<iframe.*?wid="(.*?)".*?<\/iframe\>)/gi
            // var reg = /\<iframe src="\/(.*?)\/".*?\_\_wid="(.*?)".*?<\/iframe\>/gi // INFO: two groups

            var regSrc = /\<iframe.*?src="\/(.*?)\/*?".*?<\/iframe\>/gi
            var regWid = /\<iframe.*?wid="(.*?)".*?<\/iframe\>/gi

            try {

                var src = (input.match(regSrc) || []).map(e => {
                    return {
                        src: e.replace(regSrc, '$1'),
                    }
                })
                console.log("src = ", src);

                var wid = (input.match(regWid) || []).map(e => {
                    return {
                        wid: e.replace(regWid, '$1'),
                    }
                })
                // console.log("wid = ", wid);

                var tt = wid.map((el, index) => {
                    return {
                        ...el,
                        src: src[index].src
                    }
                })

                return {
                    tt: tt,
                    src: src
                }

            } catch (err) {
                return null
            }
        },
        sqt: async function(input) {

                console.dir("Transclusion")

                // var htmlParsed = await this.getHtmlsPerSessionMixin(input, undefined, undefined, true)
                var prs = this.extractSummary(input)

                var target = [],
                    children = []

                if (prs !== null && typeof prs !== "undefined") {

                    for (var i = 0, len = prs.length; i < len; ++i) {

                        var el = prs[i]

                        children = {
                            value: el.src,
                            name: el.wid,
                            children: (typeof el.src !== "undefined" ? await this.sqt(el.src) : "no transclusions")
                        }

                        target.push(children)
                    }
                } else {

                    console.dir("else statement")

                }
                return target

            },

            /**
             * Transclude given webstrate and search inside its dom tree for inner transclusions
             * @param {any} webstrateId
             */
            recursiveTransclusionSearch: async function(webstrateId) {

                    var target = [],
                        children = [],
                        player = []


                    this.initiateTransclusion()
                    this.createIframe(webstrateId)
                    var tr = document.getElementById(webstrateId)

                    // TODO: if something is commented when

                    var tmp1 = []

                    tr.webstrate.on("transcluded", (iframeWebstrateId) => {

                        try {

                            // console.dir("Transclusion done")
                            // console.dir(tr)
                            // window.tr = tr

                            var tmp = this.extractSummary(tr.contentDocument.documentElement.innerHTML).src
                            // var tmp1 = [...new Set(Object.values(tmp))] 
                            var tmp1 = []
                            tmp.forEach((el) => {
                                tmp1.push(el.src)
                            })

                            tmp1 = [...new Set(tmp1)] // filtering duplicates
                            // console.log("this.extractSummary = ", tmp1);

                        } catch (err) {

                            console.error("Error while parsing", err)

                        } finally {

                            this.removeIframe(webstrateId)

                            player.push((async () => {
                                var el = tmp1[0]
                                return {
                                    value: el,
                                    from: await this.getOpsJsonMixin().then(el => {
                                        return new Date(
                                            el[0].session.connectTime)
                                    }),
                                    to: new Date(),
                                    title: el,
                                    name: el,
                                    key: el,
                                    label: el,
                                    value: Math.random() * (+50 - +2) + +2,
                                }
                            })())

                            tmp1.forEach(async (el) => {

                                children = {
                                    value: el,
                                    from: await this.getOpsJsonMixin().then(el => {
                                        return new Date(
                                            el[0].session.connectTime)
                                    }),
                                    to: new Date(),
                                    title: el,
                                    name: el,
                                    key: el,
                                    label: el,
                                    value: Math.random() * (+50 - +2) + +2,
                                    children: await (async () => {
                                        var [
                                            target
                                        ] = await this.recursiveTransclusionSearch(el)
                                        player.push(target)
                                        return target
                                    })()
                                }
                                target.push(children)
                                this.gl.push(children)
                            })
                        }
                    })


                    // children = {
                    //     value: el.src,
                    //     name: el.wid,
                    //     children: (typeof el.src !== "undefined" ? await this.sqt(el.src) : "no transclusions")
                    //         }
                    // target.push(children)

                    return [target, player]

                    // return {
                    //     target: target,
                    //     player: player
                    // }

                },

                tdf: async function(input) {

                    input.forEach(async el => {

                        this.gl.push(el)
                        var tmp = await el.children

                        this.tdf(tmp)

                    })

                }
    },
    watch: {
        async targetParsed() {
            var cont = {
                key: "main",
                children: this.targetParsed
            }

            this.data = cont
            console.log("Data Player is Watched", this.dataPlayer)

        },
    },
    async mounted() {

        var [
            target,
            player
        ] = await this.recursiveTransclusionSearch("tsd-31")

        this.targetParsed = target
        console.log("this.targetParsed = ", this.gl);

        // this.gl.forEach

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

        // document.getElementById("main").getBoundingClientRect().y

        var tmp = document.getElementById("main").getBoundingClientRect().x,
            tmpL = document.getElementById("main").getBoundingClientRect().y;

        // var tmp2 = document.getElementById("k").getBoundingClientRect().x,
        //     tmp2L = document.getElementById("k").getBoundingClientRect().y

        // <div class="row align-items-center">
        // <div class="col-sm-2"><p id="value-time"></p></div>
        // <div class="col-sm"><div id="slider-time"></div></div>
        // </div>

        var gTime = d3
            .select("div#slider-time")
            .append('svg')
            .attr('width', 500)
            .attr('height', 100)
            .append('g')
            .attr("transform", "translate(30,30)")
            .attr("transform", "scale(0.7)")
        // .attr('transform', "translate(" + tmp2 + "," + tmp2L + ")");

        gTime.call(sliderTime);
        d3.select('p#value-time').text(d3.timeFormat('%Y')(sliderTime.value()));


        function constructWsTransclusionHardcore(wsId) {

            // TODO: additional (complex structures, where copies of webstrates needed to be created)

            // var level - indicate nestedness of transclusion
            // var flag - since 

            // 1. create new webstrate
            // 2. if it is 1-st level transclusion - do not create copy of it
            // 3. if it level > 1, then
            //                 copy it
            //                 write name
            //                 

            // change attribute

            // if transclusion is not nested 

            var intWsId,
                intV;


            // change attribute

        }

        // // document.getElementById("main").getBoundingClientRect().right

        // gTime.call(sliderTime);

        // // d3.select('p#value-time').text(d3.timeFormat('%Y')(sliderTime.value()));
        // d3.select('rect#main').text(d3.timeFormat('%Y')(sliderTime.value()));


        // this.createIframe("short-turtle-55")
        // var webstrateId = "short-turtle-55"

        // var tr = document.getElementById(webstrateId)

        // // tr.webstrate.on("loaded", () => {
        // //     console.dir("Loading is Done")
        // //     console.dir(tr)
        // //     // var d3Data = this.init(tr, undefined, undefined)
        // //     // console.log("d3Data = ", d3Data);
        // //     // console.dir(iframeWebstrateId)
        // //     // console.dir(tr.contentWindow.webstrate.tags())
        // //     // tr.contentWindow.webstrate.tag("CUSTOM")
        // //     // tr.remove()
        // // })

        // // TODO: if something is commented when

        // tr.webstrate.on("transcluded", (iframeWebstrateId) => {

        //     console.dir("Transclusion done")
        //     console.dir(tr)
        //     window.tr = tr

        //     // tr.)

        //     var tmp = this.extractSummary(tr.contentDocument.documentElement.innerHTML)
        //     var tmp1 = [...new Set(tmp)] // filtering duplicates

        //     console.log("this.extractSummary = ", tmp1);
        //     // var d3Data = this.init(tr.contentDocument, undefined, undefined)
        //     // console.log("d3Data = ", d3Data);

        // })

        // this.silentylyTransclude("short-turtle-55")
    }
})
// })