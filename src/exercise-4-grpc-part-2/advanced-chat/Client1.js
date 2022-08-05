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

const client = new proto.AdvancedChatServer(
    'localhost:50051',
    grpc.credentials.createInsecure()
);

let call = client.chat({});

rl.question('What is your name ? ', function (name) {
    call.on('data', function(data){
        try {
            console.log(`\n${data.name}: ${data.message}`);
        } catch (e) { console.error(e); }
    });

    (function writeMessage() {
        rl.question('> ', function (message) {
            call.write({
                name: name,
                message: message
            });

            writeMessage();
        });
    })()
});

rl.on('close', function () {
    call.end();
    console.log('\n[CHAT] Bye!');
    process.exit(0);
});