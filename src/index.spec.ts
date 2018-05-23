import { ECVRF_hash_to_curve, verify } from ".";

function h2a(h) {
  var a = [];
  while (h.length >= 2) {
    a.push(parseInt(h.substring(0, 2), 16));
    h = h.substring(2, h.length);
  }
  return a;
}
var m = h2a("6d657373616765");
var x = h2a("1fcce948db9fc312902d49745249cfd287de1a764fd48afb3cd0bdd0a8d74674885f642c8390293eb74d08cf38d3333771e9e319cfd12a21429eeff2eddeebd2");
var pk = h2a("885f642c8390293eb74d08cf38d3333771e9e319cfd12a21429eeff2eddeebd2");
var pi = h2a("037cb8261b7196c33a542e0341bd2a8463b6d49ff186371b310bc6413237491dac73589bb7cdbb40b5d5064e0c2787ea5f0e45d1ed1c8c6634aeab58159bdc236746d83e9504a4081ad6850d0cc2c06e04");
var v = h2a("7cb8261b7196c33a542e0341bd2a8463b6d49ff186371b310bc6413237491dac");

for (let i = 0; i < 1000; i++) {
  var r = [];
  r.push((i >>> 24) & 0xff)
  r.push((i >>> 16) & 0xff)
  r.push((i >>> 8) & 0xff)
  r.push(i & 0xff)
  const P = ECVRF_hash_to_curve(r, pk)
  if (P.isInfinity()) {
    console.log("not on curve", P)
    break
  }
}

console.log(verify(pk, m, v, pi));