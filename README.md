
<h1 align="center">
<img src="https://user-images.githubusercontent.com/5719833/43038622-34b064ea-8d4f-11e8-92ae-c5e060e5f1fc.png" width=220 />
</h1>

<p align="center">
A Javascript Implementation for Verifiable Random Functions
</p>

<p align="center">
  <a href="https://badge.fury.io/js/vrf.j">
    <img src="https://badge.fury.io/js/vrf.js.svg" />
  </a>
</p>

## Install

``` bash
$ yarn add vrf.js
```

## Usage

### ECVRF

``` javascript
const {utils, ecvrf, sortition} = require('vrf.js')
const X = Buffer.from('test')

const [publicKey, privateKey] = utils.generatePair()

const {value, proof} = ecvrf.vrf(publicKey, privateKey, X)

ecvrf.verify(publicKey, X, proof, value)
// true
```

### VRF Sortition

``` javascript
const {utils, ecvrf, sortition} = require('vrf.js')
const seed = Buffer.from('sortition')
const role = Buffer.from('test')
const w = utils.N(100)
const W = utils.N(1000)
const tau = utils.N(10)


const [publicKey, privateKey] = utils.generatePair()
const [value, proof, j] = sortition.sortition(
	privateKey, publicKey,
	seed, tau, role, w, W
)

if (+j > 0) {
	// next
}
```


[more examples](https://github.com/pinqy520/vrf.js/tree/master/examples)

## APIs

- utils.generatePair
- utils.B
- utils.N
- ecvrf.vrf
- ecvrf.prove
- ecvrf.verify
- ecvrf.proofToHash
- ecvrf.hashToCurve
- sortition.sortition
- sortition.verifySort

## TODOs

- [ ] browser support
- [ ] web examples
- [ ] visualization