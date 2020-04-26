const ModbusRTU = require("modbus-serial");
const client = new ModbusRTU();
 
// open connection to a serial port
client.connectRTU("/dev/ttyUSB0", { baudRate: 9600 }, write);

function write() {
  console.log("test-write");
  client.setID(1);

  // write the values 0, 0xffff to registers starting at address 5
  // on device number 1.
  client.writeRegister(0x2001, 0x07cf);
  console.log("written");
}
function read() {
  console.log("test");
  // read the 2 registers starting at address 5
  // on device number 1.
  client.readHoldingRegisters(1, 1).then(console.log);
}

// hex code to write
//https://www.lammertbies.nl/comm/info/crc-calculation.html to calculate crc
// stop 01H 06H 2000H 0003H C20BH 
// freq 40Hz: 01H 06H 2001H 0F9FH 9652H
//freq 20 Hz 01H 06H 2001H 07CFH 91AEH
// forward 01H 06H 2000H 0001H 43CAH
// reverse 01H 06H 2000H 0009H 420CH
// 
