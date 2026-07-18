# Day 036 Game Generation Prompt

## Game identity

- Day: 036
- Title: Takumi Karakuri Gearwright
- Slug: takumi-karakuri-gearwright
- Public route word: takumi
- Mode: 3D
- Genre: mobile-first 3D clockwork routing puzzle / layered gear-train engineering / automaton score chase
- Mood/style: twilight karakuri workshop garden, lacquered wood gear frames, brass axles, paper lantern tachometers, tiny fox automaton helper, floating near/mid/far gear plates, crisp tooth-mesh feedback, warm amber mechanics against deep indigo shadows; real depth-layered gear routing rather than bridge construction, spherical thread weaving, fan dyeing, onsen steam routing, ikebana arranging, orchard harvesting, kumiko lattice fitting, foxfire stealth, matcha whisking, fireworks, pachinko, mochi hopping, calligraphy tracing, kite mapping, dry-garden raking, underwater diving, taiko rhythm, daruma rolling, silk-web weaving, pottery shaping, canal irrigation, origami folding, parasol sheltering, snow stacking, kimono stamping, bento cooking, windbell tuning, rail running, or koi collection.

## Why this game today

The generated series currently ends with:

- Day 033 `2d`: Uchiwa Fan Dye Maestro with pale washi fan sectors, pigment/stencil/drying/bleed controls, bright paper workshop, and a kappa helper.
- Day 034 `3d`: Temari Thread Orbit Weaver with a large dark 3D sphere, silk arcs, guide rings, pearl pins, tension/tangle controls, warm craft table, and a sparrow helper.
- Day 035 `2d`: Hashi Tanuki Bridgewright with a side-view dusk mountain stream, left/right riverbanks, bamboo beams, ropes, stone piers, stress lines, budget chips, and a tanuki helper.

The latest generated-mode streak is one `2d` (Day 035). Day 036 deliberately chooses real `3D` to keep the cadence strong and to move away from side-view bridge engineering. The new verb set is layered clockwork routing: inspect a floating karakuri mechanism in depth, place gears on near/mid/far axle plates, match tooth sizes, set rotation direction, oil squeaky axles, test a crank train, and ring ordered shrine bells before torque overloads the automaton.

Recent screenshot/visual variety notes to avoid repeating:

- Day 035 used a wide horizontal river gap, dark blue water, stone abutments, bamboo/rope construction materials, linear bridge members, small white node dots, and cream HUD pills.
- Day 034 used a huge centered dark sphere, warm brown workshop edges, silk arcs, pearl pins, and many compact bottom controls.
- Day 033 used a bright cream radial fan board, large empty washi workspace, pale/gold cards, and pigment wedge geometry.

Day 036 should use a stacked mechanical diorama: three translucent depth plates with brass gears, wooden axles, tooth outlines, rotation arrows, torque bands, bell hammers, a source crank, ordered bell targets, paper-lantern tachometers, oil sparks, and a tiny fox automaton helper. Avoid bridges/rivers/bamboo beams/stress trusses, centered temari balls/thread arcs/pearl pins, radial fans/pigments/stencils, pools/steam/valves, flowers/vases, citrus baskets, woodworking lattice strips, shrine stealth cones, tea bowls, fireworks arcs, pachinko coins, mochi pads, brush strokes, kite strings, raked sand, underwater pearls, drum pads, labyrinth tilt, spider webs, pottery profiles, canal grids, origami folds, rain parasols, snow blocks, kimono panels, restaurant orders, windbell note tuning, rail tracks, or koi ponds.

## Code isolation / no previous game source

The implementation must be written from scratch for this day. Do not open, inspect, copy, diff, grep, or adapt code from previous games, including old `apps/day-*` folders, old `release/games/NNN/` HTML/CSS/JS files, or old public alias folders. You may inspect previous metadata, prompts, postmortems, and screenshots only to avoid repeating concepts and visual identity. The new game's HTML/CSS/JS must come from this prompt and general browser/Three.js/WebGL/WebAudio game knowledge, not from earlier game implementations.

