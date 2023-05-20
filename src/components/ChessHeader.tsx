
import React from 'react';

interface ChessHeaderProps {
    header: string,
    startGame: () => void;
}

export default function ChessHeader(props: ChessHeaderProps) {
    return (
        <div className='header'>
            <div>{props.header}</div>
            <button onClick={props.startGame}>START GAME</button>
        </div>
    )
}