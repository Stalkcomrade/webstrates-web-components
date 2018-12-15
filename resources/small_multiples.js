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