import { useEffect, useState } from "react";
import { groundProperties } from "./atom";
import { cellTypes, getProperties } from "./cellType";
import useWindowDimensions from "./customHooks";
import { processDOM } from "./processDOM";
import { processGrid } from "./processGrid";

var computeNumber = 128
var simulationSpeed = 6000
var threads = navigator.hardwareConcurrency
var worker = new Worker("worker.js")
var senseArea = 8
var borderTopLeft = 0
var borderBottomLeft = computeNumber * computeNumber - computeNumber

/*worker.postMessage({
  "function": ((value) => {
    return value
  }).toString(),
  "args": "Hello World"
})
worker.onmessage = (message) => {
  console.log(message.data)
}*/

var num = []
for(let i = 0; i < computeNumber; i++) {
  num.push(i)
}

var grid = {}
var objectList = {}
for (let i = 0; i < computeNumber * computeNumber; i++) {
  grid[i.toString()] = {}
}

function App() {
  var { height, width } = useWindowDimensions();
  var idx = 0

  var appStyle = {
    height: Math.min(height * 0.99, width * 0.99),
    width: width * 0.99,
    margin: "2px",
  }

  var cellStyle = {
    backgroundColor: "black",
    height: Math.min(height * 0.99, width * 0.99) / computeNumber,
    width: Math.min(height * 0.99, width * 0.99) / computeNumber,
  }

  var computeCircularRow = (key) => {
    if (key < borderTopLeft) {
      return computeNumber * computeNumber + key

    } else if (key > borderBottomLeft) {
      return key % (computeNumber * computeNumber)
    }
    return key
  }

  var computeCircularColumn = (key, rowStart, rowEnd) => {
    if(key < rowStart) {
      return rowEnd + 1 - (rowStart - key)
    } else if(key > rowEnd) {
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
    return {
      "left": computeCircularColumn(currentRowStart + column - 1, currentRowStart, currentRowEnd),
      "right": computeCircularColumn(currentRowStart + column + 1, currentRowStart, currentRowEnd),
      "top": prevRowStart + column,
      "bottom": nextRowStart + column,
      "topLeft": computeCircularColumn(prevRowStart + column - 1, prevRowStart, prevRowEnd),
      "topRight": computeCircularColumn(prevRowStart + column + 1, prevRowStart, prevRowEnd),
      "bottomLeft": computeCircularColumn(nextRowStart + column - 1, nextRowStart, nextRowEnd),
      "bottomRight": computeCircularColumn( nextRowStart + column + 1, nextRowStart, nextRowEnd)
    }
  }

  var getSenseArea = (key) => {
    key = parseInt(key)
    var area = []
    for(let currentRow = ((Math.floor(key / computeNumber)) * computeNumber) - senseArea * computeNumber, count1 = 2 * senseArea; count1 >= 0; count1--, currentRow += computeNumber ) {
      var currentRowStart = computeCircularRow(currentRow)
      var currentRowEnd = computeCircularRow(currentRow) + computeNumber - 1
      var midpoint = currentRowStart + key % computeNumber
      for(let cell = midpoint - senseArea, count2 = 2 * senseArea; count2 >= 0; count2--, cell += 1) {
        area.push(computeCircularColumn(cell, currentRowStart, currentRowEnd).toString())
      }
    }
    return area
  }

  var onMouseEnter = (event) => {
    event.preventDefault()
    var cell = undefined

    /*var area = getSenseArea(event.target.id)
    area.map((key) => {
      cell = document.getElementById(key)
      cell.style.backgroundColor = "#f5c8c1"
    })

    var neighbour = getNeighbour(event.target.id)
    Object.keys(neighbour).map((key) => {
      cell = document.getElementById(neighbour[key])
      cell.style.backgroundColor = "#90fce1"
    })*/

    cell = document.getElementById(event.target.id)
    cell.style.backgroundColor = "red"
  }

  var onClick = (event) => {
    event.preventDefault()
    var cell = document.getElementById(event.target.id)
    cell.style.backgroundColor = "red"
  }

  var onMouseLeave = (event) => {
    event.preventDefault()
    var cell = undefined

    /*var area = getSenseArea(event.target.id)
    area.map((key) => {
      cell = document.getElementById(key)
      cell.style.backgroundColor = grid[key].color
    })

    var neighbour = getNeighbour(event.target.id)
    Object.keys(neighbour).map((key) => {
      cell = document.getElementById(neighbour[key])
      cell.style.backgroundColor = grid[neighbour[key]].color
    })*/

    cell = document.getElementById(event.target.id)
    cell.style.backgroundColor = grid[event.target.id].color

  }

  var gridProcessor = () => {
    worker.postMessage({
      "function": processGrid.toString(),
      "args": {
        "grid": grid,
        "objectList": objectList
      }
    })
  }

  var initGrid = () => {
    Object.keys(grid).map((key) => {
      grid[key].color = "black",
      grid[key].type = "empty"
    })
  }

  var initObjectList = () => {
    cellTypes.map((key) => {
      var currentKey = Math.floor(Math.random() * idx)
      objectList[currentKey] = getProperties(key)
      grid[currentKey].color = objectList[currentKey].color
      grid[currentKey].type = "atom"
    })
  }

  useEffect(() => {
    initGrid()
    initObjectList()
    gridProcessor()
    worker.onmessage = (message) => {
      grid = message.data.grid
      objectList = message.data.objectList
      processDOM(grid)
      setTimeout(() => {
        gridProcessor()
      }, 60000 / simulationSpeed);
    }
  }, [])

  return (
    <div>
      <div style={appStyle}>
        {num.map((i) => (
          <div key={i} className="d-flex justify-content-center">
            {num.map((j) => (
              <div
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                onTouchStart={onMouseEnter}
                onTouchEnd={onMouseLeave}
                onClick={onClick}
                id={idx}
                key={idx++}
                data-bitprop={""}
                style={cellStyle}
              ></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
