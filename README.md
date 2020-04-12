# Pool-Control

A simple interface for monitoring and controlling a pool from a Web-App.

Designed for Raspberry-Pi combined with the module [MCP23017](https://www.microchip.com/wwwproducts/en/MCP23017)

## Features

1. Monitoring: any data stream setup to the Raspberry. Status: in developpement
2. Controlling: status: can write to any output of the MCP23017 module (e.g. spots). Washing Cycle scheduling: done. Massage: in developpement

## install

Client:

    clone git@github.com:taserflanger/pool-control.git
    npm install
    npm start
    
Backend: install on raspberry-pi:


  ```
  clone git@github.com:taserflanger/pool-control.git
  npm install
  node server
  ```
  
Make sure raspberry and client are on the same network and change adress in <code>/src/index.js </code> to the local IP adress of your raspberry-pi.
