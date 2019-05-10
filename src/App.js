import React, { Component }  from 'react';
import Title from './Title';
import Category from './Category';
import SequenceEditor from './SequenceEditor';
import openSocket from 'socket.io-client';
import ImageToggle from './ImageToggle';
import Slider from './Slider';
import './css/App.css';
const r="./ressources/";

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

const io = openSocket('http://localhost:8000/');
// const io = openSocket('http://90.63.156.114:8000');
// const io = openSocket('http://192.168.0.100:8000/');

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
      seqDropDownWidth: 0,
      scroll:0,
      positions: [0, 0, 0, 0, 0, 0],
      angles: [0, 0, 0, 0, 0, 0],
      visibilities: [1, 1, 1, 1, 1, 1]
    }
    this.heights = [];
    this.cHeights = [];
    this.normalizedPos = [];
    this.maxHeight = 0;
    this.lastTouch;
    this.isScrolling = false;
  }

  InverseLerp(min, max, val) {
    return (val - min) / (max-min);
  }

  Lerp(min, max, val) {
    return val*(max-min) + min
  }

  Clamp(min, val, max) {
    if (val < min) {
      return min
    } else if (val > max) {
      return max
    } else {
      return val
    }
  }

  MapRange(inMin, inMax, val, outMin, outMax) {
    val = this.Clamp(inMin, val, inMax);
    let inverse = (val-inMin) / (inMax-inMin);
    return inverse*(outMax-outMin)+outMin;
  }

  toggleRowSeqEditorProps() {
    // toggle the dropdown menu for sequence editing
    this.setState({seqPropsDropdown: !this.state.seqPropsDropdown}, this.calculateHeights);
    // if (this.state.seqPropsDropdown) {
      //   jQuery('#seqEditorProps').animate({width: '100%'});
      // }
  }

  componentDidMount() {
    // setting up event listeners
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
        <div 
          id="seqDropDown" 
          className={`category ${this.state.seqPropsDropdown? "open": "closed"}`}
          style={{
            top: this.state.positions[1],
            transform: `rotateX(${this.state.angles[1]}rad)`,
            display: `${this.state.visibilities[1]==1?'inline':'none'}`
          }}>
    <Title size="2" align="center" text="Séquenceur" onClick={() => this.toggleRowSeqEditorProps()} style={{cursor: "pointer"}}/>
          <div className="container">
        <div className={`row justify-content-around`}>
          <div className="col">
            <ImageToggle 
              onClick={(useless) => this.handleToggleUseSequencer()}
              title=""
              size={3}
              paths={[r+"unlit.png", r+"lit.png"]}
              subtitles={["Activer", "Désactiver"]}
              align="center"
              value={this.state.useSequencer}
            />
            </div>
            <div className="col-8">
            <Slider
                    value={this.state.tempo}
                    onChange={(e) => io.emit('setTempo', e.target.value)}
                    min="20" max="300"
                    suffix="BPM"
                />
            </div>
            <div id="noShadow" className="col">
            <ImageToggle
              onClick={()=> {
                this.setState({isEditingSpotSequence: true})
              }}
              className="props"
              size={3}
              title=""
              paths={["", r+"edit.png"]}
              align="center"
              value={true}
              name="edit"
              id="noShadow"
            />
            </div>
            </div>
        </div>
        </div>
      );
    } else {
        return (
          <div id="seqDropDown" className="category closed"
          style={{
            top: this.state.positions[1],
            transform: `rotateX(${this.state.angles[1]}rad)`,
            display: `${this.state.visibilities[1]==1?'inline':'none'}`
          }}>
          <div className="row">
        <div className="col">
          <ImageToggle
            onClick={(useless)=>this.toggleRowSeqEditorProps()}
            size={2.5}
            title=""
            paths={[r+"plus.png", r+"plus.png"]} 
            align="center"
            value={true}
            name="more"
          />
        </div>
        </div>
        </div>
      );
    }
  }

  enableAdminMode() {
    return;
  }

  render() {
    return (
      <div id="app-container">
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
          titles={[" 1 ", " 2 ", " 3 "]}
          initialValues={[false, false, false]}
          paths={[
              [r+"unlit.png", r+"lit.png"],
              [r+"unlit.png", r+"lit.png"],
              [r+"unlit.png", r+"lit.png"]
            ]}
          aligns={["center", "center", "center"]}
          sizes={[3, 3, 3]}
          position={this.state.positions[0]}
          angle={this.state.angles[0]}
          visibility={this.state.visibilities[0]}
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
          position={this.state.positions[2]}
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
          initialValues={[true, 10]}
          disabled={this.state.isChangingFilterMode}
        /> # simplifier
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
          position={this.state.positions[4]}
          angle={this.state.angles[4]}
          visibility={this.state.visibilities[4]}
        />
        <ImageToggle
          onClick = {()=>this.enableAdminMode()}
          name={"Admin"}
          value={true}
          size={3}
          subtitles={[]}
          align={"center"}
          title={""}
        />
      </div>
    );
  }
}

export default App;
