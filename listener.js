const {handleVariableChange} = require('./reducer');

// A listener should be of the form (variable, ...args) => set POOL[variable] according to args
// broadcasting the update to the clients is done in server.js

const listener = {
    "setValue": (variable, value) => {
        console.log(`Setting ${variable} to ${value}`);
        POOL[variable] = value;
        handleVariableChange(variable, POOL[variable])
    },
    "incrementValue": (variable, increment) => {
        console.log(`Incrementing ${variable} of ${increment}`);
        POOL[variable] = POOL[variable] + increment;
        //Dont handle variable change because adjustement is only for parameters and should not have physical impact.
    },
    "adjustValue": (variable, value) => {
        console.log(`Incrementing ${variable} of ${value} (adjust)`);
        POOL[variable]["value"] += value;
        //Dont handle variable change because adjustement is only for parameters and should not have physical impact.
    },
    "toggle": (variable) => {
        console.log(`Toggling ${variable}`);
        POOL[variable]["isOn"] = !POOL[variable]["isOn"];
        handleVariableChange(variable, POOL[variable]);
    }
};

module.exports = {
    listener: listener
}

