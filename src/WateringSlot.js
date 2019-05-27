import React, {Component} from 'react';
import Title from './Title';
import Button from './Button';
import DropdownSelector from './DropdownSelector'

export default class WateringSlot extends Component {
    render() {
        return (
            <div className="wateringSlot">
                <Title size={1} text={this.props.slotInfo.title} color="green"></Title>
                <Button
                    onClick={()=>this.props.onToggle()}
                    name={this.props.name}
                    value={this.props.slotInfo.active}
                    subtitles={(this.props.subtitles? this.props.subtitles: [])}
                    color="green"

                ></Button>
                <div className="row">
                    <div className="col">
                        Lancer la séquence: 
                    </div>
                    <div className="col">
                        <DropdownSelector
                        names={["tous les jours", "un jour sur deux", "une fois par semaine"]}
                        selected={this.props.slotInfo.activity}
                        onChangeName={(val)=> {
                            this.props.changeActivity(val);
                        }}
                        ></DropdownSelector>
                    </div>
                </div>
                {JSON.stringify(this.props.slotInfo)}
            </div>
        )
    }
}