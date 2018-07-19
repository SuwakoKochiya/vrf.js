/// <reference types="node" />
import { Big } from 'big.js';
/**
 * Math - combination
 * @param {Big} m
 * @param {Big} n
 * @returns {Big}
 */
export declare function combination(m: Big, n: Big): Big;
/**
 * Math - array
 * @param {Big} m
 * @param {Big} n
 * @returns {Big}
 */
export declare function array(m: Big, n: Big): Big;
/**
 * binomial
 * @param {Big} k 抽到k次
 * @param {Big} w 次实验
 * @param {Big} p 抽到的概率
 * @returns {Big} 的概率
 */
export declare function binomial(k: Big, w: Big, p: Big): Big;
/**
 * Binomial Distribution
 * @param {Big} j
 * @param {Big} w
 * @param {Big} p
 * @returns {Big}
 */
export declare function cumulative(j: Big, w: Big, p: Big): Big;
export declare function getVotes(hash: Buffer, w: Big, p: Big): Big;
export declare function sortition(privateKey: Buffer, publicKey: Buffer, seed: Buffer, tau: Big, role: Buffer, w: Big, W: Big): [Buffer, Buffer, Big];
export declare function verifySort(publicKey: Buffer, value: Buffer, proof: Buffer, seed: Buffer, tau: Big, role: Buffer, w: Big, W: Big): Big;
