// var [d3Player, d3ICicleVertical, d3VerticalSlider, d3Timeline, d3Metric] = () => import {
//     d3Player,
//     d3ICicleVertical,
//     d3VerticalSlider,
//     d3Timeline,
//     d3Metric,
// } from '../node_modules/d3-vs';


const d3Player = () =>
    import( /* webpackChunkName: "d3Player" */
        /* webpackMode: "lazy" */
        '/home/stlk/Downloads/node_modules/d3-vs/src/components/d3Player/d3Plyaer.vue')

const d3ICicleVertical = () =>
    import( /* webpackChunkName: "d3ICicleVertical" */ '/home/stlk/Downloads/node_modules/d3-vs/src/components/d3ICicleVertical/d3ICicleVertical.vue')

const d3VerticalSlider = () =>
    import( /* webpackChunkName: "d3VerticalSlider" */ '/home/stlk/Downloads/node_modules/d3-vs/src/components/d3VerticalSlider/d3VerticalSlider.vue')

const d3Timeline = () =>
    import( /* webpackChunkName: "d3Timeline" */ '/home/stlk/Downloads/node_modules/d3-vs/src/components/d3Timeline/d3Timeline.vue')

const d3Metric = () =>
    import( /* webpackChunkName: "d3Player" */ '/home/stlk/Downloads/node_modules/d3-vs/src/components/d3Metric/d3Metric.vue')


// import {
//     // d3Player,
//     // d3ICicleVertical,
//     // d3VerticalSlider,
//     // d3Timeline,
//     d3Metric,

// } from '../node_modules/d3-vs';

import vueSlider from '/home/stlk/Downloads/node_modules/vue-slider-component/src/vue2-slider.vue'
import LayoutGrid from '/home/stlk/Downloads/node_modules/vue-layout-grid/dist/LayoutGrid.min.js'

window.LayoutGrid = LayoutGrid
window.vueContext = require('vue-context')

window.d3Metric = d3Metric
window.d3Timeline = d3Timeline
window.d3Player = d3Player
window.d3ICicleVertical = d3ICicleVertical
window.d3VerticalSlider = d3VerticalSlider

window.vueSlider = vueSlider

window.jsdiffTrue = require('diff')

// window.jsdiff = require('json0-ot-diff')
// window.js = require('html-to-jsonml')
// window.Diff = require('text-diff')