const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const packageDefinition = protoLoader.loadSync(
  `${__dirname}/proto/Calculator.proto`,
  {
    keepCase: true,
    longs: Number,
    enums: String,
    defaults: true,
    oneofs: true
  });
const proto = grpc.loadPackageDefinition(packageDefinition);

// Create a server
const server = new grpc.Server();

let CalcOperations = {
  "SUM": (a, b) => a + b,
  "SUB": (a, b) => a - b,
  "MUL": (a, b) => a * b,
  "DIV": (a, b) => a / b,
}

// Add the service
server.addService(proto.AdvancedCalculator.service, {
  calculate: (call, cb) => {
    const {number1, number2,operation} = call.request;

    if(number2 == 0 && operation == "DIV")
      return cb({
        code: 400,
        details: "Cannot divide a number by zero!",
        status: grpc.status.INVALID_ARGUMENT
      }, null);

    const result = CalcOperations[operation](number1, number2);

    return cb(null, {value: result});
  }
});

server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
	console.log("Server running at http://127.0.0.1:50051");
	server.start();
}); // our sever is insecure, no ssl configuration