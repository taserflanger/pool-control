import React, { Component } from 'react';
import Button from './Button';
import PushButton from './PushButton'
import Title from './Title'
import Slider from './Slider';
import Display from './Display';
import Console from './Console';
import './css/Category.css';
import {io} from './index';


class Category extends Component {

    constructor(props) {
        super(props)
        let loading=new Array(this.props.names.length);
        loading.fill(false);
        this.state = {
            values: this.props.initialValues,
            loading: loading,
            toggleValue: (this.props.initialToggleValue)? this.props.initialToggleValue : null
        }
    }

    componentDidMount() {
        if (this.props.isToggleGroup) {
            io.on(`update_${this.props.toggleGroupName}`, (val) => {
                this.setState({toggleValue: val});
            });
        } else {
            for (let i=0; i<this.props.names.length; i++) {
                io.on(`update_${this.props.names[i]}`, (val)=> {
                    let newValues = this.state.values.slice();
                    newValues[i] = val;
                    this.setState({values: newValues});
                })
            }
        }

    }

    handlePushButton(variable, value) {
        io.emit('setValue', variable, value);
    }

    handleButtonClick(variable, value) {
        io.emit('setValue', variable, !value);
    }
    
    handleButtonGroup(key) {
        let index = this.props.names.indexOf(key);
        io.emit('setValue', this.props.toggleGroupName, index);
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
                        />
                    </div>);
                } else {
                    result.push(
                    <div key={i}className={`col${colSize}`}>
                        <Button 
                            onClick={(name)=>this.handleButtonClick(name, this.state.values[i])}
                            name={this.props.names[i]}
                            value={this.state.values[i]}
                            subtitles={[]}
                            title={(this.props.titles[i])? this.props.titles[i] : ""}
                            loading={this.state.loading[i]}
                        />
                    </div>);
                }
            } if (this.props.types[i]=="PushButton") {
                result.push(
                    <div key={i} className={`col${colSize}`}>
                        <PushButton
                            onMouseDown={(name)=>this.handlePushButton(name, true)}
                            onMouseUp={(name)=>this.handlePushButton(name, false)}
                            name={this.props.names[i]}
                            value={this.state.values[i]}
                            subtitles={[]}
                            title={(this.props.titles[i])? this.props.titles[i] : ""}
                            loading={this.state.loading[i]}
                        />
                    </div>
                )
            }
            
            if (this.props.types[i]==="Slider" || type==="Slider") {
                result.push(
                    this.getSlider(i)
                    );
            } if (this.props.types[i]==="Display" || type==="ValueBroadcast") {
                result.push(
                    <div key={i} className={`col${colSize}`}>
                        <Title size={1} align="center" text={this.props.titles[i]} />
                        <Display
                            value={this.state.values[i]}
<<<<<<< HEAD
                            unit={this.props.units?this.props.units[i]:""}
                        />
                    </div>),
                "Console": (<Console
                                key={i}
                                io={io}
                            />),
                "ToggleAdjustButton": (
                    <div className="category-item">
                        <Title size={1}text={this.props.titles[i]}/>
                        <ToggleAdjustButton
                        key={i}
                        isOn={this.state.values[i].isOn}
                        onChangeValue={(name, val)=>this.handleToggleAdjustButtonValue(name, val)}
                        value={this.state.values[i].value}
                        onClick={(name)=>this.handleToggleAdjustButtonIsOn(name)}
                        title={this.props.titles[i]}
                        name={this.props.names[i]}
                        loading={this.state.loading[i]}
                        unit={this.props.units?this.props.units[i]:""}
                    />
                    </div>
                ),
                "AdjustButton": (
                    <div className="category-item">
                        <AdjustButton 
                            key={i}
                            onChangeValue={(name, val)=>this.handleAdjustButtonValue(name, val)}
                            value={this.state.values[i]}
                            title={this.props.titles[i]}
                            name={this.props.names[i]}
                            unit={this.props.units?this.props.units[i]:""}
=======
                            unit={this.props.units[i]}
>>>>>>> old
                        />
                    </div>
                );
            } if (this.props.types[i]==="Console" || type==="Console") {
                result.push(
                    <Console
                        io={io}
                    />
                )
            }
        }
        return result;
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
            
            <Title size="2" text={this.props.title} align={this.props.align} onClick={()=>{return}}/>

            <div className="container">
                { this.getRows() }
            </div>
            </div>
        );
    }
}

export default Category