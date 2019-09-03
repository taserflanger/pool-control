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


    parseInterface(obj) {
      let categories = Object.keys(obj);
      let result = []
      for (let title of categories) {
        let category = obj.title;
        if (category.class.includes("ToggleGroup")) {
          let titles = [];
          let names = [];
          let types = [];
          for (let name of category.items) {
            let item = category.items[name]
            names.push(name);
            titles.push(item.title);
            types.push(item.type);

          }
          result.push(
            <Category
              title={title}
              types={types}
              names = {names}
              titles={titles}
              initialToggleValue={category.value}
              initialValues={null}
              isToggleGroup={true}
              toggleGroupName={title}
              toggleIndices={[0, 1, 2, 3, 4, 5, 6, 7, 8]}
              defaultVisible={false}
        />
          )
        } else {
          let titles = [];
          let names = [];
          let types = [];
          let initialValues = [];
          let units = []
          for (let name of category.items) {
            let item = category.items[name]
            names.push(name);
            titles.push(item.title);
            types.push(item.type);
            initialValues.push(item.value);
            if (item.suffix) {
              units.push(item.suffix)
            } else {
              units.push("")
            }
          }
        }
      }
    }

    render() {
      let startup_interface={
        "Infos": {
          items: {
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
            }
          },
          visible: true,
        },
        "Bien-être": {
          items: {
            spots: {
              type: "PushButton",
              title: "Spots",
              value: 0,
              mcp:{
                address: 0x20,
                pinMode: "output",
                pin: 0
              },
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
          items: {
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
          visible: false
        },
        "Mode de Filtration": {
          class: ["ToggleGroup"],
          value: 0, //index
          items: {
            filtration: {
              type: "Button",
            },
            lavage : {
              type: "Button",
            },
            recirculation: {
              type: "Button",
            }
          },
          visible: false
        },
        "Paramètres de Lavage": {
          items: {
            washing_auto: {
              type: "Button",
              value: true,
              title: "Lavage Automatique",
            },
            washing_period: {
              type: "AdjustButton",
              value: 7,
              title: "Tous les",
              suffix: "jours",
            },
            washing_hour: {
              type: "AdjustButton",
              value: 3,
              title: "Heure de lavage",
              suffix: "h"
            },
            washing_cycles_count: {
              type: "AdjustButton",
              value: 5,
              title: "Durée de lavage",
              suffix: "min"
            }
          },
          visible: false
        },
        "Console": {
          items: {
            console: {
              type: "Console"
            }
          },
          visible: false
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
          units={[" °C", " °C", "", ""]}
          defaultVisible={true}
        />
        <Category
          title="Bien-être"
          types={["PushButton", "ToggleAdjustButton"]}
          names={["spots", "massage"]}
          titles={["Spots", "Massage"]}
          initialValues={[false, {"isOn": false, "value": 15}]}
          units={["", "min"]}
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
          defaultVisible={false}
        />
        <Category 
          title="Paramètres de lavage"
          types={["Button", "AdjustButton", "AdjustButton", "AdjustButton"]}
          names={["washing_auto", "washing_period", "washing_hour", "washing_cycles_count"]}
          titles={["Lavage Automatique", "Tous les", "Horaire", "Durée de lavage"]}
          initialValues={[true, 7, 3, 5]}
          upperTitles={[true, true, true, true]}
          units={["", " jours", "h", "min"]}
          defaultVisible={false}
        />
        <Category
          title="Console"
          types={["Console"]}
          names={["console"]}
          initialValues={[""]}
          defaultVisible={false}
          titles={["console"]}
        />
        {this.getAdminContent()}
      </div>
      );
    }
}

export default Pool