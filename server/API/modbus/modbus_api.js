const ModbusRTU = require('modbus-serial')
const {Queue} = require("./Queue");
const {CycleQueue} = require("./CycleQueue");
MODBUS_CLIENT = new ModbusRTU()

//slave ID - can be changed in the inverter settings
MODBUS_CLIENT.setID(1)

// 50ms is too much, 100ms is also too much at 2400bps but 100ms is OK at 4800bps
// 200ms is safe 8*8
MODBUS_CLIENT.setTimeout(400)


MODBUS_QUEUE = new Queue()
const Cycle_Queue = new CycleQueue(
    {type: "r", name: "Température", "modbus_address": 0x3000+33}
)

let stopped=true;
MODBUS_CLIENT.connectRTUBuffered(
    "/dev/ttyUSB0",
    {
        baudRate: 2410,
        dataBits:8,
        parity:"even",
        stopBits:1
    }).then(()=> {
        stopped=false;
})

//slave ID - can be changed in the inverter settings
MODBUS_CLIENT.setID(1)

// 50ms is too much, 100ms is also too much at 2400bps but 100ms is OK at 4800bps
// 200ms is safe 8*8
MODBUS_CLIENT.setTimeout(400)

const {timeout} = require('../../utils');


async function write(register, value) {
    //gives access to modbus
    console.log(await MODBUS_CLIENT.writeRegister(0x0006, 2));
    console.log(await MODBUS_CLIENT.writeRegister(register, value));
    //yields access back
    console.log(await MODBUS_CLIENT.writeRegister(0x0006, 1));
}

async function LoopQueue() {
    while (!stopped) {
        await timeout(300);
        if (MODBUS_QUEUE.length>0) {
            await MODBUS_QUEUE.executeInstruction();
        } else {
            await Cycle_Queue.executeInstruction();
        }
        try {
            let instruction = MODBUS_QUEUE[priority_index].pop()
            let effective_address = parseInt("0x" + instruction.modbus_address_letter + "000") + instruction.modbus_address;
            if (instruction.type === "write") {
                let x = await write(effective_address, instruction.value);
                io.emit("update_" + instruction.io_address, instruction.value);
            } else if (instruction.type === "read") {
                let x = await MODBUS_CLIENT.readHoldingRegisters(effective_address, 1);
                io.emit("update_" + instruction.io_address, x.data[0] * (instruction.scale || 1))
            }
        } catch (err) {

        }
    }
}

const stopLoopQueue = ()=>{stopped = true};
const startLoopQueue = ()=>{
    if (stopped) {
        stopped=false;
        LoopQueue();
    }
};

module.exports = {
    stopLoopQueue: stopLoopQueue,
    startLoopQueue: startLoopQueue
}