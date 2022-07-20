const UdpClient = require('../utils/udp_client');
const { marshaller, unmarshaller } = require('../utils/encoding')

const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let socket = UdpClient();
socket.connect("localhost", 4040);

socket.onMessage((data) => {
    try {
        let p = unmarshaller(data.toString())

        console.log(p)

        if(p.status == "ERROR")
            console.error(p);
        else
            console.log(`The result of ${p.body.calculation.n1}${p.body.calculation.operation}${p.body.calculation.n2}: ${p.body.result}`);
    } catch (e) {console.error(e)}
});

function sendToCalcServer(socket, data) {
    let match = data.match(/^(\d+)([+-\/*])(\d+)$/)

    if(match) {
        let params = match.slice(1, 4);

        socket.write(marshaller({
            n1: params[0],
            operation: params[1],
            n2: params[2]
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