# Day 030 Game Generation Prompt

## Game identity

- Day: 030
- Title: Mikan Sunwheel Orchard
- Slug: mikan-sunwheel-orchard
- Public route word: mikan
- Mode: 3D
- Genre: mobile-first 3D orchard-harvest routing / ripeness sorting / spatial basket score chase
- Mood/style: bright late-summer Japanese hillside citrus orchard, glossy mikan oranges, bamboo picking baskets, sunlit leaves, indigo work cloth, washi crate labels without readable text, honey-gold afternoon light, soft mountain haze, tiny helpful shiba orchard pup, tactile fruit-pluck and crate-sort feedback; real 3D tree canopy depth and basket height/orbit management rather than kumiko woodworking, foxfire shrine stealth, matcha whisking, fireworks arcs, koban pachinko, mochi hopping, sumi tracing, kite cartography, dry-garden raking, underwater navigation, taiko rhythm lanes, daruma rolling, web weaving, pottery shaping, bamboo canals, origami folding, parasols, snow stacking, kimono stamping, bento cooking, windbell tuning, rail running, or koi collection.

## Why this game today

The generated series currently ends with:

- Day 027 `2d`: Haru matcha whisking with circular bowl input, foam/clump/temperature/bitterness management, pale spring tea-room greens, and a tea helper.
- Day 028 `3d`: Akane foxfire shrine sentinel with 3D torii paths, lantern light pools, patrol cones, wisp escorting, and dark crimson/violet shrine visuals.
- Day 029 `2d`: Hinoki kumiko woodworking with warm cypress workbench, geometric lattice strips, notches, clamps, planing, stress, and a sparrow helper.

The latest generated-mode streak is one `2d` (Day 029). Day 030 deliberately chooses real `3D` to keep the cadence strong and to leave the tabletop craft/workbench rhythm behind. The new verb set is spatial harvest orchestration: orbit a bamboo picker basket around a 3D mikan tree, raise/lower through canopy layers, pluck fruit at peak ripeness, sort them into requested crates, shoo hornets without bruising fruit, turn the sunwheel reflector to ripen shadowed clusters, and spend Harvest Focus to preview falling fruit paths and ripeness windows.

Recent screenshot/visual variety notes to avoid repeating:

- Day 029 used pale hinoki wood, rectangular shoji panel grids, blueprint lines, tan/gold buttons, tool/chisel/clamp craft language, and a warm workshop background.
- Day 028 used dark violet/crimson shrine corridors, torii gates, lantern pools, foxfire wisps, shadow cones, and purple HUD chips.
- Day 027 used pale green tea-room surfaces, a large round matcha bowl, foam pearls, clumps, temperature/bitterness cards, and soft cream UI.

Day 030 should shift to open, sunny orchard space: leafy 3D canopy, orange fruit clusters at near/mid/far depth, bamboo ladders/baskets, round sunwheel reflector, mountain breeze ribbons, wooden harvest crates, dew glints, and a cheerful shiba helper. Avoid woodworking boards/rectangular lattices/tools, torii/foxfire/stealth cones, matcha bowls/foam/whisks, firework night skies/rings/smoke, pachinko cabinets/coins/cats, moon rabbits/mochi pads, sumi brush strokes, kite-thread star maps, dry sand/stone boards, underwater oxygen/pearls, drum pads, tilt mazes, silk web anchors, spinning pottery profiles, bamboo pipe irrigation, origami crease routes, parasol rain processions, snow blocks, kimono panels, restaurant timers, or generic fruit-match-three grids.

## Code isolation / no previous game source

The implementation must be written from scratch for this day. Do not open, inspect, copy, diff, grep, or adapt code from previous games, including old `apps/day-*` folders, old `release/games/NNN/` HTML/CSS/JS files, or old public alias folders. You may inspect previous metadata, prompts, postmortems, and screenshots only to avoid repeating concepts and visual identity. The new game's HTML/CSS/JS must come from this prompt and general browser/Three.js/WebGL/WebAudio game knowledge, not from earlier game implementations.

## Mode variety / 3D cadence

