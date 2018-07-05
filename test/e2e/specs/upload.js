// For authoring Nightwatch tests, see
// http://nightwatchjs.org/guide#usage

// TODO: It seems difficult to have shared state in e2e tests.
var config = require('../../unit/jest.conf')
var fs = require('fs')

var getId = function (file, line = 2, delimiter = ',') {
  return file[line].split(delimiter)[0].split(': ')[1]
}

var filePath = function (dir, file) {
  return dir + '/test/data/' + file
}

// TODO: It would be better to use CsvFile component but can't seem to use es6 in Nightwatch tests.
var file = function (path, delimiter='\n') {
  return fs.readFileSync(path, 'ascii').split(delimiter)
}

var id = ''

module.exports = {

  url: function (browser, path) {
    return browser.globals.devServerURL + '/#/' + path
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
  'Plate Reader - upload file and check plate is stored in local storage': function (browser) {

    id = getId(file(filePath(config.rootDir, 'plate_reader.csv')))

    browser
      .url(this.url(browser, 'upload'))
      .waitForElementVisible('#app', 5000)
      .setValue('input[type="file"]', filePath(config.rootDir, 'plate_reader.csv'))
      .click('select[id="quant-type"] option[value="libraryPlateReader"]')
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
  },

  'qPCR - upload file and check plate is stored in local storage': function (browser) {

    id = getId(file(filePath(config.rootDir, 'qPCR.txt')), 0, '  ')

    browser
      .url(this.url(browser, 'upload'))
      .waitForElementVisible('#app', 5000)
      .setValue('input[type="file"]', filePath(config.rootDir, 'qPCR.txt'))
      .click('select[id="quant-type"] option[value="libraryQPCR"]')
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
