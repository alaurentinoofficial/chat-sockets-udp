const UdpManager = require('./udp_manager');
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

UdpManager((socket) => {
    socket.onMessage((data) => {
        try {
            let payload = JSON.parse(data.toString())
            console.log(`${payload.name}: ${payload.msg}`);
        } catch (e) {}
    });

    (function writeMessage() {
        rl.question('> ', function (msg) {
            socket.write(JSON.stringify({
                name: "Server",
                msg: msg,
                timestamp: new Date().toISOString()
            }));

            writeMessage();
        });
    })()
}).bind(4040);