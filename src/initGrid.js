const { getProperties } = require("./cellType")

module.exports = {
    initGrid: (grid, objectList, statistic, initList, geneSequence, graphStatistic) => {

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

        statistic["death"] = 0
        statistic["replication"] = 0
        statistic["mutation"] = 0
        statistic["metabolism"] = 0
        statistic["deathList"] = []
        statistic["oxygen"] = 0
        statistic["carbon"] = 0
        statistic["hydrogen"] = 0
        statistic["nitrogen"] = 0
        statistic["empty"] = 0

        graphStatistic["death"] = []
        graphStatistic["replication"] = []
        graphStatistic["mutation"] = []
        graphStatistic["metabolism"] = []
        graphStatistic["oxygen"] = []
        graphStatistic["carbon"] = []
        graphStatistic["hydrogen"] = []
        graphStatistic["nitrogen"] = []
        graphStatistic["empty"] = []

        Object.keys(initList).map((key) => {
            switch(key) {
                case "live": {
                    distributeLive(initList[key])
                    statistic[key] = initList[key]
                }break
                default: {
                    distributeAtom(key, initList[key])
                    statistic[key] = initList[key]
                }
            }
        })

        Object.keys(grid).map((key) => {
            if (grid[key].type == "empty") statistic["empty"]++
        })

    }
}