import React, {Component} from 'react';
import Title from './Title';
import Button from './Button';
import DropdownSelector from './DropdownSelector';
import './css/WateringSlot.css';

export default class WateringSlot extends Component {
    render() {
        return (
            <div className="wateringSlot">
                <Title size={1} text={this.props.slotInfo.name} color="green"></Title>
                <Button
                    onClick={()=>this.props.onToggle()}
                    name={this.props.name}
                    value={this.props.slotInfo.active}
                    subtitles={(this.props.subtitles? this.props.subtitles: [])}
                    color="green"

                ></Button>
                <div className="row">
                    {/* <div className="col">
                        Lancer la séquence: 
                    </div> */}
                    <div className="col">
                        <DropdownSelector
                        names={["jamais", "tous les jours", "un jour sur deux", "une fois par semaine"]}
                        selected={this.props.slotInfo.activity}
                        onChangeName={(val)=> {
                            this.props.changeActivity(val);
                        }}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                    <Button
                        name="edit_sequence"
                        title="Editer"
                        square={true}
                        color="green"
                        onClick={()=>this.props.editSequence()}
                        value={true}
                    />
                    </div>
                </div>
            </div>
        )
    }
}