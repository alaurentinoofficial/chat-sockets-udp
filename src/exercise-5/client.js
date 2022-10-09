const axios = require("axios");

let server = axios.create({
    baseURL: "http://localhost:3000",
});

(async function () {
    
    let createResponse = await server.post("/todos/weekday/sunday", {
        name: "Exercício HTTP e REST",
        done: false
    });
    console.log(createResponse.data);
    
    let updateResponse = await server.put(`/todos/${createResponse.data.body.id}`, {
        name: "Fazer Exercício HTTP e REST de sistemas distribuidos",
        done: true
    });
    console.log(updateResponse.data);

    let getAllTodoResponse = await server.get(`/todos`);
    console.log(getAllTodoResponse.data);

    let getSundayTodoResponse = await server.get(`/todos/weekday/sunday`);
    console.log(getSundayTodoResponse.data);

    let deleteResponse = await server.delete(`/todos/${createResponse.data.body.id}`);
    console.log(deleteResponse.data);

    let getAllTodoAfterDeleteResponse = await server.get(`/todos`);
    console.log(getAllTodoAfterDeleteResponse.data);
})()