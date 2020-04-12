import React, { Component } from 'react';
import "./css/Watering.css"
import Page from "./Page";
import {ThemeContext} from "./ThemeContext";

class Watering extends Component {
    constructor(props){
        super(props);
    }

    render() {
        let watering = {
            "Paramétrage": {
                items: {
                    watering_period: {
                        type: "AdjustButton",
                        title: "Tous les",
                        value: 3,
                        unit: " jours"
                    }
                }
            }
        }
        return (
            <ThemeContext.Provider value={{color: "green"}}>
                <Page
                    categories={watering}
                />
            </ThemeContext.Provider>
            )
    }
}

export default Watering