/**
 * game room logic
 */

import { Chess } from "chess.js";
import { WebSocket } from "ws";
import * as util from "./util";
import * as types from "./types";

export interface PlayerInfo {
    playerId: string,
    color: string,
    wsocket: WebSocket,
};

const store: Record<string, GameRoom> = {}

export class GameRoom {
    chess: Chess;
    players: Record<string, PlayerInfo>;
    moves: string[]; // chess moves
    whitePlayer: string;
    blackPlayer: string;

    constructor() {
        this.chess = new Chess();
        this.players = {};
        this.moves = [];
        this.whitePlayer = "";
        this.blackPlayer = "";
    }

    addPlayer(ws: WebSocket, playerId: string, color: string) {
        console.log(`adding player : c(${color}) ${playerId}`);
        let randomId = util.getRandomId();
        this.players[randomId] = {
            playerId: playerId,
            color: color,
            wsocket: ws,
        }
        if (color === "white") {
            this.whitePlayer = playerId;
        } else {
            this.blackPlayer = playerId;
        }
    }

    getAvailableColor(): string {
        let whiteExists = false;
        for (let k in this.players) {
            if (this.players[k].color === 'white') {
                whiteExists = true;
                break;
            }
        }
        return whiteExists ? "black" : "white";
    }

    isFull(): boolean {
        return (this.whitePlayer !== "" && this.blackPlayer !== "")
    }

    startGame() {
        this.makeMove("", "init");
    }

    makeMove(playerId: string, move: string): boolean {
        console.log('making move : ', move);
        if (move !== "init") {
            try {
                this.chess.move(move);
            } catch (err) {
                console.log(err);
                return false;
            }
        }

        let nextPlayer = (this.chess.turn() === "w") ?
            this.whitePlayer : this.blackPlayer;

        this.broadCast({
            type: types.TYPE_GAME_MOVE,
            payload: {
                'player': playerId,
                'move': move !== "init" ? move : "",
                'next': nextPlayer,
            }
        });
        return true;
    }

    clearClosedSockets() {
        let disconnected: string[] = []
        for (const k in this.players) {
            let ws = this.players[k].wsocket;
            if (ws.readyState === ws.CLOSED) {
                console.log('clearing connection');
                disconnected.push(k);
            }
        }
        for (const k in disconnected) {
            delete this.players[k];
        }
    }

    broadCast(message: any): void {
        this.clearClosedSockets();
        for (const k in this.players) {
            this.players[k].wsocket.send(JSON.stringify(message))
        }
    }
}

export function createGameRoom(roomId: string): GameRoom {
    store[roomId] = new GameRoom();
    return store[roomId];
}

export function getGameRoom(roomId: string): GameRoom | null {
    if (store[roomId]) {
        store[roomId].clearClosedSockets();
        return store[roomId];
    }
    return null;
}

