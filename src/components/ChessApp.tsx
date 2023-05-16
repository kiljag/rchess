import React, { useState } from 'react';
import ChessGrid from './ChessGrid';
import { Chess } from 'chess.js';
import { PieceMap, getPieceMap } from './chessTypes';

const chess = new Chess();

const squareWidth = 70;
const playerIsWhite = true;

export default function ChessApp() {

    const [pieceMap, setPieceMap] = useState<PieceMap>(getPieceMap(chess));

    function handleMove(from: string, to: string) {
        console.log('move : ', from, to);
        chess.move(from + to);
        setPieceMap(getPieceMap(chess));
    }

    return (
        <ChessGrid
            chess={chess}
            pieceMap={pieceMap}
            squareWidth={squareWidth}
            playerIsWhite={playerIsWhite}
            handleMove={handleMove}
        />
    )
}