module.exports = {
  preset: 'ts-jest',
  testMatch: [
    `<rootDir>/src/**/*.(test).{js,jsx,ts,tsx}`,
    `<rootDir>/src/**/?(*.)(spec|test).{js,jsx,ts,tsx}`,
  ],
  setupFilesAfterEnv: ['jest-extended', './test/setEnvVars.js'],
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'js', 'json'],
  coverageReporters: ['lcov', 'text-summary'],
  collectCoverageFrom: ['src/**/*.ts'],
  coveragePathIgnorePatterns: ['/templates/', 'run.ts'],
  verbose: true,
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
    },
  },
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
}
