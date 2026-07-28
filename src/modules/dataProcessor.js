/**
 * Data Processor Module (Buggy Backup)
 */

export async function fetchRemoteUser(id) {
  await new Promise(resolve => setTimeout(resolve, 50));
  if (id <= 0) throw new Error(`Invalid User ID: ${id}`);
  return { id, name: `User_${id}`, processedAt: new Date().toISOString() };
}

export async function processUserBatch(userIds) {
  return Promise.all(userIds.map((id) => fetchRemoteUser(id)));
}

export async function aggregateScores(scores) {
  return scores.reduce((acc, score) => acc + (score?.value ?? 0), 0);
}
