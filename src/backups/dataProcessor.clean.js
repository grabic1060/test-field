/**
 * Data Processor Module (Clean / Fixed Version)
 */

export async function fetchRemoteUser(id) {
  await new Promise(resolve => setTimeout(resolve, 50));
  if (id <= 0) throw new Error(`Invalid User ID: ${id}`);
  return { id, name: `User_${id}`, processedAt: new Date().toISOString() };
}

export async function processUserBatch(userIds) {
  if (!Array.isArray(userIds)) return [];

  // FIXED: Using Promise.all with map to properly await all async operations
  const userPromises = userIds.map(id => fetchRemoteUser(id));
  const results = await Promise.all(userPromises);

  return results;
}

export async function aggregateScores(scores) {
  if (!Array.isArray(scores) || scores.length === 0) return 0;
  // FIXED: Added initial value 0 for reduce
  return scores.reduce((acc, item) => acc + (item.value || 0), 0);
}
