# Day 038 Game Generation Prompt

## Game identity

- Day: 038
- Title: Yatai Okonomiyaki Flipmaster
- Slug: yatai-okonomiyaki-flipmaster
- Public route word: yatai
- Mode: 3D
- Genre: mobile-first 3D griddle juggling / heat-zone cooking arcade / night-market order score chase
- Mood/style: warm Osaka-style festival yatai at night, black-iron teppan griddle, glossy okonomiyaki rounds, dancing bonito flakes, cabbage batter, sauce-brush shine, mayo ribbons, red pickled ginger, paper lantern steam, cute shiba chef helper, tactile sizzle-and-spatula feedback; real 3D pan/heat/flipping gameplay rather than goldfish scooping, clockwork gears, bridge engineering, spherical embroidery, fan dyeing, steam ducts, ikebana, orchard harvesting, kumiko woodworking, shrine stealth, matcha whisking, fireworks, pachinko, mochi hopping, calligraphy, kite mapping, dry-garden raking, underwater pearls, taiko routing, daruma labyrinths, spider webs, pottery wheels, canal grids, origami folds, rain parasols, snow stacking, kimono panels, bento conveyors, windbell tuning, rail running, or koi collection.

## Why this game today

The generated series currently ends with:

- Day 035 `2d`: Hashi Tanuki Bridgewright, side-view river bridge construction with bamboo/rope/stress.
- Day 036 `3d`: Takumi Karakuri Gearwright, dark indigo/amber layered brass gears, axles, torque, jam, bells.
- Day 037 `2d`: Kingyo Poi Festival Scooper, shallow lantern-lit goldfish tank, drag net, paper wetness, turbulence, bowl orders.

The latest generated-mode streak is one `2d` (Day 037), so Day 038 deliberately chooses real `3D` to keep the cadence strong. It switches away from water/fish/net dexterity and mechanical gear routing into a cooking-performance juggling game: manage several physical okonomiyaki cakes across depth-separated heat zones on a tilted 3D griddle, flip them at the right doneness, brush sauce, add toppings, plate correct orders, and avoid burning or undercooking.

Recent screenshot/visual variety notes to avoid repeating:

- Day 037 used dark blue water, goldfish sprites, bowl/net/ripple rings, lantern reflections, paper wetness chips, and bottom dexterity buttons.
- Day 036 used a dark mechanical workbench, translucent depth plates, brass gears, circular teeth, torque arrows, axle sockets, and compact engineering controls.
- Day 035 used a horizontal river gap, bamboo beams, rope braces, stone piers, tanuki helper, and stress-colored structural lines.

Day 038 should use a hot black-iron griddle table viewed with a shallow 3D camera: near/mid/far heat zones, round batter pancakes that physically slide/rotate/flip, visible browned underside previews, sauce brush strokes, mayo ribbons, toppings, steam plumes, serving plates, order tickets, and a shiba chef helper. Avoid water tanks/fish/bowls/nets/ripples, gear teeth/axles/couplers/bells, bridges/rivers/bamboo trusses/stress heatmaps, centered spheres/thread arcs, radial fans/pigment sectors, valves/steam duct routing, floral balance, orchard baskets, lattice strips, stealth cones, tea bowls, firework arcs, pachinko coins, mochi platforms, brush-stroke tracing, kite strings, sand rakes, underwater navigation, taiko pads, maze tilting, web strands, pottery profiles, canal tiles, origami creases, parasol sheltering, snow block stacking, kimono panels, conveyor cooking, windbell notes, rail tracks, or koi ponds.

## Code isolation / no previous game source

The implementation must be written from scratch for this day. Do not open, inspect, copy, diff, grep, or adapt code from previous games, including old `apps/day-*` folders, old `release/games/NNN/` HTML/CSS/JS files, or old public alias folders. You may inspect previous metadata, prompts, postmortems, and screenshots only to avoid repeating concepts and visual identity. The new game's HTML/CSS/JS must come from this prompt and general browser/Three.js/WebGL/WebAudio game knowledge, not from earlier game implementations.

## Mode variety / 3D cadence

Inspection target: `src/data/games.ts` currently ends with Day 035 `2d`, Day 036 `3d`, and Day 037 `2d`. The latest generated-mode streak is one `2d`.

