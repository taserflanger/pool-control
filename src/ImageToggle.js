import React, { Component } from 'react';
import CrossfadeImage from './CrossfadeImage';
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
        let size = this.props.size || 3;
        let path = this.props.paths[this.props.value? 1 : 0]
        path = this.state.hover?  path.slice(0, -4) + "_hover.png" : path;
        let duration = this.state.hover? 10: 300;
        return (
            <div className={`imageToggle-${this.props.value}`}>
                {this.getTitle()}
                <a onClick={() => this.props.onClick(this.props.name)} className={`imageToggle text-${align}`}>
                    <CrossfadeImage duration={duration} onMouseOver={(b) => this.hover(b)} src={path} alt={this.props.name} style = {{width: size+"em", height:size+"em"}}/>
                </a>
                {this.getSubtitle()}
            </div>
            
        );
    }
}

export default ImageToggle