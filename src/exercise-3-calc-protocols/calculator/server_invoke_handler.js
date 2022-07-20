let CalcOperations = {
    "+": (a, b) => a + b,
    "-": (a, b) => a - b,
    "*": (a, b) => a * b,
    "/": (a, b) => a / b,
}

function CalculatorInvokeHandler(payload) {
    if(Number(payload.n1) == NaN || Number(payload.n2) == NaN) {
        return {
            status: "ERROR",
            message: `One of the parameters cannot be cast as integer "n1":${Number(payload.n1)}, "n2":${Number(payload.n2)}`
        }
    }

    if(Object.keys(CalcOperations).includes(payload.operation)) {
        result = CalcOperations[payload.operation](Number(payload.n1), Number(payload.n2));

        return {
            status: "OK",
            result,
            operation: payload.operation,
            n1: payload.n1,
            n2: payload.n2
        };
    } else {
        return {
            status: "ERROR",
            message: `Invalid operation "${payload.operation}"`
        }
    }
}

module.exports = {
    CalculatorInvokeHandler: CalculatorInvokeHandler
}