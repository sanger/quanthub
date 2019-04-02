// For authoring Nightwatch tests, see
// http://nightwatchjs.org/guide#usage
var fs = require('fs')

var url = function (path) {
  return process.env.VUE_DEV_SERVER_URL + '/#/' + path
}

var getId = function (file, line = 2, delimiter = ',') {
  return file[line].split(delimiter)[0].split(': ')[1].split('-')[0]
}

var filePath = function (file) {
  return process.cwd() + '/tests/data/' + file
}

var file = function (path, delimiter='\n') {
  return fs.readFileSync(path, 'ascii').split(delimiter)
}

var id = ''

module.exports = {

  'upload page': browser => {

    browser
      .url(url('upload'))
      .waitForElementVisible('#app', 5000)
      .assert.elementPresent('.upload')
      .assert.containsText('div', 'Upload')
      .end()
  },
 
  'Plate Reader - upload file and check plate is stored in local storage': browser => {

    id = getId(file(filePath('plate_reader.csv')))

    browser
      .url(url('upload'))
      .waitForElementVisible('#app', 5000)
      .setValue('input[type="file"]', filePath('plate_reader.csv'))
      .click('select[id="quant-type"] option[value="libraryPlateReader"]')
      .click('button[name=submit]')
      .pause(1000)
      .assert.containsText('.row > h3', id)
      .assert.elementCount('td', 384)
      .url(url('plates'))
      .assert.elementCount('.plate', 1)
      .assert.containsText('.plate', id)
      .useXpath()
      .click("//a[text()='" + id + "']")
      .useCss()
      .pause(1000)
      .assert.containsText('.row > h3', id)
      .end()
  },

  'qPCR - 10ul - upload file and check plate is stored in local storage': browser => {

    id = getId(file(filePath('qPCR.txt')), 0, '  ')

    browser
      .url(url('upload'))
      .waitForElementVisible('#app', 5000)
      .setValue('input[type="file"]', filePath('qPCR.txt'))
      .click('select[id="quant-type"] option[value="libraryQPCR10ul"]')
      .click('button[name=submit]')
      .pause(1000)
      .assert.containsText('.row > h3', id)
      .assert.elementCount('td', 384)
      .url(url('plates'))
      .assert.elementCount('.plate', 1)
      .assert.containsText('.plate', id)
      .useXpath()
      .click("//a[text()='" + id + "']")
      .useCss()
      .pause(1000)
      .assert.containsText('.row > h3', id)
      .end()
  },

  'qPCR - 5ul - upload file and check plate is stored in local storage': browser => {

    id = getId(file(filePath('qPCR.txt')), 0, '  ')

    browser
      .url(url('upload'))
      .waitForElementVisible('#app', 5000)
      .setValue('input[type="file"]', filePath('DN123456_DN123456-QC_XYZ_results.csv'))
      .click('select[id="quant-type"] option[value="libraryQPCR5ul"]')
      .click('button[name=submit]')
      .pause(1000)
      .assert.containsText('.row > h3', 'DN123456')
      .assert.elementCount('td', 384)
      .url(url('plates'))
      .assert.elementCount('.plate', 1)
      .assert.containsText('.plate', 'DN123456')
      .useXpath()
      .click("//a[text()='" + 'DN123456' + "']")
      .useCss()
      .pause(1000)
      .assert.containsText('.row > h3', 'DN123456')
      .end()
  }
}
