import { Big } from 'big.js';
import { Buffer } from 'buffer';
import * as crypto from 'crypto';
import * as elliptic from 'elliptic';
import { EDDSA } from './constant';

export function reverseB(buffer: Buffer) {
  return B(buffer).reverse() as Buffer;
}

export type Point = elliptic.curve.edwards.Point

export const sha256 = () => crypto.createHash('sha256');
export const sha512 = () => crypto.createHash('sha512');

export function B(data: any) {
  if (typeof data === 'string') {
    return Buffer.from(data, 'hex');
  }
  return Buffer.from(data);
}

export function N(n: Big | number | string): Big {
  switch (typeof n) {
    case 'number':
    case 'string':
      return new Big(n)
    default:
      return n as any
  }
}

export function expandSecret(sk: Buffer) {
  const secret = sha512().update(sk.slice(0, 32)).digest();
  secret[0] &= 248;
  secret[31] &= 127;
  secret[31] |= 64;
  return secret.slice(0, 32);
}

export function generatePair(): [Buffer, Buffer, Buffer] {
  const sec = elliptic.rand(32);
  const pair = EDDSA.keyFromSecret(sec);
  const publicKey = B(pair.getPublic());
  const secretKey = B(pair.getSecret());
  const privateKey = Buffer.concat([secretKey, publicKey]);
  return [publicKey, privateKey, secretKey];
}