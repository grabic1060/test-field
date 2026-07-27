import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { isTokenExpired, validateUserPermissions } from '../src/modules/authMiddleware.js';

describe('Scenario 4: Auth Middleware Permissions', () => {
  test('should return false (not expired) for token with exp in the future', () => {
    const futureExp = Math.floor(Date.now() / 1000) + 3600; // 1 hour in future
    const activeToken = { exp: futureExp };

    const expired = isTokenExpired(activeToken);
    assert.equal(expired, false, 'Future token should NOT be expired');
  });

  test('should return true (expired) for token with exp in the past', () => {
    const pastExp = Math.floor(Date.now() / 1000) - 3600; // 1 hour ago
    const expiredToken = { exp: pastExp };

    const expired = isTokenExpired(expiredToken);
    assert.equal(expired, true, 'Past token SHOULD be expired');
  });

  test('should validate user role against list of allowed roles', () => {
    const activeToken = { exp: Math.floor(Date.now() / 1000) + 3600 };
    const user = { role: 'admin', token: activeToken };

    const isValid = validateUserPermissions(user, ['admin', 'superadmin']);
    assert.equal(isValid, true, 'Admin user should be permitted');
  });
});
