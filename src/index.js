import React from 'react';
import ReactDOM from 'react-dom';
import Game from './Othello'
// import Amplify, { Auth } from 'aws-amplify';
import awsconfig from './aws-exports';
Amplify.configure(awsconfig);


ReactDOM.render(
    <Game />,
    document.getElementById('root')
);