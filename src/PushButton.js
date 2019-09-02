import React, { Component } from 'react';
import Title from './Title';
import './css/Button.css';

class PushButton extends Component {

    constructor(props) {
        super(props);
        this.state={
            hover: false
        }
    }

    getTitle() {
        if (this.props.title!=="") {
            return (
                <div className="row align-items-center">
                    <div className="col">
                        <Title size={1} align="center" text={this.props.title}></Title>
                    </div>
                </div>
            );
        } return;
    }

    getSubtitle() {
        if (this.props.name==="is_on") {
            return (
            <p>
                {this.props.value? "ON" : "OFF"}
            </p>
            );
        } return;
    }

    hover(b) {
        this.setState({
            hover: b
        })
    }

    render() {
        let id = this.props.id || "";
        return (
            <div className={`btn-border ${this.props.loading?"loading":""} ${this.props.round?"round":""}`}>
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
                        <p>{this.props.title}</p></div>
                {this.getSubtitle()}
            </div>
            </div>
            
        );
    }
}

export default PushButton