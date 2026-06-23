# Day 012 Game Generation Prompt

## Game identity

- Day: 012
- Title: Yuki Snow Lantern Stacksmith
- Slug: yuki-snow-lantern-stacksmith
- Public route word: yuki
- Mode: 3D
- Genre: mobile-first 3D stacking / balance-crafting arcade score chase
- Mood/style: quiet winter shrine courtyard, powder snow, carved snow lanterns, warm candle amber inside icy blue dusk, vermilion torii accents, porcelain-white snow blocks, crisp silhouettes, cozy tension; tactile 3D construction rather than routing, cooking, rhythm, or pattern stamping

## Why this game today

The generated series currently ends with:

- Day 007 `2d`: seaside bento order-management and conveyor cooking.
- Day 008 `3d`: moss/root tile routing on a miniature forest shrine board.
- Day 009 `hybrid`: shadow-puppet depth lanes, pose matching, and beat cue timing.
- Day 010 `3d`: windbell tuning/routing with hanging 3D bells and gust ribbons.
- Day 011 `2d`: kimono textile motif stamping, symmetry, and moth pressure.

The latest generated-mode streak is one `2d`, so cadence allows either 2D or 3D, but Day 012 deliberately chooses real `3D` to keep the series varied and avoid drifting into flat puzzle boards after Day 011. The new verb set is: rotate a snowy shrine pedestal, choose carved snow blocks, drop/slide them onto a 3D lantern stack, balance weight and warmth, carve vents, shield flame from gusts, and complete sculptural lantern commissions.

Recent screenshot variety notes to avoid repeating:

- Day 009 used a centered portrait puppet stage with dark indigo/amber rails and cue buttons.
- Day 010 used teal-blue 3D hanging bells, horizontal eaves, wind ribbons, and a wide top HUD.
- Day 011 used a pale textile table, kimono-shaped grid, warm rose/ivory palette, right-side stamp tray, and flat 2D cells.

Day 012 should visually shift to a snowy vertical courtyard: a central 3D pedestal and lantern stack rising upward, drifting powder, amber candle glow inside translucent snow, cool twilight blues, vermilion shrine details, and chunky tactile blocks. Avoid route lines, wind ribbons, rail lanes, textile grids, food counters, puppet stages, and repeated six-box HUD layouts.

## Code isolation / no previous game source

The implementation must be written from scratch for this day. Do not open, inspect, copy, diff, grep, or adapt code from previous games, including old `apps/day-*` folders, old `release/games/NNN/` HTML/CSS/JS files, or old public alias folders. You may inspect previous metadata, prompts, postmortems, and screenshots only to avoid repeating concepts and visual identity. The new game's HTML/CSS/JS must come from this prompt and general web/game knowledge, not from earlier game implementations.

## Mode variety / 3D cadence

Inspection target: `src/data/games.ts` currently ends with Day 009 `hybrid`, Day 010 `3d`, and Day 011 `2d`. The latest generated mode streak is one `2d`.

Mode decision: Day 012 is `3D`. It must implement real spatial gameplay, not decorative perspective:

- Use Three.js/WebGL or equivalent static-browser 3D rendering.
- Render an actual 3D snow-lantern work area with a rotating base, height-stacked blocks, depth-visible overhangs, falling pieces, candle glow, wind gust effects, and camera depth cues.
- Gameplay must depend on 3D positions, orientation, stack height, center of mass, overhang, melt heat, and piece shape. A flat 2D grid with fake perspective is not enough.
- Player actions must manipulate 3D objects: select a block, rotate yaw, shift the drop lane left/right/front/back, drop/settle blocks, carve a vent, and shield the lantern flame.
- Portrait mobile is the default supported layout; no landscape gate.

## Design

