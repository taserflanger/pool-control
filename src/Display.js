import React, { Component } from 'react';
import './css/Display.css';

class Display extends Component {
    render() {
        return (
            <div className={`button ${this.props.class?this.props.class:""}`}>
                <span>{`${Math.round(this.props.value, 4)}${this.props.unit}`}</span>
            </div>
        );
    }
}

export default Display;
