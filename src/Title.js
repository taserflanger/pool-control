import React, { Component } from 'react';

class Title extends Component {

    render() {

        return (
            <div className={ `${this.props.size===1? "" : "d-block"} title-${this.props.size} ${this.props.align} 
            ${this.props.size===1? "": "text-white"} text-center shadow-box` }>
                {this.props.text}
            </div>
        );
    }
}

export default Title;