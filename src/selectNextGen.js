module.exports = {
    selectNextGen: (message) => {

        var neuronCount = 6
        var geneSequence = "54321"
        for (let i = 0; i < neuronCount; i++) geneSequence += "0"

        var grid = message.grid
        var objectList = message.objectList
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
                if(grid[key].type == "live") {
                    console.log("hi")
                    if (checkFitness(key) == true) {
                        if (selected == undefined) selected = [key]
                        else selected.push(key)
                    }
                }
            })

            console.log(selected)
            
            for (let i = 0; i < count;) {
                var currentKey = Math.floor(Math.random() * gridLength)
                if(grid[currentKey].type == "empty") {
                    console.log(objectList[selected[(idx++) % selected.length]])
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

        distributeAtom("oxygen", 20)
        distributeAtom("carbon", 20)
        selectLive(50)

        var statistic = {
            "liveCellCount": 50,
            "deathCount": 0,
            "replicationCount": 0,
            "oxygen": 20,
            "carbon": 20
        }

        return {
            "grid": grid,
            "objectList": newObjectList,
            "statistic": statistic
        }
    }
}