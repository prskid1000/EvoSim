import { useEffect, useRef, useState } from "react";
import { cellTypes, getProperties } from "./cellType";
import { computeCircularColumn, computeCircularRow, moveCell } from "./cellUtility";
import useWindowDimensions from "./customHooks";
import { initGrid } from "./initGrid";
import { genomeDecoder } from "./live";
import { processDOM } from "./processDOM";
import { processGrid } from "./processGrid";
import { selectNextGen } from "./selectNextGen";

var computeNumber = parseInt(process.env.REACT_APP_COMPUTE_NUMBER)
var simulationSpeed = process.env.REACT_APP_SIMULATION_SPEED
var geneSequence = process.env.REACT_APP_GENE_SEQUENCE
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

var initList = {
  //Init List GUI
}

var selectTarget = 0
var currentKey = 0
var currentProperty = null
var currentObjectId = undefined
var negate = false

function App() {
  var { height, width } = useWindowDimensions();
  var idx = 0
  var infoPanel = useRef()
  var cellInfoPanel = useRef()
  var [stateStatistic, setStateStatistic] = useState()
  var [selectRadius, setSelectRadius] = useState({left: 0,right: 0,top: 0,bottom: 0})
  var [cellInfo, setCellInfo] = useState()
  var controlTable = useRef()
  var cellTypePanel = useRef()
  var radiusPanel = useRef()

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

  var selectStyle = {
    position: "absolute",
    backgroundColor: "transparent",
    color: "white",
    top: "0px",
    left: "0px",
    zIndex: "3",
    fontSize: "12px",
    zIndex: "999999",
    width: width * 0.20
  }

  var controlTableStyle = {
    position: "absolute",
    backgroundColor: "transparent",
    top: "50px",
    left: width * 0.30,
    zIndex: "3",
    fontSize: "12px",
    width: width * 0.40,
  }

  var radiusStyle = {
    position: "absolute",
    backgroundColor: "transparent",
    top: Math.min(height * 0.99, width * 0.99) * 0.30,
    left: width * 0.30,
    zIndex: "3",
    fontSize: "12px",
    width: width * 0.40,
  }

  var infoPanelStyle = {
    position: "absolute",
    backgroundColor: "transparent",
    top: "0",
    let: "0",
    zIndex: "999999",
    width: width * 0.20,
    fontSize: "12px",
  }

  var cellInfoPanelStyle = {
    position: "absolute",
    top: "0",
    let: "0",
    zIndex: "999999",
    width: width * 0.20,
    overflowY: "scroll",
    fontSize: "12px",
  }

  var nextGen = () => {
    objectList = selectNextGen(grid, objectList, statistic, initList, selectRadius)
    processDOM(grid)
  }

  var simulate = () => {
    processGrid(grid, objectList, statistic)
    processDOM(grid)
    setStateStatistic(statistic)

    if (runState == true) {
      setTimeout(() => {
        simulate()
      }, 60000 / simulationSpeed);
    }
   
  }

  var handleUp = () => {
    if (currentKey == null || currentKey == undefined) return
    if (currentObjectId == undefined || currentObjectId == "-1" || objectList[currentObjectId] == undefined) return
    switch (currentProperty) {
      case "move": {
        var rowStart = computeCircularRow((Math.floor(parseInt(currentObjectId) / computeNumber)) * computeNumber - computeNumber)
        var rowEnd = rowStart + computeNumber - 1
        var column = rowStart + parseInt(currentObjectId) % computeNumber
        var futureKey = computeCircularColumn(column, rowStart, rowEnd).toString()
        moveCell(grid, objectList, currentObjectId, futureKey)
        currentObjectId = futureKey
        processDOM(grid)
      }break
      case "selectRadius": {
       if(negate == false) {
         selectRadius.top = selectRadius.top + 1 <= Math.floor(computeNumber / 2) ? selectRadius.top + 1 : Math.floor(computeNumber / 2)
       } else {
         selectRadius.top = selectRadius.top - 1 >= 0 ? selectRadius.top - 1 : 0
       }
        setSelectRadius(JSON.parse(JSON.stringify(selectRadius)))
      }break
      default: {
        var rowStart = computeCircularRow((Math.floor(parseInt(currentKey) / computeNumber)) * computeNumber - computeNumber)
        var rowEnd = rowStart + computeNumber - 1
        var column = rowStart + parseInt(currentKey) % computeNumber
        var futureKey = computeCircularColumn(column, rowStart, rowEnd).toString()

        var cell = document.getElementById(currentKey)
        cell.style.backgroundColor = grid[currentKey].color
        cell = document.getElementById(futureKey)
        cell.style.backgroundColor = "red"
        currentKey = futureKey

        cellInfoPanel.current.style.top = (cell.offsetTop).toString() + "px"
        cellInfoPanel.current.style.left = (cell.offsetLeft).toString() + "px"

        infoPanel.current.style.top = (cell.offsetTop).toString() + "px"
        infoPanel.current.style.left = (cell.offsetLeft).toString() + "px"

        cellTypePanel.current.style.top = (cell.offsetTop).toString() + "px"
        cellTypePanel.current.style.left = (cell.offsetLeft).toString() + "px"

        if (objectList[futureKey] != undefined) {
          currentObjectId = futureKey
          if (grid[futureKey].type == "live") {
            setCellInfo(JSON.parse(JSON.stringify(genomeDecoder(objectList[futureKey].genome))))
          } else {
            var info = []
            info.push({ "type": objectList[futureKey].type })
            info.push({ "proton": objectList[futureKey].proton })
            info.push({ "neutron": objectList[futureKey].neutron })
            info.push({ "electron": objectList[futureKey].electron })
            info.push({ "mass": objectList[futureKey].mass })
            info.push({ "charge": objectList[futureKey].charge })
            setCellInfo(JSON.parse(JSON.stringify(info)))
          }
        }

      }
    }
  }

  var handleDown = () => {
    if (currentKey == null || currentKey == undefined) return
    if (currentObjectId == undefined || currentObjectId == "-1" || objectList[currentObjectId] == undefined) return

    switch (currentProperty) {
      case "move": {
        var rowStart = computeCircularRow((Math.floor(parseInt(currentObjectId) / computeNumber)) * computeNumber + computeNumber)
        var rowEnd = rowStart + computeNumber - 1
        var column = rowStart + parseInt(currentObjectId) % computeNumber
        var futureKey = computeCircularColumn(column, rowStart, rowEnd).toString()
        moveCell(grid, objectList, currentObjectId, futureKey)
        currentObjectId = futureKey
        processDOM(grid)
      } break
      case "selectRadius": {
        if (negate == false) {
          selectRadius.bottom = selectRadius.bottom + 1 <= Math.floor(computeNumber / 2) ? selectRadius.bottom + 1 : Math.floor(computeNumber / 2)
        } else {
          selectRadius.bottom = selectRadius.bottom - 1 >= 0 ? selectRadius.bottom - 1 : 0
        }
        setSelectRadius(JSON.parse(JSON.stringify(selectRadius)))
      } break
      default: {
        var rowStart = computeCircularRow((Math.floor(parseInt(currentKey) / computeNumber)) * computeNumber + computeNumber)
        var rowEnd = rowStart + computeNumber - 1
        var column = rowStart + parseInt(currentKey) % computeNumber
        var futureKey = computeCircularColumn(column, rowStart, rowEnd).toString()

        var cell = document.getElementById(currentKey)
        cell.style.backgroundColor = grid[currentKey].color
        cell = document.getElementById(futureKey)
        cell.style.backgroundColor = "red"
        currentKey = futureKey

        cellInfoPanel.current.style.top = (cell.offsetTop).toString() + "px"
        cellInfoPanel.current.style.left = (cell.offsetLeft).toString() + "px"

        infoPanel.current.style.top = (cell.offsetTop).toString() + "px"
        infoPanel.current.style.left = (cell.offsetLeft).toString() + "px"

        cellTypePanel.current.style.top = (cell.offsetTop).toString() + "px"
        cellTypePanel.current.style.left = (cell.offsetLeft).toString() + "px"

        if (objectList[futureKey] != undefined) {
          currentObjectId = futureKey
          if (grid[futureKey].type == "live") {
            setCellInfo(JSON.parse(JSON.stringify(genomeDecoder(objectList[futureKey].genome))))
          } else {
            var info = []
            info.push({ "type": objectList[futureKey].type })
            info.push({ "proton": objectList[futureKey].proton })
            info.push({ "neutron": objectList[futureKey].neutron })
            info.push({ "electron": objectList[futureKey].electron })
            info.push({ "mass": objectList[futureKey].mass })
            info.push({ "charge": objectList[futureKey].charge })
            setCellInfo(JSON.parse(JSON.stringify(info)))
          }
        }

      }
    }
  }

  var handleLeft = () => {
    if (currentKey == null || currentKey == undefined) return
    if (currentObjectId == undefined || currentObjectId == "-1" || objectList[currentObjectId] == undefined) return

    switch (currentProperty) {
      case "move": {
        var rowStart = computeCircularRow((Math.floor(parseInt(currentObjectId) / computeNumber)) * computeNumber)
        var rowEnd = rowStart + computeNumber - 1
        var column = rowStart + parseInt(currentObjectId) % computeNumber - 1
        var futureKey = computeCircularColumn(column, rowStart, rowEnd).toString()
        moveCell(grid, objectList, currentObjectId, futureKey)
        currentObjectId = futureKey
        processDOM(grid)
      } break
      case "selectRadius": {
        if (negate == false) {
          selectRadius.left = selectRadius.left + 1 <= Math.floor(computeNumber / 2) ? selectRadius.left + 1 : Math.floor(computeNumber / 2)
        } else {
          selectRadius.left = selectRadius.left - 1 >= 0 ? selectRadius.left - 1 : 0
        }
        setSelectRadius(JSON.parse(JSON.stringify(selectRadius)))
      } break
      default: {
        var rowStart = computeCircularRow((Math.floor(parseInt(currentKey) / computeNumber)) * computeNumber)
        var rowEnd = rowStart + computeNumber - 1
        var column = rowStart + parseInt(currentKey) % computeNumber - 1
        var futureKey = computeCircularColumn(column, rowStart, rowEnd).toString()

        var cell = document.getElementById(currentKey)
        cell.style.backgroundColor = grid[currentKey].color
        cell = document.getElementById(futureKey)
        cell.style.backgroundColor = "red"
        currentKey = futureKey

        cellInfoPanel.current.style.top = (cell.offsetTop).toString() + "px"
        cellInfoPanel.current.style.left = (cell.offsetLeft).toString() + "px"

        infoPanel.current.style.top = (cell.offsetTop).toString() + "px"
        infoPanel.current.style.left = (cell.offsetLeft).toString() + "px"

        cellTypePanel.current.style.top = (cell.offsetTop).toString() + "px"
        cellTypePanel.current.style.left = (cell.offsetLeft).toString() + "px"

        if (objectList[futureKey] != undefined) {
          currentObjectId = futureKey
          if (grid[futureKey].type == "live") {
            setCellInfo(JSON.parse(JSON.stringify(genomeDecoder(objectList[futureKey].genome))))
          } else {
            var info = []
            info.push({ "type": objectList[futureKey].type })
            info.push({ "proton": objectList[futureKey].proton })
            info.push({ "neutron": objectList[futureKey].neutron })
            info.push({ "electron": objectList[futureKey].electron })
            info.push({ "mass": objectList[futureKey].mass })
            info.push({ "charge": objectList[futureKey].charge })
            setCellInfo(JSON.parse(JSON.stringify(info)))
          }
        }

      }
    }
  }

  var handleRight = () => {
    if (currentKey == null || currentKey == undefined) return
    if (currentObjectId == undefined || currentObjectId == "-1" || objectList[currentObjectId] == undefined) return
    console.log(currentProperty)
    switch (currentProperty) {
      case "move": {
        var rowStart = computeCircularRow((Math.floor(parseInt(currentObjectId) / computeNumber)) * computeNumber)
        var rowEnd = rowStart + computeNumber - 1
        var column = rowStart + parseInt(currentObjectId) % computeNumber + 1
        var futureKey = computeCircularColumn(column, rowStart, rowEnd).toString()
        moveCell(grid, objectList, currentObjectId, futureKey)
        currentObjectId = futureKey
        processDOM(grid)
      } break
      case "selectRadius": {
        if (negate == false) {
          selectRadius.right = selectRadius.right + 1 <= Math.floor(computeNumber / 2) ? selectRadius.right + 1 : Math.floor(computeNumber / 2)
        } else {
          selectRadius.right = selectRadius.right - 1 >= 0 ? selectRadius.right - 1 : 0
        }
        setSelectRadius(JSON.parse(JSON.stringify(selectRadius)))
      } break
      default:{
        var rowStart = computeCircularRow((Math.floor(parseInt(currentKey) / computeNumber)) * computeNumber)
        var rowEnd = rowStart + computeNumber - 1
        var column = rowStart + parseInt(currentKey) % computeNumber + 1
        var futureKey = computeCircularColumn(column, rowStart, rowEnd).toString()

        var cell = document.getElementById(currentKey)
        cell.style.backgroundColor = grid[currentKey].color
        cell = document.getElementById(futureKey)
        cell.style.backgroundColor = "red"
        currentKey = futureKey

        cellInfoPanel.current.style.top = (cell.offsetTop).toString() + "px"
        cellInfoPanel.current.style.left = (cell.offsetLeft).toString() + "px"

        infoPanel.current.style.top = (cell.offsetTop).toString() + "px"
        infoPanel.current.style.left = (cell.offsetLeft).toString() + "px"

        cellTypePanel.current.style.top = (cell.offsetTop).toString() + "px"
        cellTypePanel.current.style.left = (cell.offsetLeft).toString() + "px"

        if (objectList[futureKey] != undefined) {
          currentObjectId = futureKey
          if (grid[futureKey].type == "live") {
            setCellInfo(JSON.parse(JSON.stringify(genomeDecoder(objectList[futureKey].genome))))
          } else {
            var info = []
            info.push({ "type": objectList[futureKey].type })
            info.push({ "proton": objectList[futureKey].proton })
            info.push({ "neutron": objectList[futureKey].neutron })
            info.push({ "electron": objectList[futureKey].electron })
            info.push({ "mass": objectList[futureKey].mass })
            info.push({ "charge": objectList[futureKey].charge })
            setCellInfo(JSON.parse(JSON.stringify(info)))
          }
        }
      }
    }
  }

  var onKeyDown = (event) => {

    switch(event.key) {
      case "0": {
        if (controlTable.current.hidden == true) {
          controlTable.current.hidden = false
        } else {
          controlTable.current.hidden = true
        }
        break
      }
      case "1": {
        if(runState == false) {
          runState = true
          simulate()
        } else {
          runState = false
        }
        break
      }
      case "2": {
        if (infoPanel.current.hidden == false) {
          infoPanel.current.hidden = true
        } else {
          infoPanel.current.hidden = false
        }
        break
      }
      case "3": {
        if (cellInfoPanel.current.hidden == false) {
          cellInfoPanel.current.hidden = true
        } else {
          cellInfoPanel.current.hidden = false
        }
        break
      }
      case "4": {
        runState = false
        nextGen()
        break
      }
      case "5": {
        //Edit NxtGen /init list
        break
      }
      case "6": {
        if (currentProperty == null) {
          currentProperty = "selectRadius"
          radiusPanel.current.hidden = false
        }
        break
      }
      case "7": {
        if(cellTypePanel.current.hidden == true) {
          cellTypePanel.current.hidden = false
          selectTarget = currentKey
        } else {
          cellTypePanel.current.hidden = true
        }
        break
      }
      case "8": {
        if(grid[currentKey].type != "empty") {
          grid[currentKey].color = "black"
          grid[currentKey].type = "empty"
          var cell = document.getElementById(currentKey)
          cell.style.backgroundColor = "black"
          delete objectList[currentKey]
          currentObjectId = undefined
        } break
      }
      case "9": {
        if(currentProperty == null) {
          currentProperty = "move"
        }
        break
      } 
      case "-": {
        if(negate == true) {
          alert("Switched to +ve Mode")
          negate = false
        } else {
          alert("Switched to -ve Mode")
          negate = true
        }
        break
      }
      case "ArrowUp": {
        if (currentKey != null) {
          runState = false
          handleUp()
        }
      } break
      case "ArrowLeft": {
        if (currentKey != null) {
          runState = false
          handleLeft()
        }
      } break
      case "ArrowRight": {
        if (currentKey != null) {
          runState = false
          handleRight()
        }
      } break
      case "ArrowDown": {
        if (currentKey != null) {
          runState = false
          handleDown()
        }
      } break
    }
  }

  var onKeyUp = (event) => {
    switch(event.key) {
      case "9": {
        currentProperty = null
        break
      }
      case "6": {
        currentProperty = null
        radiusPanel.current.hidden = true
        break
      }
    }

    if (objectList[currentObjectId] != undefined) {
      if (grid[currentObjectId].type == "live") {
        setCellInfo(JSON.parse(JSON.stringify(genomeDecoder(objectList[currentObjectId].genome))))
      } else {
        var info = []
        info.push({ "type": objectList[currentObjectId].type })
        info.push({ "proton": objectList[currentObjectId].proton })
        info.push({ "neutron": objectList[currentObjectId].neutron })
        info.push({ "electron": objectList[currentObjectId].electron })
        info.push({ "mass": objectList[currentObjectId].mass })
        info.push({ "charge": objectList[currentObjectId].charge })
        setCellInfo(JSON.parse(JSON.stringify(info)))
      }
    }
  }

  var onMouseEnterOrClick = (event) => {
    event.preventDefault()

    var cell = document.getElementById(event.target.id)
    cell.style.backgroundColor = "red"
    currentKey = event.target.id

    cellInfoPanel.current.style.top = (cell.offsetTop).toString() + "px"
    cellInfoPanel.current.style.left = (cell.offsetLeft).toString() + "px"

    infoPanel.current.style.top = (cell.offsetTop).toString() + "px"
    infoPanel.current.style.left = (cell.offsetLeft).toString() + "px"

    cellTypePanel.current.style.top = (cell.offsetTop).toString() + "px"
    cellTypePanel.current.style.left = (cell.offsetLeft).toString() + "px"

    if (objectList[event.target.id] != undefined) {
      currentObjectId = event.target.id
      if (grid[event.target.id].type == "live") {
        setCellInfo(JSON.parse(JSON.stringify(genomeDecoder(objectList[event.target.id].genome))))
      } else {
        var info = []
        info.push({ "type":objectList[event.target.id].type})
        info.push({ "proton": objectList[event.target.id].proton })
        info.push({ "neutron": objectList[event.target.id].neutron })
        info.push({ "electron": objectList[event.target.id].electron })
        info.push({ "mass": objectList[event.target.id].mass })
        info.push({ "charge": objectList[event.target.id].charge })
        setCellInfo(JSON.parse(JSON.stringify(info)))
      }
    }
    
  }

  var onMouseLeave = (event) => {
    event.preventDefault()
    var cell = document.getElementById(event.target.id)
    cell.style.backgroundColor = grid[event.target.id].color
  }

  var onCellSelect = (event) => {
    if (event.target.value == "empty" || grid[selectTarget].type != "empty") return
    objectList[selectTarget] = getProperties(event.target.value, geneSequence)
    grid[selectTarget].color = objectList[selectTarget].color
    grid[selectTarget].type = event.target.value
    var cell = document.getElementById(selectTarget)
    cell.style.backgroundColor = objectList[selectTarget].color
    cellTypePanel.current.hidden = true
    currentObjectId = selectTarget
  }

  useEffect(() => {

    infoPanel.current.hidden = true
    cellInfoPanel.current.hidden = true
    controlTable.current.hidden = true
    cellTypePanel.current.hidden = true
    radiusPanel.current.hidden = true

    initGrid(grid, objectList, statistic, initList)
    processDOM(grid)
    setStateStatistic(statistic)

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
                onKeyUp={onKeyUp}
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
      <table tabIndex={0} onKeyDown={onKeyDown} ref={infoPanel} style={infoPanelStyle} className="table">
        <thead className="thead-dark">
          <tr>
            <th scope="col">Query</th>
            <th scope="col">Status</th>
          </tr>
        </thead>
        <tbody className="table-light">
        {stateStatistic && Object.keys(stateStatistic).map((key) => (
          <tr key={key}>
            <td>{key}</td>
            <td>{stateStatistic[key]}</td>
          </tr>
        ))}
        </tbody>
      </table>
      <table tabIndex={0} onKeyDown={onKeyDown} ref={cellInfoPanel} style={cellInfoPanelStyle} className="table">
        <tbody>
          {cellInfo != undefined && cellInfo.map((target) => (
            <>
              <tr className="thead-dark">
                {Object.keys(target).map((key) => (
                  <th scope="col">{key}</th>
                ))}
              </tr>
              <tr className="table-light">
                {Object.keys(target).map((key) => (
                  <td scope="col">{target[key].toString()}</td>
                ))}
              </tr>
            </>
           ))}
        </tbody>
      </table>
      <table tabIndex={0} onKeyDown={onKeyDown} ref={controlTable} style={controlTableStyle} className="table">
        <thead className="thead-dark">
          <tr>
            <th scope="col">Simulator Controls</th>
            <th scope="col">Keyboard Combination</th>
          </tr>
        </thead>
        <tbody className="table-light">
          <tr>
            <td>Help</td>
            <td>0(Toggle)</td>
          </tr>
          <tr>
            <td>Start/Stop Simulator </td>
            <td>1(Toggle)</td>
          </tr>
          <tr>
            <td>View/Hide Statistics </td>
            <td>2(Toggle)</td>
          </tr>
          <tr>
            <td>View/Hide Cell Information </td>
            <td>3(Toggle)</td>
          </tr>
        </tbody>
      </table>
      <table tabIndex={0} onKeyDown={onKeyDown} ref={radiusPanel} style={radiusStyle} className="table">
        <thead className="thead-dark">
          <tr>
            <th scope="col">Left</th>
            <th scope="col">Right</th>
            <th scope="col">Top</th>
            <th scope="col">Bottom</th>
          </tr>
        </thead>
        <tbody className="table-light">
          <tr>
            <td>{selectRadius.left}</td>
            <td>{selectRadius.right}</td>
            <td>{selectRadius.top}</td>
            <td>{selectRadius.bottom}</td>
          </tr>
        </tbody>
      </table>
      <select tabIndex={0} onKeyDown={onKeyDown} ref={cellTypePanel} name="groupselect" className="form-control form-select col-12 col-md-6" style={selectStyle} onChange={onCellSelect}>
        <option value="none" selected>Select Cell Type</option>
        {cellTypes.map((item) => (
          <option key={item} value={item}>{item}</option>
        ))
        }</select>
    </div>
  );
}

export default App;
