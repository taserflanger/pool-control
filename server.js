const io = require('socket.io')();
global.io = io;
const mcp_api = require('./mcp_api');
global.mcp_api = mcp_api

const {listener} = require('./listener');
const {log, parseData, Write} = require('./utils');

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

function InitializeClient(client) {
    //update variables on Connection
    for (const [variable, obj] of Object.entries(POOL)) {
        client.emit("update_" + variable, obj);
    }
}

const port = 8000;
io.listen(port);
log('listening on port '+ port);
