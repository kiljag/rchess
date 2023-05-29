/**
 * game room logic
 */

import { Chess, Color } from "chess.js";
import { WebSocket } from "ws";
import * as types from "./types";

export interface PlayerInfo {
    playerId: string,
    color: Color,
    wsocket: WebSocket,
};

export class GameRoom {
    chess: Chess;
    moves: string[]; // chess moves
    wp: PlayerInfo | null;
    bp: PlayerInfo | null;

    constructor() {
        this.chess = new Chess();
        this.moves = [];
        this.wp = null;
        this.bp = null;
    }

    addPlayer(ws: WebSocket, playerId: string, color: Color) {

        let player: PlayerInfo = {
            playerId: playerId,
            color: color,
            wsocket: ws,
        }

        if (color === 'w') {
            this.wp = player;
        } else {
            this.bp = player;
        }
    }

    getAvailableColor(): Color {
        return (this.wp !== null) ? 'b' : "w";
    }

    isFull(): boolean {
        return (this.wp !== null && this.bp !== null)
    }

    startGame() {
        this.broadCast({
            type: types.TYPE_GAME_MOVE,
            payload: {
                'move': "init",
            },
        });
    }

    exitGame() {
        this.broadCast({
            type: types.TYPE_GAME_MOVE,
            payload: {
                'move': 'exit',
            },
        });
    }

    makeMove(playerId: string, move: string): boolean {
        console.log(`chess move (${playerId}) : ${move}`)
        let p = (this.chess.turn() === 'w') ? this.wp : this.bp;
        if (p !== null && p.playerId !== playerId) {
            console.log(`invalid player's turn`);
            return false;
        }
        try {
            this.chess.move(move);
            this.broadCast({
                type: types.TYPE_GAME_MOVE,
                payload: {
                    'move': move,
                },
            });
        } catch (err) {
            console.log('error in move :', err);
            return false;
        }

        return true;
    }

    broadCast(message: any): void {
        if (this.wp && this.wp.wsocket.readyState !== WebSocket.CLOSED) {
            this.wp.wsocket.send(JSON.stringify(message));
        }
        if (this.bp && this.bp.wsocket.readyState !== WebSocket.CLOSED) {
            this.bp.wsocket.send(JSON.stringify(message));
        }
    }
}
