import React, { Component }  from 'react';
import openSocket from 'socket.io-client';
import Piscine from './Piscine.js';
import CustomForm from './CustomForm.js';
import './css/App.css';

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

// const io = openSocket('http://localhost:8000/');
// const io = openSocket('http://90.63.156.114:8000');
const io = openSocket('http://192.168.0.100:8000/');
// const io = openSocket('http://192.168.0.146:8000/');

class App extends Component {

  constructor(props) {
    super(props);
    //initializing props from index
    this.state = {
      //initializing all states
      navBarCollapse: true,
      loginAdmin: false,
      isAdmin: false
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

  render() {
    return (
      <div id="app-container">
        <nav className="navbar sticky-top navbar-expand-lg navbar-light bg-light">
        <a className="navbar-brand" href="#">Pool-Control</a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation" onClick={()=> {this.setState({navBarCollapse: !this.state.navBarCollapse})}}>
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`${this.state.navBarCollapse? "": "show"} collapse navbar-collapse`} id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item active">
              <a className="nav-link nav-element blue" href="#">Piscine <span className="sr-only">(current)</span></a>
            </li>
            <li className="nav-item">
              <a className="nav-link nav-element green" href="#">Arrosage</a>
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
          <Piscine
          isAdmin={this.state.isAdmin}
          />
        </div>
    );
  }
}

export default App;
