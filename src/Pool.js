import React, { Component }  from 'react';
import Plot from 'react-plotly.js';
import Category from './Category';
import Title from './Title';
import './css/Pool.css';

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
          title="Spots"
          types={["PushButton"]}
          names={["spots"]}
          titles={[""]}
          initialValues={[false]}
          aligns={["center"]}
          sizes={[3]}
         
        />
        <Category
          title="Broadcast"
          types={["ValueBroadcast", "ValueBroadcast", "ValueBroadcast", "ValueBroadcast"]}
          titles={["Air", "Eau", "pH", "ORP"]}
          names={["air_temp", "water_temp", "ph", "orp"]}
          initialValues = {[25, 20, 7, 0]}
          isBroadcast={true}
          boradcastSuffixes={[" °C", " °C", "", ""]}
          colSize={"-3"}
        />
        <Category
          title="Moteur" 
          types={["PushButton", "PushButton", "PushButton", "PushButton"]} 
          titles={["Stop", "Start", "-", "+"]}
          subtitles={[
            [],[], [], []
          ]}
          names = {["stop", "start", "freq_minus", "freq_plus"]}
          initialValues={[false, false, false, false]}
        />
        <Category
          title="Mode de Filtration"
          types={["Button", "Button", "Button"]}
          names = {["normal", "backwash", "recirculation"]}
          titles={["Filtration", "Lavage", "Recirculation"]}
          initialToggleValue={1}
          initialValues={null}
          isToggleGroup={true}
          toggleGroupName="filtration_mode"
          toggleIndices={[0, 1, 2]}
          alignCenter={true}
        />
        <Category
          title="Console"
          types={["Console"]}
          names={["console"]}
          initialValues={[""]}
        />
        {this.getAdminContent()}
      </div>
      );
    }
}

export default Pool