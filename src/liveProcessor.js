const { getProperties } = require("./cellType")
const { computeCircularRow, getNeighbourArray, moveCell, getTopArea, getBottomArea, getLeftArea, getRightArea, getFilteredNeighbour } = require("./cellUtility")
const { genomeMutator, genomeDecoder } = require("./live")

var computeNumber = parseInt(process.env.REACT_APP_COMPUTE_NUMBER)
var borderTopLeft = 0
var borderBottomLeft = computeNumber * computeNumber - computeNumber
var currentLiveCell = {}

var processNeuron = (gene) => {
    var value = 0

    var computeLeftToRightGradient = (type) => {
        var left = currentLiveCell.leftArea[type] == undefined ? 0 : currentLiveCell.leftArea[type].length
        var right = currentLiveCell.rightArea[type] == undefined ? 0 : currentLiveCell.rightArea[type].length
        return (right - left) * (1.0 / (currentLiveCell.parameter.senseArea * currentLiveCell.parameter.senseArea / 2.0))
    }

    var computeTopToBottomGradient = (type) => {
        var top = currentLiveCell.topArea[type] == undefined ? 0 : currentLiveCell.topArea[type].length
        var bottom = currentLiveCell.bottomArea[type] == undefined ? 0 : currentLiveCell.bottomArea[type].length
        return (bottom - top) * (1.0 / (currentLiveCell.parameter.senseArea * currentLiveCell.parameter.senseArea / 2.0))
    }

    switch (gene.sensoryNeuron) {
        case "distanceFromTop": {
            value = (computeCircularRow(currentLiveCell.key) - borderTopLeft) * (1.0 / computeNumber)
        } break
        case "distanceFromBottom": {
           value = (borderBottomLeft - computeCircularRow(currentLiveCell.key)) * (1.0 / computeNumber)
        } break
        case "distanceFromLeft": {
            value = (parseInt(currentLiveCell.key) % computeNumber) * (1.0 / computeNumber)
        } break
        case "distanceFromRight": {
            value = (computeNumber - (parseInt(currentLiveCell.key) % computeNumber)) * (1.0 / computeNumber)
        } break
        default: {
            var idx = gene.sensoryNeuron.indexOf(".")
            var type = gene.sensoryNeuron.substring(0, idx)
            var senseType = gene.sensoryNeuron.substring(idx + 1)
            switch(senseType) {
                case "GradientLeftToRight": {
                    value = computeLeftToRightGradient(type)
                }break
                case "GradientTopToBottom": {
                    value = computeTopToBottomGradient(type)
                } break
                case "Neighbour": {
                    value = currentLiveCell.neighbours[type] == undefined ? 0 : currentLiveCell.neighbours[type].length
                }break 
            }
        }
    }
    
    currentLiveCell.actionPoints[gene.motorNeuron] += value * gene.synapseWeight
}

var processDeath = (statistic, grid, objectList, gene) => {
    var flag = false
    var factorCount = currentLiveCell.neighbours[gene.factor]
    if (factorCount == undefined) {
        objectList[currentLiveCell.key].deathSignal.push(0)
        return
    }
    else factorCount = factorCount.length

    if (gene.comparator == "equal") {
        if (factorCount == gene.threshold) flag = true
    } else if (gene.comparator == "lessThan") {
        if (factorCount < gene.threshold) flag = true
    } else if (gene.comparator == "greaterThan") {
        if (factorCount > gene.threshold) flag = true
    }

    if (flag == true) {
        delete objectList[currentLiveCell.key]
        grid[currentLiveCell.key].color = "black"
        grid[currentLiveCell.key].type = "empty"
        statistic.liveCellCount--
        statistic.deathCount++
    }
    objectList[currentLiveCell.key].deathSignal.push(factorCount)
    
}

var processReplication = (statistic, grid, objectList, gene) => {
    var flag = false
    var factorCount = currentLiveCell.neighbours[gene.factor]
    if (factorCount == undefined) {
        objectList[currentLiveCell.key].replicationSignal.push(0)
        return
    }
    else factorCount = factorCount.length

    if (gene.comparator == "equal") {
        if (factorCount == gene.threshold) flag = true
    } else if (gene.comparator == "lessThan") {
        if (factorCount < gene.threshold) flag = true
    } else if (gene.comparator == "greaterThan") {
        if (factorCount > gene.threshold) flag = true
    }

    if (flag == true) {
        var duplicate = currentLiveCell.neighbours[gene.factor][0]
        if (duplicate != undefined) {
            objectList[duplicate] = JSON.parse(JSON.stringify(objectList[currentLiveCell.key]))
            objectList[currentLiveCell.key].replicationCount++
            grid[duplicate].color = objectList[duplicate].color
            grid[duplicate].type = "live"
        
            if(gene.factor == "live") {
                statistic.replicationCount++
            } else {
                statistic.replicationCount++
                statistic.liveCellCount++
                statistic[gene.factor]--
            }
        }
    }
    objectList[currentLiveCell.key].replicationSignal.push(factorCount)

}

var processMutation = (objectList, gene) => {
    var flag = false
    var factorCount = currentLiveCell.neighbours[gene.factor]
    if (factorCount == undefined) {
        objectList[currentLiveCell.key].mutationSignal.push(0)
        return
    }
    else factorCount = factorCount.length

    if (gene.comparator == "equal") {
        if (factorCount == gene.threshold) flag = true
    } else if (gene.comparator == "lessThan") {
        if (factorCount < gene.threshold) flag = true
    } else if (gene.comparator == "greaterThan") {
        if (factorCount > gene.threshold) flag = true
    }

    if (flag == true) {
        objectList[currentLiveCell.key].genome = genomeMutator(objectList[currentLiveCell.key].genome)
        objectList[currentLiveCell.key].mutationCount++
    }
    objectList[currentLiveCell.key].mutationSignal.push(factorCount )
}

