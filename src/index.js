import React from 'react';
import ReactDOM from 'react-dom';
import openSocket from 'socket.io-client';
//import 'bootstrap/dist/css/bootstrap.css' // very important to load bootstrap first to overwrite properties
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import './css/index.css'
//const adress="192.168.29.30"
//ordi pascal
// const adress = "192.168.0.100"
//ordi région
//const adress = "192.168.1.10"
//raspberry
const adress = "raspberrypi"
const io = openSocket(`http://${adress}:7999`);
ReactDOM.render(<App/>, document.getElementById('root'));
registerServiceWorker();
export {io};