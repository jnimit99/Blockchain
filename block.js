const sha256 = require('sha256');
function Block(){
    this.chain = [];
    this.pendingTransactions = [];
    this.createNewBlock(100,'0','0');
}

Block.prototype.createNewBlock = function(nonce, previousBlockHash, Hash){
    const newBlock = {
        index : this.chain.length + 1,
        timestamp : Date.now(),
        transactions : this.pendingTransactions,
        nonce : nonce,
        hash : Hash,
        previousBlockHash : previousBlockHash
    };
    this.pendingTransactions = [];
    this.chain.push(newBlock);
    return newBlock;
}

Block.prototype.getLastBlock = function(){
    return this.chain[this.chain.length - 1];
}

Block.prototype.createNewTransaction = function(amount, sender, recipient){
    const newTransaction = {
        amount : amount,
        sender : sender,
        recipient : recipient
    };
    this.pendingTransactions.push(newTransaction);
    return this.getLastBlock()['index']+1;
}

Block.prototype.hashBlock = function(previousBlockHash, currentBlockData, nonce){
    const dataAsString = previousBlockHash + nonce.toString() + JSON.stringify(currentBlockData);
    const hash =sha256(dataAsString);
    return hash;
}

Block.prototype.proofOfWork = function(previousBlockHash, currentBlockData){
    let nonce = 0;
    let hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
    while (hash.substring(0,4)!="0000"){
        nonce++;
        hash = this.hashBlock(previousBlockHash,currentBlockData, nonce);
    };
}

module.exports = Block;

