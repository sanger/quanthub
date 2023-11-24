module.exports = {
  roots: [
    "src/",
    "tests/"
  ],
  moduleFileExtensions: [
    "js",
    "json",
    "vue"
  ],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^@tests/(.*)$": "<rootDir>/tests/$1"
  },
  modulePaths: [
    "<rootDir>/tests/support/"
  ],
  transform: {
    "\\.[jt]sx?$": "babel-jest",
    "^.+\\.(vue)$": "@vue/vue2-jest"
  },
  transformIgnorePatterns: [
    "/!node_modules\\/lodash-es/"
  ],
  testEnvironmentOptions: {
    "url": "http://localhost/"
  },
  testEnvironment: "jsdom",   
}