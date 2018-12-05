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


// INFO: Right recursive function, though, I don't understand what is going on with the local scopes variables
function sq(input) {

    var target = [] // INFO: local-global scope
    var children = []

    for (var i = 0, len = input.length; i < len; ++i) {
        var item = input[i]

        children = {
            value: item,
            name: item.getAttribute("__wid"),
            parent: item.parentElement.getAttribute("__wid"),
            children: (item.children ? sq(item.children) : "No Children")
        }

        target.push(children)
    }

    return target
}