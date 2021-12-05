const { atomProcessor } = require("./atomProcessor");
const { emptyProcessor } = require("./emptyProcessor");
const { liveProcessor } = require("./liveProcessor");

module.exports = {
    processGrid: (grid, objectList, statistic) => {

        Object.keys(objectList).map((key) => {
            switch (grid[key].type) {

                case "empty":
                    emptyProcessor(grid, objectList, statistic, key)
                    break;

                case "live":
                    liveProcessor(grid, objectList, statistic, key)
                    break;

                default:
                    atomProcessor(grid, objectList, statistic, key)
                    break
            }
        })
    }
}