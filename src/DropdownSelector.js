import React, {Component} from 'react';
import './css/DropdownSelector.css'

class DropdownSelector extends Component{

    constructor(props) {
        super(props);
        this.state = {
            dropdown: false
        }
    }

    handleClick(val) {
        this.props.onChangeName(val);
    }
    getDropDownElements() {
        let result = [];
        if (this.state.dropdown) {
            for (var i=0; i<this.props.names.length; i++) {
                if (i!=this.props.selected) {
                result.push(<div key={i} onClick={()=>this.handleClick(i)}>{this.props.names[i]}</div>);
                }
            }
        // } else {
        //     return (<div className="selected">{this.props.names[this.props.selected]}</div>);
        // }
        }
        return result;

    }

    render() {
            return (
                <div className="selector">
                    <div className="selected" onClick={
                        () => this.setState({dropdown: !this.state.dropdown})}>{this.props.names[this.props.selected]
                    }</div>
                    <div id="selector-items">
                        {this.getDropDownElements()}
                    </div>
                </div>
            );

    }
}

export default DropdownSelector;