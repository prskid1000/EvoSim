importScripts("atom.js")
importScripts("live.js")

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
    "live": {},
    "hydrogen": groundProperties(1, 0, "#66b3ff", "hydrogen"),
    "carbon": groundProperties(6, 12, "#66ffff", "carbon"),
    "nitrogen": groundProperties(7, 14, "#8cd9b3", "nitrogen"),
    "oxygen": groundProperties(8, 16, "#c266ff", "oxygen"),
    "fluorine": groundProperties(9, 28, "#66ff66", "fluorine"),
    "sodium": groundProperties(11, 23, "#a3a3c2", "sodium"),
    "magnesium": groundProperties(12, 24, "#ffff66", "magnesium"),
    "silicon": groundProperties(14, 28, "#cccc99", "silicon"),
    "phosphorus": groundProperties(15, 31, "#d9b38c", "phosphorus"),
    "sulphur": groundProperties(16, 32, "#d98c8c", "sulphur"),
    "chlorine": groundProperties(17, 35, "#ff6666", "chlorine"),
    "potassium": groundProperties(19, 58, "#ff9966", "potassium"),
    "calcium": groundProperties(20, 40, "#ffcc66", "calcium"),
    "bromine": groundProperties(35, 80, "#ff66b3", "bromine"),
    "iodine": groundProperties(53, 127, "#ff66ff", "iodine")
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

