import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css'
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import './css/index.css'
// import 'bootstrap/dist/js/bootstrap.js'

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();

