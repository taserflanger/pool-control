import React, { Component } from 'react';
import "./css/Watering.css"
import Page from "./Page";
import {ThemeContext} from "./ThemeContext";

class Watering extends Component {
    render() {
        let watering = {
            "Paramétrage": {
                items: {
                    watering_auto: {
                        type: "Button",
                        title: "Arrosage Automatique",
                        value: true
                    },
                    watering_period: {
                        type: "AdjustButton",
                        title: "Tous les",
                        value: 3,
                        unit: " jours"
                    },
                    watering_hour: {
                        type: "AdjustButton",
                        title: "Heure de lavage",
                        value: 3,
                        unit: "h00"
                    },
                    watering_duration: {
                        type: "AdjustButton",
                        title: "Durée de lavage",
                        value: 20,
                        unit: " min"
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