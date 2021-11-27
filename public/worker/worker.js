importScripts("live.js")
importScripts("atom.js")
importScripts("cellUtility.js")
importScripts("cellType.js")
importScripts("atomProcessor.js")
importScripts("emptyProcessor.js")
importScripts("liveProcessor.js")
self.onmessage = (message) => {
    console.log(message.data.statement.substring(5))
    var simulate = new Function("e", message.data.statement.substring(5))
    postMessage(simulate(message.data.args))
}