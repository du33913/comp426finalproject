import React from "react";
import './Othello.css';
// import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';

function Square(props) {
    let colorMarkerClasses = props.value === 'X' ? 'marker white' : props.value === 'O' ? 'marker black' : '';
   return (
        <button
            className={"square " + (props.onMouseEnter ? "square--winning" : null)}
            onClick={props.onClick}
        >
            {props.value ? <div className={colorMarkerClasses}></div>: ''}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        return (<Square
            key={"square " + i}
            value={this.props.squares[i]}
            onClick={() => this.props.onClick(i)}
            onMouseEnter={this.props.onMouseEnter(i)}
        />);
    }

    render() {
        const rows = [];
        for (let j = 0; j < 8; j++) {
            const cols = [];
            for (let i = 0; i < 8; i++) {
                cols.push(this.renderSquare(i + (j * 8)))
            }
            rows.push(<div className="board-row" key={j}>{cols}</div>);
        }
        return (<div>{rows}</div>);
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        let store = Array(64).fill(null);
        store[27] = 'X';
        store[28] = 'O';
        store[35] = 'O';
        store[36] = 'X';
        this.state = {
            squares: store.slice(),
            whiteIsNext: true,
        }
    }

    resetGame() {
        let store2 = Array(64).fill(null);
        store2[27] = 'X';
        store2[28] = 'O';
        store2[35] = 'O';
        store2[36] = 'X';
        this.setState({
            squares: store2.slice(),
            whiteIsNext: true,
        })
    }

    calculateWinner(xNumbers, oNumbers) {
        return (xNumbers + oNumbers < 64) ? null : (xNumbers === oNumbers) ? 'XO' : (xNumbers > oNumbers ? 'X' : 'O');
    }



    handleClick(i) {
        const xNumbers = this.state.squares.reduce((result, value) => {return value === 'X' ? result + 1 : result}, 0);
        const oNumbers = this.state.squares.reduce((result, value) => {return value === 'O' ? result + 1 : result}, 0);
        const current = this.state.squares.slice();

        if (this.calculateWinner(xNumbers, oNumbers) || current[i]) {
            return;
        }

        if (this.checkValid(current, i, this.state.whiteIsNext)) {
            this.setState({squares: this.doMove(current, i)});
        } else {
            return;
        }
        if (this.checkLegitMove(!this.state.whiteIsNext)) {
            this.setState({whiteIsNext: !this.state.whiteIsNext});
        }
    }

    enteredSquare(i) {
        if (this.state.squares[i]) {
            return false;
        }
        return (this.checkValid(this.state.squares, i, this.state.whiteIsNext));
    }

    render() {
        const xNumbers = this.state.squares.reduce((result, value) => {return value === 'X' ? result + 1 : result}, 0);
        const oNumbers = this.state.squares.reduce((result, value) => {return value === 'O' ? result + 1 : result}, 0);
        const current = this.state.squares.slice();
        let winner = this.calculateWinner(xNumbers, oNumbers);

        if (!this.checkLegitMove(!this.state.whiteIsNext) && !this.checkLegitMove(this.state.whiteIsNext)) {
            winner = xNumbers === oNumbers ? 'XO' : xNumbers > oNumbers ? 'X' : 'O';
        }

        let status = winner ? (winner === 'XO') ? "It's a draw" : (winner === 'X' ? "Game Over. White wins. Score: " + xNumbers + " to " + oNumbers :
            "Game Over. Black wins. Score: " + oNumbers + " to " + xNumbers) : this.state.whiteIsNext ? "White's turn" : "Black's turn";

        return (
            <div className="game">
                <div className="game-left-side">
                    <div className="game-board">
                        <Board
                            squares={current}
                            onClick={i => this.handleClick(i)}
                            onMouseEnter={i => this.enteredSquare(i)}
                        />
                    </div>
                    <div className={"game-status"}>
                        {status}&nbsp;{winner ? <button onClick={() => this.resetGame()}>Play again</button> : ''}
                    </div>
                </div>
                <div className={"game-info"}>
                    <div>White markers: {xNumbers}</div>
                    <div>Black markers: {oNumbers}</div>
                </div>
                <div>
                    {/*<AmplifySignOut />*/}
                </div>
            </div>
        )

    }

    checkLegitMove(checker) {
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (this.state.squares[(j + (i * 8))] == null) {
                    if (this.checkValid(this.state.squares.slice(), (j + (i * 8)), checker)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    checkValid(squares, i, checker) {
        const x = Math.floor(i / 8);
        const y = i % 8;
        let compare;
        let other;
        if (checker) {
            compare = 'X';
            other = 'O';
        } else {
            compare = 'O';
            other = 'X';
        }

        //column
        //up
        if (y - 1 >= 0) {
            if (squares[((8 * x) + (y - 1))] === other) {
                for (let k = 2; k <= y; k++) {
                    if (squares[((8 * x) + (y - k))] == null) {
                        break;
                    }
                    if (squares[((8 * x) + (y - k))] === compare) {
                        return true;
                    }
                }
            }
        }

        //down
        if (y + 1 < 8) {
            if (squares[((8 * x) + (y + 1))] === other) {
                for (let k = 2; k < (8 - y); k++) {
                    if (squares[((8 * x) + (y + k))] == null) {
                        break;
                    }
                    if (squares[((8 * x) + (y + k))] === compare) {
                        return true;
                    }
                }
            }
        }

        // row
        //left
        if (x - 1 >= 0) {
            if (squares[(8 * (x - 1)) + y] === other) {
                for (let k = 2; k <= x; k++) {
                    if (squares[(8 * (x - k)) + y] == null) {
                        break;
                    }
                    if (squares[(8 * (x - k)) + y] === compare) {
                        return true;
                    }
                }
            }
        }

        // right
        if (x + 1 < 8) {
            if (squares[(8 * (x + 1)) + y] === other) {
                for (let k = 2; k <= (8 -x); k++) {
                    if (squares[(8 * (x + k)) + y] == null) {
                        break;
                    }
                    if (squares[(8 * (x + k)) + y] === compare) {
                        return true;
                    }
                }
            }
        }

        // diag
        // up
        let z = 2;
        if ((x + 1) < 8 && (y - 1) >= 0) {
            if (squares[(8 * (x + 1)) + (y - 1)] === other) {
                while ((x + z) < 8 && (y - z) >= 0) {
                    if (squares[(8 * (x + z)) + (y - z)] == null) {
                        break;
                    }
                    if (squares[(8 * (x + z)) + (y - z)] === compare) {
                        return true;
                    }
                    z++;
                }
            }
        }

        //down
        z = 2;
        if ((x - 1) >= 0 && (y + 1) < 8) {
            if (squares[(8 * (x - 1)) + (y + 1)] === other) {
                while ((x - z) >= 0 && (y + z) < 8) {
                    if (squares[(8 * (x - z)) + (y + z)] == null) {
                        break;
                    }
                    if (squares[(8 * (x - z)) + (y + z)] === compare) {
                        return true;
                    }
                    z++;
                }
            }
        }

        // anti-diag
        // up
        z = 2;
        if ((x - 1) >= 0 && (y - 1) >= 0) {
            if (squares[(8 * (x - 1)) + (y - 1)] === other) {
                while ((x - z) >= 0 && (y - z) >= 0) {
                    if (squares[(8 * (x - z)) + (y - z)] == null) {
                        break;
                    }
                    if (squares[(8 * (x - z)) + (y - z)] === compare) {
                        return true;
                    }
                    z++;
                }
            }
        }

        // down
        z = 2;
        if ((x + 1) < 8 && (y + 1) < 8) {
            if (squares[(8 * (x + 1)) + (y + 1)] === other) {
                while ((x + z) < 8 && (y + z) < 8) {
                    if (squares[(8 * (x + z)) + (y + z)] == null) {
                        break;
                    }
                    if (squares[(8 * (x + z)) + (y + z)] === compare) {
                        return true;
                    }
                    z++;
                }
            }
        }

        return false;
    }

    doMove(square, i) {
        const x = Math.floor(i / 8);
        const y = i % 8;
        let compare;
        let other;
        let squares = square.slice();
        if (this.state.whiteIsNext) {
            compare = 'X';
            other = 'O';
        } else {
            compare = 'O';
            other = 'X';
        }

        //column
        //up
        if (y - 1 >= 0) {
            if (squares[((8 * x) + (y - 1))] === other) {
                for (let k = 2; k <= y; k++) {
                    if (squares[((8 * x) + (y - k))] == null) {
                        break;
                    }
                    if (squares[((8 * x) + (y - k))] === compare) {
                        squares[i] = compare;
                        for (let j = 1; j < k; j++) {
                            squares[(8 * x) + (y - j)] = compare;
                        }
                        break;
                    }
                }
            }
        }

        //down
        if (y + 1 < 8) {
            if (squares[((8 * x) + (y + 1))] === other) {
                for (let k = 2; k < (8 - y); k++) {
                    if (squares[((8 * x) + (y + k))] == null) {
                        break;
                    }
                    if (squares[((8 * x) + (y + k))] === compare) {
                        squares[i] = compare;
                        for (let j = 1; j < k; j++) {
                            squares[(8 * x) + (y + j)] = compare;
                        }
                        break;
                    }
                }
            }
        }

        // row
        //left
        if (x - 1 >= 0) {
            if (squares[(8 * (x - 1)) + y] === other) {
                for (let k = 2; k <= x; k++) {
                    if (squares[(8 * (x - k)) + y] == null) {
                        break;
                    }
                    if (squares[(8 * (x - k)) + y] === compare) {
                        squares[i] = compare;
                        for (let j = 1; j < k; j++) {
                            squares[(8 * (x - j)) + y] = compare;
                        }
                        break;
                    }
                }
            }
        }

        // right
        if (x + 1 < 8) {
            if (squares[(8 * (x + 1)) + y] === other) {
                for (let k = 2; k <= (8 -x); k++) {
                    if (squares[(8 * (x + k)) + y] == null) {
                        break;
                    }
                    if (squares[(8 * (x + k)) + y] === compare) {
                        squares[i] = compare;
                        for (let j = 1; j < k; j++) {
                            squares[(8 * (x + j)) + y] = compare;
                        }
                        break;
                    }
                }
            }
        }

        // diag
        // up
        let z = 2;
        if ((x + 1) < 8 && (y - 1) >= 0) {
            if (squares[(8 * (x + 1)) + (y - 1)] === other) {
                while ((x + z) < 8 && (y - z) >= 0) {
                    if (squares[(8 * (x + z)) + (y - z)] == null) {
                        break;
                    }
                    if (squares[(8 * (x + z)) + (y - z)] === compare) {
                        squares[i] = compare;
                        for (let j = 1; j < z; j++) {
                            squares[(8 * (x + j)) + (y - j)] = compare;
                        }
                        break;
                    }
                    z++;
                }
            }
        }

        //down
        z = 2;
        if ((x - 1) >= 0 && (y + 1) < 8) {
            if (squares[(8 * (x - 1)) + (y + 1)] === other) {
                while ((x - z) >= 0 && (y + z) < 8) {
                    if (squares[(8 * (x - z)) + (y + z)] == null) {
                        break;
                    }
                    if (squares[(8 * (x - z)) + (y + z)] === compare) {
                        squares[i] = compare;
                        for (let j = 1; j < z; j++) {
                            squares[(8 * (x - j)) + (y + j)] = compare;
                        }
                        break;
                    }
                    z++;
                }
            }
        }

        // anti-diag
        // up
        z = 2;
        if ((x - 1) >= 0 && (y - 1) >= 0) {
            if (squares[(8 * (x - 1)) + (y - 1)] === other) {
                while ((x - z) >= 0 && (y - z) >= 0) {
                    if (squares[(8 * (x - z)) + (y - z)] == null) {
                        break;
                    }
                    if (squares[(8 * (x - z)) + (y - z)] === compare) {
                        squares[i] = compare;
                        for (let j = 1; j < z; j++) {
                            squares[(8 * (x - j)) + (y - j)] = compare;
                        }
                        break;
                    }
                    z++;
                }
            }
        }

        // down
        z = 2;
        if ((x + 1) < 8 && (y + 1) < 8) {
            if (squares[(8 * (x + 1)) + (y + 1)] === other) {
                while ((x + z) < 8 && (y + z) < 8) {
                    if (squares[(8 * (x + z)) + (y + z)] == null) {
                        break;
                    }
                    if (squares[(8 * (x + z)) + (y + z)] === compare) {
                        squares[i] = compare;
                        for (let j = 1; j < z; j++) {
                            squares[(8 * (x + j)) + (y + j)] = compare;
                        }
                        break;
                    }
                    z++;
                }
            }
        }

        return squares;
    }
}

export default Game;