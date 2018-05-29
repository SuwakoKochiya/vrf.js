/// <reference types="node" />
import * as elliptic from 'elliptic';
import { BNObject } from 'bn.js';
import { ArrayOrBuffer, Point } from "./utils";
export declare function OS2ECP(os: ArrayOrBuffer): elliptic.curve.edwards.Point;
export declare function ECP2OS(P: Point): Buffer;
export declare function expandSecret(sk: Buffer): Buffer;
export declare function generatePair(): number[][];
export declare function hashToCurve(m: ArrayOrBuffer, pk: ArrayOrBuffer): elliptic.curve.edwards.Point;
export declare function hashPoints(...args: Point[]): BNObject;
export declare function decodeProof(proof: ArrayOrBuffer): {
    r: elliptic.curve.edwards.Point;
    c: BNObject;
    s: BNObject;
};
export declare function prove(pk: ArrayOrBuffer, sk: ArrayOrBuffer, m: ArrayOrBuffer): Buffer;
export declare function proofToHash(pi: ArrayOrBuffer): Buffer;
export declare function verify(pk: ArrayOrBuffer, m: ArrayOrBuffer, vrf: ArrayOrBuffer, proof: ArrayOrBuffer): boolean;
