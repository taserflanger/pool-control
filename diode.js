const Gpio = require('onoff').Gpio;
let LED = new Gpio(2, 'out');
let blinkInterval = setInterval(blinkLed, 2000);

function blinkLed() {
    if (LED.readSync() === 0) {
        LED.writeSync(1);
    } else {
        LED.writeSync(0);
    }
}

function endBlink() {
    clearInterval(blinkInterval);
    LED.writeSync(0);
    LED.unexport();
}

setTimeout(endBlink, 50000)