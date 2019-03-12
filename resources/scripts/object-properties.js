// This buffer is for JavaScript evaluation.
// Press C-x C-e to evaluate the last expression.
// Press C-c M-i to inspect the last expression.


function sq(input) {

    // window.input = input

    var target = [] // INFO: local-global scope
    var children = []

    for (var i = 0, len = input.length; i < len; ++i) {
        var item = input[i]

        children = {
            value: item,
            unapproved: item.getAttribute("unapproved") === null ?
                null : item.getAttribute("unapproved"),
            class: typeof item.getAttribute("class") === undefined ?
                null : item.getAttribute("class"),
            nameAttr: typeof item.getAttribute("name") === undefined ?
                null : item.getAttribute("name"),
            name: item.getAttribute("__wid"),
            parent: item.parentElement.getAttribute("__wid"),
            children: (item.children ? this.sq(item.children) : "No Children"),
            innerText: item.innerText,
        }
        target.push(children)
    }

    return target
}





function sq(input) {

    var target = [] // INFO: local-global scope
    // var children = []
    // var children = {}

    for (var i = 0, len = input.length; i < len; ++i) {
        var item = input[i]

        var children = {}

        for (var att, k = 0, atts = item.attributes, n = atts.length; k < n; k++) {

            var nodes = [],
                values = [],
                contObj = {};

            att = atts[k];

            if (typeof att !== undefined) {

                // TODO: consider children
                // TODO: consider search for reflected nodes
                if (att.nodeName !== "children") {

                    // TODO: delete 
                    nodes.push(att.nodeName);
                    values.push(att.nodeValue);

                    contObj[att.nodeName] = att.nodeValue

                }
            }
        }


        Object.assign(children, contObj)

        children.value = item
        children.parent = item.parentElement.getAttribute("__wid")
        children.innerText = item.innerText
        children.children = item.children ?
            sq(item.children) :
            "No Children"

        target.push(children)
    }

    return target
}


// two solutions:

// 1. keep structure
// TODO: find lowest-depth nodes (?)
// TODO: ancestros of them and assign attributes to them

// 2. make new structure
// TODO: find selected in list
// if no children && no desired value : delete current
// access upper scope


function checkNested(obj /*, level1, level2, ... levelN*/ ) {
    var args = Array.prototype.slice.call(arguments, 1);
    for (var i = 0; i < args.length; i++) {
        if (!obj || !obj.hasOwnProperty(args[i])) {
            return false;
        }
        obj = obj[args[i]];
    }
    return true;
}


// this supposed to delete most of stuff, including children of desired nodes and parents

// function findSelectedInList(selected, list, propertyName, valueFilter) {

//     Object.values(list).some((currentItem) => {

//         if (checkNested(currentItem, 'data', propertyName)) {
//             currentItem.data[propertyName] !== valueFilter && !currentItem._children ? // if not value and no children - delete
//                 flag = true && delete currentItem :
//                 (typeof currentItem._children != "undefined" && findSelectedInList(selected, currentItem._children, propertyName, valueFilter))
//         }
//     })
//     return selected
// }

var flag = false
var selected = []
findSelectedInList(selected, td, "data-id", "x48M3u9y")


// https://github.com/d3/d3-hierarchy

function sq(input) {

    var target = [] // INFO: local-global scope
    // var children = []
    // var children = {}

    for (var i = 0, len = input.length; i < len; ++i) {
        var item = input[i]

        var children = {}

        for (var att, k = 0, atts = item.attributes, n = atts.length; k < n; k++) {

            var nodes = [],
                values = [],
                contObj = {};

            att = atts[k];

            if (typeof att !== undefined) {

                // TODO: consider children
                // TODO: consider search for reflected nodes
                if (att.nodeName !== "children") {

                    // TODO: delete 
                    nodes.push(att.nodeName);
                    values.push(att.nodeValue);

                    contObj[att.nodeName] = att.nodeValue

                }
            }
        }


        Object.assign(children, contObj)

        children.value = item
        children.parent = item.parentElement.getAttribute("__wid")
        children.innerText = item.innerText
        children.children = item.children ?
            sq(item.children) :
            "No Children"

        target.push(children)
    }

    return target
}

// var flag = false



function sqEnhanced(input, attributeName, attributeValue) {

    var target = [], // INFO: local-global scope
        flag = false

    for (var i = 0, len = input.length; i < len; ++i) {

        flag = false
        var item = input[i]
        // console.log(item)
        var children = {}

        for (var att, k = 0, atts = item.attributes, n = atts.length; k < n; k++) {

            att = atts[k];

            if (att.nodeName === attributeName && att.nodeValue === attributeValue) {

                flag = true

                var contObj = {};
                // nodes = [],
                // values = [],

                if (typeof att !== undefined) {

                    if (att.nodeName !== "children") {

                        // nodes.push(att.nodeName);
                        // values.push(att.nodeValue);

                        contObj[att.nodeName] = att.nodeValue

                    }
                }
            }
        }

        if (flag === true) {

            Object.assign(children, contObj)

            children.value = item
            children.parent = item.parentElement.getAttribute("__wid")
            children.innerText = item.innerText
        }

        children.children = item.children ?
            sq(item.children) : // INFO: I am using sq here
            "No Children"

        if (flag === true) {
            target.push(children)
        }

    }

    return target
}


