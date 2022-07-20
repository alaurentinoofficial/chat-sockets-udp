const UdpManager = require('../utils/udp_manager');
const { marshaller, unmarshaller } = require('../utils/encoding')

const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let CalcOperations = {
    "+": (a, b) => a + b,
    "-": (a, b) => a - b,
    "*": (a, b) => a * b,
    "/": (a, b) => a / b,
}

function calculation(payload) {
    try {
        if(Object.keys(CalcOperations).includes(payload.operation)) {
            result = CalcOperations[payload.operation](Number(payload.n1), Number(payload.n2));

            socket.write(marshaller({
                result,
                calculation: payload
            }));
        }
    } catch (e) { console.error(e) }
}

function CalculateController(payload) {
    if(Number(payload.n1) == NaN || Number(payload.n2) == NaN) {
        return {
            status: "ERROR",
            body: {message: `One of the parameters cannot be cast as integer "n1":${Number(payload.n1)}, "n2":${Number(payload.n2)}`}
        }
    }

    if(Object.keys(CalcOperations).includes(payload.operation)) {
        result = CalcOperations[payload.operation](Number(payload.n1), Number(payload.n2));

        return {
            status: "OK",
            body: {result: result, calculation: payload},
        };
    } else {
        return {
            status: "ERROR",
            body: {message: `Invalid operation "${payload.operation}"`}
        }
    }
}

UdpManager((socket) => {
    socket.onMessage((data) => {
        let payload = unmarshaller(data.toString());
        let response = CalculateController(payload);

        socket.write(marshaller(response));
    });
}).bind(4040);