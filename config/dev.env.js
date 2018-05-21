'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')
const privateConf = require('./private.conf.js')

module.exports = merge(prodEnv, privateConf.dev, {
  NODE_ENV: '"development"'
})
