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
            <div className="col0">
                <Title size={1}text={this.props.title}/>
            <div className="ToggleAdjustButton">
                <PushButton
                    onMouseDown={()=>this.setState({minus:true})}
                    onMouseUp={()=>{
                        this.setState({minus: false});
                        this.props.onChangeValue(this.props.name, -1);
                    }}
                    title="-"
                    name={this.props.name+"_minus"}
                    value={this.state.minus}
                />
                <Button
                    onClick={(name)=>this.props.onClick(name)}
                    name={this.props.name}
                    value={this.props.isOn}
                    subtitles={[]}
                    title={`${this.props.value}${this.props.suffix||""}`}
                    loading={this.props.loading}
                />
                <PushButton
                    onMouseDown={()=>this.setState({plus:true})}
                    onMouseUp={()=>{
                        this.setState({plus: false});
                        this.props.onChangeValue(this.props.name, 1);
                    }}
                    title="+"
                    name={this.props.name+"_plus"}
                    value={this.state.plus}
                />
            </div>
            </div>
        );
    }
}

export default ToggleAdjustButton;