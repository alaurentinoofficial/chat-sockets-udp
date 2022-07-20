const udp = require('dgram');
const UdpClient = require('../utils/udp_client');

const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let socket = UdpClient();
socket.connect("localhost", 4040);

socket.onMessage((data) => {
    try {
        let p = JSON.parse(data.toString())
        console.log(`The result of ${p.calculation.n1}${p.calculation.operation}${p.calculation.n2}: ${p.result}`);
    } catch (e) {}
});

function sendToCalcServer(socket, data) {
    let match = data.match(/^(\d+)([+-\/*])(\d+)$/)

    if(match) {
        let params = match.slice(1, 4);

        console.log({
            n1: params[0],
            operation: params[1],
            n2: params[2]
        })

        socket.write(JSON.stringify({
            n1: Number(params[0]),
            operation: params[1],
            n2: Number(params[2])
        }))
    } else {
        console.error(`[Calc UDP] the typed value "${data}" is invalid`
                      + "\nAvailable operations:"
                      + "\n\tSum: '<number>+<number>'"
                      + "\n\tMinus: '<number>-<number>'"
                      + "\n\tMultiplication: '<number>*<number>'"
                      + "\n\tDivide: '<number>/<number>'\n")
    }
}

(function writeMessage() {
    rl.question('Calculation: ', function (txt) {
        sendToCalcServer(socket, txt);
        writeMessage();
    });
})()