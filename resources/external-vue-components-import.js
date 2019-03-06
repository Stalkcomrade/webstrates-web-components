import {
    d3Player,
    // d3ICicleHorizontal,
    d3ICicleVertical,
    d3VerticalSlider,
    d3Timeline,
    d3Metric,

} from '../node_modules/d3-vs';


import LayoutGrid from 'vue-layout-grid';
window.LayoutGrid = LayoutGrid
import Buefy from 'buefy';
// import 'buefy/lib/buefy.min.css';


import vueSlider from '/home/stlk/Downloads/node_modules/vue-slider-component/src/vue2-slider.vue'
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