## Mode variety / 3D cadence

Inspection target: `src/data/games.ts` currently ends with Day 033 `2d`, Day 034 `3d`, and Day 035 `2d`. The latest generated-mode streak is one `2d`.

Mode decision: Day 036 is real `3D`. It must implement meaningful spatial gameplay, not decorative perspective:

- Use Three.js/WebGL or equivalent static-browser 3D rendering.
- Render actual depth-separated gear plates: near, middle, and far layers should be visibly offset, selectable, and mechanically meaningful.
- Gear placement and rotation must depend on 3D state: active layer, axle position, gear radius/tooth count, tooth contact distance, depth-coupler pegs, clockwise/counterclockwise direction, torque transfer, bell target order, jam risk, oil state, and camera/inspection angle.
- Player actions must manipulate the 3D system: rotate/orbit the mechanism, choose layer/axle, choose small/medium/large gear, place/remove gear, flip direction with an idler gear, add one depth coupler, oil a squeaky axle, test the crank, use Takumi Focus to slow and preview torque paths, pause/restart, and inspect tutorial hints.
- Portrait mobile is the default supported layout; no landscape gate.

## Design

- Objective: Build a working karakuri gear train that transfers motion from the hand crank through layered brass gears to ring requested shrine bells in order while keeping torque, jams, and axle heat under control.
- Win condition: Complete three commissions — First Crank Blossom, Lantern Bell Relay, and Moon Fox Automaton — while reaching 5000 points to trigger “Takumi Grand Mechanism”. After the banner, continue into endless clockwork commissions.
- Lose condition: Three mechanism hearts break, jam meter reaches 100%, the commission timer expires, a required bell rings out of order three times, or torque overload cracks three axles in one run.
- Core loop:
  1. Start on a title/menu screen with Day 036 badge, mode badge “3D”, public route `/takumi/`, best score, best Grand Mechanism time, tutorial, prompt link, and a large Start button.
  2. Show a portrait-friendly karakuri workbench. A 3D floating mechanism fills the center with three translucent plates, visible gear slots/axles, a source crank, target bell hammers, and readable layer labels.
  3. A commission card requests goals such as: “Ring bells Gold → Jade → Vermilion, use one depth coupler, keep jam under 45%, oil the hot axle before testing.”
  4. Player selects the active layer and axle using large Layer −/+ and Axle −/+ controls or direct taps on large glowing axle sockets.
  5. Gear Size cycles Small, Medium, and Large. Ghost previews show tooth mesh reach; valid mesh glows gold/green, invalid overlap glows red, and missing contact shows dashed tooth gaps.
  6. Place Gear installs the selected gear on the active axle, consuming budget and updating visible rotation arrows.
  7. Flip Direction places or toggles an idler behavior so a target gear spins the required way; wrong direction can ring a bell backward and raise jam.
  8. Depth Coupler links matching axles between near/mid/far plates. Couplers are powerful but limited and can transmit too much torque if the gear sizes are mismatched.
  9. Oil Axle reduces heat/jam on the highlighted axle and boosts score if timed just before the test; over-oiling wastes budget and lowers clean-build bonus.
  10. Test Crank animates the source crank, gear teeth, torque arrows, bell hammers, jams, sparks, and bell sequence. Correct bell order advances the commission.
  11. Takumi Focus, charged by efficient gear ratios and clean tests, slows the mechanism and overlays predicted torque paths, bell order numbers, hot axles, wrong-direction warnings, and coupler load for a short window.
  12. Completing a commission stamps a workshop seal, restores one mechanism heart if needed, awards points, and unlocks stricter gear ratios, more layers, heavier bell hammers, hotter axles, and fewer couplers.
  13. Pause/restart remain available throughout.
