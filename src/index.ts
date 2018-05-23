import * as crypto from "crypto"
import * as elliptic from 'elliptic'
import { BN, BNObject } from "bn.js";
const ec = new elliptic.ec("ed25519")


const sha256 = () => crypto.createHash("sha256")
const N2 = 32
const N = N2 / 2
const limit = 100
const cofactor = 8


function OS2ECP(os, sign) {
  const b = os.slice()
  // if (sign !== undefined)
  //   b[31] = (sign << 7) | (b[31] & 0x7f)
  try {
    const point = pointFromByteArray(b)
    // console.log(ECP2OS(point).equals(b))
    return point
  } catch (e) {
  }
  return null;
}

function ECP2OS(P) {
  var os = pointToByteArray(P)
  var sign = os[31] >>> 7
  os.unshift(sign + 2)
  return new Buffer(os)
}

function OS2IP(os) {
  return new BN(os)
}

function pointFromByteArray(p: Buffer) {
  const bytes = elliptic.utils.toArray(p, void 0)
  var lastIx = bytes.length - 1;
  var normed = bytes.slice(0, lastIx).concat(bytes[lastIx] & ~0x80);
  var xIsOdd = (bytes[lastIx] & 0x80) !== 0;
  var y = elliptic.utils.intFromLE(normed);
  return (ec.curve as any).pointFromY(y, xIsOdd);
}

function pointToByteArray(point: any) {
  var enc = point.getY().toArray('le', N2)
  enc[N2 - 1] |= point.getX().isOdd() ? 0x80 : 0
  return enc as number[]
}


export function ECVRF_hash_to_curve(m, pk) {
  for (var i = 0; i < limit; i++) {
    var ctr = [i]
    for (var n = 4 - ctr.length; --n >= 0;) {
      ctr.unshift(0)
    }
    const digest = sha256()
      .update(new Buffer(m))
      .update(new Buffer(pk))
      .update(new Buffer(ctr))
      .digest()
    // console.log(digest)
    let P = OS2ECP(digest, void 0)
    if (P) {
      // assume cofactor is 2^n
      for (var j = 1; j < cofactor; j *= 2)
        P = P.add(P)
      return P
    }
  }
  // should not reach here
  throw new Error("couldn't make a point on curve")
}


function ECVRF_hash_points(...args: any[]) {
  let h = sha256()
  for (var i = 0; i < args.length; i++) {
    const buf = ECP2OS(args[i])
    console.log(buf[0], i)
    h = h.update(buf);
  }
  return OS2IP(h.digest().slice(0, N))
}

function ECVRF_decode_proof(pi) {
  var i = 0;
  var sign = pi[i++];
  var r, c, s;
  if (sign != 2 && sign != 3)
    return
  if (!(r = OS2ECP(pi.slice(i, i + N2), sign - 2)))
    return
  i += N2;
  c = pi.slice(i, i + N)
  i += N;
  s = pi.slice(i, i + N2)
  return { r: r, c: OS2IP(c), s: OS2IP(s) }
}

const B = (ec.curve as any).g

function ECVRF_verify(pk, pi, m) {
  const o = ECVRF_decode_proof(pi) // 没问题 
  if (!o)
    return false
  const P = OS2ECP(pk, pk[31] >>> 7) // pass
  if (!P)
    return false
  // u = (g^x)^c * g^s = P^c * g^s
  const u = P.mul(o.c).add(B.mul(o.s)) // pass 
  const h = ECVRF_hash_to_curve(m, pk) // 没问题
  // v = gamma^c * h^s
  const v = o.r.mul(o.c).add(h.mul(o.s)) // pass 
  // console.log(pointToByteArray(v)) // pass 
  // c' = ECVRF_hash_points(g, h, g^x, gamma, u, v)
  // console.log(pointToByteArray(B))
  const c = ECVRF_hash_points(B, h, P, o.r, u, v)
  console.log(c, o.c)
  return c.eq(o.c)
}

export function verify(pk, m, vrf, proof) {
  if (!(vrf.length == N2 && proof.length > N2 + 1 && vrf.every(function (v, i) { return v === proof[i + 1] })))
    return false
  return ECVRF_verify(pk, proof, m)
}