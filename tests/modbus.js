var ModbusRTU = require('modbus-serial')
var client = new ModbusRTU()

//slave ID - can be changed in the inverter settings
client.setID(1)

//recommended time between requests :330
client.setTimeout(500)




//connect over USB dongle. for windows this would be a COM port
client.connectRTUBuffered(
    "/dev/ttyUSB0",
    {
        baudRate: 9600,
        dataBits:8,
        parity:"even",
        stopBits:1
    }, 
    (err, success) => {
        client.write = async (register, value) => {
            //gives access to modbus
            console.log(await client.writeRegister(6, 2));
            console.log(await client.writeRegister(register, value));
            //yields access back
            console.log(await client.writeRegister(6, 1));
        }
        if (err) {
            console.log('connectRTUBuffered error')
            console.log(err)
            return
        }
        // read the 2 registers starting at address 5
        // on device number 1.
        //   readCoils(dataAddress: number, length: number): Promise<ReadCoilResult>;
        //   readDiscreteInputs(dataAddress: number, length: number): Promise<ReadCoilResult>;
        //   readHoldingRegisters(dataAddress: number, length: number): Promise<ReadRegisterResult>;
        //   readInputRegisters(dataAddress: number, length: number): Promise<ReadRegisterResult>;
        //   writeCoil(dataAddress: number, state: boolean): Promise<WriteCoilResult>;
        //   writeCoils(dataAddress: number, states: Array<boolean>): Promise<WriteMultipleResult>;
        //   writeRegister(dataAddress: number, value: number): Promise<WriteRegisterResult>;
        //   writeRegisters(dataAddress: number, values: Array<number>): Promise<WriteMultipleResult>;
        // 0xD002 : actual frequency * 100 
        // client.readHoldingRegisters(0xD002, 1).then(console.log);
        // motor: 0x2000
        //      forward: 0x0001
        //      stop: 0x0003
        // Températures: 33 & 34
        //client.readHoldingRegisters(0xD033, 1).then(console.log);


        //client.write(0x2000, 1)
        setInterval(()=> {
            client.readHoldingRegisters(0xD000, 1).then(console.log);
        }, 1000);

        //read 33049 register. This will return the realtime value for DCVoltage1
        // client.readInputRegisters (33049, 1, (error, data) => {
        //     if (error) {
        //     console.log(error)
        //     } else {
        //     console.log(data)
        //     }
        // })
    }
)


