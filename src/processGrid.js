module.exports = {
    processGrid: (e) => {

        var grid = e.grid
        var objectList = e.objectList
        var statistic = e.statistic

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

        return {
            "grid": grid,
            "objectList": objectList,
            "statistic": statistic
        }
    }
}