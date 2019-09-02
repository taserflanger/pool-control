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
      let startup_interface={
        "Infos": {
          air_temp: {
            type: "Display",
            value: 25,
            title: "Air",
            unit:" °C",
            mcp:{
              address: 0x20,
              pinMode: "input",
              pin: 9

            }
          },
          water_temp: {
            type: "Display",
            value: 25,
            title: "Eau",
            unit:" °C",
            mcp:{
              address: 0x20,
              pinMode: "input",
              pin: 9

            }
          },
          ph: {
            type: "Display",
            value: 25,
            title: "pH",
            unit:"",
            mcp:{
              address: 0x20,
              pinMode: "input",
              pin: 9

            }
          },
          orp: {
            type: "Display",
            value: 25,
            title: "Air",
            unit:" °C",
            mcp:{
              address: 0x20,
              pinMode: "input",
              pin: 9

            }
          },
          visible: true,
        },
        "Bien-être": {
          spots: {
            type: "PushButton",
            title: "Spots",
            value: 0,
            mcp:{
              address: 0x20,
              pinMode: "output",
              pin: 0
            },
          massage: {
            type: "ToggleAdjustButton",
            title: "Massage",
            value: {isOn: false, value: 15},
          }
          },
          visible: true
        },
        "Pompe": {
          stop: {
            type: "PushButton",
            inner: "Stop",
            value: 0,
            mcp: {
              address: 0x20,
              pinMode: "output",
              pin: 1
            }
          },
          start: {
            type: "PushButton",
            inner: "Start",
            value: 0,
            mcp: {
              address: 0x20,
              pinMode: "output",
              pin: 2
            }
          },
          freq_minus: {
            type: "PushButton",
            inner: "-",
            value: 0,
            mcp: {
              address: 0x20,
              pinMode: "output",
              pin: 3
            }
          },
          freq_plus: {
            type: "PushButton",
            inner: "+",
            value: 0,
            mcp: {
              address: 0x20,
              pinMode: "output",
              pin: 3
            }
          }
        },
        "Mode de Filtration": {
          value: 0, //index
          filtration: {
            type: "ToggleGroupButton",
          },
          lavage : {
            type: "ToggleGroupButton",
          },
          recirculation: {
            type: "ToggleGroupButton",
          }
        },
        "Paramètres de Lavage": {
          washing_auto: {
            type: "Button",
            value: true
          }
        }
      }
      return (
        <div id="Piscine">
        <Category
          title="Infos"
          types={["Display", "Display", "Display", "Display"]}
          titles={["Air", "Eau", "pH", "ORP"]}
          names={["air_temp", "water_temp", "ph", "orp"]}
          initialValues = {[25, 20, 7, 0]}
          isBroadcast={true}
          boradcastSuffixes={[" °C", " °C", "", ""]}
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
          title="Paramètres de lavage"
          types={["Button", "AdjustButton", "AdjustButton", "AdjustButton"]}
          names={["washing_auto", "washing_period", "washing_hour", "washing_cycles_count"]}
          titles={["Lavage Automatique", "Tous les", "Horaire", "Durée de lavage"]}
          initialValues={[true, 7, 3, 5]}
          upperTitles={[true, true, true, true]}
          unites={["", " jours", "h", "min"]}
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