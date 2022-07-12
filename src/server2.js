const net = require("net");
const uuid = require('uuid');

entries = {}

net.createServer(function (socket) {
    console.log("connected");

    socket.on('data', function (data) {
        try {
            let payload = JSON.parse(data.toString())
            console.log(`[${payload.name}] ${payload.msg}`);
        } catch (e) {}
    });

    socket.on('close', function () {
        delete entries[socketId];
    });
})
.listen(8080);
