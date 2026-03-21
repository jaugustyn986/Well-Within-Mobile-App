/** @type {import('jest').Config} */
const path = require('path');

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: '.',
  testMatch: ['<rootDir>/src/**/__tests__/**/*.test.ts'],
  modulePathIgnorePatterns: ['<rootDir>/node_modules/'],
  moduleNameMapper: {
    '^core-rules-engine$': path.join(__dirname, '../../core/rulesEngine/src/index.ts'),
    '^core-rules-engine/fixtures/simple-peak.json$': path.join(
      __dirname,
      '../../core/rulesEngine/fixtures/simple-peak.json',
    ),
  },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: { module: 'commonjs', esModuleInterop: true } }],
  },
  setupFiles: ['<rootDir>/jest.setup.js'],
  testTimeout: 10000,
};
