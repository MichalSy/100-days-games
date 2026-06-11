import { access, chmod, mkdir, readdir, stat, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

async function exists(path) {
  try { await access(path); return true; } catch { return false; }
}

async function normalizeReadable(path) {
  if (!(await exists(path))) return;
  const info = await stat(path);
  if (info.isDirectory()) {
    await chmod(path, 0o755);
    const entries = await readdir(path);
    await Promise.all(entries.map((entry) => normalizeReadable(join(path, entry))));
    return;
  }
  if (info.isFile()) {
    await chmod(path, 0o644);
  }
}

await mkdir('release/games', { recursive: true });
if (!(await exists('release/manifest.json'))) {
  await writeFile('release/manifest.json', JSON.stringify({ generatedAt: new Date().toISOString(), totalDays: 100, completedDays: 0, games: [] }, null, 2) + '\n');
}

await normalizeReadable('release');
