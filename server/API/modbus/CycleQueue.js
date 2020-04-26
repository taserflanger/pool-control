const {Queue} = require('./Queue');

class CycleQueue extends Queue {
    constructor(... cycle) {
        super(... cycle.slice(0, cycle.length));
        // initialize queue with
        if (cycle.length===0) {
            throw "Invalid cycle array"
        }
        this.cycle = cycle;
        this.cycle_state = 0;
    }
    async executeInstruction() {
        await super.executeInstruction();
        this.add(this.cycle[this.cycle_state]);
        this.cycle_state += 1;
        this.cycle_state %= this.cycle.length;
    }

    push() {
        throw "Cannot push to a Cycle Queue, reserved for cyclic operations like data broadcasting"
    }

}

module.exports = {
    CycleQueue: CycleQueue
}