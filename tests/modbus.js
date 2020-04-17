var ModbusRTU = require('modbus-serial')
var client = new ModbusRTU()

//slave ID - can be changed in the inverter settings
client.setID(1)

// 50ms is too much, 100ms is also too much at 2400bps but 100ms is OK at 4800bps
// 200ms is safe 8*8
client.setTimeout(400)


//client.connectRTUBuffered("/dev/ttyUSB0", {baudRate: 9600})
//connect over USB dongle. for windows this would be a COM port
// 9600 generate too many errors 4800bps and 2400bps are OK 
//sent       1000000110000001000001001110001001011111110000111
//           1000000110000001000001001110001001011111111101000
//received   1000000110000001000001001110001001011111110000011
//received   1000000111000000110000010101111000111011111111111
client.connectRTUBuffered(
    "/dev/ttyUSB0",
    {
        baudRate: 2410, 
        dataBits:8,
        parity:"even",
        stopBits:1
    }, 

    (err, success) => {
        client.write = async (register, value) => {
            //gives access to modbus
            console.log(await client.writeRegister(0x0006, 2));
            console.log(await client.writeRegister(register, value));
            //yields access back
            console.log(await client.writeRegister(0x0006, 1));
        }
        if (err) {
            console.log('connectRTUBuffered error')
            console.log(err)
            return
        }
        
        
        // client.write(0xB002, 0);
        setInterval(()=> {
            // client.readHoldingRegisters(0xD021, 1).then(console.log);
            client.readHoldingRegisters(0xD000+33, 1).then(console.log).catch((e)=>console.log(e));
        }, 2000);
        
    }
    )
    
    /*
    0x0006: commande  
    0xD002: motor Frequency
    0xD019: analog output AO1
    0xD020: analog output AO2
    0xD021: input terminal status
    0xD022: output terminal status
    0xD033: Temperature
    0xB002: Baud rate setteing
            0 2400
            1 4800
            2 9600
            ...
            5 1152000
    0x2000: r/w
        Bit 0-2 001 run
                010 jog run
                100 stop
        Bit 4   1 reset
    0x2001: modbus frequency setting
    0x2005: AO1 control
    0x2006: AO2 control
    0x2007: DO control
    0x2008: DO terminal control
        Bit 0   DIGITAL OUTPUT Y1
        Bit 1   DIGITAL OUTPUT Y2
        Bit 2   Relay R1
        Bit 3   Relay R2
            
    0xE000: error code
            */        
   
   
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
   //read 33049 register. This will return the realtime value for DCVoltage1
   // client.readInputRegisters (33049, 1, (error, data) => {
   //     if (error) {
   //     console.log(error)
   //     } else {
   //     console.log(data)
   //     }
   // })