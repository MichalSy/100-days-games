# Day 006 Game Generation Prompt

## Game identity

- Day: 006
- Title: Sora Tideglass Observatory
- Slug: sora-tideglass-observatory
- Public route word: sora
- Mode: hybrid 3D
- Genre: mobile-first 3D light-reflection puzzle arcade / observatory alignment score chase
- Mood/style: floating night-sky observatory above calm clouds, brass-and-glass Japanese instrument craft, moonlit prisms, tide pools in the sky, quiet puzzle tension, tactile mobile play, readable portrait 3D

## Why this game today

The current generated series is:

- Day 001 `2d`: Koi pond collection and drift survival.
- Day 002 `2d`: sky courier route delivery.
- Day 003 `3d`: neon bonsai ring-flight crafting.
- Day 004 `2d`: firefly path drawing / light routing.
- Day 005 `3d`: dream-rail lane runner.

The latest generated mode is Day 005 `3d`, so Day 006 does not need to force another 3D entry, but it should still avoid defaulting to flat canvas repetition. Day 006 uses a meaningful hybrid 3D form: the player manipulates a compact 3D observatory board and physically routes moonbeams through depth-separated prisms. It is not a runner, delivery game, path drawing game, ring flight game, or top-down collection game. The key verbs are rotate, align, preview, commit, and stabilize.

Recent screenshot variety notes:

- Day 003 had dark cyber-bonsai ring flight with a forward route and HUD-heavy WebGL.
- Day 004 had a richly illustrated moon garden with fireflies and direct line drawing.
- Day 005 had a deep blue rail corridor and bottom lane controls.

Day 006 should be visually calmer and more puzzle-instrument-like: a floating circular observatory table, tall prism towers, visible moonbeam lines, cloud horizon, and a soft gold/cyan tideglass palette. The camera should be slightly isometric/orbiting over a 3D board rather than behind a moving vehicle.

## Code isolation / no previous game source

The implementation must be written from scratch for this day. Do not open, inspect, copy, diff, grep, or adapt code from previous games, including old `apps/day-*` folders, old `release/games/NNN/` HTML/CSS/JS files, or old public alias folders. You may inspect previous metadata, prompts, postmortems, and screenshots only to avoid repeating concepts and visual identity. The new game's HTML/CSS/JS must come from this prompt and general web/game knowledge, not from earlier game implementations.

## Mode variety / 3D cadence

Inspection target: `src/data/games.ts` currently ends with Day 003 `3d`, Day 004 `2d`, Day 005 `3d`. The current latest 2D streak is zero.

Mode decision: Day 006 is `hybrid 3D`. It must use real 3D spatial gameplay, not just 2D art with perspective decoration:

- Use Three.js/WebGL or equivalent static browser 3D rendering for a perspective/isometric observatory board.
- Render the observatory table, prism towers, moonbeam source, lens rings, tideglass reservoirs, hazards, and constellation targets as 3D objects or depth-aware textured planes.
- Gameplay must depend on object positions/rotations in 3D space: players rotate/select prisms and route beams across depth-separated sockets.
- Beam previews must visibly travel through 3D space with glow/fog/depth cues.
- Portrait mobile is the default supported layout; no landscape gate.

## Design

- Objective: Align floating prism towers and tideglass lenses so moonbeams reach constellation receivers before the sky tide overflows the observatory.
- Win condition: Complete three constellations — Crane, Fox, and Dawn Gate — and reach 2200 points to trigger “Sora Star-Tide Calibration”. After calibration, continue in endless score chase with new constellation orders.
- Lose condition: The tide meter fills to 100% because too many beams miss, unstable eclipse shards strike active lenses, or the player runs out of calibration time in a phase.
- Core loop:
  1. Start on a title/menu screen with Day 006 badge, mode badge “Hybrid 3D”, route `/sora/`, best score, best calibration time, tutorial, prompt link, and large Start button.
  2. A 3D floating observatory board appears with a central moonbeam emitter, several prism sockets, constellation receivers, and a tideglass meter.
  3. Player taps/clicks a prism tower to select it, then rotates it clockwise/counter-clockwise or drags a large radial dial to change its beam angle.
  4. The current moonbeam previews bounce/branch through prisms; when the beam reaches the requested receiver color/shape, that star node charges.
  5. Charge all required star nodes in the constellation pattern to complete the phase and refill a little tide stability.
  6. Avoid sending beams into eclipse shards, cracked prism faces, or wrong-color receivers too often; mistakes raise the tide meter and break combo.
  7. Use “Still Sky” when charged to slow shard drift and freeze beam decay briefly.
  8. Pause/restart remain available throughout.
