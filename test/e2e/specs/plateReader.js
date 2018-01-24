// For authoring Nightwatch tests, see
// http://nightwatchjs.org/guide#usage

module.exports = {
  'Plate Reader tests': function (browser) {
    // automatically uses dev Server port from /config.index.js
    // default: http://localhost:8080
    // see nightwatch.conf.js
    const devServer = browser.globals.devServerURL

    browser
      .url(devServer + '#/plate-reader')
      .waitForElementVisible('#app', 5000)
      .assert.elementPresent('.plate-reader')
      .assert.containsText('h1', 'Plate Reader')
      .end()
  }
}
