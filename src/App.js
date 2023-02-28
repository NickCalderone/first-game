import React from "react";
import "./App.css";

function BuildBoard(props) {
    let rowsArray = [];
    let squareClass = "";

    for (let i = 0; i < 15; i++) {
        for (let j = 0; j < 15; j++) {
            let squareId = i + "_" + j;
            squareClass = "box " + props.board[i][j];

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
        this.dropFood = this.dropFood.bind(this);
        this.resetGame = this.resetGame.bind(this);
        this.updateBoard = this.updateBoard.bind(this);
        this.setup = this.setup.bind(this);

        this.boardTemplate = Array(15)
            .fill()
            .map(() => Array(15).fill("blue"));

        this.state = {
            intervalId: "",
            nextDirection: "",
            currentDirection: "",
            previousDirection: "",
            foodPos: [],
            gameStarted: false,
            board: Array(15)
                .fill()
                .map(() => Array(15).fill("blue")),
            speed: 100,
            columnPos: 7,
            rowPos: 7,
            snake: [[7, 7]],
            size: 1
        };
    }

    arrayClone(array) {
        let clone = [...array];
        return clone;

        // return JSON.parse(JSON.stringify(array));
    }

    checkMove(next) {
        if (
            next === this.state.currentDirection + 2 ||
            next === this.state.currentDirection - 2
        ) {
            return this.state.currentDirection;
        } else return next;
    }

    componentDidMount() {
        this.dropFood();
        document.addEventListener("keydown", this.prevDefault);
        document.addEventListener("keydown", this.updateDirection);
        document.addEventListener("keydown", this.startGame);
    }

    gameSetup() {
        let boardCopy = Array(15)
            .fill()
            .map(() => Array(15).fill("blue"));

        boardCopy[7][7] = "red";
        boardCopy[this.state.foodPos[0]][this.state.foodPos[1]] = "green";
        this.setState({
            board: boardCopy,
            gameStarted: false
        });
    }

    drawSnake() {
        let snakeCopy = this.arrayClone(this.state.snake);
        let boardCopy = Array(15)
            .fill()
            .map(() => Array(15).fill("blue"));

        this.loseCheck(snakeCopy);
        this.snakeHead(snakeCopy);
        this.foodCheck(snakeCopy);
        this.updateBoard(boardCopy, snakeCopy);

        this.setState({
            snake: snakeCopy,
            board: this.updateBoard(boardCopy, snakeCopy)
        });
    }

    // set snakeCopy to empty array to allow it to be called on componentDidMount
    dropFood(snakeCopy = []) {
        let col = this.getRandomInt(15);
        let row = this.getRandomInt(15);

        for (let i = 0; i < snakeCopy.length; i++) {
            if (snakeCopy[i][0] === col && snakeCopy[i][1] === row) {
                return this.dropFood(snakeCopy);
            }
        }

        this.setState(
            {
                foodPos: [col, row]
            },
            () => this.setup()
        );
    }

    foodCheck(snakeCopy) {
        if (
            snakeCopy[snakeCopy.length - 1][0] === this.state.foodPos[0] &&
            snakeCopy[snakeCopy.length - 1][1] === this.state.foodPos[1]
        ) {
            this.dropFood(snakeCopy);
            this.setState(previousState => {
                return {
                    size: previousState.size + 1
                };
            });
        }
    }

    getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }

    loseCheck(snakeCopy) {
        for (let i = 0; i < snakeCopy.length; i++) {
            if (
                snakeCopy[i][0] === this.state.columnPos &&
                snakeCopy[i][1] === this.state.rowPos
            ) {
                this.setState(
                    {
                        gameStarted: false
                    },
                    () => {
                        alert(
                            "You Made It Through " +
                                (this.state.size - 1) +
                                " Rounds!"
                        );

                        this.resetGame();
                    }
                );
            }
        }
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

    resetGame() {
        if (this.state.gameStarted === false) {
            clearInterval(this.state.intervalId);
            this.setState(
                {
                    intervalId: "",
                    nextDirection: "",
                    currentDirection: "",
                    previousDirection: "",
                    foodPos: [],
                    gameStarted: false,
                    board: Array(15)
                        .fill()
                        .map(() => Array(15).fill("blue")),
                    speed: 100,
                    columnPos: 7,
                    rowPos: 7,
                    snake: [[7, 7]],
                    size: 1
                },
                () => {
                    this.dropFood();
                }
            );
        }
    }

    setup() {
        if (this.state.gameStarted === false) {
            let boardCopy = Array(15)
                .fill()
                .map(() => Array(15).fill("blue"));

            boardCopy[7][7] = "red";
            boardCopy[this.state.foodPos[0]][this.state.foodPos[1]] = "green";

            this.setState({ board: boardCopy });
        }
    }

    snakeHead(snakeCopy) {
        snakeCopy.push([this.state.columnPos, this.state.rowPos]);
        if (this.state.snake.length === this.state.size) {
            snakeCopy.shift();
        }

        // snakeCopy.forEach(x => this.toggle(x[0], x[1]));
        return snakeCopy;
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

    toggle(column, row, status = true) {
        let newArray = this.arrayClone(this.state.board);
        newArray[column][row] = status;

        this.setState({
            board: newArray
        });
    }

    updateBoard(boardCopy, snakeCopy) {
        for (let i = 0; i < snakeCopy.length; i++) {
            boardCopy[snakeCopy[i][0]][snakeCopy[i][1]] = "red";
        }

        // snakeCopy.forEach(x => {
        //     boardCopy[x[0]][x[1]] = "red";
        // });

        // not sure why or operator works here, seems like it should be the and operator
        if (
            this.state.foodPos[0] !== this.state.columnPos ||
            this.state.foodPos[1] !== this.state.rowPos
        ) {
            boardCopy[this.state.foodPos[0]][this.state.foodPos[1]] = "green";
        }
        return boardCopy;
    }

    updateDirection(e) {
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

    render() {
        return (
            <div>
                <h2 class="score">Round: {this.state.size - 1}</h2>
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
