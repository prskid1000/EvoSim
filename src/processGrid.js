const { atomProcessor } = require("./atomProcessor");
const { liveProcessor } = require("./liveProcessor");

module.exports = {
    processGrid: (grid, objectList, statistic, currentObjectId) => {

        Object.keys(objectList).map((key) => {
            if(objectList[key] != undefined) {
                switch (grid[key].type) {
                    case "empty":
                        break;

                    case "live":
                        var tkey = liveProcessor(grid, objectList, statistic, key)
                        if (currentObjectId == key) {
                            currentObjectId = tkey
                        }
                        break;

                    default:
                        var tkey = atomProcessor(grid, objectList, statistic, key)
                        if (currentObjectId == key) {
                            currentObjectId = tkey
                        }
                        break
                }
            }
        })

        return currentObjectId
    }
}