const utils = require('./utils')
const constant = require('./const.json')
const log = utils.logger('verification')
const vrfjs = require('../lib')

const x = Buffer.from(constant.message)
const value = Buffer.from(constant.value, 'hex')
const proof = Buffer.from(constant.proof, 'hex')
const {publicKey} = utils.pair

log('x:')
log(x.toString('hex'))
log('value:')
log(value.toString('hex'))
log('proof:')
log(proof.toString('hex'))
log('publicKey:')
log(publicKey.toString('hex'))
log('result:', vrfjs.ecvrf.verify(publicKey, x, proof, value))