Inspection target: `src/data/games.ts` currently ends with Day 027 `2d`, Day 028 `3d`, and Day 029 `2d`. The latest generated-mode streak is one `2d`.

Mode decision: Day 030 is real `3D`. It must implement meaningful spatial gameplay, not decorative perspective:

- Use Three.js/WebGL or equivalent static-browser 3D rendering.
- Render an actual depth-visible mikan orchard tree with trunk, branches, canopy rings, fruit clusters at near/mid/far depth, basket position in x/y/z, crates, hornet paths, sun/shadow zones, wind gust ribbons, and a camera that makes height/depth readable.
- Gameplay must depend on 3D state: basket orbit angle, canopy height, branch depth, fruit ripeness timer, fruit drop arc, crate lane, bruise risk, hornet distance, sunwheel angle, wind drift, helper position, and camera framing.
- Player actions must manipulate the 3D system: orbit left/right, raise/lower basket, pluck ripe fruit, catch/sort falling fruit, rotate the sunwheel reflector, fan away hornets, cushion drops with leaf nets, use Harvest Focus to slow/preview ripeness/drop paths, pause/restart, and inspect tutorial hints.
- Portrait mobile is the default supported layout; no landscape gate.

## Design

- Objective: Harvest requested mikan crates by navigating a 3D picker basket through canopy layers, plucking fruit at the right ripeness, catching/sorting them without bruises, and keeping hornets and sun-shadow pressure under control.
- Win condition: Complete three orchard commissions — First Sunny Basket, Terrace Crate Rush, and Golden Sunwheel Harvest — while reaching 4400 points to trigger “Mikan Grand Harvest”. After the banner, continue into endless orchard commissions.
- Lose condition: Three harvest hearts crack, the commission timer expires, bruise meter reaches 100%, too many underripe/overripe fruit enter crates, or hornets scatter the basket three times in one commission.
- Core loop:
  1. Start on a title/menu screen with Day 030 badge, mode badge “3D”, public route `/mikan/`, best score, best Grand Harvest time, tutorial, prompt link, and a large Start button.
  2. Show a portrait-friendly 3D orchard stage. A mikan tree fills the center. The basket orbits around the canopy and can raise/lower through fruit layers. Requested crates sit at the bottom edge. A shiba helper points to the next cluster.
  3. A commission card requests goals, for example: “Harvest 4 golden mikan, 2 green-safe mikan, keep bruises under 30%, use Sunwheel twice, finish with one Focus unused.”
  4. Player orbits the basket left/right and adjusts height. Fruit clusters show ripeness rings: green, golden, deep orange, and overripe red. Pluck when the ring is in the requested window.
  5. Plucked fruit falls in a short 3D arc toward the basket/crate lane. The player may catch it in the basket, sort it into a crate, or cushion with a leaf net if wind pushes it.
  6. Sunwheel Reflector rotates a warm light beam across shadowed clusters, accelerating ripeness but risking overripe fruit if held too long.
  7. Hornets patrol around sweet fruit. Fan Gust pushes hornets away and bends fruit drops slightly; bad timing can scatter ripe clusters.
  8. Leaf Net cushions one falling fruit and prevents bruise damage, but has limited recharge.
  9. Harvest Focus, charged by clean ripe catches and crate streaks, slows falling fruit and overlays projected drop arcs plus ripeness countdowns for a short window.
  10. Completing a commission lights a terrace lantern, restores one harvest heart if needed, awards points, and unlocks denser canopy depth, wind lanes, and stricter crate orders.
  11. Pause/restart remain available throughout.
