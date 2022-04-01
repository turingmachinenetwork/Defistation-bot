const logger = global.logger;
const config = global.config;

const BlockchainUtils = require('../blockchain.util');
const MyWeb3 = require('../my-web3.util');
const { parseFloatNumber } = require('../../convert.util');
const contractInfos = require('../../../configs/contract.config').bsc;
const tokenInfos = require('../../../configs/token.config').bsc;

const BaseBSC = require("./base.bsc");

class BSCCakePool extends BaseBSC {

    constructor(opts) {
        super(opts);
        this.contractAbi = require('../../../configs/bsc/cake-pool.abi');
        this.contractAddr = opts.contractAddr;
    }

    async getTVLAndVolume(_price = null) {
        try {
            let _defaultAddr = contractInfos.defaultAddr;
            let _minorContract = this._getMinorContract();
            let _result = await _minorContract.methods.getData(_defaultAddr).call();
            let _tvl = parseFloatNumber(parseInt(_result[11]) / 1e18, 18);
            _price = parseFloatNumber(parseInt(_result[3]) / 1e18, 18);
            return {
                tvl: _tvl * _price,
                volume: 0
            };
        } catch (e) {
            return false;
        }
    }
};
module.exports = BSCCakePool;