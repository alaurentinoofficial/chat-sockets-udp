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

    function notify(stubId, message) {
        const conn = entries[stubId];
        if(conn) conn.stub.write({
            type: "NOFICATION",
            name: "",
            message: message
        });
    }

    function broadcastNotify(message, ingnoreStubId = null) {
        broadcast({
            type: "NOFICATION",
            nickname: "Server",
            message: message
        }, ingnoreStubId);
    }

    function broadcastMessage(payload, ingnoreStubId = null) {
        broadcast({
            type: "MESSAGE",
            nickname: payload.nickname,
            message: payload.message
        }, ingnoreStubId);
    }
    
    function broadcast(payload, ingnoreStubId = null) {
        Object.entries(entries).forEach(entry => {
            const [id, conn] = entry;
    
            if (id != ingnoreStubId)
            conn.stub.write(payload);
        })
    }

    return {
        addClientConnection: addClientConnection,
        removeClientConnection: removeClientConnection,
        activeConnCount: activeConnCount,
        notify: notify,
        broadcastNotify: broadcastNotify,
        broadcastMessage: broadcastMessage,
    }
}