const {Instruction} = require('./Instruction');

class Queue extends Array {
    constructor(... items) {
        super(... items);
    }
    async executeInstruction() {
        let obj = this[0];
        let instruction = new Instruction(this.pop());
        await instruction.execute();
    }
    add(obj) {
        this.splice(0, 0, obj);
    }
    push(...items) {
        console.warn("Instruction added to the top of the queue, it will be prioritized over any other event in the queue. Consider using add instead of push ");
        super.push(...items)
    }

}

module.exports = {
    Queue: Queue
}