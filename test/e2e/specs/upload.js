// For authoring Nightwatch tests, see
// http://nightwatchjs.org/guide#usage

var config = require('../../unit/jest.conf')
var fs = require('fs')

module.exports = {

  url: function (browser) {
    return browser.globals.devServerURL + '/#/upload'
  },

  filePath: function () {
    return config.rootDir + '/test/data/plate1.csv'
  },

  csv: function () {
    return fs.readFileSync(config.rootDir + '/test/data/plate1.csv', 'ascii').split('\n')
  },

  'upload page': function (browser) {

    browser
      .url(this.url(browser))
      .waitForElementVisible('#app', 5000)
      .assert.elementPresent('.upload')
      .assert.containsText('div', 'Upload')
      .end()
  },
 
  'upload file': function (browser) {

    browser
      .url(this.url(browser))
      .waitForElementVisible('#app', 5000)
      .waitForElementVisible('input[type="file"]', 1000)
      .setValue('input[type="file"]', this.filePath())
      .click('button[name=submit]')
      .pause(1000)
      // TODO: It would be better to use CsvFile component but can't seem to use es6 in Nightwatch tests.
      .assert.containsText('h3', this.csv()[6].split(',')[0].split(': ')[1])
      .assert.elementCount('td', this.csv().length - 11)
      .end()
  }

}
