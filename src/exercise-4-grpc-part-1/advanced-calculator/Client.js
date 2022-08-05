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

const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const client = new proto.AdvancedCalculator(
  'localhost:50051',
  grpc.credentials.createInsecure()
);

let SimbolToOperator = {
  "+": "SUM",
  "-": "SUB",
  "*": "MUL",
  "/": "DIV",
};

// Client
(function Client() {
    rl.question('Calculation: ', function (txt) {
        let match = txt.match(/^([-]{0,1}\d+)([+-\/*])([-]{0,1}\d+)$/)

        if(match) {
            const params = match.slice(1, 4)
            const payload = {
              number1: params[0],
              number2: params[2],
              operation: SimbolToOperator[params[1]],
            };
            
            client.calculate(payload, (err, result) => {
              if(err)
                return console.log(`\n${err.details}\n`);

              console.log(`\nResult: ${result.value}`);
            })
        } else {
            console.error(`[Calc UDP] the typed value "${data}" is invalid`
                          + "\nAvailable operations:"
                          + "\n\tSum: '<number>+<number>'"
                          + "\n\tMinus: '<number>-<number>'"
                          + "\n\tMultiplication: '<number>*<number>'"
                          + "\n\tDivide: '<number>/<number>'\n")
        }

        Client();
    });
})()