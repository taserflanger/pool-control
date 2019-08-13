const SerialPort = require('serialport')
const port = new SerialPort('/dev/ttyUSB0', {
  baudRate: 9600
});

b = new Buffer ([0x01, 0x06, 0x20, 0x00, 0x00, 0x03, 0x0B, 0xC2])
port.write(b);