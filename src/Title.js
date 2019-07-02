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
            <div style={this.props.style} onClick={() => handleClick()} className={ `${this.props.size===1? "" : "d-block"} ${this.props.color=="green"? "green": "blue"} title-${this.props.size} text-center` }>
                {this.props.text}
            </div>
        );
    }
}

export default Title;