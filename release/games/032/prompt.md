# Day 032 Game Generation Prompt

## Game identity

- Day: 032
- Title: Onsen Steamline Bathkeeper
- Slug: onsen-steamline-bathkeeper
- Public route word: onsen
- Mode: 3D
- Genre: mobile-first 3D thermal-routing puzzle arcade / steam-valve management / spatial bathhouse score chase
- Mood/style: cozy mountain onsen bathhouse at blue dawn, cedar tubs, stone pools, bamboo water spouts, warm lantern fog, pearly steam ribbons, copper valve wheels, mineral-water glow, sleepy snow macaque bath helper, paper noren curtains without readable text, tactile valve-click and steam-hiss feedback; real 3D near/mid/far pools and vertical steam depth rather than ikebana floral balance, mikan orchard harvesting, kumiko woodworking, foxfire stealth, matcha whisking, fireworks arcs, pachinko, mochi hopping, sumi tracing, kite cartography, dry-garden raking, underwater oxygen, taiko rhythm lanes, daruma rolling, web weaving, pottery shaping, bamboo canal irrigation, origami folding, parasol rain procession, snow lantern stacking, kimono stamping, bento cooking, windbell tuning, rail running, or koi collection.

## Why this game today

The generated series currently ends with:

- Day 029 `2d`: Hinoki kumiko woodworking with warm cypress workbench, rectangular lattice panels, blueprint guides, strips, notches, clamps, burrs, and stress management.
- Day 030 `3d`: Mikan Sunwheel Orchard with bright citrus canopy, 3D tree depth, basket orbit/height, ripeness windows, crates, hornets, and sunny green/orange UI.
- Day 031 `2d`: Botan Ikebana Balance Atelier with pale floral studio, suiban/kenzan, stems, peony blooms, negative-space silhouettes, freshness, and balance meters.

The latest generated-mode streak is one `2d` (Day 031). Day 032 deliberately chooses real `3D` to keep the cadence strong and to leave tabletop craft/floral composition behind. The new verb set is thermal bathhouse orchestration: rotate copper valves in a 3D bathhouse, route warm/cool steam through depth-separated ducts, tune three pool temperatures, vent pressure before mineral fog overloads, rescue sleepy macaques from too-hot pools, and use Yuge Focus to preview steam direction and temperature drift.

Recent screenshot/visual variety notes to avoid repeating:

- Day 031 used cream/pink ikebana studio, a large pale suiban canvas, peony/stem/negative-space motifs, floral helper, and many rounded cream HUD cards.
- Day 030 used a sunny orchard, green 3D canopy, orange fruit, bamboo baskets/crates, hornets, sunwheel beams, and yellow-green/orange controls.
- Day 029 used warm cypress workbench, rectangular shoji/kumiko geometry, blueprint lines, strips, clamps, chisels, sawdust, and tan woodworking controls.

Day 032 should shift to humid blue-gold onsen atmosphere: cedar tubs, rounded stone basins, copper pipes and valve wheels, layered steam ribbons, bamboo spouts, mineral temperature glows, frosted mountain window silhouettes, tiny snow macaque helper, and soft bathhouse lantern reflections. Avoid flowers/stems/vases/negative-space cards, citrus trees/crates/hornets/sunwheels, wooden lattice panels/tools/clamps, foxfire/torii/stealth cones, matcha bowls/foam/whisks, fireworks/night sky/smoke rings, pachinko coins/cats, rabbits/mochi pads, calligraphy strokes, kite threads/star maps, dry sand/stone gardens, underwater diving/oxygen/pearls, taiko pads, tilt mazes, silk webs, pottery wheel profiles, bamboo irrigation grids, origami crease routes, rain parasols, snow block stacking, kimono panels, restaurant timers, or generic pipe-connecting clones.

## Code isolation / no previous game source

The implementation must be written from scratch for this day. Do not open, inspect, copy, diff, grep, or adapt code from previous games, including old `apps/day-*` folders, old `release/games/NNN/` HTML/CSS/JS files, or old public alias folders. You may inspect previous metadata, prompts, postmortems, and screenshots only to avoid repeating concepts and visual identity. The new game's HTML/CSS/JS must come from this prompt and general browser/Three.js/WebGL/WebAudio game knowledge, not from earlier game implementations.

