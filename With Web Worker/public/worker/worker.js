importScripts("live.js")
importScripts("atom.js")
importScripts("cellUtility.js")
importScripts("cellType.js")
importScripts("atomProcessor.js")
importScripts("emptyProcessor.js")
importScripts("liveProcessor.js")
self.onmessage = (message) => {
    var simulate = new Function("message", message.data.statement.substring(11))
    postMessage(simulate(message.data.args))
    //postMessage(eval(message.data.statement)(message.data.args))
}