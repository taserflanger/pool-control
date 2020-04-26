const io = global.io;
const fs = require('fs');
const moment = require('moment');
moment.locale('fr');
later = require('later');
later.date.localTime();
TIMEOUTS = [];

const timeout = milliseconds => new Promise (resolve => {
    TIMEOUTS.push(setTimeout(resolve, milliseconds));
})

const clearTimeouts = ()=> {
    for (const t of TIMEOUTS) {
        clearTimeout(t);
    }
}

function log (str) {
    console.log(str);
    io.emit("update_console", str);
}

function parseData() {
    let data = fs.readFileSync("./data/serverState.json", 'utf8');
    let logsdata = fs.readFileSync("data/log.json", 'utf8');

    POOL = JSON.parse(data.toString());
}

function Write() {
    fs.writeFile("server/serverState.json", JSON.stringify(POOL, null, 4), (err)=> {
        if (err) throw err;
    })
}

function* nextOccurrences(nb, sched) {
    sched = later.schedule(sched);
    let occurrences = sched.next(nb);
    for (const d of occurrences) {
        yield (moment(d).calendar().split(" "))[0];
    }
}


module.exports = {
    log: log,
    Write: Write,
    parseData: parseData,
    timeout: timeout,
    nextOccurrences: nextOccurrences,
    clearTimeouts: clearTimeouts
};
