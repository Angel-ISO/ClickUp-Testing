import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class JSONReporter {
  constructor(globalConfig, options) {
    this._globalConfig = globalConfig;
    this._options = options || {};
  }

  onRunComplete(contexts, results) {
    const outputPath = this._options.outputPath || 'reports/json/ClickUp-Testing.json';
    const duration = Date.now() - results.startTime;

    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const jsonResults = {
      metadata: {
        project: "ClickUp API Testing Framework",
        environment: process.env.NODE_ENV || "test",
        testRunDate: new Date().toISOString(),
        generatedAt: new Date().toLocaleString(),
        durationMs: duration,
        durationReadable: `${Math.floor(duration / 1000)}s ${duration % 1000}ms`
      },
      summary: {
        numTotalTests: results.numTotalTests,
        numPassedTests: results.numPassedTests,
        numFailedTests: results.numFailedTests,
        numPendingTests: results.numPendingTests,
        passPercentage: results.numTotalTests > 0
          ? ((results.numPassedTests / results.numTotalTests) * 100).toFixed(2)
          : "0.00",
        failPercentage: results.numTotalTests > 0
          ? ((results.numFailedTests / results.numTotalTests) * 100).toFixed(2)
          : "0.00",
        numTotalTestSuites: results.numTotalTestSuites,
        numPassedTestSuites: results.numPassedTestSuites,
        numFailedTestSuites: results.numFailedTestSuites,
        numPendingTestSuites: results.numPendingTestSuites,
        startTime: new Date(results.startTime).toISOString(),
        endTime: new Date().toISOString(),
        success: results.success,
        testResults: results.testResults.map(testResult => ({
          testFilePath: testResult.testFilePath,
          relativePath: path.relative(process.cwd(), testResult.testFilePath),
          numPassingTests: testResult.numPassingTests,
          numFailingTests: testResult.numFailingTests,
          numPendingTests: testResult.numPendingTests,
          perfStats: testResult.perfStats,
          testResults: testResult.testResults.map(test => ({
            ancestorTitles: test.ancestorTitles,
            fullName: test.fullName,
            title: test.title,
            status: test.status,
            duration: test.duration,
            failureMessages: test.failureMessages,
            location: test.location
          }))
        }))
      }
    };

    try {
      fs.writeFileSync(outputPath, JSON.stringify(jsonResults, null, 2));
      console.log(`JSON report generated: ${outputPath}`);
    } catch (error) {
      console.error(`Failed to write JSON report to ${outputPath}:`, error.message);
    }
  }
}

export default JSONReporter;