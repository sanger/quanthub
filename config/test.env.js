'use strict'
const merge = require('webpack-merge')
const devEnv = require('./dev.env')
const privateConf = require('./private.conf.js')

module.exports = merge(devEnv, privateConf.test, {
  NODE_ENV: '"testing"',
  browsers: ['Chrome', 'ChromeHeadless', 'ChromeHeadlessNoSandbox'],

  // you can define custom flags
  customLaunchers: {
    ChromeHeadlessNoSandbox: {
      base: 'ChromeHeadless',
      flags: ['--no-sandbox']
    }
  }
})
