import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';

const baseArgIndex = process.argv.indexOf('--base');
const base = baseArgIndex >= 0 ? process.argv[baseArgIndex + 1] : 'origin/main';

function allowedRegenerationDays() {
  const path = 'release/regeneration-allowlist.json';
  if (!existsSync(path)) return new Set();
  try {
    const parsed = JSON.parse(readFileSync(path, 'utf8'));
    return new Set((parsed.allowedDays ?? []).map((day) => String(day).padStart(3, '0')));
  } catch (error) {
    console.error(`Failed to parse ${path}: ${error.message}`);
    process.exit(1);
  }
}

let diff = '';
try {
  execFileSync('git', ['rev-parse', '--verify', base], { stdio: 'ignore' });
  diff = execFileSync('git', ['diff', '--name-status', base, '--', 'release/games'], { encoding: 'utf8' });
} catch {
  console.log(`immutable guard skipped: base ${base} not available yet`);
  process.exit(0);
}

const allowedDays = allowedRegenerationDays();
const violations = diff
  .split('\n')
  .filter(Boolean)
  .filter((line) => {
    if (line.startsWith('A\t')) return false;
    const path = line.split('\t').at(-1) ?? '';
    const match = path.match(/^release\/games\/(\d{3})\//);
    return !match || !allowedDays.has(match[1]);
  });

if (violations.length) {
  console.error('Immutable release violation: existing release files changed/deleted');
  console.error(violations.join('\n'));
  process.exit(1);
}

if (allowedDays.size > 0) {
  console.log(`immutable guard passed with regeneration allowlist: ${[...allowedDays].join(', ')}`);
} else {
  console.log('immutable guard passed');
}
