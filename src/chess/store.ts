
import { Action, createStore } from '@reduxjs/toolkit';
import * as actionTypes from './actionTypes';
import { Chess } from 'chess.js';
import { getPieceMap, PieceMap } from './util';

export interface ChessState {
    chess: Chess,
    isActive: boolean,
    roomId: string,
    playerId: string,
    playerIsWhite: boolean,
    move: string,
    pieceMap: PieceMap,
}

const initialState: ChessState = {
    chess: new Chess(),
    isActive: false,
    roomId: "",
    playerId: "",
    playerIsWhite: true,
    pieceMap: {},
    move: "",
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
                isActive: false,
                roomId: payload.roomId,
                playerId: payload.playerId,
                playerIsWhite: payload.playerIsWhite,
                move: "",
            }

        case actionTypes.ACTION_GAME_MOVE:
            let move = payload.move;
            if (move === "") { // startgame
                console.log('starting game...');
                let chess = new Chess();
                return {
                    ...state,
                    isActive: true,
                    roomId: state.roomId,
                    playerId: state.playerId,
                    chess: chess,
                    pieceMap: getPieceMap(state.chess),
                }
            }

            try {
                state.chess.move(move);
                return {
                    ...state,
                    pieceMap: getPieceMap(state.chess),
                    move: move,
                }

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
