const {doWashingCycle, RepeatWashingCycle, goToFiltration, goToRecirculation} = require('./washing_auto');
const {nextOccurrences} = require('./utils');
const later = require('later');
const moment = require('moment');

global.WASHING_AUTO_SCHED = {clear: ()=>{}};


async function handleVariableChange(variable, value) {
    switch (variable) {
        case "spots":
            mcp_api.setSpots(value);
            break;
        case "stop":
            mcp_api.setStop(value);
            break;
        case "start":
            mcp_api.setStart(value);
            break;
        case "freq_minus":
            mcp_api.setFreqMinus(value);
            break;
        case "freq_plus":
            mcp_api.setFreqPlus(value);
            break;
        case "filtration_mode":
            if (POOL.filtration_mode != value) {
                switch (value) {
                    case 0:
                        await goToFiltration();
                        break;
                    case 1:
                        await doWashingCycle();
                        break;
                    case 2:
                        await goToRecirculation()
                }
            }
            break;
        case "washing_auto":
            if (value) {
                //WASHING_AUTO_JOB = later.setInterval(RepeatWashingCycle, POOL[ewashing_sched]);
                await RepeatWashingCycle();
            } else {
                WASHING_AUTO_SCHED.clear();
            }
            break;
        case "washing_period":
        case "washing_hour":
            POOL["washing_shed"] = later.parse.recur().every(POOL.washing_period).dayOfMonth().on(POOL.washing_hour-2).hour();
            console.log(POOL.washing_hour);
            console.log([...nextOccurrences(4, POOL["washing_shed"])]);

        default:
            console.warn(`${variable} handling not implemented yet`);
    }
}

module.exports = {
    handleVariableChange: handleVariableChange
}