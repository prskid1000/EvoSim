module.exports = {
    processDOM: (grid, objectList, statistic) => {


        Object.keys(grid).map((key) => {
            var cell = document.getElementById(key)
            cell.style.backgroundColor = grid[key].color
        })

        Object.keys(objectList).map((key) => {
            if(grid[key].type == "live") {
                if (objectList[key].metabolismSignal[objectList[key].metabolismSignal - 1] >= 1) {
                    var cell = document.getElementById(key)
                    cell.style.backgroundColor = "#a89832"
                }
                if (objectList[key].replicationSignal[objectList[key].replicationSignal.length - 1] >= 1) {
                    var cell = document.getElementById(key)
                    cell.style.backgroundColor = "#a85a32"
                }
                if (objectList[key].mutationSignal[objectList[key].mutationSignal.length - 1] >= 1) {
                    var cell = document.getElementById(key)
                    cell.style.backgroundColor = "#a83273"
                }
            }
        })

        statistic.deathList.map((key) => {
            var cell = document.getElementById(key)
            cell.style.backgroundColor = "#695e7a"
        })

        statistic.deathList = []

    }
}
