import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { getUserDisplayInfo, formatUserAddress, calculateAccountAgeYears } from '../src/modules/userService.js';

describe('Scenario 1: User Service', () => {
  test('should return display info for full user profile', () => {
    const user = {
      profile: { name: 'Alice Smith' },
      email: 'alice@example.com',
      settings: { theme: { mode: 'dark' } },
      vipStatus: true
    };
    const info = getUserDisplayInfo(user);
    assert.equal(info.displayName, 'ALICE SMITH (alice@example.com)');
    assert.equal(info.theme, 'dark');
    assert.equal(info.isVip, true);
  });

  test('should handle missing settings or profile gracefully without throwing TypeError', () => {
    const incompleteUser = {
      email: 'bob@example.com'
    };
    // Expected to NOT throw TypeError
    assert.doesNotThrow(() => {
      const info = getUserDisplayInfo(incompleteUser);
      assert.ok(info.displayName);
    });
  });

  test('should format address safely when address is missing or partial', () => {
    const userWithoutAddress = { name: 'Charlie' };
    assert.doesNotThrow(() => {
      const addr = formatUserAddress(userWithoutAddress);
      assert.ok(typeof addr === 'string');
    });
  });

  test('should calculate account age without crashing on invalid or missing date', () => {
    const userWithInvalidDate = { createdAt: 'invalid-date-string' };
    const age = calculateAccountAgeYears(userWithInvalidDate);
    assert.equal(typeof age, 'number');
    assert.equal(isNaN(age), false);
  });
});
