import React, { Component } from 'react';
import './css/Button.css';

class PushButton extends Component {
    render() {
        let id = this.props.id || "";
        return (
            <div
                id={id}
                className={
                    `button ${this.props.value.toString()} ${this.props.color==="green"?"green": "blue"}`
                }
                onMouseDown={() => this.props.onMouseDown(this.props.name)}
                onTouchStart={() => this.props.onMouseDown(this.props.name)}
                onMouseUp={()=>this.props.onMouseUp(this.props.name)}
                onTouchEnd={()=>this.props.onMouseUp(this.props.name)}

            >
                {this.props.inner?(<span>{this.props.inner}</span>):""}
            </div>
            
        );
    }
}

export default PushButton