var processDigestion = (statistic, grid, objectList, gene) => {
    if (Math.tanh(currentLiveCell.actionPoints.digest) >= 1) {
        var consume = currentLiveCell.neighbours[gene.consume]
        consume.map((key) => {
            objectList[key.toString()] = getProperties(gene.produce)
            grid[key.toString()].color = objectList[key.toString()].color
            grid[key.toString()].type = gene.produce
            statistic[gene.consume]--
            statistic[gene.produce]++
            objectList[currentLiveCell.key].digestionCount++
        })

    } 
    objectList[currentLiveCell.key].digestionSignal.push(currentLiveCell.actionPoints.digest)
}

var processMovement = (grid, objectList) => {

    var moveLeft = currentLiveCell.actionPoints.moveLeft
    var moveRight = currentLiveCell.actionPoints.moveRight
    var moveUp = currentLiveCell.actionPoints.moveUp
    var moveDown = currentLiveCell.actionPoints.moveDown

    if (currentLiveCell.actionPoints.moveLeft < 0) {
        moveRight += Math.abs(currentLiveCell.actionPoints.moveLeft)
    }

    if (currentLiveCell.actionPoints.moveRight < 0) {
        moveLeft += Math.abs(currentLiveCell.actionPoints.moveRight)
    }

    if (currentLiveCell.actionPoints.moveUp < 0) {
        moveUp += Math.abs(currentLiveCell.actionPoints.moveUp)
    }

    if (currentLiveCell.actionPoints.moveDown < 0) {
        moveDown += Math.abs(currentLiveCell.actionPoints.moveDown)
    }

    var moved = false
    var neighbour = getNeighbourArray(currentLiveCell.key)

    if (Math.tanh(moveLeft) >= 1) {
        moveCell(grid, objectList, currentLiveCell.key, neighbour[0])
        moved = true
        currentLiveCell.key = neighbour[0]
        objectList[currentLiveCell.key].distTravelLeft++
    }

    if (Math.tanh(moveRight) >= 1) {
        moveCell(grid, objectList, currentLiveCell.key, neighbour[1])
        moved = true
        currentLiveCell.key = neighbour[1]
        objectList[currentLiveCell.key].distTravelRight++
    }

    if (Math.tanh(moveUp) >= 1) {
        moveCell(grid, objectList, currentLiveCell.key, neighbour[2])
        delete objectList[currentLiveCell.key]
        moved = true
        currentLiveCell.key = neighbour[2]
        objectList[currentLiveCell.key].distTravelUp++
    }

    if (Math.tanh(moveDown) >= 1) {
        moveCell(grid, objectList, currentLiveCell.key, neighbour[3])
        moved = true
        currentLiveCell.key = neighbour[3]
        objectList[currentLiveCell.key].distTravelDown++
    }

    if (moved == false && Math.tanh(currentLiveCell.actionPoints.moveRandom) >= 1) {
        var neighbourId = Math.floor(Math.random() * 7)
        var neighbour = getNeighbourArray(currentLiveCell.key)
        var target = neighbour[neighbourId]
        moveCell(grid, objectList, currentLiveCell.key, target)
        currentLiveCell.key = target
        objectList[target].distTravelRand++
    }

    objectList[currentLiveCell.key].moveUpSignal.push(moveUp)
    objectList[currentLiveCell.key].moveDownSignal.push(moveDown)
    objectList[currentLiveCell.key].moveLeftSignal.push(moveLeft)
    objectList[currentLiveCell.key].moveRightSignal.push(moveRight)
    objectList[currentLiveCell.key].moveRandomSignal.push(currentLiveCell.actionPoints.moveRandom)

}

var liveProcessor = (grid, objectList, statistic, key) => {

    var decodedGenome = genomeDecoder(objectList[key].genome)
    var parameter = {}

    for (let i = 0; i < decodedGenome.length; i++) {
        if(decodedGenome[i].type == "parameter") {
            parameter = Object.assign(parameter, decodedGenome[i])
        }
    }

    currentLiveCell = {
        key: key,
        parameter: parameter,
        neighbours: getFilteredNeighbour(grid, key),
        topArea: getTopArea(grid, key, parameter.senseArea),
        bottomArea: getBottomArea(grid, key, parameter.senseArea),
        leftArea: getLeftArea(grid, key, parameter.senseArea),
        rightArea: getRightArea(grid, key, parameter.senseArea),
        actionPoints: {
            "moveUp": 0,
            "moveDown": 0,
            "moveLeft": 0,
            "moveRight": 0,
            "moveRandom": 0,
            "digest": 0,
        }
    }

    for (let i = 0; i < decodedGenome.length; i++) {
        switch(decodedGenome[i].type) {
            case "neuron": {
                if (objectList[currentLiveCell.key] != undefined) processNeuron( decodedGenome[i])
            }break
            case "death": {
                if (objectList[currentLiveCell.key] != undefined) processDeath(statistic, grid, objectList, decodedGenome[i])
            } break
            case "replication": {
                if (objectList[currentLiveCell.key] != undefined) processReplication(statistic, grid, objectList, decodedGenome[i])
            } break
            case "mutation": {
                if (objectList[currentLiveCell.key] != undefined) processMutation(objectList, decodedGenome[i])
            } break
            case "digestion": {
                if (objectList[currentLiveCell.key] != undefined) processDigestion(statistic, grid, objectList, decodedGenome[i])
            } break
        }
    }
    if (objectList[currentLiveCell.key] != undefined) processMovement(grid, objectList)
}

module.exports = {
    liveProcessor: liveProcessor
}