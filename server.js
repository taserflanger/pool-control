const io = require('socket.io')();
const fs = require('fs');
const moment = require('moment');
const mcp = require('./mcp')

let ISRASPBERRY = true;
let filtrationModeChanging = false;



data = fs.readFileSync("server/serverState.json", 'utf8');
logsdata = fs.readFileSync("server/log.json", 'utf8');
function Write() {
    fs.writeFile("server/serverState.json", JSON.stringify(globals, null, 4), (err)=> {
        if (err) throw err;
    })
}
function WriteLogs() {
    return
    fs.writeFile("server/log.json", JSON.stringify(logs, null, 4), (err)=> {
        if (err) throw err;
    })
}


let globals = JSON.parse(data.toString());
mcpArray = [globals.Spots.north_light, globals.Moteur.stop, globals.Moteur.start, globals.Moteur.freq_minus, globals.Moteur.freq_plus]
try {
    mcp.initializeMcp(mcpArray);
} catch (error) {
    ISRASPBERRY = false;
}
// let logs = JSON.parse(logsdata.toString());
// initializeOutputs();

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
        handleVariableChange("individual");
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
        // logs.temp.x.push(moment().format())
        // logs.temp.y.push(globals.Broadcast.water_temp)
        // WriteLogs();
        io.emit("update_Broadcast", "water_temp", globals.Broadcast.water_temp);
        io.emit("update_Broadcast", "air_temp", globals.Broadcast.air_temp);
        // io.emit("updateTempLog", logs.temp);
    }, 100);
});

function setSingleValue(category, value, client) {
    globals[category] = value;
    console.log(category, globals[category]);
    handleVariableChange(category);
    client.emit("update_" + category, value);
    client.broadcast.emit("update_" + category, globals[category]);
}

function InitializeClient(client) {
    //update variables on Connection
    Object.keys(globals).forEach((category) => {
        initializeCategory(category, client);
    }, this);
    // client.emit("updateTempLog", logs.temp)
}

function setValue(category, variable, value, client) {
    let oldValue = null;
    if (variable=="freq") {
        oldValue = globals[category][variable];
    }
    globals[category][variable] = value;
    console.log(variable, globals[category][variable]);
    handleVariableChange(variable, oldVariableValue=oldValue);
    io.emit("update_" + category, variable, globals[category][variable]);
}

function toggleVariable(category, variable, client) {
    globals[category][variable] = !globals[category][variable];
    console.log(variable, globals[category][variable]);
    handleVariableChange(variable);
    io.emit("update_" + category, variable, globals[category][variable]);
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
                handleVariableChange(key);
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
function handleVariableChange(variable, oldVariableValue=null) {
    if(ISRASPBERRY) {
        //write with gpio
        if (variable=="north_light") {
            mcp.setSpots(globals.Spots.north_light);
        } else if (variable == "stop") {
            mcp.setStop(globals.Moteur.stop, filtrationModeChanging);                        
        } else if (variable=="start") {
          mcp.setStart(globals.Moteur.start, filtrationModeChanging);  
        } else if (variable == "freq_minus") {
            mcp.setFreqMinus(globals.Moteur.freq_minus)
        } else if (variable == "freq_plus") {
            mcp.setFreqPlus(globals.Moteur.freq_plus)
        } else if (variable=="Filtre") {
            mcp.setStop(1)
            filtrationModeChanging = true;
            let cb = ()=>{return}
            if (globals.Filtre==1) {
                cb = ()=> {
                    globals.Filtre = 0;
                    console.log("Filtre 0");
                    handleVariableChange("Filtre")
                    io.emit("update_Filtre", 0);
                }
            }
            setTimeout(()=> {
                mcp.setFiltrationMode(globals.Filtre, cb);
            }, 5000)
            setTimeout(()=>{
                mcp.setStop(0);
                filtrationModeChanging = false;
                setTimeout(()=> {
                    mcp.setStart(1, filtrationModeChanging);
                    setTimeout(()=>mcp.setStart(0, filtrationModeChanging), 300);
                }, 1000)
            }, 35000)
            
        } else {
            console.log("Unkown variable");
        }
    }
}

const port = 8000;
io.listen(port);
console.log('listening on port', port);