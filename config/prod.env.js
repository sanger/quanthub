'use strict'
const privateConf = require('./private.conf.js')

module.exports = merge(privateConf.dev, {
  NODE_ENV: '"production"'
})
