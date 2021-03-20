import {createStore} from "vuex";

const uuid = require('uuid');

export default createStore({
    state () {
        return {
            websockets: {
                server: "ws://localhost:9000/websockets.js",
                connection: null,
                subscribes: {},
            },
            players: {},
            myPlayerId: null,
            field: {
                component: null,
                size: {},
                position: {},
            },
            bullets: {},
        }
    },
    mutations: {
        websocketsConnect(state) {
            state.websockets.connection = new WebSocket(state.websockets.server);

            state.websockets.connection.onmessage = function(event) {
                const message = event.data;
                try {
                    const mess = JSON.parse(message);
                    if(mess.action && mess.data) {
                        if( state.websockets.subscribes[mess.action].length ) {
                            state.websockets.subscribes[mess.action].forEach(function(callback) {
                                callback(mess.data);
                            });
                        }
                    }
                    // eslint-disable-next-line no-empty
                } catch (e) {}
            }

            state.websockets.connection.onopen = function() {
                const action = 'onOpen';
                if( state.websockets.subscribes[action].length ) {
                    state.websockets.subscribes[action].forEach(function(callback) {
                        callback();
                    });
                }
            }

            state.websockets.connection.onclose = function() {
                const action = 'onClose';
                if( state.websockets.subscribes[action].length ) {
                    state.websockets.subscribes[action].forEach(function(callback) {
                        callback();
                    });
                }
            }
        },

        websocketsSubscribe(state, payload) {
            if(payload.action && payload.callback) {
                if(typeof payload.callback == "function") {
                    state.websockets.subscribes[payload.action] = state.websockets.subscribes[payload.action] || [];
                    state.websockets.subscribes[payload.action].push(payload.callback);
                }
            }
        },

        websocketsClose(state) {
            state.websockets.connection.close();
        },

        websocketsSend(state, payload) {
            const sendData = JSON.stringify(payload);
            state.websockets.connection.send(sendData);
        },

        setPlayerId(state, payload) {
            state.myPlayerId = payload;
        },

        removePlayer(state, payload) {
            delete state.players[payload];
        },

        updatePlayers(state, payload) {
            state.players = payload;
        },

        updatePlayerPosition(state, payload) {
            const playerId = payload.playerId;
            const myPlayer = playerId === state.myPlayerId;
            if(state.players[playerId] && !myPlayer) {
                state.players[playerId].position = payload.position;
            }
        },

        fieldUpdateSize (state, payload) {
            state.field.size = payload;
        },

        fieldUpdatePosition (state, payload) {
            state.field.position = payload;
        },

        bulletAdd (state, payload) {
            const bulletStoreKey = uuid.v4();
            state.bullets[bulletStoreKey] = payload;
        },

        bulletDelete (state, key) {
            delete state.bullets[key];
        },

        setupField (state, field) {
            state.field.component = field;
        },
    }
});