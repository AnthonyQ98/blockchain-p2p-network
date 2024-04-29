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

// init blockchain object
const blockchain = new Blockchain();

// define GET endpoint for getting blockchain blocks
app.get('/blocks',  (req, res) => {
    res.json(blockchain.chain);
});

// define POST endpoint for mining block operation
app.post('/mineBlock', (req, res) => {
    const newTransaction = new Transaction(req.body.from, req.body.to, req.body.amount);
    blockchain.addTransaction(newTransaction);
    blockchain.minePendingTransactions(req.body.minerAddress);
    res.redirect('/blocks');
})
