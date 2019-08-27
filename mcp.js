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

module.exports.setFiltrationMode = function(value) {
    if (value == 0) {
        mcp.digitalWrite(7, 0);
    } else if (value == 1) {
        mcp.digitalWrite(7, 1);
    }
}