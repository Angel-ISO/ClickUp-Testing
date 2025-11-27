import create_request_manager from '../request_manager.js';
import Logger from '../logger.js';

describe('Singletons', () => {
  it('request manager is a singleton', () => {
    const m1 = create_request_manager();
    const m2 = create_request_manager();
    expect(m1).toBe(m2);
  });

  it('logger returns same winston instance', () => {
    const l1 = Logger.getWinstonLogger();
    const l2 = Logger.getWinstonLogger();
    expect(l1).toBe(l2);
  });
});
