import React, {Component} from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from 'react-router-dom'
import Pool from './Pool.js';
import Watering from './Watering.js'
import './css/App.css';
import {io} from './index';
import NavBar from "./NavBar";


class App extends Component {

    componentDidMount() {
        // setting up event listeners
        io.on('updateTempLog', newLog => {
            this.setState({tempLog: newLog})
        });
    }

    render() {
        return (
            <Router>
                <div id="app-container">
                    <Switch>
                        <Route path="/piscine">
                            <NavBar
                                appState="pool"
                            ></NavBar>
                            <Pool/>
                        </Route>
                        <Route path="/arrosage">
                            <NavBar
                                appState="watering"
                            ></NavBar>
                            <Watering/>
                        </Route>
                        <Route path="/">
                            <NavBar
                                appState="pool"
                            ></NavBar>
                            <Pool/>
                        </Route>
                    </Switch>
                </div>
            </Router>
        );
    }
}

export default App;
