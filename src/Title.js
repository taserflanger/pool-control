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
       let handleClick = this.props.onClick? this.props.onClick : function() {return}
        return (
            <div style={this.props.style} onClick={() => handleClick()} className={`title-${this.props.size}` }>
                {this.props.text}
            </div>
        );
    }
}

export default Title;