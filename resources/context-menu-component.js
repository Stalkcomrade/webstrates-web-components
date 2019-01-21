window.cmc = Vue.component('c-m-c', {
    components: {
        'context-menu-component-imported': window.vueContext.VueContext
    },
    template: `

<div>
<context-menu-component-imported ref="menu">
  <ul>
    <li @click="onClick($event.target.innerText)">Option 1</li>
    <li @click="onClick($event.target.innerText)">Option 2</li>
  </ul>
</context-menu-component-imported>
</div>
`,
    methods: {
        onClick () {
            console.dir("!!!!!!")
        },
    }

})
