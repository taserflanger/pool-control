import React, { Component } from 'react';
let justChangedLine=false

class Console extends Component {

    constructor(props) {
        super(props);
        this.state={
            lines: []
        }
    }

    componentDidUpdate() {
        if (justChangedLine) {
            justChangedLine=false;
            return;
        } else {
            let newLines = this.state.lines.slice();
            newLines.splice(0, 0, (this.props.lastLine));
            this.setState({lines:newLines});
            justChangedLine = true;
        }
    }
    GetLines() {
        let result = [];
        for (let i=0; i<this.state.lines.length-1; i++) {
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
