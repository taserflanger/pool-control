class Instruction {
    constructor({type, name, modbus_address, io_address}) {
        this.type = type;
        this.name = name;
        this.modbus_address = modbus_address;
        this.io_address = io_address;
    }
    async execute() {
        if (this.type=="r") {
            let x = await MODBUS_CLIENT.readHoldingRegisters(this.modbus_address, 1);
        }
    }
}

module.exports = {
    Instruction: Instruction
}