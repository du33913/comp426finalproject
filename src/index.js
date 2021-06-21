import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'
import Game from './Othello'
import Amplify from 'aws-amplify';
import config from './aws-exports';
Amplify.configure(config);

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);