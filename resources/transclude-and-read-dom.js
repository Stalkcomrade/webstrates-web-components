webstrate.on("loaded", () => {

    window.transcludeAndReadDom = Vue.component('transclude-and-read-dom', {
        mixins: [window.transclusion, window.networkUpd],
        template: `
        <div>
               <div id="mainBody">
                 </div>

        </div>
        `,
        data: () => ({
            options: '',
            webstrateIdRemove: ''
        }),
        methods: {
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
                    console.log("wid = ", wid);

                    var tt = wid.map((el, index) => {
                        return {
                            ...el,
                            src: src[index].src
                        }
                    })
                    console.log("tt = ", tt);


                    return tt

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

            }

        },
        watch: {},
        computed: {},
        async created() {},

        async mounted() {


            this.initiateTransclusion()
            this.createIframe("short-turtle-55")
            var webstrateId = "short-turtle-55"

            var tr = document.getElementById(webstrateId)

            // tr.webstrate.on("loaded", () => {

            //     console.dir("Loading is Done")
            //     console.dir(tr)


            //     // var d3Data = this.init(tr, undefined, undefined)
            //     // console.log("d3Data = ", d3Data);


            //     // console.dir(iframeWebstrateId)
            //     // console.dir(tr.contentWindow.webstrate.tags())


            //     // tr.contentWindow.webstrate.tag("CUSTOM")
            //     // tr.remove()
            // })

            // TODO: if something is commented when

            tr.webstrate.on("transcluded", (iframeWebstrateId) => {

                console.dir("Transclusion done")
                console.dir(tr)
                window.tr = tr

                // tr.)

                var tmp = this.extractSummary(tr.contentDocument.documentElement.innerHTML)
                var tmp1 = [...new Set(tmp)] // filtering duplicates

                console.log("this.extractSummary = ", tmp1);
                // var d3Data = this.init(tr.contentDocument, undefined, undefined)
                // console.log("d3Data = ", d3Data);



            })



            // this.silentylyTransclude("short-turtle-55")

        }

    })


})