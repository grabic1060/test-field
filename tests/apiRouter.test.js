import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { handleApiRequest, ValidationError } from '../src/modules/apiRouter.js';

describe('Scenario 5: API Router & Error Handler', () => {
  test('should return 200 OK for valid request payload', () => {
    const req = { body: { email: 'user@test.com', age: 25 } };
    const res = handleApiRequest(req);

    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
  });

  test('should return 400 Bad Request when email is missing without throwing unhandled exception', () => {
    const req = { body: { age: 20 } };

    assert.doesNotThrow(() => {
      const res = handleApiRequest(req);
      assert.equal(res.status, 400, 'Validation failure must return status 400');
      assert.equal(res.body.error, 'ValidationError');
      assert.ok(res.body.details, 'Response must include details string');
    });
  });

  test('should return 400 Bad Request when user is underage', () => {
    const req = { body: { email: 'kid@test.com', age: 15 } };

    const res = handleApiRequest(req);
    assert.equal(res.status, 400);
    assert.equal(res.body.error, 'ValidationError');
  });
});
