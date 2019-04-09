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
    		key ={i}
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
  	let gridSize = 3;
  	let gridArr = []

  	for(let i=0; i<gridSize; i++) {
  		gridArr.push(i);
  	}  	

  	const createRow = (i) => {
  		let row = []
  		for (let j = 0; j < gridSize; j++) {
  		 row.push(this.renderSquare(i*gridSize + j));
  		}		
  		return row;
  	}

    return (
    	<div>
    			{
    				gridArr.map((elem, id) => {
	    				return (
	    					<div key = {id} className="board-row">
	    						{createRow(id)}
	    					</div>
	    				);
	    			})
	    		}
    		{this.renderResetButton()}
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
				lastMove: ''
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
		const lastMove = `${squares[i]} placed in row ${(i-i%3)/3 + 1}, column ${i%3 + 1}`
		this.setState({
			history: history.concat([{
				squares: squares,
				lastMove: lastMove,
			}]),
			stepNumber: history.length,
			xIsNext: !this.state.xIsNext,
		});
	}

	handleReset() {
		this.setState({
			history: [{
				squares: Array(9).fill(null),
				lastMove: ''
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
  			let lastMove = step.lastMove
  			return (
	  			<li key={move}>
	  				<button onClick={() => this.jumpTo(move)}>
	  					{`Return to move ${move} (${lastMove})` }
	  				</button>
	  			</li>
	  		);
  		} else {
  			return null;
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