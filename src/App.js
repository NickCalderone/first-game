import React from "react";
import logo from "./logo.svg";
import "./App.css";

class App extends React.Component {
    constructor(props) {
        super();

        this.state = {
            board: Array(this.rows)
                .fill()
                .map(() => Array(this.columns).fill(false)),
            speed: 100,
            rows: 30,
            columns: 50
        };
    }

    buildBoard() {
        const width = this.props.columns * 19;
        let rowsArray = [];
        let squareClass = "";

        for (let i = 0; i < this.state.rows; i++) {
            for (let j = 0; j < this.state.columns; j++) {
                let squareId = i + "_" + j;
                squareClass = this.props.board[i][j] ? "red" : "blue";

                rowsArray.push(
                    <Square
                        squareClass={squareClass}
                        key={squareId}
                        squareId={squareId}
                        row={i}
                        column={j}
                        toggle={this.props.toggle}
                    />
                );
            }
        }

        return(
            <div className="grid" style={{width: width}}>
                {rowsArray[]}
            </div>
        )
    }

    Square() {
        return <div class="box" />;
    }

    render() {
        return (
            <div class="view">
                <div className="row">
                    {this.square()}
                    {this.square()}
                </div>
                <div style={{ padding: "0px", margin: "0px", display: "flex" }}>
                    {this.square()}
                    {this.square()}
                </div>
            </div>
        );
    }
}

export default App;
