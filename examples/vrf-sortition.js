const Big = require('big.js')
const utils = require('./utils')
const constant = require('./const.json')
const log = utils.logger('sortition')
const vrfjs = require('../lib')

const seed = Buffer.from('sortition')
const role = Buffer.from('test')
const w = new Big(100)
const W = new Big(1000)
const tau = new Big(10)

for (let i = 0; i < 5; i++) {
  const [publicKey, privateKey] = vrfjs.utils.generatePair()
  const [value, proof, j] = vrfjs.sortition.sortition(privateKey, publicKey, seed, tau, role, w, W)
  log(`-------------- test ${i} --------------`)
  log(' value:', value.toString('hex'))
  log('     j:', j.toString())
  log('result:', j.gt(0))
}
