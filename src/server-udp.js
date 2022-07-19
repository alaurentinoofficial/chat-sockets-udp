var udp = require('dgram');

const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

var socket = udp.createSocket('udp4');

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

function writeMessage(socket, connection) {
    rl.question('> ', function (msg) {
        sendMessage(
            socket,
            connection.port,
            connection.address,
            "Server",
            msg
        );
        writeMessage(socket, connection);
    });
}

function receivedMessage(socket, payload, connection) {
    console.log(`\n[${payload.name}]: ${payload.msg}`);
}

function joinConnection(socket, payload, connection) {
    writeMessage(socket, connection)
}

function Connection(closeCb) {

    let messageListener = (socket, payload, connection) => {}

    return {
        onMessage: (cb) => {
            messageListener = cb;
        },

        sendMessage: (...s) => {
            messageListener(...s)
        },

        close: () => {
            closeCb();
        }
    }
}

socket.on("message", (data,connection) => {
    try {
        let request = JSON.parse(data.toString());

        switch(request.method) {
            case "JOIN":
                joinConnection(socket, request.payload, connection);
                break;
            case "MESSAGE":
                receivedMessage(socket, request.payload, connection);
                break;
            default:
                socket.send(JSON.stringify({
                    method: "ERROR",
                    payload: {
                        code: 0,
                        name: "INVALID_METHOD_TYPE"
                    }
                }), connection.port, connection.address)
                break;
        }
    } catch (e) {
        console.error(e)
        socket.send(JSON.stringify({
            method: "ERROR",
            payload: {
                code: 1,
                name: "INTERNAL_SERVER_ERROR"
            }
        }), connection.port, connection.address)
    }
}).bind(4040);