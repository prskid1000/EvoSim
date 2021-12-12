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
        graphStatistic["oxygen"].push(statistic["oxygen"])
        graphStatistic["carbon"].push(statistic["carbon"])
        graphStatistic["hydrogen"].push(statistic["hydrogen"])
        graphStatistic["nitrogen"].push(statistic["nitrogen"])
        graphStatistic["empty"].push(statistic["empty"])

        if (graphStatistic["death"].length > process.env.REACT_APP_HISTORY_COUNT) {
            graphStatistic["death"].shift()
        }

        if (graphStatistic["replication"].length > process.env.REACT_APP_HISTORY_COUNT) {
            graphStatistic["replication"].shift()
        }

        if (graphStatistic["mutation"].length > process.env.REACT_APP_HISTORY_COUNT) {
            graphStatistic["mutation"].shift()
        }

        if (graphStatistic["metabolism"].length > process.env.REACT_APP_HISTORY_COUNT) {
            graphStatistic["metabolism"].shift()
        }

        if (graphStatistic["oxygen"].length > process.env.REACT_APP_HISTORY_COUNT) {
            graphStatistic["oxygen"].shift()
        }

        if (graphStatistic["carbon"].length > process.env.REACT_APP_HISTORY_COUNT) {
            graphStatistic["carbon"].shift()
        }

        if (graphStatistic["hydrogen"].length > process.env.REACT_APP_HISTORY_COUNT) {
            graphStatistic["hydrogen"].shift()
        }

        if (graphStatistic["nitrogen"].length > process.env.REACT_APP_HISTORY_COUNT) {
            graphStatistic["nitrogen"].shift()
        }

        if (graphStatistic["empty"].length > process.env.REACT_APP_HISTORY_COUNT) {
            graphStatistic["empty"].shift()
        }

        statistic["death"] = 0
        statistic["replication"] = 0
        statistic["mutation"] = 0
        statistic["metabolism"] = 0

    }
}