- Objective: Build stable carved snow lanterns for shrine visitors by stacking 3D snow blocks around a candle core, matching requested silhouettes, keeping the center of mass balanced, and preventing the flame from melting or blowing out the sculpture.
- Win condition: Complete three winter commissions — First Snow Base, Fox Path Window, and Shrine Dawn Spire — while reaching 2800 points to trigger “Yuki Grand Illumination”. After Grand Illumination, continue into endless lantern commissions.
- Lose condition: The lantern collapses from imbalance, the candle flame is snuffed by gusts, melt heat cracks too many blocks, or three visitor patience bells fall.
- Core loop:
  1. Start on a title/menu screen with Day 012 badge, mode badge “3D”, public route `/yuki/`, best score, best Grand Illumination time, tutorial, prompt link, and a large Start button.
  2. Show a 3D winter shrine courtyard with a central circular pedestal, candle core, and a vertical stack area. The player sees incoming snow blocks, current stability, warmth, height, and commission silhouette.
  3. A commission card requests a lantern form using text and chips, for example: “Build 5 layers, keep fox-window opening on front, use two curved caps, warmth below 65%, no red warning overhangs.”
  4. Player selects from incoming snow-block pieces: cube brick, slab, arch/window block, curved roof cap, tiny snow fox charm, and vent chisel.
  5. Player rotates the pedestal/camera or the current piece, shifts the drop target left/right/front/back, then taps Drop to settle the block onto the stack.
  6. Correctly balanced layers glow with amber candle light through the snow; risky overhangs show blue-red stress halos. Carving a vent lowers melt heat but weakens nearby support.
  7. Wind gusts sweep across a visible depth direction. Player can tap Shield to protect the candle flame, but shielding too long slows scoring and raises melt heat.
  8. Completing a commission seals the lantern with a vermilion shrine stamp, awards points, restores one patience bell if needed, and starts the next chapter.
  9. Pause/restart remain available throughout.
- 15+ minute play-value strategy:
  - Save best score, fastest Yuki Grand Illumination time, tallest stable lantern, longest perfect-stack streak, highest endless commission, and collected winter stamp badges in localStorage.
  - Include three authored commissions:
    - First Snow Base: broad base, cube/slab blocks, slow gusts, no collapse for the first tutorial drop, teaches rotate/shift/drop and balance meter.
    - Fox Path Window: arch/window pieces, front/back orientation matters, first candle warmth constraint, first gust-shield decision, fox charm bonus.
    - Shrine Dawn Spire: taller stack, curved roof caps, stricter center-of-mass, vent carving tradeoffs, alternating gust directions, faster patience pressure.
  - Deterministic Day 012 seed varies block queue, gust direction/timing, commission silhouette, fox charm bonus placement, snow quality, and endless constraints while keeping the opening fair.
  - Mastery badges: finish First Snow Base without red stress, stack 12 blocks without collapse, trigger Grand Illumination under 190 seconds, keep candle warmth below 50%, shield 10 gusts, finish an endless commission with all patience bells.
  - Strategic scoring rewards planning ahead: make a wide base, rotate arch windows to match requested face, carve vents only when heat demands it, accept smaller bonuses to keep balance, and save Shield for strong gusts.
  - Endless mode after Grand Illumination adds taller silhouette requests, trickier roof caps, shorter gust warnings, weaker snow blocks, and stricter warmth/balance targets without shrinking touch controls.
- Difficulty scaling:
  - 0-45 seconds: three to four blocks, broad pedestal, forgiving center-of-mass, slow gust preview, no instant collapse during tutorial.
  - 45-115 seconds: arch/window pieces, front/back orientation, warmth cap, first fox charm, gust Shield timing.
  - 115-190 seconds: taller stack, curved caps, vent carving, alternating gusts, narrower stability margin.
  - 190+ seconds/endless: denser commissions, weaker blocks, faster gust warnings, stronger melt pressure, higher combo multipliers, same readable mobile controls.
  - Keep mobile fair: blocks and drop ghost must be large, stress halos thick, commission text short, 56px+ main buttons, no tiny moving hazard required for survival.
- Scoring/rewards:
  - Stable block placed: +55 points times combo tier.
  - Correct requested piece/orientation/face: +95 points.
  - Balanced layer completed with no red stress: +180 points and +10% Shield charge.
  - Fox charm aligned to requested face: +140 points.
  - Gust shielded without overheating: +80 points.
  - Commission complete: +450 points and restore one patience bell if below max.
  - Yuki Grand Illumination: +920 points and endless winter commissions unlock.
  - Risky overhang: combo reset and stability warning.
  - Collapse: patience -1, score penalty, rebuild from last sealed layer if patience remains.
  - Candle snuffed or overheated: patience -1 and warmth reset with a cracked block penalty.

## Controls and layout

- Desktop:
  - Mouse click/tap: select incoming block, action button, start/pause overlay button, or prompt link.
  - Mouse drag: rotate the view/pedestal gently around the stack.
  - A/D or Arrow Left/Right: shift the drop ghost left/right.
  - W/S or Arrow Up/Down: shift the drop ghost front/back.
  - Q/E: rotate the current piece counterclockwise/clockwise.
  - Space or Enter: drop current piece.
  - F: carve vent if the selected piece or top layer allows it.
  - Shift or M: Shield when charged / hold briefly during gust warning.
  - P: pause/resume.
  - R: restart current run.
