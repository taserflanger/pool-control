const io = require('socket.io')();
global.io = io;
const mcp_api = require('./mcp_api');
global.mcp_api = mcp_api

const {listener} = require('./listener');
const {log, parseData, Write, timeout} = require('./utils');

const ModbusRTU = require('modbus-serial')
const client = new ModbusRTU()

//slave ID - can be changed in the inverter settings
client.setID(1)

// 50ms is too much, 100ms is also too much at 2400bps but 100ms is OK at 4800bps
// 200ms is safe 8*8
client.setTimeout(400)

parseData();
if (ISRASPBERRY) {
    mcp_api.initializeMcp([POOL.spots, POOL.stop, POOL.start, POOL.freq_minus, POOL.freq_plus]);
        if (POOL.washing_auto) {
    }
}

io.on('connection', (client) => {
    log('client connected')
    InitializeClient(client);
    for (let [l, f] of Object.entries(listener)) {
        client.on(l, (variable, ...args) => {
            f(variable, ...args); // potentially multiple arguments to f
            Write();
            io.emit('update_'+variable, POOL[variable]) //update state
        })
    }
    //initialize all listeners

});

//broadcast values
// motor_freq: 2
async function broadcastValues() {
    while (true) {
        await timeout(1000);
        await client.connectRTUBuffered(
            "/dev/ttyUSB0",
            {
                baudRate: 2410, 
                dataBits:8,
                parity:"even",
                stopBits:1
            })
        io.emit("update_motor_freq", client.readHoldingRegisters(0xD000+2, 1).data);
    }
}
broadcastValues();

function InitializeClient(client) {
    //update variables on Connection
    for (const [variable, obj] of Object.entries(POOL)) {
        client.emit("update_" + variable, obj);
    }
}

const port = 8000;
io.listen(port);
log('listening on port '+ port);
