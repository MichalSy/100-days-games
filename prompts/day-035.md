# Day 035 Game Generation Prompt

## Game identity

- Day: 035
- Title: Hashi Tanuki Bridgewright
- Slug: hashi-tanuki-bridgewright
- Public route word: hashi
- Mode: 2D
- Genre: mobile-first bridge-building physics puzzle / river-load testing / construction score chase
- Mood/style: dusk mountain stream, mossy stones, warm paper lantern survey flags, bamboo beams, rope knots, moonlit water, playful tanuki apprentice bridgewright, tactile wood-creak and rope-tension feedback; side-view structural planning rather than spherical embroidery, fan dyeing, onsen steam routing, ikebana arranging, orchard harvesting, kumiko lattice fitting, foxfire stealth, matcha whisking, fireworks, pachinko, mochi hopping, calligraphy tracing, kite mapping, dry-garden raking, underwater diving, taiko rhythm, daruma rolling, silk-web weaving, pottery shaping, canal irrigation, origami folding, parasol sheltering, snow stacking, kimono stamping, bento cooking, windbell tuning, rail running, or koi collection.

## Why this game today

The generated series currently ends with:

- Day 032 `3d`: Onsen Steamline Bathkeeper with dark teal/copper bathhouse ducts, steam/valves, pool temperature, pressure, and macaque comfort.
- Day 033 `2d`: Uchiwa Fan Dye Maestro with bright fan workshop, radial sectors, pigment/stencil/drying/bleed controls, and a kappa helper.
- Day 034 `3d`: Temari Thread Orbit Weaver with warm night craft table, central 3D sphere, silk thread arcs, pearl pins, tension, symmetry, and sparrow helper.

The latest generated-mode streak is one `3d` (Day 034). Day 035 may safely choose `2d` without extending a 2D streak. This prompt deliberately switches away from recent radial/spherical craft compositions into a side-view engineering puzzle: build a bridge across an animated mountain stream using bamboo beams, rope knots, stone piers, and tension braces, then test it with tanuki porters carrying lantern crates. The play should feel like a tiny structural sandbox with readable forces and repair choices, not a flat decoration task or another centered craft object.

Recent screenshot/visual variety notes to avoid repeating:

- Day 034 used a huge centered dark sphere, warm brown table, cream HUD bars, horizontal button rows, thread colors, pearl pins, and high craft-table density.
- Day 033 used a pale radial fan board, cream/gold palette, large fan wedge geometry, pigment blooms, and a bright washi-paper workspace.
- Day 032 used dark teal/copper 3D bathhouse surfaces, circular pools, valves, ducts, and steam bubbles.

Day 035 should use a wide-but-mobile side-section river scene: left and right riverbanks, water gap, visible bridge deck, triangular bamboo trusses, rope knots, stone piers, load carts, current pulses, stress colors, survey flags, and a tanuki helper. Avoid central balls/fans/pools/flowers/fruit/lattices/foxfire cones/tea foam/firework skies/cat coins/rabbit pads/brush strokes/kite threads/raked sand/underwater pearls/drum pads/labyrinth tilt/spider webs/pottery wheels/canal grids/origami creases/rain parasols/snow blocks/kimono panels/restaurant timers/windbells/rail tracks/koi ponds.

## Code isolation / no previous game source

The implementation must be written from scratch for this day. Do not open, inspect, copy, diff, grep, or adapt code from previous games, including old `apps/day-*` folders, old `release/games/NNN/` HTML/CSS/JS files, or old public alias folders. You may inspect previous metadata, prompts, postmortems, and screenshots only to avoid repeating concepts and visual identity. The new game's HTML/CSS/JS must come from this prompt and general browser/canvas/WebAudio game knowledge, not from earlier game implementations.

## Mode variety / 3D cadence

Inspection target: `src/data/games.ts` currently ends with Day 033 `2d` and Day 034 `3d`. The latest generated-mode streak is one `3d`, so Day 035 is allowed to be `2d`.

Mode decision: Day 035 is rich mobile-first `2d`, chosen after a real 3D day. It must be mechanically deep enough to justify the mode:

