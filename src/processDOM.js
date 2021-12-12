module.exports = {
    processDOM: (grid, objectList, statistic, graphStatistic) => {


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

        if(statistic.deathList != undefined){
            statistic.deathList.map((key) => {
                var cell = document.getElementById(key)
                cell.style.backgroundColor = "#695e7a"
            })
            statistic.deathList = []
        }

        graphStatistic["death"].push(statistic["death"])
        graphStatistic["replication"].push(statistic["replication"])
        graphStatistic["mutation"].push(statistic["mutation"])
        graphStatistic["metabolism"].push(statistic["metabolism"])
        graphStatistic["oxygen"].push(statistic["deathList"])
        graphStatistic["carbon"].push(statistic["oxygen"])
        graphStatistic["hydrogen"].push(statistic["carbon"])
        graphStatistic["nitrogen"].push(statistic["hydrogen"])
        graphStatistic["empty"].push(statistic["nitrogen"])

        statistic["death"] = 0
        statistic["replication"] = 0
        statistic["mutation"] = 0
        statistic["metabolism"] = 0

    }
}