- 15+ minute play-value strategy:
  - Save best score, fastest Mikan Grand Harvest time, longest ripe-catch chain, highest endless commission, fewest bruises, lowest overripe waste, best crate accuracy, fewest hornet scares, and collected orchard seal badges in localStorage.
  - Include three authored commissions:
    - First Sunny Basket: low canopy, large fruit, slow ripeness, two crate types, guided first pluck, broad basket catch radius, no heart penalty during first tutorial mistake.
    - Terrace Crate Rush: adds mid/high canopy layers, wind drift, first hornet patrol, Sunwheel Reflector tutorial, and alternating crate order.
    - Golden Sunwheel Harvest: adds shadow clusters, overripe pressure, crossing hornets, narrower golden windows, required Harvest Focus preview, and leaf-net rescue mastery.
  - Deterministic Day 030 seed varies fruit cluster positions, ripeness windows, crate requests, hornet patrol timing, wind gust lanes, sunwheel beam angle, leaf-net recharge timing, and endless constraints while keeping the opening fair.
  - Mastery badges: finish First Sunny Basket with zero bruises, trigger Grand Harvest under 255 seconds, harvest 30 ripe mikan in order, finish a commission below 8% bruise meter, complete Terrace Crate Rush without Fan Gust, complete an endless harvest with all harvest hearts.
  - Strategic scoring rewards planning: wait for golden ripeness rather than panic-plucking, pre-position basket below high clusters, use Sunwheel on green fruit before crate demand spikes, save Fan Gust for hornet crossings, use Leaf Net on wind-drifted drops, use Harvest Focus before dense shadow clusters, and choose safe lower-value fruit instead of chasing overripe bonuses.
  - Endless mode after Grand Harvest adds denser canopy rings, faster ripeness, wind shear, hornet pairs, smaller crate windows, and mixed fruit orders without shrinking touch controls.
- Difficulty scaling:
  - 0-45 seconds: low canopy, slow ripeness, broad basket, two crate types, guided first pluck.
  - 45-140 seconds: mid/high fruit, first hornet, wind drift, Sunwheel Reflector introduced, crate ordering.
  - 140-255 seconds: shadow clusters, overripe pressure, crossing hornets, required Harvest Focus timing, leaf-net rescue windows.
  - 255+ seconds/endless: faster ripeness, denser clusters, stricter crate order, stronger wind, same readable controls.
  - Keep mobile fair: fruit clusters, ripeness rings, basket, drop arcs, hornets, crates, sunwheel beam, wind/leaf-net cues, commission card, and action buttons must be large/readable at 390x844; primary touch buttons must be 52px+; no tiny survival-critical fruit.
- Scoring/rewards:
  - Ripe fruit plucked in requested window: +120 points times combo tier.
  - Clean basket catch without bruise: +95 points and Harvest Focus charge.
  - Correct crate delivery: +150 points.
  - Sunwheel ripens a shadow fruit into the target window: +160 bonus.
  - Fan Gust repels hornet without scattering fruit: +140 points.
  - Leaf Net prevents a bruise: +130 points and bruise relief.
  - Commission complete below bruise target: +780 points and restore one harvest heart if below max.
  - Perfect no-bruise commission: +1000 points.
  - Mikan Grand Harvest: +2000 points and endless commissions unlock.
  - Underripe/overripe crate: combo soft-reset, bruise/waste +8%.
  - Dropped fruit bruises on ground: harvest-heart damage if threshold crossed, bruise +14%, combo reset.
  - Hornet scatter: basket stuns briefly, bruise +10%, next fruit ripens faster.

## Controls and layout

- Desktop:
  - Mouse click/tap: press movement/action buttons, select fruit/crate chips, start/pause overlay button, prompt link, or explainable HUD chips.
  - Mouse drag on the 3D stage: optional basket orbit/height preview; click-to-pluck must remain clear and non-ambiguous.
  - Arrow keys or A/D: orbit basket left/right around the tree.
  - W/S or Up/Down: raise/lower basket through canopy layers.
  - Space or Enter: Pluck/Catch active fruit / confirm start depending on state.
  - 1/2/3: choose crate lane or cycle requested crate.
  - F: Fan Gust when charged/available.
  - L: Leaf Net when charged/available.
  - Q/E: rotate Sunwheel Reflector left/right.
  - Shift or M: Harvest Focus when charged.
  - P: pause/resume.
  - R: restart current run.
