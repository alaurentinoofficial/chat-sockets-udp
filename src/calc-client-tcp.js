const net = require("net");

const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const socket = net.Socket();
socket.connect(4040);

socket.on('data', (data) => {
    try {
        let p = JSON.parse(data.toString())
        console.log(`The result of ${p.calculation.n1}${p.calculation.operation}${p.calculation.n2}: ${p.result}`);
    } catch (e) {console.log(e)}
});

function sendToCalcServer(socket, data) {
    let match = data.match(/^(\d+)([+-\/*])(\d+)$/)

    if(match) {
        let params = match.slice(1, 4);

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