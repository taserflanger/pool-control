global.io = null
global.mcp_api=null;
global.ISRASPBERRY=null;
global.TIME_SCALE=null;
global.later=null;
global.TIMEOUTS=null;
global.WASHING_AUTO_SCHED=null;
global.MODBUS_QUEUE=null;
global.MODBUS_CLIENT=null;
global.modbus_api=null
io = require('socket.io')();
mcp_api = require('./API/mcp/mcp_api');
modbus_api = require('./API/modbus/modbus_api');
modbus_api.startLoopQueue();

const {listener} = require('./events/listener');
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
    mcp_api.initializeMcp();
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
