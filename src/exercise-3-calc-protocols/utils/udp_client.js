var udp = require('dgram');

module.exports = function(address, port) {
    let udpSocket = udp.createSocket('udp4');

    return {
        write: (data) => {
            udpSocket.send(data, port, address);
        },

        on: (event, cb) => {
            udpSocket.on(event, cb);
        },
    }
}