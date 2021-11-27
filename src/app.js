import { useEffect, useRef, useState } from "react";
import useWindowDimensions from "./customHooks";
import { initGrid } from "./initGrid";
import { genomeDecoder } from "./live";
import { processDOM } from "./processDOM";
import { processGrid } from "./processGrid";

var computeNumber = 128
var simulationSpeed = 6000
var threads = navigator.hardwareConcurrency
var worker = new Worker("worker/worker.js")
var runState = false

var num = []
for(let i = 0; i < computeNumber; i++) {
  num.push(i)
}

var grid = {}
var objectList = {}
var statistic = {}
for (let i = 0; i < computeNumber * computeNumber; i++) {
  grid[i.toString()] = {}
}

function App() {
  var { height, width } = useWindowDimensions();
  var idx = 0
  var infoPanel = useRef()
  var cellInfoPanel = useRef()
  var [stateStatistic, setStateStatistic] = useState()
  var [cellInfo, setCellInfo] = useState()

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

  var infoPanelStyle = {
    position: "absolute",
    backgroundColor: "transparent",
    color: "white",
    top: "0",
    let: "0",
    zIndex: "999999",
    fontSize: "12px"
  }

  var simulate = () => {
    worker.postMessage({
      "statement": processGrid.toString(),
      "args": {
        "grid": grid,
        "objectList": objectList,
        "statistic": statistic
      }
    })
    worker.onmessage = (message) => {
      grid = message.data.grid
      objectList = message.data.objectList
      processDOM(grid)
      statistic = message.data.statistic
      setStateStatistic(statistic)
      if (runState == true) {
        setTimeout(() => {
          worker.postMessage({
            "statement": processGrid.toString(),
            "args": {
              "grid": grid,
              "objectList": objectList,
              "statistic": statistic
            }
          })
        }, 60000 / simulationSpeed);
      }
    }
  }

  var onKeyDown = (event) => {

    switch(event.key) {
      case "1": {
        infoPanel.current.hidden = false
        break
      }
       case "2": {
        infoPanel.current.hidden = true
        break
      }
      case "3": {
        cellInfoPanel.current.hidden = false
        break
      }
      case "4": {
        cellInfoPanel.current.hidden = true
        break
      }
      case "5": {
        runState = true
        simulate()
        break
      }
      case "6": {
        runState = false
        break
      }
    }
  }

  var onMouseEnterOrClick = (event) => {
    event.preventDefault()

    var cell = document.getElementById(event.target.id)
    cell.style.backgroundColor = "red"

    cellInfoPanel.current.style.top = (20 + cell.offsetTop).toString() + "px"
    cellInfoPanel.current.style.left = (20 + cell.offsetLeft).toString() + "px"

    if (objectList[event.target.id] != undefined) {
      if (grid[event.target.id].type == "live") {
        setCellInfo(JSON.parse(JSON.stringify(genomeDecoder(objectList[event.target.id].genome))))
      } else {
        setCellInfo(JSON.parse(JSON.stringify(objectList[event.target.id])))
      }
    }

    infoPanel.current.style.top = (20 + cell.offsetTop).toString() + "px"
    infoPanel.current.style.left = (20 + cell.offsetLeft).toString() + "px"
  }

  var onMouseLeave = (event) => {
    event.preventDefault()
    var cell = document.getElementById(event.target.id)
    cell.style.backgroundColor = grid[event.target.id].color
  }

  useEffect(() => {

    infoPanel.current.hidden = true
    cellInfoPanel.current.hidden = true

    worker.postMessage({
      "statement": initGrid.toString(),
      "args": {
        "grid": grid,
        "objectList": objectList
      }
    })

    worker.onmessage = (message) => {
      grid = message.data.grid
      objectList = message.data.objectList
      processDOM(grid)
      statistic = message.data.statistic
      setStateStatistic(statistic)
    }

  }, [])

  return (
    <div>
      <div style={appStyle}>
        {num.map((i) => (
          <div key={i} className="d-flex justify-content-center">
            {num.map((j) => (
              <div
                onMouseEnter={onMouseEnterOrClick}
                onMouseLeave={onMouseLeave}
                onTouchStart={onMouseEnterOrClick}
                onTouchEnd={onMouseLeave}
                onClick={onMouseEnterOrClick}
                onKeyDown={onKeyDown}
                tabIndex={-1}
                id={idx}
                key={idx++}
                data-bitprop={""}
                style={cellStyle}
              ></div>
            ))}
          </div>
        ))}
      </div>
      <div ref={infoPanel} style={infoPanelStyle}>
        {stateStatistic && Object.keys(stateStatistic).map((key) => (
          <div key={key}>{key}:&nbsp;{stateStatistic[key]}</div>
        ))}
        <div></div>
      </div>
      <div ref={cellInfoPanel} style={infoPanelStyle}>
        {JSON.stringify(cellInfo)}
      </div>
    </div>
  );
}

export default App;
