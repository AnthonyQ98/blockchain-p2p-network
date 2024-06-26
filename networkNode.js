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
});

// define webpage endpoint
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'public', 'index.html'));
})

// hold sockets
const sockets = [];

// create ws socket
const server = new WebSocket.Server({port: p2pPort});

// define listener for socket connection
server.on('connection', (socket) => {
    sockets.push(socket);
    initConnection(socket);
});

function initConnection(socket) {
    socket.on('message', (data) => {
        const response = JSON.parse(data);

        if (response.type === 'queryLatest') {
            socket.send(JSON.stringify({type: responseLatest, data: JSON.stringify([blockchain.getLatestBlock()])}));
        } else if (response.type == 'responseLatest') {

        }
    });
    socket.send(JSON.stringify({type: 'queryLatest'}));
}

function connectToPeers(newPeers) {
    newPeers.foreach((peer) => {
        const socket = WebSocket(peer);
        socket.on('open', () => {
            initConnection(socket);
            sockets.push(socket);
        });
        socket.on('error', () => {
            console.log('Connection failed with peer: ' + peer);
        });
    });
}

connectToPeers(peers);
app.listen(httpPort, () => {
    console.log(`HTTP server listening on port ${httpPort}`);
    console.log(`Websocket P2P server listening on port ${p2pPort}`);
});