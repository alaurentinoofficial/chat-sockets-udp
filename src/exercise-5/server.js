const { v4: uuidv4 } = require('uuid');

const express = require('express');
var cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());

const http = require('http');
const server = http.createServer(app);

// Constants
const WEEKDAYS = new Set(["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"]);

// DTOs
const Response = (code, body = null, error = null, links = null) => ({code, body, error, links: links || []});
const Todo = (name, done = null, id = null) => ({name, done: done || false, id: id || uuidv4()});
const Link = (href, rel, type) => ({href, rel, type});

// Initialize the Todos Database using indexes
// Weekday (Index) => Id (Index) => Todo (Entity Document storage)
let todos_table = [...WEEKDAYS].reduce((obj, v) => ({...obj, [v]: {}}), {});
let todos_id_index_partitions = {}; // Create relation from Id to Weekday indexes to search more fast

app.get('/todos', (req, res) => {
    links = [
        ...Object.entries(todos_table).map(([k,v]) => [
            Link(`/todos/weekday/${k}`, "todo", "GET"),
            ...Object.keys(v).map(x => [
                Link(`/todo/${x}`, "todo", "UPDATE"),
                Link(`/todo/${x}`, "todo", "DELETE"),
            ])
        ])
    ]

  res.status(200).json(
    Response(
        code=0,
        body=Object.entries(todos_table)
                   .reduce((obj, [k, v]) => ({...obj, [k]: Object.values(v)}), {}),
        errors=null,
        links=links
    )
  );
});

app.get('/todos/weekday/:weekday', (req, res) => {
    var day = new String(req.params.weekday).toUpperCase();

    if(!WEEKDAYS.has(day)) return res.status(404).json(Response(
        code=1, body=null, error="Invalid weekday"
    ))

    links = [
        Link(`/todos`, "todo", "GET"),
        ...[...WEEKDAYS].map((v) => [
            Link(`/todos/weekday/${v}`, "todo", "GET"),
        ]).filter(a => a.href != `/todos/weekday/${day}`),
        ...Object.entries(todos_table[day]).map(([k,v]) => [
            Link(`/todo/${k}`, "todo", "UPDATE"),
            Link(`/todo/${k}`, "todo", "DELETE"),
        ])
    ]
    
    res.status(200).json(Response(code=0, body=Object.values(todos_table[day]), errors=null, links=links));
});

app.post('/todos/weekday/:weekday', (req, res) => {
    var day = new String(req.params.weekday).toUpperCase();

    if(!WEEKDAYS.has(day)) return res.status(404).json(Response(
        code=1, body=null, error="Invalid weekday"
    ));

    if(!(req.body["name"]
        && (req.body["done"] == false || req.body["done"] == true)))
        return res.status(400).json(Response(
            code=1, body=null, error="Invalid body"
        ));

    var todo = Todo(req.body["name"], req.body["done"]);

    todos_table[day][todo.id] = todo;
    todos_id_index_partitions[todo.id] = day;

    links = [
        Link(`/todo/${todo.id}`, "todo", "UPDATE"),
        Link(`/todo/${todo.id}`, "todo", "DELETE"),
    ]
    
    res.status(200).json(Response(code=0, body=todo, errors=null, links=links));
});

app.put('/todos/:id', (req, res) => {
    var id = new String(req.params.id);
    var partition = todos_id_index_partitions[id];

    if(partition == undefined)
        return res.status(404).json(Response(
            code=1, body=null, error="Todo not found, please inform a valid ID"
        ));

    if(!(req.body["name"]
        && (req.body["done"] == false || req.body["done"] == true)))
        return res.status(400).json(Response(
            code=1, body=null, error="Invalid body"
        ));

    var newTodo = Todo(req.body["name"], req.body["done"], id);
    todos_table[partition][id] = newTodo;

    links = [
        Link(`/todo/${id}`, "todo", "DELETE"),
    ]

    return res.status(200).json(Response(0, newTodo, links=links));
});

app.delete('/todos/:id', (req, res) => {
    var id = new String(req.params.id);
    var partition = todos_id_index_partitions[id];

    if(partition == undefined)
        return res.status(404).json(Response(
            code=1, body=null, error="Todo not found, please inform a valid ID"
        ));

    delete todos_table[partition][id];
    delete todos_id_index_partitions[id];

    links = [
        Link(`/todos`, "todo", "GET"),
        ...[...WEEKDAYS].map((v) => [
            Link(`/todos/weekday/${v}`, "todo", "GET"),
        ]),
    ]
    
    res.status(200).json(Response(code=0, body=null, errors=null, links=links));
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});