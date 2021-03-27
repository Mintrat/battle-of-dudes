const http = require('http');
const path = require('path');
const express = require('express');
const WSServer = require('ws').Server;
const serveStatic = require('serve-static');
const {connection} = require('./websockets/server_class');

let wss;
let server;
const app = express();

app.use('/', serveStatic(path.join(__dirname, '/dist')))
app.get(/.*/, function (req, res) {
    res.sendFile(path.join(__dirname, '/dist/index.html'))
})

server = new http.createServer(app);
wss = new WSServer({ server })

const port = process.env.PORT || '8080'
server.listen(port);

wss.on('connection', connection);