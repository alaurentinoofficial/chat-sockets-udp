const { marshaller, unmarshaller } = require('../utils/encoding')

module.exports = {
    CalculateInvoker: (socket, data) => {
        return new Promise(function(ok, error) {
            socket.write(marshaller(data))

            setTimeout(() => error("Timeout"), 5000)
            
            socket.on("data", function(data) {
                ok(unmarshaller(data.toString()))
            })
        })
    }
};