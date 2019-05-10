import React, { Component } from 'react';
import ImageToggle from './ImageToggle';
import Title from './Title'
import Slider from './Slider';
import ValueBroadcast from './ValueBroadcast';
import openSocket from 'socket.io-client';
import './css/Category.css';


const io = openSocket('http://localhost:8000/');
// const io = openSocket('http://90.63.156.114:8000');
// const io = openSocket('http://192.168.0.10:8000/');

class Category extends Component {

    constructor(props) {
        super(props)
        
        this.state = {
            values: this.props.initialValues
        }
    }

    componentDidMount() {
        if (this.props.isToggleGroup) {
            io.on(`update_${this.props.title}`, val => {
                this.setState({values: val});
            });
        } else {
            io.on(`update_${this.props.title}`, (variableName, val) => {
                let index = this.props.names.indexOf(variableName);
                let newValues = this.state.values.slice()
                newValues[index] = val;
                this.setState({values: newValues});
            });
        }

    }

    handleImageToggleClick(variable) {
        io.emit('toggle', this.props.title, variable);
    }
    handleImageToggleGroup(key) {
        let index = this.props.names.indexOf(key);
        io.emit('setSingleValue', this.props.title, index);
    }

    handleSliderChange(i, value) {
        const newValues = this.state.values.slice()
        newValues[i] = value;
        let variable = this.props.names[i];
        this.setState({
            values: newValues
        }, this.sendValueMessage(variable, value));
    }


    sendValueMessage(variable, value) {
        io.emit('setValue', this.props.title, variable, value);
    }

    getCategoryContent(begin, end) {
        let result = [];
        let singleType = this.props.types.length === 1
        let type = singleType? this.props.types[0] : null;
        let isToggleGroup = this.props.isToggleGroup | false;
        for (var i=begin; i<end; i++) {
            let colName = (this.props.aligns[i]==="center")? "col" : "col-4";
            if (this.props.types[i]==="ImageToggle" || type==="ImageToggle") {
                if (isToggleGroup) {
                    result.push(
                        <div key={i}className={colName}>
                        <Title size={1} align="center" text={this.props.titles[i]} />
                        <ImageToggle 
                        onClick={(key)=>this.handleImageToggleGroup(key)}
                        name={this.props.names[i]}
                        value={(this.state.values===i)}
                        subtitles={[]}
                        title=""
                        />
                    </div>);
                } else {
                    result.push(
                    <div key={i}className={colName}>
                        <ImageToggle 
                            onClick={(key)=>this.handleImageToggleClick(key)}
                            name={this.props.names[i]}
                            value={this.state.values[i]}
                            subtitles={[]}
                            title={(this.props.titles[i])? this.props.titles[i] : ""}
                        />
                    </div>);
                }
            } if (this.props.types[i]==="Slider" || type==="Slider") {
                result.push(
                    this.getSlider(i)
                    );
            } if (this.props.types[i]==="ValueBroadcast" || type==="ValueBroadcast") {
                result.push(
                    <div key={i} className={`col-3`}>
                        <Title size={1} align="center" text={this.props.titles[i]} />
                        <ValueBroadcast
                            value={this.state.values[i]}
                            suffix={this.props.boradcastSuffixes[i]}
                        />
                    </div>
                );
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
                    this.handleSliderChange(i, parseInt(e.target.value, 10))}}value={this.state.values[i]
                }
                name={this.props.names[i]}
                align={this.props.align} 
                title={this.props.titles[i]}
                min="10" max="30"
                suffix={<a>m<sup>3</sup>/h</a>}
            />
        </div>;
    }

    getRows() {
        let result = []
        let alignedCenter = this.props.aligneCenter? "align-items-center" : ""
        for (var i=0; i<Math.floor(this.props.names.length, 4); i++) {
            result.push(
                <div key={i} className={`row justify-content-around ${alignedCenter}`}>
                    { this.getCategoryContent(i*4, i*4+4) }
                </div>
            );
        }
        return result
    }

    render() {
        return (
            <div 
            className="category"
            id={this.props.title.toLowerCase()}
            style={{
                zIndex: Math.round(this.props.opacitiy*100),
                top: this.props.position,
                transform: `rotate3d(1, 0, 0, ${this.props.angle}rad)`,
                display: `${this.props.visibility==1? 'inline':'none'}`
            }}>
            
            <Title size="2" text={this.props.title} align={this.props.align} onClick={()=>{return}}/>

            <div className="container">
                { this.getRows() }
            </div>
            </div>
        );
    }
}

export default Category