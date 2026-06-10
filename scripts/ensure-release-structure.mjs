import { mkdir, writeFile, access } from 'node:fs/promises';

async function exists(path) {
  try { await access(path); return true; } catch { return false; }
}

await mkdir('release/games', { recursive: true });
if (!(await exists('release/manifest.json'))) {
  await writeFile('release/manifest.json', JSON.stringify({ generatedAt: new Date().toISOString(), totalDays: 100, completedDays: 0, games: [] }, null, 2) + '\n');
}
