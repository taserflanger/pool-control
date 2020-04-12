import React, {Component} from 'react';
import {Link} from "react-router-dom";

export default class NavBar extends Component {

    constructor(props){
        super(props);
        this.state = {
            navBarCollapse: true,
        }
    }
    render() {
        return (
            <nav className="navbar sticky-top navbar-expand-lg navbar-light bg-light">
                <a className="navbar-brand">Jardin</a>
                <button className="navbar-toggler" type="button" data-toggle="collapse"
                        data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                        aria-expanded="false" aria-label="Toggle navigation" onClick={() => {
                    this.setState({navBarCollapse: !this.state.navBarCollapse})
                }}>
                    <span className="navbar-toggler-icon"> </span>
                </button>

                <div className={`${this.state.navBarCollapse ? "" : "show"} collapse navbar-collapse`}
                     id="navbarSupportedContent">
                    <ul className="navbar-nav">
                        <li className={`nav-item blue ${this.props.appState === "pool" ? "active" : ""}`}>
                            <Link to={"/piscine"}>
                                <a className="nav-link nav-element">
                                    Piscine
                                </a>
                            </Link>
                        </li>
                        <li className={`nav-item green ${this.props.appState === "watering" ? "active" : ""}`}>
                            <Link to={"/arrosage"}>
                                <a className="nav-link nav-element">
                                    Arrosage
                                </a>
                            </Link>
                        </li>
                    </ul>
                </div>
            </nav>
        )
    }
}