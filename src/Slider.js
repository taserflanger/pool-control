import React, { Component } from 'react';
import Title from './Title';
import './css/Slider.css';

class Slider extends Component {
    render() {
        return (
            <div className="slidecontainer">
                <Title text={this.props.title} size={1} />
                <input
                    type="range"
                    min={this.props.min} max={this.props.max}
                    value={ this.props.value }
                    className="slider"
                    onChange= {(e) => this.props.onChange(e)}
                />
                <p>{this.props.value} {this.props.suffix}</p>
            </div>
        );
    }
}

export default Slider;