// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['**/src/**/*.js', '!**/src/main/**.js'],
  preset: '@shelf/jest-mongodb',
  watchPathIgnorePatterns: [
    '<rootDir>/node_modules'
  ]
}