## Mode variety / 3D cadence

Inspection target: `src/data/games.ts` currently ends with Day 029 `2d`, Day 030 `3d`, and Day 031 `2d`. The latest generated-mode streak is one `2d`.

Mode decision: Day 032 is real `3D`. It must implement meaningful spatial gameplay, not decorative perspective:

- Use Three.js/WebGL or equivalent static-browser 3D rendering.
- Render an actual depth-visible bathhouse board with near/mid/far cedar/stone pools, raised copper steam ducts, vertical vent chimneys, valve wheels, bamboo spouts, pressure gauges, mineral glow zones, macaque bathers, fog layers, and a camera that makes front/back/height readable.
- Gameplay must depend on 3D state: valve orientation, duct depth lane, steam temperature, cool-water mixing, vent pressure, pool heat drift, macaque comfort, mineral bloom timing, condensation hazards, and camera framing.
- Player actions must manipulate the 3D system: select a valve, rotate heat/cool flow, open/close vent chimneys, stir a target pool, switch active depth lane, guide a bamboo spout, cool a macaque pool, use Yuge Focus to slow/preview thermal flow, pause/restart, and inspect tutorial hints.
- Portrait mobile is the default supported layout; no landscape gate.

## Design

- Objective: Keep bathhouse guests comfortable by routing warm and cool steam through 3D ducts, tuning each onsen pool to the requested temperature band, venting pressure safely, and completing mineral-bloom commissions before fog overloads the bathhouse.
- Win condition: Complete three commissions — First Cedar Soak, Moonstone Mineral Loop, and Snow-Monkey Dawn Bath — while reaching 4600 points to trigger “Onsen Grand Yuge”. After the banner, continue into endless bathhouse commissions.
- Lose condition: Three comfort hearts are lost, pressure reaches 100%, any pool stays scalding/freezing too long, the commission timer expires, or three macaque guests flee from temperature shock in one run.
- Core loop:
  1. Start on a title/menu screen with Day 032 badge, mode badge “3D”, public route `/onsen/`, best score, best Grand Yuge time, tutorial, prompt link, and a large Start button.
  2. Show a portrait-friendly 3D onsen board. Three pools occupy near/mid/far depth lanes; copper ducts and bamboo spouts hover between them; valve wheels sit around the board; steam ribbons visibly move through selected channels.
  3. A commission card requests goals such as: “Warm Cedar Pool to 42°C, keep Moonstone Pool 38–40°C, vent pressure twice, soothe 2 macaques, preserve 70% mineral glow.”
  4. Player selects the active valve/depth lane, rotates the valve to route hot steam, cool mist, or neutral flow. Ribbons change color/height and travel through ducts toward pools.
  5. Pools drift toward their current inflow temperature. Good bands glow gold/teal; scalding pools flash red-orange steam; cold pools turn blue and slow commission progress.
  6. Vent Chimney releases excess pressure in the selected lane, but over-venting cools nearby pools and costs combo.
  7. Bamboo Spout nudges cool mineral water toward one pool, rescuing overheated macaques or setting up a precise final temperature.
  8. Stir Pool evens out local hot/cold pockets and speeds stabilization if used while the pool is near target; bad stirring spreads overheated water.
  9. Yuge Focus, charged by keeping multiple pools in comfort bands, slows thermal drift and overlays arrows, predicted temperatures, safe vent windows, and macaque comfort bubbles for a short time.
  10. Completing a commission lights a lantern seal, restores one comfort heart if needed, awards points, and unlocks tighter temperature bands, layered ducts, condensation hazards, and sleepier macaque guests.
  11. Pause/restart remain available throughout.