Mode decision: Day 038 is real `3D`. It must implement meaningful spatial gameplay, not decorative perspective:

- Use Three.js/WebGL or equivalent static-browser 3D rendering.
- Render a real 3D teppan griddle with visible camera depth, near/mid/far heat lanes, cakes with x/z position, radius/thickness, rotation, flip state, browned underside, steam, heat zones, spatula ghost, and serving plates.
- Gameplay must depend on 3D state: cake position on heat zones, slide velocity, griddle tilt, underside/topside doneness, burn risk, topping side, sauce coverage, plate distance, order requirements, spatula angle, and flip timing.
- Player actions must manipulate the 3D system: select a cake, slide it between heat zones, tilt the griddle, flip with a spatula, brush sauce, add topping set, plate the correct cake, fan steam, use Chef Focus to slow/preview doneness arcs, pause/restart, and inspect tutorial hints.
- Portrait mobile is the default supported layout; no landscape gate.

## Design

- Objective: Cook and serve requested okonomiyaki orders by juggling cakes across hot/cool griddle zones, flipping at the ideal doneness, applying sauce/toppings in the right order, and plating before tickets lose patience.
- Win condition: Complete three order sets — First Sizzle, Lantern Sauce Rush, and Grand Matsuri Stack — while reaching 5200 points to trigger “Yatai Grand Service”. After the banner, continue into endless night-market tickets.
- Lose condition: Three chef hearts fail, five cakes burn or fall off the griddle, order patience reaches zero three times, smoke meter reaches 100%, or a Grand Matsuri required cake is plated raw/burned twice.
- Core loop:
  1. Start on a title/menu screen with Day 038 badge, mode badge “3D”, public route `/yatai/`, best score, best Grand Service time, tutorial, prompt link, audio note, and a large Start button.
  2. Show a portrait-friendly night-market griddle. A 3D teppan fills the center with three readable heat lanes: Cool Prep, Golden Cook, and Hot Sear.
  3. An order ticket requests goals such as: “Serve 1 pork okonomiyaki, golden both sides, sauce + mayo + aonori, smoke under 55%, no burned cakes.”
  4. Player selects the active cake by tapping/clicking it or using Cake −/+ controls. The selected cake gets a clear rim, height bounce, and shadow.
  5. Slide Cake nudges the cake forward/back/left/right across near/mid/far heat lanes. Position changes doneness rate and smoke risk.
  6. Tilt Griddle cycles Level, Left Lean, Right Lean, Forward Lean, and Back Lean. Tilt makes cakes slowly drift, enabling skillful repositioning but risking edge falls.
  7. Flip Cake launches a short 3D flip arc. A perfect flip happens when the underside doneness ring is in the golden window; early flips lower score, late flips burn and add smoke.
  8. Sauce Brush paints glossy sauce coverage on the cooked top side. Mayo Ribbon and Toppings cycle/add required finishing styles: pork strips, shrimp bits, green onion, bonito flakes, aonori, ginger.
  9. Plate Order moves the selected cake to the plate lane only if it matches the active ticket closely enough. Wrong topping or wrong doneness resets combo and drains patience.
  10. Fan Steam lowers smoke and reveals brief underside-color previews, but over-fanning cools the griddle and slows service.
  11. Chef Focus, charged by perfect flips and clean tickets, slows cake drift, overlays heat flow arrows, underside doneness arcs, topping checklist highlights, smoke danger, and plate-match score.
  12. Completing a ticket stamps a yatai order seal, restores one chef heart if needed, awards points, changes recipes, and unlocks faster patience, split heat zones, thicker cakes, multiple simultaneous cakes, and trickier topping combos.
  13. Pause/restart remain visible throughout.
