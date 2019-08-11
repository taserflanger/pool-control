const io = require('socket.io')();
const fs = require('fs');
const moment = require('moment');
const MCP23017 = require('node-mcp23017');
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
    NORTHLIGHT = new Gpio(18, 'out');
    SOUTHEASTLIGHT = new Gpio(23, 'out');
    SOUTHLIGHT = new Gpio(24, 'out');
    var mcp = new MCP23017({
        address: 0x20, //default: 0x20
        device: '/dev/i2c-1', // '/dev/i2c-1' on model B | '/dev/i2c-0' on model A
        debug: true //default: false
      });
      for (var i = 0; i < 16; i++) {
        mcp.pinMode(i, mcp.OUTPUT);
        //mcp.pinMode(i, mcp.INPUT); //if you want them to be inputs
        //mcp.pinMode(i, mcp.INPUT_PULLUP); //if you want them to be pullup inputs
      }
} catch (error) {
    ISRASPBERRY = false;
}

mcp.digitalWrite(0, mcp.HIGH);

data = fs.readFileSync("server/serverState.json", 'utf8');
logsdata = fs.readFileSync("server/log.json", 'utf8');
function Write() {
    fs.writeFile("server/serverState.json", JSON.stringify(globals, null, 4), (err)=> {
        if (err) throw err;
    })
}
function WriteLogs() {
    fs.writeFile("server/log.json", JSON.stringify(logs, null, 4), (err)=> {
        if (err) throw err;
    })
}


let globals = JSON.parse(data.toString());
let logs = JSON.parse(logsdata.toString());

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
    client.on('loginAdmin', password => {
        console.log(client.toString() + " trying to connect width passwd " + password);
        if (password==globals.password) {
            client.emit('loginAdmin', true);
        } else {
            client.emit('loginAdmin', false);
        }
    })
    client.on('toggleSequenceSpotTick', (index, spot, tick)=> {
        toggleSequenceSpotTick(index, spot, tick);
    });
    client.on('request_', (category, variable) => {
        client.emit("update_"+category, variable, globals[category][variable]);
    });
    client.on('toggle', (category, variable) => {
        toggleVariable(category, variable, client);
        Write();
    });
    client.on('setIndividualValue', (index, variable, value) => {
        globals.individual[index][variable] = value;
        console.log("individual " + variable + ": " + value);
        handleVariableChange("individual", client);
        client.emit("update_individual", globals.individual);
        Write();
    }) 
    client.on('setValue', (category, variable, value) => {
        setValue(category, variable, value, client);
        Write();
    });
    client.on('setSingleValue', (category, value) => {
        setSingleValue(category, value, client);
        Write();
    })
    client.on('refresh-pool', ()=> {
        for (category of ["Spots", "Moteur", "Filtre", "Broadcast"]) {
            initializeCategory(category, client);
        }
    });
    client.on('refresh-watering', ()=> {
        for (category of ["wateringMode", "individual", "sequential"]) {
            initializeCategory(category, client);
        }
    });
    setInterval(()=> {
        globals.Broadcast.water_temp +=(Math.random()*2 - 1)/10;
        globals.Broadcast.air_temp += (Math.random()*2 - 1)/10;
        logs.temp.x.push(moment().format())
        logs.temp.y.push(globals.Broadcast.water_temp)
        WriteLogs();
        io.emit("update_Broadcast", "water_temp", globals.Broadcast.water_temp);
        io.emit("update_Broadcast", "air_temp", globals.Broadcast.air_temp);
        io.emit("updateTempLog", logs.temp);
    }, 100);
});

function setSingleValue(category, value, client) {
    globals[category] = value;
    console.log(category, globals[category]);
    handleVariableChange(category, client);
    client.emit("update_" + category, value);
    client.broadcast.emit("update_" + category, globals[category]);
}

function InitializeClient(client) {
    //update variables on Connection
    Object.keys(globals).forEach((category) => {
        initializeCategory(category, client);
    }, this);
    client.emit("updateTempLog", logs.temp)
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
    // Deprecated, for use of an eventual sequencer
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
    if (category == "Filtre" || category=="wateringMode" || category=="individual" || category=="sequential") {
        client.emit("update_" + category, globals[category]);
    }
    else {
        Object.keys(globals[category]).forEach((variable) => {
            client.emit("update_" + category, variable, globals[category][variable]);
        }, this);
    }
}
// Programmation physique
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
            setTimeout(()=> io.emit('updateChangeFilterMode', false), 3000)
        } else {
            console.log("Unkown variable");
        }
    }
}

const port = 8000;
io.listen(port);
console.log('listening on port', port);