"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const elliptic = require("elliptic");
const bn_js_1 = require("bn.js");
const utils_1 = require("./utils");
const eddsa = new elliptic.eddsa('ed25519');
const N2 = 32;
const N = N2 / 2;
const LIMIT = 100;
const COFACTOR = 8;
const g = eddsa.curve.g;
const q = eddsa.curve.n;
// utils 
function OS2ECP(os) {
    const b = utils_1.toArray(os, 16);
    try {
        return eddsa.decodePoint(b);
    }
    catch (e) { }
    return null;
}
exports.OS2ECP = OS2ECP;
function ECP2OS(P) {
    return utils_1.S2OS(eddsa.encodePoint(P));
}
exports.ECP2OS = ECP2OS;
function expandSecret(sk) {
    const secret = utils_1.sha512().update(sk.slice(0, 32)).digest();
    secret[0] &= 248;
    secret[31] &= 127;
    secret[31] |= 64;
    return secret.slice(0, 32);
}
exports.expandSecret = expandSecret;
function generatePair() {
    const sec = elliptic.rand(32);
    const pair = eddsa.keyFromSecret(sec);
    const publicKey = pair.getPublic('hex');
    const privateKey = pair.getSecret('hex') + publicKey;
    return [utils_1.toArray(publicKey, 'hex'), utils_1.toArray(privateKey, 'hex')];
}
exports.generatePair = generatePair;
// private
function _verify(pk, pi, m) {
    const o = decodeProof(pi);
    if (!o)
        return false;
    const P1 = OS2ECP(pk);
    if (!P1)
        return false;
    const u = P1.mul(o.c).add(g.mul(o.s));
    const h = hashToCurve(m, pk);
    const v = o.r.mul(o.c).add(h.mul(o.s));
    const c = hashPoints(g, h, P1, o.r, u, v);
    return c.eq(o.c);
}
// apis
function hashToCurve(m, pk) {
    for (let i = 0; i < LIMIT; i++) {
        const ctr = utils_1.I2OSP(new bn_js_1.BN(i), 4);
        const digest = utils_1.sha256()
            .update(utils_1.normalize(m))
            .update(utils_1.normalize(pk))
            .update(utils_1.normalize(ctr))
            .digest();
        let point = OS2ECP(digest);
        if (point) {
            for (let j = 1; j < COFACTOR; j *= 2)
                point = point.add(point);
            return point;
        }
    }
    return null;
}
exports.hashToCurve = hashToCurve;
function hashPoints(...args) {
    const hash = args.reduce((prev, curr) => prev.update(ECP2OS(curr)), utils_1.sha256());
    return utils_1.OS2IP(hash.digest().slice(0, N));
}
exports.hashPoints = hashPoints;
function decodeProof(proof) {
    let pos = 0;
    const sign = proof[pos++];
    if (sign != 2 && sign != 3)
        return;
    const r = OS2ECP(proof.slice(pos, pos + N2));
    if (!r)
        return;
    pos += N2;
    const c = proof.slice(pos, pos + N);
    pos += N;
    const s = proof.slice(pos, pos + N2);
    return { r, c: utils_1.OS2IP(c), s: utils_1.OS2IP(s) };
}
exports.decodeProof = decodeProof;
function prove(pk, sk, m) {
    const P1 = OS2ECP(pk);
    if (!P1)
        return null;
    const x1 = expandSecret(utils_1.normalize(sk));
    const x = utils_1.OS2IP(utils_1.bufferReverse(x1));
    const h = hashToCurve(m, pk);
    const r = h.mul(x);
    const [kp, ks] = generatePair();
    const P2 = OS2ECP(kp);
    if (!P2)
        return null;
    const k = utils_1.OS2IP(utils_1.bufferReverse(expandSecret(utils_1.normalize(ks))));
    const c = hashPoints(g, h, P1, r, P2, h.mul(k));
    const s = k.sub(c.mul(x).mod(q));
    return utils_1.concatBuffer(ECP2OS(r), utils_1.I2OSP(c, N), utils_1.I2OSP(s, N2));
}
exports.prove = prove;
function proofToHash(pi) {
    return utils_1.normalize(pi.slice(1, N2 + 1));
}
exports.proofToHash = proofToHash;
function verify(pk, m, vrf, proof) {
    if (vrf.length === N2 && proof.length > N2 + 1) {
        for (let i = 0; i < vrf.length; i++) {
            if (vrf[i] !== proof[i + 1])
                return false;
        }
        return _verify(pk, proof, m);
    }
    return false;
}
exports.verify = verify;
