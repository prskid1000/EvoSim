import { useEffect } from "react";
import useWindowDimensions from "./customHooks";

var computeNumber = 128
var threads = navigator.hardwareConcurrency
var simulationRate = 1

var workerGroup = []
for(let i = 0; i < threads; i++) {
  workerGroup.push(new Worker("worker.js"))
}

/*workerGroup[0].postMessage({
  "function": ((value) => {
    return value
  }).toString(),
  "args": "Hello World"
})
workerGroup[0].onmessage = (message) => {
  console.log(message.data)
}*/

var num = []
for(let i = 0; i < computeNumber; i++) {
  num.push(i)
}

function App() {
  var { height, width } = useWindowDimensions();

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

  var onMouseLeave = (event) => {
    event.preventDefault()
    var cell = document.getElementById(event.target.id)
    cell.style.backgroundColor = "black"
  }

  var onClick = (event) => {
    var cell = document.getElementById(event.target.id)
    cell.style.backgroundColor = "green"
  }

  var processCell = (cellId) => {

  }

  useEffect(() => {
    var intervalId = setInterval(() => {
      console.log("hello")
    }, 1000 / simulationRate)

    return () => {
      clearInterval(intervalId)
    }
  })

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
                id={i.toString() + "." + j.toString()}
                key={i.toString() + "." + j.toString()}
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
