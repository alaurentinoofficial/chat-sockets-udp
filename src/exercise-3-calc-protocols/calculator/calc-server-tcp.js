const net = require("net");
const { marshaller, unmarshaller } = require('../utils/encoding')
const { CalculatorInvokeHandler } = require("./server_invoke_handler")

net.createServer(function (socket) {
    socket.on('data', (data) => {
        let payload = unmarshaller(data.toString());
        let response = CalculatorInvokeHandler(payload);

        socket.write(marshaller(response));
    });
})
.listen(4040);