/**
 * utility functions
 */

export function getRandomId() {
    let randomId = "";
    for (let i = 0; i < 10; i++) {
        randomId += String.fromCharCode(97 + Math.floor(26 * Math.random()))
    }
    return randomId;
}

export function getRandomPlayerId() {
    return 'player_' + getRandomId();
}

export function getRandomRoomId() {
    return 'room_' + getRandomId();
}