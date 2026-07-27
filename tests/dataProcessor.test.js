import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { processUserBatch, aggregateScores } from '../src/modules/dataProcessor.js';

describe('Scenario 3: Data Processor Async Flow', () => {
  test('should return processed array containing all fetched users', async () => {
    const userIds = [1, 2, 3];
    const results = await processUserBatch(userIds);

    assert.equal(results.length, 3, 'Batch results should contain 3 users');
    assert.equal(results[0].id, 1);
    assert.equal(results[1].id, 2);
    assert.equal(results[2].id, 3);
  });

  test('should aggregate score objects with initial value 0', async () => {
    const scores = [{ value: 10 }, { value: 20 }, { value: 30 }];
    const total = await aggregateScores(scores);

    assert.equal(total, 60, 'Aggregated total score should equal 60');
  });

  test('should handle empty scores array gracefully', async () => {
    const total = await aggregateScores([]);
    assert.equal(total, 0);
  });
});
