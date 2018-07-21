
<img src="https://user-images.githubusercontent.com/5719833/43038572-43f2fa40-8d4e-11e8-966f-76532d296d8c.png" width=120 />

A Javascript Implementation for Verifiable Random Functions

[![npm version](https://badge.fury.io/js/vrf.js.svg)](https://badge.fury.io/js/vrf.js)

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

``` javascrpt
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