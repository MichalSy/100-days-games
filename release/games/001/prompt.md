# Day 001 Game Generation Prompt

## Game identity

- Day: 001
- Title: Lumen Lanes
- Slug: lumen-lanes
- Mode: 2D
- Genre: arcade puzzle, route planning, reflex strategy
- Mood/style: neon tabletop, clean sci-fi dashboard, readable high-contrast shapes, satisfying light pulses

## Why this game today

This is the first generated game, so it should establish a durable golden template: one self-contained static release with a clear menu, a visible tutorial, desktop and mobile controls, pause/restart, screenshot, archived prompt, and gallery metadata. The mechanic is intentionally approachable but replayable: guide a courier of light through a shifting city grid by rotating lane tiles before energy runs out. It differs from future candidates by focusing on fast puzzle-routing rather than combat, platforming, or physics.

## Design

- Objective: Connect the glowing start node to the exit beacon by rotating lane tiles so the pulse can travel across a continuous route.
- Win condition: Clear five sectors in a run. Each sector is completed when the pulse reaches the beacon before the timer expires.
- Lose condition: The sector timer reaches zero, or the pulse enters a dead end after launch. The player can restart immediately.
- Core loop:
  1. Inspect the compact grid and target beacon.
  2. Rotate tiles by clicking/tapping them to create a route.
  3. Press Launch to send the pulse.
  4. Earn score for speed, unused rotations, and streaks.
  5. Advance to a denser sector with less time and more decoy paths.
- 15+ minute play-value strategy: Include deterministic sector generation from a seed, increasing sector difficulty, score multipliers for few rotations, optional preview of route continuity, and a best-score stored in localStorage. The player can chase perfect low-rotation clears and improve routing speed.
- Difficulty scaling: Sector 1 is 5x5 with generous time. Later sectors increase decoy bends, add locked tiles, reduce time, and require longer paths. Keep all puzzles solvable by generating a guaranteed path first, then filling the rest with decoys.
- Scoring/rewards: Base points per sector, time bonus, rotation efficiency bonus, streak multiplier, best-score display. Use celebratory pulse animation and brief sector-complete overlay.

## Controls

- Desktop:
  - Mouse click a tile to rotate it clockwise.
  - Keyboard: Space launches the pulse; R restarts sector/run depending on state; P pauses/resumes; H toggles help.
- Mobile/touch:
  - Tap a tile to rotate it.
  - Large touch buttons for Launch, Pause, Restart, and Help.
  - Layout must fit a 390px-wide smartphone viewport with no horizontal scrolling.

## Menu and tutorial

Define a title screen with title, tagline, objective, best score, and Start button. Tutorial text must explain: rotate lane tiles, connect start to beacon, launch only when ready, clear five sectors, use pause/restart. In-game HUD must show sector, score, timer, rotations, objective, and controls. Pause overlay must include Resume, Restart, and Back to Menu. Restart behavior should reset the current run safely. In-game help should be available without returning to menu.

## Assets

Use procedural assets only so the game remains robust without external dependencies:

- Canvas or DOM grid with procedural neon gradients.
- Lane tile types: straight, corner, tee/cross optional, locked path pieces.
- Animated pulse: glowing circle with trailing particles along tile centers.
- Start node and exit beacon icons drawn with CSS/canvas.
- Background: subtle animated star/noise grid.

If image generation is available and useful, it may be used only for a non-critical decorative background. Fallback is the procedural gradient background. No gameplay may depend on external images.

## Subagents to dispatch

1. Implementation subagent: build the game under `apps/day-001-lumen-lanes/`, create a static release under `release/games/001/`, update gallery data, and archive prompt files.
2. Asset/polish subagent: improve visual feel, animations, responsive layout, and screenshot composition without changing core rules.
3. QA/browser/mobile subagent: run local build, release validation, desktop and mobile Playwright/browser smoke, screenshot/static checks, Docker/static smoke if available, console-error checks, and immutable guard.
4. Reflection/self-improvement subagent: after validation, write `ai/postmortems/day-001.md` and update controlled self-improvement files only if evidence from testing justifies it.

## Acceptance criteria

- Static build passes.
- Desktop smoke passes.
- Mobile smoke passes.
- Prompt is visible from gallery and release folder.
- `release/games/001/prompt.md` is an exact archive of this prompt, and `release/games/001/prompt.html` renders it readably.
- `release/games/001/index.html` is playable without a backend at `/001/` after static serving.
- Screenshot exists at `release/games/001/screenshot.png` and gallery uses it.
- No console errors during gallery or game smoke tests.
- Old release folders from `origin/main` are unchanged.
- Gallery card shows prompt availability and generation duration.
- Game includes menu, tutorial/objective, controls, pause, restart, and mobile-friendly touch controls.

## Exact validation commands

```bash
pnpm typecheck
pnpm test
pnpm build
pnpm release:validate
pnpm test:smoke
pnpm test:immutable -- --base origin/main
```

Additional required cron-run checks before push:

```bash
# verify day route static files exist
node -e "for (const f of ['release/games/001/index.html','release/games/001/prompt.md','release/games/001/prompt.html','release/games/001/screenshot.png']) require('node:fs').accessSync(f)"

# browser/mobile smoke for /001/ should check no console errors and visible game UI
# Docker/static smoke should serve ./release and request /, /001/, /games/001/ or the configured static route aliases if present
```