- 15+ minute play-value strategy:
  - Save best score, fastest Yatai Grand Service time, longest perfect-flip chain, highest endless ticket, fewest burned cakes, cleanest smoke finish, best topping accuracy, most sauce-perfect cakes, and collected yatai seal badges in localStorage.
  - Include three authored order sets:
    - First Sizzle: one plain cabbage cake, broad golden doneness window, gentle heat, guided first Flip Cake, no heart penalty for the first tutorial undercook.
    - Lantern Sauce Rush: two cakes, pork/shrimp recipes, sauce + mayo requirements, first smoke pressure, Fan Steam introduced, patience matters.
    - Grand Matsuri Stack: three simultaneous cakes, split hot/cool lane targets, bonito/aonori/ginger checklist, required Chef Focus preview, tighter flip windows, smoke target under 60%.
  - Deterministic Day 038 seed varies heat lane strength, cake thickness, topping requests, sauce coverage target, patience decay, smoke rate, drift speed, flip window, plate bonus, and endless constraints while keeping opening seconds fair.
  - Mastery badges: finish First Sizzle with a perfect flip, trigger Grand Service under 285 seconds, complete Lantern Sauce Rush with no smoke warnings, finish Grand Matsuri with no burned cakes, serve three sauce-perfect cakes in a row, complete an order below 20% smoke.
  - Strategic scoring rewards cooking skill: preheat on Hot Sear then rest on Golden Cook, flip just inside the golden window, use Tilt Griddle to shepherd cakes without over-sliding, Fan Steam before smoke redlines, save Chef Focus for multi-cake order checks, and plate only exact recipes.
  - Endless mode after Grand Service adds thicker batter, surprise recipe swaps, extra toppings, hotter corners, shorter patience, and bonus VIP tickets without shrinking touch controls.
- Difficulty scaling:
  - 0-45 seconds: one cake, slow smoke, broad flip window, clear underside preview, forgiving patience.
  - 45-150 seconds: two cakes, sauce/mayo/topping checklists, fan steam, drift/tilt pressure.
  - 150-285 seconds: three cakes, split heat lanes, required Chef Focus, tighter golden windows, limited mistakes.
  - 285+ seconds/endless: hotter zones, thicker cakes, recipe combos, faster tickets, same readable controls.
  - Keep mobile fair: cakes, heat lanes, sauce coverage, topping icons, order ticket, smoke meter, helper, and action buttons must be large/readable at 390x844; primary touch buttons should be 52px+ where possible and never below 44px; no tiny survival-critical cakes.
- Scoring/rewards:
  - Cake moved into correct heat lane: +120 points times combo tier.
  - Perfect flip in golden window: +230 points and Chef Focus charge.
  - Sauce coverage within target band: +170 points.
  - Correct topping set: +185 points and patience relief.
  - Plate an exact order before patience warning: +980 points and restore one chef heart if below max.
  - No-smoke ticket: +720 bonus.
  - Perfect three-cake ticket: +1350 points.
  - Yatai Grand Service: +2800 points and endless tickets unlock.
  - Wrong topping / undercooked plate: no ticket progress, combo reset, patience penalty.
  - Burned cake / falls off griddle: chef-heart damage, smoke spike, combo reset.

## Controls and layout

- Desktop:
  - Mouse click/tap: select cakes, press controls, start/pause overlay button, prompt link, or explainable HUD chips.
  - Mouse drag on the 3D stage: slide selected cake toward the pointer with limited force; controls remain available for deterministic QA.
  - Arrow keys or WASD: nudge selected cake across the griddle.
  - Q/E: cycle Tilt Griddle.
  - Space or Enter: Flip Cake.
  - S: Sauce Brush.
  - M: Mayo Ribbon.
  - T: cycle/add topping.
  - F: Fan Steam.
  - Shift or C: Chef Focus when charged.
  - P: pause/resume.
  - R: restart current run.
- Mobile/touch:
  - Tap a cake to select it. Drag within the griddle to slide the selected cake with a visible spatula ghost and thumb offset.
  - Use large Cake −, Cake +, Slide controls or a four-direction nudge cluster if direct drag misses.
  - Use large Tilt Griddle, Flip Cake, Sauce Brush, Mayo Ribbon, Toppings, Plate Order, Fan Steam, Chef Focus, Pause, Restart, and Prompt buttons.
  - Tapping heat/smoke/doneness/order chips may show short explanations.
  - No tiny virtual joystick. Interaction is direct cake select/drag plus labeled cooking/action controls.
