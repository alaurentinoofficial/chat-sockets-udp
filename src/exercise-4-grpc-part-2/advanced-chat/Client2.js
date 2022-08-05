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

const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const client = new proto.AdvancedChatServer(
    'localhost:50051',
    grpc.credentials.createInsecure()
);

rl.question('What is your name ? ', function (name) {
    let call = client.chat({});
    
    // Join on server
    call.write({
        type: "JOIN",
        nickname: name
    })

    call.on('data', function(data){
        try {
            switch(data.type) {
                case "MESSAGE":
                    console.log(`${data.nickname}: ${data.message}`);
                    break;
                case "NOTIFICATION":
                    console.log(`\nNotification> ${data.message}\n`)
                    break;
            }
        } catch (e) { console.error(e); }
    });

    call.on('end', () => {
        console.log('\n[CHAT] Server closed, bye!');
        process.exit(0);
    });

    rl.on('close', function () {
        call.end();
        console.log('\n[CHAT] Bye!');
        process.exit(0);
    });

    (function writeMessage() {
        rl.question('', function (message) {
            call.write({
                type: "MESSAGE",
                message: message
            });

            writeMessage();
        });
    })();
});