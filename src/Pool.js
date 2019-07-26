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
          types={["Button"]}
          names={["north_light"]}
          titles={[""]}
          initialValues={[false, false, false]}
          aligns={["center"]}
          sizes={[3]}
         
        />
        {/* Sequence editor props*/}
            {/* {this.getSequencerContent()} */}
        {/* Broadcast category */}
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
          types={["Button", "Slider"]} 
          titles={["", "Débit"]}
          subtitles={[
            ["OFF", "On"],
            []
          ]}
          min={1}
          max={5}
          names = {["is_on", "freq"]}
          initialValues={[true, 1]}
        />
        <Category
          title="Filtre"
          types={["Button", "Button", "Button"]}
          names = {["normal", "backwash", "recirculation"]}
          titles={["Filtration", "Lavage", "Recirculation"]}
          initialToggleValue={1}
          initialValues={null}
          isToggleGroup={true}
          toggleIndices={[0, 1, 2]}
          alignCenter={true}
        />
        {this.getAdminContent()}
      </div>
      );
    }
}

export default Pool