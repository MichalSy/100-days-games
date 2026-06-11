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

## Controls and layout

- Desktop:
- Mobile/touch:
- Mobile layout/orientation:
  - Default target is portrait phone play at about 390x844; the game must be readable and playable without requiring landscape.
  - Use large touch targets (44px+), simplified HUD placement, legible labels, and a game area sized for thumbs.
  - If the game is genuinely landscape-only, justify why here, add a clear rotate-phone/orientation gate, and include separate mobile landscape QA steps.

## Menu and tutorial

Define title screen, tutorial text, objective display, pause/restart, and in-game help.

## Assets

Prefer Imagegen2 (`openai/gpt-image-2`) for final visual art: characters, backgrounds, textures, sprite sheets, icons, and key decorative pieces. Include concrete Imagegen2 prompts, target aspect ratios, and source-file archive paths. For mobile-first games, include portrait-friendly or crop-safe asset guidance (important content centered, safe margins, no baked-in text). Procedural code may crop, resize, alpha-clean, atlas-pack, optimize, animate, or place generated assets; it should not create final art from scratch except for simple UI chrome/particles/debug shapes or an explicitly labeled emergency fallback if Imagegen2 is unavailable.

## Subagents to dispatch

1. Implementation subagent
2. Asset/polish subagent
3. QA/browser/mobile subagent
4. Reflection/self-improvement subagent

## Acceptance criteria

- Static build passes.
- Desktop smoke passes.
- Mobile portrait smoke passes at about 390x844 with readable HUD/tutorial, usable touch controls, and no forced landscape canvas unless explicitly justified.
- If landscape is required, a rotate-phone gate is present and a landscape mobile smoke pass is documented.
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
