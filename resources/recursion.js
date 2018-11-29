// scopes

var df = {}

var fs = function(df) {

    df.fs = 1

    var nested = function(df) {
        df.nested = 1
    }

    nested(df)
    return df
}


console.dir(fs(df))


// TODO: seems like this is the major one to change
// INFO: this should be exexucted only once
// INFO: this transforms current array of children to the right format (parent, children, value)
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
            parent: item.parentElement.getAttribute("__wid"),
            childrenNumber: item.childElementCount,
            children: item.childElementCount != 0 ? item.children : "No Children"
        })
    }

    // return target

    return {
        target,
        roots,
        children
    }

}


var walk = function(node, cb) {
    cb(node)
    if (node.children.length) {
        this.walk(node.children[0], cb)
    }
    if (node.nextElementSibling) {
        this.walk(node.nextElementSibling, cb)
    }
}

this.walk($el.children[0], node => {

    var levelNodes = this.getLevelNodes(node)
    this.d3Data.push(levelNodes)

})


// INFO: recursive version with desired nested structure
sx(window.el.children)


// function sx(input, cb) {
//   var roots = []
//   var children = {}
//   var target = []

//   cb(input, target)




// }

// TODO: adding parent here

function sx(input) {

    var target = [] // INFO: local-global scope
    var makeStructure = function(input) {

        // INFO: local-local scope
        var roots = []
        var children = {}

        for (var i = 0, len = input.length; i < len; ++i) {
            var item = input[i]

            // debugger;
            target[i] = ({
                value: item,
                itemWID: item.getAttribute("__wid"),
                parent: item.parentElement.getAttribute("__wid"),
                children: (item.children ? makeStructure(item.children) : "No Children")
            })

            // target.push(roots)
            // makeStructure(roots.children) // INFO: inside a forEach fun call I call it once again
        }
        // target.push(roots)
        // return roots
    }

    // target = !parent ? roots : (children[parent] || (children[parent] = [])) // INFO: roots is identical to target
    // target.push(makeStructure(input))
    makeStructure(input)
    return target
    // return roots
}

// INFO: Right recursive function, though, I don't understand what is going on with the local scopes variables
function sq(input) {

    var target = [] // INFO: local-global scope
    var children = []

    for (var i = 0, len = input.length; i < len; ++i) {
        var item = input[i]

        children = {
            value: item,
            itemWID: item.getAttribute("__wid"),
            parent: item.parentElement.getAttribute("__wid"),
            children: (item.children ? sq(item.children) : "No Children")
        }

        target.push(children)
    }

    return target
}



// INFO: working version, which pushes all the elements into one array
sw(window.el.children)

function sw(input) {

    var roots = []
    var children = {}
    var target = []

    var makeStructure = function(input) { // SOLVED: check the scope

        for (var i = 0, len = input.length; i < len; ++i) {
            var item = input[i]

            target.push({
                value: item,
                itemWID: item.getAttribute("__wid"),
                parent: item.parentElement.getAttribute("__wid"),
                children: item.children
            })

            makeStructure(item.children) // INFO: inside a forEach fun call I call it once again

        }
    }

    makeStructure(input)

    return target
}






// TODO: should use hashing in the findChildren if parent.value does not exist
sf(window.el.children)["target"]

function sf(input) {

    var makeStructure = function(inputInside) { // TODO: check the scope

        // INFO: this function is element-wise
        // FIXME: should chekc whether object is array or not

        var roots = [],
            children = {}


        // FIXME: I need to create an object instead trying to mutate current one

        parent.value = inputInside
        // console.dir(inputInside.childElementCount)
        // inputInside.getAttribute("__wid")
        parent.itemWID = inputInside.getAttribute("__wid")
        parent.parent = inputInside.parentElement.getAttribute("__wid")

    }

    var roots = [],
        children = {}

    for (var i = 0, len = input.length; i < len; ++i) {
        var item = input[i],
            parent = item.parentNode,
            target = !parent ? roots : (children[parent] || (children[parent] = [])) // INFO: roots is identical to target

        target.push({
            value: item,
            itemWID: item.getAttribute("__wid"),
            parent: item.parentElement.getAttribute("__wid")
        })

    }

    // INFO: next step is to parse children of childrens
    // INFO: input into findChildren is window.el.children
    // INFO: it is used later in the loop, so, every child of window.el.children is indexed

    var findChildren = function(parent) { // INFO: this is useed to find children for each  node on current level
        if (parent.value) {
            if (parent.value.childElementCount) {
                console.dir("Child!")
                // parent.children = hashing(parent.children)["target"]
                parent.children = parent.value.children

                for (var i = 0, len = parent.children.length; i < len; ++i) { // INFO: for every child on current level
                    findChildren(parent.children[i]) // INFO: it should be rerucsive
                    console.dir("Inside Nested Loop")
                }
            }
        } else {

            makeStructure(parent)
            console.dir(parent.getAttribute)

            if (parent.value.childElementCount) {
                console.dir("Child!")
                parent.children = parent.value.children
                for (var i = 0, len = parent.children.length; i < len; ++i) {
                    findChildren(parent.children[i])
                    console.dir("Inside Nested Loop")
                }
            }

        }
    }

    // INFO: I am replacing this with a element-wise loop in the head of function

    target.forEach(child => {
        findChildren(child)
        console.dir("Inside Target For Each")
    })

    return {
        target,
        roots
    }

}



// TODO: making it recursive
// INFO: roots are cleaned every cycle, so it should be accomplished somewhere else
// FIXME: the function misses middle - level - the initial input is array
// FIXME: need to try functions, rather than loops
// recursiveWalks(hashing(window.el.children)["target"])

recursiveWalks(hashing(window.el.children)["target"])

function recursiveWalks(roots) { // TODO: either add here a function for each element, either somehow tweak the for loops inside

    var parent = roots[i]
    var children = {}

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