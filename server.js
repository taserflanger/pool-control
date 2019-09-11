console.log("J'ai laissé quelques erreurs...");

const io = require('socket.io')();
const fs = require('fs');
const moment = require('moment');

let ISRASPBERRY = true;
let FILTRATIONMODECHANGING = false;
let massageJobs = [];
let washingJobs = []

function log (str) {
    console.log(str);
    io.emit("update_console", str);
}

module.exports = {log: log};

mcp=require('./mcp');

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
    log('client connected')
    InitializeClient(client);
    client.on('loginAdmin', password => {
        log(client.toString() + " trying to connect width passwd " + password);
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
    let oldValue=globals.Pool[variable]
    globals.Pool[variable] = value;
    if (typeof(value)=="object") {
        value = JSON.stringify(value);
    }
    log(`${variable} ${value}`);
    handleVariableChange(variable, oldValue);
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
    log("setting timeout: " + ms);
    return setTimeout(cb, ms);
}

// Programmation physique
function handleVariableChange(variable, oldValue=null) {
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
                    log("filtration_mode 0");
                    handleVariableChange("filtration_mode")
                    io.emit("update_filtration_mode", 0);
                }
            }
            // on attend 5 secondes avant de faire tourner les vannes pour l'arrêt de la pompe
            timeout(5000, ()=> {
                mcp.setFiltrationMode(globals.Pool.filtration_mode, globals.Pool.washing_cycles_count, callback);
            })
        } else if (variable==="massage") {
            let oldTimingValue=globals.Pool.massage.value;
            if (globals.Pool.massage.isOn && oldValue.isOn==false) {
                // when you swich on launch timer
                mcp.startPump();
                mcp.goToMaxFreq();
                let interv = setInterval(()=> {
                    globals.Pool.massage.value-=1
                    Write();
                    io.emit("update_massage", globals.Pool.massage);
                    // log("massage: " + globals.Pool.massage.value + " min remaining")
                    if (globals.Pool.massage.value==0) {
                        globals.Pool.massage.isOn=false;
                        globals.Pool.massage.value=oldTimingValue;
                        Write();
                        mcp.goToMinFreq();
                        io.emit("update_massage", globals.Pool.massage);
                        clearInterval(interv);
                    }
                }, 2000);
                massageJobs.push(interv);
            } else if (!globals.Pool.massage.isOn) {
                // when you switch off stop timer and go to old value
                clearJobs(massageJobs);
                massageJobs=[];
                if (oldValue.isOn) {
                    globals.Pool.massage.value=oldTimingValue;
                    mcp.goToMinFreq();
                    io.emit("update_massage", globals.Pool.massage);
                    Write();
                }
            }
        } else if (variable==="washing_auto") {
            if (globals.Pool.washing_auto) {
                washingJobs.push(
                    setInterval(()=>{
                        if (Math.abs(moment.now()-globals.Pool.next_washing_cycle)<=3600000) {
                            log("yeah!!!");
                            globals.Pool.filtration_mode = 1;
                            Write();
                            log("filtration_mode 1");
                            handleVariableChange("filtration_mode")
                            io.emit("update_filtration_mode", 1);
                            globals.Pool.next_washing_cycle+=globals.Pool.washing_period*24*3600*1000;
                        }
                    }, 1800)
                )
            } else {
                clearJobs(washingJobs);
                washingJobs=[];
            }
        }
        
        else {
            log("Unknown variable, maybe " + variable + " is not implemented yet");
        }
    }
}

const port = 8000;
io.listen(port);
log('listening on port '+ port);

function clearJobs(jobs) {
    log(jobs.length + " job(s) cleared!")
    for (let i = 0; i < massageJobs.length; i++) {
        try {
            clearInterval(jobs[i]);
        } catch (error) {
            clearTimeout(jobs[i]);
        }
        jobs.pop(i);
    }
}
