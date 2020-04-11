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
    
      getPlot() {
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
                  layout={ {width: "auto", height: 400, title: 'Température'} }
                  graphOptions = {{filename: "date-axes", fileopt: "overwrite"}}
                />
              </div>
            </div>
          );
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
      /*
        model: (default necessary, parenthethis optional, 
        respect order for readability)
        -------------------------------------------------
          display: title, value, (unit), (mcp)
          PushButton: (title), (inner), value, (mcp)
          Button: (title), (inner), value, (mcp)
          ToggleAdjustButton: title, value: {isOn, value}, (unit)
          AdjustButton: title, value, (unit)

      */
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
              value: 20,
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
              value: 7,
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
              value: 400,
              title: "ORP",
              unit:" mV",
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
              value: false,
              mcp:{
                address: 0x20,
                pinMode: "output",
                pin: 0
              },
            },
            massage: {
              type: "ToggleAdjustButton",
              title: "Massage",
              value: {isOn: false, value: 30},
              unit: "min"//TODO: copier css de toggleadjustbutton dans le display du adjustbutton (pour pas que ça déborde)
            }
          },
          visible: true
        },
        "Pompe": {
          items: {
            stop: {
              type: "PushButton",
              inner: "Stop",
              value: false,
              mcp: {
                address: 0x20,
                pinMode: "output",
                pin: 1
              }
            },
            start: {
              type: "PushButton",
              inner: "Start",
              value: false,
              mcp: {
                address: 0x20,
                pinMode: "output",
                pin: 2
              }
            },
            freq_minus: {
              type: "PushButton",
              inner: "-",
              value: false,
              mcp: {
                address: 0x20,
                pinMode: "output",
                pin: 3
              }
            },
            freq_plus: {
              type: "PushButton",
              inner: "+",
              value: false,
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
          toggleGroup: true,
          name: "filtration_mode",
          value: 0, // index
          items: {
            filtration: {
              type: "Button",
              title: "Filtration",
              name: "filtration"
            },
            lavage : {
              type: "Button",
              title: "Lavage",
              name: "lavage",
            },
            recirculation: {
              type: "Button",
              title: "Recirculation",
              name: "recirculation"
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
              unit: " jours",
            },
            washing_hour: {
              type: "AdjustButton",
              value: 3,
              title: "Heure de lavage",
              unit: "h00"
            },
            washing_cycle_duration: {
              type: "AdjustButton",
              value: 5,
              title: "Durée de lavage",
              unit: "min"
            },
            washing_cycle_count: {
              type: "AdjustButton",
              value: 5,
              title: "Répétitions",
            },
            washing_cycle_delay: {
              type: "AdjustButton",
              value: 2,
              title: "Espacement",
              unit: "min"
            }
          },
          visible: false
        },
        // "Console": {
        //   items: {
        //     console: {
        //       type: "Console"
        //     }
        //   },
        //   visible: false
        // }
      }

      let result = []
      let titles = Object.keys(startup_interface) // array of str
      for (let i=0; i<titles.length; i++) {
        let category = startup_interface[titles[i]]
        let meta = {}
        for (let prop of Object.keys(category)) {
          if (!(prop=="items" || prop=="visible")) {
            meta[prop] = category[prop];
          }
        }
        result.push(
          <Category
            title={titles[i]}
            items = {category.items}
            visible={category.visible}
            meta={meta}
          />
        )
    }
    result.push(this.getPlot());
    return result;
  }
}

export default Pool