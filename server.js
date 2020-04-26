global.io = null
global.mcp_api=null;
global.ISRASPBERRY=null;
global.TIME_SCALE=null;
global.later=null;
global.TIMEOUTS=null;
global.WASHING_AUTO_SCHED=null;
io = require('socket.io')();
mcp_api = require('./mcp_api');

const {listener} = require('./listener');
const {log, parseData, Write, timeout} = require('./utils');

const ModbusRTU = require('modbus-serial')
const client = new ModbusRTU()

//slave ID - can be changed in the inverter settings
client.setID(1)
//depends on the baud rate setting: 20ms is OK with 115200, 200ms with 9600BPS
client.setTimeout(20)

parseData();
if (ISRASPBERRY) {
    mcp_api.initializeMcp([POOL.spots, POOL.stop, POOL.start, POOL.freq_minus, POOL.freq_plus]);
        if (POOL.washing_auto) {
    }
}

io.on('connection', (client) => {
    log('client connected')
    broadcastValues();
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
    await client.connectRTUBuffered(
        "/dev/ttyUSB0",
        {
            baudRate: 115200, // FB.02: 5 115200BPS 
            dataBits:8,
            parity:"none", // FB.02: 0 default
            stopBits:1 // FB.02: 0
        });
    while (true) {
        await timeout(500);
        try {
            let x = await client.readHoldingRegisters(0xD000+2, 1);
            console.log(x)
            io.emit("update_motor_freq", x.data[0]/100);
        } catch (err) {
            
        }
            
    }
}

function InitializeClient(client) {
    //update variables on Connection
    for (const [variable, obj] of Object.entries(POOL)) {
        client.emit("update_" + variable, obj);
    }
}

const port = 7999;
io.listen(port);
log('listening on port '+ port);
