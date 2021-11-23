const { groundProperties } = require("./atom")

var cellTypes = [
    "empty",
    "live",
    "hydrogen",
    "carbon",
    "nitrogen",
    "oxygen",
    "fluorine",
    "sodium",
    "magnesium",
    "silicon",
    "phosphorus",
    "sulphur",
    "chlorine",
    "potassium",
    "calcium",
    "bromine",
    "iodine"
]

var cellProperties = {
    "empty": {color: "#000000", type: "empty"},
    "live": { color: "#ffffff", type: "live"},
    "hydrogen": groundProperties(1, 0, "#66b3ff"),
    "carbon": groundProperties(6, 6, "#66ffff"),
    "nitrogen": groundProperties(7, 7, "#8cd9b3"),
    "oxygen": groundProperties(8, 8, "#c266ff"),
    "fluorine": groundProperties(9, 19, "#66ff66"),
    "sodium": groundProperties(11, 12, "#a3a3c2"),
    "magnesium": groundProperties(12, 12, "#ffff66"),
    "silicon": groundProperties(14, 14, "#cccc99"),
    "phosphorus": groundProperties(15, 16, "#d9b38c"),
    "sulphur": groundProperties(16, 16, "#d98c8c"),
    "chlorine": groundProperties(17, 18, "#ff6666"),
    "potassium": groundProperties(19, 39, "#ff9966"),
    "calcium": groundProperties(20, 20, "#ffcc66"),
    "bromine": groundProperties(35, 45, "#ff66b3"),
    "iodine": groundProperties(53, 74, "#ff66ff")
}

module.exports = {
    cellTypes: cellTypes,
    getProperties: (type) => { return JSON.parse(JSON.stringify(cellProperties[type]))}
}