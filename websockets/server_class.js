const uuid = require('uuid');

const clients = new Set();
const players = {};

function connection(ws) {
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
}


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

module.exports = {
    connection
};