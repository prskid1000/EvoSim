const { getProperties } = require("./cellType")

module.exports = {
    initGrid: (grid, objectList, statistic, initList, geneSequence) => {

        var gridLength = Object.keys(grid).length

        var distributeAtom = (type, count) => {
            for (let i = 0; i < count;) {
                var currentKey = Math.floor(Math.random() * gridLength)
                if (grid[currentKey].type == "empty") {
                    objectList[currentKey] = getProperties(type)
                    grid[currentKey].color = objectList[currentKey].color
                    grid[currentKey].type = type
                    i++
                }
            }
        }

        var distributeLive = (count) => {
            for (let i = 0; i < count;) {
                var currentKey = Math.floor(Math.random() * gridLength)
                if (grid[currentKey].type == "empty") {
                    objectList[currentKey] = getProperties("live", geneSequence)
                    grid[currentKey].color = objectList[currentKey].color
                    grid[currentKey].type = "live"
                    i++
                }
            }

        }

        Object.keys(grid).map((key) => {
            grid[key].color = "black",
                grid[key].type = "empty"
        })

        Object.keys(initList).map((key) => {
            switch(key) {
                case "live": {
                    distributeLive(initList[key])
                    statistic[key] = initList[key]
                    statistic["death"] = 0
                    statistic["replication"] = 0
                    statistic["mutation"] = 0
                    statistic["deathList"] = []
                }break
                default: {
                    distributeAtom(key, initList[key])
                    statistic[key] = initList[key]
                }
            }
        })


    }
}