- 15+ minute play-value strategy:
  - Save best score, fastest Onsen Grand Yuge time, longest comfort-band chain, highest endless commission, lowest pressure finish, fewest fleeing guests, best mineral-glow score, most perfect vent windows, and collected bathhouse seal badges in localStorage.
  - Include three authored commissions:
    - First Cedar Soak: one hot duct, one cool spout, broad 37–43°C comfort band, slow pressure, guided first valve rotation, no comfort-heart penalty during first tutorial mistake.
    - Moonstone Mineral Loop: adds near/mid/far duct switching, two pools with different targets, first pressure vent timing, mineral glow preservation, and first macaque comfort bubble.
    - Snow-Monkey Dawn Bath: adds cold dawn drafts, tighter 39–41°C target, condensation slip clouds, two macaques, required Yuge Focus preview, and limited over-vent tolerance.
  - Deterministic Day 032 seed varies pool target temperatures, valve wheel order, duct depth routes, steam drift speed, cool-water recharge, macaque patience, pressure thresholds, condensation spawns, vent-window bonuses, and endless constraints while keeping the opening fair.
  - Mastery badges: finish First Cedar Soak with zero pressure warnings, trigger Grand Yuge under 265 seconds, hold all three pools in comfort band for 18 seconds, complete Moonstone Mineral Loop with 85%+ mineral glow, finish a commission without over-venting, complete an endless bath with all comfort hearts.
  - Strategic scoring rewards planning: preheat cold pools before switching lanes, alternate hot steam and cool spout instead of overcorrecting, vent right before pressure spikes, stir only near target, save Yuge Focus for multi-pool thermal drift, prioritize macaque comfort over small score bonuses, and accept slower mineral bloom rather than scalding a pool.
  - Endless mode after Grand Yuge adds narrower bands, more duct crossovers, faster pressure rise, colder draft gusts, fog-obscured valves, rarer cool-spout charges, and mixed guest comfort goals without shrinking touch controls.
- Difficulty scaling:
  - 0–45 seconds: single depth lane, broad comfort band, slow thermal drift, broad vent window, guided first valve.
  - 45–145 seconds: two depth lanes, two pools, first macaque comfort, pressure venting, cool spout management.
  - 145–265 seconds: three pools, tight target bands, dawn draft, condensation hazards, required Yuge Focus preview.
  - 265+ seconds/endless: faster pressure, narrower temperature bands, more guest bubbles, same readable controls.
  - Keep mobile fair: pools, temperature numbers, valve wheels, duct arrows, steam ribbons, pressure/comfort warnings, macaque bubbles, commission card, and action buttons must be large/readable at 390x844; primary touch buttons should be 52px+ where possible and never below 44px; no tiny survival-critical valves.
- Scoring/rewards:
  - Pool held in requested comfort band: +95 points per tick with combo tier.
  - Correct valve rotation into target duct: +135 points and Yuge Focus charge.
  - Perfect vent window under high pressure: +170 points and pressure relief.
  - Bamboo Spout rescues an overheated pool before guest shock: +160 points.
  - Stir Pool stabilizes a near-target pool: +145 points.
  - Macaque comfort bubble satisfied: +240 bonus.
  - Commission complete below pressure target: +840 points and restore one comfort heart if below max.
  - Perfect no-shock bath: +1100 points.
  - Onsen Grand Yuge: +2200 points and endless commissions unlock.
  - Scalding/freezing shock: comfort-heart damage if threshold crossed, combo reset, pressure spike.
  - Over-venting: cools nearby pools, lowers mineral glow, soft-resets combo.

## Controls and layout

- Desktop:
  - Mouse click/tap: press action buttons, select valve wheels/pool chips, start/pause overlay button, prompt link, or explainable HUD chips.
  - Mouse drag on the 3D stage: orbit the bathhouse camera slightly or select a valve; click-to-rotate must remain clear and non-ambiguous.
  - Arrow keys or A/D: select previous/next valve or depth lane.
  - W/S or Up/Down: switch near/mid/far active lane or target pool.
  - Q/E: rotate active valve counterclockwise/clockwise through hot/neutral/cool/outlet states.
  - Space or Enter: apply/confirm valve flow or Stir Pool depending on state.
  - V: Vent Chimney.
  - B: Bamboo Spout.
  - T: Stir Pool.
  - Shift or F: Yuge Focus when charged.
  - P: pause/resume.
  - R: restart current run.
