/**
 * action handlers
 */

import { WebSocket } from "ws";
import { GameRoom } from "./room";
import * as types from './types';
import { Color } from "chess.js";
import * as util from "./util";

// data structures
const playerIdToRoomId: Record<string, string> = {}
const roomIdToGameRoom: Record<string, GameRoom> = {}

function sendNewPlayer(ws: WebSocket,
    roomId: string, playerId: string, color: Color, moves: string[]) {

    // send acknowledgement
    ws.send(JSON.stringify({
        type: types.TYPE_NEW_PLAYER,
        payload: {
            'playerId': playerId,
            'roomId': roomId,
            'color': color,
            'moves': moves,
        }
    }));
}

export function handleJoinRoom(ws: WebSocket, payload: any) {

    if (!payload || !payload['roomId']) { // create new game room

        let playerId = 'player_' + util.getRandomId();
        let roomId = 'room_' + util.getRandomId();

        // assign random color if not selected by player
        let c = payload || payload['color'] as string;
        let color: Color = c === 'white' ? 'w' : c === 'black' ? 'b'
            : (Math.random() < 0.5 ? "w" : "b");

        let room = new GameRoom();
        roomIdToGameRoom[roomId] = room;
        playerIdToRoomId[playerId] = roomId;
        room.addPlayer(ws, playerId, color);
        sendNewPlayer(ws, roomId, playerId, color, []);
        return;

    } else { // existing game room

        let roomId = payload['roomId'] as string;
        if (roomIdToGameRoom[roomId] === undefined) {
            console.log('invalid roomId : ', roomId);
            ws.close();
            return;
        }

        let room = roomIdToGameRoom[roomId];
        if (room.isFull()) {
            console.log('room is full ', roomId);
            ws.close();
            return;
        }

        let playerId = 'player_' + util.getRandomId();
        let color = room.getAvailableColor();
        playerIdToRoomId[playerId] = roomId;
        room.addPlayer(ws, playerId, color);
        sendNewPlayer(ws, roomId, playerId, color, []);

        if (room.isFull()) {
            room.startGame();
        }
    }
}

export function handleGameAction(ws: WebSocket, payload: any) {

    let roomId = payload['roomId'] || "";
    let playerId = payload['playerId'] || "";
    let move = payload['move'] || "";

    if (playerIdToRoomId[playerId] !== roomId) {
        console.log('invalid roomId..', roomId);
        ws.close();
        return;
    }

    let room = roomIdToGameRoom[roomId];
    if (!room) {
        console.log("invalid roomId : ", room);
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

export function handleLeaveRoom(ws: WebSocket, payload: any) {

    let roomId = payload['roomId'] || "";
    let playerId = payload['playerId'] || "";

    if (playerIdToRoomId[playerId] !== roomId) {
        console.log('invalid roomId..', roomId);
        ws.close();
        return;
    }

    let room = roomIdToGameRoom[roomId];
    if (!room) {
        console.log("invalid roomId : ", roomId);
        ws.close();
        return;
    }

    room.exitGame();
}