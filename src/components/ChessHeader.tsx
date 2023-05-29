import React from 'react';
import { ChessState } from '../chess/store';
import { connect } from 'react-redux';

interface ChessHeaderProps {
    isWaiting: boolean,
    isPlaying: boolean,
    isGameover: boolean,
    isPlayersMove: boolean,
    gameLink: string,
    startGame: () => void,
}

const mapStateToProps = function (state: ChessState) {
    return {
        isWaiting: state.isWaiting,
        isPlaying: state.isPlaying,
        isGameover: state.isGameover,
        isPlayersMove: (state.chess.turn() === (state.playerIsWhite ? 'w' : 'b')),
        gameLink: state.gameLink,
    }
}

function ChessHeader(props: ChessHeaderProps) {

    let children: any;

    if (props.isWaiting) {
        children = (
            <>
                <div className='header-title'>Share the below link with your friend</div>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                }}>
                    <div className="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
                    <div className='header-content'>{props.gameLink}</div>
                </div>
            </>
        )

    }

    else if (props.isPlaying) {
        children = (
            <>
                <div className='header-title'>Playing Chess</div>
                <div className='header-content' style={{ border: 'none' }}>{props.isPlayersMove ? "Your turn" : "Opponent's turn"}</div>
            </>
        )
    }

    else if (props.isGameover) {
        children = (
            <>
                <div className='header-title'>{props.isPlayersMove ? 'You have won!' : 'Nice Game, Play another'}</div>
                <div className='header-content play-button'
                    onClick={props.startGame}
                >
                    Play with a Friend
                </div>
            </>
        )
    }

    else {
        children = (
            <>
                <div className='header-title'></div>
                <div className='header-content play-button'
                    onClick={props.startGame}
                >
                    Play with a Friend
                </div >
            </>
        )

    }

    return (
        <div className='header'>
            {children}
        </div>
    )
}

export default connect(mapStateToProps)(ChessHeader);