- Use a static-browser HTML/CSS/JS game with Canvas/SVG/DOM as appropriate; no backend.
- Render a side-view bridge site with banks, stream, build nodes, bamboo beams, ropes, stone pier sockets, load carts, stress heatmaps, current pulses, and readable repair feedback.
- Gameplay must depend on 2D spatial state: beam length/angle, triangle bracing, knot load, deck sag, pier placement, current force, porter weight, lantern crate balance, budget, repair timing, and route continuity.
- Player actions must manipulate the system: select nodes, place bamboo beams, add rope braces, plant stone piers, remove/repair parts, run a test crossing, slow/preview stress with Survey Focus, pause/restart, and inspect tutorial hints.
- Portrait mobile is the default supported layout; no landscape gate.

## Design

- Objective: Build stable bamboo-and-rope bridges across mountain-stream gaps so tanuki porters can carry lantern crates from the left bank to the shrine storehouse on the right without collapse, budget overrun, or washed-out supports.
- Win condition: Complete three contracts — First Creek Span, Red Gorge Lantern Run, and Moon Shrine Load Test — while reaching 4900 points to trigger “Hashi Grand Crossing”. After the banner, continue into endless bridge contracts.
- Lose condition: Three bridge hearts collapse, stress reaches catastrophic red for too long, a porter falls into the stream, budget debt reaches 100%, the test timer expires, or three repairs fail during one crossing.
- Core loop:
  1. Start on a title/menu screen with Day 035 badge, mode badge “2D”, public route `/hashi/`, best score, best Grand Crossing time, tutorial, prompt link, and a large Start button.
  2. Show a portrait-friendly river construction site. The top HUD is compact; the middle is a wide river gap with banks and build nodes; the lower panel contains large build/test/repair controls.
  3. A contract card requests goals such as: “Span 8m gap, use ≤ 6 bamboo beams, add 2 rope braces, keep max stress under 70%, deliver 3 lantern crates.”
  4. Player selects start/end build nodes using large Node −/+ controls or direct tapping on enlarged sockets. Valid candidate nodes glow; impossible beam lengths show a red ghost preview.
  5. Place Bamboo adds a straight compression/tension member between selected nodes. Strong triangles score well; long flat beams sag.
  6. Add Rope Brace adds a lighter diagonal support that resists sway/current but snaps under too much direct load.
  7. Plant Stone Pier spends budget to anchor a support into the streambed; currents push against it, and bad placement creates whirlpool stress.
  8. Remove/Repair lets the player delete a recent bad part or patch a creaking member during a test, with cooldown and score cost.
  9. Test Crossing sends tanuki porters across the deck with lantern crates. The bridge animates sag, sway, stress color, knot stretch, pier vibration, and water impact. Completing a clean test advances the contract.
  10. Survey Focus, charged by efficient triangles and low-stress tests, slows the crossing and overlays predicted stress lines, load path arrows, weak knots, current push, and recommended repair windows.
  11. Completing a contract stamps a construction seal, restores one bridge heart if needed, awards points, and unlocks longer spans, heavier crates, moving current pulses, fewer piers, and stricter budget goals.
  12. Pause/restart remain visible throughout.
- 15+ minute play-value strategy:
  - Save best score, fastest Hashi Grand Crossing time, longest no-collapse streak, highest endless contract, lowest-budget successful bridge, lowest max-stress bridge, most perfect repair windows, strongest triangle bonus, and collected contract seals in localStorage.
  - Include three authored contracts:
    - First Creek Span: short gap, fixed bank nodes, generous beam limit, one tanuki porter, slow water, tutorial ghost triangle, no heart penalty for the first failed stress preview.
    - Red Gorge Lantern Run: wider gap, limited bamboo, rope braces, first stone pier, two porters with staggered crates, current pulses, and repair timing.
    - Moon Shrine Load Test: asymmetric banks, three lantern crates, moving water push, strict budget, required Survey Focus preview, limited repairs, and target max stress under 75%.
  - Deterministic Day 035 seed varies node positions, gap width, stream pulse timing, bamboo cost, rope strength, pier sockets, crate weight, porter spacing, repair cooldown, and endless constraints while keeping the opening fair.
  - Mastery badges: complete First Creek Span with no red stress, trigger Grand Crossing under 280 seconds, finish Red Gorge under budget, complete Moon Shrine with no repairs, finish a contract below 35% max stress, complete an endless span with all bridge hearts.
  - Strategic scoring rewards planning: build triangles before long decks, use rope for sway not direct load, place piers under compression nodes, keep deck nodes close enough for porters, test early with Survey Focus ready, repair before catastrophic red, and save budget for the final contract.
  - Endless mode after Grand Crossing adds longer spans, heavier crate combinations, gust/current rhythm changes, fewer starting nodes, brittle old bamboo, and optional bonus lantern carts without shrinking touch controls.
