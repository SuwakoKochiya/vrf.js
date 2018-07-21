const constant = require('./const.json')

module.exports.logger = name => (...args) => {
  console.log(`[${name}]\t`, ...args)
}

module.exports.pair = {
  publicKey: Buffer.from(constant.pk, 'hex'),
  privateKey: Buffer.from(constant.sk, 'hex')
}