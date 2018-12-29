import {
    d3Timeline,
    d3Metric
} from '../node_modules/d3-vs';

// import {
//     vueSlider
// } from '/home/stlk/Downloads/node_modules/vue-slider-component';

import vueSlider from '/home/stlk/Downloads/node_modules/vue-slider-component/src/vue2-slider.vue'

window.d3Metric = d3Metric
window.d3Timeline = d3Timeline
window.vueSlider = vueSlider

window.jsdiff = require('json0-ot-diff')
window.js = require('html-to-jsonml')
window.jsdiffTrue = require('diff')