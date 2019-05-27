import React, {Component} from 'react';
import Title from './Title';
import Button from './Button';

export default class WateringSlot extends Component {
    render() {
        return (
            <div class="wateringSlot">
                <Title size={1} text={this.props.slotInfo.title} color="green"></Title>
                {JSON.stringify(this.props.slotInfo)}
            </div>
        )
    }
}