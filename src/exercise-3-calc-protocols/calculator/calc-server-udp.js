const UdpManager = require('../utils/udp_manager')
const { marshaller, unmarshaller } = require('../utils/encoding')
const { CalculatorInvokeHandler } = require("./server_invoke_handler")

// Server Invoker
UdpManager((socket) => {
    socket.onMessage((data) => {
        let payload = unmarshaller(data.toString());
        let response = CalculatorInvokeHandler(payload);

        socket.write(marshaller(response));
    });
}).bind(4040);