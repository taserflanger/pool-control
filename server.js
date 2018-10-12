const io = require('socket.io')();
const SequenceController = require('./server/SequenceController');
const seq = new SequenceController();
const Gpio = require('onoff').Gpio;
let LED = new Gpio(18, 'out');

let globals = {
    Spots: {
        north_light: 0, // here read with gpio
        southeast_light: 0,
        south_light: 0
    },
    Moteur: {
        is_on: 1,
        freq: 10
    },
    Filtre: 0,
    Broadcast: {
        water_temp: 20,
        air_temp: 25,
        ph: 7,
        orp: 5
    },
    useSequencer: false
}

io.on('connection', (client) => {
    client.emit('updateSequences', seq.sequences);
    client.emit('setTempo', seq.tempo);
    client.emit('toggleUseSequencer', globals.useSequencer);
    client.emit('updateNames', seq.names);

    //update variables on Connection
    Object.keys(globals).forEach((category) => {
        if (category=="Filtre") {
            client.emit("update_"+category, globals[category])
        } else {
            Object.keys(globals[category]).forEach((variable)=> {
                client.emit("update_"+category, variable, globals[category][variable]);
            }, this);
        }
    }, this);
    client.on('setSequenceName', (index, name)=> {
        seq.rename(index, name);
        console.log(index, name);
        client.emit('updateNames', seq.names);
    })
    client.on('setTempo', tempo => {
        seq.tempo = tempo;
        io.emit('setTempo', seq.tempo);
    });
    client.on('toggleUseSequencer', () => {
        globals.useSequencer = !globals.useSequencer;
        if(globals.useSequencer) {
            seq.start(lightValues=> {
                io.emit('update_Spots', "north_light", lightValues[0]);
                io.emit('update_Spots', "southeast_light", lightValues[1]);
                io.emit('update_Spots', "south_light", lightValues[2]);
                io.emit('tick', seq.tick);
            });
        } else {
            seq.stop();
        }
        io.emit('toggleUseSequencer', globals.useSequencer);
    });
    client.on('toggleSequenceSpotTick', (index, spot, tick)=> {
        v = seq.sequences[index][spot][tick]
        v = !v;
        seq.sequences[index][spot][tick] = v;
        io.emit('updateSequences', seq.sequences);
    });
    client.on('request_', (category, variable) => {
        client.emit("update_"+category, variable, globals[category][variable]);
    });
    client.on('toggle', (category, variable) => {
        globals[category][variable] = !globals[category][variable];
        console.log(variable, globals[category][variable]);
        handleVariableChange(variable, client);
        client.emit("update_" + category, variable, globals[category][variable]);
        client.broadcast.emit("update_"+category, variable, globals[category][variable]);
    });
    client.on('setValue', (category, variable, value) => {
        globals[category][variable] = value;
        console.log(variable, globals[category][variable]);
        handleVariableChange(variable, client);
        client.broadcast.emit("update_"+category, variable, globals[category][variable]);
    });
    client.on('setSingleValue', (category, value) => {
        globals[category] = value;
        console.log(category, globals[category]);
        handleVariableChange(category, client)
        client.emit("update_" + category, value);
        client.broadcast.emit("update_"+category, globals[category]);
    })
    setInterval(()=> {
        globals.Broadcast.water_temp += Math.round(Math.random()*2 - 1, 4);
        globals.Broadcast.air_temp += (Math.round(Math.random()*2 - 1, 4));
        io.emit("update_Broadcast", "water_temp", globals.Broadcast.water_temp);
        io.emit("update_Broadcast", "air_temp", globals.Broadcast.air_temp);
    }, 1000);
});

function handleVariableChange(variable, client) {
    //write with gpio
    if (variable=="north_light") {
        LED.writeSync(global.Spots.north_light? 1:0);
    } else if (variable == "south_light") {
        
    }  else if (variable == "southeast_light") {
        
    } else if (variable == "is_on") {
        
    }  else if (variable == "freq") {

    } else if (variable == "Filtre") {
        console.log('lol');
        io.emit('updateChangeFilterMode', true);
        setTimeout(()=> io.emit('updateChangeFilterMode', false), 3000)
    } else {
        console.log("Unkown variable");
    }
}



io.emit('initialize', 'light_north', 0);

const port = 8000;
io.listen(port);
console.log('listening on port ', port);