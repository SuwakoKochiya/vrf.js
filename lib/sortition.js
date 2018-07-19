"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const big_js_1 = require("big.js");
const bn_js_1 = require("bn.js");
const buffer_1 = require("buffer");
const ecvrf_1 = require("./ecvrf");
const one = new big_js_1.Big(1);
const zero = new big_js_1.Big(0);
/**
 * Math - combination
 * @param {Big} m
 * @param {Big} n
 * @returns {Big}
 */
function combination(m, n) {
    return array(m, n).div(array(n, n));
}
exports.combination = combination;
/**
 * Math - array
 * @param {Big} m
 * @param {Big} n
 * @returns {Big}
 */
function array(m, n) {
    return factorial(m, n);
}
exports.array = array;
/**
 * Math - factorial
 * @param {Big} m
 * @param {Big} n
 * @returns {Big}
 */
function factorial(m, n) {
    let num = one;
    let count = zero;
    for (let i = m; i.gt(zero); i = i.minus(one)) {
        if (count.eq(n)) {
            break;
        }
        num = num.mul(i);
        count = count.plus(one);
    }
    return num;
}
/**
 * binomial
 * @param {Big} k 抽到k次
 * @param {Big} w 次实验
 * @param {Big} p 抽到的概率
 * @returns {Big} 的概率
 */
function binomial(k, w, p) {
    const a = combination(w, k);
    const b = p.pow(+k);
    const c = one.minus(p).pow(+w.minus(k));
    return a.mul(b).mul(c);
}
exports.binomial = binomial;
/**
 * Binomial Distribution
 * @param {Big} j
 * @param {Big} w
 * @param {Big} p
 * @returns {Big}
 */
function cumulative(j, w, p) {
    let sum = zero;
    for (let i = zero; i.lte(j); i = i.plus(one)) {
        sum = sum.plus(binomial(i, w, p));
    }
    return sum;
}
exports.cumulative = cumulative;
function getVotes(hash, w, p) {
    const hashValue = new big_js_1.Big(new bn_js_1.BN(hash).toString());
    const maxBuffer = buffer_1.Buffer.alloc(hash.length + 1);
    maxBuffer[0] = 1;
    const maxValue = new big_js_1.Big(new bn_js_1.BN(maxBuffer).toString());
    const value = hashValue.div(maxValue);
    let j = zero;
    let curr = cumulative(j, w, p);
    while (j.lte(w) && value.gte(curr)) {
        j = j.plus(one);
        const next = cumulative(j, w, p);
        if (value.lt(next)) {
            return j;
        }
        curr = next;
    }
    return zero;
}
exports.getVotes = getVotes;
function sortition(privateKey, publicKey, seed, tau, role, w, W) {
    const message = buffer_1.Buffer.concat([seed, role]);
    const { proof, value } = ecvrf_1.vrf(publicKey, privateKey, message);
    const j = getVotes(value, w, tau.div(W));
    return [value, proof, j];
}
exports.sortition = sortition;
function verifySort(publicKey, value, proof, seed, tau, role, w, W) {
    const v = buffer_1.Buffer.concat([seed, role]);
    if (!ecvrf_1.verify(publicKey, v, value, proof)) {
        return zero;
    }
    return getVotes(value, w, tau.div(W));
}
exports.verifySort = verifySort;
