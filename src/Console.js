import React, { Component } from 'react';
import "./css/Console.css"
let justChangedLine=false

class Console extends Component {

    constructor(props) {
        super(props);
        this.state={
            lines: []
        }
    }

    componentDidMount() {
        this.props.io.on(`update_console`, (newLine)=> {
            let newLines = this.state.lines.slice();
            newLines.splice(0, 0, (newLine));
            this.setState({lines:newLines});
        });
    }
    GetLines() {
        let result = [];
        for (let i=0; i<this.state.lines.length; i++) {
            result.push(
                <div key={i} className="console_line">
                <p>{this.state.lines[i]}</p></div>
            )
        }
        return result;
    }

    render() {
        return (
            <div className="console">
                {this.GetLines()}
                <div className="console_line">
                    <p>{this.props.lastLine}</p>
                </div>
            </div>
        )
    }
}

export default Console;
