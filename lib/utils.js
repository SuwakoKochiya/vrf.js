"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto = require("crypto");
const elliptic = require("elliptic");
const bn_js_1 = require("bn.js");
function concatBuffer(...args) {
    const arr = args.reduce((prev, curr) => prev.concat(exports.toArray(curr, 16)), []);
    return new Buffer(arr);
}
exports.concatBuffer = concatBuffer;
function bufferReverse(buffer) {
    return new Buffer(buffer).reverse();
}
exports.bufferReverse = bufferReverse;
exports.sha256 = () => crypto.createHash('sha256');
exports.sha512 = () => crypto.createHash('sha512');
function normalize(data) {
    return new Buffer(data);
}
exports.normalize = normalize;
function S2OS(os) {
    const sign = os[31] >>> 7;
    os.unshift(sign + 2);
    return normalize(os);
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
