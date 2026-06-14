# Day 005 Game Generation Prompt

## Game identity

- Day: 005
- Title: Yume Lantern Railrunner
- Slug: yume-lantern-railrunner
- Public route word: yume
- Mode: 3D
- Genre: mobile-first 3D lane-shifting rhythm runner / dream-rail navigation score chase
- Mood/style: dreamlike paper-theater night sky, glowing shrine train rails, origami constellations, lacquered miniatures, calm but skillful arcade flow, readable portrait-phone 3D

## Why this game today

The current series in `src/data/games.ts` is Day 001 `2d`, Day 002 `2d`, Day 003 `3d`, Day 004 `2d`. The latest generated-mode streak is therefore one 2D game. Day 005 deliberately returns to real 3D to keep the cadence strong and avoid settling into flat canvas games.

Day 005 must feel unlike the previous entries:

- Day 001: calm top-down koi collection.
- Day 002: 2D timed delivery route planning.
- Day 003: 3D ring-flight crafting.
- Day 004: 2D drawn firefly path routing.

This game is a 3D dream-rail runner where the player rides a small lantern tram through layered rails, switches lanes in depth, collects dream tickets, times gates, and chooses safe forks. The key verbs are anticipation, lane commitment, rhythm timing, and depth reading rather than free steering or drawing paths.

## Mode variety / 3D cadence

Inspection target: `src/data/games.ts` currently ends with Day 003 mode `3d` followed by Day 004 mode `2d`, so the latest 2D streak is one.

Mode decision: Day 005 is `3d`. It must implement real spatial gameplay, not decorative perspective:

- Use Three.js/WebGL with a perspective camera following a moving tram along forward z-depth.
- Render rails, gates, collectibles, hazards, station arches, and parallax dream scenery as 3D objects or textured planes positioned in depth.
- Lane changes must move the tram between at least three visible lanes on the x-axis and optionally small y-height ramps.
- Upcoming choices must be readable through depth cues: fog, scale, rail guide lights, ghost previews, and distance markers.
- Portrait mobile is the default supported layout; no landscape gate.

## Design

- Objective: Guide the Yume lantern tram along dream rails, collect golden dream tickets, pass through matching moon gates, avoid broken nightmare rails, and complete three station dreams before the sleep meter runs out.
- Win condition: Reach 2600 points and clear all three station dreams — Moon Platform, Paper Crane Bridge, and Dawn Bell Loop — to trigger “Yume Dawn Arrival”. After arrival, continue in endless night-loop score chase.
- Lose condition: The tram loses all three lantern hearts from nightmare collisions or the sleep meter drains to zero because too many gates are missed.
- Core loop:
  1. Start on a title/menu screen with Day 005 badge, mode badge “3D”, best score, best arrival time, tutorial, prompt link, and a large Start button.
  2. The tram moves forward automatically through a 3D rail corridor.
  3. Player changes lanes left/right to line up with lit rails, tickets, and matching moon gates.
  4. Occasional fork moments ask the player to pick the safer glowing rail before the switch point.
  5. Collect dream tickets and star fragments to build score and charge the “Lucid Bell”.
  6. Avoid cracked nightmare rails, black paper moth swarms, and closed gate frames.
  7. Use Lucid Bell to slow time briefly and reveal the next safe rail sequence.
  8. Clear three station dream phases; each phase adds a new rail pattern and hazard rhythm.
  9. Pause/restart remain available throughout.
- 15+ minute play-value strategy:
  - Save best score, best Dawn Arrival time, highest clean-gate streak, and endless loop number in localStorage.
  - Include three authored station phases with different spatial patterns:
    - Moon Platform: simple three-lane timing, large gates, forgiving hazards.
    - Paper Crane Bridge: alternating lane gates, gentle vertical rail humps, paper moth warnings.
    - Dawn Bell Loop: faster switch windows, broken rail decoys, multi-gate combos.
  - Generate run variation from a deterministic Day 005 seed: ticket positions, safe fork choices, hazard offsets, and bonus star fragments.
  - Mastery badges: arrive before 150 seconds, maintain a 16-gate clean streak, finish a phase without damage, score 4200 in endless.
  - Strategic scoring rewards clean rhythm: consecutive correct gates build a combo multiplier; Lucid Bell use is powerful but reduces the end-of-phase purity bonus.
  - Endless night-loop after win increases speed, fog density, and fork ambiguity every loop while keeping mobile-readable warning signs.
