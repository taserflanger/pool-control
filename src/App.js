import React, { Component } from 'react';
import $ from 'jquery';
import 'jquery-mousewheel';
import Title from './Title';
import Category from './Category';
import SequenceEditor from './SequenceEditor';
import openSocket from 'socket.io-client';
import ImageToggle from './ImageToggle';
import Slider from './Slider';
import './css/App.css';
const r="./ressources/";
const cumulativeSum = ([head, ...tail]) =>
   tail.reduce((acc, x, index) => {
      acc.push(acc[index] + x);
      return acc
  }, [head])

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
      seqDropDownWidth: 0,
      scroll:0,
      positions: [0, 0, 0, 0, 0, 0],
      opacities: [0, 0, 0, 0, 0, 0],
      angles: [0, 0, 0, 0, 0, 0]
    }
    this.heights = [];
    this.cHeights = [];
    this.normalizedPos = [];
    this.maxHeight = 0;
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

  calculateAngles() {
    let angles = []
    // console.log(this.normalizedPos);
    for (var i=0; i<this.state.positions.length; i++) {
      let normPos = this.state.positions[i] / ($(window).height() -this.maxHeight);
      let angle = this.MapRange(0.8, 1, normPos, 0, -0.5*Math.PI);
      let angle2 = this.MapRange(0, 0.2, normPos, 0.5*Math.PI, 0);
      if (normPos>0.8) {
        angles.push(angle)
      } else {
        angles.push(angle2)
      }
    }
    this.setState({angles: angles});
  }

  getPosAndOpacityList(scroll) {
    // console.log(normalizedPos);
    let positions = [];
    let opacities = [];
    // let angles = []
    for (var i=0; i<this.normalizedPos.length; i++) {
      let angle = this.normalizedPos[i]*2*Math.PI + scroll;
      // if (angle%(2*Math.PI) > Math.PI/4 && angle%(2*Math.PI) < 3*Math.PI/4) {
      //     angles.push(-Math.acos(Math.pow(Math.cos(-angle), 1/3))); 
      //   } else {
      //     angles.push(Math.acos(Math.pow(Math.cos(-angle), 1/3))); 
      //   }
      // angles.push(Math.acos(Math.pow(Math.cos(-angle), 1/7))); 
      
      let computedPos;
      computedPos = (Math.sin(angle) + 1) /2;
      positions.push(computedPos * ($(window).height() -this.maxHeight));
      let opacity = Math.cos(angle);// the opacity is the cos, but clamped instead of remapped.
      opacity = opacity<0? 0:opacity;
      opacities.push(Math.pow(opacity, 1/3));
    }
    // console.log(positions);
    this.calculateAngles();
    this.setState({
      positions: positions,
      opacities: opacities,
      // angles: angles,
      scroll: scroll
    });
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
    this.calculateHeights();
    $(window).on('mousewheel', (e)=>this.handleScroll(e));
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

  calculateHeights() {
    this.heights = $.map($('.category'), (c) => c.offsetHeight);
    this.heights.rotate(-1);
    this.maxHeight = Math.max.apply(null, this.heights);
    console.log(this.maxHeight);
    console.log(this.heights);
    this.cHeights = cumulativeSum(this.heights);
    //normalize
    let max = this.cHeights[this.cHeights.length - 1];
    this.normalizedPos = this.cHeights.map(h => h / max);
    this.getPosAndOpacityList(this.state.scroll);
  }

  handleScroll(e) {
    if (!this.state.isEditingSpotSequence) {
      this.getPosAndOpacityList(this.state.scroll + e.deltaY*e.deltaFactor/100);
    }
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
            opacity: this.state.opacities[1],
            transform: `rotateX(${this.state.angles[1]}rad)`,
            zIndex: Math.round(this.state.opacities[1]*100)
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
              value={1}
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
            opacity: this.state.opacities[1],
            transform: `rotateX(${this.state.angles[1]}rad)`,
            zIndex: Math.round(this.state.opacities[1]*100)
          }}>
          <div className="row">
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
        </div>
      );
    }
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
          titles={["Nord", "Sud-Est", "Sud"]}
          initialValues={[0, 0, 0]}
          paths={[
              [r+"unlit.png", r+"lit.png"],
              [r+"unlit.png", r+"lit.png"],
              [r+"unlit.png", r+"lit.png"]
            ]}
          aligns={["center", "center", "center"]}
          sizes={[3, 3, 3]}
          position={this.state.positions[0]}
          opacity={this.state.opacities[0]}
          angle={this.state.angles[0]}
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
          position={this.state.positions[2]}
          opacity={this.state.opacities[2]}
          angle={this.state.angles[2]}
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
          position={this.state.positions[3]}
          opacity={this.state.opacities[3]}
          angle={this.state.angles[3]}
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
          position={this.state.positions[4]}
          opacity={this.state.opacities[4]}
          angle={this.state.angles[4]}
        />
      </div>
    );
  }
}

export default App;
