const utils = require('./utils')
const log = utils.logger('val & proof')
const vrfjs = require('../lib')

const {publicKey, privateKey} = utils.pair
const m1 = Buffer.from('Message No.1')
const m2 = Buffer.from('Message No.2')

const r1 = vrfjs.ecvrf.vrf(publicKey, privateKey, m1)
const r2 = vrfjs.ecvrf.vrf(publicKey, privateKey, m2)

log(`value of "${m1}":`)
log(r1.value.toString('hex'))
log(`proof of "${m1}":`)
log(r1.proof.toString('hex'))
log(`value of "${m2}":`)
log(r2.value.toString('hex'))
log(`proof of "${m2}":`)
log(r2.proof.toString('hex'))