- Mobile layout/orientation:
  - Default target is portrait phone play around 390x844; do not require landscape.
  - Top: compact Yatai HUD with score, best, chef hearts, smoke %, combo, active cake, active tilt, Chef Focus charge, and elapsed time. Use griddle/cake/flip/sauce/fan/order/smoke chips, not fish/gear/bridge/thread/fan-dye/valve/flower/fruit/lattice/shrine/tea-bowl/firework/cat-coin/rabbit/brush/kite/sand/pearl/drum icons.
  - Below top: order ticket with requested doneness, side count, sauce/mayo/toppings checklist, patience bar, smoke target, cake count, and progress ticks.
  - Center: large 3D griddle stage with heat lanes, cakes, spatula ghost, sauce/topping overlays, serving plate, steam, helper art, and readable feedback. It must remain playable without zooming.
  - Bottom: status helper plus large cooking controls. Controls must not cover cakes, heat lanes, order ticket, smoke warnings, or serving plate.
  - Tutorial must fit on the first portrait screen; optional details may be collapsible but objective, select/slide cake, Tilt Griddle, Flip Cake, Sauce Brush, Mayo/Toppings, Plate Order, Fan Steam, Chef Focus, pause/restart must be visible.
  - Requests must combine text, symbols, topping shapes, progress ticks, surface color, and checklist states so hue alone is not required.

## Menu and tutorial

Implement these states:

1. Title screen
   - Shows title “Yatai Okonomiyaki Flipmaster”.
   - Shows Day 038 badge, mode badge “3D”, public route `/yatai/`, best score, best Grand Service time if available, and a prompt link.
   - Shows a large Start button and visible tutorial panel by default.
   - Notes: “Audio starts after you press Start; visual heat, smoke, flip, and topping cues work if muted.”
2. Tutorial text
   - Objective: “Cook the requested okonomiyaki, flip in the golden window, finish toppings, and plate before tickets lose patience.”
   - Heat: slide cakes between Cool Prep, Golden Cook, and Hot Sear; hotter lanes cook faster but smoke more.
   - Flip: use Flip Cake when the underside ring is golden; early is raw, late is burned.
   - Finish: apply sauce, mayo, and requested toppings only after enough cooking.
   - Safety: Fan Steam before smoke redlines; tilt gently so cakes do not slide off the griddle.
   - Chef Focus: slows drift and previews heat/doneness/order match when charged.
   - Pause/restart: P/R on desktop or visible buttons on mobile.
3. In-game HUD
   - Score, best score, chef hearts, smoke %, ticket name, combo, selected cake, current tilt, Chef Focus charge, elapsed time, latest warning.
   - Pause/restart controls visible or immediately accessible.
4. Status helper
   - Non-blocking helper showing next cake, heat advice, flip timing, sauce/topping checklist, smoke warning, Chef Focus readiness, and expected score effect.
   - Must not cover the 3D griddle stage or bottom controls on mobile.
5. Pause overlay
   - Resume, restart, tutorial reminder, controls summary, audio/mute toggle, prompt link.
6. Game-over/results overlay
   - Final score, best score, ticket reached, Grand Service status, burned cakes, falls, perfect flips, sauce accuracy, smoke finish, badges, restart button.
7. Yatai Grand Service banner
   - Trigger once per run after all three ticket sets and 5200 score.
   - Non-blocking celebration: lanterns bloom, steam curls into a festival crest, bonito flakes dance, shiba helper stamps tickets, and endless orders continue after the banner fades.

## Assets

Prefer Imagegen2 (`openai/gpt-image-2`) for final visual art: shiba yatai chef helper mascot, portrait night-market griddle stall background, okonomiyaki ingredient/topping sprite sheet, and griddle/cake/sauce/topping/smoke UI icon sheet. Three.js primitives may render the interactive griddle, cakes, heat lanes, flip arcs, sauce/mayo overlays, toppings, steam particles, spatula ghost, plates, and UI chrome. It should not create final character/background/ingredient/icon art from scratch unless Imagegen2 is unavailable after a real attempt.

Archive source generated art under `release/games/038/assets/source/` and use optimized playable copies under `release/games/038/assets/`. Also copy optimized playable assets into `apps/day-038-yatai-okonomiyaki-flipmaster/assets/` and the public alias `release/yatai/assets/`.

