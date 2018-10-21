import React, { Component } from 'react';
import './css/Title.css';

class Title extends Component {

    render() {
        /*
            props: size:
                         1: little title
                         2: category title
                         4: global title
                    onClick:
                         function to be executed on click
                    style: extra styling
        */
        return (
            <div style={this.props.style} onClick={() => this.props.onClick()} className={ `${this.props.size===1? "" : "d-block"} title-${this.props.size} text-center` }>
                {this.props.text}
            </div>
        );
    }
}

export default Title;