import * as actionTypes from './actionTypes';
import { store } from './store';
import * as types from './types';

const wsocket = new WebSocket('ws://localhost:8080');

wsocket.onopen = (event: any) => {
    console.log('connection created');
};

wsocket.onclose = (event: any) => {
    console.log('connection is closed');
}

wsocket.onmessage = (event: any) => {
    console.log('received : ', event.data);
    const message = JSON.parse(event.data);
    const type = message['type'];
    const payload = message['payload'];
    switch (type) {
        case types.TYPE_NEW_PLAYER:
            store.dispatch({
                type: actionTypes.ACTION_NEW_PLAYER,
                payload: {
                    roomId: payload['roomId'],
                    playerId: payload['playerId'],
                    playerIsWhite: (payload['color'] === 'white'),
                },
            });
            break;

        case types.TYPE_GAME_MOVE:
            let move = payload['move'];
            let nextPlayer = payload['next'];

            store.dispatch({
                type: actionTypes.ACTION_GAME_MOVE,
                payload: {
                    move: move,
                    next: nextPlayer,
                },
            });
            break;

        default:
            console.log('unrecognized message : ', type, payload);
            break;
    }
}

export function startChessGame() {
    if (!wsocket) return;
    wsocket.send(JSON.stringify({
        type: types.TYPE_JOIN_ROOM,
        payload: {
            'roomId': 'room_123',
        }
    }))
}

export function stopChessGame() {
    console.log('stopping chess game');
}

export function makeChessMove(move: string) {
    if (!wsocket) return;
    wsocket.send(JSON.stringify({
        type: types.TYPE_GAME_ACTION,
        payload: {
            "roomId": store.getState().roomId,
            "playerId": store.getState().playerId,
            "move": move,
        }
    }))
}

