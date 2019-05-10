import React, { Component } from 'react';
import Title from './Title';
import './css/ImageToggle.css';

class ImageToggle extends Component {

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
                {this.props.value? "Eteindre" : "Allumer"}
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
            <div id={id} className={`imageToggle-${this.props.value} ` + this.props.className}>
                {this.getTitle()}
                <a  className={`imageToggle text-${align}`}>
                    <div onClick={() => this.props.onClick(this.props.name)} className={this.props.value.toString()}></div>
                </a>
                {this.getSubtitle()}
            </div>
            
        );
    }
}

export default ImageToggle