- Mobile/touch:
  - Use large Lane −, Lane +, Valve −, Valve + controls plus optional tap-to-select on large valve wheels and pool cards.
  - Use large Vent Chimney, Bamboo Spout, Stir Pool, Yuge Focus, Pause, Restart, and Prompt buttons.
  - Tapping temperature/pressure/macaque/mineral chips may show short explanations.
  - No tiny virtual joystick. Interaction is lane/valve stepping, tap-select, rotating, venting, spout-cooling, stirring, focus, pause/restart.
- Mobile layout/orientation:
  - Default target is portrait phone play around 390x844; do not require landscape.
  - Top: compact bathhouse HUD with score, best, comfort hearts, pressure %, combo, active lane, active pool temperature, Yuge Focus charge, mineral glow, and elapsed time. Use onsen/pool/steam/valve/bamboo/macaque/fog chips, not flowers/fruit/wood/shrine/tea/firework/cat/rabbit/brush/kite icons.
  - Below top: commission card with target temperatures, pool progress, pressure limit, macaque comfort, vent/spout requirements, mineral-glow target, and progress ticks.
  - Center: large 3D onsen stage with readable pools, valve wheels, ducts, steam arrows, temperature glows, macaque helper/guests, pressure vents, condensation warnings, and depth cues. It must remain playable without zooming.
  - Bottom: status helper plus large movement/action controls. Controls must not cover active valve wheels, pool temperature labels, steam arrows, pressure warnings, or macaque comfort bubbles.
  - Tutorial must fit on the first portrait screen; optional details may be collapsible but objective, valve rotation, depth lanes, pool temperature bands, pressure venting, bamboo spout, stir, Yuge Focus, pause/restart must be visible.
  - Requests must combine text, icons, temperature numbers, symbols, line styles, progress ticks, and shapes so hue alone is not required.

## Menu and tutorial

Implement these states:

1. Title screen
   - Shows title “Onsen Steamline Bathkeeper”.
   - Shows Day 032 badge, mode badge “3D”, public route `/onsen/`, best score, best Grand Yuge time if available, and a prompt link.
   - Shows a large Start button and visible tutorial panel by default.
   - Notes: “Audio starts after you press Start; visual temperature, pressure, and steam-flow cues work if muted.”
2. Tutorial text
   - Objective: “Route steam through copper ducts, tune each pool to its comfort band, vent pressure, and keep macaques cozy.”
   - Valves: select a lane/valve, rotate toward hot, cool, neutral, or outlet flow; steam arrows show current direction.
   - Temperature: each pool drifts toward its inflow; gold/teal means safe, red means scalding, blue means too cold.
   - Pressure: vent before the gauge peaks; over-venting cools pools and lowers mineral glow.
   - Tools: Bamboo Spout cools one pool, Stir Pool stabilizes near-target water.
   - Yuge Focus: slows thermal drift and previews predicted temperatures and safe vent windows.
   - Pause/restart: P/R on desktop or visible buttons on mobile.
3. In-game HUD
   - Score, best score, comfort hearts, pressure %, commission name, combo, active lane, active valve state, pool temperatures, mineral glow, macaque comfort, Yuge Focus charge, elapsed time, latest warning.
   - Pause/restart controls visible or immediately accessible.
4. Status helper
   - Non-blocking helper showing next target pool, valve direction advice, pressure warning, cool-spout readiness, stir timing, Yuge Focus readiness, and expected score effect.
   - Must not cover the 3D onsen stage or bottom controls on mobile.
5. Pause overlay
   - Resume, restart, tutorial reminder, controls summary, audio/mute toggle, prompt link.
6. Game-over/results overlay
   - Final score, best score, commission reached, Grand Yuge status, comfort-band chain, pressure finish, guest shocks/flees, mineral glow, badges, restart button.
7. Onsen Grand Yuge banner
   - Trigger once per run after all three commissions and 4600 score.
   - Non-blocking celebration: lantern fog turns gold, steam ribbons braid into a yuge crest, macaques settle happily in perfect-temperature pools, bamboo spouts chime, and endless commissions continue after the banner fades.

