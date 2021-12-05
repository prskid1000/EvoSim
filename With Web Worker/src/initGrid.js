module.exports = {
    initGrid: (message) => {

        var neuronCount = 6
        var geneSequence = "54321"
        for (let i = 0; i < neuronCount; i++) geneSequence += "0"

        var grid = message.grid
        var objectList = message.objectList
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

        var statistic = {
            "liveCellCount": 50,
            "deathCount": 0,
            "replicationCount": 0,
            "oxygen": 20,
            "carbon": 20
        }

        return {
            "grid": grid,
            "objectList": objectList,
            "statistic": statistic
        }
    }
}