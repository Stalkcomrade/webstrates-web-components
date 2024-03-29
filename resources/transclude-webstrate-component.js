webstrate.on('loaded', () => {

    window.transcludeWebstrateComponent = Vue.component('transclude-webstrate-component', {
        mixins: [window.transclusion, window.networkUpd],
        components: {
            'dom-tree-d3': window.DomTreeD3Component
        },
        template: `

        <div>

<b-container class="container-fluid">

        <select v-model="selected" type="button" class="btn dropdown-toggle btn-primary">
          <option v-for="option in options" v-bind:value="option">
               {{ option }}
          </option>
        </select>

  <b-row>

    <b-col class="col-md-8">
    <div id="trs-container"> </div>
    </b-col>

    <b-col class="col-md-4">

     <dom-tree-d3>
        </dom-tree-d3>


    </b-col>

  </b-row>
</b-container>


<div id="mainBody">
</div>

        </div>
        `,
        data: () => ({
            options: '',
            webstrateIdRemove: ''
        }),
        methods: {
            onTranscluded: function() {}

        },
        watch: {
            // INFO: reacts on the selected change and updates transclusion
            selected() {

                var container = this.webstrateIdRemove
                console.log("container = ", container);

                this.removeIframe(container)

                this.createIframeNew(this.selected)
                this.selectWebstrateIdFromTransclusion(this.selected)


            }
        },
        computed: {
            selected: {
                get() {
                    return this.$store.state.webstrateId
                },
                set(value) {
                    this.webstrateIdRemove = this.$store.state.webstrateId
                    this.$store.commit('changeCurrentWebstrateId', value)
                }
            }
        },
        async created() {
            var DaysPromise = await this.fetchDaysOverview((new Date))
            this.options = this.listOfWebstrates(DaysPromise)
        },

        mounted() {

            if (this.$route.path === "/transclude-webstrate-component") {

                this.$store.commit('changeCurrentWebstrateId', "dry-goat-98")

                this.$store.commit('changeWebstrateIdIsTranscluded', true)
                this.$store.commit('changeCurrentWebstrateId', "dry-goat-98")
                this.initiateTransclusionNew()
                this.createIframeNew("dry-goat-98")

                this.selectWebstrateIdFromTransclusion("dry-goat-98")

            } else {


                this.$store.commit('changeCurrentWebstrateId', "neat-husky-32")

                this.$store.commit('changeWebstrateIdIsTranscluded', true)
                this.$store.commit('changeCurrentWebstrateId', "neat-husky-32")
                this.initiateTransclusionNew()
                this.createIframeNew("neat-husky-32")

                this.selectWebstrateIdFromTransclusion("neat-husky-32")


            }




        }

    })


})