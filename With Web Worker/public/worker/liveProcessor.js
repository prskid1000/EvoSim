importScripts("cellUtility.js")
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

    switch (gene.inputNeuron) {
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
        case "oxygenGradientLeftToRight": {
            value = computeLeftToRightGradient("oxygen")
        } break
        case "oxygenGradientTopToBottom": {
            value = computeTopToBottomGradient("oxygen")
        } break
        case "oxygenNeighbour": {
            value = currentLiveCell.neighbours["oxygen"] == undefined ? 0 : currentLiveCell.neighbours["oxygen"].length
        } break
        case "carbonGradientLeftToRight": {
            value = computeLeftToRightGradient("carbon")
        } break
        case "carbonGradientTopToBottom": {
            value = computeTopToBottomGradient("carbon")
        } break
        case "carbonNeighbour": {
            value = currentLiveCell.neighbours["oxygen"] == undefined ? 0 : currentLiveCell.neighbours["oxygen"].length
        } break
        case "populationGradientLeftToRight": {
            value = computeLeftToRightGradient("live")
        } break
        case "populationGradientTopToBottom": {
            value = computeTopToBottomGradient("live")
        } break
        case "populationNeighbour": {
            value = currentLiveCell.neighbours["oxygen"] == undefined ? 0 : currentLiveCell.neighbours["oxygen"].length
        } break
    }
    
    currentLiveCell.actionPoints[outputNeuron] += value * gene.synapseWeight
}

var processDeath = (statistic, grid, objectList, gene) => {
    var flag = false
    var factorCount = currentLiveCell.neighbours[gene.factor]
    if(factorCount == undefined) return 
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
}

var processReplication = (statistic, grid, objectList, gene) => {
    var flag = false
    var factorCount = currentLiveCell.neighbours[gene.factor]
    if (factorCount == undefined) return
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

}

var processMutation = (grid, objectList, gene) => {
    var flag = false
    var factorCount = currentLiveCell.neighbours[gene.factor]
    if (factorCount == undefined) return
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
    }
}

var processDigestion = (statistic, grid, objectList, gene) => {
    if (Math.tanh(currentLiveCell.actionPoints.digest) > 1) {
        var consume = currentLiveCell.neighbours[gene.consume]
        consume.map((key) => {
            objectList[key.toString()] = getProperties(gene.produce)
            grid[key.toString()].color = objectList[key.toString()].color
            grid[key.toString()].type = gene.produce
            statistic[gene.consume]--
            statistic[gene.produce]++
        })
    }
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

    if (Math.tanh(moveLeft) > 1) {
        moveCell(grid, objectList, currentLiveCell.key, neighbour[0])
        moved = true
        currentLiveCell.key = neighbour[0]
    }

    if (Math.tanh(moveRight) > 1) {
        moveCell(grid, objectList, currentLiveCell.key, neighbour[1])
        moved = true
        currentLiveCell.key = neighbour[1]
    }

    if (Math.tanh(moveUp) > 1) {
        moveCell(grid, objectList, currentLiveCell.key, neighbour[2])
        delete objectList[currentLiveCell.key]
        moved = true
        currentLiveCell.key = neighbour[2]
    }

    if (Math.tanh(moveDown) > 1) {
        moveCell(grid, objectList, currentLiveCell.key, neighbour[3])
        moved = true
        currentLiveCell.key = neighbour[3]
    }

    if (moved == false && currentLiveCell.actionPoints.moveRandom > 0) {
        var neighbourId = Math.floor(Math.random() * 7)
        var neighbour = getNeighbourArray(currentLiveCell.key)
        var target = neighbour[neighbourId]
        moveCell(grid, objectList, currentLiveCell.key, target)
    }

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
                processNeuron(decodedGenome[i], parameter.senseArea)
            }break
            case "death": {
                processDeath(statistic, grid, objectList, decodedGenome[i])
                if (objectList[currentLiveCell.key] == undefined) return
            } break
            case "replication": {
                processReplication(statistic, grid, objectList, decodedGenome[i])
            } break
            case "mutation": {
                processMutation(grid, objectList, decodedGenome[i])
            } break
            case "digestion": {
                processDigestion(statistic, grid, objectList, decodedGenome[i])
            } break
        }
    }
    processMovement(grid, objectList)
}