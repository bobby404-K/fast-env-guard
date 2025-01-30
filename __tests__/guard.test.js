import assert from 'node:assert';
import test from 'node:test';
import { EnvGuard } from '../dist/validator.js';

test('EnvGuard validates types and masks secrets properly', () => {
  const result = EnvGuard.validate({
    PORT: { type: 'port', required: true, default: 3000 },
    API_KEY: { type: 'string', required: true, secret: true }
  }, { PORT: '8080', API_KEY: 'secret_jwt_key_123' });

  assert.strictEqual(result.success, true);
  assert.strictEqual(result.data.PORT, 8080);
  assert.strictEqual(result.masked.API_KEY, '***[REDACTED]***');
});
