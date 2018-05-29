import * as crypto from "crypto"
import * as elliptic from 'elliptic'
import { BN, BNObject } from 'bn.js'
import { ArrayOrBuffer, Point, normalize, sha256, sha512, S2OS, I2OSP, OS2IP, bufferReverse, concatBuffer, toArray } from "./utils"
const eddsa = new elliptic.eddsa('ed25519')

const N2 = 32
const N = N2 / 2
const LIMIT = 100
const COFACTOR = 8
const g = eddsa.curve.g as Point
const q = eddsa.curve.n

// utils 

export function OS2ECP(os: ArrayOrBuffer) {
  const b = toArray(os, 16)
  try {
    return eddsa.decodePoint(b) as Point
  } catch (e) { }
  return null
}

export function ECP2OS(P: Point) {
  return S2OS(eddsa.encodePoint(P))
}

export function expandSecret(sk: Buffer) {
  const secret = sha512().update(sk.slice(0, 32)).digest()
  secret[0] &= 248
  secret[31] &= 127
  secret[31] |= 64
  return secret.slice(0, 32)
}

export function generatePair() {
  const sec = elliptic.rand(32)
  const pair = eddsa.keyFromSecret(sec)
  const publicKey = pair.getPublic('hex') as string
  const privateKey = pair.getSecret('hex') as string + publicKey
  return [toArray(publicKey, 'hex'), toArray(privateKey, 'hex')]
}


// private

function _verify(pk: ArrayOrBuffer, pi: ArrayOrBuffer, m: ArrayOrBuffer) {
  const o = decodeProof(pi)
  if (!o) return false
  const P1 = OS2ECP(pk)
  if (!P1) return false
  const u = P1.mul(o.c).add(g.mul(o.s))
  const h = hashToCurve(m, pk)
  const v = o.r.mul(o.c).add(h.mul(o.s))
  const c = hashPoints(
    g, h,
    P1,
    o.r,
    u,
    v)
  return c.eq(o.c)
}

// apis

export function hashToCurve(m: ArrayOrBuffer, pk: ArrayOrBuffer) {
  for (let i = 0; i < LIMIT; i++) {

    const ctr = I2OSP(new BN(i), 4)
    const digest = sha256()
      .update(normalize(m))
      .update(normalize(pk))
      .update(normalize(ctr))
      .digest()

    let point = OS2ECP(digest)
    if (point) {
      for (let j = 1; j < COFACTOR; j *= 2)
        point = point.add(point)
      return point
    }
  }
  return null
}


export function hashPoints(...args: Point[]) {
  const hash = args.reduce(
    (prev, curr) => prev.update(ECP2OS(curr)),
    sha256()
  )
  return OS2IP(hash.digest().slice(0, N))
}

export function decodeProof(proof: ArrayOrBuffer) {
  let pos = 0
  const sign = proof[pos++]
  if (sign != 2 && sign != 3) return
  const r = OS2ECP(proof.slice(pos, pos + N2))
  if (!r) return
  pos += N2
  const c = proof.slice(pos, pos + N)
  pos += N;
  const s = proof.slice(pos, pos + N2)
  return { r, c: OS2IP(c), s: OS2IP(s) }
}

export function prove(pk: ArrayOrBuffer, sk: ArrayOrBuffer, m: ArrayOrBuffer) {
  const P1 = OS2ECP(pk)
  if (!P1) return null

  const x1 = expandSecret(normalize(sk))
  const x = OS2IP(bufferReverse(x1))
  const h = hashToCurve(m, pk)
  const r = h.mul(x)

  const [kp, ks] = generatePair()

  const P2 = OS2ECP(kp)
  if (!P2) return null

  const k = OS2IP(bufferReverse(
    expandSecret(normalize(ks))
  ))

  const c = hashPoints(
    g, h,
    P1,
    r,
    P2,
    h.mul(k)
  )

  const s = k.sub(c.mul(x).mod(q))
  return concatBuffer(ECP2OS(r), I2OSP(c, N), I2OSP(s, N2))
}

export function proofToHash(pi: ArrayOrBuffer) {
  return normalize(pi.slice(1, N2 + 1))
}

export function verify(pk: ArrayOrBuffer, m: ArrayOrBuffer, vrf: ArrayOrBuffer, proof: ArrayOrBuffer) {
  if (vrf.length === N2 && proof.length > N2 + 1) {
    for (let i = 0; i < vrf.length; i++) {
      if (vrf[i] !== proof[i + 1])
        return false
    }
    return _verify(pk, proof, m)
  }
  return false
}