const {log, timeout} = require('./utils');

global.ISRASPBERRY = true;
global.TIME_SCALE = 1;
let mcp;
try {
    const MCP23017 = require('node-mcp23017');
    mcp = new MCP23017({
        address: 0x20,
        debug: true
    });
} catch (error) {
    global.ISRASPBERRY = false;
    TIME_SCALE = .001;
    mcp = {
        digitalWrite: (pin, value) => {
            console.log(`Writing ${value} on pin ${pin}`);
        }
    }
}    


function initializeMcp () {
    //log("initialized mcp");
    if (ISRASPBERRY) {
        for (var i = 0; i < 16; i++) {
            mcp.pinMode(i, mcp.OUTPUT);
            mcp.digitalWrite(i, 1);
            //mcp.pinMode(i, mcp.INPUT); //if you want them to be inputs
            //mcp.pinMode(i, mcp.INPUT_PULLUP); //if you want them to be pullup inputs
        }
    }
}
function setSpots (value) {
    log(`mcp: spots: ${value}`)
    mcp.digitalWrite(0, value ? 0 : 1)
}

function setStop (value) {
    log(`mcp: stop: ${value}`)
    mcp.digitalWrite(1, value ? 0 : 1)
}
function setStart (value) {
    log(`mcp: start: ${value}`)
    mcp.digitalWrite(2, value ? 0 : 1)

}
function setFreqMinus (value) {
    log(`mcp: freqMinus: ${value}`)
    mcp.digitalWrite(3, value ? 0 : 1)
}
function setFreqPlus (value) {
    log(`mcp: freqPlus: ${value}`)
    mcp.digitalWrite(4, value ? 0 : 1)
}

async function startPump () {
    setStart(1);
    await timeout(300);
    setStart(0);
}

async function stopPump () {
    setStop(1);
    await timeout(300)
    setStop(0)
}

async function goToMaxFreq() {
    setFreqPlus(true);
    await timeout(5000)
    setFreqPlus(false);
}

async function goToMinFreq() {
    setFreqMinus(true);
    await timeout(5000)
    setFreqMinus(false);
}


async function setFiltrationMode (mode) {

    switch (mode) {
        case 0:
            mcp.digitalWrite(7, 1);
            mcp.digitalWrite(6, 1);
            mcp.digitalWrite(5, 1);
            break;
        case 1:
            mcp.digitalWrite(7, 0);
            mcp.digitalWrite(6, 0);
            mcp.digitalWrite(5, 0);
            break;
        case 2:
            mcp.digitalWrite(5, 0);
            mcp.digitalWrite(6, 1);
            mcp.digitalWrite(7, 1);
            break;
        default:
            console.warn(`Unknown filtration mode: ${mode}`);
    }

    await timeout(30*1000*TIME_SCALE);
    //attendre que les vannes soient tournées
    setStop(false)
    //débloquer le moteur
    await timeout(300)
    await startPump()
    // démarrer le moteur
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
    goToMinFreq: goToMinFreq,
    mcp: mcp
}
