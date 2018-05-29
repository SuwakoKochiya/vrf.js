import { toArray, normalize, OS2IP, bufferReverse } from "./utils"
import { hashToCurve, expandSecret, ECP2OS, prove, proofToHash, verify, generatePair } from "./ecvrf"

function h2a(h) {
  return toArray(h, 'hex')
}
const m = h2a("6d657373616765")
const x = h2a("1fcce948db9fc312902d49745249cfd287de1a764fd48afb3cd0bdd0a8d74674885f642c8390293eb74d08cf38d3333771e9e319cfd12a21429eeff2eddeebd2")
const pk = h2a("885f642c8390293eb74d08cf38d3333771e9e319cfd12a21429eeff2eddeebd2")
const pi = h2a("037cb8261b7196c33a542e0341bd2a8463b6d49ff186371b310bc6413237491dac73589bb7cdbb40b5d5064e0c2787ea5f0e45d1ed1c8c6634aeab58159bdc236746d83e9504a4081ad6850d0cc2c06e04")
const v = h2a("7cb8261b7196c33a542e0341bd2a8463b6d49ff186371b310bc6413237491dac")

const h = hashToCurve(m, pk)
const x1 = expandSecret(normalize(x))
const r1 = h.mul(OS2IP(bufferReverse(x1)))
console.log('h: ', ECP2OS(h).toString('hex'))
console.log('x1:', OS2IP(x1).toString('hex'))
console.log('r1:', ECP2OS(r1).toString('hex'))

for (let i = 0; i < 1000; i++) {
  const r = [];
  r.push((i >>> 24) & 0xff)
  r.push((i >>> 16) & 0xff)
  r.push((i >>> 8) & 0xff)
  r.push(i & 0xff)
  const P = hashToCurve(r, pk)
  if (!P || P.isInfinity()) {
    console.log("not on curve", P)
    break
  }
}

const pi2 = prove(pk, x, m)
console.log('proof', pi2.toString('hex'), pi2.length)
const vrf = proofToHash(pi2)
console.log('test1', verify(pk, m, vrf, pi2))

for (let i = 0; i < 1000; i++) {
  const r = [];
  r.push((i >>> 24) & 0xff)
  r.push((i >>> 16) & 0xff)
  r.push((i >>> 8) & 0xff)
  r.push(i & 0xff)
  const [pub, priv] = generatePair()
  const pi2 = prove(pub, priv, r)
  if (pi2) {
    const vrf = proofToHash(pi2)
    if (verify(pub, r, vrf, pi2)) {
      console.log('success')
      break
    } else {
      console.log('fallure')
    }
  }
}


console.log('test2', verify(pk, m, v, pi))