- 15+ minute play-value strategy:
  - Save best score, fastest Takumi Grand Mechanism time, longest no-jam chain, highest endless commission, lowest jam finish, fewest broken axles, best ratio efficiency, most perfect oil windows, and collected karakuri seals in localStorage.
  - Include three authored commissions:
    - First Crank Blossom: one plate plus a visible middle plate preview, broad axle sockets, two gear sizes, one bell, slow timer, guided first Place Gear, no mechanism-heart penalty during the first tutorial mistake.
    - Lantern Bell Relay: introduces near/mid/far layers, two ordered bells, one depth coupler, Flip Direction, first heat/jam risk, and Oil Axle timing.
    - Moon Fox Automaton: three ordered bells, limited couplers, required Takumi Focus preview, mixed gear ratios, hot axles, wrong-direction traps, and target jam under 55%.
  - Deterministic Day 036 seed varies axle plate positions, gear tooth counts, bell order, crank speed, torque thresholds, coupler sockets, oil sweet windows, heat decay, idler penalties, and endless constraints while keeping the opening fair.
  - Mastery badges: finish First Crank Blossom with zero jam warnings, trigger Grand Mechanism under 285 seconds, complete Lantern Bell Relay with all bells in perfect order, finish Moon Fox with no broken axles, complete a commission below 15% jam, complete an endless mechanism with all hearts.
  - Strategic scoring rewards planning: use small gears to step down speed before heavy bells, insert idlers deliberately for direction, keep depth couplers short, oil hot axles before Test Crank, avoid overlapping teeth, and save Takumi Focus for multi-layer bell order checks.
  - Endless mode after Grand Mechanism adds denser axle plates, heavier bells, brittle antique gears, faster crank pulses, fewer oil charges, and optional bonus chime targets without shrinking touch controls.
- Difficulty scaling:
  - 0-45 seconds: one visible path, broad sockets, two sizes, slow crank, obvious mesh preview, forgiving jam.
  - 45-150 seconds: three layers, ordered bells, depth coupler, direction flip, heat/oil timing.
  - 150-285 seconds: stricter ratios, three bells, wrong-direction traps, required Takumi Focus, limited couplers, hotter axles.
  - 285+ seconds/endless: faster crank, heavier hammers, denser plates, same readable controls.
  - Keep mobile fair: gear plates, axle sockets, gear teeth, rotation arrows, bell targets, jam/heat meters, commission card, helper, and action buttons must be large/readable at 390x844; primary touch buttons should be 52px+ where possible and never below 44px; no tiny survival-critical sockets.
- Scoring/rewards:
  - Valid gear mesh: +135 points times combo tier.
  - Correct direction into a target bell: +165 points and Takumi Focus charge.
  - Efficient ratio for heavy bell: +190 points and jam relief.
  - Depth Coupler carries torque safely: +210 points.
  - Oil Axle in sweet window: +155 points and heat relief.
  - Test Crank rings all requested bells in order: +940 points and restore one mechanism heart if below max.
  - Perfect no-jam commission: +1200 points.
  - Low-budget mechanism: +420 bonus.
  - Takumi Grand Mechanism: +2600 points and endless commissions unlock.
  - Invalid overlap/missing mesh: no placement, status warning.
  - Wrong bell order or backward ring: jam +10%, combo reset.
  - Broken axle/overload: mechanism-heart damage, budget penalty, combo reset.

## Controls and layout

- Desktop:
  - Mouse click/tap: press action buttons, select large axle sockets, start/pause overlay button, prompt link, or explainable HUD chips.
  - Mouse drag on the 3D stage: orbit/tilt the mechanism slightly; selection must remain clear and can also be done via controls.
  - Arrow keys or A/D: select previous/next axle on the active layer.
  - W/S or Up/Down: switch active layer.
  - Q/E: rotate camera left/right or cycle gear size when controls are focused.
  - 1/2/3: choose Small, Medium, or Large gear.
  - Space or Enter: Place Gear or Test Crank depending on state.
  - F: Flip Direction.
  - C: Depth Coupler.
  - O: Oil Axle.
  - X or Backspace: Remove Gear.
  - Shift or T: Takumi Focus when charged.
  - K: Test Crank.
  - P: pause/resume.
  - R: restart current run.
