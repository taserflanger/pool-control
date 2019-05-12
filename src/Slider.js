import React, { Component } from 'react';
import Title from './Title';
import './css/Slider.css';
import Category from './Category';

class Slider extends Component {
    render() {
        return (
            <div className="slidecontainer">
                
                {this.getTitle()}
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

    getTitle() {
        if(this.props.title) {
            return <Title text={this.props.title} size={1} />;
        }
        return;
    }
}

export default Slider;