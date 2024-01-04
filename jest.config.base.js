const os = require('os');

module.exports = {
  preset: "ts-jest",
  coverageDirectory: "<rootDir>/coverage/",
  coveragePathIgnorePatterns: [
    "<rootDir>/build/",
    "<rootDir>/dist/",
    "<rootDir>/node_modules/"
  ],
  testTimeout: 60000,
  maxWorkers: Math.ceil(os.cpus().length / 2),
  modulePaths: [
    "node_modules"
  ],
  testEnvironment: "node",
  setupFilesAfterEnv: [
    "jest-expect-message"
  ],
  collectCoverageFrom: [
    '**/src/**/*.ts',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/__tests__/**',
    '!src/**/*.spec.ts',
    '!**/test/**'
  ],
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50
  },
}
}