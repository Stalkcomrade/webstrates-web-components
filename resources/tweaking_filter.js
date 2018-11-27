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


////


{
    "name": "Eve",
    "children": [{
            "name": "Cain"
        },
        {
            "name": "Seth",
            "children": [{
                    "name": "Enos"
                },
                {
                    "name": "Noam"
                }
            ]
        },
        {
            "name": "Abel"
        },
        {
            "name": "Awan",
            "children": [{
                "name": "Enoch"
            }]
        },
        {
            "name": "Azura"
        }
    ]
}

// TODO: one way is to create new object recusrsively

var walk = function(node, cb) {
    cb(node)
    if (node.children.length) {
        this.walk(node.children[0], cb)
    }
    if (node.nextElementSibling) {
        this.walk(node.nextElementSibling, cb)
    }
}

Object.asign()

var fj = {}
walk(window.d3Data[0][0], node => {
    var wid = node.attributes[0].value
    fj.wid = wid
    fj.children = []
})

var ttt = window.d3Data[0]

var name = Object.values(window.d3Data[0][0])
var wid = window.d3Data[0][0].attributes[0].value
var childNodes = window.d3Data[0][0].childNodes

ttt.map() // recursive map?
ttt.childNodes

// SOLVED: differently, might use map for this - since it's html collection, first approach is better
// SOLVED: cannot get key from html - use .attributes 

window.el.attributes
window.el.children

var fj = {}

walk(window.el, node => {
    var wid = node.attributes[0].value // TODO: filter and find __wid
    fj.wid = wid
    fj.children = []
})


var raw = window.el
var allowed = ["attributes", "children"]

var ddd = Object.keys(raw)
    .filter(key => allowed.includes(key))
    .reduce((obj, key) => {
        return {
            ...obj,
            [key]: raw[key]
        }
    }, {})


function hashing(str) {

    var roots = [],
        children = {}

    for (var i = 0, len = str.length; i < len; ++i) {
        var item = str[i],
            parent = item.parentNode,
            target = !parent ? roots : (children[parent] || (children[parent] = []))

        target.push({
            value: item
        })

        return target

    }
}


function buildHierarchy(array) {

    var roots = [],
        children = {}

    // find the top level nodes and hash the children based on paretn
    // hashing
    for (var i = 0, len = array.length; i < len; ++i) {
        var item = array[i],
            p = item.parentNode, // FIXME: check whether this is hellping, pushing full parent
            // p = item.parentNode.getAttribute("__wid"), // SOLVED: wid might in a different place, though
            target = !p ? roots : (children[p] || (children[p] = []))

        target.push({
            value: item
            // value: item.getAttribute("__wid")
        })
    }

    return target

    // function to recursively build the tree
    var findChildren = function(parent) {
        // if (children[parent.value.Id]) {
        if (children[parent.getAttribute("__wid")]) { // FIXME: change Id to wID
            // parent.children = children[parent.value.Id];
            parent.children = children[parent.getAttribute("__wid")]; // FIXME: change Id to wId
            for (var i = 0, len = parent.children.length; i < len; ++i) {
                findChildren(parent.children[i])
            }
        }
    }

    // enumerate through to handle the case where there are multiple roots
    for (var i = 0, len = roots.length; i < len; ++i) {
        findChildren(roots[i])
        // console.dir(roots[i])
    }

    return roots

}


buildHierarchy(window.el.children)