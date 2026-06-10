# Hermes Cron Job Design

The real cron job should stay tiny. It should not embed the full game-generation prompt.

It should only say where the current prompt lives in git and which model settings to use.

## Target schedule

- Schedule: `30 3 * * *`
- Timezone expectation: Europe/Berlin
- Model: GPT-5.5
- Reasoning: high
- Workdir: `/home/aiko/git-projects/100-days-games`
- Public domain: `https://100-day-games.sytko.de/`
- Daily route shape: `/001`, `/002`, …
- Starts from: Day 2, after Day 1 is manually built and deployed

## Cron prompt skeleton

```txt
Run the daily 100-days-games generator.

Read and follow the full current instructions from:
/home/aiko/git-projects/100-days-games/ai/cron-system-prompt.md

Use the repository at:
/home/aiko/git-projects/100-days-games

Do not invent replacement instructions in the cron job itself. The git-tracked prompt is the source of truth.
```

## Execution shape

The cron has two context-separated phases:

1. **Planner phase** — the scheduled Hermes run reads `ai/cron-system-prompt.md`, analyzes the repo, and writes exactly one detailed day prompt to `prompts/day-NNN.md`.
2. **Fresh implementation phase** — after the prompt exists, the cron starts a new agent/subagent with a reset context. That fresh agent receives only:
   - repo path
   - day number
   - generated prompt path
   - validation/publish rules

The fresh implementation agent then builds the game, assets, release folder, tests everything, and reports back. The original cron context should not leak brainstorming or partial ideas into the implementation agent.

## Why this shape

Keeping the full prompt in git means every improvement is reviewable, versioned, reproducible, and visible next to the game outputs. Starting a fresh implementation agent after prompt generation makes the experiment cleaner: the published game is produced from the archived prompt, not from hidden earlier context.
