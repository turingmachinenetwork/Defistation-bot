const BigNumber = require('bignumber.js');

function toNetworkAmount(amount, decimal) {
    let a = new BigNumber(amount);
    let b = new BigNumber(10);
    b = b.exponentiatedBy(decimal);
    return a.multipliedBy(b).toFixed(0);
}
exports.toNetworkAmount = toNetworkAmount;

function toHumanAmount(amount, decimal) {
    let a = parseFloat((amount / (10 ** decimal)).toFixed(decimal));
    return a;
}
exports.toHumanAmount = toHumanAmount;

function roundNumberByDecimal(number, decimal) {
    let k = 10 ** decimal;
    return Math.floor(number*k)/k;
}
exports.roundNumberByDecimal = roundNumberByDecimal;

function toBN(amount) {
    return new BigNumber(amount);
}

exports.toBN = toBN; 