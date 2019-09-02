import React, { Component } from 'react';
import './css/Display.css';

class Display extends Component {
    render() {
        return (
            <div className={`Display ${this.props.class?this.props.class:""}`}>
                <h2>{`${Math.round(this.props.value, 4)}${this.props.unit}`}</h2>
            </div>
        );
    }
}

export default Display;
