import React, { Component }  from 'react';
import './css/CustomForm.css';

class CustomForm extends Component {
    constructor(props) {
        super(props);
        //initializing props from index
        this.state = {value: ""};
    }
    render() {
        return (
          <form onSubmit={(e)=>{
              this.props.onSubmit(e, this.state.value);
          }}>
          <div className="form-row align-items-center">
              <input type="password" className="form-control col" placeholder="Entrez le mot de passe" value={this.state.value} onChange={(e)=> {
                  this.setState({value: e.target.value});
              }} />
            <input className="btn btn-secondary col-3 float-right" type="submit" value="Connexion" />
            </div>
          </form>
        );
      }
}
export default CustomForm;