import { useEffect, useState } from "react";
import useWindowDimensions from "./customHooks";
import { processDOM } from "./processDOM";
import { processGrid } from "./processGrid";

var computeNumber = 128
var simulationSpeed = 600
var threads = navigator.hardwareConcurrency
var worker = new Worker("worker.js")

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

  var onMouseEnter = (event) => {
    event.preventDefault()
    var cell = document.getElementById(event.target.id)
    cell.style.backgroundColor = "red"
  }

  var onClick = (event) => {
    event.preventDefault()
    var cell = document.getElementById(event.target.id)
    cell.style.backgroundColor = "red"
  }

  var onMouseLeave = (event) => {
    event.preventDefault()
    var cell = document.getElementById(event.target.id)
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
      grid[key].color = "black"
    })
  }

  var initObjectList = () => {
    
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
