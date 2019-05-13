import React, { Component } from 'react';
import Category from './Category';

class Watering extends Component {
    constructor(props){
        super(props);
    }
    render() {
        return(
            <div>
                <Category
                    title="Planification"
                    types={["Planifieur", "Planifieur", "Planifieur"]}
                    titles={["Terrasse 1", "Terrasse", "Carrefour Giratoire"]}
                    colSize={"-3"}
                    names={["watering1", "watering2", "watering3"]}
                />
            </div>
        )
    }
}

export default Watering