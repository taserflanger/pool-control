import React, { Component } from 'react'

class ValueBroadcast extends Component {
    render() {
        return (
            <div className="valueBroadcast">
                <h3>{this.props.value}<span>{this.props.suffix}</span></h3>
            </div>
        );
    }
}

export default ValueBroadcast;
