
import { Action, createStore } from '@reduxjs/toolkit';
import * as actionTypes from './actionTypes';
import { Chess } from 'chess.js';
import { getPieceMap, PieceMap } from './util';

export interface ChessState {
    // can be one of the state.
    isWaiting: boolean, // waiting for friend to accept the invite
    isPlaying: boolean, // is playing now.
    isGameover: boolean, // is gameover. 

    chess: Chess,
    gameLink: string,
    roomId: string,
    playerId: string,
    playerIsWhite: boolean,
    moves: string[],
    pieceMap: PieceMap,
}

const initialState: ChessState = {
    isWaiting: false,
    isPlaying: false,
    isGameover: false,

    chess: new Chess(),
    gameLink: "",
    roomId: "",
    playerId: "",
    playerIsWhite: true,
    pieceMap: {},
    moves: [],
}

export interface ChessAction extends Action {
    type: string,
    payload: any,
}

const reducer = (state = initialState, action: ChessAction): ChessState => {

    console.log('action : ', action);
    const payload = action.payload;

    switch (action.type) {

        case actionTypes.ACTION_NEW_PLAYER:

            return {
                ...state,
                chess: new Chess(),
                isWaiting: true, // waiting for friend to accept the invite
                isPlaying: false, // is playing now.
                isGameover: false, // is gameover. 

                roomId: payload.roomId,
                playerId: payload.playerId,
                playerIsWhite: payload.playerIsWhite,
                gameLink: payload.gameLink,
                moves: [],
                pieceMap: {},
            }

        case actionTypes.ACTION_GAME_MOVE:
            let move = payload.move;

            // start game
            if (move === "init") {
                console.log('starting game...');
                let chess = new Chess();
                return {
                    ...state,
                    isWaiting: false,
                    isPlaying: true,
                    isGameover: false,

                    roomId: state.roomId,
                    playerId: state.playerId,
                    chess: chess,
                    pieceMap: getPieceMap(state.chess),
                }
            }

            // opposite player existed
            if (move === "exit") {
                console.log('exit the game...');
                let chess = new Chess();
                return {
                    ...initialState,
                    chess: chess,
                }
            }

            // else make a move
            try {
                state.chess.move(move);
                console.log('game over : ', state.chess.isGameOver());

                let updated = {
                    ...state,
                    pieceMap: getPieceMap(state.chess),
                    moves: state.moves.concat(move),
                }
                if (state.chess.isGameOver()) {
                    updated = {
                        ...updated,
                        isWaiting: false,
                        isPlaying: false,
                        isGameover: true,
                    }
                }
                return updated;

            } catch (err) {
                console.error(err);
                return state;
            }

        default:
            return state;
    }
}

let chessStore = createStore(reducer);
chessStore.subscribe(() => console.log('store: ', store.getState()));

export const store = chessStore;
