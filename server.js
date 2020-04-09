const io = require('socket.io')();
global.io = io;

const {listener} = require('./listener');
const {log, parseData} = require('./utils');

parseData();
if (ISRASPBERRY) {
    mcp.initializeMcp([POOL.spots, POOL.stop, POOL.start, POOL.freq_minus, POOL.freq_plus]);
    if (POOL.washing_auto) {

    }
}

io.on('connection', (client) => {
    log('client connected')
    InitializeClient(client);
    for (let [variable, f] of Object.entries(listener)) {
        client.on(variable, (...args) => {
            let obj;
            [variable, obj] = f(...args); // potentially multiple arguments to f
            client.emit(variable, obj);
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
