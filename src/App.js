import React, { Component }  from 'react';
import Pool from './Pool.js';
import Watering from './Watering.js'
import CustomForm from './CustomForm.js';
import './css/App.css';
import {io} from './index';

  Array.prototype.rotate = (function() {
    var unshift = Array.prototype.unshift,
        splice = Array.prototype.splice;

    return function(count) {
        var len = this.length >>> 0,
            count = count >> 0;

        unshift.apply(this, splice.call(this, count % len, len));
        return this;
    };
})();
// import DropdownSelector from './DropdownSelector';

class App extends Component {

  constructor(props) {
    super(props);
    //initializing props from index
    this.state = {
      //initializing all states
      navBarCollapse: true,
      loginAdmin: false,
      isAdmin: false,
      appState: "watering",
    }
  }

  componentDidMount() {
    // setting up event listeners
    io.on('loginAdmin', bool=> {
      this.setState({isAdmin: bool, loginAdmin: !bool});
    })
  }

  
  getAdminSection() {
    if (this.state.isAdmin) {
      return (
        <button className="btn btn-outline-secondary my-2 my-sm-0" onClick={()=>this.setState({isAdmin: false})}>Déconnexion</button>
      );
    } else {
      return (
        <button className="btn btn-outline-secondary my-2 my-sm-0" onClick={() => this.setState({loginAdmin: true})}>Mode Admin</button>
      );
    }
  }

  getContent() {
    if (this.state.appState == "pool") {
      return (<Pool
        io={io}
        isAdmin={this.state.isAdmin}
        />);
    } else if (this.state.appState=="watering") {
      return (
      <Watering
        io={io}
      />
      )
    } else {
      return (
        <span style={{color: "red", fontSize: "1.5em"}}>Unknown app State: {this.state.appState}</span>
      )
    }
  }

  render() {
    return (
      <div id="app-container">
        <nav className="navbar sticky-top navbar-expand-lg navbar-light bg-light">
        <a className="navbar-brand">Jardin</a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation" onClick={()=> {this.setState({navBarCollapse: !this.state.navBarCollapse})}}>
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`${this.state.navBarCollapse? "": "show"} collapse navbar-collapse`} id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto">
            <li className={`nav-item pointer blue ${this.state.appState=="pool"?"active":""}`}>
              <a className="nav-link nav-element" onClick={()=>{
                this.setState({appState: "pool"}, ()=> {
                  io.emit("refresh-pool"); // get all values again
                });
                }}>Piscine <span className="sr-only">(current)</span></a>
            </li>
            <li className={`nav-item pointer green ${this.state.appState=="watering"?"active":""}`}>
              <a className="nav-link nav-element" onClick={()=> {this.setState({appState: "watering"}, ()=> {
                io.emit('refresh-watering')
              })}}>Arrosage</a>
            </li>
          </ul>
            {this.getAdminSection()}
        </div>
      </nav>
        <div className="modal" style={{display: this.state.loginAdmin? "block": "none"}}>
          <div className="modal-content">
          <span style={{float: "right"}}className="close" onClick={()=> {
              this.setState({loginAdmin: false});
            }}>&times;</span>
            Mode Admin:
          <CustomForm
            onSubmit={(e, value)=> {
              io.emit("loginAdmin", value);
              e.preventDefault();
            }}
          />
          </div>
          </div>
          {this.getContent()}
        </div>
    );
  }
}

export default App;
