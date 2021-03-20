const http = require('http');
const WebSocket = require('ws');
const uuid = require('uuid');

const wss = new WebSocket.Server({ noServer: true });
const server = http.createServer();

const serverPort = 9000;
const clients = new Set();
const players = {};

wss.on('connection', function connection(ws) {
    ws.id = uuid.v4();
    clients.add(ws);
    players[ws.id] = {};

    ws.on('message', function incoming(message) {
        try {
            const mess = JSON.parse(message);
            doAction(ws, mess);
        } catch (e) {
            console.log('received: %s', message);
        }
    });

    ws.on('close', function() {
        clients.delete(ws);
        delete players[ws.id];

        websocketServerSendAll({
            action: 'removePlayer',
            data: ws.id,
        });
    });
});


function doAction(user, data) {
    if(data.action) {
        switch (data.action) {
            case 'getPlayerId':
                websocketServerSend(user, {
                    action: 'setPlayerId',
                    data: user.id,
                });
                break;
            case 'getPlayers':
                websocketServerSendAll({
                    action: 'updatePlayers',
                    data: players,
                });
                break;
            case 'updatePlayer':
                players[user.id] = Object.assign(players[user.id], data.data.data);
                websocketServerSendAll({
                    action: 'updatePlayer',
                    data: data.data,
                });
                break;
            case 'addBullet':
                websocketServerSendAll({
                    action: 'addBullet',
                    data: data.data,
                });
                break;
            case 'deleteBullet':
                websocketServerSendAll({
                    action: 'deleteBullet',
                    data: data.data,
                });
                break;
        }
    }
}

function websocketServerSend(user, data) {
    const sendData = JSON.stringify(data);
    user.send(sendData);
}

function websocketServerSendAll(data) {
    const sendData = JSON.stringify(data);
    for(let client of clients) {
        client.send(sendData);
    }
}

server.on('upgrade', function upgrade(request, socket, head) {
    wss.handleUpgrade(request, socket, head, function done(ws) {
        wss.emit('connection', ws, request);
    });
});

server.listen(serverPort);