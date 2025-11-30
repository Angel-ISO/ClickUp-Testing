import createRequestManager from '../requestManager.js';

describe('Request Manager', () => {
  it('creates a singleton manager', () => {
    const m1 = createRequestManager();
    const m2 = createRequestManager();
    expect(m1).toBeDefined();
    expect(m1).toBe(m2);
  });

  it('exposes basic HTTP methods', () => {
    const manager = createRequestManager();
    expect(typeof manager.get).toBe('function');
    expect(typeof manager.post).toBe('function');
    expect(typeof manager.put).toBe('function');
    expect(typeof manager.delete).toBe('function');
  });
});
