var udp = require('dgram');

function Socket(socketId, udp, conn) {
    let listener = () => {}

    return {
        socketId,

        onMessage: (cb) => { listener = cb; },

        sendMessage: (...s) => { listener(...s); },

        write: (data, cb) => {
            udp.send(data, conn.port, conn.address, cb);
        }
    }
}

function UdpManager(onConnection) {
    
    let open_connections = {}
    let udpSocket = udp.createSocket('udp4');

    function onMessage(data, conn) {
        // let content = data.toJSON();

        socketId = `${conn.address}:${conn.port}`
        
        if (Object.keys(open_connections).includes(socketId)) {
            open_connections[socketId].sendMessage(data);
        } else {
            socket = Socket(socketId, udpSocket, conn)
            open_connections[socketId] = socket

            onConnection(socket);
        }
    }
    
    return {
        bind: (port) => {
            udpSocket.on("message", onMessage).bind(port);
        }
    }
}

module.exports = UdpManager