- 15+ minute play-value strategy:
  - Save best score, fastest Star-Tide Calibration time, longest perfect alignment streak, and highest endless constellation wave in localStorage.
  - Include three authored constellation phases:
    - Crane: two prisms, clear beam route, slow tide, teaches rotate/select.
    - Fox: three prisms, one branching prism, eclipse shard drift, color matching.
    - Dawn Gate: four prisms, moving receiver, tide pressure, optional bonus star route.
  - Deterministic Day 006 seed varies prism socket order, receiver positions, and bonus star timing while keeping first runs fair.
  - Mastery badges: finish Crane without a miss, complete all three constellations under 160 seconds, make a 12-node perfect streak, reach 3600 in endless.
  - Strategic scoring: fast correct alignment, minimal rotations, perfect routes, bonus stars, and clean phase bonuses all matter.
  - Endless mode after win adds one extra target per wave, faster tide rise, and drifting shards, but keeps hit areas readable on mobile.
- Difficulty scaling:
  - 0-35 seconds: two fixed prism towers, generous receiver, slow tide.
  - 35-95 seconds: three prisms, one wrong-color receiver, first eclipse shard, faster decay if beam is left misaligned.
  - 95-160 seconds: four prisms, branch prism, moving receiver arc, optional bonus target.
  - 160+ seconds/endless: denser constellations, shard drift, shorter perfect-route windows.
  - Keep mobile fair: big selectable prism sockets, large radial controls, high-contrast beams, color+shape labels, forgiving beam hit radius, no tiny star nodes required for survival.
- Scoring/rewards:
  - Correct star node charged: +95 points times alignment combo.
  - Perfect route with no wrong hits: +180 bonus.
  - Bonus comet star: +160 and +15% Still Sky charge.
  - Complete constellation: +360 plus tide meter -18%.
  - Minimal-rotation bonus: +120 if phase used fewer than target rotations.
  - Still Sky unused phase bonus: +140.
  - Sora Star-Tide Calibration: +700 and endless mode unlock.
  - Wrong receiver or shard hit: +8% tide, combo reset, brief warning flash.

## Controls and layout

- Desktop:
  - Mouse click: select prism/lens tower.
  - A/D or Arrow Left/Right: rotate selected prism counter-clockwise/clockwise.
  - Q/E: cycle selected prism.
  - Space or Shift: activate Still Sky when charged.
  - P: pause/resume.
  - R: restart current run.
  - Enter/click: start from menu or confirm restart.
- Mobile/touch:
  - Tap large prism towers to select.
  - Use two large rotate buttons or a thumb-friendly radial dial at the bottom; controls must be at least 56px tall.
  - Swipe horizontally on the selected prism also rotates in 15-degree steps.
  - Large Still Sky button near lower right, at least 56px target.
  - Pause and Restart controls with 44px+ targets.
  - No tiny virtual joystick. The interaction is tap-select plus large rotate controls.
- Mobile layout/orientation:
  - Default target is portrait phone play around 390x844; do not require landscape.
  - 3D canvas fills the central viewport, with compact HUD at top and thumb controls at bottom.
  - HUD must remain legible: score, best, tide meter, phase/constellation, combo, selected prism, Still Sky charge.
  - Tutorial must fit on the first portrait screen; optional details may be collapsible but core controls/objective must be visible.
  - Beam and receiver symbols must combine color, shape, and short labels where needed so hue alone is not required.

## Menu and tutorial

Implement these states:

1. Title screen
   - Shows title “Sora Tideglass Observatory”.
   - Shows Day 006 badge, mode badge “Hybrid 3D”, public route `/sora/`, best score, best calibration time if available, and a prompt link.
   - Shows a large Start button and visible tutorial panel by default.
2. Tutorial text
   - Objective: “Rotate prism towers to guide moonbeams into each constellation before the tideglass overflows.”
   - Selection: click/tap a prism tower; selected tower glows.
   - Rotation: desktop A/D or mobile rotate buttons/radial dial turn the prism.
   - Beam logic: beams reflect through prism arrows; charge all requested star nodes.
   - Hazards: eclipse shards and wrong receivers raise the tide.
   - Still Sky: slows shard drift and stabilizes the beam when charged.
   - Pause/restart: P/R on desktop or visible buttons on mobile.
