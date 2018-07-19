"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bn_js_1 = require("bn.js");
const elliptic = require("elliptic");
const constant_1 = require("./constant");
const utils_1 = require("./utils");
function OS2ECP(os) {
    const b = elliptic.utils.toArray(os, 16);
    try {
        return constant_1.EDDSA.decodePoint(b);
    }
    catch (e) {
    }
    return null;
}
exports.OS2ECP = OS2ECP;
function ECP2OS(P) {
    return S2OS(constant_1.EDDSA.encodePoint(P));
}
exports.ECP2OS = ECP2OS;
function S2OS(os) {
    const sign = os[31] >>> 7;
    os.unshift(sign + 2);
    return utils_1.B(os);
}
exports.S2OS = S2OS;
function OS2IP(os) {
    return new bn_js_1.BN(os);
}
exports.OS2IP = OS2IP;
function I2OSP(i, len) {
    return utils_1.B(i.toArray('be', len));
}
exports.I2OSP = I2OSP;