## Assets

Prefer Imagegen2 (`openai/gpt-image-2`) for final visual art: snow macaque bathhouse helper mascot, portrait onsen bathhouse background, valve/pool/steam/tool icon sheet, and decorative Grand Yuge seal pieces. Three.js primitives may render interactive 3D pools, ducts, valve wheels, steam ribbons, temperature glows, pressure vents, macaque comfort bubbles, condensation clouds, camera, particles, and UI chrome. Procedural code may crop, resize, alpha-clean, atlas-pack, optimize, animate, or place generated assets; it should not create final character/background/icon art from scratch unless Imagegen2 is unavailable after a real attempt.

Archive source generated art under `release/games/032/assets/source/` and use optimized playable copies under `release/games/032/assets/`. Also copy optimized playable assets into `apps/day-032-onsen-steamline-bathkeeper/assets/` and the public alias `release/onsen/assets/`.

For mobile-first crop safety: keep important content centered, leave 12–16% safe margins, avoid baked-in text, avoid watermarks, avoid fake UI labels, avoid tiny valve/tool details that disappear at final in-game size, and keep helper/pool/steam/valve/bamboo/pressure/focus silhouettes distinct against misty bathhouse backgrounds.

Generate or provide at least these final art assets:

1. Snow macaque bathhouse helper mascot
   - Target: transparent PNG if possible, square source, final optimized texture around 512x512 or 256x256.
   - Archive path: `release/games/032/assets/source/onsen-helper-source.png`
   - Optimized path: `release/games/032/assets/onsen-helper.png`
   - Imagegen2 prompt: “A charming friendly snow macaque onsen bathhouse helper mascot for a mobile 3D thermal-routing browser puzzle game, small Japanese macaque wearing a tiny indigo bathhouse towel headband, holding a bamboo ladle and copper valve key, cozy calm expression, warm lantern steam rim light, centered readable silhouette, transparent or solid pale mist background, no checkerboard background, no text, no watermark, sprite-friendly, high contrast at small size.”
   - Aspect ratio: square.
2. Onsen bathhouse background source
   - Target: portrait-friendly background suitable behind a 3D bathhouse board with open readable center.
   - Archive path: `release/games/032/assets/source/onsen-bathhouse-source.png`
   - Optimized path: `release/games/032/assets/onsen-bathhouse.png`
   - Imagegen2 prompt: “A cozy Japanese mountain onsen bathhouse for a portrait mobile 3D thermal puzzle game, cedar tubs, rounded stone pools, copper steam pipes, bamboo water spouts, paper lanterns, noren curtains with no readable text, frosted mountain window silhouettes, pearly dawn steam, warm blue-gold light, open readable central floor area for interactive 3D pools and valve ducts, crop-safe for phone portrait, no characters in the center, no readable text, no watermark.”
   - Aspect ratio: portrait.
3. Onsen pool, valve, steam, bamboo spout, pressure, and bathhouse UI icon sheet source
   - Target: square icon sheet for objectives, hazards, tools, rewards, and UI decals.
   - Archive path: `release/games/032/assets/source/onsen-icons-source.png`
   - Optimized path: `release/games/032/assets/onsen-icons.png`
   - Imagegen2 prompt: “Small readable icon sheet for a Japanese onsen steam-routing arcade puzzle game: cedar hot-spring pool, stone mineral pool, copper valve wheel, hot steam ribbon, cool mist ribbon, bamboo water spout, vent chimney, pressure gauge, thermometer, condensation droplet, snow macaque face, Yuge Focus steam emblem, comfort heart, mineral glow crystal, Grand Yuge bathhouse seal, transparent or solid pale mist background, no checkerboard background, high contrast, no text, no watermark, generous margins so no icons are cut off.”
   - Aspect ratio: square.

If Imagegen2 is unavailable or fails after a real attempt, create a clearly labeled emergency fallback using simple SVG/Three.js macaque/pool/valve silhouettes, document the failure in `ai/postmortems/day-032.md`, and still keep source/fallback files under the same asset paths.

