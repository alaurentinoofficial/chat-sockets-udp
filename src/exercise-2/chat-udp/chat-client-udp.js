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
        let payload = JSON.parse(data.toString())
        console.log(`${payload.name}: ${payload.msg}`);
    } catch (e) {}
});

rl.question('What is your name ? ', function (name) {
    (function writeMessage() {
        rl.question('> ', function (msg) {
            socket.write(JSON.stringify({
                name: name,
                msg: msg,
                timestamp: new Date().toISOString()
            }));

            writeMessage();
        });
    })()
});