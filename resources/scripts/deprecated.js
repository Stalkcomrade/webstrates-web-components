// time-machine-component.js
// getVersioningJson()

// parsing the last change made on the webstrate
                        // tmp[tmp.length - 1].op[tmp[tmp.length - 1].op.length - 1].
                        // last element            Object.keys(tmp[tmp.length - 1].op[tmp[tmp.length - 1].op.length - 1])[Object.keys(tmp[tmp.length - 1].op[tmp[tmp.length - 1].op.length - 1]).length - 1]

                        this.lastChange = this.versioningRaw[this.versioningRaw.length - 1].
                        op[this.versioningRaw[this.versioningRaw.length - 1].op.length - 1][Object.keys(this.versioningRaw[this.versioningRaw.length - 1].op[this.versioningRaw[this.versioningRaw.length - 1].op.length - 1])[Object.keys(this.versioningRaw[this.versioningRaw.length - 1].op[this.versioningRaw[this.versioningRaw.length - 1].op.length - 1]).length - 1]]

                        // this.lastChange = this.versioningRaw[this.versioningRaw.length - 1].op[this.versioningRaw[this.versioningRaw.length - 1].op.length - 1].sd
                        // this.lastChange = this.versioningRaw[this.versioningRaw.length - 1].op[this.versioningRaw[this.versioningRaw.length - 1].op.length - 1].sd
                        console.dir(this.lastChang)


// month-view-component.js
// this.waitData

// const date = index;
// var x = Object.keys(days[date.getDate()] || {})
//     .map(webstrateId => ({
//       date, webstrateId, activities: days[date.getDate()][webstrateId],
//     }))
//     .sort((a, b) => b.activities - a.activities)


// x.forEach(webstrateId => { webstrateId.radius = webstrateId.activities.radius; })
// var arrayRadius = x.map(webstrateId => webstrateId.radius) // ADDED THIS TO DATA

// var d3colorsQuantile = this.d3Scaling.colorQuantileScaling(arrayRadius)
// var d3colorsQuantize = this.d3Scaling.colorQuantizeScaling(arrayRadius)

// // ----------- Day-based Scaling
// x.forEach(webstrateId => { webstrateId.color = d3colorsQuantile(webstrateId.radius) })
// x.forEach(webstrateId => { webstrateId.colorQ = d3colorsQuantize(webstrateId.radius) })
// // ----------- Month-based Scaling
// x.forEach(webstrateId => { webstrateId.colorMonth = d3colorsQuantileMonth(webstrateId.radius) })
// x.forEach(webstrateId => { webstrateId.colorMonthQ = d3colorsQuantizeMonth(webstrateId.radius) })