- Mobile/touch:
  - Tap a large incoming block card to select it.
  - Swipe/drag on the 3D scene to rotate the view/pedestal gently.
  - Use large Shift Left, Shift Right, Shift Front, Shift Back buttons or a four-way D-pad cluster with 44px+ targets.
  - Use large Rotate, Drop, Vent, and Shield buttons.
  - Pause and Restart controls with 44px+ targets.
  - No virtual joystick for movement. Interaction is tap-select, shift ghost, rotate, drop, vent, shield, and optional scene drag.
- Mobile layout/orientation:
  - Default target is portrait phone play around 390x844; do not require landscape.
  - Top: compact winter status ribbon with score, best, patience bells, stability, warmth, chapter, combo, and time. Do not copy Day 010's equal dark stat boxes; use frost-glass chips and a single readable ribbon.
  - Below top: commission card with silhouette request, face/orientation chips, stability/warmth targets, and progress ticks.
  - Center: 3D snow lantern stack on pedestal, with drop ghost, balance plumb line, wind direction ribbon, candle glow, and stress halos visible.
  - Bottom: incoming block queue and large action controls. Controls must not cover the stack or commission card.
  - Tutorial must fit on the first portrait screen; optional details may be collapsible but objective, block selection, shift/rotate/drop, balance, warmth, vent, shield, pause/restart must be visible.
  - Commission requests must combine text, icons, silhouette chips, and face labels so hue alone is not required.

## Menu and tutorial

Implement these states:

1. Title screen
   - Shows title “Yuki Snow Lantern Stacksmith”.
   - Shows Day 012 badge, mode badge “3D”, public route `/yuki/`, best score, best Grand Illumination time if available, and a prompt link.
   - Shows a large Start button and visible tutorial panel by default.
2. Tutorial text
   - Objective: “Stack and carve 3D snow blocks into stable lanterns before the candle melts or the wind snuffs it.”
   - Block selection: tap an incoming block, then position the ghost over the stack.
   - Shift/rotate/drop: use the direction buttons and Rotate before dropping.
   - Balance: keep the plumb line near the center; red stress halos mean collapse risk.
   - Warmth/vents: candle warmth melts snow; carve vents to cool it, but vents weaken support.
   - Wind/Shield: gust arrows show incoming wind; shield the flame at the right time.
   - Pause/restart: P/R on desktop or visible buttons on mobile.
3. In-game HUD
   - Score, best score, patience bells, stability meter, warmth meter, commission name, combo, elapsed time, current block, Shield charge.
   - Pause/restart controls visible or immediately accessible.
4. Placement helper
   - Non-blocking helper near the bottom/side showing current block shape, yaw, target face, expected stability, and whether it satisfies the commission.
   - Must not cover active stack, drop ghost, or bottom controls on mobile.
5. Pause overlay
   - Resume, restart, tutorial reminder, controls summary, prompt link.
6. Game-over/results overlay
   - Final score, best score, commission reached, Grand Illumination status, tallest stable lantern, mastery badges, restart button.
7. Yuki Grand Illumination banner
   - Trigger once per run after all three commissions and 2800 score.
   - Non-blocking amber candle bloom inside the stack, snow sparkle burst, shrine visitors bow, vermilion seal stamp; endless winter commissions continue after banner fades.

## Assets

Prefer Imagegen2 (`openai/gpt-image-2`) for final visual art: snow-lantern artisan mascot, winter shrine courtyard background, snow block/icon sheet, and key decorative pieces. Three.js primitives may render interactive blocks, stack physics approximations, candle light, stress halos, drop ghost, wind ribbons, particles, hit volumes, guide arrows, and UI chrome. Procedural code may crop, resize, alpha-clean, atlas-pack, optimize, animate, or place generated assets; it should not create final character/background/icon art from scratch unless Imagegen2 is unavailable after a real attempt.

Archive source generated art under `release/games/012/assets/source/` and use optimized playable copies under `release/games/012/assets/`. Also copy optimized playable assets into `apps/day-012-yuki-snow-lantern-stacksmith/assets/` and the public alias `release/yuki/assets/`.

For mobile-first crop safety: keep important content centered, leave 12-16% safe margins, avoid baked-in text, avoid watermarks, avoid fake UI labels, avoid tiny snow details that disappear at final in-game size, and keep mascot/block silhouettes distinct against both snow-white and dusk-blue backgrounds.

