module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: './',
  roots: ['<rootDir>/src'],
  testMatch: ['**/*.test.ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{ts}',
    '!src/**/index.ts',
    '!src/**/types.ts',
    '!src/**/config/**',
  ],
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
  setupFilesAfterEnv: ['<rootDir>/test-utils/setupTests.ts'],
};
