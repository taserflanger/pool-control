import React, { Component } from 'react';
import Title from './Title';
import './css/Button.css';

class PushButton extends Component {
    render() {
        let id = this.props.id || "";
        return (
            <div id={id} className={`Button`}>
                {/* {this.getTitle()} */}
                    <div 
                    onMouseDown={() => this.props.onMouseDown(this.props.name)}
                    onTouchStart={() => this.props.onMouseDown(this.props.name)}
                    onMouseUp={()=>this.props.onMouseUp(this.props.name)}
                    onTouchEnd={()=>this.props.onMouseUp(this.props.name)}
                    className={`${this.props.value.toString()} ${this.props.color=="green"?"green": "blue"} ${this.props.round? "round" : ""}`}>
                        {/* <div className={`lds-ring ${this.props.loading?"":"invisible"}`}>
                    <div></div><div></div><div></div><div></div>
                </div> */}
                        <p>{this.props.inner}</p></div>
            </div>
            
        );
    }
}

export default PushButton