- Difficulty scaling:
  - 0-45 seconds: short gap, broad sockets, obvious triangle preview, forgiving stress, slow porter.
  - 45-150 seconds: rope braces, pier placement, two porters, current pulses, budget pressure.
  - 150-280 seconds: asymmetric span, three crates, stricter stress threshold, required Survey Focus preview, limited repairs.
  - 280+ seconds/endless: longer spans, heavier loads, faster currents, brittle parts, same readable controls.
  - Keep mobile fair: build nodes, beams, stress colors, contract card, helper, current arrows, and action buttons must be large/readable at 390x844; touch buttons should be 52px+ where possible and never below 44px; no tiny survival-critical sockets.
- Scoring/rewards:
  - Valid bamboo member in efficient triangle: +120 points times combo tier.
  - Rope brace absorbs sway without red stress: +135 points and Survey Focus charge.
  - Stone pier placed under correct compression node: +160 points and stress relief.
  - Clean load path from bank to bank: +220 points.
  - Test crossing completed with max stress below target: +900 points and restore one bridge heart if below max.
  - Perfect no-repair contract: +1150 points.
  - Low-budget completion: +400 bonus.
  - Hashi Grand Crossing: +2500 points and endless contracts unlock.
  - Invalid/overlong member: no placement, status warning.
  - Wrong brace/pier choice: budget debt, stress +8%, combo reset.
  - Collapse/fall: bridge-heart damage, budget penalty, combo reset.

## Controls and layout

- Desktop:
  - Mouse click/tap: press action buttons, select build nodes, start/pause overlay button, prompt link, or explainable HUD chips.
  - Mouse drag on the bridge stage: pan a small amount or preview beam endpoint; actual placement still uses clearly labeled Select/Build actions.
  - Arrow keys or A/D: select previous/next node.
  - W/S or Up/Down: switch bank/deck/pier node rows.
  - Q/E: choose previous/next material/tool.
  - 1/2/3: choose Bamboo, Rope Brace, or Stone Pier.
  - Space or Enter: Place selected material or start test depending on state.
  - X or Backspace: Remove recent part.
  - H: Repair highlighted weak part.
  - Shift or F: Survey Focus when charged.
  - T: Test Crossing.
  - P: pause/resume.
  - R: restart current run.
- Mobile/touch:
  - Use large Node −, Node +, Row −, Row + controls plus optional direct tap on large bridge sockets.
  - Use large Bamboo, Rope, Stone Pier, Remove, Repair, Test Crossing, Survey Focus, Pause, Restart, and Prompt buttons.
  - Tapping stress/budget/current/porter chips may show short explanations.
  - No tiny virtual joystick. Interaction is node stepping/direct tap, material selection, placement, removal/repair, testing, focus, pause/restart.
- Mobile layout/orientation:
  - Default target is portrait phone play around 390x844; do not require landscape.
  - Top: compact Hashi HUD with score, best, bridge hearts, budget %, max stress %, combo, selected nodes, material, Survey Focus charge, and elapsed time. Use bridge/beam/rope/pier/stress/current/tanuki chips, not thread/fan/pool/flower/fruit/wood-lattice/shrine/tea/firework/cat/rabbit/brush/kite/sand/pearl/drum icons.
  - Below top: contract card with span width, budget, material goals, max-stress target, crate count, repair limit, and progress ticks.
  - Center: large bridge stage with riverbanks, stream, bridge nodes, deck, beams, braces, piers, tanuki porters, lantern crates, stress heatmap, current arrows, helper art, and readable feedback. It must remain playable without zooming.
  - Bottom: status helper plus large node/material/action controls. Controls must not cover build nodes, stress warnings, porters, or current hazards.
  - Tutorial must fit on the first portrait screen; optional details may be collapsible but objective, node selection, bamboo/rope/pier placement, remove/repair, Test Crossing, Survey Focus, pause/restart must be visible.
  - Requests must combine text, symbols, line styles, gauges, and patterns so hue alone is not required.

## Menu and tutorial

Implement these states:

1. Title screen
   - Shows title “Hashi Tanuki Bridgewright”.
   - Shows Day 035 badge, mode badge “2D”, public route `/hashi/`, best score, best Grand Crossing time if available, and a prompt link.
   - Shows a large Start button and visible tutorial panel by default.
   - Notes: “Audio starts after you press Start; visual stress, budget, and current cues work if muted.”
