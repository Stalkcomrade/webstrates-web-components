import isNull from 'lodash';
import isNumber from 'lodash';
import debounce from 'lodash';

import mixins from '../node_modules/d3-vs/src/mixins';

// import showTip from 'tooltip';
// import hideTip from 'tooltip';

import { showTip, hideTip } from './librariesOriginal'

var metric = {
    
    props: {
            width: {
                type: String,
                default: '100%'
            },
            height: {
                type: String,
                default: '300px'
            },
            margin: {
                type: Object,
                default: () => ({})
            },
            data: {
                type: [Number, String],
                required: true
            },
            options: {
                type: Object,
                default: () => ({})
            }
        },
        methods: {
            ifExistsSvgThenRemove() {
                const svgSelection = d3.select(this.$el).select('svg');
    
                if (svgSelection.empty()) return;
    
                svgSelection.remove();
            },
            getElWidthHeight() {
                return [this.$el.clientWidth, this.$el.clientHeight];
            },
            getSelectionWidthHeight(selection) {
                return [
                    selection.node().getBBox().width,
                    selection.node().getBBox().height
                ];
            },
            getSelectionOffset(selection) {
                return [
                    selection.node().getBBox().x,
                    selection.node().getBBox().y
                ];
            }
        },
        watch: {
            width: {
                deep: false,
                handler(n) {
                    this.$nextTick(() => {
                        this.safeDraw();
                    });
                }
            },
            height: {
                deep: false,
                handler(n) {
                    this.$nextTick(() => {
                        this.safeDraw();
                    });
                }
            },
            margin: {
                deep: true,
                handler(n) {
                    this.$nextTick(() => {
                        this.safeDraw();
                    });
                }
            },
            data: {
                deep: false,
                handler(n) {
                    this.$nextTick(() => {
                        this.safeDraw();
                    });
                }
            },
            options: {
                deep: true,
                handler(n) {
                    this.$nextTick(() => {
                        this.safeDraw();
                    });
                }
            }
        },
        mounted() {
            this.$nextTick(this.safeDraw);
    
            this._handleResize = debounce(this.onResize, 500);
    
            window.addEventListener('resize', this._handleResize);
        },
        beforeDestroy() {
            window.removeEventListener('resize', this._handleResize);
        }
    
    
    
    };

window.d3InstanceComponent = Vue.component('d3-metric', {
    name: 'd3-metric',
    mixins: [mixins],
    // mixins: [metric],
    template: `
    <div class="d3-metric" :style="{ 'width' : width, 'height' : height}"></div> 
`,

    methods: {
      drawMetric() {
        const data = 25000,
            // const data = this.data,
                {
                    axisXLabel = null,
                    axisLabelFontSize = 12,
                    axisLabelFontWeight = 400,
                    axisLabelFontOpacity = 0.5,

                    metricLabelColor = '#000000',
                    metricLabelFontSize = 120,
                    metricLabelFontWeight = 900,
                    metricLabelFontOpacity = 0.5,

                    metricTitle = d => `${d}`,

                    metricPrecision = 2
                } = this.options,
                {
                    axisXLabelLaneHeight = isNull(axisXLabel) ? 0 : 30
                } = this.options,
                [w, h] = this.getElWidthHeight(),
                {left = 0, top = 0, right = 0, bottom = 0} = this.margin,
                g_w = w - left - right,
                g_h = h - top - bottom - axisXLabelLaneHeight;

            if (![g_w, g_h].every(el => el > 0)) return;

            const svg = d3.select(this.$el)
                .append('svg')
                .attr('width', w)
                .attr('height', h);

            const axisXLabelLane = svg
                .append('g')
                .attr('transform', `translate(${left}, ${top})`);

            const g = svg
                .append('g')
                .attr('transform', `translate(${left}, ${top + axisXLabelLaneHeight})`);

            axisXLabelLane
                .append('text')
                .attr('text-anchor', 'middle')
                .attr('x', g_w / 2)
                .attr('y', axisXLabelLaneHeight / 2)
                .attr('dy', '0.32em')
                .text(axisXLabel)
                .attr('fill', '#000')
                .attr('fill-opacity', axisLabelFontOpacity)
                .attr('font-size', axisLabelFontSize)
                .attr('font-weight', axisLabelFontWeight);

            g.append('text')
                .datum(data)
                .attr('text-anchor', 'middle')
                .attr('x', g_w / 2)
                .attr('y', g_h / 2)
                .attr('dy', '0.32em')
                .text(isNumber(data) ? d3.format(',')(data.toFixed(metricPrecision)).toString() : data)
                .attr('fill', metricLabelColor)
                .attr('fill-opacity', metricLabelFontOpacity)
                .attr('font-size', metricLabelFontSize)
                .attr('font-weight', metricLabelFontWeight)
                .on('mouseover', showTip(metricTitle))
                .on('mouseout', hideTip);
        },
        safeDraw() {
            this.ifExistsSvgThenRemove();
            this.drawMetric();
        },
        onResize() {
            this.safeDraw();
        }
    }
  
});
