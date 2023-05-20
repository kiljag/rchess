/**
 * action handlers
 */

import { WebSocket } from "ws";
import * as util from './util';
import * as types from './types';
import * as gameroom from './gameroom';

function sendNewPlayer(ws: WebSocket,
    roomId: string, playerId: string, color: string) {

    // send acknowledgement
    ws.send(JSON.stringify({
        type: types.TYPE_NEW_PLAYER,
        payload: {
            'playerId': playerId,
            'roomId': roomId,
            'color': color,
        }
    }));
}

export function handleJoinRoom(ws: WebSocket, payload: any) {

    let playerId = util.getRandomPlayerId();

    // create new game room
    if (!payload || !payload['roomId']) {
        let roomId = util.getRandomRoomId();
        console.log('creating new room ', roomId);

        let color = payload['color'] as string;
        if (color !== "black" && color !== "white") {
            color = Math.random() < 0.5 ? "white" : "black";
        }

        let room = gameroom.createGameRoom(roomId);
        room.addPlayer(ws, playerId, color);
        sendNewPlayer(ws, roomId, playerId, color);

    } else { // existing player
        let roomId = payload['roomId'] as string;
        console.log('adding to existing room : ', roomId);

        let room = gameroom.getGameRoom(roomId)
        if (!room) { // for testing
            room = gameroom.createGameRoom(roomId);
        }

        if (room.isFull()) {
            room = gameroom.createGameRoom(roomId);
            // ws.send(JSON.stringify({
            //     type: types.TYPE_ROOM_FULL,
            // }));
            // ws.close();
            // return;
        }

        let color = room.getAvailableColor();
        room.addPlayer(ws, playerId, color);
        sendNewPlayer(ws, roomId, playerId, color);

        if (room.isFull()) {
            room.startGame();
        }
    }
}

export function handleGameAction(ws: WebSocket, payload: any) {

    let roomId = payload['roomId'] || "";
    let playerId = payload['playerId'] || "";
    let move = payload['move'] || "";

    let room = gameroom.getGameRoom(roomId);
    if (!room) {
        console.log("invalid roomId : ", room);
        ws.close();
        return;
    }
    if (playerId !== room.whitePlayer && playerId !== room.blackPlayer) {
        console.log('invalid playerId : ', playerId);
        ws.close();
        return;
    }

    let result = room.makeMove(playerId, move);
    if (!result) {
        console.log('invalid move : ', move);
        ws.close();
        return;
    }
}