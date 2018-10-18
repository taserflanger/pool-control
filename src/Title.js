import React, { Component } from 'react';
import './css/Title.css';

class Title extends Component {

    render() {

        return (
            <div style={this.props.style} onClick={() => this.props.onClick()} className={ `${this.props.size===1? "" : "d-block"} title-${this.props.size} ${this.props.align} 
            ${this.props.size===1? "": "text-white"} text-center shadow-box` }>
                {this.props.text}
            </div>
        );
    }
}

export default Title;