Generate or provide at least these final art assets:

1. Snow lantern artisan mascot/source charm
   - Target: transparent PNG if possible, square source, final optimized texture around 512x512 or 256x256.
   - Archive path: `release/games/012/assets/source/yuki-artisan-source.png`
   - Optimized path: `release/games/012/assets/yuki-artisan.png`
   - Imagegen2 prompt: “A charming Japanese winter snow-lantern artisan mascot for a mobile 3D browser stacking puzzle arcade game, small friendly shrine craftsperson in indigo winter haori and mittens, holding a carved snow lantern block and tiny amber candle, vermilion scarf accent, centered readable silhouette, transparent or plain pale snow background, no text, no watermark, sprite-friendly, high contrast at small size.”
   - Aspect ratio: square.
2. Winter shrine courtyard background source
   - Target: portrait-friendly background/skybox texture suitable behind a 3D snow-lantern stacking diorama with open readable center.
   - Archive path: `release/games/012/assets/source/yuki-courtyard-source.png`
   - Optimized path: `release/games/012/assets/yuki-courtyard.png`
   - Imagegen2 prompt: “A quiet Japanese winter shrine courtyard at blue dusk for a portrait mobile 3D puzzle game, powder snow, vermilion torii gate edges, stone path, warm lantern glow, falling snow, carved snow lanterns on the sides, open readable center area for a 3D stacking pedestal, crop-safe for phone portrait, no characters, no text, no watermark.”
   - Aspect ratio: portrait.
3. Snow block and UI icon sheet source
   - Target: square icon sheet for incoming block cards, commission chips, warnings, rewards, and UI decals.
   - Archive path: `release/games/012/assets/source/yuki-icons-source.png`
   - Optimized path: `release/games/012/assets/yuki-icons.png`
   - Imagegen2 prompt: “Small readable icon sheet for a Japanese snow lantern stacking puzzle game: cube snow block, slab block, arch window block, curved roof cap, tiny snow fox charm, candle flame, vent chisel, wind gust arrow, shield charm, collapse crack warning, balance plumb line, Grand Illumination seal, transparent or plain icy blue background, high contrast, no text, no watermark.”
   - Aspect ratio: square.

If Imagegen2 is unavailable or fails after a real attempt, create a clearly labeled emergency fallback using simple SVG/canvas/Three.js materials, document the failure in `ai/postmortems/day-012.md`, and still keep source/fallback files under the same asset paths.

### Mandatory generated-image QA

For every generated image, include a real inspection step after generation and before integration:

- Analyze the actual generated file visually, not just the prompt text.
- For the snow-lantern artisan mascot, verify transparent/cutout quality or clean background handling, readable silhouette, centered pivot, crop margins, no unwanted text/watermarks, and stable upright orientation.
- Verify control-to-motion alignment in-game: Shift Left/Right/Front/Back must move the drop ghost in the expected screen/depth direction, Rotate must visibly rotate the current piece, Drop must settle the block exactly where previewed, Vent must affect the intended layer/block, and Shield feedback must align with wind/flame behavior.
- For the background, verify the center play area remains readable after portrait mobile crop and does not hide the stack, drop ghost, commission card, wind warning, stress halos, or controls.
- For the icon sheet, verify cube, slab, arch, roof cap, fox charm, flame, vent chisel, wind, shield, crack, plumb line, and Grand Illumination seal are distinct at final HUD/button size and cannot be confused.
- If inspection finds a problem, regenerate or post-process the image and inspect again. Do not ship broken visual assets just because tests pass.

## Prompt page output

The archived `release/games/012/prompt.html` must be a consistent rendered HTML page, not raw Markdown pasted into a `<pre>` block. It should include:

- A clear `<title>` and `<h1>` using `Day 012 Game Generation Prompt`.
- A back-to-game link near the top.
- Semantic rendered sections (`h2`, `h3`, `ul/ol/li`, `p`, `pre/code` only for actual code/commands).
- The same readable prompt-page style pattern across days so prompt pages feel like one system.

## Subagents to dispatch

1. Implementation subagent
   - Build the static 3D game under `apps/day-012-yuki-snow-lantern-stacksmith/`.
   - Integrate it into immutable release output under `release/games/012/`.
   - Create the public playable route under `release/yuki/`.
   - Use static HTML/CSS/JS with Three.js/WebGL and no backend.
   - The public alias must be self-contained or asset paths must be alias-safe.
   - If vendoring `three.module*.js`, also copy the matching `three.core*.js` beside it in the app, release archive, and `/yuki/` alias assets.
