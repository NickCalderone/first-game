import React from "react";
import logo from "./logo.svg";
import "./App.css";

function BuildBoard(props) {
    let rowsArray = [];
    let squareClass = "";

    for (let i = 0; i < 15; i++) {
        for (let j = 0; j < 15; j++) {
            let squareId = i + "_" + j;
            squareClass = props.board[i][j] ? "box red" : "box blue";

            rowsArray.push(
                <Square
                    squareClass={squareClass}
                    key={squareId}
                    squareId={squareId}
                    row={i}
                    column={j}
                    toggle={props.toggle}
                />
            );
        }
    }

    return <div className="grid">{rowsArray}</div>;
}

class App extends React.Component {
    constructor(props) {
        super();

        this.toggle = this.toggle.bind(this);
        this.arrayClone = this.arrayClone.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);

        this.state = {
            intervalId: "",
            currentDirection: "",
            gameStarted: false,
            board: Array(15)
                .fill()
                .map(() => Array(15).fill(false)),
            speed: 100,
            columnPos: 7,
            rowPos: 7,
            snake: [[7, 7], [8, 8]],
            size: 100
        };
    }

    componentDidMount() {
        // toggle starting position
        this.toggle(this.state.columnPos, this.state.rowPos);

        document.addEventListener("keydown", this.handleKeyPress);
    }

    move() {
        switch (this.state.currentDirection) {
            case 38: //up
                this.setState(
                    previousState => {
                        return {
                            columnPos: previousState.columnPos - 1
                        };
                    },
                    () => this.drawSnake()
                );
                break;
            case 39: //right
                this.setState(
                    previousState => {
                        return {
                            rowPos: previousState.rowPos + 1
                        };
                    },
                    () => this.drawSnake()
                );
                break;
            case 40: //down
                this.setState(
                    previousState => {
                        return {
                            columnPos: previousState.columnPos + 1
                        };
                    },
                    () => this.drawSnake()
                );
                break;
            case 37: //left
                this.setState(
                    previousState => {
                        return {
                            rowPos: previousState.rowPos - 1
                        };
                    },
                    () => this.drawSnake()
                );
                break;
            default:
                break;
        }
    }

    handleKeyPress(e) {
        if (e.keyCode === 37 || 38 || 39 || 40) {
            e.preventDefault();
        }

        this.setState(
            {
                currentDirection: e.keyCode
            },
            () => {
                if (this.state.gameStarted === false) {
                    this.startGame();

                    this.setState({
                        gameStarted: true
                    });
                }
            }
        );
    }

    test(copy) {
        for (let i = 0; i < copy.length; i++) {
            if (copy[i] === [[7, 7]]) {
                alert("lost");
            }
        }
    }

    drawSnake() {
        let copy = this.arrayClone(this.state.snake);

        if (this.state.snake.length === this.state.size) {
            this.toggle(copy[0][0], copy[0][1], false);
            copy.shift();
        }

        for (let i = 0; i < copy.length; i++) {
            if (
                copy[i][0] === this.state.columnPos &&
                copy[i][1] === this.state.rowPos
            ) {
                return alert("lost");
            }
        }

        copy.push([this.state.columnPos, this.state.rowPos]);
        copy.forEach(x => this.toggle(x[0], x[1]));
        this.setState({
            snake: copy
        });
    }

    toggle(column, row, status = true) {
        let newArray = this.arrayClone(this.state.board);
        newArray[column][row] = status;

        this.setState({
            board: newArray
        });
    }

    startGame() {
        var intervalId = setInterval(() => this.move(), 1000);
        // store intervalId in the state so it can be accessed later:
        this.setState({ intervalId: intervalId });
    }

    arrayClone(array) {
        let clone = [...array];
        return clone;

        // return JSON.parse(JSON.stringify(array));
    }

    render() {
        return (
            <div className="view">
                <BuildBoard board={this.state.board} />
            </div>
        );
    }
}

function Square(props) {
    return <div className={props.squareClass} />;
}

export default App;
