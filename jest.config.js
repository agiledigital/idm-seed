const idm = require('./integration-tests/util/openidm-jest')
module.exports = {
  // runner: 'jest-runner-tsc',
  preset: 'ts-jest',
  testEnvironment: 'node',
  transformIgnorePatterns: [
    "node_modules/(?!(@agiledigital/idm-ts-types)/)"
  ],
  moduleNameMapper: {
    "^lib/(.*)": "<rootDir>/lib/$1"
  },
  globals: {
    openidm: idm.openidm
  },
  // transform: {
  //   "^.+\\.(ts|tsx)$": "./node_modules/ts-jest/preprocessor.js"
  // },
};