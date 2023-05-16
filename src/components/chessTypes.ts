import { Chess } from "chess.js";

export interface Piece {
    squareId: number,
    pieceType: string,
    pieceColor: string,
}

export interface PieceMap {
    [squareId: number]: Piece
}

// Converts a 0x88 square to algebraic notation.
export function algebraic(square: number): string {
    const f = square & 0xf;
    const r = square >> 4;
    return ('abcdefgh'.substring(f, f + 1) +
        '87654321'.substring(r, r + 1));
}

export function getPieceMap(chess: Chess): PieceMap {

    let board = chess.board();
    let pieceMap: PieceMap = {}

    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {

            if (!board[i][j]) {
                continue;
            }
            let squareId = (i << 4) | j;
            let pieceType = ''
            switch (board[i][j]?.type) {
                case 'b': pieceType = 'bishop'; break;
                case 'n': pieceType = 'knight'; break;
                case 'r': pieceType = 'rook'; break;
                case 'q': pieceType = 'queen'; break;
                case 'k': pieceType = 'king'; break;
                case 'p': pieceType = 'pawn'; break;
            }
            pieceMap[squareId] = {
                squareId: squareId,
                pieceColor: board[i][j]?.color === 'w' ? 'white' : 'black',
                pieceType: pieceType,
            }
        }
    }

    return pieceMap;
}
