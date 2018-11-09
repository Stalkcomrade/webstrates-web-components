// window.js(window.intermSession[0])

// https://github.com/kpdecker/jsdiff

// array comparance, order is also considered
window.jsdiffTrue.diffArrays(window.js(window.intermSession[0]), window.js(window.intermSession[1]))

// json
window.jsdiffTrue.diffJson(JSON.parse(window.intermSession[2]), JSON.parse(window.intermSession[3]))


async function getHtmlsPerSession() {

    // this.wsId = "hungry-cat-75"
    let wsId = "massive-skunk-85"

    let numberInitial = 2
    let numberLast = 177

    // let webpageInitial = await fetch("https://webstrates.cs.au.dk/hungry-cat-75/" + "10/")
    // let webpageInitial = await fetch("https://webstrates.cs.au.dk/wicked-wombat-56/" + "3000/?raw")
    let webpageInitial = await fetch("https://webstrates.cs.au.dk/" + wsId + "/" + numberInitial + "/?raw")
    let htmlResultInitial = await webpageInitial.text()

    let webpageInitialJson = await fetch("https://webstrates.cs.au.dk/" + wsId + "/" + numberInitial + "/?json")
    let htmlResultInitialJson = await webpageInitialJson.text()

    // let webpageLast = await fetch("https://webstrates.cs.au.dk/hungry-cat-75/" + "4000/")
    let webpageLast = await fetch("https://webstrates.cs.au.dk/" + wsId + "/" + numberLast + "/?raw")
    let htmlResultLast = await webpageLast.text()

    let webpageLastJson = await fetch("https://webstrates.cs.au.dk/" + wsId + "/" + numberLast + "/?json")
    let htmlResultLastJson = await webpageLastJson.text()


    let results = await Promise.all([
        htmlResultInitial,
        htmlResultLast,
        htmlResultInitialJson,
        htmlResultLastJson
    ])
    console.dir(results)
    return results
}