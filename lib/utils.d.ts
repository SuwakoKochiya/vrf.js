/// <reference types="node" />
import * as crypto from "crypto";
import * as elliptic from 'elliptic';
import { BNObject } from "bn.js";
export declare function concatBuffer(...args: ArrayOrBuffer[]): Buffer;
export declare function bufferReverse(buffer: Buffer): Uint8Array;
export declare type Point = elliptic.curve.edwards.Point;
export declare type ArrayOrBuffer = Buffer | number[] | Uint8Array;
export declare const sha256: () => crypto.Hash;
export declare const sha512: () => crypto.Hash;
export declare function normalize(data: any): Buffer;
export declare function S2OS(os: number[]): Buffer;
export declare function OS2IP(os: ArrayOrBuffer): BNObject;
export declare function I2OSP(i: BNObject, len?: number): number[];
export declare const toArray: typeof elliptic.utils.toArray;
