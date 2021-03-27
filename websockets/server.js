const http = require('http');
const server = http.createServer();
const wss = require('./server_class').wss;

const serverPort = 9000;

server.on('upgrade', function upgrade(request, socket, head) {
    wss.handleUpgrade(request, socket, head, function done(ws) {
        wss.emit('connection', ws, request);
    });
});

server.listen(serverPort);