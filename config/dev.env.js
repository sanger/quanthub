'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  QUANTESSENTIAL_BASE_URL: '"http://dev.psd.sanger.ac.uk:7330"'
})
