import React, {Component} from 'react';
import './css/Pool.css';
import Display from './Display';
import Page from './Page';
import {ThemeContext} from "./ThemeContext";

class Pool extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let pool = {
            "Infos": {
                items: {
                    air_temp: {
                        type: "Display",
                        value: 25,
                        title: "Air",
                        unit: " °C",
                        mcp: {
                            address: 0x20,
                            pinMode: "input",
                            pin: 9
                        }
                    },
                    water_temp: {
                        type: "Display",
                        value: 20,
                        title: "Eau",
                        unit: " °C",
                        mcp: {
                            address: 0x20,
                            pinMode: "input",
                            pin: 9
                        }
                    },
                    ph: {
                        type: "Display",
                        value: 7,
                        title: "pH",
                        unit: "",
                        mcp: {
                            address: 0x20,
                            pinMode: "input",
                            pin: 9
                        }
                    },
                    orp: {
                        type: "Display",
                        value: 400,
                        title: "ORP",
                        unit: " mV",
                        mcp: {
                            address: 0x20,
                            pinMode: "input",
                            pin: 9
                        }
                    }
                },
                visible: true,
            },
            "Bien-être": {
                items: {
                    spots: {
                        type: "PushButton",
                        title: "Spots",
                        value: false,
                        mcp: {
                            address: 0x20,
                            pinMode: "output",
                            pin: 0
                        },
                    },
                    massage: {
                        type: "ToggleAdjustButton",
                        title: "Massage",
                        value: {isOn: false, value: 30},
                        unit: "min",
                        min: 1
                    }
                },
                visible: true
            },
            "Pompe": {
                items: {
                    stop: {
                        type: "PushButton",
                        inner: "Stop",
                        value: false,
                        mcp: {
                            address: 0x20,
                            pinMode: "output",
                            pin: 1
                        }
                    },
                    start: {
                        type: "PushButton",
                        inner: "Start",
                        value: false,
                        mcp: {
                            address: 0x20,
                            pinMode: "output",
                            pin: 2
                        }
                    },
                    freq_minus: {
                        type: "PushButton",
                        inner: "-",
                        value: false,
                        mcp: {
                            address: 0x20,
                            pinMode: "output",
                            pin: 3
                        }
                    },
                    freq_plus: {
                        type: "PushButton",
                        inner: "+",
                        value: false,
                        mcp: {
                            address: 0x20,
                            pinMode: "output",
                            pin: 3
                        }
                    }
                },
                visible: false
            },
            "Mode de Filtration": {
                toggleGroup: true,
                name: "filtration_mode",
                value: 0, // index
                items: {
                    filtration: {
                        type: "Button",
                        title: "Filtration",
                        name: "filtration"
                    },
                    lavage: {
                        type: "Button",
                        title: "Lavage",
                        name: "lavage",
                    },
                    recirculation: {
                        type: "Button",
                        title: "Recirculation",
                        name: "recirculation"
                    }
                },
                visible: false
            },
            "Paramètres de Lavage": {
                items: {
                    washing_auto: {
                        type: "Button",
                        value: true,
                        title: "Lavage Automatique",
                    },
                    washing_period: {
                        type: "AdjustButton",
                        value: 7,
                        title: "Tous les",
                        unit: " jours",
                        min: 1
                    },
                    washing_hour: {
                        type: "AdjustButton",
                        value: 3,
                        title: "Heure de lavage",
                        unit: "h00",
                        modulo: 24,
                    },
                    washing_cycle_duration: {
                        type: "AdjustButton",
                        value: 5,
                        title: "Durée de lavage",
                        unit: "min",
                        min: 1
                    },
                    washing_cycle_count: {
                        type: "AdjustButton",
                        value: 5,
                        title: "Répétitions",
                        min: 1
                    },
                    washing_cycle_delay: {
                        type: "AdjustButton",
                        value: 2,
                        title: "Espacement",
                        unit: "min",
                        min: 1
                    },
                    next_washing_occurrences: {
                        type: "Display",
                        value: "Demain à 4:00, vendredi à 04:00",
                        title: "Prochains lavages",
                        css_class: "full-width"
                    }
                }
            },
            "Plot": {
                items: {
                    temp: {
                        type: "Plot",
                        title: "Température"
                    }
                }
            }
        }

        return (
            <ThemeContext.Provider value = {{color: "blue"}}>
                <Page
                    categories={pool}
                    color="blue"
                />
            </ThemeContext.Provider>

    )
    }
}

export default Pool