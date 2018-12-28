import {
    d3Timeline,
    d3Metric
} from '../node_modules/d3-vs';


window.d3Metric = d3Metric
window.d3Timeline = d3Timeline

window.jsdiff = require('json0-ot-diff')
window.js = require('html-to-jsonml')
window.jsdiffTrue = require('diff')