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
            <div id={id} className={`Button-${this.props.value}`}>
                {/* {this.getTitle()} */}
                <a  className={`Button text-${align}`}>
                    <div onClick={() => this.props.onClick(this.props.name)} className={`${this.props.value.toString()} ${this.props.color=="green"?"green": "blue"}`}><p>{this.props.title}</p></div>
                </a>
                {this.getSubtitle()}
            </div>
            
        );
    }
}

export default Button