import React, { Component } from 'react';
import Button from './Button';
import PushButton from './PushButton';
import Title from './Title';
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
                <Button
                    onClick={()=>this.props.onClick()}
                    name={this.props.name}
                    value={this.props.isOn}
                    subtitles={[]}
                    inner={`${this.props.value}${this.props.unit||""}`}
                    loading={this.props.loading}
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