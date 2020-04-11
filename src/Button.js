import React, { Component } from 'react';
import './css/Button.css';

class Button extends Component {

    render() {
        let id = this.props.id || "";
        return (
            <div
                id={id}
                className={
                    `button ${this.props.value?"active":""} ${this.props.color==="green"?"green": "blue"}`
                }
                onClick={this.props.onClick}
            >
                {this.props.inner?(<span>{this.props.inner}</span>):""}
            </div>
            
        );
    }
}

export default Button