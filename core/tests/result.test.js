import result from '../result.js';

describe('Result', () => {
  it('ok() creates a successful result and is_ok/is_error behave', () => {
    const r = result.ok('value');
    expect(r.success).toBe(true);
    expect(r.value).toBe('value');
    expect(r.isOk()).toBe(true);
    expect(r.isError()).toBe(false);
  });

  it('error() creates an error result and is_error/is_ok behave', () => {
    const r = result.error('fail');
    expect(r.success).toBe(false);
    expect(r.error).toBe('fail');
    expect(r.isError()).toBe(true);
    expect(r.isOk()).toBe(false);
  });

  it('map preserves errors and transforms ok values', () => {
    const ok = result.ok(2);
    const mapped = result.map(ok, (v) => v * 3);
    expect(mapped.value).toBe(6);

    const err = result.error('x');
    const mappedErr = result.map(err, (v) => v * 3);
    expect(mappedErr).toBe(err);
  });
});
