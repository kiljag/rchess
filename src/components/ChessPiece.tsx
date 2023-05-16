import React from 'react';

interface ChessPieceProps {
    pieceType: string,
    pieceColor: string,
    squareId: number,
    playerIsWhite: boolean,
    squareWidth: number,
    handleClick: (squareId: number) => void,
}

export default function ChessPiece(props: ChessPieceProps) {

    let i = props.squareId >> 4;
    let j = props.squareId & 0xf;
    // set coordinates
    let styles: React.CSSProperties = {
        height: props.squareWidth,
        width: props.squareWidth,
        left: (props.playerIsWhite ? j : 7 - j) * props.squareWidth,
        top: (props.playerIsWhite ? i : 7 - i) * props.squareWidth,
    };

    return (
        <div className={`piece-container ${props.pieceColor}-${props.pieceType}`}
            style={styles}
            onClick={() => props.handleClick(props.squareId)}
        >
            <div className={`piece ${props.pieceType}-${props.pieceColor}`}></div>
        </div >
    );
}

