import React, { Component } from 'react';
import ImageToggle from './ImageToggle';
import Title from './Title'
import Slider from './Slider';
import ValueBroadcast from './ValueBroadcast';
import openSocket from 'socket.io-client';


const io = openSocket('http://localhost:8000/');
// const io = openSocket('http://90.63.156.114:8000');
// const io = openSocket('http://192.168.0.100:8000/');

class Category extends Component {

    constructor(props) {
        super(props);
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

    getCategoryContent() {
        let result = [];
        let singleType = this.props.types.length === 1
        let type = singleType? this.props.types[0] : null;
        let isToggleGroup = this.props.isToggleGroup | false;
        for (var i=0; i<this.props.names.length; i++) {
            let colName = (this.props.aligns[i]==="center")? "col" : "col-4";
            if (this.props.types[i]==="ImageToggle" || type==="ImageToggle") {
                if (isToggleGroup) {
                    result.push(
                    <div key={i}className={colName}>
                        <ImageToggle 
                        onClick={(key)=>this.handleImageToggleGroup(key)}
                        name={this.props.names[i]}
                        value={(this.state.values===i)}
                        size={this.props.sizes[i] }
                        paths={this.props.paths[i]}
                        subtitles={[]}
                        align={this.props.aligns[i]}
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
                            size={this.props.sizes[i]}
                            subtitles={[]}
                            paths={this.props.paths[i]}
                            align={this.props.aligns[i]}
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
                    <div key={i} className="col">
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
        return <div key={i} className="col-8">
            <Slider
                onChange={(e) => {this.handleSliderChange(i, parseInt(e.target.value, 10))}}value={this.state.values[i]}
                name={this.props.names[i]}
                align={this.props.align} 
                title={this.props.titles[i]}
                min="10" max="40"
                suffix={<a>m<sup>3</sup>/h</a>}
            />
        </div>;
    }

    getAlternativeTitle() {
        let result=[]
        if (this.props.isToggleGroup || this.props.isBroadcast) {
            for (var i=0; i<this.props.names.length; i++) {
                result.push (
                    <div key={i} className="col">
                        <Title size={1} align="center" text={this.props.titles[i]} />
                    </div>
                );
            }
        }
        return result;
    }

    render() {
        let aligneCenter = this.props.aligneCenter? "align-items-center" : ""
        return (
            <div className="category" id={this.props.title.toLowerCase()} style={{zIndex: -1}}>
            
            <Title size="2" text={this.props.title} align={this.props.align}/>

            <div className="container">
                <div className="row justify-content-around">
                    { this.getAlternativeTitle() }
                </div>
                <div className={`row justif-content-around ${aligneCenter}`}>
                    { this.getCategoryContent() }
                </div>
            </div>
            </div>
        );
    }
}

export default Category