const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const packageDefinition = protoLoader.loadSync(
  `${__dirname}/proto/Chat.proto`,
  {
    keepCase: true,
    longs: Number,
    enums: String,
    defaults: true,
    oneofs: true
  });
const proto = grpc.loadPackageDefinition(packageDefinition);

const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

var server = new grpc.Server();
server.addService(proto.AdvancedChatServer.service, {
    chat: async (call) => {
        const ac = new AbortController();
        const signal = ac.signal;

        call.on('data', function(data){
            try {
                console.log(`${data.name}: ${data.message}`);
            } catch (e) { console.error(e); }
        });

        call.on('end', () => {
            console.log("[Server] Client ended the connections! Wating for new conection!");
            enabled = false;
            ac.abort();
            call.end();
        });

        (function writeMessage() {
            rl.question('> ', { signal }, function (message) {
                call.write({
                    name: "Server",
                    message: message
                });
    
                writeMessage();
            });
        })();
    }
});

server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
	console.log("[Server] running at http://127.0.0.1:50051");
    console.log("[Server] wating for clients...");
	server.start();
}); // our sever is insecure, no ssl configuration