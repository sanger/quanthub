'use strict'
const merge = require('webpack-merge')
const devEnv = require('./dev.env')

module.exports = merge(devEnv, {
  NODE_ENV: '"testing"',
  config.set({
      browsers: ['Chrome', 'ChromeHeadless', 'ChromeHeadlessNoSandbox'],

      // you can define custom flags
      customLaunchers: {
        ChromeHeadlessNoSandbox: {
          base: 'ChromeHeadless',
          flags: ['--no-sandbox']
        }
      }
    })
})
