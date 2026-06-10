# Day NNN Game Generation Prompt Template

## Game identity

- Day:
- Title:
- Slug:
- Mode: 2D / 3D / hybrid
- Genre:
- Mood/style:

## Why this game today

Explain why this idea was selected and how it differs from recent games.

## Design

- Objective:
- Win condition:
- Lose condition:
- Core loop:
- 15+ minute play-value strategy:
- Difficulty scaling:
- Scoring/rewards:

## Controls

- Desktop:
- Mobile/touch:

## Menu and tutorial

Define title screen, tutorial text, objective display, pause/restart, and in-game help.

## Assets

List procedural assets and image-generation prompts. Include fallbacks if image generation fails.

## Subagents to dispatch

1. Implementation subagent
2. Asset/polish subagent
3. QA/browser/mobile subagent
4. Reflection/self-improvement subagent

## Acceptance criteria

- Static build passes.
- Desktop smoke passes.
- Mobile smoke passes.
- Prompt is visible from gallery and release folder.
- Screenshot exists.
- No console errors.
- Old release folders unchanged.

## Exact validation commands

```bash
pnpm typecheck
pnpm test
pnpm build
pnpm release:validate
pnpm test:smoke
pnpm test:immutable -- --base origin/main
```
