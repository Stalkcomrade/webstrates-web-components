import { isNull, cloneDeep } from 'lodash';

import uuid from 'uuid/v1';
import drawGen from '../node_modules/d3-vs/src/components/d3Timeline/drawGen.js';

import emit from '../node_modules/d3-vs/src/utils/emit.js';
import { selectPaddingInnerOuterY } from '../node_modules/d3-vs/src/utils/select.js';
import { getTimelineGroups } from '../node_modules/d3-vs/src/utils/getTimelineGroups.js';

import roundedRect from '../node_modules/d3-vs/src/plugins/roundedRect.js';
import zoom from '../node_modules/d3-vs/src/plugins/zoom.js';
import cursor from '../node_modules/d3-vs/src/plugins/cursor.js';
import { brushX } from '../node_modules/d3-vs/src/plugins/brush.js';
import { drawCurrentReferenceX } from '../node_modules/d3-vs/src/plugins/drawCurrentReference.js';

import mixins from '../node_modules/d3-vs/src/mixins';

window.d3InstanceTimelineComponent = Vue.component('d3-timeline', {
  name: 'd3-timeline',
  mixins: [mixins],
  template: ` <div class="d3-timeline" :style="{ 'width' : width, 'height' : height }"></div> `,
  
        data() {
            return {
                scale: null
            }
        },
        methods: {
          drawTimeline() {
            // var ddd = new Date("2017-10-01")
            // var ddd1 = new Date("2017-10-02")
            // const dataInst = [{ at: ddd,
            //                 title: 'String',
            //                 group: 'group',
            //                 className: 'entry--point--default',
            //                 symbol: 'symbolCircle'
            //               },
            //               { at: ddd1,
            //                 title: 'String2',
            //                 group: 'group',
            //                 className: 'entry--point--default',
            //                 symbol: 'symbolCircle'
            //               }]
            const [w, h] = this.getElWidthHeight(),
                  { dateTimeStart, dateTimeEnd, data, groups } = getTimelineGroups(_.cloneDeep(this.data));
            
            // const [w, h] = this.getElWidthHeight(),
            //       { dateTimeStart, dateTimeEnd, data, groups } = getTimelineGroups(_.cloneDeep(dataInst));

                if (!groups.length) return;
                const {
                        intervalCornerRadius = 4,
                        symbolSize = 400,
                        groupLabelFontSize = 12,
                        groupLabelFontWeight = 400,
                        groupLabelFontOpacity = 1,
                        groupLaneWidth = 200,
                        tickSize = 10,
                        tickPadding = 8,
                        axisXLaneHeight = 40,
                        axisFontSize = 12,
                        axisFontWeight = 400,
                        axisFontOpacity = 1,
                        axisXLabel = null,
                        axisLabelFontSize = 12,
                        axisLabelFontWeight = 600,
                        axisLabelFontOpacity = 0.5,
                        backgroundColor = 'rgba(255, 255, 255, 0.125)',
                        borderRadius = 0,
                        borderWidth = 2,
                        borderColor = 'rgba(0, 0, 0, .125)',
                        boundingLineWidth = 2,
                        boundingLineColor = 'rgba(0, 0, 0, .125)',
                        currentTimeLineWidth = 2,
                        currentTimeLineColor = 'rgba(255, 56, 96, 1)'
                    } = this.options,
                    {
                        axisXLabelLaneHeight = _.isNull(axisXLabel) ? 0 : 30,
                    } = this.options,
                    { left = 0, top = 0, right = 0, bottom = 0 } = this.margin,
                    __offset__  = borderWidth,
                    g_w = w - left - right - groupLaneWidth - 2 * __offset__,
                    g_h = h - top - bottom - axisXLaneHeight - axisXLabelLaneHeight - 2 * __offset__;
                if (![g_w, g_h].every(el => el > 0)) return;
                const groupHeight = g_h / groups.length,
                    [paddingInner, paddingOuter] = selectPaddingInnerOuterY(groupHeight),
                    self = this;
                const svg = d3.select(this.$el)
                    .append('svg')
                    .attr('width', w)
                    .attr('height', h);
                svg.append('defs')
                    .append('clipPath')
                    .attr('id', 'clip-timeline')
                    .append('rect')
                    .attr('x', 0)
                    .attr('y', 0)
                    .attr('width', g_w)
                    .attr('height', g_h + axisXLaneHeight);
                const g = svg
                    .append('g')
                    .attr('transform', `translate(${left + __offset__ + groupLaneWidth}, ${top + __offset__})`)
                    .attr('width', g_w)
                    .attr('height', g_h);
                svg
                    .call(cursor, g, [
                        [0, 0],
                        [g_w, g_h + axisXLaneHeight]
                    ])
                    .call(zoom, zooming);
                svg.append('path')
                    .attr('d', roundedRect(left + __offset__ / 2, top + __offset__ / 2, g_w + groupLaneWidth + __offset__, g_h + axisXLaneHeight + __offset__, borderRadius, true, true, true, true))
                    .attr('fill', backgroundColor)
                    .attr('stroke', borderColor)
                    .attr('stroke-width', borderWidth)
                    .attr('pointer-events', 'none');
                g.append('line')
                    .attr('class', 'line--y')
                    .attr('y2', g_h)
                    .attr('stroke', boundingLineColor)
                    .attr('stroke-width', boundingLineWidth);
                svg.selectAll('.line--x')
                    .data(groups)
                    .enter()
                    .append('g')
                    .attr('transform', `translate(${left + __offset__}, ${top + __offset__})`)
                    .append('line')
                    .attr('class', 'line--x')
                    .attr('stroke', boundingLineColor)
                    .attr('stroke-width', boundingLineWidth)
                    .attr('y1', (d, i) => (i + 1) * groupHeight)
                    .attr('y2', (d, i) => (i + 1) * groupHeight)
                    .attr('x2', g_w + groupLaneWidth);
                const xScale = d3.scaleTime()
                    .domain([dateTimeStart, dateTimeEnd])
                    .range([0, g_w]);
                const yScale = (i) => d3.scaleBand()
                    .range([groupHeight * (i + 1), groupHeight * i])
                    .paddingInner(paddingInner)
                    .paddingOuter(paddingOuter);
                const xAxis = d3
                    .axisBottom(xScale)
                    .tickSize(tickSize)
                    .tickPadding(tickPadding);
                const axisXLane = svg
                    .append('g')
                    .attr('transform', `translate(${left + groupLaneWidth + __offset__}, ${top + g_h + __offset__})`)
                    .attr('width', g_w)
                    .attr('height', axisXLaneHeight);
                axisXLane
                    .call(xAxis)
                    .attr('class', 'axis axis--x')
                    .attr('font-size', axisFontSize)
                    .attr('font-weight', axisFontWeight)
                    .attr('fill-opacity', axisFontOpacity)
                    .selectAll('line')
                    .attr('stroke', boundingLineColor)
                    .attr('stroke-width', boundingLineWidth);
                const axisXLabelLane = svg
                    .append('g')
                    .attr('transform', `translate(${left + __offset__},${top + g_h + axisXLaneHeight + 2 * __offset__})`)
                    .attr('width', g_w + groupLaneWidth)
                    .attr('height', axisXLabelLaneHeight);
                axisXLabelLane
                    .append('text')
                    .attr('x', (g_w + groupLaneWidth) / 2)
                    .attr('y', axisXLabelLaneHeight / 2)
                    .attr('fill', '#000')
                    .attr('dy', '0.32em')
                    .attr('text-anchor', 'middle')
                    .text(axisXLabel)
                    .attr('font-size', axisLabelFontSize)
                    .attr('font-weight', axisLabelFontWeight)
                    .attr('fill-opacity', axisLabelFontOpacity);
                svg
                    .selectAll('.group--lane')
                    .data(groups)
                    .enter()
                    .append('g')
                    .attr('class', 'group--lane')
                    .attr('transform', (d, i) => `translate(${left + __offset__}, ${top + __offset__ + i * groupHeight})`)
                    .attr('width', groupLaneWidth)
                    .attr('height', groupHeight)
                    .attr('fill', 'none')
                    .append('text')
                    .attr('x', groupLaneWidth / 2)
                    .attr('y', groupHeight / 2)
                    .attr('dy', '0.32em')
                    .attr('text-anchor', 'middle')
                    .attr('font-size', groupLabelFontSize)
                    .attr('font-weight', groupLabelFontWeight)
                    .attr('fill-opacity', groupLabelFontOpacity)
                    .text(d => d)
                    .attr('fill', '#000');
                function zooming() {
                    hideTip();
                    const newScale = d3.event
                        .transform.rescaleX(xScale);
                    axisXLane
                        .call(xAxis.scale(newScale))
                        .selectAll('line')
                        .attr('stroke', boundingLineColor)
                        .attr('stroke-width', boundingLineWidth);
                    drawReference(newScale);
                    drawTickLines(newScale);
                    drawEntries(newScale);
                }
                function drawReference(xScale) {
                    const referenceSelection = g.select('.line--reference');
                    if (!referenceSelection.empty()) referenceSelection.remove();
                    const date = new Date();
                    g
                        .append('line')
                        .attr('class', 'line--reference')
                        .attr('x1', xScale(date))
                        .attr('x2', xScale(date))
                        .attr('y1', 0)
                        .attr('y2', g_h)
                        .attr('stroke', currentTimeLineColor)
                        .attr('stroke-width', currentTimeLineWidth)
                        .attr('clip-path', 'url(#clip-timeline)')
                        .attr('pointer-events', 'none');
                }
                function drawTickLines(xScale) {
                    const ticksSelection = g.selectAll('.line--tick');
                    if (!ticksSelection.empty()) ticksSelection.remove();
                    const ticks = xScale.ticks();
                    g.selectAll('.line--tick')
                        .data(ticks)
                        .enter()
                        .append('line')
                        .attr('class', 'line--tick')
                        .attr('clip-path', 'url(#clip-timeline)')
                        .attr('x1', d => xScale(d))
                        .attr('x2', d => xScale(d))
                        .attr('y1', 0)
                        .attr('y2', g_h)
                        .attr('stroke', boundingLineColor)
                        .attr('stroke-width', boundingLineWidth)
                        .attr('pointer-events', 'none');
                }
                function drawEntries(xScale) {
                    const entriesSelection = g.selectAll('.entry');
                    if (!entriesSelection.empty()) entriesSelection.remove();
                    for (let i = 0, l = groups.length; i < l; i += 1) {
                        const groupData = data[groups[i]];
                        const scaleAxisY = yScale(i).domain(Object.keys(groupData));
                        for (let j = 0; j < groupData.length; j += 1) {
                            const Y = scaleAxisY(j.toString()),
                                H = scaleAxisY.bandwidth(),
                                entries = groupData[j];
                            for (let k = 0; k < entries.length; k += 1) {
                                const entry = entries[k];
                                if (entry instanceof Point) {
                                    const G = g
                                        .append('g')
                                        .attr('class', 'entry')
                                        .attr('clip-path', 'url(#clip-timeline)');
                                    const symbolGen = d3.symbol().size(symbolSize);
                                    const symbol = G.append('path')
                                        .attr('transform', `translate(${xScale(entry.at)}, ${Y + H / 2})`)
                                        .attr('class', `${entry.className ? entry.className : 'entry--point--default'}`)
                                        .attr('d', symbolGen.type(d3[entry.symbol] || d3['symbolCircle'])());
                                    symbol
                                        .on('mouseover', showTip(entry.title))
                                        .on('mouseout', hideTip);
                                }
                                else if (entry instanceof Interval) {
                                    const X = xScale(entry.from),
                                        W = xScale(entry.to) - X;
                                    const G = g
                                        .append('g')
                                        .attr('class', 'entry');
                                    const interval = G.append('path')
                                        .attr('class', `${entry.className ? entry.className : 'entry--interval--default'}`)
                                        .attr('d', roundedRect(X, Y, W, H, intervalCornerRadius, true, true, true, true))
                                        .attr('clip-path', 'url(#clip-timeline)');
                                    if (entry.title) {
                                        interval
                                            .on('mouseover', showTip(entry.title))
                                            .on('mouseout', hideTip);
                                    }
                                    const text = G.append('text')
                                        .attr('class', 'entry--label')
                                        .attr('text-anchor', 'middle')
                                        .attr('pointer-events', 'none')
                                        .attr('x', (X + W / 2))
                                        .attr('y', (Y + H / 2))
                                        .text(entry.label)
                                        .attr('fill', '#fff')
                                        .attr('dy', '0.32em')
                                        .attr('clip-path', 'url(#clip-timeline)');
                                    if (text.node().getComputedTextLength() > W) {
                                        text.remove();
                                    }
                                }
                            }
                        }
                    }
                }
                drawReference(xScale);
                drawTickLines(xScale);
                drawEntries(xScale);
            },
            safeDraw() {
                this.ifExistsSvgThenRemove();
                this.drawTimeline();
            },
            onResize() {
                this.safeDraw();
            }
        }
});
