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
