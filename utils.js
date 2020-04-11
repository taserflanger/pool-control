const io = global.io;
const fs = require('fs');

const timeout = milliseconds => new Promise (resolve =>
    setTimeout(() => resolve(), milliseconds)
)

function log (str) {
    console.log(str);
    io.emit("update_console", str);
}

function parseData() {
    data = fs.readFileSync("server/serverState.json", 'utf8');
    logsdata = fs.readFileSync("server/log.json", 'utf8');

    global.POOL = JSON.parse(data.toString());
}

function Write() {
    fs.writeFile("server/serverState.json", JSON.stringify(POOL, null, 4), (err)=> {
        if (err) throw err;
    })
}


module.exports = {
    log: log,
    Write: Write,
    parseData: parseData,
    timeout: timeout
};
