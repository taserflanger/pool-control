import React, { Component } from 'react';
import "./css/Watering.css"
import Page from "./Page";
import {ThemeContext} from "./ThemeContext";

class Watering extends Component {
    constructor(props){
        super(props);
        this.state = {
            isEditingSequence: -1,
            individual:
            [
                {
                    "name": "Ratatouille",
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
        io.on('update_individual', value=> {
          this.setState({individual: value});
        })
        io.on('update_sequential', value=> {
          this.setState({sequential: value});
        })
      }
    getIndividualEditor() {
        let index=this.state.isEditingSequence;
        if (index==-1) {
            return;
        } else {
            return(
                <IndividualEditor
                    onChangeName={(e, newName)=>{
                        io.emit('setIndividualValue', "name", newName)
                        e.preventDefault();
                        console.log("here?")
                    }}
                    name={this.state.individual[index].name}    
                    sequences={this.state.individual[index].sequences}
                    exceptions={this.state.individual[index].exceptions}
                    forced={this.state.individual[index].forced}
                />
            )
        }
    }
    getSlots() {
        let     result = []
        for (let i=0; i<this.state.individual.length; i++) {
            result.push(
            <div key={i} className="col col-sm-6 col-md-4 col-lg-3">
                <WateringSlot 
                slotInfo={this.state.individual[i]}
                onToggle={()=> io.emit("setIndividualValue", i, "active", !this.state.individual[i].active)}
                changeActivity={(val)=> {
                    io.emit("setIndividualValue", i, "activity", val);
                    console.log(val);
                }}
                editSequence={()=>this.setState({isEditingSequence: i})}
                 ></WateringSlot>
            </div>
            )
        }
        return result;
    }

    render() {
        return(
            <div>
            <div className="modal" style = {{display: this.state.isEditingSequence==-1? "none": "block"}}>
                <div className="modal-content">
                <span style={{float: "right"}}className="close" onClick={()=> {
              this.setState({isEditingSequence: -1});
            }}>&times;</span>
                {this.getIndividualEditor()}
                
                </div>
            </div>
                <div className="category">
                <Title
                size="2"
                text="Planification Individuelle"
                />
                {/* <div className="chooseWrapper">
                    <div className={`chooseButton pointer green ${this.state.wateringMode=="individual"? "active" : ""}`} onClick={()=>{
                        io.emit("setSingleValue", "wateringMode", "individual")
                    }}>Individuel</div>
                    <div className={`chooseButton green pointer ${this.state.wateringMode=="sequential"? "active" : ""}`} onClick={()=>{
                        io.emit("setSingleValue", "wateringMode", "sequential")
                    }}>Séquentiel</div>
                </div> */}
                {/* ceci est un buttongroup */}
                <div className="row">
                    {this.getSlots()}
                </div>
                </div>
            </div>
        )
    }
}

export default Watering