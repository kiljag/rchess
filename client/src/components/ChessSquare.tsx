
import React from 'react';
import { Piece } from '../chess/util';


interface ChessSquareProps {
    squareId: number, // 0x88 notation
    squareColor: string,
    piece: Piece,
    playerIsWhite: boolean, // if player's side is white
    isSelected: boolean,
    isAvaialble: boolean, // available for target position
    handleClick: (squareId: number) => void,
}

export default function ChessSquare(props: ChessSquareProps) {

    let pieceCls = props.piece ? `${props.piece.pieceType}-${props.piece.pieceColor}` : '';

    let isAttackable = props.isAvaialble && props.piece &&
        (props.piece.pieceColor !== (props.playerIsWhite ? 'white' : 'black'));

    let squareCls = isAttackable ? 'square-attackable' : props.isSelected ? 'square-selected' : '';

    return (
        <div className={`square square-${props.squareColor} ${squareCls}`}
            onClick={() => props.handleClick(props.squareId)}
        >
            {props.isAvaialble && !isAttackable &&
                <div className='square-available'>
                </div>
            }
            {props.piece &&
                <div className={`piece ${pieceCls}`}>
                </div>
            }
        </div >
    )
}
