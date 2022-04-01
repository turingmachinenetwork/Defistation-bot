const logger = global.logger;

const Web3 = require('web3');
const EthereumTx = require('ethereumjs-tx');
const BlockchainUtils = require('./blockchain.util');

const tokenInfos = require('../../configs/token.config').bsc;

function toHex(number) {
    return Web3.utils.toHex(number);
}
exports.toHex = toHex;

function getWeb3(nodeLink) {
    return new Web3(nodeLink);
}
exports.getWeb3 = getWeb3;

function getContract(web3, abi, address) {
    return new web3.eth.Contract(abi, address);
}
exports.getContract = getContract;

async function getSignedTransaction(privateKey, transaction, chain='mainnet') {
    const privateKeyBuffer = Buffer.from(privateKey, 'hex');
    const tx = new EthereumTx(transaction, { chain: chain, hardfork: 'petersburg' });
    tx.sign(privateKeyBuffer);
    var serializedTx = tx.serialize();
    let rawTx = '0x' + serializedTx.toString('hex');
    return rawTx;
}
exports.getSignedTransaction = getSignedTransaction;

async function getTransacationNonce(web3, address) {
    return await web3.eth.getTransactionCount(address);
}
exports.getTransacationNonce = getTransacationNonce;

async function getGasPrice(web3, minGasPrice) {
    let gasPrice = await web3.eth.getGasPrice();
    gasPrice = parseInt(gasPrice);
    gasPrice += 0;
    gasPrice = gasPrice < minGasPrice ? minGasPrice : gasPrice;
    return gasPrice;
}
exports.getGasPrice = getGasPrice;

async function sendSignedTransaction(web3, rawTx) {
    let me = this;
    let sst = new Promise(function(resolve, reject) {
        try {
            web3.eth.sendSignedTransaction(rawTx, function(err, hash) {
                if (err) {
                    logger.error("Error to send signed transaction", rawTx, err);
                    resolve({
                        result: false,
                        code: 1,
                        message: err.toString()
                    });
                }
                resolve({
                    result: true,
                    txId: hash,
                    code: 0,
                    message: "Success"
                });
            });
        } catch (err) {
            logger.error("Unable to send signed transaction", rawTx, err);
            resolve(null);
        }
    });
    let resp = await sst;
    return resp;
}
exports.sendSignedTransaction = sendSignedTransaction;

async function createTransaction(web3, fromAddress, opts) {
    if (!opts) opts = {};
    let nonce = opts.nonce;
    if (!nonce) {
        nonce = await getTransacationNonce(web3, fromAddress);
    }
    let gasPrice = opts.gasPrice;
    if (!gasPrice) {
        gasPrice = await getGasPrice(web3, 0);
    }
    let gasLimit = opts.gasLimit;
    if (!gasLimit) {
        gasLimit = process.env.GAS_LIMIT_DEFAULT;
    }
    let transInfo = {
        nonce   : toHex(nonce),
        gasPrice: toHex(gasPrice),
        gasLimit: toHex(gasLimit),
        from    : fromAddress
    };
    if (opts.data) {
        transInfo.data = opts.data;
    }
    if (opts.to) {
        transInfo.to = opts.to;
    }
    if (opts.value) {
        transInfo.value = toHex(opts.value);
    }
    return transInfo;
}
exports.createTransaction = createTransaction;

function privateKeyToAddress(web3, privateKey) {
    return web3.eth.accounts.privateKeyToAccount(privateKey).address;
}
exports.privateKeyToAddress = privateKeyToAddress;

async function getTransactionInfo(web3, txid) {
    try {
        return await web3.eth.getTransactionReceipt(txid);
    } catch(ex) {
        logger.error(`Unable to get transaction info for ${txid}`, ex)
    }
    return null;
}
exports.getTransactionInfo = getTransactionInfo;