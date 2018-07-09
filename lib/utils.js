"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bn_js_1 = require("bn.js");
const crypto = require("crypto");
const elliptic = require("elliptic");
function bufferReverse(buffer) {
    return B(buffer).reverse();
}
exports.bufferReverse = bufferReverse;
exports.sha256 = () => crypto.createHash('sha256');
exports.sha512 = () => crypto.createHash('sha512');
function B(data) {
    if (typeof data === 'string') {
        return Buffer.from(data, 'hex');
    }
    return Buffer.from(data);
}
exports.B = B;
function S2OS(os) {
    const sign = os[31] >>> 7;
    os.unshift(sign + 2);
    return B(os);
}
exports.S2OS = S2OS;
function OS2IP(os) {
    return new bn_js_1.BN(os);
}
exports.OS2IP = OS2IP;
function I2OSP(i, len) {
    return i.toArray('be', len);
}
exports.I2OSP = I2OSP;
exports.toArray = elliptic.utils.toArray;
