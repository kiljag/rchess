import { WebSocket } from 'ws';
import { handleJoinRoom, handleGameAction } from './wsocket';
import * as types from './types';

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws: WebSocket) => {

    // event handler for receving messages from the client
    ws.on('message', (data) => {
        try {
            const message = JSON.parse(data.toString());
            console.log('received : ', message);
            const type = message['type'];
            const payload = message['payload'] || {};

            switch (type) {
                case types.TYPE_JOIN_ROOM:
                    handleJoinRoom(ws, payload);
                    break;

                case types.TYPE_GAME_ACTION:
                    handleGameAction(ws, payload);
                    break;
            }

        } catch (err) {
            console.log(err);
        }
    })
});
