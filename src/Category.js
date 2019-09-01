import React, { Component } from 'react';
import Button from './Button';
import PushButton from './PushButton'
import Title from './Title'
import Slider from './Slider';
import ValueBroadcast from './ValueBroadcast';
import Console from './Console';
import './css/Category.css';
import {io} from './index';
import ToggleAdjustButton from './ToggleAdjustButton';
import AdjustButton from './AdjustButton';


class Category extends Component {

    constructor(props) {
        super(props)
        let loading=new Array(this.props.names.length);
        loading.fill(false);
        this.state = {
            values: this.props.initialValues,
            loading: loading,
            toggleValue: (this.props.initialToggleValue)? this.props.initialToggleValue : null,
            visible: this.props.defaultVisible
        }
    }

    componentDidMount() {
        if (this.props.isToggleGroup) {
            io.on(`update_${this.props.toggleGroupName}`, (val) => {
                this.setState({toggleValue: val});
                this.setVariableLoading(this.props.names[val], false);
            });
        } else {
            for (let i=0; i<this.props.names.length; i++) {
                io.on(`update_${this.props.names[i]}`, (val)=> {
                    let newValues = this.state.values.slice();
                    newValues[i] = val;
                    this.setState({values: newValues});
                    this.setVariableLoading(this.props.names[i], false);
                })
            }
        }

    }

    setVariableLoading(variable, bool=true) {
        let index = this.props.names.indexOf(variable);
        let newLoading = this.state.loading.slice();
        newLoading[index]=bool;
        this.setState({loading: newLoading});
    }

    handleToggleAdjustButtonIsOn(variable) {
        let index = this.props.names.indexOf(variable);
        io.emit('setValue', variable, {"isOn": !this.state.values[index].isOn, "value": this.state.values[index].value})
        this.setVariableLoading(variable);
    }

    handleAdjustButtonValue(variable, value) {
        let index = this.props.names.indexOf(variable);
        io.emit('setValue', variable, this.state.values[index] + value);
        this.setVariableLoading(variable);   
    }

    handleToggleAdjustButtonValue(variable, value, index) {
        index = this.props.names.indexOf(variable);

        io.emit('setValue', variable, {"isOn": this.state.values[index].isOn, "value": this.state.values[index].value+value});
        this.setVariableLoading(variable);
    }

    handlePushButton(variable, value) {
        io.emit('setValue', variable, value);
        this.setVariableLoading(variable);
    }

    handleButtonClick(variable) {
        let index = this.props.names.indexOf(variable);
        let value = this.state.values[index];
        console.log(variable, value);
        io.emit('setValue', variable, !value);
        this.setVariableLoading(variable);
    }
    
    handleButtonGroup(variable) {
        let index = this.props.names.indexOf(variable);
        io.emit('setValue', this.props.toggleGroupName, index);
        this.setVariableLoading(variable);
    }

    handleSliderChange(i, value) {
        const newValues = this.state.values.slice()
        newValues[i] = value;
        let variable = this.props.names[i];
        this.setState({
            values: newValues
        }, this.setValue(variable, value));
    }


    setValue(variable, value) {
        io.emit('setValue', variable, value);
    }

