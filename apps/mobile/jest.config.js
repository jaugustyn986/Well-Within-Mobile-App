/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: '.',
  testMatch: ['<rootDir>/src/**/__tests__/**/*.test.ts'],
  modulePathIgnorePatterns: ['<rootDir>/node_modules/'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: { module: 'commonjs', esModuleInterop: true } }],
  },
  setupFiles: ['<rootDir>/jest.setup.js'],
  testTimeout: 10000,
};
