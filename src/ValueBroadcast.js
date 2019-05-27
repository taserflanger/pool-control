import React, { Component } from 'react';
import './css/ValueBroadcast.css';

class ValueBroadcast extends Component {
    render() {
        return (
            <div className="valueBroadcast">
                <h2>{this.props.value}<span>{this.props.suffix}</span></h2>
            </div>
        );
    }
}

export default ValueBroadcast;
