var Path = require('path');
const bodyparser = require('body-parser');
var express = require('express');
var app = express();
const Block = require('./Block');
const bitcoin = new Block();

const uuid = require('uuid/v1');

const nodeAddress = uuid().split('-').join('');
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:false}));

app.get('/', function(req, res){
    res.sendFile(Path.join(__dirname+'/index.html'));
});
app.get('/Block', function(req, res){
    res.send(bitcoin);
});

app.post('/transaction', function(req,res){
    const blockindex = bitcoin.createNewTransaction(req.body.amount, req.body.sender, req.body.recipient);
    res.json({note : 'transaction will be added in Block ${blockindex}.'});
});

app.get('/mine', function(req, res){
    const lastBlock = bitcoin.getLastBlock();
    const previousBlockHash = lastBlock['hash'];
    const currentBlockData = {
        transactions : bitcoin.pendingTransactions,
        index : lastBlock['index']+1
    };
    const nonce = bitcoin.proofOfWork(previousBlockHash, currentBlockData);
    const blockHash = bitcoin.hashBlock(previousBlockHash, currentBlockData, nonce);
    bitcoin.createNewTransaction(12.5,"00",nodeAddress);
    const newBlock = bitcoin.createNewBlock(nonce, previousBlockHash, blockHash);
    res.json({
        note : 'new block mined',
        block : newBlock
    });
});

app.listen(8080, function(){
    console.log('listening to port 8080');
});
