class SequenceController {
    constructor() {
        let sequence= [
            [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0],
            [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0]
        ]
        this.sequences = [sequence];
        this.tempo = 60
        this.activeSequence = 0;
        this.lightValues = [0, 0, 0];
        this.interval = null;
        this.tick = -1;
        this.isActive = false;
        this.names=["default"]
    }
    // constructor(sequences) {
    //     this.sequences = sequences;
    // }
    toggleTick(i, light, tick) {
        let i_tick = this.sequences[i][light][tick];
        i_tick = ParseInt(!i_tick);
    }

    addSequence() {
        this.sequences.push([
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        ]);
        this.names.push(`séquence par défaut${this.names.length}`)
    }

    rename(index, newName) {
        this.names[index] = newName;
    }
    
    removeSequence(index) {
        if (this.isActive) {
            this.stop()
        }
        this.names.splice(index, 1);
        this.sequences.splice(index, 1);
    }

    update(cb) {
        let sequence = this.sequences[this.activeSequence];
        this.tick = this.tick == 11? -1: this.tick;
        this.tick++;
        // console.log(this.tick);
        this.lightValues = sequence.map((val, light) => sequence[light][this.tick]);
        cb(this.lightValues);
        if (this.isActive) {
            this.interval = setTimeout(()=>this.update(cb), 60000/this.tempo);
        }
    }
    start(cb) {
        this.isActive = true;
        this.interval = setTimeout(()=>this.update(cb), 60000/this.tempo);
    }
    stop() {
        this.isActive = false;
    }
}

module.exports=SequenceController;