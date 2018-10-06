import React, {Component} from 'react';

class DropdownSelector extends Component{

    constructor(props) {
        super(props);
        this.state = {
            dropdown: false
        }
    }

    handleClick(i) {
        return (i) => this.props.onChangeName(i);
    }

    getDropDownElements() {
        let result = [];
        for (var i=0; i<this.props.names.length; i++) {
            let c = (this.props.selected==i)? "selected" : "";
            result.push(<div className={c}>{this.props.names[i]}</div>);
        }
        return result;

    }

    render() {
        if (this.state.dropdown) {
            return (
                <div className="selector">
                    <div className="selected" onClick={this.setState({dropdown: !this.state.dropdown})}>{this.props.names[this.props.selected]}</div>
                    {this.getDropDownElements()}
                </div>
            );
        } else {
            return <p>{this.props.names[this.props.selected]}</p>
        }
    }
}

export default DropdownSelector;