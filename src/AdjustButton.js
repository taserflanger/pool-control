import React, { Component } from 'react';
import PushButton from './PushButton';
import Display from './Display';
import './css/ToggleAdjustButton.css';

class ToggleAdjustButton extends Component {
    constructor(props) {
        super(props);
        this.state={
            minus: false,
            plus: false
        }
    }

    render() {
        return(
            <div className="ToggleAdjustButton">
                <PushButton
                    onMouseDown={()=>this.setState({minus:true})}
                    onMouseUp={()=>{
                        this.setState({minus: false});
                        this.props.onChangeValue(-1);
                    }}
                    inner="-"
                    name={this.props.name+"_minus"}
                    value={this.state.minus}
                />
                <Display
                    value={this.props.value}
                    unit={this.props.unit}
                    class="active cursor-default"
                />
                <PushButton
                    onMouseDown={()=>this.setState({plus:true})}
                    onMouseUp={()=>{
                        this.setState({plus: false});
                        this.props.onChangeValue(1);
                    }}
                    inner="+"
                    name={this.props.name+"_plus"}
                    value={this.state.plus}
                />
            </div>
        );
    }
}

export default ToggleAdjustButton;