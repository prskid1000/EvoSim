import { useState } from "react";
import useWindowDimensions from "./customHooks";

var computeNummber = 128

var num = []
for(let i = 0; i < computeNummber; i++) {
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
    height: Math.min(height * 0.99, width * 0.99) / computeNummber,
    width: Math.min(height * 0.99, width * 0.99) / computeNummber,
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
