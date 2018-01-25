// For authoring Nightwatch tests, see
// http://nightwatchjs.org/guide#usage

module.exports = {
  'Plate tests': function (browser) {
    // automatically uses dev Server port from /config.index.js
    // default: http://localhost:8080
    // see nightwatch.conf.js
    const devServer = browser.globals.devServerURL

    browser
      .url(devServer + '#/plate')
      .waitForElementVisible('#app', 5000)
      .assert.elementPresent('.plate')
      .assert.containsText('h1', 'Plate')
      .end()
  }
}
