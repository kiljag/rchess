import React from 'react';
import ChessHeader from './ChessHeader';
import ChessGrid from './ChessGrid';
import { Provider } from 'react-redux';
import { store } from '../chess/store';
import * as game from '../chess/game';

export default function ChessApp() {


    function startGame() {
        game.startChessGame();
    }

    function handleMove(from: string, to: string) {
        let move = from + to;
        console.log(`move : ${from}-${to}`);
        game.makeChessMove(move);
    }

    return (
        <div>
            <Provider store={store}>
                <ChessHeader
                    startGame={startGame}
                />
                <ChessGrid
                    handleMove={handleMove}
                />
            </Provider>

        </div>
    )
}