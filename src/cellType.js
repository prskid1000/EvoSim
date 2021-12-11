const { groundProperties } = require("./atom")
const { liveProperties } = require("./live")

var cellTypes = [
    "empty",
    "live",
    "hydrogen",
    "carbon",
    "nitrogen",
    "oxygen",
]

var cellProperties = {
    "empty": {color: "#000000", type: "empty"},
    "live": {},
    "hydrogen": groundProperties(1, 0, "#66b3ff", "hydrogen"),
    "carbon": groundProperties(6, 12, "#66ffff", "carbon"),
    "nitrogen": groundProperties(7, 14, "#8cd9b3", "nitrogen"),
    "oxygen": groundProperties(8, 16, "#c266ff", "oxygen"),
}

var getProperties = (type, geneSequence) => {
    switch (type) {

        case "live": {
            return liveProperties("#ffffff", geneSequence)
        }

        default: {
            return JSON.parse(JSON.stringify(cellProperties[type]))
        }
    }
}

module.exports = {
    getProperties: getProperties,
    cellTypes: cellTypes
}

