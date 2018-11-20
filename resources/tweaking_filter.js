// This buffer is for JavaScript evaluation.
// Press C-x C-e to evaluate the last expression.
// Press C-c M-i to inspect the last expression.




window.symbols.forEach(function(elem) {



})


symbols.forEach(function(s) {
    var parseDate = d3.timeParse("%b %Y")
    s.maxPriceSelected = d3.max(s.values, function(d) {
        if (d.date > parseDate('Jan 2002') && d.date < parseDate('Jan 2003')) {
            return d.price
        }
    });
});


var parseDate = d3.timeParse("%b %Y")

window.symbols[1].values.filter(function(el) {
    return el.date > parseDate('Jan 2002') &&
        el.date < parseDate('Jan 2003')
})




window.symbols.filter(function(object) {
    object.forEach(el => el.values.filter(function(dts) {
        return dts.date < parseDate('Jan 2003')
    }))
})


window.symbols.forEach(function(object) {
    return object.values.filter(function(el) {
        return el.date > parseDate('Jan 2002') &&
            el.date < parseDate('Jan 2003')
    })
})

window.symbols[1].values.filter(function(el) {
    return (el.date > parseDate('Jan 2002') && el.date < parseDate('Jan 2003'))
})


window.symbols.forEach((objects) => {


})

window.symbols.filter((object) => {

    object.values.forEa

})


// it filteres objects

window.symbols.filter((object) => {
    return object.values.some(el => {
        return ((el.date > parseDate('Jan 2002')) && (el.date < parseDate('Jan 2003')))
    })
})


window.symbols.filter((object) => {
    return object.values.some(el => {
        return el.date > parseDate('Jan 2002') &&
            el.date < parseDate('Jan 2003')
    })
})


window.symbols.filter((object) => {
    return object.values.map(el => {
        return el.date > parseDate('Jan 2002') &&
            el.date < parseDate('Jan 2003')
    })
})


window.symbols.filter((object) => {
    return object.values.filter(el => {
        return el.date > parseDate('Jan 2002') &&
            el.date < parseDate('Jan 2003')
    })
})


window.symbols.forEach((object) => {
    return object.values.filter(el => {
        return el.date > parseDate('Jan 2002') &&
            el.date < parseDate('Jan 2003')
    })
})


window.symbols.map(object => {
    return _.filter(object.values, function(el) {
        return el.date > parseDate('Jan 2002') &&
            el.date < parseDate('Jan 2003')
    })
})


_.filter(window.symbols[0].values, function(el) {
            return el.date > parseDate('Jan 2002') &&
                el.date < parseDate('Jan 2003')
        }



        // window.symbols.map((object) => {
        //     object.values.some((el) => {
        //         return (el.date > parseDate('Jan 2002') && el.date < parseDate('Jan 2003'))
        //     })
        // })


        window.symbols.map(object => {
            return object.values.filter(el => {
                return ((el.date > parseDate('Jan 2002')) && (el.date < parseDate('Jan 2003')))
            })
        })




        // window.symbols.forEach((object) => {
        //     return object.values.some((el) => {
        //         return (el.date > parseDate('Jan 2002') && el.date < parseDate('Jan 2003'))
        //     })
        // })


        // window.symbols.some((object) => {
        //     return object.values.some((el) => {
        //         return (el.date > parseDate('Jan 2002') && el.date < parseDate('Jan 2003'))
        //     })
        // })


        window.symbols.filter(object => {
            return object.values.filter(el => {
                return ((el.date > parseDate('Jan 2002')) && (el.date < parseDate('Jan 2003')))
            })
        })