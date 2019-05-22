import React, { Component } from 'react';
import Title from './Title'

class Watering extends Component {
    constructor(props){
        super(props);
        this.state = {
            mode: "individual"
        }
    }

    getInnerContent() {
        if (this.state.mode=="individual") {
            return (
                "Individuel"
            )
        } else {
            return ("Sequentiel");
        }
    }

    render() {
        return(
            <div>
                <Title
                size="2"
                text="Planification"
                />
                <div className="chooseWrapper">
                    <div className={`chooseButton ${this.state.mode=="individual"? "active" : ""}`} onClick={()=>this.setState({mode: "individual"})}>Individuel</div>
                    <div className={`chooseButton ${this.state.mode=="sequential"? "active" : ""}`} onClick={()=>this.setState({mode: "sequential"})}>Séquentiel</div>
                </div>
                {this.getInnerContent()}
                
            </div>
        )
    }
}

export default Watering