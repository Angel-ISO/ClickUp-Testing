import Logger from '../logger.js';

describe('Logger', () => {
  it('exposes main logging methods', () => {
    expect(typeof Logger.fatal).toBe('function');
    expect(typeof Logger.error).toBe('function');
    expect(typeof Logger.info).toBe('function');
  });

  it('test lifecycle helpers do not throw', () => {
    expect(() => Logger.testStart('Test', 'tests/TC-001.test.js')).not.toThrow();
    expect(() => Logger.testEnd('Test', 'passed', 10, 'tests/TC-001.test.js')).not.toThrow();
  });
});
