// For authoring Nightwatch tests, see
// http://nightwatchjs.org/guide#usage

var config = require('../../unit/jest.conf')

module.exports = {

  url: function (browser) {
    return browser.globals.devServerURL + '/#/upload'
  },

  'upload page': function (browser) {

    browser
      .url(this.url(browser))
      .waitForElementVisible('#app', 5000)
      .assert.elementPresent('.upload')
      .assert.containsText('div', 'Upload')
      .end()
  },

  // 'upload file': function (browser) {

  //   browser
  //     .url(this.url(browser))
  //     .waitForElementVisible('#app', 5000)
  //     .waitForElementVisible('input[type="file"]', 1000)
  //     .setValue('input[type="file"]', config.rootDir + '/test/data/plate1.csv')
  //     .click('button[name=submit]')
  //     .pause(1000)
  //     .assert.containsText('h3', 'File Uploaded Successfully')
  //     .end()
  // }


}