- Mobile/touch:
  - Use large Layer −, Layer +, Axle −, Axle + controls plus optional direct tap on large axle sockets.
  - Use large Gear Size, Place Gear, Flip Direction, Depth Coupler, Oil Axle, Remove Gear, Test Crank, Takumi Focus, Pause, Restart, and Prompt buttons.
  - Tapping jam/heat/torque/bell/ratio chips may show short explanations.
  - No tiny virtual joystick. Interaction is layer/axle stepping/direct tap, gear-size selection, placement, direction/coupler/oil/remove, testing, focus, pause/restart.
- Mobile layout/orientation:
  - Default target is portrait phone play around 390x844; do not require landscape.
  - Top: compact Takumi HUD with score, best, mechanism hearts, jam %, combo, active layer/axle, gear size, torque %, Takumi Focus charge, and elapsed time. Use gear/axle/bell/oil/coupler/jam chips, not bridge/thread/fan/pool/flower/fruit/lattice/shrine/tea/firework/cat/rabbit/brush/kite/sand/pearl/drum icons.
  - Below top: commission card with bell order, gear-size hints, coupler limit, jam target, oil requirement, ratio score, and progress ticks.
  - Center: large 3D karakuri stage with layered plates, gears, axles, tooth ghosts, crank, bell hammers, torque arrows, helper art, and readable feedback. It must remain playable without zooming.
  - Bottom: status helper plus large layer/material/action controls. Controls must not cover axle sockets, rotation arrows, bell order warnings, or jam sparks.
  - Tutorial must fit on the first portrait screen; optional details may be collapsible but objective, layer/axle selection, gear sizes, Place Gear, Flip Direction, Depth Coupler, Oil Axle, Test Crank, Takumi Focus, pause/restart must be visible.
  - Requests must combine text, symbols, line styles, arrows, motion, progress ticks, and patterns so hue alone is not required.

## Menu and tutorial

Implement these states:

1. Title screen
   - Shows title “Takumi Karakuri Gearwright”.
   - Shows Day 036 badge, mode badge “3D”, public route `/takumi/`, best score, best Grand Mechanism time if available, and a prompt link.
   - Shows a large Start button and visible tutorial panel by default.
   - Notes: “Audio starts after you press Start; visual gear, bell, torque, and jam cues work if muted.”
2. Tutorial text
   - Objective: “Route crank power through layered gears, ring the bells in order, and keep the mechanism from jamming.”
   - Depth: switch near/mid/far layers; use Depth Coupler to transfer motion between plates.
   - Mesh: gears must touch tooth-to-tooth without overlapping; small gears change speed, idlers flip direction.
   - Safety: oil hot axles before the test and watch torque/jam warnings.
   - Test: Test Crank animates the train and checks bell order.
   - Takumi Focus: slows the mechanism and previews torque paths, wrong directions, and hot axles when charged.
   - Pause/restart: P/R on desktop or visible buttons on mobile.
3. In-game HUD
   - Score, best score, mechanism hearts, jam %, commission name, combo, active layer/axle, selected gear size, torque %, bell order, Takumi Focus charge, elapsed time, latest warning.
   - Pause/restart controls visible or immediately accessible.
4. Status helper
   - Non-blocking helper showing next target axle, mesh advice, bell-order hints, jam/heat warning, oil timing, Takumi Focus readiness, and expected score effect.
   - Must not cover the 3D gear stage or bottom controls on mobile.
5. Pause overlay
   - Resume, restart, tutorial reminder, controls summary, audio/mute toggle, prompt link.
6. Game-over/results overlay
   - Final score, best score, commission reached, Grand Mechanism status, bell-order accuracy, jam finish, axles broken, oil windows hit, badges, restart button.
7. Takumi Grand Mechanism banner
   - Trigger once per run after all three commissions and 5000 score.
   - Non-blocking celebration: every gear train spins in synchrony, shrine bells ring in sequence, brass sparks spiral upward, the fox automaton bows, paper lanterns bloom, and endless commissions continue after the banner fades.

## Assets

