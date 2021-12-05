const { getProperties } = require("./cellType")

module.exports = {
    selectNextGen: (grid, objectList, statistic) => {

        var initList = {
            "oxygen": 20,
            "carbon": 20,
            "live": 100
        }

        var gridLength = Object.keys(grid).length
        var newObjectList = {}

        var distributeAtom = (type, count) => {
            for (let i = 0; i < count;) {
                var currentKey = Math.floor(Math.random() * gridLength)
                if (grid[currentKey].type == "empty") {
                    newObjectList[currentKey] = getProperties(type)
                    grid[currentKey].color = newObjectList[currentKey].color
                    grid[currentKey].type = type
                    i++
                }
            }
        }

        var checkFitness = (key) => {
            return parseInt(key) % 2 == 0 ? true : false
        }

        var selectLive = (count) => {
            var selected = []
            var idx = 0

            Object.keys(objectList).map((key) => {
                if (objectList[key].type == "live") {
                    if (checkFitness(key) == true) {
                        if (selected == undefined) selected = [key]
                        else selected.push(key)
                    }
                }
            })

            for (let i = 0; i < count;) {
                var currentKey = Math.floor(Math.random() * gridLength)
                if (grid[currentKey].type == "empty") {
                    newObjectList[currentKey] = JSON.parse(JSON.stringify(objectList[selected[(idx++) % selected.length]]))
                    grid[currentKey].color = newObjectList[currentKey].color
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
            switch (key) {
                case "live": {
                    selectLive(initList[key])
                    statistic["liveCellCount"] = initList[key]
                    statistic["deathCount"] = 0
                    statistic["replicationCount"] = 0
                } break
                default: {
                    distributeAtom(key, initList[key])
                    statistic[key] = initList[key]
                }
            }
            
        })


        return newObjectList
    }
}