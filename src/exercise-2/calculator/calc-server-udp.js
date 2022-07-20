const UdpManager = require('../utils/udp_manager');
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

function calculation(data) {
    try {
        let payload = JSON.parse(data.toString())

        if(Object.keys(CalcOperations).includes(payload.operation)) {
            result = CalcOperations[payload.operation](payload.n1, payload.n2);

            socket.write(JSON.stringify({
                result,
                calculation: payload
            }));
        }
    } catch (e) {}
}

UdpManager((socket) => {
    socket.onMessage((data) => {
        calculation(data);
    });
}).bind(4040);