Prefer Imagegen2 (`openai/gpt-image-2`) for final visual art: fox karakuri helper mascot, portrait karakuri workshop garden background, gear/bell/oil/coupler/jam icon sheet, and decorative Grand Mechanism seal pieces. Three.js primitives may render the interactive gears, axle plates, teeth, torque arrows, bells, crank, particles, and UI chrome. Procedural code may crop, resize, alpha-clean, atlas-pack, optimize, animate, or place generated assets; it should not create final character/background/icon art from scratch unless Imagegen2 is unavailable after a real attempt.

Archive source generated art under `release/games/036/assets/source/` and use optimized playable copies under `release/games/036/assets/`. Also copy optimized playable assets into `apps/day-036-takumi-karakuri-gearwright/assets/` and the public alias `release/takumi/assets/`.

For mobile-first crop safety: keep important content centered, leave 12-16% safe margins, avoid baked-in text, avoid watermarks, avoid fake UI labels, avoid tiny gear/tool details that disappear at final in-game size, and keep helper/gears/axles/bells/oil/coupler/jam/focus silhouettes distinct against twilight workshop backgrounds.

Generate or provide at least these final art assets:

1. Fox karakuri helper mascot
   - Target: transparent PNG if possible, square source, final optimized texture around 512x512 or 256x256.
   - Archive path: `release/games/036/assets/source/takumi-helper-source.png`
   - Optimized path: `release/games/036/assets/takumi-helper.png`
   - Imagegen2 prompt: “A charming friendly fox karakuri automaton helper mascot for a mobile 3D Japanese clockwork gear-routing puzzle game, small cute kitsune-shaped wooden automaton with brass joints, tiny indigo artisan apron, holding a miniature gear and oil dropper, kind focused expression, warm lantern rim light, centered readable silhouette, transparent or solid warm parchment background, no checkerboard background, no text, no watermark, sprite-friendly, high contrast at small size.”
   - Aspect ratio: square.
2. Karakuri workshop garden background source
   - Target: portrait-friendly background suitable behind a large 3D layered gear mechanism with open readable center.
   - Archive path: `release/games/036/assets/source/takumi-workshop-source.png`
   - Optimized path: `release/games/036/assets/takumi-workshop.png`
   - Imagegen2 prompt: “A twilight Japanese karakuri clockwork workshop garden for a portrait mobile 3D puzzle game, lacquered wooden workbench, brass gears, paper lantern tachometers, shrine bells, oil bottles, small tool trays, dark indigo garden shadows, amber workshop glow, open readable central area for floating layered gear plates, crop-safe for phone portrait, no characters in the center, no readable text, no watermark.”
   - Aspect ratio: portrait.
3. Takumi gear, bell, torque, oil, and focus UI icon sheet source
   - Target: square icon sheet for objectives, hazards, tools, rewards, and UI decals.
   - Archive path: `release/games/036/assets/source/takumi-icons-source.png`
   - Optimized path: `release/games/036/assets/takumi-icons.png`
   - Imagegen2 prompt: “Small readable icon sheet for a Japanese karakuri gear-routing 3D puzzle game: small brass gear, medium brass gear, large brass gear, wooden axle socket, depth coupler peg, shrine bell, hand crank, rotation arrow, torque warning bolt, jam sparks, oil dropper, remove wrench, Takumi Focus blueprint gear emblem, mechanism heart, Grand Mechanism lacquer seal, transparent or solid warm parchment background, no checkerboard background, high contrast, no text, no watermark, generous margins so no icons are cut off.”
   - Aspect ratio: square.

If Imagegen2 is unavailable or fails after a real attempt, create a clearly labeled emergency fallback using simple SVG/Three.js fox/gears/bells/oil silhouettes, document the failure in `ai/postmortems/day-036.md`, and still keep source/fallback files under the same asset paths.

### Mandatory generated-image QA

For every generated image, include a real inspection step after generation and before integration:

