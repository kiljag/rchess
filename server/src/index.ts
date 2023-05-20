
import express, { Request, Response } from 'express';
import http from 'http';
import { WebSocket } from 'ws';
import { handleJoinRoom, handleGameAction } from './wsocket';
import * as types from './types';

const app = express();
const httpServer = http.createServer(app);
const wss = new WebSocket.Server({ server: httpServer });

app.use(express.static('./dist/public'));

app.get('/:roomId', (req: Request, res: Response) => {
    console.log('roomId : ', req.params.roomId);
    res.sendFile('index.html', {
        root: './dist/public',
    })
})

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
                    handleJoinRoom(ws, payload);
                    break;

                case types.TYPE_GAME_ACTION:
                    handleGameAction(ws, payload);
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

