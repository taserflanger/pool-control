import React, { Component } from 'react';
import Slider from './Slider';
import './css/SequenceEditor.css'

class SequenceEditor extends Component{

    constructor(props) {
        super(props);
        this.state = {
            currentName: this.props.sequenceName,
            isEditingName: false
        }
    }
   

    GetClasses(spot, tick) {
        if (this.props.tick===tick) {
            if (this.props.sequences[this.props.activeSequence][spot][tick]) {
                return "active-enabled-seq";
            } else {
                return "active-disabled-seq";
            }
        }  else {
            if (this.props.sequences[this.props.activeSequence][spot][tick]) {
                return "inactive-enabled-seq";
            } else {
                return "inactive-disabled-seq"
            }
        }
    }

    handleClick(spot, tick) {
        return () => this.props.onChange(spot, tick);
    }

    getNameDisplay() {
        if (this.state.isEditingName) {
            return (
                <form onSubmit= {(e) => {
                    e.preventDefault();
                    this.props.onChangeName(this.state.currentName);
                    this.setState({isEditingName: false})
                }}>
                <input id="nameEdit" type="text" placeholder={this.props.name}
                    onChange={(e) => {
                        this.setState({
                            currentName: e.target.value,
                        });
                        }}>
                </input>
                </form>
            );
        } else {
            return (
                <div className="nameEditor"onClick={() => this.setState({isEditingName: true})}>{this.props.name}</div>
            );
        }
    }

    render() {
        let rows=[]
        for(var i=0; i<this.props.sequences[this.props.activeSequence].length; i++) {
            let row1=[]
            let row2 = []
            let spot=this.props.sequences[this.props.activeSequence][i];
            let breakIndex = Math.floor(spot.length/2);
            for (var t=0; t<breakIndex; t++) {
                row1.push(
                    <div
                        key={t}
                        className={`col shadow-box seqTile ${this.GetClasses(i, t)}`}
                        onClick={this.handleClick(i, t)}
                    ></div>
                );
            }
            for (t=breakIndex; t<spot.length; t++) {
                row2.push(
                    <div
                    key={t}
                    className={`col shadow-box seqTile ${this.GetClasses(i, t)}`}
                    onClick={this.handleClick(i, t)}
                    ></div>
                );
            }
            rows.push(
                <div key={i} className={`spot-row`}>
                    <div className="row">
                        {row1}
                    </div>
                    <div className="row">
                        {row2}
                    </div>
                </div>
            );
        }
        return (
            <div id="sequence-editor-field">
                <div id="nameArea">
                {this.getNameDisplay()}
                </div>
                {rows}
                <Slider
                    title="Tempo"
                    value={this.props.tempo}
                    onChange={(e) => this.props.onTempoChange(e)}
                    min="20" max="300"
                    suffix="BPM"
                />
            </div>
        );
    }
}

export default SequenceEditor;