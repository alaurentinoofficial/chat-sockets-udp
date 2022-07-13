const net = require("net");

const socket = net.Socket();
socket.connect(8080);

const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('What is your name ? ', function (name) {
    socket.on('data', function(data){
        try {
            let payload = JSON.parse(data.toString())
            console.log(`\n[${payload.name}]: ${payload.msg}`);
        } catch (e) {}
    });

    (function writeMessage() {
        rl.question('> ', function (msg) {
            socket.write(JSON.stringify({
                name: name,
                msg: msg,
                timestamp: new Date().toISOString()
            }));

            writeMessage();
        });
    })()
});

rl.on('close', function () {
    socket.destroy();
    console.log('\n[CHAT] Bye!');
    process.exit(0);
});