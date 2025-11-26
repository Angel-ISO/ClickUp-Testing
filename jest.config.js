export default {
  testEnvironment: 'node',
    reporters: [
    "default",
    [ "jest-junit", {
        outputDirectory: "reports/junit",
        outputName: "junit.xml"
      }
    ],
    [ "jest-html-reporters", {
        publicPath: "reports/html",
        filename: "ClickUp HTML Report.html",
        pageTitle: "ClickUp Testing - Test Report",
        expand: true,
        openReport: false,
        hideIcon: false,
        includeFailureMsg: true,
        includeSuiteFailure: true,
        includeConsoleLog: true,
        enableMergeData: true,
        dataMergeLevel: 2,
        inlineSource: true,
        customInfos: [
          {
            title: "Project",
            value: "ClickUp API Testing Framework"
          },
          {
            title: "Environment",
            value: process.env.NODE_ENV || "test"
          },
          {
            title: "Test Run Date",
            value: new Date().toLocaleString()
          }
        ]
      }
    ],
    [ "<rootDir>/core/reporters/jsonReporter.js", {
        outputPath: "reports/json/test-results.json"
      }
    ]
  ],
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

