import React, { Component } from 'react';
import Title from './Title';
import Category from './Category';
import SequenceEditor from './SequenceEditor';
import openSocket from 'socket.io-client';
import ImageToggle from './ImageToggle';
import './css/App.css';
const r="./ressources/";
// import DropdownSelector from './DropdownSelector';

const io = openSocket('http://localhost:8000/');
// const io = openSocket('http://90.63.156.114:8000');
// const io = openSocket('http://192.168.0.10:8000/');

class App extends Component {

  constructor(props) {
    super(props);
    //initializing props from index
    this.state = {
      //initializing all states
      isEditingSpotSequence: false,
      tempo: 60,
      useSequencer: false,
      sequences: [
        [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]      
        ]
      ],
      tick: 0,
      activeSequence: 0,
      names: ["default"],
      isChangingFilterMode: 0,
      seqPropsDropdown: false,
      seqDropDownWidth: 0
    }
  }

  toggleRowSeqEditorProps() {
    // toggle the dropdown menu for sequence editing
    this.setState({seqPropsDropdown: !this.state.seqPropsDropdown});
    // if (this.state.seqPropsDropdown) {
    //   jQuery('#seqEditorProps').animate({width: '100%'});
    // }
  }

  componentDidMount() {
    // setting up event listeners
    io.on('updateChangeFilterMode', newVal => {
      this.setState({isChangingFilterMode: newVal});
    });
    io.on('tempoUpdate', tempo => {
      this.setState({
        tempo: tempo
      });
    });
    io.on('toggleUseSequencer', newVal => {
      this.setState({
        useSequencer: newVal
      });
    });
    io.on('updateSequences', newSeqs => {
      this.setState({
        sequences: newSeqs
      });
    });
    io.on('updateNames', names => {
      this.setState({
        names: names
      })
    })
    io.on('tick', val => {
      this.setState({
        tick: val
      });
    });
    io.on('setTempo', val=> {
      this.setState({
        tempo: val
      });
    });
  }

  handleToggleUseSequencer() {
    // using Sequencer or not
    io.emit('toggleUseSequencer');
  }

  getSequencerContent() {
    // sequencer dropdown content get
    if (this.state.seqPropsDropdown) {
      return(
        <div id="seqDropDown" className={`category ${this.state.seqPropsDropdown? "open": "closed"}`}>
    <Title size="2" align="center" text="Séquenceur" onClick={() => this.toggleRowSeqEditorProps()} style={{cursor: "pointer"}}/>
        <div className={`row seqEditorProps`} id="seqEditorProps">
          <div className="col-4">
            <ImageToggle 
              onClick={(useless) => this.handleToggleUseSequencer()}
              title=""
              size={3}
              paths={[r+"lit.png", r+"unlit.png"]}
              subtitles={["Activer", "Désactiver"]}
              align="center"
              value={this.state.useSequencer}
            />
            </div>
            <div id="noShadow" className="col">
            <ImageToggle
              onClick={()=> {
                this.setState({isEditingSpotSequence: true})
              }}
              size={3}
              title=""
              paths={["", r+"edit.png"]}
              align="center"
              value={1}
              name="edit"
              id="noShadow"
            />
            </div>
        </div>
        </div>
      );
    } else {
        return (
        <div id="seqDropDown" className="row closed">
        <div className="col">
          <ImageToggle
            onClick={(useless)=>this.toggleRowSeqEditorProps()}
            size={2.5}
            title=""
            paths={[r+"plus.png", r+"plus.png"]} 
            align="center"
            value={1}
            name="more"
          />
        </div>
        </div>
      );
    }
  }

  render() {
    return (
      <div>
        {/* modal content for sequence editing */}
        <div className="modal" style={{display: this.state.isEditingSpotSequence? "block" : "none"}}>
          <div className="modal-content" >
          <SequenceEditor
            sequenceName={this.state.names[this.state.activeSequence]}
            onChangeName={(newName) => io.emit('setSequenceName', this.state.activeSequence, newName)}
            activeSequence={0}
            toggleActive={() => this.handleToggleUseSequencer()}
            onTempoChange={(e)=>io.emit('setTempo', e.target.value)}
            onChange={(i, t)=> {
              io.emit('toggleSequenceSpotTick', this.state.activeSequence, i, t);
              console.log(i, t);
            }}
            sequences={this.state.sequences}
            tick={this.state.tick}
            tempo={this.state.tempo}
            name={this.state.names[this.state.activeSequence]}
          />
          <span className="close" onClick={()=> {
            this.setState({isEditingSpotSequence: false});
          }}>&times;</span>
          </div>
        </div>
        {/* Spot category */}
        <Category
          title="Spots"
          types={["ImageToggle", "ImageToggle", "ImageToggle"]}
          names={["north_light", "southeast_light", "south_light"]}
          titles={["Nord", "Sud-Est", "Sud"]}
          initialValues={[0, 0, 0]}
          paths={[
              [r+"unlit.png", r+"lit.png"],
              [r+"unlit.png", r+"lit.png"],
              [r+"unlit.png", r+"lit.png"]
            ]}
          aligns={["center", "center", "center"]}
          sizes={[3, 3, 3]}
        />
        {/* Sequence editor props*/}
            {this.getSequencerContent()}
        {/* Broadcast category */}
        <Category
          title="Broadcast"
          types={["ValueBroadcast", "ValueBroadcast", "ValueBroadcast", "ValueBroadcast"]}
          titles={["Air", "Eau", "pH", "ORP"]}
          names={["air_temp", "water_temp", "ph", "orp"]}
          initialValues = {[25, 20, 7, 0]}
          aligns={["center", "center", "center", "center"]}
          sizes={[3, 3, 3, 3]}
          isBroadcast={true}
          boradcastSuffixes={[" °C", " °C", "", ""]}
        />
        <Category
          title="Moteur" 
          types={["ImageToggle", "Slider"]} 
          titles={["ON/OFF", "Débit"]}
          subtitles={[
            ["Démarrer", "Arrêter"],
            []
          ]}
          names = {["is_on", "freq"]}
          initialValues={[1, 10]}
          paths={[[r+"launch.png", r+"shutdown.png"]]}
          aligns={["center", "center"]}
          sizes={[3]}
          disabled={this.state.isChangingFilterMode}
        />
        <Category
          title="Filtre"
          types={["ImageToggle", "ImageToggle", "ImageToggle"]}
          names = {["normal", "backwash", "recirculation"]}
          titles={["Filtration", "Lavage", "Recirculation"]}
          initialValues={1}
          paths={[
            [r+"unlit.png", r+"lit.png"],
            [r+"unlit.png", r+"lit.png"],
            [r+"unlit.png", r+"lit.png"]
          ]}
          aligns={["center", "center", "center"]}
          sizes={[3, 3, 3]}
          isToggleGroup={true}
          alignCenter={true}
        />
      </div>
    );
  }
}

export default App;
