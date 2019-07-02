import React, {Component} from 'react';
import './css/IndividualEditor.css'

export default class IndividualEditor extends Component {
    constructor(props) {
        super(props);
        this.state= {
            nameValue: ""
        }
    }

    getSequences() {
        let seqs = this.props.sequences
        let result = []
        for (let i=0; i<seqs.length; i++) {
            result.push(<p></p>
            )
        }
    }

    componentDidMount() {
        this.setState({nameValue: this.props.name})
    }

    render() {
        return (
            <div className={`individualEditor}`}>
                <div className="row">
                    <form onSubmit={(e)=>this.props.onChangeName(e, this.state.nameValue)}>
                    <div className="align-items-center">
                    <input type="text" className="form-control" value={this.state.nameValue} onChange={(e)=> {
                        this.setState({nameValue: e.target.value});
                    }} />
                    </div>
                    </form>
                </div>
                {this.getSequences()}
            </div>
        )
    }
}