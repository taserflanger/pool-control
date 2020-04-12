import React, { Component } from 'react';
import './css/Button.css';
import {ThemeContext} from "./ThemeContext";
import ReactFitText from 'react-fittext';

class PushButton extends Component {
    render() {
        let id = this.props.id || "";
        return (
            <ReactFitText>
                <ThemeContext.Consumer>
                    {({color})=>(
                        <div
                            id={id}
                            className={
                                `button ${this.props.value?"active":""} ${color}`
                            }
                            onMouseDown={() => this.props.onMouseDown(this.props.name)}
                            onTouchStart={() => this.props.onMouseDown(this.props.name)}
                            onMouseUp={()=>this.props.onMouseUp(this.props.name)}
                            onTouchEnd={()=>this.props.onMouseUp(this.props.name)}

                        >
                            {this.props.inner?(<h3>{this.props.inner}</h3>):""}
                        </div>
                    )}
                </ThemeContext.Consumer>
            </ReactFitText>


            
        );
    }
}

export default PushButton