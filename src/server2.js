const net = require("net");
const SocketManager = require("./socket_manager");

const socketManager = new SocketManager()

net.createServer(function (socket) {
    let socketId = socketManager.addClientConnection(socket);

    console.log(`Connected client ${socketId}`);

    socket.on('data', function (data) {
        socketManager.broadcastMessage(data.toString(), socketId)
    });

    socket.on('close', function () {
        try { socketManager.removeClientConnection(socketId); }
        catch(e) { console.error(`[ERROR] Connection not found "${socketId}"`) }
    });
})
.listen(8080);
