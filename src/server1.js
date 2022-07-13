const net = require("net");
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log("Wating for clients...");

net.createServer(function (socket) {
    (function writeMessage() {
        rl.question('> ', function (msg) {
            socket.write(JSON.stringify({
                name: "Server",
                msg: msg,
                timestamp: new Date().toISOString()
            }));

            writeMessage();
        });
    })()

    socket.on('data', function(data){
        try {
            let payload = JSON.parse(data.toString())
            console.log(`${payload.name}: ${payload.msg}`);
        } catch (e) {}
    });

    socket.on('close', function () {
        console.log('socket', socketId, 'closed');
    });
})
.listen(8080);
