const MCP23017 = require('node-mcp23017');
let mcp = new MCP23017({
    address: 0x20,
});

JOBS = [];

function initializeMcp (mcpArray) {
    console.log("initialized mcp");
    for (var i = 0; i < 16; i++) {
        mcp.pinMode(i, mcp.OUTPUT);
        mcp.digitalWrite(i, mcpArray[i] ? 0 : 1);
        //mcp.pinMode(i, mcp.INPUT); //if you want them to be inputs
        //mcp.pinMode(i, mcp.INPUT_PULLUP); //if you want them to be pullup inputs
    }
}
function setSpots (value) {
    mcp.digitalWrite(0, value ? 0 : 1)
}

function setStop (value, filtrationModeChanging, emergency=false, resetFiltrationChanging=()=>{return}) {
    console.log(`setStop: ${value}, filtrationModeChanging: ${filtrationModeChanging}`);
    if (!filtrationModeChanging ||(emergency)) {
        mcp.digitalWrite(1, value ? 0 : 1)
        clearJobs()
        resetFiltrationChanging();
    }
}
function setStart (value, filtrationModeChanging) {
    console.log(`setStart: ${value}, filtrationModeChanging: ${filtrationModeChanging}`);
    if (!filtrationModeChanging) {
        mcp.digitalWrite(2, value ? 0 : 1)
    }
}
function setFreqMinus (value) {
    mcp.digitalWrite(3, value ? 0 : 1)

}
function setFreqPlus (value) {
    mcp.digitalWrite(4, value ? 0 : 1)

}

function startPump (filtrationModeChanging, cb = () => {return;}) {
    setStart(1, filtrationModeChanging);
    timeout(300, () => {
        setStart(0, filtrationModeChanging);
        cb();
    });
}

function stopPump (filtrationModeChanging, emergency=true, cb = () => {
    return
}) {
    setStop(1, filtrationModeChanging);
    timeout(300, () => {
        setStop(0, filtrationModeChanging);
        cb();
    });
    if (emergency) {
        clearJobs;
    }
}

function goToMaxFreq(callback=()=>{return}) {
    mcp.digitalWrite(4, 0);
    timeout(5000, () => {
        mcp.digitalWrite(4, 1)
        callback();
    });
}

function goToMinFreq(callback = () => {
    return
}) {
    mcp.digitalWrite(3, 0);
    timeout(5000, () => {
        mcp.digitalWrite(3, 1)
        callback();
    });
}

function timeout(ms, cb) {
    job = setTimeout(cb, ms);
    JOBS.push(job);
    return job;
}

function WashingCycle(cb, counter = 0) {
    console.log("démarrage d'un nouveau cycle: cycle n° ", counter);
    if (counter == 1) {
        console.log("launching callback");
        goToMinFreq();
        cb()
        return;
    }
    startPump(false, function() { //aller à la freq max et attendre 30+5 min de lavage
        console.log("pompe démarrée, attente de 10s");
        timeout(10000, () => stopPump(false, false, function() {
            console.log("pompe arrêtée, attente de 5s");
            timeout(5000, () => WashingCycle(cb, counter + 1));
        }))
    });

}

function clearJobs() {
    for (job of JOBS) {
        clearTimeout(job);
    }
    JOBS = [];
    console.log("cleared jobs!")
}



setFiltrationMode = function (value, cb) {
    if (value == 0) {
        //vannes en mode filtration 111
        mcp.digitalWrite(7, 1);
        mcp.digitalWrite(6, 1);
        mcp.digitalWrite(5, 1);
        timeout(30000, ()=> {
            setStop(0, false);
            timeout(300, ()=>startPump(false));
        })
    } else if (value == 1) {
        // vannes en mode lavage 000
        mcp.digitalWrite(7, 0);
        mcp.digitalWrite(6, 0);
        mcp.digitalWrite(5, 0);
        // lancer le cycle de lavage moteur à fond, après que les vannes soient tournées
        // goToMaxFreq() (à remettre)
        timeout(30000, ()=> {
            setStop(0, false);
            timeout(300, ()=>WashingCycle(cb)) // attente pour allumage possible
        });
        
    } else {
        // vannes en mode recirculation 011
        mcp.digitalWrite(5, 0);
        mcp.digitalWrite(6, 1);
        mcp.digitalWrite(7, 1);
        timeout(30000, ()=> {
            setStop(0, false);
            timeout(300, ()=>startPump(false));
        })
    }
}

module.exports = {
    setSpots: ( ... args)=>setSpots( ... args ),
    setStart: setStart,
    setStop: ( ... args)=>setStop( ... args),
    setFreqMinus: ( ... args)=>setFreqMinus( ... args),
    setFreqPlus: ( ... args)=>setFreqPlus( ... args),
    startPump: ( ... args)=>startPump( ... args),
    stopPump: ( ... args)=>stopPump( ... args),
    initializeMcp: ( ... args)=>initializeMcp( ... args),
    clearJobs: ( ... args)=>clearJobs( ... args),
    setFiltrationMode: setFiltrationMode
}