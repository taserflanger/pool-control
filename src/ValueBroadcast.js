import React, { Component } from 'react';
import './css/ValueBroadcast.css';

class ValueBroadcast extends Component {
    render() {
        return (
            <div className="valueBroadcast">
                <h2>{Math.round(this.props.value, 4)}<span>{this.props.suffix}</span></h2>
            </div>
        );
    }
}

export default ValueBroadcast;