- Mobile/touch:
  - Use large Orbit Left, Orbit Right, Raise, Lower controls plus optional drag-to-orbit on the orchard stage.
  - Use large Pluck/Catch, Crate Lane, Sunwheel, Fan Gust, Leaf Net, Harvest Focus, Pause, Restart, and Prompt buttons.
  - Tapping fruit/ripeness/hornet/crate/sunwheel chips may show short explanations.
  - No tiny virtual joystick. Interaction is basket orbit/height, pluck/catch/sort, sunwheel, fan, net, focus, pause/restart.
- Mobile layout/orientation:
  - Default target is portrait phone play around 390x844; do not require landscape.
  - Top: compact orchard HUD with score, best, harvest hearts, bruise %, combo, basket height, selected crate, focus %, and elapsed time. Use mikan/basket/crate/leaf/sun/hornet chips, not wood/clamp/shrine/tea/firework/coin/rabbit/brush/kite icons.
  - Below top: commission card with requested fruit ripeness/colors, crate order, bruise limit, sunwheel/fan/net requirements, and progress ticks.
  - Center: tall 3D orchard stage with tree canopy, basket, fruit ripeness rings, drop arcs, crates, sunwheel beam, hornets, wind ribbons, helper art, and camera/depth cues. It must remain playable without zooming.
  - Bottom: status helper plus large movement/action controls. Controls must not cover critical fruit clusters, active drop arc, crate mouths, hornet warnings, or ripeness rings.
  - Tutorial must fit on the first portrait screen; optional details may be collapsible but objective, basket orbit/height, fruit ripeness, pluck/catch/sort, sunwheel, hornets/Fan Gust, Leaf Net, Harvest Focus, pause/restart must be visible.
  - Requests must combine text, symbols, fruit shapes, crate letters, progress ticks, and line styles so hue alone is not required.

## Menu and tutorial

Implement these states:

1. Title screen
   - Shows title “Mikan Sunwheel Orchard”.
   - Shows Day 030 badge, mode badge “3D”, public route `/mikan/`, best score, best Grand Harvest time if available, and a prompt link.
   - Shows a large Start button and visible tutorial panel by default.
   - Notes: “Audio starts after you press Start; visual ripeness rings and drop arcs work if muted.”
2. Tutorial text
   - Objective: “Orbit the basket through the 3D mikan tree, pluck fruit at golden ripeness, and sort clean catches into requested crates.”
   - Movement: orbit left/right and raise/lower through canopy layers; depth rings show where the basket is.
   - Ripeness: green fruit ripen to golden then overripe; use Sunwheel to warm shadow fruit carefully.
   - Catch/sort: Pluck fruit, catch the falling arc, then send it to the requested crate lane.
   - Hazards: hornets scare the basket and bruised fruit hurts the commission; Fan Gust and Leaf Net rescue bad moments.
   - Harvest Focus: slows drops and previews ripeness/drop arcs when charged.
   - Pause/restart: P/R on desktop or visible buttons on mobile.
3. In-game HUD
   - Score, best score, harvest hearts, bruise %, commission name, combo, basket height/orbit, crate order, active fruit ripeness, hornet warning, Sunwheel charge/angle, Fan Gust charge, Leaf Net charge, Harvest Focus charge, elapsed time, latest warning.
   - Pause/restart controls visible or immediately accessible.
4. Status helper
   - Non-blocking helper showing next requested fruit, active cluster ripeness, likely drop path, hornet timing, crate advice, focus readiness, and expected score effect.
   - Must not cover the 3D orchard stage or bottom controls on mobile.
5. Pause overlay
   - Resume, restart, tutorial reminder, controls summary, audio/mute toggle, prompt link.
6. Game-over/results overlay
   - Final score, best score, commission reached, Grand Harvest status, ripe-catch chain, crate accuracy, bruises, hornet scares, badges, restart button.
7. Mikan Grand Harvest banner
   - Trigger once per run after all three commissions and 4400 score.
   - Non-blocking celebration: the sunwheel sends gold rays through the canopy, mikan fruit sparkle into a citrus crest, crates stamp with orchard seals, the shiba helper barks happily, and endless commissions continue after the banner fades.

## Assets

