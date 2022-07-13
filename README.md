# Chat using TCP sockets

This project was created for an exercise proposed in Introduction to Distributed Systems at Federal University of Pernambuco.

<br/>

Basically it is divided into two different challenges described below.

<br>

# Setup the application

Requirements:
- Node JS >= 8.x [[Official website](https://nodejs.org/pt-br/download/)]
- NPM  >= 6.x [[Official website](https://nodejs.org/pt-br/download/)]

<br/>

Execute the following command to install the depencies:
```bash
$ npm i
```

# First challenge

The first is to create a chat between a Server and a Client and both can send messages to each other with a simple and customized protocol over TCP. The client must be able to define their name.

<br>

Hypothetical conversation example:
```
Luva de pedreiro: Receba!
Server: Recebo $$
```

<br/>

To execute use the following commands to start the application:

<br/>

1. Start the server application
```bash
$ node src/server1.js
```

2. Start the client application
```bash
$ node src/client.js
```

# Second challenge

Second, the server needs to accept the message from multiple clients and when a client sends a message it must broadcast the message to all other clients connected in the chat. The clients must be able to define their names.

<br/>

Hypothetical conversation example:
```
Alex: Muito bom esse servidor.
Ze: vsf muito complicado programar com sockets
Maria: Pra mim foi facinho. Vcs são enrolados.
Alex: kkkkk
Ze: LOL
```

<br/>

1. Start the server application
```bash
$ node src/server2.js
```

2. Start the client application
```bash
$ node src/client.js
```

