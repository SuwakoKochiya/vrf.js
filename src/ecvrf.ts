import { BN } from 'bn.js';
import { Buffer } from 'buffer';
import { CO_FACTOR, G, LIMIT, N, N2, Q } from './constant';
import { ECP2OS, I2OSP, OS2ECP, OS2IP } from './convert';
import { expandSecret, generatePair, Point, reverseB, sha256 } from './utils';

function hashPoints(...args: Point[]) {
  const hash = args.reduce(
    (prev, curr) => prev.update(ECP2OS(curr)),
    sha256(),
  );
  return OS2IP(hash.digest().slice(0, N));
}

function decodeProof(proof: Buffer) {
  let pos = 0;
  const sign = proof[pos++];
  if (sign != 2 && sign != 3) {
    return;
  }
  const r = OS2ECP(proof.slice(pos, pos + N2));
  if (!r) {
    return;
  }
  pos += N2;
  const c = proof.slice(pos, pos + N);
  pos += N;
  const s = proof.slice(pos, pos + N2);
  return { r, c: OS2IP(c), s: OS2IP(s) };
}

function checkHash(proof: Buffer, hash: Buffer) {
  if (hash.length === N2 && proof.length > N2 + 1) {
    if (hash.equals(proofToHash(proof))) {
      return true;
    }
  }
  return false;
}

// apis

export function hashToCurve(m: Buffer, pk: Buffer): any {
  for (let i = 0; i < LIMIT; i++) {

    const ctr = I2OSP(new BN(i), 4);
    const digest = sha256()
      .update(m)
      .update(pk)
      .update(ctr)
      .digest();

    let point = OS2ECP(digest);
    if (point) {
      for (let j = 1; j < CO_FACTOR; j *= 2) {
        point = point.add(point);
      }
      return point;
    }
  }
  return null;
}

export function prove(pk: Buffer, sk: Buffer, m: Buffer) {
  const P1 = OS2ECP(pk);
  if (!P1) {
    return null;
  }

  const x1 = expandSecret(sk);
  const x = OS2IP(reverseB(x1));
  const h = hashToCurve(m, pk);
  const r = h.mul(x);

  const [kp, ks] = generatePair();

  const P2 = OS2ECP(kp);
  if (!P2) {
    return null;
  }

  const k = OS2IP(reverseB(expandSecret(ks)));
  const c = hashPoints(G, h, P1, r, P2, h.mul(k));
  const s = k.sub(c.mul(x).mod(Q));
  return Buffer.concat([ECP2OS(r), I2OSP(c, N), I2OSP(s, N2)]);
}

export function proofToHash(pi: Buffer) {
  return pi.slice(1, N2 + 1);
}

export function verify(
  pk: Buffer,
  m: Buffer,
  proof: Buffer,
  vrf?: Buffer,
) {
  if (vrf && !checkHash(proof, vrf)) {
    return false;
  }
  const o = decodeProof(proof);
  if (!o) {
    return false;
  }
  const P1 = OS2ECP(pk);
  if (!P1) {
    return false;
  }
  const u = P1.mul(o.c).add(G.mul(o.s));
  const h = hashToCurve(m, pk);
  const v = o.r.mul(o.c).add(h.mul(o.s));
  const c = hashPoints(G, h, P1, o.r, u, v);
  return c.eq(o.c);
}