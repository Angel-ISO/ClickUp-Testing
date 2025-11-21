import 'dotenv/config';
import Logger from './core/logger.js';
const testStartTimes = new Map();

beforeAll(() => {
  Logger.info('='.repeat(80));
  Logger.info('Starting Test Execution');
  Logger.info('='.repeat(80));
});

afterAll(() => {
  Logger.info('='.repeat(80));
  Logger.info('Test Execution Completed');
  Logger.info('='.repeat(80));
});

beforeEach(() => {
  const testName = expect.getState().currentTestName || 'Unknown Test';
  const testPath = expect.getState().testPath || '';

  testStartTimes.set(testName, Date.now());
  
  Logger.testStart(testName, testPath);
});

afterEach(() => {
  const state = expect.getState();
  const testName = state.currentTestName || 'Unknown Test';
  const testPath = state.testPath || '';
  
  const startTime = testStartTimes.get(testName);
  const duration = startTime ? Date.now() - startTime : 0;
  
  testStartTimes.delete(testName);
  
  const status = state.assertionCalls > 0 && !state.suppressedErrors?.length 
    ? 'passed' 
    : state.suppressedErrors?.length 
    ? 'failed' 
    : 'passed';
  
  Logger.testEnd(testName, status, duration, testPath);
});

jest.setTimeout(30000);