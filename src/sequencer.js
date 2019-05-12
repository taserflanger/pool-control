function getSequencerContent() {
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
              title={""}
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