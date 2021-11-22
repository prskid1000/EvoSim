self.onmessage = function (message) {
    postMessage(eval(message.data.function)(message.data.args))
}