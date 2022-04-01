// it's only use for testnet.
const logger = global.logger;
const config = global.config;
const BASE_JOB = require("./basejob.schedule");
const delay = require('delay');
const axios = require('axios');
const contractInfos = require('../configs/contract.config').bsc;

const TURING_STAKE_HELPER = require('../utils/blockchain/bsc/turing-stake.bsc');
const TURING_ALPACA_FARM_BNB_HELPER = require('../utils/blockchain/bsc/turing-alpaca-farm-bnb.bsc');
const CAKE_LP_POOL_HELPER = require('../utils/blockchain/bsc/cake-lp-pool.bsc');
const CAKE_NO_LOSS_POOL_HELPER = require('../utils/blockchain/bsc/cake-no-loss-pool.bsc');
const CAKE_POOL_HELPER = require('../utils/blockchain/bsc/cake-pool.bsc');
const TURING_LP_POOL_HELPER = require('../utils/blockchain/bsc/turing-lp-pool.bsc');
const TURING_VENUS_LP_POOL_HELPER = require('../utils/blockchain/bsc/turing-venus-lp-pool.bsc');


class UpdateTVLToDefistationSchedule extends BASE_JOB {
	constructor(jobConfig) {
        super(jobConfig);
        this.configs = [
            {
                type: 'cake_lp_pool',
                contract: '0x588Cd06bED000f5979259473712BA6918b73304a',
                label: 'TuringFarmCakeBNBLP_V1',
                price: 256,
                version: 1
            },
            {
                type: 'cake_lp_pool',
                contract: '0xc4758e432de36BC3F44f383FCF9A61D0Ce2a9e64',
                label: 'TuringFarmCakeBNBLP_V2',
                price: 256,
                version: 2
            },
            {
                type: 'cake_no_loss_pool',
                contract: '0x98292750578aa741e1623E09dE3C5A1C8Fe82367',
                label: 'TuringCakeNoLoss',
                price: 0,
                version: 1
            },
            {
                type: 'cake_pool',
                contract: '0xeABC96b9bE830af31846053e361d25e7D928E638',
                label: 'TuringFarmCakeV1',
                price: 0,
                version: 1
            },
            {
                type: 'cake_pool',
                contract: '0xFdE9BC72F9791B738FC47aeB07f426243b25E6a3',
                label: 'TuringFarmCakeV2',
                price: 0,
                version: 2
            },
            {
                type: 'turing_lp_pool',
                contract: '0xbFeE817d038aEb8b773e69844b6c6c7c14419455',
                label: 'TuringFarmTuringBNBLP_V1',
                price: 30,
                version: 1
            },
            {
                type: 'turing_lp_pool',
                contract: '0xcb3B1A0905ADe6C7D1dB17fD92409dA057df7ec3',
                label: 'TuringFarmTuringBNBLP_V2',
                price: 30,
                version: 2
            },
            {
                type: 'cake_lp_pool',
                contract: '0x2c184b922681882A9b277EE4090170B71E99e74E',
                label: 'TuringFarmCakeUSDT_BUSD_LP_V1',
                price: 2,
                version: 1
            },
            {
                type: 'cake_lp_pool',
                contract: '0xc8a61e2d78697C41D81752831c436AaC846464d7',
                label: 'TuringFarmCakeUSDT_BUSD_LP_V2',
                price: 2,
                version: 2
            },
            {
                type: 'cake_lp_pool',
                contract: '0xb2Bd7C2D2577d8Cb95ed31e7E388b2D846626E0e',
                label: 'TuringFarmCakeUSDT_BNB_LP',
                price: 45,
                version: 1
            },
            {
                type: 'cake_lp_pool',
                contract: '0x9d75212AC8f9Edbd1901Af67b550779Cef14dB8d',
                label: 'TuringFarmCakeBUSD_BNB_LP',
                price: 48,
                version: 1
            },
            {
                type: 'cake_lp_pool',
                contract: '0xCFa7F1485FBDC29F52662A8E2D3F247539Df51DC',
                label: 'TuringFarmCakeBTCB_BNB_LP',
                price: 12000,
                version: 1
            },
            {
                type: 'cake_lp_pool',
                contract: '0x1C9CcF44d143aE86fAaDD2A42197c0d281511a32',
                label: 'TuringFarmCakeETH_BNB_LP',
                price: 3300,
                version: 1
            },
            {
                type: 'turing_venus_lp_pool',
                contract: '0xC177D351DD8E69f6727a350c2711B7CfC208AFD2',
                label: 'TuringVenusUSDT_BUSD_LP',
                price: 2,
                version: 1
            },
            {
                type: 'turing_venus_lp_pool',
                contract: '0x5008c518063C907eb3234b0aB6273d843d81FFf9',
                label: 'TuringVenusUSDC_BUSD_LP',
                price: 2,
                version: 1
            },
            {
                type: 'turing_venus_lp_pool',
                contract: '0x3Dc50B71e630a6E4B07f7d406faEb4f4Bb470A50',
                label: 'TuringVenusDAI_BUSD_LP',
                price: 2,
                version: 1
            },
            {
                type: 'turing_venus_lp_pool',
                contract: '0x5bf342bb704d55fDfC4c9B2E2fA1292f543dC8dc',
                label: 'TuringVenusVAI_BUSD_LP',
                price: 2,
                version: 1
            },
            {
                type: 'turing_stake',
                contract: '0x53a648B6A77AFc1A46815588809Ea8A6bD4a23c5',
                label: 'TuringStake1x',
                price: null,
                version: 1
            },
            {
                type: 'turing_stake',
                contract: '0x18bcd760Fa77BBE3Cf35A3004A482c9BC9Be3328',
                label: 'TuringStake3x',
                price: null,
                version: 1
            },
            {
                type: 'turing_stake',
                contract: '0x2403C811206d27eb40a81450d7125808B565F889',
                label: 'TuringStake6x',
                price: null,
                version: 1
            },
            {
                type: 'turing_alpaca_farm_bnb',
                contract: '0xA14c7692e1cfa6257E2CABB542B1842668a40728',
                label: 'TuringAlpacaFarmBNB',
                price: null,
                version: 1
            },
        ];
        this.contractHelper = {};
        this.defistationURl = jobConfig.defistationURl;
        this.defistationUsername = jobConfig.defistationUsername;
        this.defistationKey = jobConfig.defistationKey;
    }

