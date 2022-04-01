const config = global.config;
const MyWeb3 = require('../my-web3.util');

class BaseBSC {
	constructor(opts) {
		this.mainContract = null;
        this.minorContract = null;
        this.mainNode = opts && opts.mainNode ? opts.mainNode : config.bscNode;
        this.minorNode = opts && opts.minorNode ? opts.minorNode : config.bscNode;
        this.mainWeb3 = this._getMainWeb3();
        this.minorWeb3 = this._getMinorWeb3();
    }

     _getMainWeb3() {
        if (!this.mainWeb3) {
            this.mainWeb3 = MyWeb3.getWeb3(this.mainNode);
        }
        return this.mainWeb3;
    }

    _getMinorWeb3() {
        if (!this.minorWeb3) {
            this.minorWeb3 = MyWeb3.getWeb3(this.minorNode);
        }
        return this.minorWeb3;
    }

    _getMainContract() {
        if (!this.mainContract) {
            this.mainContract = MyWeb3.getContract(this._getMainWeb3(), this.contractAbi, this.contractAddr);
        }
        return this.mainContract;
    }

    _getMinorContract() {
        if (!this.minorContract) {
            this.minorContract = MyWeb3.getContract(this._getMinorWeb3(), this.contractAbi, this.contractAddr);
        }
        return this.minorContract;
    }
}
module.exports = BaseBSC;