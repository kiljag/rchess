import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './styles/pieces.css';
import ChesApp from './components/ChessApp';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <ChesApp />
  </React.StrictMode>
);
