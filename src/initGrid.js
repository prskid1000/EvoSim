const { getProperties } = require("./cellType")

module.exports = {
    initGrid: (grid, objectList, statistic) => {

        var neuronCount = 6
        var geneSequence = "54321"
        for (let i = 0; i < neuronCount; i++) geneSequence += "0"

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

        distributeAtom("oxygen", 20)
        distributeAtom("carbon", 20)
        distributeLive(50)

        statistic["liveCellCount"] = 50
        statistic["deathCount"] = 0
        statistic["replicationCount"] = 0
        statistic["oxygen"] = 20
        statistic["carbon"] = 20

    }
}