    getCategoryContent(begin, end) {
        let result = [];
        let singleType = this.props.types.length === 1
        let type = singleType? this.props.types[0] : null;
        let isToggleGroup = this.props.isToggleGroup | false;
        let colSize = this.props.colSize | ""
        for (var i=begin; i<end; i++) {
            if (this.props.types[i]==="Button" || type==="Button") {
                if (isToggleGroup && this.props.toggleIndices.includes(i)) {
                    result.push(
                        <div key={i}className={`col${colSize}`}>
                        <Title size={1} align="center" text={this.props.titles[i]} />
                        <Button 
                        onClick={(name)=>this.handleButtonGroup(name)}
                        name={this.props.names[i]}
                        value={(this.state.toggleValue===i)}
                        subtitles={[]}
                        loading={this.state.loading[i]}
                        title=""
                        class="special"
                        />
                    </div>);
                } else {
                    result.push(
                    <div key={i}className={`col${colSize}`}>
                        {this.getTitle(i)}
                        <Button 
                            onClick={(name)=>this.handleButtonClick(name)}
                            name={this.props.names[i]}
                            value={this.state.values[i]}
                            subtitles={[]}
                            title={this.getPushTitle(i)}
                            loading={this.state.loading[i]}
                            class="special"
                        />
                    </div>);
                }
            } if (this.props.types[i]=="PushButton") {
                result.push(
                    <div key={i} className={`col${colSize}`}>
                        {this.getTitle(i)}
                        <PushButton
                            onMouseDown={(name)=>this.handlePushButton(name, true)}
                            onMouseUp={(name)=>this.handlePushButton(name, false)}
                            name={this.props.names[i]}
                            value={this.state.values[i]}
                            subtitles={[]}
                            title={this.getPushTitle(i)}
                            loading={this.state.loading[i]}
                        />
                    </div>
                )
            }
            
            if (this.props.types[i]==="Slider" || type==="Slider") {
                result.push(
                    this.getSlider(i)
                    );
            } if (this.props.types[i]==="ValueBroadcast" || type==="ValueBroadcast") {
                result.push(
                    <div key={i} className={`col${colSize}`}>
                        <Title size={1} align="center" text={this.props.titles[i]} />
                        <ValueBroadcast
                            value={this.state.values[i]}
                            suffix={this.props.boradcastSuffixes[i]}
                        />
                    </div>
                );
            } if (this.props.types[i]==="Console" || type==="Console") {
                result.push(
                    <Console
                        key={i}
                        io={io}
                    />
                )
            } if (this.props.types[i]==="ToggleAdjustButton") {
                result.push(
                    <ToggleAdjustButton
                        key={i}
                        isOn={this.state.values[i].isOn}
                        onChangeValue={(name, val)=>this.handleToggleAdjustButtonValue(name, val)}
                        value={this.state.values[i].value}
                        onClick={(name)=>this.handleToggleAdjustButtonIsOn(name)}
                        title={this.props.titles[i]}
                        name={this.props.names[i]}
                        loading={this.state.loading[i]}
                        suffix={this.props.suffixes[i]}
                    />
                )
            } if (this.props.types[i]==="AdjustButton") {
                result.push(
                    <AdjustButton 
                        key={i}
                        onChangeValue={(name, val)=>this.handleAdjustButtonValue(name, val)}
                        value={this.state.values[i]}
                        title={this.props.titles[i]}
                        name={this.props.names[i]}
                        suffix={this.props.suffixes[i]}
                    />
                )
            }
        }
        return result;
    }

    getTitle(i) {
        if (this.props.upperTitles) {
            if (this.props.upperTitles[i]) {
               return <Title size={1} align="center" text={this.props.titles[i]} />;
            }
        }
        return;
    }

    getPushTitle(i) {
        if (this.props.titles[i]) {
            if (this.props.upperTitles) {
                if (!this.props.upperTitles[i]) {
                    return this.props.titles[i];
                }
            } else {
                return this.props.titles[i]
            }
        }
        return "";
    }

    getSlider(i) {
        let cl_name= this.props.disabled? "col-8 disabled" : "col-8";
        return <div key={i} className= {cl_name}>
            <Slider
                onChange={(e) => {
                    if (this.props.disabled) {
                        return;
                    }
                    this.handleSliderChange(i, parseInt(e.target.value, 10))
                }}
                value={this.state.values[i]}
                name={this.props.names[i]}
                align={this.props.align} 
                title={this.props.titles[i]}
                min="1" max="5"
                suffix={<a>m<sup>3</sup>/h</a>}
            />
        </div>;
    }

    getRows() {
        if (!this.state.visible) {
            return;
        }
        let result = []
        let alignedCenter = this.props.aligneCenter? "align-items-center" : "";
        result.push(
            <div key = {0} className={`row justify-content-around ${alignedCenter}`}>
                {this.getCategoryContent(0, this.props.names.length)}
            </div>
        )
        return result
    }

    render() {
        return (
            <div 
            className="category"
            id={this.props.title.toLowerCase()}
            >
            
            <Title size="2" text={this.props.title} align={this.props.align} onClick={()=>{this.setState({visible: !this.state.visible})}}/>

            <div className="container">
                { this.getRows() }
            </div>
            </div>
        );
    }
}

export default Category