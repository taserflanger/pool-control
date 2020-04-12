import React, { Component } from 'react';
import './css/Display.css';
import {ThemeContext} from "./ThemeContext";
import ReactFitText from 'react-fittext';

class Display extends Component {
    render() {
        return (
            <ReactFitText compressor={4}>
                <ThemeContext.Consumer>
                    {({color})=>(
                        <div className={`button ${this.props.class?this.props.class:""} ${color}`}>
                            <h3>{`${Math.round(this.props.value, 4)}${this.props.unit}`}</h3>
                        </div>
                    )}
                </ThemeContext.Consumer>
            </ReactFitText>


        );
    }
}

export default Display;
