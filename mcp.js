const {log} = require('./server');

let ISRASPBERRY = true;
try {
    const MCP23017 = require('node-mcp23017');
    let mcp = new MCP23017({
        address: 0x20,
    });
} catch (error) {
    ISRASPBERRY = false;
}    
JOBS = [];

function initializeMcp (mcpArray) {
    log("initialized mcp");
    if (ISRASPBERRY) {
        for (var i = 0; i < 16; i++) {
            mcp.pinMode(i, mcp.OUTPUT);
            mcp.digitalWrite(i, mcpArray[i] ? 0 : 1);
            //mcp.pinMode(i, mcp.INPUT); //if you want them to be inputs
            //mcp.pinMode(i, mcp.INPUT_PULLUP); //if you want them to be pullup inputs
        }
    }
}
function setSpots (value) {
    log("setSpots " + value);
    if (ISRASPBERRY) {
        mcp.digitalWrite(0, value ? 0 : 1)
    }
}

function setStop (value, filtrationModeChanging, emergency=false, resetFiltrationChanging=()=>{return}) {
    log(`setStop: ${value}, filtrationModeChanging: ${filtrationModeChanging}`);
    if ((!filtrationModeChanging ||(emergency) )&& ISRASPBERRY) {
        mcp.digitalWrite(1, value ? 0 : 1)
        clearJobs()
        resetFiltrationChanging();
    }
}
function setStart (value, filtrationModeChanging) {
    log(`setStart: ${value}, filtrationModeChanging: ${filtrationModeChanging}`);
    if (!filtrationModeChanging && ISRASPBERRY) {
        mcp.digitalWrite(2, value ? 0 : 1)
    }
}
function setFreqMinus (value) {
    log("setFreqMinus", value);
    if (ISRASPBERRY) {
        mcp.digitalWrite(3, value ? 0 : 1)
    }

}
function setFreqPlus (value) {
    log("setFreqPlus", value);
    if (ISRASPBERRY) {
        mcp.digitalWrite(4, value ? 0 : 1)
    }

}

function startPump (filtrationModeChanging, cb = () => {return;}) {
    log("starting pump");
    if (ISRASPBERRY) {
        setStart(1, filtrationModeChanging);
        timeout(300, () => {
            setStart(0, filtrationModeChanging);
            cb();
        });
    }
}

function stopPump (filtrationModeChanging, emergency=true, cb = () => {
    return
}) {
    log("stopping pump")
    if (ISRASPBERRY) {
        setStop(1, filtrationModeChanging);
        timeout(300, () => {
            setStop(0, filtrationModeChanging);
            cb();
        });
        if (emergency) {
            clearJobs();
        }
    }
}

function goToMaxFreq(callback=()=>{return}) {
    if (ISRASPBERRY) {
        mcp.digitalWrite(4, 0);
        timeout(5000, () => {
            mcp.digitalWrite(4, 1)
            callback();
        });
    }
}

function goToMinFreq(callback = () => {
    return
}) {
    if (ISRASPBERRY) {
        mcp.digitalWrite(3, 0);
        timeout(5000, () => {
            mcp.digitalWrite(3, 1)
            callback();
        });
    }
}

function timeout(ms, cb) {
    log("timeout " + ms);
    job = setTimeout(cb, ms);
    JOBS.push(job);
    return job;
}

function WashingCycle(cb, count, counter = 0) {
    log("démarrage d'un nouveau cycle: cycle n° " + counter);
    if (counter == count) {
        log("launching callback");
        goToMinFreq();
        cb()
        return;
    }
    startPump(false, ()=> { //aller à la freq max et attendre 30+5 min de lavage
        log("pompe démarrée, attente de 55s");
        timeout(55000, () => stopPump(false, false, function() {
            log("pompe arrêtée, attente de 5s");
            timeout(5000, () => WashingCycle(cb, count, counter + 1));
        }))
    });

}

function clearJobs() {
    for (job of JOBS) {
        clearTimeout(job);
    }
    JOBS = [];
    log("cleared jobs!")
}



setFiltrationMode = function (value, washing_cycles_count, cb) {
    if (value == 0) {
        //vannes en mode filtration 111
        if (ISRASPBERRY) {
            mcp.digitalWrite(7, 1);
            mcp.digitalWrite(6, 1);
            mcp.digitalWrite(5, 1);
        
        }
        timeout(30000, ()=> {
        setStop(0, false);
        timeout(300, ()=>startPump(false));
        })
    } else if (value == 1) {
        // vannes en mode lavage 000
        if (ISRASPBERRY) {
            mcp.digitalWrite(7, 0);
            mcp.digitalWrite(6, 0);
            mcp.digitalWrite(5, 0);
        }
        // lancer le cycle de lavage moteur à fond, après que les vannes soient tournées
        // goToMaxFreq() (à remettre)
        timeout(30000, ()=> {
            setStop(0, false);
            timeout(300, ()=>WashingCycle(cb, washing_cycles_count)) // attente pour allumage possible
        });
        
    } else {
        // vannes en mode recirculation 011
        if (ISRASPBERRY) {
            mcp.digitalWrite(5, 0);
            mcp.digitalWrite(6, 1);
            mcp.digitalWrite(7, 1);
        }
        timeout(30000, ()=> {
            setStop(0, false);
            timeout(300, ()=>startPump(false));
        })
    }
}

module.exports = {
    setSpots: ( ... args)=>setSpots( ... args ),
    setStart: setStart,
    setStop: setStop,
    setFreqMinus: setFreqMinus,
    setFreqPlus: setFreqPlus,
    startPump: startPump,
    stopPump: stopPump,
    initializeMcp: initializeMcp,
    clearJobs: clearJobs,
    setFiltrationMode: setFiltrationMode
}