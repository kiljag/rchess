
import * as actionTypes from './actionTypes';
import { store } from './store';
import * as types from './types';

let wsocket: WebSocket;

async function createConnection(wsurl: string): Promise<void> {
    return new Promise((resolve, reject) => {
        wsocket = new WebSocket(wsurl);
        wsocket.onopen = (event: any) => {
            resolve();
        }
        wsocket.onerror = (event: any) => {
            reject();
        }
    })
}

function onclose(event: any) {
    console.log('connection closed');
}

function onmessage(event: any) {
    console.log('received : ', event.data);
    const message = JSON.parse(event.data);
    const type = message['type'];
    const payload = message['payload'];
    switch (type) {
        case types.TYPE_NEW_PLAYER:
            // change the url
            let roomId = payload['roomId'];
            document.location.hash = roomId;
            store.dispatch({
                type: actionTypes.ACTION_NEW_PLAYER,
                payload: {
                    roomId: payload['roomId'],
                    playerId: payload['playerId'],
                    playerIsWhite: (payload['color'] === 'w'),
                    gameLink: document.location.href, // same as the url
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

// let wsurl = 'ws://localhost:8080/';
let wsurl = `ws://${document.location.host}/ws/`;

export async function startChessGame() {
    try {
        console.log('starting chess game');
        await createConnection(wsurl);
        wsocket.onclose = onclose;
        wsocket.onmessage = onmessage
        wsocket.send(JSON.stringify({
            type: types.TYPE_JOIN_ROOM,
        }));

    } catch (err) {
        console.error(err);
    }
}

// join if invited via a link
let hash = document.location.hash;
if (hash !== "" && hash !== "#") {
    let roomId = hash.substring(1);
    joinChessGame(roomId);
}

export async function joinChessGame(roomId: string) {
    try {
        console.log('joining chess game : ', roomId);
        await createConnection(wsurl);
        wsocket.onclose = onclose;
        wsocket.onmessage = onmessage;
        wsocket.send(JSON.stringify({
            type: types.TYPE_JOIN_ROOM,
            payload: {
                roomId: roomId,
            }
        }));
    } catch (err) {
        console.error(err)
    }
}

export function stopChessGame() {
    console.log('stopping chess game');
}

export function makeChessMove(move: string) {
    if (!wsocket || wsocket.readyState === wsocket.CLOSED) {
        return;
    }
    wsocket.send(JSON.stringify({
        type: types.TYPE_GAME_ACTION,
        payload: {
            "roomId": store.getState().roomId,
            "playerId": store.getState().playerId,
            "clientId": document.cookie.substring(9),
            "move": move,
        }
    }))
}

