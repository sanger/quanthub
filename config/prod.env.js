'use strict'
const merge = require('webpack-merge')
const privateConf = require('./private.conf.js')

module.exports = merge(privateConf.prod, {
  NODE_ENV: '"production"'
})
