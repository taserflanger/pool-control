import React, { Component } from 'react';
import Title from './Title';
import Category from './Category';
import SequenceEditor from './SequenceEditor';
import openSocket from 'socket.io-client';
import ImageToggle from './ImageToggle';


const io = openSocket('http://localhost:8000/');
// const io = openSocket('http://90.63.156.114:8000');
// const io = openSocket('http://192.168.0.100:8000/');

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
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
      activeSequence: 0
    }
  }

  componentDidMount() {
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
    io.emit('toggleUseSequencer');
  }

  render() {
    const r="./ressources/";
    return (
      <div>
        <div className="modal" style={{display: this.state.isEditingSpotSequence? "block" : "none"}}>
          <div className="modal-content" >
          <SequenceEditor
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
          />
          <span className="close" onClick={()=> {
            this.setState({isEditingSpotSequence: false});
          }}>&times;</span>
          </div>
        </div>
        <Title size="4" text="Interface Piscine"/>
        <Category
          title="Spots"
          types={["ImageToggle"]}
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
        <div className="row seqEditorProps">
          <div className="col">
            <ImageToggle 
              onClick={(useless) => this.handleToggleUseSequencer()}
              title="Séquenceur"
              paths={[r+"unlit.png", r+"lit.png"]}
              align="center"
              value={this.state.useSequencer}
            />
            </div>
            <div className="col">
            <div
              className="button shadow-box"
              onClick={()=> {
                this.setState({isEditingSpotSequence: true})
            }}>Editer</div>
          </div>
        </div>
        <Category
          title="Broadcast"
          types={["ValueBroadcast", "ValueBroadcast", "ValueBroadcast"]}
          titles={["Température Air", "Température Eau", "pH"]}
          names={["air_temp", "water_temp", "ph"]}
          initialValues = {[25, 20, 7]}
          aligns={["center", "center", "center"]}
          sizes={[3, 3, 3]}
          isBroadcast={true}
          boradcastSuffixes={[" °C", " °C", ""]}
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
        />
        <Category
          title="Filtre"
          types={["ImageToggle", "ImageToggle", "ImageToggle"]}
          names = {["backwash", "normal", "recirculation"]}
          titles={["Lavage Filtre", "Filtration", "Recirculation"]}
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