2. Tutorial text
   - Objective: “Build a bamboo bridge, test it with tanuki porters, and keep stress below the contract limit.”
   - Structure: triangles are strong; long flat spans sag; ropes help sway; piers carry vertical load.
   - Selection: step through nodes with Node −/+ and Row −/+ or tap large sockets.
   - Build/test: place Bamboo/Rope/Pier, then Test Crossing when the deck reaches the right bank.
   - Safety: repair creaking red parts before collapse; avoid budget debt.
   - Survey Focus: slows the test and previews weak load paths when charged.
   - Pause/restart: P/R on desktop or visible buttons on mobile.
3. In-game HUD
   - Score, best score, bridge hearts, budget %, max stress %, contract name, combo, selected node pair, active material/tool, current strength, Survey Focus charge, elapsed time, latest warning.
   - Pause/restart controls visible or immediately accessible.
4. Status helper
   - Non-blocking helper showing next target node, triangle advice, budget warning, stress warning, repair timing, Survey Focus readiness, and expected score effect.
   - Must not cover the bridge stage or bottom controls on mobile.
5. Pause overlay
   - Resume, restart, tutorial reminder, controls summary, audio/mute toggle, prompt link.
6. Game-over/results overlay
   - Final score, best score, contract reached, Grand Crossing status, max stress, budget finish, collapses/falls, repairs used, badges, restart button.
7. Hashi Grand Crossing banner
   - Trigger once per run after all three contracts and 4900 score.
   - Non-blocking celebration: tanuki porters parade across the completed bridge, lantern crates glow, river fireflies shimmer, rope knots sparkle, helper stamps a survey seal, and endless contracts continue after the banner fades.

## Assets

Prefer Imagegen2 (`openai/gpt-image-2`) for final visual art: tanuki bridgewright helper mascot, portrait mountain-stream bridge site background, bridge/material/stress/contract icon sheet, and decorative Grand Crossing seal pieces. Canvas/SVG/DOM code may render the interactive bridge nodes, beams, braces, stress heatmap, porters, currents, particles, and UI chrome. It should not create final character/background/icon art from scratch unless Imagegen2 is unavailable after a real attempt.

Archive source generated art under `release/games/035/assets/source/` and use optimized playable copies under `release/games/035/assets/`. Also copy optimized playable assets into `apps/day-035-hashi-tanuki-bridgewright/assets/` and the public alias `release/hashi/assets/`.

For mobile-first crop safety: keep important content centered, leave 12-16% safe margins, avoid baked-in text, avoid watermarks, avoid fake UI labels, avoid tiny tool details that disappear at final in-game size, and keep helper/bridge/beam/rope/pier/stress/current/survey silhouettes distinct against dusk river backgrounds.

Generate or provide at least these final art assets:

1. Tanuki bridgewright helper mascot
   - Target: transparent PNG if possible, square source, final optimized texture around 512x512 or 256x256.
   - Archive path: `release/games/035/assets/source/hashi-helper-source.png`
   - Optimized path: `release/games/035/assets/hashi-helper.png`
   - Imagegen2 prompt: “A charming friendly tanuki bridgewright helper mascot for a mobile 2D Japanese bamboo bridge-building physics puzzle game, small cute tanuki wearing a tiny navy work vest and rope tool belt, holding a bamboo beam and survey flag, kind focused expression, warm lantern rim light, centered readable silhouette, transparent or solid pale parchment background, no checkerboard background, no text, no watermark, sprite-friendly, high contrast at small size.”
   - Aspect ratio: square.
2. Mountain-stream bridge site background source
   - Target: portrait-friendly background suitable behind a side-view bridge-building stage with open readable center.
   - Archive path: `release/games/035/assets/source/hashi-river-site-source.png`
   - Optimized path: `release/games/035/assets/hashi-river-site.png`
   - Imagegen2 prompt: “A dusk Japanese mountain stream construction site for a portrait mobile bridge-building puzzle game, mossy left and right riverbanks, shallow moonlit water gap, bamboo bundles, rope coils, stone pier blocks, paper lantern survey flags at the edges, soft indigo and amber evening light, open readable central river span for interactive bridge beams, crop-safe for phone portrait, no characters in the center, no readable text, no watermark.”
   - Aspect ratio: portrait.
