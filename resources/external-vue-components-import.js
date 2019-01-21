import {
    d3Timeline,
    d3Metric
} from '../node_modules/d3-vs';

import vueSlider from '/home/stlk/Downloads/node_modules/vue-slider-component/src/vue2-slider.vue'

// import VueContext from '/home/stlk/Downloads/node_modules/vue-context/dist/vue-context.js'
// window.vueContext = VueContext
window.vueContext = require('vue-context')

window.d3Metric = d3Metric
window.d3Timeline = d3Timeline
window.vueSlider = vueSlider

window.jsdiff = require('json0-ot-diff')
window.js = require('html-to-jsonml')

window.jsdiffTrue = require('diff')

// var one = 'beep boop',
//     other = 'beep boob blah',
//     color = '',
//     span = null;

// var diff = window.jsdiffTrue.diffChars(one, other),
//     display = document.getElementById('display'),
//     fragment = document.createDocumentFragment();

// diff.forEach(function(part){
//   // green for additions, red for deletions
//   // grey for common parts
//   color = part.added ? 'green' :
//     part.removed ? 'red' : 'grey';
//   span = document.createElement('span');
//   span.style.color = color;
//   span.appendChild(document
//     .createTextNode(part.value));
//   fragment.appendChild(span);
// });

// display.appendChild(fragment);


window.Diff = require('text-diff')
// var diff = new window.Diff(); 
// var textDiff = diff.main("tre[0]", "tre[1]"); // produces diff array
// this.currentVersionSpan = diff.prettyHtml(textDiff)
