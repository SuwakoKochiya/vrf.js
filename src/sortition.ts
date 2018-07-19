import { Big } from 'big.js';
import { BN } from 'bn.js';
import { Buffer } from 'buffer';
import { verify, vrf } from './ecvrf';

const one = new Big(1);
const zero = new Big(0);

/**
 * Math - combination
 * @param {Big} m
 * @param {Big} n
 * @returns {Big}
 */
export function combination(m: Big, n: Big) {
  return array(m, n).div(array(n, n));
}

/**
 * Math - array
 * @param {Big} m
 * @param {Big} n
 * @returns {Big}
 */
export function array(m: Big, n: Big) {
  return factorial(m, n);
}

/**
 * Math - factorial
 * @param {Big} m
 * @param {Big} n
 * @returns {Big}
 */
function factorial(m: Big, n: Big) {
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
export function binomial(k: Big, w: Big, p: Big) {
  const a = combination(w, k);
  const b = p.pow(+k);
  const c = one.minus(p).pow(+w.minus(k));
  return a.mul(b).mul(c);
}

/**
 * Binomial Distribution
 * @param {Big} j
 * @param {Big} w
 * @param {Big} p
 * @returns {Big}
 */
export function cumulative(j: Big, w: Big, p: Big) {
  let sum = zero;
  for (let i = zero; i.lte(j); i = i.plus(one)) {
    sum = sum.plus(binomial(i, w, p));
  }
  return sum;
}

export function getVotes(hash: Buffer, w: Big, p: Big) {
  const hashValue = new Big(new BN(hash).toString());
  const maxBuffer = Buffer.alloc(hash.length + 1);
  maxBuffer[0] = 1;
  const maxValue = new Big(new BN(maxBuffer).toString());
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

export function sortition(
  privateKey: Buffer,
  publicKey: Buffer,
  seed: Buffer,
  tau: Big,
  role: Buffer,
  w: Big,
  W: Big,
): [Buffer, Buffer, Big] {
  const message = Buffer.concat([seed, role]);
  const { proof, value } = vrf(publicKey, privateKey, message);
  const j = getVotes(value, w, tau.div(W));
  return [value, proof, j];
}

export function verifySort(
  publicKey: Buffer,
  value: Buffer,
  proof: Buffer,
  seed: Buffer,
  tau: Big,
  role: Buffer,
  w: Big,
  W: Big,
) {
  const v = Buffer.concat([seed, role]);
  if (!verify(publicKey, v, value, proof)) {
    return zero;
  }
  return getVotes(value, w, tau.div(W));
}
