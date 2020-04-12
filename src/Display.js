import React, { Component } from 'react';
import './css/Display.css';
import {ThemeContext} from "./ThemeContext";

class Display extends Component {
    render() {
        return (
            <ThemeContext.Consumer>
                {({color})=>(
                    <div className={`button ${this.props.class?this.props.class:""} ${color}`}>
                        <span>{`${Math.round(this.props.value, 4)}${this.props.unit}`}</span>
                    </div>
                )}
            </ThemeContext.Consumer>

        );
    }
}

export default Display;
