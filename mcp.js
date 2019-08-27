const MCP23017=require('node-mcp23017');
let mcp = new MCP23017({
    address: 0x20,
});
module.exports.initializeMcp = function(mcpArray) {
    for (var i = 0; i < 16; i++) {
        mcp.pinMode(i, mcp.OUTPUT);
        mcp.digitalWrite(i, mcpArray[i]?0:1);
        //mcp.pinMode(i, mcp.INPUT); //if you want them to be inputs
        //mcp.pinMode(i, mcp.INPUT_PULLUP); //if you want them to be pullup inputs
      }
}
module.exports.setSpots = function(value) {
    mcp.digitalWrite(0, value?0:1)
}

module.exports.setStop = function(value, filtrationModeChanging) {
    if (!filtrationModeChanging) {
        mcp.digitalWrite(1, value?0:1)
    }
}
module.exports.setStart = function(value, filtrationModeChanging) {
    if (!filtrationModeChanging) {
        mcp.digitalWrite(2, value?0:1)
    }
}
module.exports.setFreqMinus = function(value) {
    mcp.digitalWrite(3, value?0:1)

}
module.exports.setFreqPlus = function(value) {
    mcp.digitalWrite(4, value?0:1)

}

function goToMaxFreq(callback) {
    mcp.digitalWrite(4, 0);
    setTimeout(()=>{
        mcp.digitalWrite(4, 1)
        callback();
    }, 5000);
}

function goToMinFreq(callback=()=>{return}) {
    mcp.digitalWrite(3, 0);
    setTimeout(()=>{
        mcp.digitalWrite(3, 1)
        callback();
    }, 5000);
}

function timeout(ms, cb) {
    return setTimeout(cb, ms);
}

function WashingCycle(cb) {
    for (let i=0; i<5; i++) {
        timeout(50000, cb);
        // goToMaxFreq(()=>{
        //     timeout(70000, ()=>goToMinFreq(()=> {
        //         timeout(20000, ()=>goToMaxFreq(()=>cb()))
        //     }))})
    }
}

module.exports.setFiltrationMode = function(value, cb) {
    if (value == 0) {
        mcp.digitalWrite(7, 1);
        mcp.digitalWrite(6, 1);
        mcp.digitalWrite(5, 1);
    } else if (value == 1) {
        mcp.digitalWrite(7, 0);
        mcp.digitalWrite(6, 0);
        mcp.digitalWrite(5, 0);
        WashingCycle(cb);
    } else {
        mcp.digitalWrite(7, 1);
        mcp.digitalWrite(6, 1);
        mcp.digitalWrite(5, 0);

    }
}