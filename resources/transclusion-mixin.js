window.transclusion = Vue.mixin({
    data: () => ({
        docContainer: '',
        docIframeTransient: '',
        transcludedWebstrateId: ''
    }),
    methods: {
        /**
         * chaning version of transcluded webstrate for plain/1-st level structures
         * @param {any} wsId - transcluded webstrate Id to manipulate
         * @param {any} v - desired version derived from corresponding tag/session
         */
        constructWsTransclusionSimple: function(wsId, v) {

            // INFO: several things to consider
            // transient tags
            // In order to really compose new webstrate with custom version,
            // I need to delete transiet section and apply dom to non-transient section

            // INFO: make a recommendation to disable programmatic creation of transclusion
            // per a demonstration - cause they gonna interfere/duplicate with the composed webstrate

            // INFO: programmatic creation of transclusion
            // In this case, I am just parsing already processed webstrate
            // So, no probelm to solve here

            // TODO: test plain structure
            // SOLVED: I need to check whether it is already been used
            // FIXME: don't delete transclusions

            var ndList = document.getElementsByTagName("iframe")

            for (var i = 0; i < ndList.length; i++) {

                ndList[i].getAttribute("src").search(wsId) > -1 &&
                    ndList[i].setAttribute("src", "/" + wsId + "/" + v + "/")

            }

            // document.getElementById(wsId).setAttribute("src", "/" + wsId + "/" + v + "/")

        },
        /** Used for tags fetching */
        initiateTransclusion: function() {
            // this.docContainer = document.getElementById("trans-container")
            this.docContainer = document.getElementById("mainBody")
            this.docIframeTransient = document.createElement("transient")
            this.docContainer.appendChild(this.docIframeTransient)
        },
        /** Used for visibly attaching iframe */
        initiateTransclusionNew: function() {
            // this.docContainer = document.getElementById("trans-container")
            this.docContainer = document.getElementById("trs-container")
            this.docIframeTransient = document.createElement("transient")
            this.docContainer.appendChild(this.docIframeTransient)
        },
        /**
         * creates invisible iframe
         * @param {any} webstrateId
         */
        createIframe: function(webstrateId) {

            var docIframe = document.createElement("iframe")

            docIframe.setAttribute("src", "/" + webstrateId + "/")
            docIframe.setAttribute("id", webstrateId)
            docIframe.setAttribute("style", "display: none;")

            this.docIframeTransient.appendChild(docIframe)

        },
        /**
         * creates visible iframe
         * @param {any} webstrateId
         */
        createIframeNew: function(webstrateId) {

            var docIframe = document.createElement("iframe")

            docIframe.setAttribute("src", "/" + webstrateId + "/")
            docIframe.setAttribute("id", webstrateId)
            docIframe.setAttribute("width", 750)
            docIframe.setAttribute("height", 750)

            this.docIframeTransient.appendChild(docIframe)

        },

        // FIXME: remove function
        removeIframe: function(webstrateId) {

            var tr = document.getElementById(webstrateId)

            function removeElement(elementId) {
                var element = document.getElementById(elementId);
                element.parentNode.removeChild(element);
            }



            removeElement(webstrateId)
        },

        selectWebstrateIdFromTransclusion: function(webstrateId) {

            var tr = document.getElementById(webstrateId)
            tr.webstrate.on("transcluded", (iframeWebstrateId) => {

                console.dir("Transclusion done")
                console.dir(iframeWebstrateId)

                window.tss = tr.contentDocument.documentElement // BODY tag
                // window.tss = tr.contentDocument.documentElement.children[1] // BODY tag
                // console.log("tmp = ", tmp);


                console.dir(tr.contentWindow.webstrate.tags())

            })


        },
        receiveTags: function(webstrateId) {

            var tr = document.getElementById(webstrateId)

            tr.webstrate.on("transcluded", (iframeWebstrateId) => {

                console.dir("Transclusion done")
                console.dir(iframeWebstrateId)
                console.dir(tr.contentWindow.webstrate.tags())

                tr.contentWindow.webstrate.tag("CUSTOM")
                tr.remove()
            })

        },
        /**
         * Transclude Ws in order to read Dom
         * This creates no visible transcluded iframe
         * @param {any} webstrateId
         */
        silentylyTransclude: function(webstrateId) {

            // var docIframe = document.createElement("iframe")

            // docIframe.setAttribute("src", "/" + webstrateId + "/")
            // docIframe.setAttribute("id", webstrateId)
            // docIframe.setAttribute("width", 750)
            // docIframe.setAttribute("height", 750)


            // this.docIframeTransient.appendChild(docIframe)

            var tr = document.getElementById(webstrateId)

            tr.webstrate.on("loaded", () => {

                console.dir("Loading is Done")
                console.dir(tr)


                // var d3Data = this.init(tr, undefined, undefined)
                // console.log("d3Data = ", d3Data);


                // console.dir(iframeWebstrateId)
                // console.dir(tr.contentWindow.webstrate.tags())


                // tr.contentWindow.webstrate.tag("CUSTOM")
                // tr.remove()
            })

            tr.webstrate.on("transcluded", (iframeWebstrateId) => {

                console.dir("Transclusion done")


            })

            // return tr

        }
    }
})