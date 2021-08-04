module.exports = {
  testMatch: [
    `<rootDir>/src/**/*.(test).{js,jsx,ts,tsx}`,
    `<rootDir>/src/**/?(*.)(spec|test).{js,jsx,ts,tsx}`,
  ],
  setupFilesAfterEnv: ['jest-extended'],
  transform: { '\\.ts$': 'ts-jest' },
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'js', 'json'],
  coverageReporters: ['lcov', 'text-summary'],
  collectCoverageFrom: ['src/**/*.ts'],
  coveragePathIgnorePatterns: ['/templates/'],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
}
