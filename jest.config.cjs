module.exports = {
  preset: './node_modules/vite-jest/jest-preset.js',
  moduleFileExtensions: ['js', 'jsx', 'json', 'vue'],
  extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
  transform: {
    '^.+\\.vue$': '@vue/vue2-jest',
    '.+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$':
      'jest-transform-stub',
    // '^.+\\.jsx?$': 'babel-jest',
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  snapshotSerializers: ['jest-serializer-vue'],
  testMatch: [
    '**/tests/unit/**/*.spec.(js|jsx|ts|tsx)|**/__tests__/*.(js|jsx|ts|tsx)',
  ],
  testURL: 'http://localhost/',
  // testEnvironment: "jest-environment-jsdom"
}
