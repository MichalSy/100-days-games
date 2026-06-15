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

## Code isolation / no previous game source

The implementation must be written from scratch for this day. Do not open, inspect, copy, diff, grep, or adapt code from previous games, including old `apps/day-*` folders, old `release/games/NNN/` HTML/CSS/JS files, or old public alias folders. You may inspect previous metadata, prompts, postmortems, and screenshots only to avoid repeating concepts and visual identity. The new game's HTML/CSS/JS must come from this prompt and general web/game knowledge, not from earlier game implementations.

## Mode variety / 3D cadence

Before locking the concept, inspect the latest generated modes in `src/data/games.ts`:

- Do not let the series become all 2D.
- After at most three consecutive generated 2D games, this day must be 3D or a clearly meaningful hybrid.
- If the current streak is already two 2D games, strongly prefer 3D now unless the prompt documents why exactly one more 2D is necessary and how the next day will be forced to 3D.
- A 3D game should use real spatial gameplay/camera/depth (for example Three.js/WebGL, 3D physics, depth-based navigation, orbit/behind/iso camera), not just 2D art with perspective decoration.

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

### Mandatory generated-image QA

For every generated image, and especially sprites that move, rotate, or animate, include a real inspection step after generation and before integration:

- Analyze the actual generated file visually, not just the prompt text.
- For sprites, verify transparent background/cutout quality, facing direction, natural forward axis, pivot/origin, crop margins, silhouette readability at final in-game size, and absence of unwanted background boxes/text/watermarks.
- Verify control-to-motion alignment in-game: when the player moves up/right/down/left or toward touch input, the sprite should visually point/travel the expected way. If the asset's native orientation differs from code assumptions, correct the asset pipeline or documented rotation baseline before publish.
- If inspection finds a problem (wrong direction, not cut out, bad crop, confusing silhouette), regenerate or post-process the image and inspect again. Do not ship a broken sprite just because tests pass.

## Prompt page output

The archived `release/games/NNN/prompt.html` must be a consistent rendered HTML page, not raw Markdown pasted into a `<pre>` block. It should include:

- A clear `<title>` and `<h1>` using `Day NNN Game Generation Prompt`.
- A back-to-game link near the top.
- Semantic rendered sections (`h2`, `h3`, `ul/ol/li`, `p`, `pre/code` only for actual code/commands).
- The same readable prompt-page style pattern across days so prompt pages feel like one system.

## Subagents to dispatch

1. Implementation subagent
2. Asset/polish subagent
3. QA/browser/mobile subagent
4. Reflection/self-improvement subagent

## Acceptance criteria

- Static build passes.
- Code isolation is documented in QA/postmortem: no previous game implementation code was opened, inspected, copied, diffed, grepped, or adapted.
- Mode choice follows the 3D cadence rule: no more than three consecutive generated 2D games; 3D/hybrid is real spatial gameplay, not just decorative perspective.
- Desktop smoke passes.
- Mobile portrait smoke passes at about 390x844 with readable HUD/tutorial, usable touch controls, and no forced landscape canvas unless explicitly justified.
- If landscape is required, a rotate-phone gate is present and a landscape mobile smoke pass is documented.
- Prompt is visible from gallery and release folder.
- `prompt.html` is rendered semantic HTML with the standard prompt-page styling, not a raw Markdown `<pre>` dump.
- Every generated image has an inspection note in the postmortem or QA notes; moving/animated sprites have verified cutout, facing direction, rotation baseline, pivot/crop, and control-to-motion alignment.
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
