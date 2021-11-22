module.exports = {
    processGrid: (message) => {
        var grid = message.grid
        var objectList = message.objectList
        
        /*Object.keys(grid).map((key) => {
            if (grid[key].color == "black") {
                grid[key].color = "green"
            } else {
                grid[key].color = "black"
            }
        })*/

        Object.keys(objectList).map((key) => {
            
        })

        return {
            "grid": grid,
            "objectList": objectList
        }
    }
}