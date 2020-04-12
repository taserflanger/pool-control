const {doWashingCycle, RepeatWashingCycle, goToFiltration, goToRecirculation} = require('./washing_auto');
const later = require('later');

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
                let sched = later.parse.recur().every(POOL.washing_period).dayOfMonth().on(POOL.washing_hour).hour();
                WASHING_AUTO_SCHED = later.setInterval(RepeatWashingCycle, sched)
                //console.log(WASHING_AUTO_SCHED);
                await RepeatWashingCycle();
            } else {
                WASHING_AUTO_SCHED.clear();
            }
            break;

        default:
            console.warn(`${variable} handling not implemented yet`);
    }
}

module.exports = {
    handleVariableChange: handleVariableChange
}