const { getProperties } = require("./cellType")

module.exports = {
    selectNextGen: (grid, objectList, statistic) => {

        var initList = {
            "oxygen": 20,
            "carbon": 20,
            "live": 100
        }

        var selectRadius = {
            left: 0,
            right: 0,
            top: 10,
            bottom: 0
        }

        var gridLength = Object.keys(grid).length
        var computeNumber = parseInt(process.env.REACT_APP_COMPUTE_NUMBER)
        var newObjectList = {}
        var selected = []

        for (let i = 0; i < computeNumber * computeNumber; i++){

            var horizontalPoint = i % computeNumber
            var verticalPoint = Math.floor(i / computeNumber) * computeNumber

            if (horizontalPoint <= selectRadius.left - 1 || horizontalPoint >= (computeNumber - selectRadius.right) || verticalPoint <= (selectRadius.top - 1) * computeNumber || verticalPoint >= (computeNumber - selectRadius.bottom) * computeNumber) {
                //console.log(i)
                if (objectList[i] != undefined && objectList[i].type == "live") {
                    selected.push(i)
                }
            }

        }

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

        var selectLive = (count) => {
            if (selected.length == 0) return
            for (let i = 0, idx = 0; i < count;) {
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