const uuid = require('uuid');

module.exports = function() {
    let entries = {};

    function addClientConnection(socket) {
        let socketId = uuid.v4();
        entries[socketId] = socket;
    
        return socketId;
    }
    
    function removeClientConnection(socketId) {
        delete entries[socketId];
    }
    
    function broadcastMessage(message, ingnoreSocketId = null) {
        Object.entries(entries).forEach(entry => {
            const [id, socket] = entry;
    
            if (id != ingnoreSocketId)
                socket.write(message);
        })
    }

    return {
        addClientConnection: addClientConnection,
        removeClientConnection: removeClientConnection,
        broadcastMessage: broadcastMessage
    }
}