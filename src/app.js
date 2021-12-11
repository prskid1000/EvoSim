import { useEffect, useRef, useState } from "react";
import { cellTypes, getProperties } from "./cellType";
import { computeCircularColumn, computeCircularRow, moveCell } from "./cellUtility";
import useWindowDimensions from "./customHooks";
import { initGrid } from "./initGrid";
import { genomeDecoder, genomeMutator, liveProperties } from "./live";
import { processDOM } from "./processDOM";
import { processGrid } from "./processGrid";
import { selectNextGen } from "./selectNextGen";
import CanvasJSReact from './canvasjs.react';

var CanvasJSChart = CanvasJSReact.CanvasJSChart;
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
var statistic = {
  "deathList": []
}
for (let i = 0; i < computeNumber * computeNumber; i++) {
  grid[i.toString()] = {}
}

var selectTarget = 0
var currentKey = 0
var currentProperty = null
var currentObjectId = undefined
var negate = false
var writeMode = false

function App() {
  var { height, width } = useWindowDimensions();
  var idx = 0
  var infoPanel = useRef()
  var cellInfoPanel = useRef()
  var [stateStatistic, setStateStatistic] = useState({
    "deathList": ["-1"]
  })
  var [selectRadius, setSelectRadius] = useState({left: 0,right: 0,top: 0,bottom: 0})
  var [cellInfo, setCellInfo] = useState()
  var controlTable = useRef()
  var cellTypePanel = useRef()
  var radiusPanel = useRef()
  var initPanel = useRef()
  var genomePanel = useRef()
  var upload = useRef()
  var [initList, setInitList] = useState({})
  var [options, setOptions] = useState({})

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

  var selectStyle2 = {
    backgroundColor: "transparent",
    color: "white",
    zIndex: "3",
    fontSize: "12px",
    width: width * 0.20
  }

  var uploadStyle = {
    position: "absolute",
    backgroundColor: "transparent",
    color: "white",
    top: height * 0.50,
    left: width * 0.40,
    zIndex: "3",
    fontSize: "12px",
    width: width * 0.20
  }

  var controlTableStyle = {
    position: "absolute",
    backgroundColor: "transparent",
    top: "5%",
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
    left: "0",
    zIndex: "999999",
    width: width * 0.20,
    fontSize: "12px",
  }

  var cellInfoPanelStyle = {
    position: "absolute",
    top: "0",
    left: "0",
    zIndex: "999999",
    width: width * 0.20,
    overflowY: "scroll",
    fontSize: "12px",
  }

  var onUpload = (event) => {

    var reader = new FileReader();
    reader.onload = function (e) {
      var obj = JSON.parse(reader.result)
      grid = obj.grid
      objectList = obj.objectList
      statistic = obj.statistic
      setStateStatistic(JSON.parse(JSON.stringify(statistic)))
      upload.current.hidden = true
      processDOM(grid, objectList, statistic)
    }
    reader.readAsText(event.target.files[0])
  }

  var sceneUpload = (event) => {
    if (upload.current.hidden == true) {
      upload.current.hidden = false
    } else {
      upload.current.hidden = true
    }
  }

  var sceneDownload = (event) => {

    var obj = {
      "grid": grid,
      "objectList": objectList,
      "statistic": statistic,
    }

    const str = JSON.stringify(obj);
    const bytes = new TextEncoder().encode(str);

    const blob = new Blob([bytes], {
      type: "application/json;charset=utf-8"
    });

    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.setAttribute('download', "scene.json");
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  var nextGen = () => {
    statistic = {}
    objectList = selectNextGen(grid, objectList, statistic, initList, selectRadius)
    processDOM(grid, objectList, statistic)
    setStateStatistic(JSON.parse(JSON.stringify(statistic)))
  }

  var initGen = () => {
    statistic = {}
    initGrid(grid, objectList, statistic, initList, geneSequence)
    processDOM(grid, objectList, statistic)
    setStateStatistic(JSON.parse(JSON.stringify(statistic)))
  }

  var simulate = () => {
    currentObjectId = processGrid(grid, objectList, statistic, currentObjectId)
    processDOM(grid, objectList, statistic)
    setStateStatistic(JSON.parse(JSON.stringify(statistic)))
    if (objectList[currentObjectId] != undefined) {
      if (grid[currentObjectId].type == "live") {
        var info = genomeDecoder(objectList[currentObjectId].genome)
        info.push({
          "distTravelUp": objectList[currentObjectId].distTravelUp,
          "distTravelDown": objectList[currentObjectId].distTravelDown,
          "distTravelLeft": objectList[currentObjectId].distTravelLeft,
          "distTravelRight": objectList[currentObjectId].distTravelRight,
        })
        info.push({
          "distTravelRand": objectList[currentObjectId].distTravelRand,
          "replicationCount": objectList[currentObjectId].replicationCount,
          "mutationCount": objectList[currentObjectId].mutationCount,
          "metabolismCount": objectList[currentObjectId].metabolismCount
        })
        options.replicationSignal = {
          title: {
            text: "Replication Signal"
          },
          data: [{
            type: "spline",
            dataPoints: objectList[currentObjectId].replicationSignal.map((value, index) => (
              { x: parseInt(index), y: parseFloat(value) }
            ))
          }]
        }

        options.mutationSignal = {
          title: {
            text: "Mutation Signal"
          },
          data: [{
            type: "spline",
            dataPoints: objectList[currentObjectId].mutationSignal.map((value, index) => (
              { x: parseInt(index), y: parseFloat(value) }
            ))
          }]
        }

        options.metabolismSignal = {
          title: {
            text: "Metabolism Signal"
          },
          data: [{
            type: "spline",
            dataPoints: objectList[currentObjectId].metabolismSignal.map((value, index) => (
              { x: parseInt(index), y: parseFloat(value) }
            ))
          }]
        }

        options.moveUpSignal = {
          title: {
            text: "Move Up Signal"
          },
          data: [{
            type: "spline",
            dataPoints: objectList[currentObjectId].moveUpSignal.map((value, index) => (
              { x: parseInt(index), y: parseFloat(value) }
            ))
          }]
        }

        options.moveDownSignal = {
          title: {
            text: "Move Down Signal"
          },
          data: [{
            type: "spline",
            dataPoints: objectList[currentObjectId].moveDownSignal.map((value, index) => (
              { x: parseInt(index), y: parseFloat(value) }
            ))
          }]
        }

        options.moveLeftSignal = {
          title: {
            text: "Move Left Signal"
          },
          data: [{
            type: "spline",
            dataPoints: objectList[currentObjectId].moveLeftSignal.map((value, index) => (
              { x: parseInt(index), y: parseFloat(value) }
            ))
          }]
        }

        options.moveRightSignal = {
          title: {
            text: "Move Right Signal"
          },
          data: [{
            type: "spline",
            dataPoints: objectList[currentObjectId].moveRightSignal.map((value, index) => (
              { x: parseInt(index), y: parseFloat(value) }
            ))
          }]
        }

        options.moveRandomSignal = {
          title: {
            text: "Move Random Signal"
          },
          data: [{
            type: "spline",
            dataPoints: objectList[currentObjectId].moveRandomSignal.map((value, index) => (
              { x: parseInt(index), y: parseFloat(value) }
            ))
          }]
        }
        setOptions(JSON.parse(JSON.stringify(options)))
        setCellInfo(JSON.parse(JSON.stringify(info)))
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

    if (runState == true) {
      setTimeout(() => {
        simulate()
      }, 60000 / simulationSpeed);
    }
   
  }

  var handleUp = () => {
    switch (currentProperty) {
      case "move": {
        if (currentObjectId == undefined || currentObjectId == "-1" || objectList[currentObjectId] == undefined) return
        var rowStart = computeCircularRow((Math.floor(parseInt(currentObjectId) / computeNumber)) * computeNumber - computeNumber)
        var rowEnd = rowStart + computeNumber - 1
        var column = rowStart + parseInt(currentObjectId) % computeNumber
        var futureKey = computeCircularColumn(column, rowStart, rowEnd).toString()
        moveCell(grid, objectList, currentObjectId, futureKey)
        currentObjectId = futureKey
        processDOM(grid, objectList, statistic)
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
          if (grid[futureKey].type == "live") {
            var info = genomeDecoder(objectList[futureKey].genome)
            info.push({
              "distTravelUp": objectList[futureKey].distTravelUp,
              "distTravelDown": objectList[futureKey].distTravelDown,
              "distTravelLeft": objectList[futureKey].distTravelLeft,
              "distTravelRight": objectList[futureKey].distTravelRight,
            })
            info.push({
              "distTravelRand": objectList[futureKey].distTravelRand,
              "replicationCount": objectList[futureKey].replicationCount,
              "mutationCount": objectList[futureKey].mutationCount,
              "metabolismCount": objectList[futureKey].metabolismCount
            })
            options.replicationSignal = {
              title: {
                text: "Replication Signal"
              },
              data: [{
                type: "spline",
                dataPoints: objectList[futureKey].replicationSignal.map((value, index) => (
                  { x: parseInt(index), y: parseFloat(value) }
                ))
              }]
            }

            options.mutationSignal = {
              title: {
                text: "Mutation Signal"
              },
              data: [{
                type: "spline",
                dataPoints: objectList[futureKey].mutationSignal.map((value, index) => (
                  { x: parseInt(index), y: parseFloat(value) }
                ))
              }]
            }

            options.metabolismSignal = {
              title: {
                text: "Metabolism Signal"
              },
              data: [{
                type: "spline",
                dataPoints: objectList[futureKey].metabolismSignal.map((value, index) => (
                  { x: parseInt(index), y: parseFloat(value) }
                ))
              }]
            }

            options.moveUpSignal = {
              title: {
                text: "Move Up Signal"
              },
              data: [{
                type: "spline",
                dataPoints: objectList[futureKey].moveUpSignal.map((value, index) => (
                  { x: parseInt(index), y: parseFloat(value) }
                ))
              }]
            }

            options.moveDownSignal = {
              title: {
                text: "Move Down Signal"
              },
              data: [{
                type: "spline",
                dataPoints: objectList[futureKey].moveDownSignal.map((value, index) => (
                  { x: parseInt(index), y: parseFloat(value) }
                ))
              }]
            }

            options.moveLeftSignal = {
              title: {
                text: "Move Left Signal"
              },
              data: [{
                type: "spline",
                dataPoints: objectList[futureKey].moveLeftSignal.map((value, index) => (
                  { x: parseInt(index), y: parseFloat(value) }
                ))
              }]
            }

            options.moveRightSignal = {
              title: {
                text: "Move Right Signal"
              },
              data: [{
                type: "spline",
                dataPoints: objectList[futureKey].moveRightSignal.map((value, index) => (
                  { x: parseInt(index), y: parseFloat(value) }
                ))
              }]
            }

            options.moveRandomSignal = {
              title: {
                text: "Move Random Signal"
              },
              data: [{
                type: "spline",
                dataPoints: objectList[futureKey].moveRandomSignal.map((value, index) => (
                  { x: parseInt(index), y: parseFloat(value) }
                ))
              }]
            }
            setOptions(JSON.parse(JSON.stringify(options)))
            setCellInfo(JSON.parse(JSON.stringify(info)))
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

    switch (currentProperty) {
      case "move": {
        if (currentObjectId == undefined || currentObjectId == "-1" || objectList[currentObjectId] == undefined) return
        var rowStart = computeCircularRow((Math.floor(parseInt(currentObjectId) / computeNumber)) * computeNumber + computeNumber)
        var rowEnd = rowStart + computeNumber - 1
        var column = rowStart + parseInt(currentObjectId) % computeNumber
        var futureKey = computeCircularColumn(column, rowStart, rowEnd).toString()
        moveCell(grid, objectList, currentObjectId, futureKey)
        currentObjectId = futureKey
        processDOM(grid, objectList, statistic)
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
          if (grid[futureKey].type == "live") {
            var info = genomeDecoder(objectList[futureKey].genome)
            info.push({
              "distTravelUp": objectList[futureKey].distTravelUp,
              "distTravelDown": objectList[futureKey].distTravelDown,
              "distTravelLeft": objectList[futureKey].distTravelLeft,
              "distTravelRight": objectList[futureKey].distTravelRight,
            })
            info.push({
              "distTravelRand": objectList[futureKey].distTravelRand,
              "replicationCount": objectList[futureKey].replicationCount,
              "mutationCount": objectList[futureKey].mutationCount,
              "metabolismCount": objectList[futureKey].metabolismCount
            })
            options.replicationSignal = {
              title: {
                text: "Replication Signal"
              },
              data: [{
                type: "spline",
                dataPoints: objectList[futureKey].replicationSignal.map((value, index) => (
                  { x: parseInt(index), y: parseFloat(value) }
                ))
              }]
            }

            options.mutationSignal = {
              title: {
                text: "Mutation Signal"
              },
              data: [{
                type: "spline",
                dataPoints: objectList[futureKey].mutationSignal.map((value, index) => (
                  { x: parseInt(index), y: parseFloat(value) }
                ))
              }]
            }

            options.metabolismSignal = {
              title: {
                text: "Metabolism Signal"
              },
              data: [{
                type: "spline",
                dataPoints: objectList[futureKey].metabolismSignal.map((value, index) => (
                  { x: parseInt(index), y: parseFloat(value) }
                ))
              }]
            }

            options.moveUpSignal = {
              title: {
                text: "Move Up Signal"
              },
              data: [{
                type: "spline",
                dataPoints: objectList[futureKey].moveUpSignal.map((value, index) => (
                  { x: parseInt(index), y: parseFloat(value) }
                ))
              }]
            }

            options.moveDownSignal = {
              title: {
                text: "Move Down Signal"
              },
              data: [{
                type: "spline",
                dataPoints: objectList[futureKey].moveDownSignal.map((value, index) => (
                  { x: parseInt(index), y: parseFloat(value) }
                ))
              }]
            }

            options.moveLeftSignal = {
              title: {
                text: "Move Left Signal"
              },
              data: [{
                type: "spline",
                dataPoints: objectList[futureKey].moveLeftSignal.map((value, index) => (
                  { x: parseInt(index), y: parseFloat(value) }
                ))
              }]
            }

            options.moveRightSignal = {
              title: {
                text: "Move Right Signal"
              },
              data: [{
                type: "spline",
                dataPoints: objectList[futureKey].moveRightSignal.map((value, index) => (
                  { x: parseInt(index), y: parseFloat(value) }
                ))
              }]
            }

            options.moveRandomSignal = {
              title: {
                text: "Move Random Signal"
              },
              data: [{
                type: "spline",
                dataPoints: objectList[futureKey].moveRandomSignal.map((value, index) => (
                  { x: parseInt(index), y: parseFloat(value) }
                ))
              }]
            }
            setOptions(JSON.parse(JSON.stringify(options)))
            setCellInfo(JSON.parse(JSON.stringify(info)))
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
    
    switch (currentProperty) {
      case "move": {
        if (currentObjectId == undefined || currentObjectId == "-1" || objectList[currentObjectId] == undefined) return
        var rowStart = computeCircularRow((Math.floor(parseInt(currentObjectId) / computeNumber)) * computeNumber)
        var rowEnd = rowStart + computeNumber - 1
        var column = rowStart + parseInt(currentObjectId) % computeNumber - 1
        var futureKey = computeCircularColumn(column, rowStart, rowEnd).toString()
        moveCell(grid, objectList, currentObjectId, futureKey)
        currentObjectId = futureKey
        processDOM(grid, objectList, statistic)
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
          if (grid[futureKey].type == "live") {
            var info = genomeDecoder(objectList[futureKey].genome)
            info.push({
              "distTravelUp": objectList[futureKey].distTravelUp,
              "distTravelDown": objectList[futureKey].distTravelDown,
              "distTravelLeft": objectList[futureKey].distTravelLeft,
              "distTravelRight": objectList[futureKey].distTravelRight,
            })
            info.push({
              "distTravelRand": objectList[futureKey].distTravelRand,
              "replicationCount": objectList[futureKey].replicationCount,
              "mutationCount": objectList[futureKey].mutationCount,
              "metabolismCount": objectList[futureKey].metabolismCount
            })
            options.replicationSignal = {
              title: {
                text: "Replication Signal"
              },
              data: [{
                type: "spline",
                dataPoints: objectList[futureKey].replicationSignal.map((value, index) => (
                  { x: parseInt(index), y: parseFloat(value) }
                ))
              }]
            }

            options.mutationSignal = {
              title: {
                text: "Mutation Signal"
              },
              data: [{
                type: "spline",
                dataPoints: objectList[futureKey].mutationSignal.map((value, index) => (
                  { x: parseInt(index), y: parseFloat(value) }
                ))
              }]
            }

            options.ionSignal = {
              title: {
                text: "Metabolism Signal"
              },
              data: [{
                type: "spline",
                dataPoints: objectList[futureKey].metabolismSignal.map((value, index) => (
                  { x: parseInt(index), y: parseFloat(value) }
                ))
              }]
            }

            options.moveUpSignal = {
              title: {
                text: "Move Up Signal"
              },
              data: [{
                type: "spline",
                dataPoints: objectList[futureKey].moveUpSignal.map((value, index) => (
                  { x: parseInt(index), y: parseFloat(value) }
                ))
              }]
            }

            options.moveDownSignal = {
              title: {
                text: "Move Down Signal"
              },
              data: [{
                type: "spline",
                dataPoints: objectList[futureKey].moveDownSignal.map((value, index) => (
                  { x: parseInt(index), y: parseFloat(value) }
                ))
              }]
            }

            options.moveLeftSignal = {
              title: {
                text: "Move Left Signal"
              },
              data: [{
                type: "spline",
                dataPoints: objectList[futureKey].moveLeftSignal.map((value, index) => (
                  { x: parseInt(index), y: parseFloat(value) }
                ))
              }]
            }

            options.moveRightSignal = {
              title: {
                text: "Move Right Signal"
              },
              data: [{
                type: "spline",
                dataPoints: objectList[futureKey].moveRightSignal.map((value, index) => (
                  { x: parseInt(index), y: parseFloat(value) }
                ))
              }]
            }

            options.moveRandomSignal = {
              title: {
                text: "Move Random Signal"
              },
              data: [{
                type: "spline",
                dataPoints: objectList[futureKey].moveRandomSignal.map((value, index) => (
                  { x: parseInt(index), y: parseFloat(value) }
                ))
              }]
            }
            setOptions(JSON.parse(JSON.stringify(options)))
            setCellInfo(JSON.parse(JSON.stringify(info)))
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
    switch (currentProperty) {
      case "move": {
        if (currentObjectId == undefined || currentObjectId == "-1" || objectList[currentObjectId] == undefined) return
        var rowStart = computeCircularRow((Math.floor(parseInt(currentObjectId) / computeNumber)) * computeNumber)
        var rowEnd = rowStart + computeNumber - 1
        var column = rowStart + parseInt(currentObjectId) % computeNumber + 1
        var futureKey = computeCircularColumn(column, rowStart, rowEnd).toString()
        moveCell(grid, objectList, currentObjectId, futureKey)
        currentObjectId = futureKey
        processDOM(grid, objectList, statistic)
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
          if (grid[futureKey].type == "live") {
            var info = genomeDecoder(objectList[futureKey].genome)
            info.push({
              "distTravelUp": objectList[futureKey].distTravelUp,
              "distTravelDown": objectList[futureKey].distTravelDown,
              "distTravelLeft": objectList[futureKey].distTravelLeft,
              "distTravelRight": objectList[futureKey].distTravelRight,
            })
            info.push({
              "distTravelRand": objectList[futureKey].distTravelRand,
              "replicationCount": objectList[futureKey].replicationCount,
              "mutationCount": objectList[futureKey].mutationCount,
              "metabolismCount": objectList[futureKey].metabolismCount
            })
            options.replicationSignal = {
              title: {
                text: "Replication Signal"
              },
              data: [{
                type: "spline",
                dataPoints: objectList[futureKey].replicationSignal.map((value, index) => (
                  { x: parseInt(index), y: parseFloat(value) }
                ))
              }]
            }

            options.mutationSignal = {
              title: {
                text: "Mutation Signal"
              },
              data: [{
                type: "spline",
                dataPoints: objectList[futureKey].mutationSignal.map((value, index) => (
                  { x: parseInt(index), y: parseFloat(value) }
                ))
              }]
            }

            options.metabolismSignal = {
              title: {
                text: "Metabolism Signal"
              },
              data: [{
                type: "spline",
                dataPoints: objectList[futureKey].metabolismSignal.map((value, index) => (
                  { x: parseInt(index), y: parseFloat(value) }
                ))
              }]
            }

            options.moveUpSignal = {
              title: {
                text: "Move Up Signal"
              },
              data: [{
                type: "spline",
                dataPoints: objectList[futureKey].moveUpSignal.map((value, index) => (
                  { x: parseInt(index), y: parseFloat(value) }
                ))
              }]
            }

            options.moveDownSignal = {
              title: {
                text: "Move Down Signal"
              },
              data: [{
                type: "spline",
                dataPoints: objectList[futureKey].moveDownSignal.map((value, index) => (
                  { x: parseInt(index), y: parseFloat(value) }
                ))
              }]
            }

            options.moveLeftSignal = {
              title: {
                text: "Move Left Signal"
              },
              data: [{
                type: "spline",
                dataPoints: objectList[futureKey].moveLeftSignal.map((value, index) => (
                  { x: parseInt(index), y: parseFloat(value) }
                ))
              }]
            }

            options.moveRightSignal = {
              title: {
                text: "Move Right Signal"
              },
              data: [{
                type: "spline",
                dataPoints: objectList[futureKey].moveRightSignal.map((value, index) => (
                  { x: parseInt(index), y: parseFloat(value) }
                ))
              }]
            }

            options.moveRandomSignal = {
              title: {
                text: "Move Random Signal"
              },
              data: [{
                type: "spline",
                dataPoints: objectList[futureKey].moveRandomSignal.map((value, index) => (
                  { x: parseInt(index), y: parseFloat(value) }
                ))
              }]
            }
            setOptions(JSON.parse(JSON.stringify(options)))
            setCellInfo(JSON.parse(JSON.stringify(info)))
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
      case "+": {
        if (genomePanel.current.hidden == false) {
          genomePanel.current.hidden = true
          writeMode = false
        } else {
          genomePanel.current.hidden = false
          writeMode = true
        }
        break
      }
      case "-": {
        if (initPanel.current.hidden == true) {
          initPanel.current.hidden = false
          writeMode = true

        } else {
          initPanel.current.hidden = true
          writeMode = false
        }
        break
      }
      case "i": {
        if (writeMode == false) {
          if (negate == false) {
            negate = true
          }
        }
        break
      }
      case "0": {
        if(writeMode == false) {
          if (controlTable.current.hidden == true) {
            controlTable.current.hidden = false
          } else {
            controlTable.current.hidden = true
          }
        }
        break
      }
      case "1": {
        if (writeMode == false) {
          if (runState == false) {
            runState = true
            simulate()
          } else {
            runState = false
          }
        }
        break
      }
      case "2": {
        if (writeMode == false) {
          runState = false
          initGen()
        }
        break
      }
      case "3": {
        if (writeMode == false) {
          runState = false
          nextGen()
        }
        break
      }
      case "4": {
        if(writeMode == false) {
          if (cellTypePanel.current.hidden == true) {
            cellTypePanel.current.hidden = false
            selectTarget = currentKey
          } else {
            cellTypePanel.current.hidden = true
          }
        }
        break
      }
      case "5": {
        if(writeMode == false) {
          if (grid[currentKey].type != "empty") {
            grid[currentKey].color = "black"
            statistic[grid[currentKey].type]--
            if (statistic[grid[currentKey].type] == 0) delete statistic[grid[currentKey].type]
            setStateStatistic(JSON.parse(JSON.stringify(statistic)))
            grid[currentKey].type = "empty"
            var cell = document.getElementById(currentKey)
            cell.style.backgroundColor = "black"
            delete objectList[currentKey]
            currentObjectId = undefined
          }
        }
         break
      }
      case "6": {
        if (writeMode == false) {
          if (currentProperty == null) {
            currentProperty = "move"
          }
        }
        break
      }
      case "7": {
        if (writeMode == false) {
          if (currentProperty == null) {
            currentProperty = "selectRadius"
            radiusPanel.current.hidden = false
          } else {
            radiusPanel.current.hidden = true
            currentProperty = null
          }
        }
        break
      } 
      case "n": {
        if (writeMode == false) {
          if (infoPanel.current.hidden == false) {
            infoPanel.current.hidden = true
          } else {
            infoPanel.current.hidden = false
          }
        }
        break
      }
      case "m": {
        if (writeMode == false) {
          if (cellInfoPanel.current.hidden == false) {
            cellInfoPanel.current.hidden = true
          } else {
            cellInfoPanel.current.hidden = false
          }
        }
        break
      }
      case "u": {
        if(writeMode == false) {
          runState = false
          sceneUpload()
        }
      } break
      case "d": {
        if (writeMode == false) {
          runState = false
          sceneDownload()
        }
      } break
      case "ArrowUp": {
        if (currentKey != null && writeMode == false) {
          runState = false
          handleUp()
        }
      } break
      case "ArrowLeft": {
        if (currentKey != null && writeMode == false) {
          runState = false
          handleLeft()
        }
      } break
      case "ArrowRight": {
        if (currentKey != null && writeMode == false) {
          runState = false
          handleRight()
        }
      } break
      case "ArrowDown": {
        if (currentKey != null && writeMode == false) {
          runState = false
          handleDown()
        }
      } break
    }
  }

  var onKeyUp = (event) => {
    switch(event.key) {
      case "6": {
        currentProperty = null
        break
      }
      case "i": {
        negate = false
        break
      }
    }

    if (objectList[currentObjectId] != undefined) {
      if (grid[currentObjectId].type == "live") {
        var info = genomeDecoder(objectList[currentObjectId].genome)
        info.push({
          "distTravelUp": objectList[currentObjectId].distTravelUp,
          "distTravelDown": objectList[currentObjectId].distTravelDown,
          "distTravelLeft": objectList[currentObjectId].distTravelLeft,
          "distTravelRight": objectList[currentObjectId].distTravelRight,
        })
        info.push({
          "distTravelRand": objectList[currentObjectId].distTravelRand,
          "replicationCount": objectList[currentObjectId].replicationCount,
          "mutationCount": objectList[currentObjectId].mutationCount,
          "metabolismCount": objectList[currentObjectId].metabolismCount
        })
        options.replicationSignal = {
          title: {
            text: "Replication Signal"
          },
          data: [{
            type: "spline",
            dataPoints: objectList[currentObjectId].replicationSignal.map((value, index) => (
              { x: parseInt(index), y: parseFloat(value) }
            ))
          }]
        }

        options.mutationSignal = {
          title: {
            text: "Mutation Signal"
          },
          data: [{
            type: "spline",
            dataPoints: objectList[currentObjectId].mutationSignal.map((value, index) => (
              { x: parseInt(index), y: parseFloat(value) }
            ))
          }]
        }

        options.metabolismSignal = {
          title: {
            text: "Metabolism Signal"
          },
          data: [{
            type: "spline",
            dataPoints: objectList[currentObjectId].metabolismSignal.map((value, index) => (
              { x: parseInt(index), y: parseFloat(value) }
            ))
          }]
        }

        options.moveUpSignal = {
          title: {
            text: "Move Up Signal"
          },
          data: [{
            type: "spline",
            dataPoints: objectList[currentObjectId].moveUpSignal.map((value, index) => (
              { x: parseInt(index), y: parseFloat(value) }
            ))
          }]
        }

        options.moveDownSignal = {
          title: {
            text: "Move Down Signal"
          },
          data: [{
            type: "spline",
            dataPoints: objectList[currentObjectId].moveDownSignal.map((value, index) => (
              { x: parseInt(index), y: parseFloat(value) }
            ))
          }]
        }

        options.moveLeftSignal = {
          title: {
            text: "Move Left Signal"
          },
          data: [{
            type: "spline",
            dataPoints: objectList[currentObjectId].moveLeftSignal.map((value, index) => (
              { x: parseInt(index), y: parseFloat(value) }
            ))
          }]
        }

        options.moveRightSignal = {
          title: {
            text: "Move Right Signal"
          },
          data: [{
            type: "spline",
            dataPoints: objectList[currentObjectId].moveRightSignal.map((value, index) => (
              { x: parseInt(index), y: parseFloat(value) }
            ))
          }]
        }

        options.moveRandomSignal = {
          title: {
            text: "Move Random Signal"
          },
          data: [{
            type: "spline",
            dataPoints: objectList[currentObjectId].moveRandomSignal.map((value, index) => (
              { x: parseInt(index), y: parseFloat(value) }
            ))
          }]
        }
        setOptions(JSON.parse(JSON.stringify(options)))
        setCellInfo(JSON.parse(JSON.stringify(info)))
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
      
        var info = genomeDecoder(objectList[event.target.id].genome)
        info.push({
          "distTravelUp": objectList[event.target.id].distTravelUp,
          "distTravelDown": objectList[event.target.id].distTravelDown,
          "distTravelLeft": objectList[event.target.id].distTravelLeft,
          "distTravelRight": objectList[event.target.id].distTravelRight,
        })
        info.push({
          "distTravelRand": objectList[event.target.id].distTravelRand,
          "replicationCount": objectList[event.target.id].replicationCount,
          "mutationCount": objectList[event.target.id].mutationCount,
          "metabolismCount": objectList[event.target.id].metabolismCount
        })

        options.replicationSignal = {
          title: {
            text: "Replication Signal"
          },
          data: [{
            type: "spline",
            dataPoints: objectList[event.target.id].replicationSignal.map((value, index) => (
              { x: parseInt(index), y: parseFloat(value) }
            ))
          }]
        }

        options.mutationSignal = {
          title: {
            text: "Mutation Signal"
          },
          data: [{
            type: "spline",
            dataPoints: objectList[event.target.id].mutationSignal.map((value, index) => (
              { x: parseInt(index), y: parseFloat(value) }
            ))
          }]
        }

        options.metabolismSignal = {
          title: {
            text: "Metabolism Signal"
          },
          data: [{
            type: "spline",
            dataPoints: objectList[event.target.id].metabolismSignal.map((value, index) => (
              { x: parseInt(index), y: parseFloat(value) }
            ))
          }]
        }

        options.moveUpSignal = {
          title: {
            text: "Move Up Signal"
          },
          data: [{
            type: "spline",
            dataPoints: objectList[event.target.id].moveUpSignal.map((value, index) => (
              { x: parseInt(index), y: parseFloat(value) }
            ))
          }]
        }

        options.moveDownSignal = {
          title: {
            text: "Move Down Signal"
          },
          data: [{
            type: "spline",
            dataPoints: objectList[event.target.id].moveDownSignal.map((value, index) => (
              { x: parseInt(index), y: parseFloat(value) }
            ))
          }]
        }

        options.moveLeftSignal = {
          title: {
            text: "Move Left Signal"
          },
          data: [{
            type: "spline",
            dataPoints: objectList[event.target.id].moveLeftSignal.map((value, index) => (
              { x: parseInt(index), y: parseFloat(value) }
            ))
          }]
        }

        options.moveRightSignal = {
          title: {
            text: "Move Right Signal"
          },
          data: [{
            type: "spline",
            dataPoints: objectList[event.target.id].moveRightSignal.map((value, index) => (
              { x: parseInt(index), y: parseFloat(value) }
            ))
          }]
        }

        options.moveRandomSignal = {
          title: {
            text: "Move Random Signal"
          },
          data: [{
            type: "spline",
            dataPoints: objectList[event.target.id].moveRandomSignal.map((value, index) => (
              { x: parseInt(index), y: parseFloat(value) }
            ))
          }]
        }

        setOptions(JSON.parse(JSON.stringify(options)))
        setCellInfo(JSON.parse(JSON.stringify(info)))
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
    if (statistic[grid[selectTarget].type] == undefined) statistic[grid[selectTarget].type] = 0
    if (statistic["deathList"] == undefined) statistic["deathList"] = []
    statistic[grid[selectTarget].type]++
    setStateStatistic(JSON.parse(JSON.stringify(statistic)))
  }

  var onSequenceChange = (event) => {
    geneSequence = event.target.value
    console.log(geneSequence)
  }

  var onDelete = (event) => {
    delete initList[event.target.id]
    setInitList(JSON.parse(JSON.stringify(initList)))
  }

  var onValueChange = (event) => {
    initList[event.target.id] = event.target.value
    setInitList(JSON.parse(JSON.stringify(initList)))
  }

  var onAdd = (event) => {
    if (event.target.value != "empty") {
      initList[event.target.value] = 0
      setInitList(JSON.parse(JSON.stringify(initList)))
    }
  }

  useEffect(() => {

    //var x = liveProperties("white", geneSequence)
    //console.log(x)
    //console.log(genomeDecoder(x.genome))
    //console.log(genomeMutator(x.genome))

    infoPanel.current.hidden = true
    cellInfoPanel.current.hidden = true
    controlTable.current.hidden = true
    cellTypePanel.current.hidden = true
    upload.current.hidden = true
    radiusPanel.current.hidden = true
    genomePanel.current.hidden = true
    initPanel.current.hidden = true
    writeMode = false

    initGen()

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
      <div tabIndex={0} ref={upload} style={uploadStyle} className="custom-file">
        <input type="file" className="custom-file-input" id="uploadScene" onChange={onUpload}></input>
        <label className="custom-file-label" htmlFor="uploadScene">Upload Scene</label>
      </div>
      <div tabIndex={0} onKeyDown={onKeyDown} ref={genomePanel} class="form-group" style={uploadStyle}>
        <label><b>GenomeSequence</b></label>
        <input placeholder={geneSequence} type="text" class="form-control" onChange={onSequenceChange}></input>
      </div>
      <table tabIndex={0} onKeyDown={onKeyDown} ref={infoPanel} style={infoPanelStyle} className="table">
        <thead className="thead-dark">
          <tr>
            <th scope="col">Information</th>
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
          <tr>
            {options.mutationSignal != undefined && cellInfo.charge == undefined && <td colSpan="4">
              <CanvasJSChart options={options.mutationSignal}
              />
            </td>}
          </tr>
          <tr>
            {options.mutationSignal != undefined && cellInfo.charge == undefined && <td colSpan="4">
              <CanvasJSChart options={options.replicationSignal}
              />
            </td>}
          </tr>
          <tr>
            {options.metabolismSignal != undefined && cellInfo.charge == undefined && <td colSpan="4">
              <CanvasJSChart options={options.metabolismSignal}
              />
            </td>}
          </tr>
          <tr>
            {options.moveUpSignal != undefined && cellInfo.charge == undefined && <td colSpan="4">
              <CanvasJSChart options={options.moveUpSignal}
              />
            </td>}
          </tr>
          <tr>
            {options.moveDownSignal != undefined && cellInfo.charge == undefined && <td colSpan="4">
              <CanvasJSChart options={options.moveDownSignal}
              />
            </td>}
          </tr>
          <tr>
            {options.moveLeftSignal != undefined && cellInfo.charge == undefined && <td colSpan="4">
              <CanvasJSChart options={options.moveLeftSignal}
              />
            </td>}
          </tr>
          <tr>
            {options.moveRightSignal != undefined && cellInfo.charge == undefined && <td colSpan="4">
              <CanvasJSChart options={options.moveRightSignal}
              />
            </td>}
          </tr>
          <tr>
            {options.moveRandomSignal != undefined && cellInfo.charge == undefined && <td colSpan="4">
              <CanvasJSChart options={options.moveRandomSignal}
              />
            </td>}
          </tr>
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
          <tr>
            <td>Add Cell </td>
            <td>4</td>
          </tr>
          <tr>
            <td>Remove Cell </td>
            <td>5</td>
          </tr>
          <tr>
            <td>Move Cell Upward </td>
            <td>6(Hold) + ArrowUp</td>
          </tr>
          <tr>
            <td>Move Cell Downward </td>
            <td>6(Hold) + ArrowDown</td>
          </tr>
          <tr>
            <td>Move Cell Leftward </td>
            <td>6(Hold) + ArrowLeft</td>
          </tr>
          <tr>
            <td>Move Cell Rightward </td>
            <td>6(Hold) + ArrowRight</td>
          </tr>
          <tr>
            <td>Increase Top Select Radius </td>
            <td>7(Hold) + ArrowUp</td>
          </tr>
          <tr>
            <td>Increase Bottom Select Radius </td>
            <td>7(Hold) + ArrowDown</td>
          </tr>
          <tr>
            <td>Increase Left Select Radius </td>
            <td>7(Hold) + ArrowLeft</td>
          </tr>
          <tr>
            <td>Increase Right Select Radius </td>
            <td>7(Hold) + ArrowRight</td>
          </tr>
          <tr>
            <td>Decrease Top Select Radius </td>
            <td>7(Hold) + i(Hold) +  ArrowUp</td>
          </tr>
          <tr>
            <td>Decrease Bottom Select Radius </td>
            <td>7(Hold) + i(Hold) + ArrowDown</td>
          </tr>
          <tr>
            <td>Decrease Left Select Radius </td>
            <td>7(Hold) + i(Hold) + ArrowLeft</td>
          </tr>
          <tr>
            <td>Decrease Right Select Radius </td>
            <td>7(Hold) + i(Hold) + ArrowRight</td>
          </tr>
          <tr>
            <td>Genome Editor (Init/NextGen) </td>
            <td>+(Toggle)</td>
          </tr>
          <tr>
            <td>Init List Editor (Init/NextGen) </td>
            <td>-(Toggle)</td>
          </tr>
          <tr>
            <td>Init List Editor (Init/NextGen) </td>
            <td>m(Toggle)</td>
          </tr>
          <tr>
            <td>Init List Editor (Init/NextGen) </td>
            <td>n(Toggle)</td>
          </tr>
          <tr>
            <td>Move Cursor(Red) Up </td>
            <td>ArrowUp</td>
          </tr>
          <tr>
            <td>Move Cursor(Red) Down </td>
            <td>ArrowDown</td>
          </tr>
          <tr>
            <td>Move Cursor(Red) Left</td>
            <td>ArrowLeft</td>
          </tr>
          <tr>
            <td>Move Cursor(Red) Right </td>
            <td>ArrowRight</td>
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
        {cellTypes.map((item) => (
          <option key={item} value={item}>{item}</option>
        ))
        }</select>
      <div style={uploadStyle} tabIndex={0} onKeyDown={onKeyDown} ref={initPanel}>
        <select style={selectStyle2} className="form-control form-select" onChange={onAdd}>
          {cellTypes.map((item) => (
            <option key={item} value={item}>{item}</option>
          ))
          }</select>
        <table className="table">
          <tbody className="table-light">
            {Object.keys(initList).map((key) => (
              <tr key={key}>
                <td>{key}</td>
                <td><input id={key} type="text" onChange={onValueChange}></input></td>
                <td><a onClick={onDelete}><i id={key} className="fas fa-trash col-6"></i></a></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
