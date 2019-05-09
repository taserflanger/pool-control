const io = require('socket.io')();
const SequenceController = require('./server/SequenceController');
const seq = new SequenceController();
// const Gpio = require('onoff').Gpio;
// let NORTHLIGHT = new Gpio(18, 'out');
// let SOUTHEASTLIGHT = new Gpio(23, 'out');
// let SOUTHLIGHT = new Gpio(24, 'out');
let NORTHLIGHT = {writeSync:(a)=>null};
let SOUTHEASTLIGHT = {writeSync:(a)=>null};
let SOUTHLIGHT = {writeSync:(a)=>null};
let ISRASPBERRY = true;
try {
    const Gpio = require('onoff').Gpio;
    let NORTHLIGHT = new Gpio(18, 'out');
    let SOUTHEASTLIGHT = new Gpio(23, 'out');
    let SOUTHLIGHT = new Gpio(24, 'out');
} catch (error) {
    ISRASPBERRY = false;
}

let globals = {
    Spots: {
        north_light: 0, // here read with gpio
        southeast_light: 0,
        south_light: 0
    },
    Moteur: {
        is_on: 1,
        freq: 10
    },
    Filtre: 0,
    Broadcast: {
        water_temp: 20,
        air_temp: 25,
        ph: 7,
        orp: 5
    },
    useSequencer: false
}

io.on('connection', (client) => {
    console.log('client connected')
    InitializeClient(client);
    client.on('setSequenceName', (index, name)=> {
        seq.rename(index, name);
        console.log(index, name);
        client.emit('updateNames', seq.names);
    })
    client.on('setTempo', tempo => {
        seq.tempo = tempo;
        io.emit('setTempo', seq.tempo);
    });
    client.on('toggleUseSequencer', () => {
        toggleUseSequencer(client);
    });
    client.on('toggleSequenceSpotTick', (index, spot, tick)=> {
        toggleSequenceSpotTick(index, spot, tick);
    });
    client.on('request_', (category, variable) => {
        client.emit("update_"+category, variable, globals[category][variable]);
    });
    client.on('toggle', (category, variable) => {
        toggleVariable(category, variable, client);
    });
    client.on('setValue', (category, variable, value) => {
        setValue(category, variable, value, client);
    });
    client.on('setSingleValue', (category, value) => {
        setSingleValue(category, value, client);
    })
    setInterval(()=> {
        globals.Broadcast.water_temp += Math.round(Math.random()*2 - 1, 4);
        globals.Broadcast.air_temp += (Math.round(Math.random()*2 - 1, 4));
        io.emit("update_Broadcast", "water_temp", globals.Broadcast.water_temp);
        io.emit("update_Broadcast", "air_temp", globals.Broadcast.air_temp);
    }, 1000);
});

function setSingleValue(category, value, client) {
    globals[category] = value;
    console.log(category, globals[category]);
    handleVariableChange(category, client);
    client.emit("update_" + category, value);
    client.broadcast.emit("update_" + category, globals[category]);
}

function InitializeClient(client) {
    client.emit('updateSequences', seq.sequences);
    client.emit('setTempo', seq.tempo);
    client.emit('toggleUseSequencer', globals.useSequencer);
    client.emit('updateNames', seq.names);
    //update variables on Connection
    Object.keys(globals).forEach((category) => {
        initializeCategory(category, client);
    }, this);
}

function setValue(category, variable, value, client) {
    globals[category][variable] = value;
    console.log(variable, globals[category][variable]);
    handleVariableChange(variable, client);
    client.broadcast.emit("update_" + category, variable, globals[category][variable]);
}

function toggleVariable(category, variable, client) {
    globals[category][variable] = !globals[category][variable];
    console.log(variable, globals[category][variable]);
    handleVariableChange(variable, client);
    client.emit("update_" + category, variable, globals[category][variable]);
    client.broadcast.emit("update_" + category, variable, globals[category][variable]);
}

function toggleSequenceSpotTick(index, spot, tick) {
    v = seq.sequences[index][spot][tick];
    v = !v;
    seq.sequences[index][spot][tick] = v;
    io.emit('updateSequences', seq.sequences);
}

function toggleUseSequencer(client) {
    globals.useSequencer = !globals.useSequencer;
    if (globals.useSequencer) {
        seq.start(lightValues => {
            let i = 0;
            Object.keys(globals.Spots).forEach(key => {
                console.log(key, lightValues[i]);
                globals.Spots[key] = lightValues[i];
                io.emit('update_Spots', key, lightValues[i]? true:false);
                handleVariableChange(key, client);
                i++;
            });
            io.emit('tick', seq.tick);
        });
    }
    else {
        seq.stop();
    }
    io.emit('toggleUseSequencer', globals.useSequencer);
}

function initializeCategory(category, client) {
    if (category == "Filtre") {
        client.emit("update_" + category, globals[category]);
    }
    else {
        Object.keys(globals[category]).forEach((variable) => {
            client.emit("update_" + category, variable, globals[category][variable]);
        }, this);
    }
}

function handleVariableChange(variable, client) {
    if(ISRASPBERRY) {
        //write with gpio
        if (variable=="north_light") {
            NORTHLIGHT.writeSync(globals.Spots.north_light? 1:0);
        } else if (variable == "south_light") {
            SOUTHLIGHT.writeSync(globals.Spots.south_light? 1:0);
        }  else if (variable == "southeast_light") {
            SOUTHEASTLIGHT.writeSync(globals.Spots.southeast_light? 1:0);        
        } else if (variable == "is_on") {
            
        }  else if (variable == "freq") {

        } else if (variable == "Filtre") {
            console.log('lol');
            io.emit('updateChangeFilterMode', true);
            setTimeout(()=> io.emit('updateChangeFilterMode', false), 3000)
        } else {
            console.log("Unkown variable");
        }
    }
}

const port = 8000;
io.listen(port);
console.log('listening on port ', port);