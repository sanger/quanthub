// For authoring Nightwatch tests, see
// http://nightwatchjs.org/guide#usage

// TODO: It seems difficult to have shared state in e2e tests.
var config = require('../../unit/jest.conf')
var fs = require('fs')

var getId = function (csv) {
  return csv[2].split(',')[0].split(': ')[1]
}

var filePath = function (dir) {
  return dir + '/test/data/plate_reader.csv'
}

// TODO: It would be better to use CsvFile component but can't seem to use es6 in Nightwatch tests.
var csv = function (path) {
  return fs.readFileSync(path, 'ascii').split('\n')
}

var id = ''

module.exports = {

  url: function (browser, path) {
    return browser.globals.devServerURL + '/#/' + path
  },

  beforeEach: function(browser) {
    id = getId(csv(filePath(config.rootDir)))
  },

  'upload page': function (browser) {

    browser
      .url(this.url(browser, 'upload'))
      .waitForElementVisible('#app', 5000)
      .assert.elementPresent('.upload')
      .assert.containsText('div', 'Upload')
      .end()
  },
 
  // TODO: add page elements.
  'upload file and check plate is stored in local storage': function (browser) {

    browser
      .url(this.url(browser, 'upload'))
      .waitForElementVisible('#app', 5000)
      .setValue('input[type="file"]', filePath(config.rootDir))
      .click('button[name=submit]')
      .pause(1000)
      .assert.containsText('.row > h3', id)
      .assert.elementCount('td', 384)
      .url(this.url(browser, 'plates'))
      .assert.elementCount('.plate', 1)
      .assert.containsText('.plate', id)
      .useXpath()
      .click("//a[text()='" + id + "']")
      .useCss()
      .pause(1000)
      .assert.containsText('.row > h3', id)
      .end()
  }

}
