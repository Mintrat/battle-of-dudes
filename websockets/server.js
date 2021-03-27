const http = require('http');
const server = http.createServer();
const WSServer = require('ws').Server;
const {connection} = require('./server_class');

const serverPort = 9000;

let wss = new WSServer({ server });
server.listen(serverPort);

wss.on('connection', connection);