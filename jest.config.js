export default {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js', "<rootDir>/tests/Comments - Sofia Beltran/setupComments.js"],
  transform: {
    '^.+\\.js$': 'babel-jest'
  },
  transformIgnorePatterns: [
    'node_modules/(?!(dotenv)/)'
  ],
  testMatch: ['**/*.test.js'],
  collectCoverageFrom: [
    'bussines/**/*.js',
    'core/**/*.js',
    '!**/node_modules/**'
  ],
  coverageDirectory: 'coverage',
  verbose: true,
  testTimeout: 30000
};