3. Hashi bridge material, stress, and contract UI icon sheet source
   - Target: square icon sheet for objectives, hazards, tools, rewards, and UI decals.
   - Archive path: `release/games/035/assets/source/hashi-icons-source.png`
   - Optimized path: `release/games/035/assets/hashi-icons.png`
   - Imagegen2 prompt: “Small readable icon sheet for a Japanese bamboo bridge-building physics puzzle game: bamboo beam, rope brace, stone pier, bridge node socket, tanuki porter, lantern crate, stress warning crack, budget coin, current arrow, repair mallet, remove saw, Survey Focus blueprint emblem, bridge heart, construction seal, Grand Crossing lantern bridge emblem, transparent or solid pale parchment background, no checkerboard background, high contrast, no text, no watermark, generous margins so no icons are cut off.”
   - Aspect ratio: square.

If Imagegen2 is unavailable or fails after a real attempt, create a clearly labeled emergency fallback using simple SVG/canvas tanuki/bridge/beam/rope/pier silhouettes, document the failure in `ai/postmortems/day-035.md`, and still keep source/fallback files under the same asset paths.

### Mandatory generated-image QA

For every generated image, include a real inspection step after generation and before integration:

- Analyze the actual generated file visually, not just the prompt text.
- For the tanuki helper mascot, verify transparent/cutout quality or clean background handling, readable friendly silhouette, centered pivot/crop margins, no unwanted text/watermarks, stable upright helper orientation, and that beam/flag pose does not imply incompatible movement or rotation.
- Verify control-to-motion alignment in-game: Node −/+ must visibly move the selected node pair along the bridge, Row −/+ must change node row/bank/deck/pier layer, Bamboo/Rope/Pier must change the ghost preview and placed structure, Remove must remove the intended recent part, Repair must visibly lower stress on the intended weak part, Test Crossing must animate tanuki porters crossing the bridge, and Survey Focus must slow/preview load paths, weak knots, current push, and repair windows.
- For the background, verify the central bridge stage remains readable after portrait mobile crop and does not hide nodes, beams, stress heatmap, porters, river current, contract card, helper, or controls.
- For the icon sheet, verify bamboo beam, rope brace, stone pier, node socket, tanuki porter, lantern crate, stress crack, budget coin, current arrow, repair mallet, remove saw, Survey Focus, bridge heart, seal, and Grand Crossing emblem are distinct at final HUD/button size and cannot be confused. Watch specifically for fake checkerboard transparency; alpha-clean or composite onto pale parchment if needed and inspect again.
- If inspection finds a problem, regenerate or post-process the image and inspect again. Do not ship broken visual assets just because tests pass.

## Audio and game feel

Because wood structure, rope tension, river current, load testing, and construction feedback are central to the theme, include lightweight WebAudio cues initialized only after a user gesture:

- Soft node tick when selecting sockets.
- Bamboo clack when placing a beam.
- Rope twang when adding a brace.
- Stone thud when planting a pier.
- Wooden creak that rises as stress approaches red.
- Water splash/current rush when a pier is strained or a collapse happens.
- Repair mallet tap when patching a weak part.
- Blueprint shimmer when Survey Focus activates.
- Rising festival bell and tanuki cheer when Hashi Grand Crossing triggers.

Audio must not block play if WebAudio is unavailable. Verify no autoplay errors: audio context should be created/resumed only after Start or another user interaction. Include a visible mute toggle in pause/results or HUD.

## Prompt page output

The archived `release/games/035/prompt.html` must be a consistent rendered HTML page, not raw Markdown pasted into a `<pre>` block. It should include:

- A clear `<title>` and `<h1>` using `Day 035 Game Generation Prompt`.
- A back-to-game link near the top.
- Semantic rendered sections (`h2`, `h3`, `ul/ol/li`, `p`, `pre/code` only for actual code/commands).
- The same readable prompt-page style pattern across days so prompt pages feel like one system.

## Subagents to dispatch

1. Implementation subagent
   - Build the static 2D game under `apps/day-035-hashi-tanuki-bridgewright/`.
   - Integrate it into immutable release output under `release/games/035/`.
   - Create the public playable route under `release/hashi/`.
   - Use static HTML/CSS/JS with Canvas/SVG/WebAudio and no backend.
   - The public alias must be self-contained or asset paths must be alias-safe.
2. Asset/polish subagent
   - Generate/prepare Imagegen2 assets, archive source files, optimize playable copies, inspect generated images, remove fake checkerboards if present, and tune mobile readability/game feel.
