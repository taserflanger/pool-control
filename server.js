const io = require('socket.io')();
const fs = require('fs');
const moment = require('moment');

let ISRASPBERRY = true;

try {
    const mcp = require('./mcp')
} 
catch (error) {
    ISRASPBERRY = false;
}

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
mcpArray = [globals.Pool.Spots, globals.Pool.stop, globals.Pool.start, globals.Pool.freq_minus, globals.Pool.freq_plus]
if (ISRASPBERRY) {
    mcp.initializeMcp(mcpArray);
}
// let logs = JSON.parse(logsdata.toString());
// initializeOutputs();

io.on('connection', (client) => {
    console.log('client connected')
    InitializeClient(client);
    client.on('loginAdmin', password => {
        console.log(client.toString() + " trying to connect width passwd " + password);
        if (password==globals.password) {
            client.emit('loginAdmin', true);
        } else {
            client.emit('loginAdmin', false);
        }
    })
    client.on('request_', (variable) => {
        client.emit("update_" + variable, globals.Pool[variable]);
    });
    client.on('setValue', (variable, value) => {
        setValue(variable, value, client);
        Write();
    });
    client.on('refresh-watering', ()=> {
        for (category of ["wateringMode", "individual", "sequential"]) {
            initializeCategory(category, client);
        }
    });
    setInterval(()=> {
        globals.Pool.water_temp +=(Math.random()*2 - 1)/10;
        globals.Pool.air_temp += (Math.random()*2 - 1)/10;
        // logs.temp.x.push(moment().format())
        // logs.temp.y.push(globals.Broadcast.water_temp)
        // WriteLogs();
        io.emit("update_water_temp", globals.Pool.water_temp);
        io.emit("update_air_temp", globals.Pool.air_temp);
        // io.emit("updateTempLog", logs.temp);
    }, 100);
});

function InitializeClient(client) {
    //update variables on Connection
    Object.keys(globals["Pool"]).forEach((variable) => {
        client.emit("update_" + variable, globals.Pool[variable]);
    });
    // client.emit("updateTempLog", logs.temp)
}

function setValue(variable, value) {
    globals.Pool[variable] = value;
    console.log(variable, globals.Pool[variable]);
    handleVariableChange(variable);
    io.emit("update_" + variable, globals.Pool[variable]);
}

function initializeCategory(category, client) {
    if (category == "Filtre" || category=="wateringMode" || category=="individual" || category=="sequential") {
        client.emit("update_" + category, globals[category]);
    }
    else {
        Object.keys(globals[category]).forEach((variable) => {
            client.emit("update_" + variable, globals[category]);
        }, this);
    }
}

// Programmation physique
function handleVariableChange(variable, oldVariableValue=null) {
    if(ISRASPBERRY) {
        //write with gpio
        if (variable=="spots") {
            mcp.setSpots(globals.Spots.north_light);
        } else if (variable == "stop") {
            mcp.setStop(globals.Moteur.stop);                        
        } else if (variable=="start") {
          mcp.setStart(globals.Moteur.start, globals.filtrationModeChanging);  
        } else if (variable == "freq_minus") {
            mcp.setFreqMinus(globals.Moteur.freq_minus)
        } else if (variable == "freq_plus") {
            mcp.setFreqPlus(globals.Moteur.freq_plus)
        } else if (variable=="filtration_mode") {
            mcp.setStop(1)
            globals.filtrationModeChanging = true;
            Write();
            setTimeout(()=>{
                mcp.setStop(0);
                globals.filtrationModeChanging = false;
                mcp.setStart(1, globals.filtrationModeChanging);
                setTimeout(()=>mcp.setStart(0, globals.filtrationModeChanging), 30);
            }, 3000)
        } else {
            console.log("Unknown variable, maybe " + variable + " is not implemented yet");
        }
    }
}

const port = 8000;
io.listen(port);
console.log('listening on port', port);