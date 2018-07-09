"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ecvrf_1 = require("./ecvrf");
const utils_1 = require("./utils");
function h2a(h) {
    return utils_1.toArray(h, 'hex');
}
const m = h2a('6d657373616765');
const x = h2a('1fcce948db9fc312902d49745249cfd287de1a764fd48afb3cd0bdd0a8d74674885f642c8390293eb74d08cf38d3333771e9e319cfd12a21429eeff2eddeebd2');
const pk = h2a('885f642c8390293eb74d08cf38d3333771e9e319cfd12a21429eeff2eddeebd2');
const pi = h2a('037cb8261b7196c33a542e0341bd2a8463b6d49ff186371b310bc6413237491dac73589bb7cdbb40b5d5064e0c2787ea5f0e45d1ed1c8c6634aeab58159bdc236746d83e9504a4081ad6850d0cc2c06e04');
const v = h2a('7cb8261b7196c33a542e0341bd2a8463b6d49ff186371b310bc6413237491dac');
const h = ecvrf_1.hashToCurve(m, pk);
const x1 = ecvrf_1.expandSecret(utils_1.B(x));
const r1 = h.mul(utils_1.OS2IP(utils_1.bufferReverse(x1)));
console.log('h: ', ecvrf_1.ECP2OS(h).toString('hex'));
console.log('x1:', utils_1.OS2IP(x1).toString('hex'));
console.log('r1:', ecvrf_1.ECP2OS(r1).toString('hex'));
for (let i = 0; i < 1000; i++) {
    const r = [];
    r.push((i >>> 24) & 0xff);
    r.push((i >>> 16) & 0xff);
    r.push((i >>> 8) & 0xff);
    r.push(i & 0xff);
    const P = ecvrf_1.hashToCurve(r, pk);
    if (!P || P.isInfinity()) {
        console.log('not on curve', P);
        break;
    }
}
const pi2 = ecvrf_1.prove(pk, x, m);
console.log('proof', pi2.toString('hex'), pi2.length);
const vrf = ecvrf_1.proofToHash(pi2);
console.log('test1', ecvrf_1.verify(pk, m, vrf, pi2));
for (let i = 0; i < 1000; i++) {
    const r = [];
    r.push((i >>> 24) & 0xff);
    r.push((i >>> 16) & 0xff);
    r.push((i >>> 8) & 0xff);
    r.push(i & 0xff);
    const [pub, priv] = ecvrf_1.generatePair();
    const pi2 = ecvrf_1.prove(pub, priv, r);
    if (pi2) {
        const vrf = ecvrf_1.proofToHash(pi2);
        if (ecvrf_1.verify(pub, r, vrf, pi2)) {
            console.log('success');
            break;
        }
        else {
            console.log('fallure');
        }
    }
}
console.log('test2', ecvrf_1.verify(pk, m, v, pi));
