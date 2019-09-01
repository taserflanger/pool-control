import React, { Component } from 'react';
import './css/ValueBroadcast.css';

class ValueBroadcast extends Component {
    render() {
        return (
            <div className={`valueBroadcast ${this.props.class?this.props.class:""}`}>
                <h2>{`${Math.round(this.props.value, 4)}${this.props.suffix}`}</h2>
            </div>
        );
    }
}

export default ValueBroadcast;