### Mandatory generated-image QA

For every generated image, include a real inspection step after generation and before integration:

- Analyze the actual generated file visually, not just the prompt text.
- For the macaque helper mascot, verify transparent/cutout quality or clean background handling, readable friendly silhouette, centered pivot/crop margins, no unwanted text/watermarks, stable upright helper orientation, and that ladle/valve-key pose does not imply incompatible movement or rotation.
- Verify control-to-motion alignment in-game: Lane −/+ must visibly change near/mid/far focus, Valve −/+ must rotate the active valve and reroute steam, Vent Chimney must visibly release pressure and alter gauge/steam, Bamboo Spout must visibly cool the intended pool, Stir Pool must visibly stabilize target water, and Yuge Focus must slow/preview predicted temperatures/flows.
- For the background, verify the central bathhouse board remains readable after portrait mobile crop and does not hide pools, ducts, valves, temperature labels, steam arrows, commission card, helper, or controls.
- For the icon sheet, verify cedar pool, stone pool, valve wheel, hot steam, cool mist, bamboo spout, vent chimney, pressure gauge, thermometer, condensation, macaque, Yuge Focus, comfort heart, mineral glow, and Grand Yuge seal are distinct at final HUD/button size and cannot be confused. Watch specifically for fake checkerboard transparency; alpha-clean or composite onto pale mist if needed and inspect again.
- If inspection finds a problem, regenerate or post-process the image and inspect again. Do not ship broken visual assets just because tests pass.

## Audio and game feel

Because steam, valves, water temperature, pressure, and cozy bathhouse atmosphere are central to the theme, include lightweight WebAudio cues initialized only after a user gesture:

- Soft wooden clack when switching lane or selecting a valve.
- Copper valve tick when rotating Valve −/+.
- Warm steam hiss when hot flow reaches a duct.
- Cool bamboo splash when Bamboo Spout rescues a pool.
- Gentle water swirl when Stir Pool stabilizes temperature.
- Pressure kettle whistle when the gauge nears danger.
- Soft macaque chirp when guest comfort improves.
- Misty bell shimmer when Yuge Focus activates.
- Rising koto/bamboo/water arpeggio when Onsen Grand Yuge triggers.

Audio must not block play if WebAudio is unavailable. Verify no autoplay errors: audio context should be created/resumed only after Start or another user interaction. Include a visible mute toggle in pause/results or HUD.

## Prompt page output

The archived `release/games/032/prompt.html` must be a consistent rendered HTML page, not raw Markdown pasted into a `<pre>` block. It should include:

- A clear `<title>` and `<h1>` using `Day 032 Game Generation Prompt`.
- A back-to-game link near the top.
- Semantic rendered sections (`h2`, `h3`, `ul/ol/li`, `p`, `pre/code` only for actual code/commands).
- The same readable prompt-page style pattern across days so prompt pages feel like one system.

## Subagents to dispatch

1. Implementation subagent
   - Build the static 3D game under `apps/day-032-onsen-steamline-bathkeeper/`.
   - Integrate it into immutable release output under `release/games/032/`.
   - Create the public playable route under `release/onsen/`.
   - Use static HTML/CSS/JS with Three.js/WebGL/WebAudio and no backend.
   - The public alias must be self-contained or asset paths must be alias-safe.
   - If vendoring `three.module*.js`, also copy the matching `three.core*.js` beside it in the app, release archive, and `/onsen/` alias assets.
2. Asset/polish subagent
   - Generate/prepare Imagegen2 assets, archive source files, optimize playable copies, inspect generated images, remove fake checkerboards if present, and tune mobile readability/game feel.
3. QA/browser/mobile subagent
   - Run desktop and mobile smoke checks, verify no console errors, verify menu/tutorial/objective/controls/restart/pause, prompt links, 3D onsen render, Lane/Valve controls, Vent Chimney, Bamboo Spout, Stir Pool, Yuge Focus control presence, temperature/pressure/steam/macaque feedback, generated screenshot, generated assets, WebAudio initialization after user gesture, and 390x844 portrait layout.
