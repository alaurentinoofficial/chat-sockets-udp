var amqp = require('amqplib/callback_api');

const express = require('express');
var cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());

const http = require('http');
const server = http.createServer(app);

// Models
const Order = (channel, message) => {
    let content = JSON.parse(message.content.toString());
    
    return {
        ...content,
        content: content,
        authorize: () => channel.ack(message),
    }
}; 

// Peding Authorizon Orders
const orders_peding_authorization = {}


const RABBITMQ_ADDRESS = 'amqp://localhost';
const QUEUE = 'hello';


amqp.connect(RABBITMQ_ADDRESS, function(error0, connection) {
  if (error0) throw error0;

  connection.createChannel(function(error1, channel) {
    if (error1) throw error1;

    channel.assertQueue(QUEUE, {
      durable: false
    });

    channel.consume(QUEUE, function(msg) {
        let order = Order(channel, msg);
        orders_peding_authorization[order.id] = order;
    }, { noAck: false });

  });
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});  

app.get('/orders', (req, res) => {
    res.status(200).json({
        code: 0,
        body: Object.values(orders_peding_authorization)
                    .map(x => x.content),
        error: null
    })
});

app.post('/orders/:id/authorize', (req, res) => {
    var id = req.params.id;
    var order = orders_peding_authorization[id];

    if(!order)
        return res.status(404).json({ code: 1, body: null, error: "Invalid order id" });
    
    order.authorize();
    delete orders_peding_authorization[id];

    res.status(200).json({code: 0, body: "Success", error: null})
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});