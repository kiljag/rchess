import React, { useState } from 'react';
import ChessSquare from './ChessSquare';
import ChessPiece from './ChessPiece';
import { Chess, Square } from 'chess.js';
import { PieceMap, algebraic } from './chessTypes';


let testPlayerIsWhite = true;

interface ChessGridProps {
    chess: Chess,
    pieceMap: PieceMap,
    playerIsWhite: boolean,
    squareWidth: number,
    handleMove: (from: string, to: string) => void
}

export default function ChessGrid(props: ChessGridProps) {

    const [selected, setSelected] = useState<number>(-1);
    const [legalMoves, setLegalMoves] = useState<{ [squareId: number]: boolean }>({});

    // console.log(legalMoves);

    // handle clicks on chess squares
    function handleClick(squareId: number) {

        const whitesTurn = (props.chess.turn() === 'w')

        // test player check
        if ((testPlayerIsWhite && !whitesTurn) || (!testPlayerIsWhite && whitesTurn)) {
            return;
        }

        // select a piece.
        if (selected < 0) {
            let isLegal = false;
            let moves = props.chess._moves();
            for (let i = 0; i < moves.length; i++) {
                if (moves[i].from == squareId) {
                    isLegal = true; break;
                }
            }

            if (!isLegal) return;
            let square = algebraic(squareId);
            let pieceMoves = props.chess._moves({ square: square as Square });

            let legalMoves: { [squareId: number]: boolean } = {}
            for (let i = 0; i < pieceMoves.length; i++) {
                legalMoves[pieceMoves[i].to] = true;
            }
            setSelected(squareId);
            setLegalMoves(legalMoves);

        } else {

            if (!legalMoves[squareId]) {
                setSelected(-1);
                setLegalMoves({});
                return;
            }

            // make a move
            setSelected(-1);
            setLegalMoves({});
            props.handleMove(algebraic(selected), algebraic(squareId));
            testPlayerIsWhite = !testPlayerIsWhite;
        }

        // move
    }

    // squares
    let squares: JSX.Element[] = [];
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            let squareId = (i << 4) | j;
            squares.push(
                <ChessSquare key={squareId}
                    squareId={squareId}
                    piece={props.pieceMap[squareId]}
                    playerIsWhite={props.playerIsWhite}
                    squareWidth={props.squareWidth}
                    handleClick={handleClick}
                    isSelected={squareId === selected}
                    isAvaialble={legalMoves[squareId]}
                />
            );
        }
    }

    // pieces
    let pieces: JSX.Element[] = [];
    for (let squareId in props.pieceMap) {
        let piece = props.pieceMap[squareId];
        pieces.push(
            <ChessPiece key={squareId}
                pieceType={piece.pieceType}
                pieceColor={piece.pieceColor}
                squareId={piece.squareId}
                playerIsWhite={props.playerIsWhite}
                squareWidth={props.squareWidth}
                handleClick={handleClick}
            />
        )
    }

    // css properties
    let styles: React.CSSProperties = {
        height: 8 * props.squareWidth,
        width: 8 * props.squareWidth,
    }

    return (
        <div className='grid' style={styles}>
            {squares}
            {pieces}
        </div>
    )
}