2. Asset/polish subagent
   - Generate/prepare Imagegen2 assets, archive source files, optimize playable copies, inspect generated images, and tune mobile readability/game feel.
3. QA/browser/mobile subagent
   - Run desktop and mobile smoke checks, verify no console errors, verify menu/tutorial/objective/controls/restart/pause, prompt links, 3D scene rendering, block selection, shift controls, rotate, drop, vent, shield, commission completion feedback, generated screenshot, generated assets, and 390x844 portrait layout.
4. Reflection/self-improvement subagent
   - Write `ai/postmortems/day-012.md` after validation with what worked, what failed, generated-image inspection notes, code-isolation confirmation, and whether generator/template/rubric improvements are justified.

## Acceptance criteria

- Static build passes.
- Code isolation is documented in QA/postmortem: no previous game implementation code was opened, inspected, copied, diffed, grepped, or adapted.
- Mode choice follows the cadence rule: Day 012 is real `3d` with actual spatial stacking, depth-aware placement, camera/pedestal rotation, center-of-mass/stability, warmth, wind, and 3D object manipulation.
- Desktop smoke passes.
- Mobile portrait smoke passes at about 390x844 with readable HUD/tutorial/commission card, usable block/shift/rotate/drop/vent/shield controls, no forced landscape canvas, and 44px+ controls.
- Prompt is visible from gallery and release folder.
- `prompts/day-012.md` is copied exactly to `release/games/012/prompt.md` and `release/yuki/prompt.md`.
- `release/games/012/prompt.html` and `release/yuki/prompt.html` render the prompt in browser-readable semantic HTML with the standard prompt-page styling, not a raw Markdown `<pre>` dump.
- Public alias `release/yuki/index.html`, `release/yuki/prompt.html`, `release/yuki/screenshot.png`, and `release/yuki/assets/` exist and work.
- Gallery card for Day 012 shows prompt availability, generation duration, public `/yuki/` links, mode `3d`, and actual generated date.
- Screenshot exists at `release/games/012/screenshot.png` and is non-empty/readable. Prefer a readable desktop gameplay screenshot for gallery cards; mobile screenshots are QA evidence unless the design is intentionally portrait-card friendly.
- Image/source assets exist under `release/games/012/assets/source/` and optimized assets exist under `release/games/012/assets/`, or a documented emergency fallback exists.
- Every generated image has an inspection note in the postmortem or QA notes; interactive block/lantern visuals have verified background handling, orientation/pivot/crop, readability, and control-to-motion alignment.
- If the game uses audio cues, initialize WebAudio only after user gesture and verify no autoplay errors. Audio is optional because this is not a rhythm/sound-themed day.
- No console errors during desktop or mobile smoke. Add data-URI favicon links to game and prompt pages if needed to avoid favicon request noise.
- Existing `release/games/001/**` through `release/games/011/**` from origin/main remain unchanged.
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
# Screenshot/static checks: verify release/games/012/screenshot.png, prompt.md, prompt.html, index.html, game.js, styles.css, release/yuki/index.html, release/yuki/prompt.html, release/yuki/screenshot.png, optimized assets, and source assets exist and are non-empty.
# Prompt copy check: cmp prompts/day-012.md release/games/012/prompt.md and cmp prompts/day-012.md release/yuki/prompt.md.
# Prompt HTML check: verify release/games/012/prompt.html has semantic h1/h2/list markup and a back-to-game link, not a raw Markdown dump inside <pre>, and no malformed ul > p or ol > p nodes.
# Browser smoke: open the local/static /yuki/ route and verify menu, tutorial, gameplay start, 3D render, block selection, shift left/right/front/back, rotate, drop, vent, Shield control presence, pause, restart, prompt page, no console errors.
# Mobile smoke: repeat at a portrait phone viewport such as 390x844 and verify playable tap controls and readable HUD/commission/scene.
# Static screenshot check: inspect release/games/012/screenshot.png and release/yuki/screenshot.png for non-empty readable game content; use vision to judge actual visual quality.
# Image QA: inspect every Imagegen2 source/optimized asset and document the actual inspection result in ai/postmortems/day-012.md.
# Docker/static smoke: build the Docker image locally, run it, curl /yuki/ and /yuki/prompt.html, then stop the container.
# Immutable guard: confirm no release/games folders from origin/main changed except new Day 012.
```
