module.exports = {
    processGrid: (message) => {

        var grid = message.grid
        var computeNumber = Math.sqrt(Object.keys(grid).length)
        var objectList = message.objectList
        var senseArea = 8
        var borderTopLeft = 0
        var borderBottomLeft = computeNumber * computeNumber - computeNumber

        var computeCircularRow = (key) => {
            if (key < borderTopLeft) {
                return computeNumber * computeNumber + key

            } else if (key > borderBottomLeft) {
                return key % (computeNumber * computeNumber)
            }
            return key
        }

        var computeCircularColumn = (key, rowStart, rowEnd) => {
            if (key < rowStart) {
                return rowEnd + 1 - (rowStart - key)
            } else if (key > rowEnd) {
                return rowStart - 1 + (key - rowEnd)
            }
            return key
        }

        var getNeighbour = (key) => {
            key = parseInt(key)
            var currentRowStart = (Math.floor(key / computeNumber)) * computeNumber
            var nextRowStart = computeCircularRow(currentRowStart + computeNumber)
            var prevRowStart = computeCircularRow(currentRowStart - computeNumber)
            var currentRowEnd = currentRowStart + computeNumber - 1
            var nextRowEnd = nextRowStart + computeNumber - 1
            var prevRowEnd = prevRowStart + computeNumber - 1
            var column = key % computeNumber
            var neighbour = [
                computeCircularColumn(currentRowStart + column - 1, currentRowStart, currentRowEnd),
                computeCircularColumn(currentRowStart + column + 1, currentRowStart, currentRowEnd),
                prevRowStart + column,
                nextRowStart + column,
                computeCircularColumn(prevRowStart + column - 1, prevRowStart, prevRowEnd),
                computeCircularColumn(prevRowStart + column + 1, prevRowStart, prevRowEnd),
                computeCircularColumn(nextRowStart + column - 1, nextRowStart, nextRowEnd),
                computeCircularColumn(nextRowStart + column + 1, nextRowStart, nextRowEnd)
            ]
            return neighbour
        }

        var processSenseArea = (key, process) => {
            key = parseInt(key)
            for (let currentRow = ((Math.floor(key / computeNumber)) * computeNumber) - senseArea * computeNumber, count1 = 2 * senseArea; count1 >= 0; count1--, currentRow += computeNumber) {
                var currentRowStart = computeCircularRow(currentRow)
                var currentRowEnd = computeCircularRow(currentRow) + computeNumber - 1
                var midpoint = currentRowStart + key % computeNumber
                for (let cell = midpoint - senseArea, count2 = 2 * senseArea; count2 >= 0; count2--, cell += 1) {
                    process(computeCircularColumn(cell, currentRowStart, currentRowEnd).toString())
                }
            }
        }

        /*Object.keys(grid).map((key) => {
            if (grid[key].color == "black") {
                grid[key].color = "green"
            } else {
                grid[key].color = "black"
            }
        })*/

        Object.keys(objectList).map((key) => {
            switch (grid[key].type) {
                case "atom":
                    var neighbourId = Math.floor(Math.random() * 7)
                    var neighbour = getNeighbour(key)
                    if(grid[neighbour[neighbourId]].color == "black") {
                        objectList[neighbour[neighbourId]] = objectList[key]
                        grid[neighbour[neighbourId]].color = objectList[key].color
                        grid[neighbour[neighbourId]].type = "atom"
                        grid[key].color = "black"
                        grid[key].type = "empty"
                        delete objectList[key]
                    }
                    break;

                case "live":

                    break;

                default:
                    break;
            }
        })

        return {
            "grid": grid,
            "objectList": objectList
        }
    }
}