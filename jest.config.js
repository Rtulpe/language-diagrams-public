const {
  testTimeout,
  maxWorkers,
  preset,
  coverageDirectory,
  testEnvironment,
  collectCoverageFrom,
} = require("./jest.config.base")

module.exports = {
  // we can't use spread for the config, so we need to manually add the properties to our config from base.
  testTimeout,
  preset,
  coverageDirectory,
  testEnvironment,
  collectCoverageFrom,
  maxWorkers,
  projects: ["<rootDir>/packages/*"],

  // https://github.com/facebook/jest/issues/9628
  runner: "groups",
}