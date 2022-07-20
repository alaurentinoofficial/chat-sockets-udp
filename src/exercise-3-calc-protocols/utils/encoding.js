function textToObject(text) {
    let object = {}
    
    text
        .split(";")
        .map((data) => data.match(/^"(.*)":"(.*)"$/).slice(1, 3))
        .forEach(([k, v]) => object[k.replace("\\:", ":")] = v.replace("\\:", ":"))
    
    return object;
}

function objectToText(object) {
    return Object
        .entries(object)
        .map(entry => {
            const [k, v] = entry;
            return `"${String(k).replace(":", "\\:")}":"${String(v).replace(":", "\\:")}"`
        })
        .join(";");
}

function marshaller(object) {
    return Buffer.from(objectToText(object))
}

function unmarshaller(buffer) {
    return textToObject(buffer.toString('utf8'))
}

module.exports = {
    marshaller: marshaller,
    unmarshaller: unmarshaller,
}