For mobile-first crop safety: keep important content centered, leave 12-16% safe margins, avoid baked-in text, avoid watermarks, avoid fake UI labels, avoid tiny food/tool details that disappear at final in-game size, and keep helper/griddle/cake/sauce/mayo/topping/fan/smoke/order silhouettes distinct against warm night-market backgrounds.

Generate or provide at least these final art assets:

1. Shiba yatai chef helper mascot
   - Target: transparent PNG if possible, square source, final optimized texture around 512x512 or 256x256.
   - Archive path: `release/games/038/assets/source/yatai-helper-source.png`
   - Optimized path: `release/games/038/assets/yatai-helper.png`
   - Imagegen2 prompt: “A charming friendly shiba inu yatai chef helper mascot for a mobile 3D Japanese okonomiyaki griddle arcade game, small cute shiba wearing a navy festival apron and white chef headband, holding a flat metal spatula and sauce brush, kind focused expression, warm lantern rim light, centered readable silhouette, transparent or solid warm parchment background, no checkerboard background, no text, no watermark, sprite-friendly, high contrast at small size.”
   - Aspect ratio: square.
2. Night-market okonomiyaki griddle stall background source
   - Target: portrait-friendly background suitable behind a large 3D griddle with open readable center.
   - Archive path: `release/games/038/assets/source/yatai-stall-source.png`
   - Optimized path: `release/games/038/assets/yatai-stall.png`
   - Imagegen2 prompt: “A warm Osaka-style Japanese night-market yatai okonomiyaki stall for a portrait mobile 3D cooking arcade game, black iron teppan griddle, paper lanterns, sauce bottles, mayo squeeze bottle, cabbage bowl, bonito flake tray, small serving plates at the edges, amber festival light against deep navy night, open readable central griddle surface for interactive cakes, crop-safe for phone portrait, no characters in the center, no readable text, no watermark.”
   - Aspect ratio: portrait.
3. Okonomiyaki ingredient and topping sprite sheet source
   - Target: square sheet with separated readable ingredients/toppings that can be cropped or sampled into runtime sprites.
   - Archive path: `release/games/038/assets/source/yatai-toppings-source.png`
   - Optimized path: `release/games/038/assets/yatai-toppings.png`
   - Imagegen2 prompt: “Sprite sheet of small readable okonomiyaki ingredients and toppings for a mobile 3D Japanese griddle arcade game: round cabbage batter cake top, browned underside, pork strip, shrimp bits, green onion, bonito flakes, aonori powder, red pickled ginger, glossy brown sauce streak, white mayo ribbon, steam puff, each element separated with generous margins, transparent or warm parchment background, no checkerboard background, no text, no watermark, readable at 40-72 pixels.”
   - Aspect ratio: square.
4. Yatai griddle, cake, sauce, topping, smoke, and focus UI icon sheet source
   - Target: square icon sheet for objectives, hazards, tools, rewards, and UI decals.
   - Archive path: `release/games/038/assets/source/yatai-icons-source.png`
   - Optimized path: `release/games/038/assets/yatai-icons.png`
   - Imagegen2 prompt: “Small readable icon sheet for a Japanese okonomiyaki yatai cooking arcade game: black griddle, round okonomiyaki cake, flip spatula, sauce brush, mayo squeeze bottle, topping bowl, serving plate, steam fan, smoke warning puff, golden doneness ring, burned edge, order ticket seal, chef heart, Chef Focus lantern-griddle emblem, Grand Service festival crest, transparent or solid warm parchment background, no checkerboard background, high contrast, no text, no watermark, generous margins so no icons are cut off.”
   - Aspect ratio: square.

If Imagegen2 is unavailable or fails after a real attempt, create a clearly labeled emergency fallback using simple SVG/Three.js shiba/griddle/cake/topping silhouettes, document the failure in `ai/postmortems/day-038.md`, and still keep source/fallback files under the same asset paths.

### Mandatory generated-image QA

For every generated image, include a real inspection step after generation and before integration:

