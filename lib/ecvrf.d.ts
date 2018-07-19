/// <reference types="node" />
export declare function hashToCurve(message: Buffer, publicKey: Buffer): any;
export declare function prove(publicKey: Buffer, privateKey: Buffer, message: Buffer): Buffer;
export declare function proofToHash(proof: Buffer): Buffer;
export declare function vrf(publicKey: Buffer, privateKey: Buffer, message: Buffer): {
    proof: Buffer;
    value: Buffer;
};
export declare function verify(publicKey: Buffer, message: Buffer, proof: Buffer, value?: Buffer): boolean;