Prefer Imagegen2 (`openai/gpt-image-2`) for final visual art: shiba orchard helper mascot, portrait mikan orchard background, fruit/crate/tool icon sheet, and decorative Grand Harvest seal pieces. Three.js primitives may render interactive 3D tree trunk/branches, fruit spheres, basket, ripeness rings, drop arcs, hornets, wind ribbons, sunwheel beam, camera, particles, and UI chrome. Procedural code may crop, resize, alpha-clean, atlas-pack, optimize, animate, or place generated assets; it should not create final character/background/icon art from scratch unless Imagegen2 is unavailable after a real attempt.

Archive source generated art under `release/games/030/assets/source/` and use optimized playable copies under `release/games/030/assets/`. Also copy optimized playable assets into `apps/day-030-mikan-sunwheel-orchard/assets/` and the public alias `release/mikan/assets/`.

For mobile-first crop safety: keep important content centered, leave 12-16% safe margins, avoid baked-in text, avoid watermarks, avoid fake UI labels, avoid tiny fruit/tool details that disappear at final in-game size, and keep helper/mikan/basket/crate/sunwheel/hornet silhouettes distinct against bright orchard backgrounds.

Generate or provide at least these final art assets:

1. Shiba orchard helper mascot
   - Target: transparent PNG if possible, square source, final optimized texture around 512x512 or 256x256.
   - Archive path: `release/games/030/assets/source/mikan-helper-source.png`
   - Optimized path: `release/games/030/assets/mikan-helper.png`
   - Imagegen2 prompt: “A charming friendly shiba inu orchard helper mascot for a mobile 3D mikan harvest browser arcade game, small tan shiba wearing an indigo farmer scarf, holding a bamboo picking basket and one glossy orange mikan, bright helpful expression, warm afternoon orchard rim light, centered readable silhouette, transparent or solid pale citrus background, no checkerboard background, no text, no watermark, sprite-friendly, high contrast at small size.”
   - Aspect ratio: square.
2. Mikan hillside orchard background source
   - Target: portrait-friendly background suitable behind a 3D orchard/tree stage with open readable center.
   - Archive path: `release/games/030/assets/source/mikan-orchard-source.png`
   - Optimized path: `release/games/030/assets/mikan-orchard.png`
   - Imagegen2 prompt: “A sunny Japanese hillside mikan citrus orchard for a portrait mobile 3D harvest game, glossy orange fruit trees, bamboo picking ladders at the edges, wooden harvest crates, round sunwheel reflector, mountain haze, warm honey-gold afternoon light, soft green leaves, open readable central canopy area for interactive 3D fruit clusters and basket, crop-safe for phone portrait, no characters in the center, no readable text, no watermark.”
   - Aspect ratio: portrait.
3. Mikan fruit, basket, crate, sunwheel, hornet, leaf net, and orchard UI icon sheet source
   - Target: square icon sheet for objectives, hazards, tools, rewards, and UI decals.
   - Archive path: `release/games/030/assets/source/mikan-icons-source.png`
   - Optimized path: `release/games/030/assets/mikan-icons.png`
   - Imagegen2 prompt: “Small readable icon sheet for a Japanese mikan orchard harvest arcade game: green mikan, golden ripe mikan, deep orange overripe mikan, bamboo picking basket, wooden crate A, wooden crate B, sunwheel reflector, small hornet hazard, leaf net rescue, wind ribbon, Harvest Focus citrus emblem, bruise meter fruit, harvest heart, Mikan Grand Harvest seal, transparent or solid pale citrus background, no checkerboard background, high contrast, no text, no watermark, generous margins so no icons are cut off.”
   - Aspect ratio: square.

If Imagegen2 is unavailable or fails after a real attempt, create a clearly labeled emergency fallback using simple SVG/Three.js shiba/mikan/basket silhouettes, document the failure in `ai/postmortems/day-030.md`, and still keep source/fallback files under the same asset paths.

### Mandatory generated-image QA

For every generated image, include a real inspection step after generation and before integration:

