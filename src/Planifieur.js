import React , {Component} from 'react';
import Title from './Title';

export default class Planifieur extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div>
                <Title
                    size={1}
                    value={this.props.title}
                />
            </div>
        )
    }
}