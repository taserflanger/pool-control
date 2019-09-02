import React, { Component } from 'react';
import PushButton from './PushButton';
import Title from './Title';
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
            <div className="category-item">
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
                <Display
                    value={this.props.value}
                    unit={this.props.unit}
                    class="blue"
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