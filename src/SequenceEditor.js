import React, { Component } from 'react';
import Slider from './Slider';

class SequenceEditor extends Component{
   

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
                <input type="text" placeHolder={this.props.sequenceName} onChange={(e) => this.props.onChangeName(e.target.value)}></input>
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