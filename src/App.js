import React from "react";
import logo from "./logo.svg";
import "./App.css";

function BuildBoard(props) {
    let rowsArray = [];
    let squareClass = "";

    for (let i = 0; i < 20; i++) {
        for (let j = 0; j < 30; j++) {
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
            board: Array(20)
                .fill()
                .map(() => Array(30).fill(false)),
            speed: 100,
            columnPos: 10,
            rowPos: 15,
            snake: [[0, 0], [1, 1]],
            size: 1
        };
    }

    componentDidMount() {
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
                    () => this.toggle(this.state.columnPos, this.state.rowPos)
                );
                break;
            case 39: //right
                this.setState(
                    previousState => {
                        return {
                            rowPos: previousState.rowPos + 1
                        };
                    },
                    () => this.toggle(this.state.columnPos, this.state.rowPos)
                );
                break;
            case 40: //down
                this.setState(
                    previousState => {
                        return {
                            columnPos: previousState.columnPos + 1
                        };
                    },
                    () => this.toggle(this.state.columnPos, this.state.rowPos)
                );
                break;
            case 37: //left
                this.setState(
                    previousState => {
                        return {
                            rowPos: previousState.rowPos - 1
                        };
                    },
                    () => this.toggle(this.state.columnPos, this.state.rowPos)
                );
                break;
            default:
                break;
        }
    }

    handleKeyPress(e) {
        e.preventDefault();
        this.setState({
            currentDirection: e.keyCode
        });
        // switch (e.keyCode) {
        //     case 38: //up
        //         console.log("up");

        //         e.preventDefault();

        //         this.setState(
        //             previousState => {
        //                 return {
        //                     columnPos: previousState.columnPos - 1,
        //                     currentDirection: e.keycode
        //                 };
        //             },
        //             () => this.toggle(this.state.columnPos, this.state.rowPos)
        //         );
        //         break;
        //     case 39: //right
        //         console.log("right");
        //         e.preventDefault();
        //         this.setState(
        //             previousState => {
        //                 return {
        //                     rowPos: previousState.rowPos + 1
        //                 };
        //             },
        //             () => this.toggle(this.state.columnPos, this.state.rowPos)
        //         );
        //         break;
        //     case 40: //down
        //         console.log("down");
        //         e.preventDefault();
        //         this.setState(
        //             previousState => {
        //                 return {
        //                     columnPos: previousState.columnPos + 1
        //                 };
        //             },
        //             () => this.toggle(this.state.columnPos, this.state.rowPos)
        //         );
        //         break;
        //     case 37: //left
        //         console.log("left");
        //         e.preventDefault();
        //         this.setState(
        //             previousState => {
        //                 return {
        //                     rowPos: previousState.rowPos - 1
        //                 };
        //             },
        //             () => this.toggle(this.state.columnPos, this.state.rowPos)
        //         );
        //         break;
        //     default:
        //         break;
        // }
    }

    drawSnake() {
        this.state.snake.forEach(x => this.toggle(x[0], x[1]));
    }

    toggle(column, row, status = true) {
        let newArray = this.arrayClone(this.state.board);
        newArray[column][row] = status;

        this.setState({
            board: newArray
        });
    }

    startGame() {
        var intervalId = setInterval(() => this.move(), 400);
        // store intervalId in the state so it can be accessed later:
        this.setState({ intervalId: intervalId });
    }

    arrayClone(array) {
        return JSON.parse(JSON.stringify(array));
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
