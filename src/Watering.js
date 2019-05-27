import React, { Component } from 'react';
import Title from './Title'
import WateringSlot from './WateringSlot';
import "./css/Watering.css"
import {io} from './index'

class Watering extends Component {
    constructor(props){
        super(props);
        this.state = {
            wateringMode: "individual",
            individual:
            [
                {
                    "title": "Ratatouille",
                    "active": true,
                    "activity": 1,
                    "sequences": [
                        {"begin": "02:00", "duration": 60}
                    ],
                    "exceptions": ["14/05/2002"],
                    "forced": ["14/05/2002"]
                }
            ],
            sequential: {
                "activity": 2,
                "exceptions": ["01/02/2003"],
                "forced": [],
                "order": [0, 1, 1],
                "beginning": "03:00",
                "end": "03:30",
                "duration": 10,
                "time-reference": "beginning"
            }
        }
    }

    componentDidMount() {
        // setting up event listeners
        io.on('update_wateringMode', _mode=> {
          this.setState({wateringMode: _mode});
        })
        io.on('update_individual', value=> {
          this.setState({individual: value});
        })
        io.on('update_sequential', value=> {
          this.setState({sequential: value});
        })
      }

    getInnerContent() {
        if (this.state.wateringMode=="individual") {
            return (<div>
                {this.getSlots()}
            </div>
            )
        } else {
            return ("Sequentiel");
        }
    }

    getSlots() {
        for (let i=0; i<this.state.individual.length; i++) {
            return <WateringSlot 
            slotInfo={this.state.individual[i]}
            onToggle={()=> io.emit("setIndividualValue", i, "active", !this.state.individual[i].active)}
            changeActivity={(val)=> {
                io.emit("setIndividualValue", i, "activity", val);
                console.log(val);
            }}
             ></WateringSlot>
        }
    }

    render() {
        return(
            <div>
                <div className="category">
                <Title
                size="2"
                text="Planification"
                />
                <div className="chooseWrapper">
                    <div className={`chooseButton pointer green ${this.state.wateringMode=="individual"? "active" : ""}`} onClick={()=>{
                        io.emit("setSingleValue", "wateringMode", "individual")
                    }}>Individuel</div>
                    <div className={`chooseButton green pointer ${this.state.wateringMode=="sequential"? "active" : ""}`} onClick={()=>{
                        io.emit("setSingleValue", "wateringMode", "sequential")
                    }}>Séquentiel</div>
                </div>
                {this.getInnerContent()}
                </div>
            </div>
        )
    }
}

export default Watering