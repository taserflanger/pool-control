const io = require('socket.io')();
const fs = require('fs');

let ISRASPBERRY = true;
let FILTRATIONMODECHANGING = false;

let mcp = null;

try {
    mcp = require('./mcp')
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
if (ISRASPBERRY) {
    mcp.initializeMcp([globals.Pool.spots, globals.Pool.stop, globals.Pool.start, globals.Pool.freq_minus, globals.Pool.freq_plus]);
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

function timeout(ms, cb) {
    return setTimeout(cb, ms);
}

// Programmation physique
function handleVariableChange(variable) {
    if(ISRASPBERRY) {
        //write with gpio
        if (variable=="spots") {
            mcp.setSpots(globals.Pool.spots);
        } else if (variable == "stop") {
            mcp.setStop(globals.Pool.stop, FILTRATIONMODECHANGING, emergency=true, ()=>{
                FILTRATIONMODECHANGING=false;
                // mcp.setStop(false, false)
            });                        
        } else if (variable=="start") {
          mcp.setStart(globals.Pool.start, FILTRATIONMODECHANGING);  
        } else if (variable == "freq_minus") {
            mcp.setFreqMinus(globals.Pool.freq_minus)
        } else if (variable == "freq_plus") {
            mcp.setFreqPlus(globals.Pool.freq_plus)
        } else if (variable=="filtration_mode") {
            // éteindre la pompe
            mcp.setStop(1, FILTRATIONMODECHANGING);

            mcp.clearJobs();
            FILTRATIONMODECHANGING = true;
            // filtrationmodechanging est true si les vannes bougent
            // callback: action à effectuer après la fin du cycle de lavage/autre mode de filtration
            let callback = ()=>{return}; // 
            if (globals.Pool.filtration_mode==1) {
                // après le lavage, on retourne en filtration
                callback = ()=> {
                    globals.Pool.filtration_mode = 0;
                    Write();
                    console.log("filtration_mode 0");
                    handleVariableChange("filtration_mode")
                    io.emit("update_filtration_mode", 0);
                }
            }
            // on attend 5 secondes avant de faire tourner les vannes pour l'arrêt de la pompe
            timeout(5000, ()=> {
                mcp.setFiltrationMode(globals.Pool.filtration_mode, callback);
            })
        } else {
            console.log("Unknown variable, maybe " + variable + " is not implemented yet");
        }
    }
}

const port = 8000;
io.listen(port);
console.log('listening on port', port);