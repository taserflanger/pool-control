import React, { Component } from 'react';
import './css/Button.css';
import {ThemeContext} from "./ThemeContext";
const ReactFitText = require('react-fittext')

class Button extends Component {

    render() {
        let id = this.props.id || "";
        return (
            <ReactFitText>
                <ThemeContext.Consumer>
                    {({color})=> (
                        <div
                            id={id}
                            className={
                                `button ${this.props.value?"active":""} ${color}`
                            }
                            onClick={this.props.onClick}
                        >
                            {this.props.inner?(
                                <h3>{this.props.inner}</h3>
                            ):""}
                        </div>
                    )}
                </ThemeContext.Consumer>
            </ReactFitText>

            
        );
    }
}

export default Button