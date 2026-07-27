import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { calculateDiscountedTotal, getTierTransactionFee } from '../src/modules/paymentGateway.js';

describe('Scenario 2: Payment Gateway', () => {
  test('should apply 15% discount for GOLD tier on exact threshold purchase ($1000)', () => {
    // Exact boundary value $1,000 for GOLD tier (expected discount rate = 15% -> total = $850.00)
    const result = calculateDiscountedTotal(1000, 'GOLD');
    assert.equal(result, 850);
  });

  test('should apply 20% discount for PLATINUM tier on $1500 purchase', () => {
    const result = calculateDiscountedTotal(1500, 'PLATINUM');
    assert.equal(result, 1200);
  });

  test('should calculate correct transaction fee for maximum tier index without returning NaN', () => {
    // Asking for tierLevel 4 (out-of-bounds or highest level rate)
    const fee = getTierTransactionFee(500, 4);
    assert.equal(typeof fee, 'number');
    assert.equal(isNaN(fee), false, 'Transaction fee should not be NaN');
    assert.ok(fee > 0, 'Fee should be greater than 0');
  });
});
