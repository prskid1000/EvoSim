importScripts("live.js")
importScripts("atom.js")
importScripts("cellUtility.js")
importScripts("cellType.js")
importScripts("atomProcessor.js")
importScripts("emptyProcessor.js")
importScripts("liveProcessor.js")
self.onmessage = (message) => {
    postMessage(eval("(message)" + message.data.statement.substring(7))(message.data.args))
}