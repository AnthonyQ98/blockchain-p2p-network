const express = require('express');
const bodyParser = require('body-parser');
const WebSocket = require('ws');
const path = require('path');
const {Blockchain,Transaction} = require('./Blockchain');

const httpPort = parseInt(process.argv[2] || 3001);
const p2pPort = parseInt(process.argv[3] || 6001);

const peers = process.argv.slice(4);
