const {timeout, Write} = require('./utils');

async function goToFiltration() {
    await mcp_api.setFiltrationMode(0);
}

async function doWashingCycle() {
    await mcp_api.setFiltrationMode(1);
    mcp_api.goToMaxFreq();
    await timeout(POOL.washing_cycle_duration*60*1000*TIME_SCALE);
    await mcp_api.setFiltrationMode(0);
    mcp_api.goToMinFreq();
    POOL.filtration_mode=0;
    Write();
    io.emit("update_filtration_mode", 0)
}

async function goToRecirculation() {
    await mcp_api.setFiltrationMode(2);
}

async function RepeatWashingCycle() {
    if (!POOL.washing_auto) {return;}
    console.log("Launching washing cycle repetition")
    io.emit("update_filtration_mode", 1);
    await doWashingCycle()
    for (let i=0; i<POOL.washing_cycle_count-1; i++) {
        if (!POOL.washing_auto) {return;}
        await timeout(POOL.washing_cycle_delay*60*1000*TIME_SCALE);
        io.emit("update_filtration_mode", 1);
        await doWashingCycle();
    }
}

module.exports = {
    RepeatWashingCycle: RepeatWashingCycle,
    goToFiltration: goToFiltration,
    goToRecirculation: goToRecirculation,
    doWashingCycle: doWashingCycle
}
