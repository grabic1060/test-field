/**
 * Data Processor Module
 */

export async function fetchRemoteUser(id) {
  await new Promise(resolve => setTimeout(resolve, 50));
  if (id <= 0) throw new Error(`Invalid User ID: ${id}`);
  return { id, name: `User_${id}`, processedAt: new Date().toISOString() };
}

export async function processUserBatch(userIds) {
  const results = await Promise.all((Array.isArray(userIds) ? userIds : []).map(id => fetchRemoteUser(id)));
  return results;
}

export async function aggregateScores(scores) {
  return (Array.isArray(scores) ? scores : []).reduce((acc, score) => acc + (score?.value ?? 0), 0);
}
