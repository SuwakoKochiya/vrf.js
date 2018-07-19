"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const buffer_1 = require("buffer");
const crypto = require("crypto");
const elliptic = require("elliptic");
const constant_1 = require("./constant");
function reverseB(buffer) {
    return B(buffer).reverse();
}
exports.reverseB = reverseB;
exports.sha256 = () => crypto.createHash('sha256');
exports.sha512 = () => crypto.createHash('sha512');
function B(data) {
    if (typeof data === 'string') {
        return buffer_1.Buffer.from(data, 'hex');
    }
    return buffer_1.Buffer.from(data);
}
exports.B = B;
function expandSecret(sk) {
    const secret = exports.sha512().update(sk.slice(0, 32)).digest();
    secret[0] &= 248;
    secret[31] &= 127;
    secret[31] |= 64;
    return secret.slice(0, 32);
}
exports.expandSecret = expandSecret;
function generatePair() {
    const sec = elliptic.rand(32);
    const pair = constant_1.EDDSA.keyFromSecret(sec);
    const publicKey = B(pair.getPublic());
    const secretKey = B(pair.getSecret());
    const privateKey = buffer_1.Buffer.concat([secretKey, publicKey]);
    return [publicKey, privateKey, secretKey];
}
exports.generatePair = generatePair;
