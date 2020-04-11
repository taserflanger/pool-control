import React, { Component } from 'react';
import Title from './Title';
import './css/Button.css';

class Button extends Component {

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
        }
    }

    getSubtitle() {
        if (this.props.name==="is_on") {
            return (
            <p>
                {this.props.value? "ON" : "OFF"}
            </p>
            );
        }
    }

    hover(b) {
        this.setState({
            hover: b
        })
    }

    render() {
        let align = this.props.align || "left";
        let id = this.props.id || "";
        return (
            <div id={id} className={`${this.props.square? "square" : ""} Button`}>

                <div
                    onClick={this.props.onClick}
                    className={`${this.props.value.toString()} ${this.props.color=="green"?"green": "blue"}`}
                >
                {/* <div className={`lds-ring ${this.props.loading?"":"invisible"}`}>
                    <div></div><div></div><div></div><div></div>
                </div> */}
                <p>{this.props.inner}</p></div>
                {this.getSubtitle()}
            </div>
            
        );
    }
}

export default Button