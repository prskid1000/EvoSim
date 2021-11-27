module.exports = {
    processDOM: (e) => {
        Object.keys(e).map((key) => {
            var cell = document.getElementById(key)
            cell.style.backgroundColor = e[key].color
        })
    }
}
