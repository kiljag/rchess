
import React from 'react';
import { Piece } from './chessTypes';


interface ChessSquareProps {
    squareId: number, // 0x88 notation
    piece: Piece,
    playerIsWhite: boolean, // if player's side is white
    squareWidth: number,
    isSelected: boolean,
    isAvaialble: boolean, // available for target position
    handleClick: (squareId: number) => void,
}

export default function ChessSquare(props: ChessSquareProps) {

    let i = props.squareId >> 4;
    let j = props.squareId & 0xf;
    let squareColor = (i + j) % 2 === 0 ? 'white' : 'black';

    // set coordinates
    let styles: React.CSSProperties = {
        position: 'absolute',
        left: (props.playerIsWhite ? j : 7 - j) * props.squareWidth,
        top: (props.playerIsWhite ? i : 7 - i) * props.squareWidth,
        height: props.squareWidth,
        width: props.squareWidth,
    };

    let isAttackable = props.piece && (
        (props.piece.pieceColor === 'black' && props.playerIsWhite) ||
        (props.piece.pieceColor === 'white' && !props.playerIsWhite)
    );

    return (
        <div className={`square-container ${squareColor}`}
            style={styles}
            onClick={() => props.handleClick(props.squareId)}
        >
            {props.isSelected && <div className='square-selected'></div>}

            {props.isAvaialble && (isAttackable ?
                (<div className='square-attackable'></div>) :
                (<div className='square-available'></div>))
            }
        </div >
    )
}
