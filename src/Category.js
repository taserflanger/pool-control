import React, { Component } from 'react';
import Button from './Button';
import PushButton from './PushButton';
import ToggleAdjustButton from './ToggleAdjustButton';
import AdjustButton from './AdjustButton';
import Title from './Title'
import Display from './Display';
import './css/Category.css';
import {io} from './index';
import Plot from "react-plotly.js";


class Category extends Component {

    constructor(props) {
        super(props)
        let names = Object.keys(this.props.items)
        let loading={}
        let initialValues = {}
        if (this.props.meta.toggleGroup) {
            initialValues = this.props.meta.value
        } else {
            for (let i=0; i<names.length; i++) {
                initialValues[names[i]] = this.props.items[names[i]].value;
            }
        }
        console.log(`for category ${this.props.title}, initialValues: ${JSON.stringify(initialValues)}`)
        for (let i=0; i<names.length; i++) {
            loading[names[i]]=false
        }
        this.state = {
            values: initialValues,
            loading: loading,
        }
    }

    componentDidMount() {
        let names = Object.keys(this.props.items)
        if (this.props.meta.toggleGroup) {
            io.on(`update_${this.props.meta.name}`, (val) => {
                this.setState({values: val});
                this.setVariableLoading(names[val], false);
            });
        } else {
            for (let i=0; i<names.length; i++) {
                io.on(`update_${names[i]}`, (val)=> {
                    let newValues = this.copyObj(this.state.values)
                    newValues[names[i]] = val;
                    this.setState({values: newValues});
                    this.setVariableLoading(names[i], false)
                })
            }
        }

    }

    setVariableLoading(variable, bool) {
        let newLoading = this.copyObj(this.state.loading);
        newLoading[variable] = bool
        this.setState({loading: newLoading});
    }

    copyObj(obj) {
        let newobj = {}
        for (let key of Object.keys(obj)) {
            newobj[key]=obj[key]
        }
        return newobj
    }

    handleAdjustButtonValue(variable, increment) {
        io.emit('incrementValue', variable, increment);
    }

    handleToggleAdjustButtonValue(variable, increment) {
        io.emit('adjustValue', variable, increment)
    }
    handleToggleAdjustButtonIsOn(variable) {
        io.emit('toggle', variable);
    }

    handlePushButton(variable, value) {
        io.emit('setValue', variable, value);
    }

    handleButtonClick(variable, value) {
        if (this.props.meta.toggleGroup) {
            let index = Object.keys(this.props.items).indexOf(variable);
            io.emit('setValue', this.props.meta.name, index);
        } else {
            io.emit('setValue', variable, !value);
        }
        this.setVariableLoading(variable, true);
    }
    
    handleButtonGroup(key) {
        io.emit('setValue', this.props.meta.name, key);
        this.setVariableLoading(key, true)
    }


    setValue(variable, value) {
        io.emit('setValue', variable, value);
    }

    getCategoryContent() {
        let names = Object.keys(this.props.items)
        let result = []

        let typeMap = {
                "Button": this.getButton,
                "PushButton": this.getPushButton,
                "Slider": this.getSlider,
                "Display": this.getDisplay,
                "ToggleAdjustButton": this.getToggleAdjustButton,
                "AdjustButton": this.getAdjustButton,
                "Plot": this.getPlot
            }

        for (let i=0; i<Object.keys(this.props.items).length; i++) {
            let name = names[i]
            let item = this.props.items[name]
            item.name = name
            result.push(typeMap[item.type].bind(this)(i, item)) // call function associated with type
        }
        
        return result;
    }

    getPlot(i, {title}) {
        return (
            <div className="category-item">
                <Title size={1} text={title}/>
                <Plot
                    data={[
                        {
                            x: [],
                            y: [],
                            type: "scatter"
                        }
                    ]}
                    layout={ {autosize: true}}
                    graphOptions = {{filename: "date-axes", fileopt: "overwrite"}}
                />
            </div>

        );
    }

    getAdjustButton(i, {title, name, unit}) {
        return <div className="category-item">
            <Title size={1} text={title} />
            <AdjustButton 
                key={i} 
                onChangeValue={val => this.handleAdjustButtonValue(name, val)}
                value={this.state.values[name]} 
                name={name} 
                unit={unit ? unit : ""} />
        </div>;
    }

    getToggleAdjustButton(i, {title, name, unit}) {
        return (
            <div className="category-item">
                <Title size={1} text={title} />
                <ToggleAdjustButton 
                    key={i}
                    isOn={this.state.values[name].isOn}
                    onChangeValue={(val) => this.handleToggleAdjustButtonValue(name, val)}
                    value={this.state.values[name].value} 
                    onClick={() => this.handleToggleAdjustButtonIsOn(name)}
                    name={name}
                    loading={this.state.loading[i]}
                    unit={unit ? unit : ""} />
            </div>
        );
    }

    getDisplay(i, {title, value, unit}) {
        return <div key={i} className={`category-item`}>
            <Title 
                size={1} 
                text={title} />
            <Display 
                value={value}
                class="only-text"
                unit={unit ? unit : ""}
            />
        </div>;
    }

    getPushButton(i, {title, inner, name}) {
        return <div key={i} className={`category-item`}>
            {title? (<Title size={1} text={title}/>) : ""}
            <PushButton 
                onMouseDown={(name) => this.handlePushButton(name, true)} 
                onMouseUp={(name) => this.handlePushButton(name, false)} 
                name={name}
                value={this.state.values[name]}
                inner={inner?inner:" "}
                loading={this.state.loading[i]} 
            />
        </div>;
    }

    getButton(i, {title, inner, name}) {
        let v = this.props.meta.toggleGroup?this.state.values===i:this.state.values[name];
        return <div key={i} className={`category-item`}>
            {title?<Title size={1} text={title}/> : ""}
            <Button
                onClick={() => this.handleButtonClick(name, v)}
                name={name}
                inner={inner?inner:""}
                value={v}
                loading={this.state.loading[i]}
                title={title?title:""}
            />
        </div>;
    }

    render() {
        return (
            <div 
            className="category"
            id={this.props.title.toLowerCase()}
            >
            
            <Title size="2" text={this.props.title} align={this.props.align} onClick={()=>{}}/>
            <div key = {0} className={`category-content`}>
                { this.getCategoryContent() }
            </div>
            </div>
        );
    }
}

export default Category