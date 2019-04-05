import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


function ResetButton(props) {
	return (
		<button onClick={props.onReset} id="reset">
			{'Restart Game'}
		</button>
	);
}

function Square(props) {
  return (
    <button 
    	className="square" 
    	onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
    	<Square 
    		value={this.props.squares[i]}
    		onClick={() => this.props.onClick(i)} 
    	/>
    );
  }

  renderResetButton() {
  	return (
  		<ResetButton onReset={() => this.props.onReset()}/>
  	);
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
        <div>
        	{this.renderResetButton()}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
	constructor(props) {
		super(props)
		this.state =  {
			history: [{
				squares: Array(9).fill(null),
			}],
			stepNumber: 0,
			xIsNext: true,
		}
	}

	handleClick(i) {
		const history = this.state.history.slice(0, this.state.stepNumber + 1);
		const current = history[history.length -1];
		const squares = current.squares.slice();
		if (calculateWinner(squares) || squares[i]) {
			return;
		}
		squares[i] = this.state.xIsNext ? 'X' : 'O';
		this.setState({
			history: history.concat([{
				squares: squares,
			}]),
			stepNumber: history.length,
			xIsNext: !this.state.xIsNext,
		});
	}

	handleReset() {
		this.setState({
			history: [{
				squares: Array(9).fill(null),
			}],
			stepNumber: 0,
			xIsNext: true,
		})
	}

	jumpTo(step) {
		this.setState({
			stepNumber: step,
			xIsNext: (step % 2) === 0,
		});
	}

  render() {
  	const history = this.state.history;
  	const current = history[this.state.stepNumber];
  	const winner = calculateWinner(current.squares);

  	const moves = history.map((step, move) => {
  		if (move > 0) {
  			return (
	  			<li key={move}>
	  				<button onClick={() => this.jumpTo(move)}>
	  					{'Return to move #' + move }
	  				</button>
	  			</li>
	  		);
  		}
  	});

  	let status;
  	if (winner === 'X' || winner === 'O') {
  		status = 'Winner: ' + winner;
  	} else if (winner === 'tie') {
  		status = 'Tied game!'
  	} else {
  		status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
  	} 

    return (
      <div className="game">
        <div className="game-board">
          <Board 
          	squares={current.squares}
          	onClick={(i) => this.handleClick(i)}
          	onReset={() => this.handleReset()}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    } 
  } if (squares.filter(elem => elem === null).length === 0) {
    	return 'tie';
  }
  return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);