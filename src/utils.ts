import * as crypto from "crypto"
import * as elliptic from 'elliptic'
import { BN, BNObject } from "bn.js";

export function concatBuffer(...args: ArrayOrBuffer[]) {
  const arr = args.reduce<number[]>((prev, curr) => prev.concat(toArray(curr, 16)), [])
  return new Buffer(arr)
}

export function bufferReverse(buffer: Buffer) {
  return new Buffer(buffer).reverse()
}

export type Point = elliptic.curve.edwards.Point
export type ArrayOrBuffer = Buffer | number[] | Uint8Array

export const sha256 = () => crypto.createHash('sha256')
export const sha512 = () => crypto.createHash('sha512')

export function normalize(data: any) {
  return new Buffer(data)
}

export function S2OS(os: number[]) {
  const sign = os[31] >>> 7
  os.unshift(sign + 2)
  return normalize(os)
}

export function OS2IP(os: ArrayOrBuffer) {
  return new BN(os as any)
}

export function I2OSP(i: BNObject, len?: number) {
  return i.toArray('be', len)
}

export const toArray = elliptic.utils.toArray