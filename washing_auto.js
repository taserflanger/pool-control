const {timeout, Write} = require('./utils');

async function filtrationCycleInMode(mode) {
    console.log(`Launching filtration cycle in mode ${mode}`)
    mcp.setStop(1);
    async function return_to_filtration() {
        if (mode==0) {return;}
        await timeout(POOL.washing_cycle_duration*60*1000*TIME_SCALE);
        await mcp.setFiltrationMode(0);
        POOL.filtration_mode=0;
        Write();
        io.emit("update_filtration_mode", 0)
    }
    //retourne en filtration après un temps washing_cycle_duration (sauf si on veut de base retourner en filtration)
    await timeout(50000*TIME_SCALE)
    // on attend 5 secondes avant de faire tourner les vannes pour l'arrêt de la pompe
    await mcp.setFiltrationMode(POOL.filtration_mode);
    await return_to_filtration();
}

async function RepeatWashingCycle() {
    if (!POOL.washing_auto) {return;}
    console.log("Launching washing cycle repetition")
    io.emit("update_filtration_mode", 1);
    await filtrationCycleInMode(1)
    for (let i=0; i<POOL.washing_cycle_count-1; i++) {
        if (!POOL.washing_auto) {return;}
        await timeout(POOL.washing_cycle_delay*60*1000*TIME_SCALE);
        io.emit("update_filtration_mode", 1);
        await filtrationCycleInMode(1);
    }
}

module.exports = {
    RepeatWashingCycle: RepeatWashingCycle,
    filtrationCycleInMode: filtrationCycleInMode
}