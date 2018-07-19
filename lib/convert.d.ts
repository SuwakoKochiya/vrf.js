/// <reference types="node" />
import { BNObject } from 'bn.js';
import * as elliptic from 'elliptic';
import { Point } from './utils';
export declare function OS2ECP(os: Buffer): elliptic.curve.edwards.Point;
export declare function ECP2OS(P: Point): Buffer;
export declare function S2OS(os: number[]): Buffer;
export declare function OS2IP(os: Buffer): BNObject;
export declare function I2OSP(i: BNObject, len?: number): Buffer;
