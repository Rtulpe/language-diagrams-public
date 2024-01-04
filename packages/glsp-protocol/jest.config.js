const {
    maxWorkers,
    preset,
    modulePaths,
    testEnvironment,
    setupFilesAfterEnv,
  } = require("../../jest.config.base")
  module.exports = {
    setupFilesAfterEnv,
    preset,
    maxWorkers,
    testEnvironment,
    modulePaths: ["<rootDir>/src", ...modulePaths],
    roots: ["<rootDir>/test"],
  }