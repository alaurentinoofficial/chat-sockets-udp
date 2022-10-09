const { v4: uuidv4 } = require('uuid');

var amqp = require('amqplib/callback_api');

const RABBITMQ_ADDRESS = 'amqp://localhost';
const QUEUE = 'hello';

const ORDERS = [
  {id: uuidv4(), name: "Logitech MX Keys mini"},
  {id: uuidv4(), name: "Samsung S22+"},
  {id: uuidv4(), name: "Macbook 14\" Pro M1 Pro"},
  {id: uuidv4(), name: "Xbox controller wireless"},
]

amqp.connect(RABBITMQ_ADDRESS, function(error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function(error1, channel) {
    if (error1) {
      throw error1;
    }

    channel.assertQueue(QUEUE, {
      durable: false
    });

    ORDERS.forEach(o => {
      channel.sendToQueue(
        QUEUE,
        Buffer.from(JSON.stringify(o)
      ));
    });

    setTimeout(() => {
      channel.close();
      connection.close();
      process.exit(0);
    }, 1000)
  });
});