3. In-game HUD
   - Score, best score, tide meter, combo, current constellation, charged nodes, selected prism, phase timer, Still Sky charge.
   - Pause/restart controls visible or immediately accessible.
4. Prism helper overlay
   - Non-blocking hint near selected prism showing current angle and next rotation step.
   - Must not cover the active beam path on mobile.
5. Pause overlay
   - Resume, restart, tutorial reminder, controls summary, prompt link.
6. Game-over/results overlay
   - Final score, best score, constellation reached, calibration status, perfect streak, mastery badges, restart button.
7. Sora Star-Tide Calibration banner
   - Trigger once per run after all three constellations and 2200 score.
   - Non-blocking cloud horizon brightening, star lines lock into place, tideglass chime; endless play continues after the banner fades.

## Assets

Prefer Imagegen2 (`openai/gpt-image-2`) for final visual art: observatory charm/texture, sky observatory background, icon sheet, and key decorative pieces. Three.js primitives may render prism geometry, beams, receivers, particles, collision volumes, guide rings, and UI chrome. Procedural code may crop, resize, alpha-clean, atlas-pack, optimize, animate, or place generated assets; it should not create final character/background/icon art from scratch unless Imagegen2 is unavailable after a real attempt.

Archive source generated art under `release/games/006/assets/source/` and use optimized playable copies under `release/games/006/assets/`. Also copy optimized playable assets into `apps/day-006-sora-tideglass-observatory/assets/` and the public alias `release/sora/assets/`.

For mobile-first crop safety: keep important content centered, leave 12-16% safe margins, avoid baked-in text, avoid watermarks, avoid tiny details that disappear at final in-game size, and keep high-contrast silhouettes.

Generate or provide at least these final art assets:

1. Tideglass observatory charm/source texture
   - Target: transparent PNG, square source, final optimized texture around 512x512 or 256x256.
   - Archive path: `release/games/006/assets/source/tideglass-observatory-source.png`
   - Optimized path: `release/games/006/assets/tideglass-observatory.png`
   - Imagegen2 prompt: “A miniature floating Japanese sky observatory charm for a 3D mobile browser puzzle game, brass crescent telescope, glass tide hourglass, small shrine roof silhouette, moonlit cyan and warm gold glow, centered readable silhouette, transparent or plain dark background, no text, no watermark, sprite-friendly, high contrast at small size.”
   - Aspect ratio: square.
2. Floating sky observatory background source
   - Target: portrait-friendly background/skybox texture suitable for an isometric 3D board.
   - Archive path: `release/games/006/assets/source/sora-observatory-sky-source.png`
   - Optimized path: `release/games/006/assets/sora-observatory-sky.png`
   - Imagegen2 prompt: “A floating night-sky observatory above soft clouds for a portrait mobile 3D puzzle game, moon, calm blue horizon, distant paper lantern constellations, brass instruments, open readable center area for a 3D board, Japanese magical realism, cyan and gold palette, crop-safe for phone portrait, no characters, no text, no watermark.”
   - Aspect ratio: portrait.
3. Prism/tideglass icon sheet source
   - Target: square icon sheet for UI and decals.
   - Archive path: `release/games/006/assets/source/sora-icons-source.png`
   - Optimized path: `release/games/006/assets/sora-icons.png`
   - Imagegen2 prompt: “Small readable icon sheet for a sky observatory moonbeam puzzle game: moonbeam, prism tower, tideglass meter, Still Sky bell, crane constellation, fox constellation, dawn gate, eclipse shard, bonus comet star, perfect route badge, transparent or plain dark background, high contrast, no text, no watermark.”
   - Aspect ratio: square.

If Imagegen2 is unavailable or fails after a real attempt, create a clearly labeled emergency fallback using simple SVG/canvas/Three.js materials, document the failure in `ai/postmortems/day-006.md`, and still keep source/fallback files under the same asset paths.

### Mandatory generated-image QA

For every generated image, include a real inspection step after generation and before integration:

- Analyze the actual generated file visually, not just the prompt text.
- For the observatory charm, verify transparent/cutout quality or clean background removal, readable silhouette, centered pivot, crop margins, no unwanted text/watermarks, and a stable upright orientation.
- Verify control-to-motion alignment in-game: selected prism rotation and beam direction should visually correspond to rotate buttons/dial direction; the charm/board must not appear sideways or upside-down.
- For the background, verify the center board area remains readable after portrait mobile crop and does not hide beams, prisms, receivers, or hazards.
- For icon sheets, verify icons are distinct at final HUD/button size and hazards cannot be confused with bonus stars or constellation targets.
- If inspection finds a problem, regenerate or post-process the image and inspect again. Do not ship broken visual assets just because tests pass.

