
import express, { Request, Response } from 'express';
import http from 'http';
import { WebSocket } from 'ws';
import * as game from './game';
import * as types from './types';

const app = express();
const httpServer = http.createServer(app);
const wss = new WebSocket.Server({ server: httpServer });

const root_path = '../client/build/';

app.use(express.static(root_path));

app.get('/', (req: Request, res: Response) => {
    console.log('roomId : ', req.params.roomId);
    res.sendFile('index.html', {
        root: root_path,
    });
});

wss.on('connection', (ws: WebSocket) => {

    console.log('client connected..');

    // event handler for receving messages from the client
    ws.on('message', (data) => {
        try {
            const message = JSON.parse(data.toString());
            console.log('received : ', message);
            const type = message['type'];
            const payload = message['payload'] || {};

            switch (type) {
                case types.TYPE_JOIN_ROOM:
                    game.handleJoinRoom(ws, payload);
                    break;

                case types.TYPE_GAME_ACTION:
                    game.handleGameAction(ws, payload);
                    break;

                case types.TYPE_LEAVE_ROOM:
                    game.handleLeaveRoom(ws, payload);
                    break;

                default:
                    console.log('invalid type:', type);
                    break;
            }

        } catch (err) {
            console.log(err);
        }
    })
});


const PORT = 8080;
httpServer.listen(PORT, () => {
    console.log(`HTTP server started on port ${PORT}`);
});