4. Reflection/self-improvement subagent
   - Write `ai/postmortems/day-032.md` after validation with what worked, what failed, generated-image inspection notes, audio verification, code-isolation confirmation, and whether generator/template/rubric improvements are justified.

## Acceptance criteria

- Static build passes.
- Code isolation is documented in QA/postmortem: no previous game implementation code was opened, inspected, copied, diffed, grepped, or adapted.
- Mode choice follows the cadence rule: Day 032 is real `3d` after Day 031 `2d`, with valve/duct depth lanes, pool temperatures, steam flow, pressure, vents, and macaque comfort that matter mechanically.
- Desktop smoke passes.
- Mobile portrait smoke passes at about 390x844 with readable HUD/tutorial/commission card, usable 44px+ lane/valve/action/pause/restart controls, no forced landscape canvas, and no tiny survival-critical valves or temperature labels.
- Prompt is visible from gallery and release folder.
- `prompts/day-032.md` is copied exactly to `release/games/032/prompt.md` and `release/onsen/prompt.md`.
- `release/games/032/prompt.html` and `release/onsen/prompt.html` render the prompt in browser-readable semantic HTML with the standard prompt-page styling, not a raw Markdown `<pre>` dump.
- Public alias `release/onsen/index.html`, `release/onsen/prompt.html`, `release/onsen/screenshot.png`, and `release/onsen/assets/` exist and work.
- Gallery card for Day 032 shows prompt availability, generation duration, public `/onsen/` links, mode `3d`, and actual generated date.
- Screenshot exists at `release/games/032/screenshot.png` and is non-empty/readable. Prefer a readable desktop gameplay screenshot for gallery cards; mobile screenshots are QA evidence unless the design is intentionally portrait-card friendly.
- Image/source assets exist under `release/games/032/assets/source/` and optimized assets exist under `release/games/032/assets/`, or a documented emergency fallback exists.
- Every generated image has an inspection note in the postmortem or QA notes; interactive pool/steam/valve/spout/tool visuals have verified background handling, orientation/pivot/crop, readability, and control-to-motion alignment.
- WebAudio initializes after user gesture and creates no autoplay console errors; audio is failsafe if unsupported and visual temperature/pressure/steam cues remain playable muted.
- No console errors during desktop or mobile smoke. Add data-URI favicons to game and prompt pages if needed to avoid favicon request noise.
- Existing `release/games/001/**` through `release/games/031/**` from origin/main remain unchanged.
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
# Screenshot/static checks: verify release/games/032/screenshot.png, prompt.md, prompt.html, index.html, game.js, styles.css, release/onsen/index.html, release/onsen/prompt.html, release/onsen/screenshot.png, optimized assets, source assets, and vendored Three.js files (if used) exist and are non-empty.
# Prompt copy check: cmp prompts/day-032.md release/games/032/prompt.md and cmp prompts/day-032.md release/onsen/prompt.md.
# Prompt HTML check: verify release/games/032/prompt.html has semantic h1/h2/list markup and a back-to-game link, not a raw Markdown dump inside <pre>, and no malformed ul > p or ol > p nodes.
# Browser smoke: open the local/static /onsen/ route and verify menu, tutorial, gameplay start, 3D onsen render, Lane −/+, Valve −/+, Vent Chimney, Bamboo Spout, Stir Pool, Yuge Focus, temperature/pressure/steam/macaque feedback, pause, restart, prompt page, WebAudio after user gesture, no console errors.
# Mobile smoke: repeat at a portrait phone viewport such as 390x844 and verify playable lane/valve/action controls plus readable HUD/commission card/stage/controls.
# Static screenshot check: inspect release/games/032/screenshot.png and release/onsen/screenshot.png for non-empty readable game content; use vision to judge actual visual quality.
# Image QA: inspect every Imagegen2 source/optimized asset and document the actual inspection result in ai/postmortems/day-032.md.
# Docker/static smoke: build the Docker image locally, run it, curl /onsen/ and /onsen/prompt.html, then stop the container.
# Immutable guard: confirm no release/games folders from origin/main changed except new Day 032.
```
