// This buffer is for JavaScript evaluation.
// Press C-x C-e to evaluate the last expression.
// Press C-c M-i to inspect the last expression.


var parseDate = d3.timeParse("%b %Y")

window.symbols.map(object => ({
    key: object.key,
    maxPrice: object.maxPrice,
    maxPriceSelected: object.maxPriceSelected,
    values: _.filter(object.values, function(el) {
        return el.date > parseDate('Jan 2002') &&
            el.date < parseDate('Jan 2003')
    }),
})).filter(object => {
    return object.values.some((el) => { // filters objects without this date
        return el.date > parseDate('Jan 2002') &&
            el.date < parseDate('Jan 2003')
    })
})

var x = d3.scaleTime()
    .range([0, width]);

var y = d3.scaleLinear()
    .range([height, 0]);


d3.select(".smallMultiples")
    .append("path")
    .attr("class", "areaSelected")
    .attr("fill", "red")
    .attr("d", function(d) {
        y.domain([0, dSelected.maxPriceSelected]);
        return areaSelected(dSelected.values); // d.values
    });