- Analyze the actual generated file visually, not just the prompt text.
- For the shiba helper mascot, verify transparent/cutout quality or clean background handling, readable friendly silhouette, centered pivot/crop margins, no unwanted text/watermarks, stable upright helper orientation, and that basket/mikan pose does not imply incompatible movement or rotation.
- Verify control-to-motion alignment in-game: Orbit Left/Right must move the basket around the tree in expected directions, Raise/Lower must visibly change canopy height, Pluck/Catch must take/drop the intended fruit, Crate Lane must route fruit to visible crate lanes, Sunwheel must shift/ripen a visible light beam, Fan Gust must push hornets/wind as described, Leaf Net must cushion intended drops, and Harvest Focus must slow/preview ripeness/drop arcs.
- For the background, verify the central orchard/canopy remains readable after portrait mobile crop and does not hide fruit, basket, drop arcs, crates, commission card, helper, or controls.
- For the icon sheet, verify green/ripe/overripe mikan, basket, crates, sunwheel, hornet, leaf net, wind ribbon, Harvest Focus, bruise meter, harvest heart, and Grand Harvest seal are distinct at final HUD/button size and cannot be confused. Watch specifically for fake checkerboard transparency; alpha-clean or composite onto pale citrus if needed and inspect again.
- If inspection finds a problem, regenerate or post-process the image and inspect again. Do not ship broken visual assets just because tests pass.

## Audio and game feel

Because fruit plucking, basket catching, crate sorting, hornet pressure, sunwheel ripening, and orchard atmosphere are central to the theme, include lightweight WebAudio cues initialized only after a user gesture:

- Soft leaf rustle when orbiting/raising/lowering the basket.
- Bright fruit pop when a ripe mikan is plucked.
- Bamboo basket thump when a fruit lands cleanly.
- Wooden crate clack when sorting correctly.
- Warm sun shimmer when Sunwheel Reflector ripens a cluster.
- Buzz/rattle warning when hornets approach or scatter the basket.
- Soft net whoosh when Leaf Net cushions a drop.
- Sparkly citrus shimmer when Harvest Focus activates.
- Rising koto/flute/orchard-bell arpeggio when Mikan Grand Harvest triggers.

Audio must not block play if WebAudio is unavailable. Verify no autoplay errors: audio context should be created/resumed only after Start or another user interaction. Include a visible mute toggle in pause/results or HUD.

## Prompt page output

The archived `release/games/030/prompt.html` must be a consistent rendered HTML page, not raw Markdown pasted into a `<pre>` block. It should include:

- A clear `<title>` and `<h1>` using `Day 030 Game Generation Prompt`.
- A back-to-game link near the top.
- Semantic rendered sections (`h2`, `h3`, `ul/ol/li`, `p`, `pre/code` only for actual code/commands).
- The same readable prompt-page style pattern across days so prompt pages feel like one system.

## Subagents to dispatch

1. Implementation subagent
   - Build the static 3D game under `apps/day-030-mikan-sunwheel-orchard/`.
   - Integrate it into immutable release output under `release/games/030/`.
   - Create the public playable route under `release/mikan/`.
   - Use static HTML/CSS/JS with Three.js/WebGL/WebAudio and no backend.
   - The public alias must be self-contained or asset paths must be alias-safe.
   - If vendoring `three.module*.js`, also copy the matching `three.core*.js` beside it in the app, release archive, and `/mikan/` alias assets.
2. Asset/polish subagent
   - Generate/prepare Imagegen2 assets, archive source files, optimize playable copies, inspect generated images, remove fake checkerboards if present, and tune mobile readability/game feel.
3. QA/browser/mobile subagent
   - Run desktop and mobile smoke checks, verify no console errors, verify menu/tutorial/objective/controls/restart/pause, prompt links, 3D orchard render, Orbit/Raise/Lower controls, Pluck/Catch, Crate Lane, Sunwheel, Fan Gust, Leaf Net, Harvest Focus control presence, ripeness/drop/crate/hornet feedback, generated screenshot, generated assets, WebAudio initialization after user gesture, and 390x844 portrait layout.
