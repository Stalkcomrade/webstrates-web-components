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


// TODO: look on the example

var items = [{
        "Id": "1",
        "Name": "abc",
        "Parent": "2"
    },
    {
        "Id": "2",
        "Name": "abc",
        "Parent": ""
    },
    {
        "Id": "3",
        "Name": "abc",
        "Parent": "5"
    },
    {
        "Id": "4",
        "Name": "abc",
        "Parent": "2"
    },
    {
        "Id": "5",
        "Name": "abc",
        "Parent": ""
    },
    {
        "Id": "6",
        "Name": "abc",
        "Parent": "2"
    },
    {
        "Id": "7",
        "Name": "abc",
        "Parent": "6"
    },
    {
        "Id": "8",
        "Name": "abc",
        "Parent": "6"
    }
]

// TODO: seems like this is the major one to change
function hashing(str) { // TODO: get rid of object in return

    var roots = [],
        children = {}

    for (var i = 0, len = str.length; i < len; ++i) {
        var item = str[i],
            parent = item.parentNode,
            target = !parent ? roots : (children[parent] || (children[parent] = [])) // INFO: roots is identical to target

        target.push({
            value: item,
            itemWID: item.getAttribute("__wid"),
            parent: item.parentElement.getAttribute("__wid")
        })

    }
    // return target

    return {
        target,
        roots,
        children
    }

}


// TODO: making it recursive
// INFO: roots are cleaned every cycle, so it should be accomplished somewhere else
// FIXME: the function misses middle - level - the initial input is array
// FIXME: need to try functions, rather than loops
// recursiveWalks(hashing(window.el.children)["target"])

recursiveWalks(hashing(window.el.children)["target"])

function recursiveWalks(roots) { // TODO: either add here a function for each element, either somehow tweak the for loops inside

    // var parent = roots[i]
    // var children = {}

    var childrenExist = 0

    var findChildren = function(parent) {
        if (parent.value.childElementCount != 0) {
            console.dir("Child!")
            // parent.children = parent.value.children // TODO: I need to assign here the product of the hashing()
            parent.children = hashing(parent.value.children)["target"] // FIXME: get rid of it

            // if (parent.children.value.ChildElementCount != 0) { // INFO: whether current child contains children
            //     childrenExist = childrenExist + 1
            // }

            for (var i = 0, len = parent.value.children; i < len; ++i) { // INFO: for every child on current level
                findChildren(parent.children[i])

            }
        }
    }


    // INFO: I am replacing this with a element-wise loop in the head of function
    for (var i = 0, len = roots.length; i < len; ++i) {
        findChildren(roots[i])
    }

    // if (childrenExist) { // TODO: check whether at least one element contains children with non NULl length
    //     recursiveWalks(roots) // FIXME: how to indicate the desired level?
    // }

    return roots // FIXME: put return in the right place

}


// complete function
function rc(str, cb) {

    var roots = [],
        children = {}

    for (var i = 0, len = str.length; i < len; ++i) {
        var item = str[i],
            parent = item.parentNode,
            target = !parent ? roots : (children[parent] || (children[parent] = [])) // INFO: roots is identical to target

        target.push({
            value: item,
            itemWID: item.getAttribute("__wid"),
            parent: item.parentElement.getAttribute("__wid")
        })

    }

    // cb(roots)
    cb(target)

    if (roots.nextElementSibling) { // TODO: check whether at least one element contains children with non NULl length
        rc(roots.children[0], cb) // FIXME: how to indicate the desired level?
    }

}

rc(window.el.children, roots => {

    var findChildren = function(parent) {
        if (parent.value.childElementCount != 0) {
            console.dir("Child!")
            parent.children = hashing(parent.value.children)["target"] // FIXME: get rid of it

            // if (parent.children.value.ChildElementCount != 0) { // INFO: whether current child contains children
            //     childrenExist = childrenExist + 1
            // }

            for (var i = 0, len = parent.value.children; i < len; ++i) { // INFO: for every child on current level
                findChildren(parent.children[i])
            }
        }
    }

    // INFO: I am replacing this with a element-wise loop in the head of function
    for (var i = 0, len = roots.length; i < len; ++i) {
        findChildren(roots[i])
    }

    return roots

})




// function rcw(roots, cb) {
//     cb(roots)
//     if (childrenExist != 0) { // TODO: check whether at least one element contains children with non NULl length
//         rcw(roots.children[0], cb) // FIXME: how to indicate the desired level?
//     }
//     if (roots.nextElementSibling) { // TODO: check whether at least one element contains children with non NULl length
//         rcw(roots.children[0], cb) // FIXME: how to indicate the desired level?
//     }
// }


rcw(hashing(window.el.children)["target"], parent => {

    var childrenExist = 0

    var findChildren = function(parent) {
        if (parent.value.childElementCount != 0) {
            console.dir("Child!")
            parent.children = hashing(parent.value.children)["target"] // FIXME: get rid of it

            if (parent.children.value.ChildElementCount != 0) { // INFO: whether current child contains children
                childrenExist = childrenExist + 1
            }

            for (var i = 0, len = parent.value.children; i < len; ++i) { // INFO: for every child on current level
                findChildren(parent.children[i])

            }
        }
    }

    // INFO: I am replacing this with a element-wise loop in the head of function
    for (var i = 0, len = roots.length; i < len; ++i) {
        findChildren(roots[i])
    }

    if (childrenExist) { // TODO: check whether at least one element contains children with non NULl length
        recursiveWalks(roots) // FIXME: how to indicate the desired level?
    }

    return roots // FIXME: put return in the right place

})


// var walk = function(node, cb) {
//     cb(node)
//     if (node.children.length) {
//         this.walk(node.children[0], cb)
//     }
//     if (node.nextElementSibling) {
//         this.walk(node.nextElementSibling, cb)
//     }
// }




//


function makeStructureExample(roots, children) {

    var findChildren = function(parent) {
        if (children[parent.value.Id]) {
            console.dir("!")
            parent.children = children[parent.value.Id];
            for (var i = 0, len = parent.children.length; i < len; ++i) {
                findChildren(parent.children[i]);
            }
        }
    };

    // enumerate through to handle the case where there are multiple roots
    for (var i = 0, len = roots.length; i < len; ++i) {
        findChildren(roots[i]);
    }

    return roots

}


makeStructureExample(hashing(items)["roots"], hashing(items)["children"])

function makeStructure(roots, children) {

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
    }

    return roots

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