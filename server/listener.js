const {handleVariableChange} = require('./reducer');

// A listener should be of the form (variable, ...args) => set POOL[variable] according to args
// broadcasting the update to the clients is done in server.js

const listener = {
    "setValue": async (variable, value) => {
        handleVariableChange(variable, value)
        POOL[variable] = value;
    },
    "incrementValue": (variable, increment) => {
        console.log(`Incrementing ${variable} of ${increment}`);
        POOL[variable] = POOL[variable] + increment;
        handleVariableChange(variable, increment);
        //Dont handle variable change because adjustement is only for parameters and should not have physical impact.
    },
    "adjustValue": (variable, value) => {
        console.log(`Incrementing ${variable} of ${value} (adjust)`);
        POOL[variable]["value"] += value;
        //Dont handle variable change because adjustement is only for parameters and should not have physical impact.
    },
    "setAdjustValue": (variable, value) => {
        console.log(`setting ${variable} to ${value} (adjust)`);
        POOL[variable]["value"] = value;
    },
    "toggle": (variable) => {
        POOL[variable]["isOn"] = !POOL[variable]["isOn"];
        handleVariableChange(variable, POOL[variable]);
    }
};

module.exports = {
    listener: listener
}
