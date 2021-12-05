var computeNumber = 128
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

var getNeighbourKV = (key) => {
    key = parseInt(key)
    var currentRowStart = (Math.floor(key / computeNumber)) * computeNumber
    var nextRowStart = computeCircularRow(currentRowStart + computeNumber)
    var prevRowStart = computeCircularRow(currentRowStart - computeNumber)
    var currentRowEnd = currentRowStart + computeNumber - 1
    var nextRowEnd = nextRowStart + computeNumber - 1
    var prevRowEnd = prevRowStart + computeNumber - 1
    var column = key % computeNumber
    return {
        "left": computeCircularColumn(currentRowStart + column - 1, currentRowStart, currentRowEnd),
        "right": computeCircularColumn(currentRowStart + column + 1, currentRowStart, currentRowEnd),
        "top": prevRowStart + column,
        "bottom": nextRowStart + column,
        "topLeft": computeCircularColumn(prevRowStart + column - 1, prevRowStart, prevRowEnd),
        "topRight": computeCircularColumn(prevRowStart + column + 1, prevRowStart, prevRowEnd),
        "bottomLeft": computeCircularColumn(nextRowStart + column - 1, nextRowStart, nextRowEnd),
        "bottomRight": computeCircularColumn(nextRowStart + column + 1, nextRowStart, nextRowEnd)
    }
}

var getNeighbourArray = (key) => {
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

var getFilteredNeighbour = (grid, key) => {
    var neighbourList = getNeighbourArray(key)
    var neighbours = {}

    for (let i = 0; i < 8; i++) {
        if (neighbours[grid[neighbourList[i]].type] != undefined) {
            neighbours[grid[neighbourList[i]].type].push(neighbourList[i])
        } else {
            neighbours[grid[neighbourList[i]].type] = [neighbourList[i]]
        }
    }

    return neighbours
}

var getSenseArea = (key, senseArea) => {
    key = parseInt(key)
    var area = []
    for (let currentRow = ((Math.floor(key / computeNumber)) * computeNumber) - senseArea * computeNumber, count1 = 2 * senseArea; count1 >= 0; count1--, currentRow += computeNumber) {
        var currentRowStart = computeCircularRow(currentRow)
        var currentRowEnd = computeCircularRow(currentRow) + computeNumber - 1
        var midpoint = currentRowStart + key % computeNumber
        for (let cell = midpoint - senseArea, count2 = 2 * senseArea; count2 >= 0; count2--, cell += 1) {
            area.push(computeCircularColumn(cell, currentRowStart, currentRowEnd).toString())
        }
    }
    return area
}

var getTopArea = (grid, key, senseArea) => {
    key = parseInt(key)
    var neighbours = {}

    for (let currentRow = ((Math.floor(key / computeNumber)) * computeNumber) - senseArea * computeNumber, count1 = senseArea; count1 > 0; count1--, currentRow += computeNumber) {
        var currentRowStart = computeCircularRow(currentRow)
        var currentRowEnd = computeCircularRow(currentRow) + computeNumber - 1
        var midpoint = currentRowStart + key % computeNumber
        for (let cell = midpoint - senseArea, count2 = 2 * senseArea; count2 >= 0; count2--, cell += 1) {
            var computedKey = computeCircularColumn(cell, currentRowStart, currentRowEnd).toString()
            if (neighbours[grid[computedKey].type] != undefined) {
                neighbours[grid[computedKey].type].push(computedKey)
            } else {
                neighbours[grid[computedKey].type] = [computedKey]
            }
        }
    }

    return neighbours
}

var getBottomArea = (grid, key, senseArea) => {
    key = parseInt(key)
    var neighbours = {}

    for (let currentRow = ((Math.floor(key / computeNumber)) * computeNumber) + computeNumber, count1 = senseArea; count1 > 0; count1--, currentRow += computeNumber) {
        var currentRowStart = computeCircularRow(currentRow)
        var currentRowEnd = computeCircularRow(currentRow) + computeNumber - 1
        var midpoint = currentRowStart + key % computeNumber
        for (let cell = midpoint - senseArea, count2 = 2 * senseArea; count2 >= 0; count2--, cell += 1) {
            var computedKey = computeCircularColumn(cell, currentRowStart, currentRowEnd).toString()
            if (neighbours[grid[computedKey].type] != undefined) {
                neighbours[grid[computedKey].type].push(computedKey)
            } else {
                neighbours[grid[computedKey].type] = [computedKey]
            }
        }
    }

    return neighbours
}

var getLeftArea = (grid, key, senseArea) => {
    key = parseInt(key)
    var neighbours = {}

    for (let currentRow = ((Math.floor(key / computeNumber)) * computeNumber) - senseArea * computeNumber, count1 = 2 * senseArea; count1 >= 0; count1--, currentRow += computeNumber) {
        var currentRowStart = computeCircularRow(currentRow)
        var currentRowEnd = computeCircularRow(currentRow) + computeNumber - 1
        var midpoint = currentRowStart + key % computeNumber
        for (let cell = midpoint - senseArea, count2 = senseArea; count2 > 0; count2--, cell += 1) {
            var computedKey = computeCircularColumn(cell, currentRowStart, currentRowEnd).toString()
            if (neighbours[grid[computedKey].type] != undefined) {
                neighbours[grid[computedKey].type].push(computedKey)
            } else {
                neighbours[grid[computedKey].type] = [computedKey]
            }
        }
    }
    return neighbours
}

var getRightArea = (grid, key, senseArea) => {
    key = parseInt(key)
    var neighbours = {}

    for (let currentRow = ((Math.floor(key / computeNumber)) * computeNumber) - senseArea * computeNumber, count1 = 2 * senseArea; count1 >= 0; count1--, currentRow += computeNumber) {
        var currentRowStart = computeCircularRow(currentRow)
        var currentRowEnd = computeCircularRow(currentRow) + computeNumber - 1
        var midpoint = currentRowStart + key % computeNumber
        for (let cell = midpoint + 1, count2 = senseArea; count2 > 0; count2--, cell += 1) {
            var computedKey = computeCircularColumn(cell, currentRowStart, currentRowEnd).toString()
            if (neighbours[grid[computedKey].type] != undefined) {
                neighbours[grid[computedKey].type].push(computedKey)
            } else {
                neighbours[grid[computedKey].type] = [computedKey]
            }
        }
    }
    return neighbours
}

var moveCell = (grid, objectList, currentKey, futureKey) => {
    if (grid[futureKey].color == "black") {
        objectList[futureKey] = JSON.parse(JSON.stringify(objectList[currentKey]))
        grid[futureKey].color = objectList[currentKey].color
        grid[futureKey].type = objectList[currentKey].type
        grid[currentKey].color = "black"
        grid[currentKey].type = "empty"
        delete objectList[currentKey]
    }
}

module.exports = {
    moveCell: moveCell,
    getRightArea: getRightArea,
    getBottomArea: getBottomArea,
    getTopArea: getTopArea,
    getLeftArea: getLeftArea,
    getSenseArea: getSenseArea,
    getFilteredNeighbour: getFilteredNeighbour,
    getNeighbourArray: getNeighbourArray,
    getNeighbourKV: getNeighbourKV,
    computeCircularColumn: computeCircularColumn,
    computeCircularRow: computeCircularRow
}