- Analyze the actual generated file visually, not just the prompt text.
- For the shiba helper mascot, verify transparent/cutout quality or clean background handling, readable friendly silhouette, centered pivot/crop margins, no unwanted text/watermarks, stable upright helper orientation, and that spatula/brush pose is compatible with static helper placement.
- For topping sprites, verify separated elements, readable browned/uncooked cake sides, distinct pork/shrimp/green onion/bonito/aonori/ginger/sauce/mayo/steam symbols at final 40-72px size, usable crop margins, no baked checkerboard, no unwanted text/watermark, and a documented visual baseline for which side is cooked/uncooked.
- Verify control-to-motion alignment in-game: selecting a cake must visibly highlight the intended 3D cake, Slide/drag must move it on x/z griddle lanes, Tilt Griddle must visibly change drift direction, Flip Cake must show a 3D arc and swap top/underside/doneness, Sauce Brush/Mayo/Toppings must visibly change the selected cake, Plate Order must transfer a matching cake to the plate, Fan Steam must reduce smoke/preview underside, Chef Focus must slow/preview heat/doneness/order match, Pause/Restart must work.
- For the background, verify the central griddle remains readable after portrait mobile crop and does not hide cakes, heat lanes, order ticket, helper, smoke, or controls.
- For the icon sheet, verify griddle, cake, spatula, sauce brush, mayo, topping bowl, serving plate, steam fan, smoke, doneness ring, burned edge, ticket seal, chef heart, focus emblem, and Grand Service crest are distinct at final HUD/button size and cannot be confused. Watch specifically for fake checkerboard transparency; alpha-clean or composite onto warm parchment if needed and inspect again.
- If inspection finds a problem, regenerate or post-process the image and inspect again. Do not ship broken visual assets just because tests pass.

## Audio and game feel

Because sizzling batter, spatula flips, sauce brushing, toppings, smoke, and plate service are central to the theme, include lightweight WebAudio cues initialized only after a user gesture:

- Soft griddle sizzle after Start.
- Spatula tap when selecting or sliding a cake.
- Bright whoosh/clack when Flip Cake succeeds.
- Dull splat when a flip is early/late or a cake lands poorly.
- Sauce brush swish and mayo squeeze chirp.
- Bonito-flake shimmer when toppings complete.
- Rising smoke hiss as smoke approaches red.
- Paper ticket bell when a correct order plates.
- Lantern shimmer when Chef Focus activates.
- Festival ta-da cadence when Yatai Grand Service triggers.

Audio must not block play if WebAudio is unavailable. Verify no autoplay errors: audio context should be created/resumed only after Start or another user interaction. Include a visible mute toggle in pause/results or HUD. Expose a narrow debug handle such as `window.__day038Audio = { ctx, enabled }` after user-gesture initialization so Playwright can assert audio state.

## Prompt page output

The archived `release/games/038/prompt.html` must be a consistent rendered HTML page, not raw Markdown pasted into a `<pre>` block. It should include:

- A clear `<title>` and `<h1>` using `Day 038 Game Generation Prompt`.
- A back-to-game link near the top.
- Semantic rendered sections (`h2`, `h3`, `ul/ol/li`, `p`, `pre/code` only for actual code/commands).
- The same readable prompt-page style pattern across days so prompt pages feel like one system.

## Subagents to dispatch

1. Implementation subagent
   - Build the static 3D game under `apps/day-038-yatai-okonomiyaki-flipmaster/`.
   - Integrate it into immutable release output under `release/games/038/`.
   - Create the public playable route under `release/yatai/`.
   - Use static HTML/CSS/JS with Three.js/WebGL/WebAudio and no backend.
   - The public alias must be self-contained or asset paths must be alias-safe.
   - If vendoring `three.module*.js`, also copy the matching `three.core*.js` beside it in the app, release archive, and `/yatai/` alias assets.
2. Asset/polish subagent
   - Generate/prepare Imagegen2 assets, archive source files, optimize playable copies, inspect generated images, remove fake checkerboards if present, and tune mobile readability/game feel.
3. QA/browser/mobile subagent
   - Run desktop and mobile smoke checks, verify no console errors, verify menu/tutorial/objective/controls/restart/pause, prompt links, 3D griddle stage render, Cake −/+, Slide/drag, Tilt Griddle, Flip Cake, Sauce Brush, Mayo Ribbon, Toppings, Plate Order, Fan Steam, Chef Focus control presence and visible mechanical effect, heat/doneness/smoke/order feedback, generated screenshot, generated assets, WebAudio initialization after user gesture, and 390x844 portrait layout.