## Prompt page output

The archived `release/games/006/prompt.html` must be a consistent rendered HTML page, not raw Markdown pasted into a `<pre>` block. It should include:

- A clear `<title>` and `<h1>` using `Day 006 Game Generation Prompt`.
- A back-to-game link near the top.
- Semantic rendered sections (`h2`, `h3`, `ul/ol/li`, `p`, `pre/code` only for actual code/commands).
- The same readable prompt-page style pattern across days so prompt pages feel like one system.

## Subagents to dispatch

1. Implementation subagent
   - Build the static hybrid 3D game under `apps/day-006-sora-tideglass-observatory/`.
   - Integrate it into immutable release output under `release/games/006/`.
   - Create the public playable route under `release/sora/`.
   - Use static HTML/CSS/JS with Three.js/WebGL and no backend.
   - The public alias must be self-contained or asset paths must be alias-safe.
2. Asset/polish subagent
   - Generate/prepare Imagegen2 assets, archive source files, optimize playable copies, inspect generated images, and tune mobile readability/game feel.
3. QA/browser/mobile subagent
   - Run desktop and mobile smoke checks, verify no console errors, verify menu/tutorial/objective/controls/restart/pause, prompt links, 3D board interaction, prism selection/rotation, Still Sky, and 390x844 portrait layout.
4. Reflection/self-improvement subagent
   - Write `ai/postmortems/day-006.md` after validation with what worked, what failed, generated-image inspection notes, code-isolation confirmation, and whether generator/template improvements are justified.

## Acceptance criteria

- Static build passes.
- Code isolation is documented in QA/postmortem: no previous game implementation code was opened, inspected, copied, diffed, grepped, or adapted.
- Mode choice follows the cadence rule: Day 006 is meaningful hybrid 3D spatial gameplay with a 3D board, prism towers, depth-aware beams, and rotation/alignment mechanics.
- Desktop smoke passes.
- Mobile portrait smoke passes at about 390x844 with readable HUD/tutorial, usable tap/rotate controls, no forced landscape canvas, and 44px+ controls.
- Prompt is visible from gallery and release folder.
- `prompts/day-006.md` is copied exactly to `release/games/006/prompt.md`.
- `release/games/006/prompt.html` renders the prompt in browser-readable semantic HTML with the standard prompt-page styling, not a raw Markdown `<pre>` dump.
- Public alias `release/sora/index.html`, `release/sora/prompt.html`, `release/sora/screenshot.png`, and `release/sora/assets/` exist and work.
- Gallery card for Day 006 shows prompt availability, generation duration, public `/sora/` links, and actual generated date.
- Screenshot exists at `release/games/006/screenshot.png` and is non-empty/readable.
- Image/source assets exist under `release/games/006/assets/source/` and optimized assets exist under `release/games/006/assets/`, or a documented emergency fallback exists.
- Every generated image has an inspection note in the postmortem or QA notes; moving/interactive prism/board visuals have verified cutout/background handling, orientation/pivot/crop, readability, and control-to-motion alignment.
- No console errors during desktop or mobile smoke.
- Existing `release/games/001/**`, `release/games/002/**`, `release/games/003/**`, `release/games/004/**`, and `release/games/005/**` from origin/main remain unchanged.
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
# Screenshot/static checks: verify release/games/006/screenshot.png, prompt.md, prompt.html, index.html, game.js, styles.css, release/sora/index.html, release/sora/prompt.html, release/sora/screenshot.png, optimized assets, and source assets exist and are non-empty.
# Prompt copy check: cmp prompts/day-006.md release/games/006/prompt.md
# Prompt HTML check: verify release/games/006/prompt.html has semantic h1/h2/list markup and a back-to-game link, not a raw Markdown dump inside <pre>.
# Browser smoke: open the local/static /sora/ route and verify menu, tutorial, gameplay start, prism selection, rotate controls, Still Sky path, pause, restart, prompt link, no console errors.
# Mobile smoke: repeat at a portrait phone viewport such as 390x844 and verify playable tap/rotate controls and readable HUD.
# Static screenshot check: inspect release/games/006/screenshot.png for non-empty readable game content.
# Docker/static smoke: build the Docker image locally, run it, curl /sora/ and /sora/prompt.html, then stop the container.
# Immutable guard: confirm no release/games folders from origin/main changed except new Day 006.
```
