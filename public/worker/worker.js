importScripts("live.js")
importScripts("atom.js")
importScripts("cellUtility.js")
importScripts("cellType.js")
importScripts("atomProcessor.js")
importScripts("emptyProcessor.js")
importScripts("liveProcessor.js")
self.onmessage = (message) => {
    var simulate = new Function("message", "console.log('hi')")
    postMessage(simulate(message.data.args))
}