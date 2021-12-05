const { getNeighbourArray, moveCell } = require("./cellUtility")

var atomProcessor = (grid, objectList, statistic, key) => {
    var neighbourId = Math.floor(Math.random() * 7)
    var neighbour = getNeighbourArray(key)
    moveCell(grid, objectList, key, neighbour[neighbourId])
}

module.exports = {
    atomProcessor: atomProcessor
}