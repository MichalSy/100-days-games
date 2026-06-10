import { execFileSync } from 'node:child_process';

const baseArgIndex = process.argv.indexOf('--base');
const base = baseArgIndex >= 0 ? process.argv[baseArgIndex + 1] : 'origin/main';
let diff = '';
try {
  execFileSync('git', ['rev-parse', '--verify', base], { stdio: 'ignore' });
  diff = execFileSync('git', ['diff', '--name-status', base, '--', 'release/games'], { encoding: 'utf8' });
} catch {
  console.log(`immutable guard skipped: base ${base} not available yet`);
  process.exit(0);
}
const violations = diff.split('\n').filter(Boolean).filter((line) => !line.startsWith('A\t'));
if (violations.length) {
  console.error('Immutable release violation: existing release files changed/deleted');
  console.error(violations.join('\n'));
  process.exit(1);
}
console.log('immutable guard passed');
