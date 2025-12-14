import createRequestManager from '../requestManager.js';
import Logger from '../logger.js';

describe('Singletons', () => {
  it('request manager is a singleton', () => {
    const m1 = createRequestManager();
    const m2 = createRequestManager();
    expect(m1).toBe(m2);
  });

  it('logger returns same winston instance', () => {
    const l1 = Logger.getWinstonLogger();
    const l2 = Logger.getWinstonLogger();
    expect(l1).toBe(l2);
  });
});