- Analyze the actual generated file visually, not just the prompt text.
- For the fox helper mascot, verify transparent/cutout quality or clean background handling, readable friendly silhouette, centered pivot/crop margins, no unwanted text/watermarks, stable upright helper orientation, and that gear/oil pose does not imply incompatible movement or rotation.
- Verify control-to-motion alignment in-game: Layer −/+ must visibly change the active depth plate, Axle −/+ must move the selected socket, Gear Size must change ghost size/tooth count, Place Gear must install a visible gear, Flip Direction must visibly change arrows/idler behavior, Depth Coupler must link layers, Oil Axle must visibly reduce heat/jam, Remove Gear must remove the intended recent gear, Test Crank must animate crank/gears/bells, and Takumi Focus must slow/preview torque paths, wrong directions, hot axles, and bell order.
- For the background, verify the central gear stage remains readable after portrait mobile crop and does not hide plates, gears, axles, torque arrows, commission card, helper, or controls.
- For the icon sheet, verify small/medium/large gear, axle socket, depth coupler, shrine bell, hand crank, rotation arrow, torque warning, jam sparks, oil dropper, remove wrench, Takumi Focus, mechanism heart, and Grand Mechanism seal are distinct at final HUD/button size and cannot be confused. Watch specifically for fake checkerboard transparency; alpha-clean or composite onto warm parchment if needed and inspect again.
- If inspection finds a problem, regenerate or post-process the image and inspect again. Do not ship broken visual assets just because tests pass.

## Audio and game feel

Because clockwork gear teeth, bells, oiling, jams, and a karakuri automaton are central to the theme, include lightweight WebAudio cues initialized only after a user gesture:

- Soft axle tick when selecting layer/axle.
- Brass tooth click when placing a gear.
- Hollow wooden clack when Flip Direction/idler changes motion.
- Coupler thunk when linking depth layers.
- Oil drop plink and smoother gear purr when Oil Axle succeeds.
- Rising rattle when jam/torque approaches red.
- Bell chime for each correctly ordered target bell.
- Blueprint shimmer when Takumi Focus activates.
- Clockwork flourish and three-bell cadence when Takumi Grand Mechanism triggers.

Audio must not block play if WebAudio is unavailable. Verify no autoplay errors: audio context should be created/resumed only after Start or another user interaction. Include a visible mute toggle in pause/results or HUD.

## Prompt page output

The archived `release/games/036/prompt.html` must be a consistent rendered HTML page, not raw Markdown pasted into a `<pre>` block. It should include:

- A clear `<title>` and `<h1>` using `Day 036 Game Generation Prompt`.
- A back-to-game link near the top.
- Semantic rendered sections (`h2`, `h3`, `ul/ol/li`, `p`, `pre/code` only for actual code/commands).
- The same readable prompt-page style pattern across days so prompt pages feel like one system.

## Subagents to dispatch

1. Implementation subagent
   - Build the static 3D game under `apps/day-036-takumi-karakuri-gearwright/`.
   - Integrate it into immutable release output under `release/games/036/`.
   - Create the public playable route under `release/takumi/`.
   - Use static HTML/CSS/JS with Three.js/WebGL/WebAudio and no backend.
   - The public alias must be self-contained or asset paths must be alias-safe.
   - If vendoring `three.module*.js`, also copy the matching `three.core*.js` beside it in the app, release archive, and `/takumi/` alias assets.
2. Asset/polish subagent
   - Generate/prepare Imagegen2 assets, archive source files, optimize playable copies, inspect generated images, remove fake checkerboards if present, and tune mobile readability/game feel.
3. QA/browser/mobile subagent
   - Run desktop and mobile smoke checks, verify no console errors, verify menu/tutorial/objective/controls/restart/pause, prompt links, 3D gear stage render, Layer −/+, Axle −/+, Gear Size, Place Gear, Flip Direction, Depth Coupler, Oil Axle, Remove Gear, Test Crank, Takumi Focus control presence, torque/jam/heat/bell feedback, generated screenshot, generated assets, WebAudio initialization after user gesture, and 390x844 portrait layout.
4. Reflection/self-improvement subagent
   - Write `ai/postmortems/day-036.md` after validation with what worked, what failed, generated-image inspection notes, audio verification, code-isolation confirmation, and whether generator/template/rubric improvements are justified.

