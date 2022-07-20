var udp = require('dgram');

module.exports = function() {
    let udpSocket = udp.createSocket('udp4');
    udpSocket.bind(3456);

    let connection = null;

    return {
        write: (data) => {
            if(connection)
                udpSocket.send(data, connection.port, connection.address);
        },
        
        connect: (address, port) => {
            connection = {port, address};
        },

        onMessage: (cb) => {
            udpSocket.on("message", cb);
        },
    }
}