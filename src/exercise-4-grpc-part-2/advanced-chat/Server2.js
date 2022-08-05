const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const packageDefinition = protoLoader.loadSync(
  `${__dirname}/proto/Chat2.proto`,
  {
    keepCase: true,
    longs: Number,
    enums: String,
    defaults: true,
    oneofs: true
  });
const proto = grpc.loadPackageDefinition(packageDefinition);
const ChatManager = require("./ChatManager");

const chatManager = new ChatManager()

var server = new grpc.Server();
server.addService(proto.AdvancedChatServer.service, {
    chat: async (call) => {
        let stubId = null;
        let nickname = null;

        call.on('data', function(data) {
            if(stubId == null) {
                if(data.type == "JOIN") {
                    stubId = chatManager.addClientConnection(data.name, call);
                    nickname = data.nickname;

                    let userCount = chatManager.activeConnCount();
                    chatManager.sendMessage(stubId, {
                        type: "NOFICATION",
                        name: "Server",
                        message: `There ${userCount > 1 ? "are" : "is"} ${userCount} active users`
                    })

                    chatManager.broadcastMessage({
                        type: "NOFICATION",
                        name: "Server",
                        message: `${nickname} joined`
                    }, stubId); 
                }
                
                return;
            }
            
            if(data.type == "MESSAGE")
                chatManager.broadcastMessage(data, stubId);
        });

        call.on('end', () => {
            if(stubId) {
                chatManager.removeClientConnection(stubId);
                chatManager.broadcastMessage({
                    type: "NOFICATION",
                    name: "Server",
                    message: `${nickname} left`
                }, stubId);   
            }
            call.end();
        });
    }
});

server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
	console.log("[Server] running at http://127.0.0.1:50051");
    console.log("[Server] wating for clients...");
	server.start();
}); // our sever is insecure, no ssl configuration