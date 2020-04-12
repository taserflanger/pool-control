import React, { Component } from 'react';
import './css/Button.css';
import {ThemeContext} from "./ThemeContext";

class Button extends Component {

    render() {
        let id = this.props.id || "";
        return (
            <ThemeContext.Consumer>
                {({color})=> (
                    <div
                        id={id}
                        className={
                            `button ${this.props.value?"active":""} ${color}`
                        }
                        onClick={this.props.onClick}
                    >
                        {this.props.inner?(<span>{this.props.inner}</span>):""}
                    </div>
                )}
            </ThemeContext.Consumer>

            
        );
    }
}

export default Button