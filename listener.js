const {handleVariableChange} = require('./reducer');

const listener = {
    "loginAdmin": passwd=> {
        if (passwd==POOL.password) {
            return ['loginAdmin', true]
        } else {
            return ['loginAdmin', false]
        }
    },
    "setValue": (variable, value) => {
        console.log(`Setting ${variable} to ${value}`);
        POOL[variable] = value;
        handleVariableChange(variable, POOL[variable])
        return ["update_" + variable, POOL[variable]]
    },
    "incrementValue": (variable, increment) => {
        console.log(`Incrementing ${variable} of ${value}`);
        POOL[variable] = POOL[variable] + increment;
        handleVariableChange(variable, POOL[variable])
        return ["update_" + variable, POOL[variable]];

    },
    "adjustValue": (variable, value) => {
        console.log(`Incrementing ${variable} of ${value} (adjust)`);
        POOL[variable]["value"] += value;
        //Dont handle variable change because adjustement is only for parameters and should not have physical impact.
        return ["update_" + variable, POOL[variable]]
    },
    "toggle": (variable) => {
        console.log(`Toggling ${variable}`);
        POOL[variable]["isOn"] = !POOL[variable]["isOn"];
        handleVariableChange(variable, POOL[variable]);
        return ["update_"+variable, POOL[variable]]
    }
};

module.exports = {
    listener: listener
}

