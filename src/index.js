import React from 'react';
import ReactDOM from 'react-dom';
import openSocket from 'socket.io-client';
import 'bootstrap/dist/css/bootstrap.css' // very important to load bootstrap first to overwrite properties
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import './css/index.css'
const adress="localhost"
//ordi pascal
// const adress = "192.168.0.100"
//ordi région
// const adress = "192.168.0.161"
//raspberry
// const adress = "192.168.0.10"
const io = openSocket(`http://${adress}:8000`);
ReactDOM.render(<App/>, document.getElementById('root'));
registerServiceWorker();
export {io};