    async runJob() {
        await this._updateTVL();
    }

    async _updateTVL() {
        try {
            logger.log("_updateTVL");
            let self = this;
            let _configs = this.configs;
            let _vol = 0;
            let _tvl = 0;
            let _data = {};
            for (let idx = 0; idx < _configs.length; idx++) {
                let r;
                _data[_configs[idx].label] = {};
                _data[_configs[idx].label].contractAddress = _configs[idx].contract;
                if (_configs[idx].type == 'cake_pool') {
                    let _contractHelper = new CAKE_POOL_HELPER({ contractAddr: _configs[idx].contract });
                    r = await _contractHelper.getTVLAndVolume(_configs[idx].price);
                } else if (_configs[idx].type == 'cake_lp_pool') {
                    let _contractHelper = new CAKE_LP_POOL_HELPER({ contractAddr: _configs[idx].contract });
                    r = await _contractHelper.getTVLAndVolume(_configs[idx].price);
                } else if (_configs[idx].type == 'cake_no_loss_pool') {
                    let _contractHelper = new CAKE_NO_LOSS_POOL_HELPER({ contractAddr: _configs[idx].contract });
                    r = await _contractHelper.getTVLAndVolume(_configs[idx].price);
                } else if (_configs[idx].type == 'turing_lp_pool') {
                    let _contractHelper = new TURING_LP_POOL_HELPER({ contractAddr: _configs[idx].contract });
                    r = await _contractHelper.getTVLAndVolume(_configs[idx].price);
                } else if (_configs[idx].type == 'turing_venus_lp_pool') {
                    let _contractHelper = new TURING_VENUS_LP_POOL_HELPER({ contractAddr: _configs[idx].contract });
                    r = await _contractHelper.getTVLAndVolume(_configs[idx].price);
                } else if (_configs[idx].type == 'turing_stake') {
                    let _contractHelper = new TURING_STAKE_HELPER({ contractAddr: _configs[idx].contract });
                    r = await _contractHelper.getTVLAndVolume(_configs[idx].price);
                } else if (_configs[idx].type == 'turing_alpaca_farm_bnb') {
                    let _contractHelper = new TURING_ALPACA_FARM_BNB_HELPER({ contractAddr: _configs[idx].contract });
                    r = await _contractHelper.getTVLAndVolume(_configs[idx].price);
                }
                if (!r) {
                    logger.log(`_updateTVL: ${_configs[idx].label} Error when get tvl and volume`);
                    await delay(3000);
                    return self._updateTVL();
                }
                logger.log(`_updateTVL: ${_configs[idx].label} `, r);
                _tvl += r.tvl;
                _vol += r.volume;
            }
            logger.log("_updateTVL: _tvl", _tvl);
            logger.log("_updateTVL: _vol", _vol);
            logger.log("_updateTVL: _data", _data);
            let _url = self.defistationURl;
            let _opts = { 
                "method": 'post', 
                "url": _url
            }
            let params = {
                "tvl": _tvl,
                "volume": _vol,
                "bnb": 0,
                "data": _data,
                "test": false
            };
            let _token = Buffer.from(`${self.defistationUsername}:${self.defistationKey}`).toString('base64');
            _opts.headers = { 
                'Authorization': `Basic ${_token}`,
                'Content-Type': 'application/json' 
            };
            _opts.data = params;
            let _r = await axios(_opts);
            logger.log("_updateTVL: _r", _r.data);
            return true;
        } catch(e) {
            logger.error(`[Defistation]_updateTVL error`, e);
            return false;
        }
    }
}

module.exports = UpdateTVLToDefistationSchedule;