- Difficulty scaling:
  - 0-35 seconds: slow speed, three wide lanes, tickets on safe path, one hazard type.
  - 35-90 seconds: gates ask for simple color/shape matching, hazards appear beside ticket baits, speed ramps gently.
  - 90-150 seconds: fork choices, moving paper moth swarms, short sequences of two or three matching gates.
  - 150+ seconds/endless: faster rail switches, denser gate combos, more tempting unsafe ticket lines.
  - Keep mobile fair: high-contrast rails, fat gate openings, clear warning glow, generous collision radii, no tiny collectibles required for survival.
- Scoring/rewards:
  - Dream ticket: +45 points.
  - Star fragment: +120 points and +12% Lucid Bell charge.
  - Correct moon gate: +90 points times clean-gate combo.
  - Full station cleared: +350 points plus lantern-heart repair if below max.
  - Clean station bonus: +250 if no collision and no missed gate in the phase.
  - Yume Dawn Arrival: +800 points and endless mode unlock.
  - Collision: lose one lantern heart, break combo, brief invulnerability.
  - Missed required gate: sleep meter drains faster for 5 seconds and combo resets, but not instant death.

## Controls and layout

- Desktop:
  - Arrow keys / A-D: change lane left/right.
  - W/S or Arrow Up/Down: optional focus lean for vertical gate variants if implemented; do not require it for basic survival.
  - Space or Shift: activate Lucid Bell when charged.
  - P: pause/resume.
  - R: restart current run.
  - Enter/click: start from menu or confirm restart.
- Mobile/touch:
  - Swipe left/right or tap large left/right rail buttons to change lanes. Support both; tap buttons must be at least 56px high.
  - Large Lucid Bell button near lower right, at least 56px target.
  - Pause and Restart controls with 44px+ targets.
  - No tiny virtual joystick. Lane controls must be thumb-friendly and not cover the central tram/gates.
- Mobile layout/orientation:
  - Default target is portrait phone play around 390x844; do not require landscape.
  - 3D canvas fills the central viewport, with compact HUD at top and thumb controls at bottom.
  - HUD must remain legible: score, best, hearts, sleep meter, combo, phase/station, Lucid Bell charge.
  - Tutorial must fit on the first portrait screen; optional details may be collapsible but core controls/objective must be visible.
  - Gate symbols must combine color, shape, and short text labels where needed so hue alone is not required.

## Menu and tutorial

Implement these states:

1. Title screen
   - Shows title “Yume Lantern Railrunner”.
   - Shows Day 005 badge, mode badge “3D”, public route `/yume/`, best score, best Dawn Arrival if available, and a prompt link.
   - Shows a large Start button and visible tutorial panel by default.
2. Tutorial text
   - Objective: “Switch rails, collect dream tickets, pass moon gates, and arrive before dawn.”
   - Movement: desktop arrows/A-D or mobile swipe/tap buttons change lanes.
   - Gates: align with glowing moon gates and avoid closed nightmare frames.
   - Lucid Bell: slows time and reveals the next safe rail when charged.
   - Hazards: cracked rails and paper moths damage lantern hearts.
   - Pause/restart: P/R on desktop or visible buttons on mobile.
3. In-game HUD
   - Score, best score, lantern hearts, sleep meter, combo, station phase, current speed, Lucid Bell charge.
   - Pause/restart controls visible or immediately accessible.
4. Fork warning overlay
   - Non-blocking lane hint near upcoming rail forks: safe lanes glow, unsafe rails crackle.
   - Must not obscure player or gates on mobile.
5. Pause overlay
   - Resume, restart, tutorial reminder, controls summary, prompt link.
6. Game-over/results overlay
   - Final score, best score, station reached, Dawn Arrival status, clean-gate streak, mastery badges, restart button.
7. Yume Dawn Arrival banner
   - Trigger once per run after all three station dreams and 2600 score.
   - Non-blocking dawn glow, bells, origami crane burst; endless play continues after the banner fades.

## Assets

