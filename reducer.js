const later = require('later');
const mcp=require('./mcp');
const {timeout, Write} = require('./utils')

function handleVariableChange(variable, value) {
    switch (variable) {
        case "spots":
            mcp.setSpots(value);
            break;
        case "stop":
            mcp.setStop(value);
            break;
        case "start":
            mcp.setStart(value);
            break;
        case "freq_minus":
            mcp.setFreqMinus(value);
            break;
        case "freq_plus":
            mcp.setFreqPlus(value);
            break;
        case "filtration_mode":
            // éteindre la pompe
            mcp.setStop(1);

            let return_to_filtration = ()=> {
                if (value==0) {
                    return Promise.resolve();
                }
                return new Promise((resolve, reject) => {
                    timeout(POOL.washing_cycle_duration)
                        .then(mcp.setFiltrationMode(0))
                        .then(()=> {
                            POOL.filtration_mode=0;
                            Write();
                            io.emit("update_filtration_mode", 0)
                            resolve()
                        })
                        .catch(reject());
                })
            }
            //retourne en filtration après un temps washing_cycle_duration (sauf si on vuet de base retourner en filtration

            // on attend 5 secondes avant de faire tourner les vannes pour l'arrêt de la pompe
            timeout(5000)
                .then(mcp.setFiltrationMode(POOL.filtration_mode))
                .then(return_to_filtration)
            break;
        case "washing_auto":
            if (value) {
                    console.log("Here I wanna get auto_washing");
            } else {
                //clearJobs(washingJobs);
            }
            break;

        default:
            console.warn(`${variable} handling not implemented yet`);
    }
}

module.exports = {
    handleVariableChange: handleVariableChange
}