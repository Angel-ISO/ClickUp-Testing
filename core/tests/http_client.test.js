import create_http_client from '../http_client.js';
import result from '../result.js';

describe('HTTP Client - Basic', () => {
  const baseUrl = 'https://api.example.com';
  const token = 'test-token-123';

  it('creates a client with standard HTTP methods', () => {
    const client = create_http_client(baseUrl, token);
    expect(typeof client.get).toBe('function');
    expect(typeof client.post).toBe('function');
    expect(typeof client.put).toBe('function');
    expect(typeof client.delete).toBe('function');
  });

  it('uses the result wrapper for responses', async () => {
    const client = create_http_client(baseUrl, token);
    const res = await client.get('/nonexistent-endpoint');

    expect(typeof res).toBe('object');
    expect(res).toHaveProperty('success');
    expect(typeof res.success).toBe('boolean');
    expect(res).toHaveProperty('is_ok');
    expect(res).toHaveProperty('is_error');
    expect(typeof res.is_ok).toBe('function');
    expect(typeof res.is_error).toBe('function');

    if (res.success) {
      const ok = result.ok(res.value);
      expect(ok.success).toBe(true);
      expect(ok.is_ok()).toBe(true);
    } else {
      const err = result.error(res.error || 'unknown');
      expect(err.success).toBe(false);
      expect(err.is_error()).toBe(true);
    }
  });
});
