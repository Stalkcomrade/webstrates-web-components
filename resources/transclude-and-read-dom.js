// webstrate.on("loaded", () => {
window.transcludeAndReadDom = Vue.component('transclude-and-read-dom', {
    mixins: [window.transclusion, window.networkUpd],
    components: {
        'selector-component': window.selectorComponent,
        'd3-player': window.d3Player,
        'd3-icicle-vertical': window.d3ICicleVertical,
        'd3-vertical-slider': window.d3VerticalSlider,
        "vue-slider-configured": window.slider
    },
    template: `
        <div>

<div id="trs-container"> </div>

<selector-component/>

<br>
<br>

<h2>Time</h2>

               <div id="mainBody">
                 </div>

 <d3-player 
     :data="gl" 
     width="100%" 
     height="300px">
 </d3-player> 

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

    <button @click="composeNewWebstrate(data)">Compose New Webstrate</button>

<div id="k">
</div>

        </div>
        `,
    data: () => ({
        min: 0,
        max: 20,
        targetParsed: '',
        webstrateIdRemove: '',
        data: '',
        dataPlayer: '',
        realDataPlayer: '',
        levelCounter: 0,
        containerWebstrate: '', // INFO: container webstrate Id to inspect for transclusions
        memArray: [], // INFO: memorise newly created copies of transcluded webstrates
        gl: [] // INFO: data container for creating vis component
    }),
    methods: {
        /**
         * FIXME: create mixin with utils functions
         * used to generate semi-random ids
         * @param {any} start
         * @param {any} stop
         * @param {any} step
         */
        range: function(start, stop, step = 1) {
            Array(Math.ceil((stop - start) / step)).fill(start).map((x, y) => x + y * step)
        },
        /**
         * used to create copies of transcluded webstrates before
         * composing a new webstrates with versioned transclusions
         * @param {any} wsObject
         */
        constructWsTransclusionHardcore: async function(wsObject) {

                // FIXME: main issue is that I cannot watch for dataset and automatically bind it
                // or can via https://stackoverflow.com/questions/44065564/beautiful-way-to-resolve-an-object-with-nested-promises
                // so, bind this function to button to make user decide than promises are resolved

                this.memArray = "https://webstrates.cs.au.dk/" +
                    wsObject.key + "/" +
                    "1" +
                    "?copy=" + wsObject.key + "_assemled"

                // TODO: additional (complex structures, where copies of webstrates needed to be created)
                // TODO: create copy of originial webstrate?

                console.log("Inside Cnstructor")
                // console.log("Constructor", wsId)

                var level; // INFO: indicate nestedness of transclusion

                if (!(wsObject.level % 2)) {

                    var newWs = await fetch("https://webstrates.cs.au.dk/" +
                        wsObject.key + "/" +
                        "1" +
                        "?copy=" + wsObject.key + "_assemled")

                    console.log(newWs)

                } else {

                    console.log("Constructor else statement")
                    // change version inline

                }

                return newWs

                // var flag - since
                // var flag = true

                // 1. create new webstrate
                // 2. if it is 1-st level transclusion - do not create copy of it
                // 3. if it level > 1, then
                //                 copy it
                //                 write name
                //                 

                // change attribute

                // if transclusion is not nested 

                // var intWsId,
                //     intV;
                // change attribute

            },
            /**
             * mapping levels for the transcluded webstrates
             * @param {any} object - processed object containing transcluded webstrates
             */
            mapLevels: function(object) {

                console.log("Mapped", object)

                var levels = 0,
                    levelInternal = 0,
                    flag = false

                var recLevels = function(d, flag) {

                    if (levels === 0) d.level = levels;
                    levels++;
                    flag === true && levelInternal++


                    if (d.children !== undefined && d.children !== null) {

                        // INFO: levels internal

                        if (d.children.length > 1) {


                            d.children.forEach(child => {

                                child.level = levelInternal;
                                typeof child.children !== undefined && recLevels(child.children, false)

                            })

                        } else {

                            // INFO: general case
                            var child = d.children[0]

                            child.level = levels;
                            typeof child.children !== undefined && recLevels(child.children, true)

                        }

                    }

                    return d

                }

                return recLevels(object, true)


            },
            /**
             * helper function to make a flat array of nested transclusions
             * @param {any} objectAfterMapLevels 
             */
            flattenStructure: function(objectAfterMapLevels) {


                console.log("objectAfterMapLevels", objectAfterMapLevels)
                var target = [] // INFO: local-global scope

                function sq(input) {

                    if (input.length !== 0) target.push(input);

                    if (input.children !== undefined) {

                        if (input.children.length > 1) {
                            input.children.forEach(el => sq(el)) // INFO: if multiple
                        } else {
                            sq(input.children) // INFO: if single
                        }

                    }

                    return target
                }

                return sq(objectAfterMapLevels)

            },
            /**
             * assemble new webstrate with custom versions for transclusions
             * @param {any} wsId - desired Webstrate Title 
             */
            composeNewWebstrate: function(wsId) {

                var mapped = this.mapLevels(this.data)
                console.log("mapped = ", mapped);
                var flattened = this.flattenStructure(mapped)
                console.log("flattened = ", flattened);

                flattened.forEach(async (ws) => {

                    var final = await this.constructWsTransclusionHardcore(ws)
                    console.log("final = ", final);

                })

            },
            // TODO: use from mixins
            /**
             * TODO: check for commented transclusions
             * extracting transcluded webstrateIds using regExps
             * @param {any} input
             */
            extractSummary: function(input) {

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
                 * TODO: add level of nestedness
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

                                var tmp = this.extractSummary(tr.contentDocument.documentElement.innerHTML).src
                                var tmp1 = []
                                tmp.forEach((el) => {
                                    tmp1.push(el.src)
                                })

                                tmp1 = [...new Set(tmp1)] // filtering duplicates

                            } catch (err) {

                                console.error("Error while parsing", err)

                            } finally {

                                // this.removeIframe(webstrateId)

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


                                // TODO: bind container webstrate as well

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


                        return [target, player]

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
                key: this.containerWebstrate,
                title: this.containerWebstrate,
                children: this.targetParsed
            }

            this.data = cont
            console.log("FINAL DATASET:", this.data)
            console.log("Data Player is Watched", this.dataPlayer)

        },
    },
    async mounted() {

        // tsd-31
        // ugly-mule-22

        this.containerWebstrate = "ugly-mule-22"

        var [
            target,
            player
        ] = await this.recursiveTransclusionSearch(this.containerWebstrate)

        this.targetParsed = target

        this.initiateTransclusionNew("")
        this.createIframeNew(this.containerWebstrate)

    }
})
// })