3. QA/browser/mobile subagent
   - Run desktop and mobile smoke checks, verify no console errors, verify menu/tutorial/objective/controls/restart/pause, prompt links, bridge stage render, Node −/+, Row −/+, Bamboo, Rope, Stone Pier, Remove, Repair, Test Crossing, Survey Focus control presence, stress/budget/current/porter feedback, generated screenshot, generated assets, WebAudio initialization after user gesture, and 390x844 portrait layout.
4. Reflection/self-improvement subagent
   - Write `ai/postmortems/day-035.md` after validation with what worked, what failed, generated-image inspection notes, audio verification, code-isolation confirmation, and whether generator/template/rubric improvements are justified.

## Acceptance criteria

- Static build passes.
- Code isolation is documented in QA/postmortem: no previous game implementation code was opened, inspected, copied, diffed, grepped, or adapted.
- Mode choice follows the cadence rule: Day 035 is `2d` after Day 034 `3d`, with rich bridge-physics construction rather than a low-effort flat decoration game.
- Desktop smoke passes.
- Mobile portrait smoke passes at about 390x844 with readable HUD/tutorial/contract card, usable 44px+ node/material/action/pause/restart controls, no forced landscape canvas, and no tiny survival-critical sockets.
- Prompt is visible from gallery and release folder.
- `prompts/day-035.md` is copied exactly to `release/games/035/prompt.md` and `release/hashi/prompt.md`.
- `release/games/035/prompt.html` and `release/hashi/prompt.html` render the prompt in browser-readable semantic HTML with the standard prompt-page styling, not a raw Markdown `<pre>` dump.
- Public alias `release/hashi/index.html`, `release/hashi/prompt.html`, `release/hashi/screenshot.png`, and `release/hashi/assets/` exist and work.
- Gallery card for Day 035 shows prompt availability, generation duration, public `/hashi/` links, mode `2d`, and actual generated date.
- Screenshot exists at `release/games/035/screenshot.png` and is non-empty/readable. Prefer a readable desktop gameplay screenshot for gallery cards; mobile screenshots are QA evidence unless the design is intentionally portrait-card friendly.
- Image/source assets exist under `release/games/035/assets/source/` and optimized assets exist under `release/games/035/assets/`, or a documented emergency fallback exists.
- Every generated image has an inspection note in the postmortem or QA notes; interactive bridge/beam/rope/pier/stress visuals have verified background handling, orientation/pivot/crop, readability, and control-to-motion alignment.
- WebAudio initializes after user gesture and creates no autoplay console errors; audio is failsafe if unsupported and visual stress/budget/current cues remain playable muted.
- No console errors during desktop or mobile smoke. Add data-URI favicons to game and prompt pages if needed to avoid favicon request noise.
- Existing `release/games/001/**` through `release/games/034/**` from origin/main remain unchanged.
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
# Screenshot/static checks: verify release/games/035/screenshot.png, prompt.md, prompt.html, index.html, game.js, styles.css, release/hashi/index.html, release/hashi/prompt.html, release/hashi/screenshot.png, optimized assets, and source assets exist and are non-empty.
# Prompt copy check: cmp prompts/day-035.md release/games/035/prompt.md and cmp prompts/day-035.md release/hashi/prompt.md.
# Prompt HTML check: verify release/games/035/prompt.html has semantic h1/h2/list markup and a back-to-game link, not a raw Markdown dump inside <pre>, and no malformed ul > p or ol > p nodes.
# Browser smoke: open the local/static /hashi/ route and verify menu, tutorial, gameplay start, bridge stage render, Node −/+, Row −/+, Bamboo, Rope, Stone Pier, Remove, Repair, Test Crossing, Survey Focus, stress/budget/current/porter feedback, pause, restart, prompt page, WebAudio after user gesture, no console errors.
# Mobile smoke: repeat at a portrait phone viewport such as 390x844 and verify playable bridge/action controls plus readable HUD/contract card/stage/controls.
# Static screenshot check: inspect release/games/035/screenshot.png and release/hashi/screenshot.png for non-empty readable game content; use vision to judge actual visual quality.
# Image QA: inspect every Imagegen2 source/optimized asset and document the actual inspection result in ai/postmortems/day-035.md.
# Docker/static smoke: build the Docker image locally, run it, curl /hashi/ and /hashi/prompt.html, then stop the container.
# Immutable guard: confirm no release/games folders from origin/main changed except new Day 035.
```
