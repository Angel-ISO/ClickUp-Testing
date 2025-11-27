import create_request_manager from '../request_manager.js';

describe('Request Manager', () => {
  it('creates a singleton manager', () => {
    const m1 = create_request_manager();
    const m2 = create_request_manager();
    expect(m1).toBeDefined();
    expect(m1).toBe(m2);
  });

  it('exposes basic HTTP methods', () => {
    const manager = create_request_manager();
    expect(typeof manager.get).toBe('function');
    expect(typeof manager.post).toBe('function');
    expect(typeof manager.put).toBe('function');
    expect(typeof manager.delete).toBe('function');
  });
});
