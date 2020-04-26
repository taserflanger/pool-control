const {doWashingCycle, RepeatWashingCycle, goToFiltration, goToRecirculation} = require('../washing_auto');
const {nextOccurrences, clearTimeouts} = require('../utils');

WASHING_AUTO_SCHED = {clear: ()=>{}};


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
            clearTimeouts();
            if (POOL.filtration_mode !== value) {
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
                WASHING_AUTO_SCHED = later.setInterval(RepeatWashingCycle, POOL["washing_sched"]);
            } else {
                clearTimeouts();
                goToFiltration();
                WASHING_AUTO_SCHED.clear();
            }
            break;
        case "washing_period":
            POOL["washing_sched"] = later.parse.recur().every(value).dayOfMonth().on(POOL.washing_hour).hour();
            POOL["next_washing_occurrences"] =[...nextOccurrences(3, POOL["washing_sched"])].join(", ")
            io.emit("update_next_washing_occurrences", POOL["next_washing_occurrences"]);
            break;
        case "washing_hour":
            POOL["washing_sched"] = later.parse.recur().every(POOL.washing_period).dayOfMonth().on(value).hour();
            POOL["next_washing_occurrences"] =[...nextOccurrences(3, POOL["washing_sched"])].join(", ")
            io.emit("update_next_washing_occurrences", POOL["next_washing_occurrences"]);
            break;
        default:
            console.warn(`${variable} handling not implemented yet`);
    }
}

module.exports = {
    handleVariableChange: handleVariableChange
}