window.smallMultiplesGlobalComponent = Vue.component('small-multiples-global', {
    mixin: [dataFetchMixin],
    template: `
  
       <div class="global">

    <b-container class="bv-example-row">
                <b-row>
                   <small-multiples-d3 id="1">
                </b-row>
                 <b-row>
                   <small-multiples-d3 id="2">
                </b-row>
<b-row>
                   <small-multiples-d3 id="2">
                </b-row>
        </b-container>

       </div>

`,
    components: {
        'small-multiples-d3': window.smallMultiplesD3Component
    }

})