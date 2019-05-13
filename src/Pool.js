import React, { Component }  from 'react';
import Category from './Category';
import './css/App.css';

class Pool extends Component {
    constructor(props) {
        super(props);
    }
    
      getAdminContent() {
        if (this.props.isAdmin) {
          return (
            <div id="adminContent">
              <Category
              title="Log"
              types={[]}
              names={[]}
              titles={[]}
              />
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
          types={["ImageToggle", "ImageToggle", "ImageToggle"]}
          names={["north_light", "southeast_light", "south_light"]}
          titles={[" 1 ", " 2 ", " 3 "]}
          initialValues={[false, false, false]}
          aligns={["center", "center", "center"]}
          sizes={[3, 3, 3]}
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
          types={["ImageToggle", "Slider"]} 
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
          types={["ImageToggle", "ImageToggle", "ImageToggle"]}
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