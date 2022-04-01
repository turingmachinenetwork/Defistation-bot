const logger = global.logger;
const config = global.config;

const BlockchainUtils = require('../blockchain.util');
const MyWeb3 = require('../my-web3.util');
const { parseFloatNumber } = require('../../convert.util');
const contractInfos = require('../../../configs/contract.config').bsc;
const tokenInfos = require('../../../configs/token.config').bsc;

const BaseBSC = require("./base.bsc");

class BSCTuringVenusLpPool extends BaseBSC {

    constructor(opts) {
        super(opts);
        this.contractAbi = require('../../../configs/bsc/turing-venus-lp-pool.abi');
        this.contractAddr = opts.contractAddr;
    }

    async getTVLAndVolume(_price = 2) {
        try {
            let _defaultAddr = contractInfos.defaultAddr;
            let _minorContract = this._getMinorContract();
            let _result = await _minorContract.methods.getData(_defaultAddr).call();
            let _tvl = parseFloatNumber(parseInt(_result.tvl_) / 1e18, 18);
            let _vol = parseFloatNumber(parseInt(_result.vol_) / 1e18, 18);
            return {
                tvl: _tvl * _price,
                volume: _vol
            };
        } catch (e) {
            return false;
        }
    }
};
module.exports = BSCTuringVenusLpPool;