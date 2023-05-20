import React from 'react';
import { ChessState } from '../chess/store';
import { connect } from 'react-redux';

interface ChessHeaderProps {
    isWaiting: boolean,
    isPlaying: boolean,
    isGameover: boolean,
    gameLink: string,
    startGame: () => void,
}

const mapStateToProps = function (state: ChessState) {
    return {
        isWaiting: state.isWaiting,
        isPlaying: state.isPlaying,
        isGameover: state.isGameover,
        gameLink: state.gameLink,
    }
}

function ChessHeader(props: ChessHeaderProps) {
    console.log('header props : ', props);
    let header: any;

    if (props.isWaiting) {
        header = `GameLink : ${props.gameLink}`;

    } else if (props.isPlaying) {
        header = 'Play Chess!';

    } else if (props.isGameover) {
        header = 'Game Over';

    } else {
        header = (<button onClick={props.startGame}>START GAME</button>);
    }

    return (
        <div className='header'>
            <div>{header}</div>
        </div>
    )
}

export default connect(mapStateToProps)(ChessHeader);