Prefer Imagegen2 (`openai/gpt-image-2`) for final visual art: tram sprite/texture, dream-sky background, icon sheet, and key decorative pieces. Three.js primitives may render rails, gates, collision volumes, guide lights, particles, and UI chrome. Procedural code may crop, resize, alpha-clean, atlas-pack, optimize, animate, or place generated assets; it should not create final character/background/icon art from scratch unless Imagegen2 is unavailable after a real attempt.

Archive source generated art under `release/games/005/assets/source/` and use optimized playable copies under `release/games/005/assets/`. Also copy optimized playable assets into `apps/day-005-yume-lantern-railrunner/assets/` and the public alias `release/yume/assets/`.

For mobile-first crop safety: keep important content centered, leave 12-16% safe margins, avoid baked-in text, avoid watermarks, avoid tiny details that disappear at final in-game size, and keep high-contrast silhouettes.

Generate or provide at least these final art assets:

1. Lantern tram sprite/texture source
   - Target: transparent PNG, square source, final optimized texture around 512x512 or 256x256.
   - Archive path: `release/games/005/assets/source/lantern-tram-source.png`
   - Optimized path: `release/games/005/assets/lantern-tram.png`
   - Imagegen2 prompt: “A small magical Japanese lantern tram for a 3D mobile browser arcade runner, lacquered miniature train body, warm paper lantern cabin, tiny brass rail wheels, origami ribbon tail, centered readable silhouette, clear forward direction facing upward/away for rail travel, transparent or plain dark background, no text, no watermark, high contrast at small size.”
   - Aspect ratio: square.
2. Dream rail night-sky background source
   - Target: portrait-friendly background/skybox texture suitable for a 3D rail corridor.
   - Archive path: `release/games/005/assets/source/dream-rail-sky-source.png`
   - Optimized path: `release/games/005/assets/dream-rail-sky.png`
   - Imagegen2 prompt: “A dreamlike Japanese paper-theater night sky for a portrait mobile 3D rail runner, floating shrine lantern rails, crescent moon, origami crane constellations, soft indigo and gold atmosphere, open readable center corridor, crop-safe for phone portrait, no characters, no text, no watermark.”
   - Aspect ratio: portrait.
3. Dream rail icon sheet source
   - Target: square icon sheet for UI and decals.
   - Archive path: `release/games/005/assets/source/yume-icons-source.png`
   - Optimized path: `release/games/005/assets/yume-icons.png`
   - Imagegen2 prompt: “Small readable icon sheet for a dream rail arcade game: golden dream ticket, star fragment, lucid bell, lantern heart, moon gate, cracked nightmare rail, black paper moth, dawn arrival bell, safe rail glow, sleep meter moon, transparent or plain dark background, high contrast, no text, no watermark.”
   - Aspect ratio: square.

If Imagegen2 is unavailable or fails after a real attempt, create a clearly labeled emergency fallback using simple SVG/canvas/Three.js materials, document the failure in `ai/postmortems/day-005.md`, and still keep source/fallback files under the same asset paths.

### Mandatory generated-image QA

For every generated image, include a real inspection step after generation and before integration:

- Analyze the actual generated file visually, not just the prompt text.
- For the lantern tram, verify transparent/cutout quality or clean background removal, readable silhouette, centered pivot, crop margins, no unwanted text/watermarks, and a clear forward travel direction.
- Verify control-to-motion alignment in-game: lane changes should visually tilt/slide the tram in the matching direction, and the tram must not appear sideways or backwards while moving forward along rails.
- For the background, verify the center corridor remains readable after portrait mobile crop and does not hide rails, gates, tickets, or hazards.
- For icon sheets, verify icons are distinct at final HUD/button size and hazards cannot be confused with collectibles.
- If inspection finds a problem, regenerate or post-process the image and inspect again. Do not ship broken visual assets just because tests pass.

## Prompt page output

The archived `release/games/005/prompt.html` must be a consistent rendered HTML page, not raw Markdown pasted into a `<pre>` block. It should include:

- A clear `<title>` and `<h1>` using `Day 005 Game Generation Prompt`.
- A back-to-game link near the top.
- Semantic rendered sections (`h2`, `h3`, `ul/ol/li`, `p`, `pre/code` only for actual code/commands).
- The same readable prompt-page style pattern across days so prompt pages feel like one system.

