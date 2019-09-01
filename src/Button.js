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
        let align = this.props.align || "left";
        let id = this.props.id || "";
        return (
            <div className={`btn-border-container ${this.props.class ||""}`}>
            <div className={`btn-border ${this.props.loading?"loading":""}`}>
            <div id={id} className={`Button-${this.props.value} ${this.props.square? "square" : ""} Button text-${align}`}>

                <div
                    onClick={() => this.props.onClick(this.props.name)}
                    className={`${this.props.value.toString()} ${this.props.color=="green"?"green": "blue"}`}
                >
                {/* <div className={`lds-ring ${this.props.loading?"":"invisible"}`}>
                    <div></div><div></div><div></div><div></div>
                </div> */}
                <p className={this.props.title.lenght==1?"single":""}>{this.props.title}</p></div>
                {this.getSubtitle()}
            </div>
            </div>
            </div>
            
        );
    }
}

export default Button