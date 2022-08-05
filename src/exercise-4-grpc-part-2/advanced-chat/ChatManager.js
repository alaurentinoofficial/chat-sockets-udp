const uuid = require('uuid');

module.exports = function() {
    let entries = {};

    function addClientConnection(user_nickname, stub) {
        let stubId = uuid.v4();
        entries[stubId] = {
            stub: stub,
            nickname: user_nickname
        };
    
        return stubId;
    }

    function activeConnCount() {
        return Object.keys(entries).length;
    }
    
    function removeClientConnection(stubId) {
        delete entries[stubId];
    }

    function sendMessage(stubId, message) {
        const conn = entries[stubId];
        if(conn) conn.stub.write(message);
    }
    
    function broadcastMessage(message, ingnoreStubId = null) {
        Object.entries(entries).forEach(entry => {
            const [id, conn] = entry;
    
            if (id != ingnoreStubId)
            conn.stub.write(message);
        })
    }

    return {
        addClientConnection: addClientConnection,
        removeClientConnection: removeClientConnection,
        broadcastMessage: broadcastMessage,
        activeConnCount: activeConnCount,
        sendMessage: sendMessage
    }
}