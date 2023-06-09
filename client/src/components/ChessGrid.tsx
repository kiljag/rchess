import React, { useEffect, useState } from 'react';
import ChessSquare from './ChessSquare';
import { Chess, Square } from 'chess.js';
import { ChessState } from '../chess/store';
import { PieceMap, algebraic } from '../chess/util';
import { connect } from 'react-redux';
import movesound from '../assets/move-self.mp3';


interface ChessGridProps {
    chess: Chess,
    pieceMap: PieceMap,
    playerIsWhite: boolean,
    moves: string[],
    handleMove: (from: string, to: string) => void
}

const mapStateToProps = function (state: ChessState) {
    return {
        chess: state.chess,
        pieceMap: state.pieceMap,
        playerIsWhite: state.playerIsWhite,
        moves: state.moves,
    }
}

function ChessGrid(props: ChessGridProps) {

    const [selected, setSelected] = useState<number>(-1);
    const [legalMoves, setLegalMoves] = useState<{ [squareId: number]: boolean }>({});

    // handle clicks on chess squares
    function handleClick(squareId: number) {

        // player check
        if (props.playerIsWhite !== (props.chess.turn() === 'w')) {
            return;
        }

        if (selected < 0) {
            let isLegal = false;
            let moves = props.chess._moves();
            for (let i = 0; i < moves.length; i++) {
                if (moves[i].from === squareId) {
                    isLegal = true; break;
                }
            }
            if (!isLegal) return;

            // select a piece.
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
        }
    }

    // squares
    let squares: JSX.Element[] = [];
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            let squareId = (i << 4) | j;
            if (!props.playerIsWhite) {
                squareId = ((7 - i) << 4) | (7 - j);
            }
            let squareColor = (i + j) % 2 === 0 ? 'white' : 'black';
            squares.push(
                <ChessSquare key={squareId}
                    squareId={squareId}
                    squareColor={squareColor}
                    piece={props.pieceMap[squareId]}
                    playerIsWhite={props.playerIsWhite}
                    handleClick={handleClick}
                    isSelected={squareId === selected}
                    isAvaialble={legalMoves[squareId]}
                />
            );
        }
    }

    useEffect(() => {
        if (props.moves.length > 0) {
            let audio = new Audio(movesound);
            audio.loop = false;
            audio.play().catch((error) => {
                console.error("Failed to play audio: ", error);
            });
        }
    }, [props])

    return (
        <div className='board-container'>
            {squares}
        </div>
    );
}

export default connect(mapStateToProps)(ChessGrid);