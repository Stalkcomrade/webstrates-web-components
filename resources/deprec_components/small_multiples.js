days = window.days

days = {
    9: {
        wicked: 5
    },
    10: {
        wicked: 6,
        front: 4
    }
}

// use index in order to call to external elements
var arr = []
Object.keys(days).forEach(day => {
    Object.values(days[day]).map((webstrate, index) => {
        arr.push({
            symbol: Object.keys(days[day])[index],
            value: webstrate,
            day: Object.keys(days)[index]
        })
    })
})

var vf = d3.timeFormat("%d")

var vf = d3.timeFormat("%a %d")

vf("2")


(new Date(2018, 10, parseInt("10"))).toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
})


symbols.map(el => {
    return {
        ...el,
        values: _.orderBy(el.values, "date")
    }
})

symbols.forEach(el => {
    return _.orderBy(el.values, "date")
})



window.symbols.forEach(el => {
    return _.orderBy(el.values, "date")
})


window.symbols.forEach(el => {
    return el.values.sort((a, b) => {
        a.date - b.date
    })
})


// INFO: all paths per element
// d3.select(".main")
d3.select(".smallMultiples")
    .selectAll(".chosen")
    .selectAll("path")
    .data(window.symbols, keyFn)
    .enter()
    .append("path")
    .attr("class", "area")
    .attr("fill", "red")
// .selectAll("path")
// .data(window.symbols)
// .enter()
// .append("path")
// .attr("msd", function(d) {
//     d.maxPrice
// })


// INFO: append, bind after
// d3.select(".main")
// d3.select(".smallMultiples")
d3.selectAll(".chosen")
    // .data(window.symbols)
    // .enter()
    .append("path")
    .attr("class", "area")
    .attr("fill", "red")
    .selectAll("path")
    .data(window.symbols)
    .enter()
    .append("path")
    .attr("msd", function(d) {
        d.maxPrice
    })


d3.selectAll(".chosen")
    .data(window.symbols)
    .enter()
    .append("path")
    .attr("class", "area")
    .attr("fill", "red")
    .attr("msd", function(d) {
        d.maxPrice
    })
// .selectAll("path")
// .data(window.symbols)
// .enter()
// .append("path")


// INFO: testing binding
d3.select(".smallMultiples")
    .selectAll(".chosen")
    .selectAll("g")
    .data(window.symbols)
    .enter()
    .append("g")
    .attr("msd", function(d) {
        d.maxPrice
    })


var x = d3.scaleTime().range([0, this.width]),
    y = d3.scaleLinear().range([this.height, 0]),
    area = d3.area() // returns only part of values
    .x(function(d) {
        return x(d.date);
    })
    .y0("430")
    .y1(function(d) {
        return y(d.price)
    })

// window.symbols.forEach(el => {
//     y.domain([0, el.maxPrice]);
//     console.dir(area(el.values))
// })

window.symbols.map(el => {
    y.domain([0, el.maxPrice]);
    return {
        ...el,
        path: area(el.values)
    }
})