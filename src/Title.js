import React, { Component } from 'react';
import './css/Title.css';
import {ThemeContext} from "./ThemeContext";

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
       let handleClick = this.props.onClick? this.props.onClick : function() {}
        return (
            <ThemeContext.Consumer>
                {({color})=> (
                    <div onClick={() => handleClick()} className={`${this.props.size===1?"item-title":"category-title"} ${color}` }>
                        {this.props.text}
                    </div>
                )}
            </ThemeContext.Consumer>

        );
    }
}

export default Title;