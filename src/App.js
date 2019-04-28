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

        this.checkMove = this.checkMove.bind(this);
        this.toggle = this.toggle.bind(this);
        this.arrayClone = this.arrayClone.bind(this);
        this.prevDefault = this.prevDefault.bind(this);
        this.startGame = this.startGame.bind(this);
        this.updateDirection = this.updateDirection.bind(this);

        this.state = {
            intervalId: "",
            nextDirection: "",
            currentDirection: "",
            previousDirection: "",
            foodPos: [],
            gameStarted: false,
            board: Array(15)
                .fill()
                .map(() => Array(15).fill(false)),
            speed: 100,
            columnPos: 7,
            rowPos: 7,
            snake: [[7, 7]],
            size: 1
        };
    }

    getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }

    dropFood() {
        let col = this.getRandomInt(15);
        let row = this.getRandomInt(15);

        this.setState(
            {
                foodPos: [col, row]
            },
            this.toggle(col, row)
        );
    }

    componentDidMount() {
        // toggle starting position
        this.toggle(this.state.columnPos, this.state.rowPos);
        this.dropFood();
        document.addEventListener("keydown", this.prevDefault);
        document.addEventListener("keydown", this.updateDirection);
        document.addEventListener("keydown", this.startGame);
    }

    checkMove(next) {
        if (
            next === this.state.currentDirection + 2 ||
            next === this.state.currentDirection - 2
        ) {
            return this.state.currentDirection;
        } else return next;
    }

    move() {
        let x = this.checkMove(this.state.nextDirection);
        switch (x) {
            case 38: //up
                let a = this.state.columnPos === 0 ? -14 : 1;
                this.setState(
                    previousState => {
                        return {
                            columnPos: previousState.columnPos - a,
                            currentDirection: x
                        };
                    },
                    () => this.drawSnake()
                );
                break;
            case 39: //right
                let b = this.state.rowPos === 14 ? -14 : 1;
                this.setState(
                    previousState => {
                        return {
                            rowPos: previousState.rowPos + b,
                            currentDirection: x
                        };
                    },
                    () => this.drawSnake()
                );
                break;
            case 40: //down
                let c = this.state.columnPos === 14 ? -14 : 1;
                this.setState(
                    previousState => {
                        return {
                            columnPos: previousState.columnPos + c,
                            currentDirection: x
                        };
                    },
                    () => this.drawSnake()
                );
                break;
            case 37: //left
                let d = this.state.rowPos === 0 ? -14 : 1;
                this.setState(
                    previousState => {
                        return {
                            rowPos: previousState.rowPos - d,
                            currentDirection: x
                        };
                    },
                    () => this.drawSnake()
                );
                break;
            default:
                break;
        }
    }

    prevDefault(e) {
        if (
            e.keyCode === 37 ||
            e.keyCode === 38 ||
            e.keyCode === 39 ||
            e.keyCode === 40
        ) {
            e.preventDefault();
        } else {
            return false;
        }
    }

    prev180(e) {
        // prevent 180 degree turns
        if (this.state.size > 1) {
            switch (e.keyCode) {
                case 38: //up
                    if (this.state.nextDirection === 40) {
                        return;
                    }
                    break;
                case 39: //right
                    if (this.state.nextDirection === 37) {
                        return;
                    }
                    break;
                case 40: //down
                    if (this.state.nextDirection === 38) {
                        return;
                    }
                    break;
                case 37: //left
                    if (this.state.nextDirection === 39) {
                        return;
                    }
                    break;
                default:
                    break;
            }
        }
    }

    updateDirection(e) {
        console.log(e.keyCode);
        if (
            // this.state.size > 1 &&
            e.keyCode === 37 ||
            e.keyCode === 38 ||
            e.keyCode === 39 ||
            e.keyCode === 40
        ) {
            this.setState({ nextDirection: e.keyCode });
        }
    }

    drawSnake() {
        let copy = this.arrayClone(this.state.snake);

        this.loseCheck(copy);
        this.snakeHead(copy);
        this.foodCheck(copy);
        this.snakeTail(copy);

        this.setState({
            snake: copy
        });
    }

    test(arg) {
        if (arg === "yes") {
            return;
        } else {
            this.setState({
                size: 10
            });
        }
    }

    foodCheck(copy) {
        if (
            copy[copy.length - 1][0] === this.state.foodPos[0] &&
            copy[copy.length - 1][1] === this.state.foodPos[1]
        ) {
            this.dropFood();
            copy.size = copy.size + 1;
            this.setState(previousState => {
                return {
                    size: previousState.size + 1
                };
            });
        }
    }

    loseCheck(copy) {
        for (let i = 0; i < copy.length; i++) {
            if (
                copy[i][0] === this.state.columnPos &&
                copy[i][1] === this.state.rowPos
            ) {
                return alert("lost");
            }
        }
    }

    snakeTail(copy) {
        if (this.state.snake.length === this.state.size) {
            this.toggle(copy[0][0], copy[0][1], false);
            copy.shift();
        }
        return copy;
    }

    snakeHead(copy) {
        copy.push([this.state.columnPos, this.state.rowPos]);
        // copy.forEach(x => this.toggle(x[0], x[1]));
        this.toggle(copy[copy.length - 1][0], copy[copy.length - 1][1]);
        return copy;
    }

    toggle(column, row, status = true) {
        let newArray = this.arrayClone(this.state.board);
        newArray[column][row] = status;

        this.setState({
            board: newArray
        });
    }

    startGame(e) {
        if (this.state.gameStarted === false) {
            let intervalId = setInterval(() => this.move(), 200);
            // store intervalId in the state so it can be accessed later:

            this.setState(previousState => {
                return {
                    gameStarted: true,
                    nextDirection: e.keyCode,
                    intervalId: intervalId
                };
            });
        }
    }

    arrayClone(array) {
        let clone = [...array];
        return clone;

        // return JSON.parse(JSON.stringify(array));
    }

    render() {
        return (
            <div>
                <h3>Snake Size: {this.state.size}</h3>
                <div className="view">
                    <BuildBoard board={this.state.board} />
                </div>
            </div>
        );
    }
}

function Square(props) {
    return <div className={props.squareClass} />;
}

export default App;