## Acceptance criteria

- Static build passes.
- Code isolation is documented in QA/postmortem: no previous game implementation code was opened, inspected, copied, diffed, grepped, or adapted.
- Mode choice follows the cadence rule: Day 036 is real `3d` after Day 035 `2d`, with layered gear plates, depth couplers, 3D rotation/camera/depth, gear ratios, direction, torque, heat, and bell order that matter mechanically.
- Desktop smoke passes.
- Mobile portrait smoke passes at about 390x844 with readable HUD/tutorial/commission card, usable 44px+ layer/axle/action/pause/restart controls, no forced landscape canvas, and no tiny survival-critical axle sockets.
- Prompt is visible from gallery and release folder.
- `prompts/day-036.md` is copied exactly to `release/games/036/prompt.md` and `release/takumi/prompt.md`.
- `release/games/036/prompt.html` and `release/takumi/prompt.html` render the prompt in browser-readable semantic HTML with the standard prompt-page styling, not a raw Markdown `<pre>` dump.
- Public alias `release/takumi/index.html`, `release/takumi/prompt.html`, `release/takumi/screenshot.png`, and `release/takumi/assets/` exist and work.
- Gallery card for Day 036 shows prompt availability, generation duration, public `/takumi/` links, mode `3d`, and actual generated date.
- Screenshot exists at `release/games/036/screenshot.png` and is non-empty/readable. Prefer a readable desktop gameplay screenshot for gallery cards; mobile screenshots are QA evidence unless the design is intentionally portrait-card friendly.
- Image/source assets exist under `release/games/036/assets/source/` and optimized assets exist under `release/games/036/assets/`, or a documented emergency fallback exists.
- Every generated image has an inspection note in the postmortem or QA notes; interactive gear/axle/coupler/bell/jam visuals have verified background handling, orientation/pivot/crop, readability, and control-to-motion alignment.
- WebAudio initializes after user gesture and creates no autoplay console errors; audio is failsafe if unsupported and visual gear/bell/torque/jam cues remain playable muted.
- No console errors during desktop or mobile smoke. Add data-URI favicons to game and prompt pages if needed to avoid favicon request noise.
- Existing `release/games/001/**` through `release/games/035/**` from origin/main remain unchanged.
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
# Screenshot/static checks: verify release/games/036/screenshot.png, prompt.md, prompt.html, index.html, game.js, styles.css, release/takumi/index.html, release/takumi/prompt.html, release/takumi/screenshot.png, optimized assets, source assets, and vendored Three.js files (if used) exist and are non-empty.
# Prompt copy check: cmp prompts/day-036.md release/games/036/prompt.md and cmp prompts/day-036.md release/takumi/prompt.md.
# Prompt HTML check: verify release/games/036/prompt.html has semantic h1/h2/list markup and a back-to-game link, not a raw Markdown dump inside <pre>, and no malformed ul > p or ol > p nodes.
# Browser smoke: open the local/static /takumi/ route and verify menu, tutorial, gameplay start, 3D gear stage render, Layer −/+, Axle −/+, Gear Size, Place Gear, Flip Direction, Depth Coupler, Oil Axle, Remove Gear, Test Crank, Takumi Focus, torque/jam/heat/bell feedback, pause, restart, prompt page, WebAudio after user gesture, no console errors.
# Mobile smoke: repeat at a portrait phone viewport such as 390x844 and verify playable layer/axle/action controls plus readable HUD/commission card/stage/controls.
# Static screenshot check: inspect release/games/036/screenshot.png and release/takumi/screenshot.png for non-empty readable game content; use vision to judge actual visual quality.
# Image QA: inspect every Imagegen2 source/optimized asset and document the actual inspection result in ai/postmortems/day-036.md.
# Docker/static smoke: build the Docker image locally, run it, curl /takumi/ and /takumi/prompt.html, then stop the container.
# Immutable guard: confirm no release/games folders from origin/main changed except new Day 036.
```
