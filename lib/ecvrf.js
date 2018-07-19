"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bn_js_1 = require("bn.js");
const buffer_1 = require("buffer");
const constant_1 = require("./constant");
const convert_1 = require("./convert");
const utils_1 = require("./utils");
function hashPoints(...args) {
    const hash = args.reduce((prev, curr) => prev.update(convert_1.ECP2OS(curr)), utils_1.sha256());
    return convert_1.OS2IP(hash.digest().slice(0, constant_1.N));
}
function decodeProof(proof) {
    let pos = 0;
    const sign = proof[pos++];
    if (sign != 2 && sign != 3) {
        return;
    }
    const r = convert_1.OS2ECP(proof.slice(pos, pos + constant_1.N2));
    if (!r) {
        return;
    }
    pos += constant_1.N2;
    const c = proof.slice(pos, pos + constant_1.N);
    pos += constant_1.N;
    const s = proof.slice(pos, pos + constant_1.N2);
    return { r, c: convert_1.OS2IP(c), s: convert_1.OS2IP(s) };
}
function checkHash(proof, value) {
    if (value.length === constant_1.N2 && proof.length > constant_1.N2 + 1) {
        if (value.equals(proofToHash(proof))) {
            return true;
        }
    }
    return false;
}
// APIs
function hashToCurve(message, publicKey) {
    for (let i = 0; i < constant_1.LIMIT; i++) {
        const ctr = convert_1.I2OSP(new bn_js_1.BN(i), 4);
        const digest = utils_1.sha256()
            .update(message)
            .update(publicKey)
            .update(ctr)
            .digest();
        let point = convert_1.OS2ECP(digest);
        if (point) {
            for (let j = 1; j < constant_1.CO_FACTOR; j *= 2) {
                point = point.add(point);
            }
            return point;
        }
    }
    return null;
}
exports.hashToCurve = hashToCurve;
function prove(publicKey, privateKey, message) {
    const P1 = convert_1.OS2ECP(publicKey);
    if (!P1) {
        return null;
    }
    const x1 = utils_1.expandSecret(privateKey);
    const x = convert_1.OS2IP(utils_1.reverseB(x1));
    const h = hashToCurve(message, publicKey);
    const r = h.mul(x);
    const [kp, ks] = utils_1.generatePair();
    const P2 = convert_1.OS2ECP(kp);
    if (!P2) {
        return null;
    }
    const k = convert_1.OS2IP(utils_1.reverseB(utils_1.expandSecret(ks)));
    const c = hashPoints(constant_1.G, h, P1, r, P2, h.mul(k));
    const s = k.sub(c.mul(x).mod(constant_1.Q));
    return buffer_1.Buffer.concat([convert_1.ECP2OS(r), convert_1.I2OSP(c, constant_1.N), convert_1.I2OSP(s, constant_1.N2)]);
}
exports.prove = prove;
function proofToHash(proof) {
    return proof.slice(1, constant_1.N2 + 1);
}
exports.proofToHash = proofToHash;
function vrf(publicKey, privateKey, message) {
    const proof = prove(publicKey, privateKey, message);
    const value = proofToHash(proof);
    return { proof, value };
}
exports.vrf = vrf;
function verify(publicKey, message, proof, value) {
    if (value && !checkHash(proof, value)) {
        return false;
    }
    const o = decodeProof(proof);
    if (!o) {
        return false;
    }
    const P1 = convert_1.OS2ECP(publicKey);
    if (!P1) {
        return false;
    }
    const u = P1.mul(o.c).add(constant_1.G.mul(o.s));
    const h = hashToCurve(message, publicKey);
    const v = o.r.mul(o.c).add(h.mul(o.s));
    const c = hashPoints(constant_1.G, h, P1, o.r, u, v);
    return c.eq(o.c);
}
exports.verify = verify;