4. Reflection/self-improvement subagent
   - Write `ai/postmortems/day-030.md` after validation with what worked, what failed, generated-image inspection notes, audio verification, code-isolation confirmation, and whether generator/template/rubric improvements are justified.

## Acceptance criteria

- Static build passes.
- Code isolation is documented in QA/postmortem: no previous game implementation code was opened, inspected, copied, diffed, grepped, or adapted.
- Mode choice follows the cadence rule: Day 030 is real `3d` after Day 029 `2d`, with basket orbit/height, fruit depth, ripeness timers, drop arcs, sun/shadow, hornets, and crate sorting that matter mechanically.
- Desktop smoke passes.
- Mobile portrait smoke passes at about 390x844 with readable HUD/tutorial/commission card, usable 52px+ movement/action/pause/restart controls, no forced landscape canvas, and no tiny survival-critical fruit or crate targets.
- Prompt is visible from gallery and release folder.
- `prompts/day-030.md` is copied exactly to `release/games/030/prompt.md` and `release/mikan/prompt.md`.
- `release/games/030/prompt.html` and `release/mikan/prompt.html` render the prompt in browser-readable semantic HTML with the standard prompt-page styling, not a raw Markdown `<pre>` dump.
- Public alias `release/mikan/index.html`, `release/mikan/prompt.html`, `release/mikan/screenshot.png`, and `release/mikan/assets/` exist and work.
- Gallery card for Day 030 shows prompt availability, generation duration, public `/mikan/` links, mode `3d`, and actual generated date.
- Screenshot exists at `release/games/030/screenshot.png` and is non-empty/readable. Prefer a readable desktop gameplay screenshot for gallery cards; mobile screenshots are QA evidence unless the design is intentionally portrait-card friendly.
- Image/source assets exist under `release/games/030/assets/source/` and optimized assets exist under `release/games/030/assets/`, or a documented emergency fallback exists.
- Every generated image has an inspection note in the postmortem or QA notes; interactive basket/fruit/crate/hornet visuals have verified background handling, orientation/pivot/crop, readability, and control-to-motion alignment.
- WebAudio initializes after user gesture and creates no autoplay console errors; audio is failsafe if unsupported and visual ripeness/drop/crate cues remain playable muted.
- No console errors during desktop or mobile smoke. Add data-URI favicons to game and prompt pages if needed to avoid favicon request noise.
- Existing `release/games/001/**` through `release/games/029/**` from origin/main remain unchanged.
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
# Screenshot/static checks: verify release/games/030/screenshot.png, prompt.md, prompt.html, index.html, game.js, styles.css, release/mikan/index.html, release/mikan/prompt.html, release/mikan/screenshot.png, optimized assets, source assets, and vendored Three.js files (if used) exist and are non-empty.
# Prompt copy check: cmp prompts/day-030.md release/games/030/prompt.md and cmp prompts/day-030.md release/mikan/prompt.md.
# Prompt HTML check: verify release/games/030/prompt.html has semantic h1/h2/list markup and a back-to-game link, not a raw Markdown dump inside <pre>, and no malformed ul > p or ol > p nodes.
# Browser smoke: open the local/static /mikan/ route and verify menu, tutorial, gameplay start, 3D orchard render, Orbit/Raise/Lower, Pluck/Catch, Crate Lane, Sunwheel, Fan Gust, Leaf Net, Harvest Focus, ripeness/drop/crate/hornet feedback, pause, restart, prompt page, WebAudio after user gesture, no console errors.
# Mobile smoke: repeat at a portrait phone viewport such as 390x844 and verify playable orchard/action controls plus readable HUD/commission card/stage/controls.
# Static screenshot check: inspect release/games/030/screenshot.png and release/mikan/screenshot.png for non-empty readable game content; use vision to judge actual visual quality.
# Image QA: inspect every Imagegen2 source/optimized asset and document the actual inspection result in ai/postmortems/day-030.md.
# Docker/static smoke: build the Docker image locally, run it, curl /mikan/ and /mikan/prompt.html, then stop the container.
# Immutable guard: confirm no release/games folders from origin/main changed except new Day 030.
```
