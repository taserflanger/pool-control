import React, { Component }  from 'react';
import Plot from 'react-plotly.js';
import Category from './Category';
import Title from './Title';
import './css/Pool.css';
import Display from './Display';

class Pool extends Component {
    constructor(props) {
        super(props);
    }
    
      getAdminContent() {
        if (this.props.isAdmin) {
          return (
            <div id="adminContent">
              <div class="category">
              <Title size={2} align="center" text="Log"/>
                <Plot
                  data={[
                    {
                      x: this.props.tempLog.x,
                      y: this.props.tempLog.y,
                      type: "scatter"
                    }
                  ]}
                  layout={ {autosize: true, title: 'Température'} }
                  graphOptions = {{filename: "date-axes", fileopt: "overwrite"}}
                />
              </div>
              <Category
              title="Vannes individuelles"
              types={[]}
              names={[]}
              titles={[]}
              />
            </div>
          );
        } return;
      }
    render() {
      return (
        <div id="Piscine">
        <Category
          title="Infos"
          types={["Display", "Display", "Display", "Display"]}
          titles={["Air", "Eau", "pH", "ORP"]}
          names={["air_temp", "water_temp", "ph", "orp"]}
          initialValues = {[25, 20, 7, 0]}
          isBroadcast={true}
          units={[" °C", " °C", "", ""]}
          colSize={"-3"}
          defaultVisible={true}
        />
        <Category
          title="Bien-être"
          types={["PushButton", "ToggleAdjustButton"]}
          names={["spots", "massage"]}
          titles={["Spots", "Massage"]}
          initialValues={[false, {"isOn": false, "value": 15}]}
          aligns={["center", "center"]}
          sizes={[3, 3]}
          unites={["", "min"]}
          upperTitles={[true, ""]}
          defaultVisible={true}
         
        />
        <Category
          title="Pompe" 
          types={["PushButton", "PushButton", "PushButton", "PushButton"]} 
          titles={["Stop", "Start", "-", "+"]}
          subtitles={[
            [],[], [], []
          ]}
          names = {["stop", "start", "freq_minus", "freq_plus"]}
          initialValues={[false, false, false, false]}
          defaultVisible={false}
        />
        <Category
          title="Mode de Filtration"
          types={["Button", "Button", "Button"]}
          names = {["normal", "backwash", "recirculation"]}
          titles={["Filtration", "Lavage", "Recirculation"]}
          initialToggleValue={0}
          initialValues={null}
          isToggleGroup={true}
          toggleGroupName="filtration_mode"
          toggleIndices={[0, 1, 2]}
          alignCenter={true}
          defaultVisible={false}
        />
        <Category
          title="Console"
          types={["Console"]}
          names={["console"]}
          initialValues={[""]}
          defaultVisible={false}
        />
        {this.getAdminContent()}
      </div>
      );
    }
}

export default Pool