4. Reflection/self-improvement subagent
   - Write `ai/postmortems/day-038.md` after validation with what worked, what failed, generated-image inspection notes, topping/cake visual baseline, audio verification, code-isolation confirmation, and whether generator/template/rubric improvements are justified.

## Acceptance criteria

- Static build passes.
- Code isolation is documented in QA/postmortem: no previous game implementation code was opened, inspected, copied, diffed, grepped, or adapted.
- Mode choice follows the cadence rule: Day 038 is real `3d` after Day 037 `2d`, with a meaningful griddle/cake depth/heat/flip system rather than decorative perspective.
- Desktop smoke passes.
- Mobile portrait smoke passes at about 390x844 with readable HUD/tutorial/order ticket, usable 44px+ cake/action/pause/restart controls, no forced landscape canvas, and no tiny survival-critical cakes.
- Prompt is visible from gallery and release folder.
- `prompts/day-038.md` is copied exactly to `release/games/038/prompt.md` and `release/yatai/prompt.md`.
- `release/games/038/prompt.html` and `release/yatai/prompt.html` render the prompt in browser-readable semantic HTML with the standard prompt-page styling, not a raw Markdown `<pre>` dump.
- Public alias `release/yatai/index.html`, `release/yatai/prompt.html`, `release/yatai/screenshot.png`, and `release/yatai/assets/` exist and work.
- Gallery card for Day 038 shows prompt availability, generation duration, public `/yatai/` links, mode `3d`, and actual generated date.
- Screenshot exists at `release/games/038/screenshot.png` and is non-empty/readable. Prefer a readable desktop gameplay screenshot for gallery cards; mobile screenshots are QA evidence unless the design is intentionally portrait-card friendly.
- Image/source assets exist under `release/games/038/assets/source/` and optimized assets exist under `release/games/038/assets/`, or a documented emergency fallback exists.
- Every generated image has an inspection note in the postmortem or QA notes; interactive cake/topping/griddle assets have verified background handling, orientation/pivot/crop, readability, and control-to-motion alignment.
- WebAudio initializes after user gesture and creates no autoplay console errors; audio is failsafe if unsupported and visual heat/doneness/smoke/order cues remain playable muted.
- No console errors during desktop or mobile smoke. Add data-URI favicons to game and prompt pages if needed to avoid favicon request noise.
- Existing `release/games/001/**` through `release/games/037/**` from origin/main remain unchanged.
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
# Screenshot/static checks: verify release/games/038/screenshot.png, prompt.md, prompt.html, index.html, game.js, styles.css, release/yatai/index.html, release/yatai/prompt.html, release/yatai/screenshot.png, optimized assets, source assets, and vendored Three.js files (if used) exist and are non-empty.
# Prompt copy check: cmp prompts/day-038.md release/games/038/prompt.md and cmp prompts/day-038.md release/yatai/prompt.md.
# Prompt HTML check: verify release/games/038/prompt.html has semantic h1/h2/list markup and a back-to-game link, not a raw Markdown dump inside <pre>, and no malformed ul > p or ol > p nodes, no direct nested lists, and no strong/b tags inside code.
# Browser smoke: open the local/static /yatai/ route and verify menu, tutorial, gameplay start, 3D griddle stage render, Cake selection, Slide/drag, Tilt Griddle, Flip Cake, Sauce Brush, Mayo Ribbon, Toppings, Plate Order, Fan Steam, Chef Focus, heat/doneness/smoke/order feedback, pause, restart, prompt page, WebAudio after user gesture, no console errors.
# Mobile smoke: repeat at a portrait phone viewport such as 390x844 and verify playable cake/action controls plus readable HUD/order ticket/stage/controls.
# Static screenshot check: inspect release/games/038/screenshot.png and release/yatai/screenshot.png for non-empty readable game content; use vision to judge actual visual quality.
# Image QA: inspect every Imagegen2 source/optimized asset and document the actual inspection result in ai/postmortems/day-038.md.
# Docker/static smoke: build the Docker image locally, run it, curl /yatai/ and /yatai/prompt.html, then stop the container.
# Immutable guard: confirm no release/games folders from origin/main changed except new Day 038.
```
