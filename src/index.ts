import * as crypto from "crypto"
import * as elliptic from 'elliptic'
import { BN, BNObject } from 'bn.js'
const eddsa = new elliptic.eddsa('ed25519')

const N2 = 32
const N = N2 / 2
const LIMIT = 100
const COFACTOR = 8

export type Point = elliptic.curve.edwards.Point

export type ArrayOrBuffer = Buffer | number[] | Uint8Array

const sha256 = () => crypto.createHash('sha256')
const sha512 = () => crypto.createHash('sha512')

function OS2ECP(os: ArrayOrBuffer) {
  const b = elliptic.utils.toArray(os, 16)
  try {
    return eddsa.decodePoint(b) as Point
  } catch (e) { }
  return null
}

export function ECP2OS(P: Point) {
  return S2OS(eddsa.encodePoint(P))
}

function S2OS(os: number[]) {
  const sign = os[31] >>> 7
  os.unshift(sign + 2)
  return normalize(os)
}

export function OS2IP(os: ArrayOrBuffer) {
  return new BN(os as any)
}

function I2OSP(i: BNObject, len?: number) {
  return i.toArray('be', len)
}

export function normalize(data: any) {
  return new Buffer(data)
}

function ECVRF_hash_to_curve(m: ArrayOrBuffer, pk: ArrayOrBuffer) {
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


function ECVRF_hash_points(...args: Point[]) {
  const hash = args.reduce(
    (prev, curr) => prev.update(ECP2OS(curr)),
    sha256()
  )
  return OS2IP(hash.digest().slice(0, N))
}

function ECVRF_decode_proof(proof: ArrayOrBuffer) {
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

const g = eddsa.curve.g as Point
const q = eddsa.curve.n

export function ECVRF_verify(pk: ArrayOrBuffer, pi: ArrayOrBuffer, m: ArrayOrBuffer) {
  const o = ECVRF_decode_proof(pi)
  if (!o) return false
  const P1 = OS2ECP(pk)
  if (!P1) return false
  const u = P1.mul(o.c).add(g.mul(o.s))
  const h = ECVRF_hash_to_curve(m, pk)
  const v = o.r.mul(o.c).add(h.mul(o.s))
  const c = ECVRF_hash_points(
    g, h,
    P1,
    o.r,
    u,
    v)
  return c.eq(o.c)
}

function concatBuffer(...args: ArrayOrBuffer[]) {
  const arr = args.reduce<number[]>((prev, curr) => prev.concat(elliptic.utils.toArray(curr, 16)), [])
  return new Buffer(arr)
}

export function bufferReverse(buffer: Buffer) {
  return new Buffer(buffer).reverse()
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
  return [elliptic.utils.toArray(publicKey, 'hex'), elliptic.utils.toArray(privateKey, 'hex')]
}

export function ECVRF_prove(pk: ArrayOrBuffer, sk: ArrayOrBuffer, m: ArrayOrBuffer) {
  const P1 = OS2ECP(pk)
  if (!P1) return null
  const x1 = expandSecret(normalize(sk))
  const x = OS2IP(bufferReverse(x1))
  const h = ECVRF_hash_to_curve(m, pk)
  const r = h.mul(x)

  const [kp, ks] = generatePair()

  const P2 = OS2ECP(kp)
  if (!P2) return null

  const k = OS2IP(bufferReverse(
    expandSecret(normalize(ks))
  ))

  const c = ECVRF_hash_points(
    g, h,
    P1,
    r,
    P2,
    h.mul(k)
  )

  const s = k.sub(c.mul(x).mod(q))
  return concatBuffer(ECP2OS(r), I2OSP(c, N), I2OSP(s, N2))
}

export function verify(pk: ArrayOrBuffer, m: ArrayOrBuffer, vrf: ArrayOrBuffer, proof: ArrayOrBuffer) {
  if (vrf.length === N2 && proof.length > N2 + 1) {
    for (let i = 0; i < vrf.length; i++) {
      if (vrf[i] !== proof[i + 1])
        return false
    }
    return ECVRF_verify(pk, proof, m)
  }
  return false
}

export function hashToCurve(m: ArrayOrBuffer, pk: ArrayOrBuffer) {
  return ECVRF_hash_to_curve(m, pk)
}

export function prove(pk: ArrayOrBuffer, sk: ArrayOrBuffer, m: ArrayOrBuffer) {
  return ECVRF_prove(pk, sk, m)
}