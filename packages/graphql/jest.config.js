/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: 'src',
  coverageDirectory: '../coverage',
  coverageReporters: ['html', 'json-summary', 'text']
}
