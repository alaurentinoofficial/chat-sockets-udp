var udp = require('dgram');

const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

var socket = udp.createSocket('udp4');


function receivedMessage(payload, connection) {
    console.log(`[${payload.name}]: ${payload.msg}`);
}

function sendMessage(socket, port, address, name, message, cb = (err) => {}) {
    socket.send(JSON.stringify({
        method: "MESSAGE",
        payload: {
            name: name,
            msg: message,
            timestamp: new Date().toISOString()
        }
    }), port, address, cb);
}

socket.on("message",(data,connection)=>{
    try {
        let request = JSON.parse(data.toString());

        switch(request.method) {
            case "MESSAGE":
                receivedMessage(request.payload, connection);
                break;
        }
    } catch (e) {}
}).bind(4041);



rl.question('What is your name ? ', function (name) {
    socket.send(JSON.stringify({
        method: "JOIN"
    }), 4040, "localhost", error => {});

    (function writeMessage() {
        rl.question('> ', function (msg) {
            sendMessage(socket, 4040, "localhost", name, msg);
            writeMessage();
        });
    })()
});

rl.on('close', function () {
    socket.destroy();
    console.log('\n[CHAT] Bye!');
    process.exit(0);
});