## Subagents to dispatch

1. Implementation subagent
   - Build the static 3D game under `apps/day-005-yume-lantern-railrunner/`.
   - Integrate it into immutable release output under `release/games/005/`.
   - Create the public playable route under `release/yume/`.
   - Use static HTML/CSS/JS with Three.js/WebGL and no backend.
   - The public alias must be self-contained or asset paths must be alias-safe.
2. Asset/polish subagent
   - Generate/prepare Imagegen2 assets, archive source files, optimize playable copies, inspect generated images, and tune mobile readability/game feel.
3. QA/browser/mobile subagent
   - Run desktop and mobile smoke checks, verify no console errors, verify menu/tutorial/objective/controls/restart/pause, prompt links, 3D depth gameplay, lane switching, Lucid Bell, and 390x844 portrait layout.
4. Reflection/self-improvement subagent
   - Write `ai/postmortems/day-005.md` after validation with what worked, what failed, generated-image inspection notes, and whether generator/template improvements are justified.

## Acceptance criteria

- Static build passes.
- Mode choice follows the cadence rule: Day 005 is real 3D spatial gameplay with Three.js/WebGL, visible depth, rails/gates/hazards in 3D, and lane movement through space.
- Desktop smoke passes.
- Mobile portrait smoke passes at about 390x844 with readable HUD/tutorial, usable swipe/tap lane controls, no forced landscape canvas, and 44px+ controls.
- Prompt is visible from gallery and release folder.
- `prompts/day-005.md` is copied exactly to `release/games/005/prompt.md`.
- `release/games/005/prompt.html` renders the prompt in browser-readable semantic HTML with the standard prompt-page styling, not a raw Markdown `<pre>` dump.
- Public alias `release/yume/index.html`, `release/yume/prompt.html`, `release/yume/screenshot.png`, and `release/yume/assets/` exist and work.
- Gallery card for Day 005 shows prompt availability, generation duration, public `/yume/` links, and actual generated date.
- Screenshot exists at `release/games/005/screenshot.png` and is non-empty/readable.
- Image/source assets exist under `release/games/005/assets/source/` and optimized assets exist under `release/games/005/assets/`, or a documented emergency fallback exists.
- Every generated image has an inspection note in the postmortem or QA notes; moving tram sprite has verified cutout/background removal, direction/pivot/crop, readability, and control-to-motion alignment.
- No console errors during desktop or mobile smoke.
- Existing `release/games/001/**`, `release/games/002/**`, `release/games/003/**`, and `release/games/004/**` from origin/main remain unchanged.
- No existing release folder is modified unless listed in `release/regeneration-allowlist.json`.
- Do not delete `scripts/launch-nightly-hermes.sh`.
- Do not edit or delete files under `/home/aiko/.hermes/profiles/ryu/cron/100-days-games`.

## Exact validation commands

```bash
pnpm typecheck
pnpm test
pnpm build
pnpm release:validate
pnpm test:smoke
pnpm test:immutable -- --base origin/main
```

Additional required local checks before push:

```bash
# Screenshot/static checks: verify release/games/005/screenshot.png, prompt.md, prompt.html, index.html, release/yume/index.html, release/yume/prompt.html, release/yume/screenshot.png, optimized assets, and source assets exist and are non-empty.
# Prompt copy check: cmp prompts/day-005.md release/games/005/prompt.md
# Prompt HTML check: verify release/games/005/prompt.html has semantic h1/h2/list markup and a back-to-game link, not a raw Markdown dump inside <pre>.
# Browser smoke: open the local/static /yume/ route and verify menu, tutorial, gameplay start, lane switching, Lucid Bell, pause, restart, prompt link, no console errors.
# Mobile smoke: repeat at a portrait phone viewport such as 390x844 and verify playable swipe/tap controls and readable HUD.
# Static screenshot check: inspect release/games/005/screenshot.png for non-empty readable game content.
# Docker/static smoke: build the Docker image locally, run it, curl /yume/ and /yume/prompt.html, then stop the container.
# Immutable guard: confirm no release/games folders from origin/main changed except new Day 005.
```