sqEnhanced(window.el.children, "__wid", "NMS8A3rD")


window.el.children[0].attributes.forEach(el => {})

function sq(input) {

    var target = [] // INFO: local-global scope
    // var children = []
    // var children = {}

    for (var i = 0, len = input.length; i < len; ++i) {
        var item = input[i]

        var children = {}

        for (var att, k = 0, atts = item.attributes, n = atts.length; k < n; k++) {

            var nodes = [],
                values = [],
                contObj = {};

            att = atts[k];

            if (typeof att !== undefined) {

                // TODO: consider children
                // TODO: consider search for reflected nodes
                if (att.nodeName !== "children") {

                    // TODO: delete 
                    nodes.push(att.nodeName);
                    values.push(att.nodeValue);

                    contObj[att.nodeName] = att.nodeValue

                }
            }
        }


        Object.assign(children, contObj)

        children.value = item
        children.parent = item.parentElement.getAttribute("__wid")
        children.innerText = item.innerText
        children.children = item.children ?
            sq(item.children) :
            "No Children"

        target.push(children)
    }

    return target
}


var sqEnhanced = function(input, attributeName, attributeValue, includeNot) {

    var target = [], // INFO: local-global scope
        flag = false,
        flagCS = false

    for (var i = 0, len = input.length; i < len; ++i) {

        flag = false
        var item = input[i]
        var children = {}

        // debugger;

        for (var att, k = 0, atts = item.attributes, n = atts.length; k < n; k++) {

            att = atts[k];

            if (att.nodeName === attributeName && att.nodeValue === attributeValue) {
                console.log(item)
            }

            // INFO: Used for Codestrates Filtering
            if (includeNot === true && att.nodeName === attributeName && att.nodeValue !== attributeValue) {

                console.log("!!!")
                flagCS = true
                flag = true

                flag = true

                var contObj = {};

                if (typeof att !== undefined) {

                    if (att.nodeName !== "children") {

                        contObj[att.nodeName] = att.nodeValue

                    }
                }

            } else if (att.nodeName === attributeName && att.nodeValue === attributeValue) { // INFO: used for just filtering

                flag = true

                var contObj = {};

                if (typeof att !== undefined) {

                    if (att.nodeName !== "children") {

                        contObj[att.nodeName] = att.nodeValue

                    }
                }
            }
        }

        if (flag === true || flagCS === true) {

            Object.assign(children, contObj)

            children.value = item
            children.parent = item.parentElement.getAttribute("__wid")
            children.innerText = item.innerText
        }

        children.children = item.children ?
            sq(item.children) :
            "No Children"

        if (flag === true || flagCS === true) {
            target.push(children)
        }

    }

    console.log("filter target", target)
    return target
}




// var el = document.getElementById("someId");
for (var i = 0, atts = item.attributes, n = atts.length, arr = []; i < n; i++) {
    arr.push(atts[i].nodeName);
}



var dv = {
    new: 1,
    tr: 2,
    children: {
        w: 1,
        children: {
            w: 2,
            children: {
                d: 3
            }
        }
    }
}

sq(dv)

console.log(sq(dv))


for (var i = 0, len = input.length; i < len; ++i) {

    flag = false
    var item = input[i]
    var children = {}

    console.log(item)

    for (var att, k = 0, atts = item.attributes, n = atts.length; k < n; k++) {

        att = atts[k];

        if (att.nodeName === attributeName && att.nodeValue === attributeValue) {
            console.log(item)
        }

        // INFO: Used for Codestrates Filtering
        if (includeNot === true && att.nodeName === attributeName && att.nodeValue !== attributeValue) {

            console.log("!!!")
            flagCS = true
            flag = true



        } else if (att.nodeName === attributeName && att.nodeValue === attributeValue) {

            flag = true

            var contObj = {};
            // nodes = [],
            // values = [],

            if (typeof att !== undefined) {

                if (att.nodeName !== "children") {

                    // nodes.push(att.nodeName);
                    // values.push(att.nodeValue);

                    contObj[att.nodeName] = att.nodeValue

                }
            }
        }
    }

    if (flag === true || flagCS === true) {

        Object.assign(children, contObj)

        children.value = item
        children.parent = item.parentElement.getAttribute("__wid")
        children.innerText = item.innerText
    }

    children.children = item.children ?
        sq(item.children) :
        "No Children"

    if (flag === true || flagCS === true) {
        target.push(children)
    }

}

console.log("filter target", target)