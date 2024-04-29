// declare imports
const express = require('express');
const bodyParser = require('body-parser');
const WebSocket = require('ws');
const path = require('path');
const {Blockchain,Transaction} = require('./Blockchain');

// parse command line args
const httpPort = parseInt(process.argv[2] || 3001);
const p2pPort = parseInt(process.argv[3] || 6001);
const peers = process.argv.slice(4);

// init express app
const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
