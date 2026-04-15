/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverageFrom: ['src/**/*.ts'],
  coveragePathIgnorePatterns: ['/node_modules/', '/src/multiCycle\\.ts$'],
  // Tiered global gates: lines/statements at 95%; functions 100%; branches lower (harder to max).
  coverageThreshold: {
    global: {
      branches: 88,
      functions: 100,
      lines: 95,
      statements: 95
    }
  }
};
