import { readFile } from 'node:fs/promises';

const dryRun = process.argv.includes('--dry-run');
const promptPath = 'ai/cron-system-prompt.md';
const prompt = await readFile(promptPath, 'utf8');
console.log(`Loaded cron source prompt from ${promptPath}`);
console.log(`Prompt length: ${prompt.length} chars`);
if (dryRun) {
  console.log('Dry run only. No game generated. The real Hermes cron reads this file as source of truth.');
  process.exit(0);
}
throw new Error('daily-run is intentionally a Hermes-orchestrated workflow. Use the Hermes cron with ai/cron-system-prompt.md.');
