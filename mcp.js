const {log, timeout} = require('./utils');

global.ISRASPBERRY = true;
let mcp;
try {
    const MCP23017 = require('node-mcp23017');
    mcp = new MCP23017({
        address: 0x20,
    });
} catch (error) {
    global.ISRASPBERRY = false;
    mcp = {
        digitalWrite: (pin, value) => {
            //console.log(`Writing ${value} on pin ${pin}`);
        }
    }
}    


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
    mcp.digitalWrite(0, value ? 0 : 1)
}

function setStop (value) {
    mcp.digitalWrite(1, value ? 0 : 1)
}
function setStart (value) {
    mcp.digitalWrite(2, value ? 0 : 1)

}
function setFreqMinus (value) {
    mcp.digitalWrite(3, value ? 0 : 1)
}
function setFreqPlus (value) {
    mcp.digitalWrite(4, value ? 0 : 1)
}

function startPump () {
    return new Promise((resolve, reject)=> {
        setStart(1);
        timeout(300)
            .then(setStart(0))
            .then(resolve())
            .catch(reject());
    });
}

function stopPump () {
    return new Promise((resolve, reject) => {
        setStop(1);
        timeout(300)
            .then(setStop(0))
            .then(resolve())
            .catch(reject);
    })
}

function goToMaxFreq() {
    return new Promise((resolve, reject) => {
        setFreqPlus(true)
        timeout(50000)
            .then(setFreqPlus(false))
            .then(resolve())
            .catch(reject())
    })
}

function goToMinFreq() {
    return new Promise((resolve, reject) => {
        setFreqMinus(true);
        timeout(5000)
            .then(setFreqMinus(false))
            .then(resolve())
            .catch(reject());
        })
}



setFiltrationMode = function (mode) {
    return new Promise((resolve, reject) => {
        switch (mode) {
            case 0:
                mcp.digitalWrite(7, 1);
                mcp.digitalWrite(6, 1);
                mcp.digitalWrite(5, 1);
            case 1:
                mcp.digitalWrite(7, 0);
                mcp.digitalWrite(6, 0);
                mcp.digitalWrite(5, 0);
            case 2:
                mcp.digitalWrite(5, 0);
                mcp.digitalWrite(6, 1);
                mcp.digitalWrite(7, 1);
            default:
                console.warn(`Unknown filtration mode: ${mode}`);
        }

        timeout(30000)
            //attendre que les vannes soient tournées
            .then(setStop(false))
            //débloquer le moteur
            .then(goToMaxFreq())
            // aller a la vitesse max
            .then(timeout(300))
            .then(startPump())
            // démarrer le moteur
            .then(resolve())
            .catch(reject());
        });
}

module.exports = {
    setSpots: setSpots,
    setStart: setStart,
    setStop: setStop,
    setFreqMinus: setFreqMinus,
    setFreqPlus: setFreqPlus,
    startPump: startPump,
    stopPump: stopPump,
    initializeMcp: initializeMcp,
    setFiltrationMode: setFiltrationMode,
    goToMaxFreq: goToMaxFreq,
    goToMinFreq: goToMinFreq
}