# Day 041 Game Generation Prompt

## Game identity

- Day: 041
- Title: Kinoko Mycelium Glowkeeper
- Slug: kinoko-mycelium-glowkeeper
- Public route word: kinoko
- Mode: 2D
- Genre: mobile-first mycelium network routing puzzle / timed nutrient-pulse arcade / forest-floor score chase
- Mood/style: bioluminescent midnight cedar forest floor, glowing mushroom caps, soft moss, amber dew, violet spore mist, tiny kodama mushroom helper, tactile rotate-and-pulse network feedback; a living underground signal puzzle rather than kintsugi shard repair, tatami layout, okonomiyaki cooking, goldfish scooping, karakuri gears, bridge trusses, temari thread orbits, fan dyeing, onsen valves, ikebana balance, orchard harvesting, kumiko screens, shrine stealth, matcha foam, fireworks, pachinko, mochi hopping, calligraphy tracing, kite mapping, dry-garden raking, underwater pearls, taiko rhythm routing, daruma tilting, spider-web weaving, pottery shaping, bamboo canals, origami folding, parasol sheltering, snow stacking, kimono stamping, bento service, windbell tuning, rail running, or koi collection.

## Why this game today

The generated series currently ends with:

- Day 038 `3d`: Yatai Okonomiyaki Flipmaster, amber/black griddle lanes, 3D pancakes, smoke, sauce, toppings, shiba helper.
- Day 039 `2d`: Tatami Moonroom Matwright, moonlit washitsu grid, tatami rectangles, grain arrows, seam/path rules, calico helper.
- Day 040 `3d`: Kohaku Kintsugi Star Mender, dark lacquer tray, curved 3D porcelain shards, gold seams, clamp/dust controls, sparrow helper.

The latest generated-mode streak is one `3d` (Day 040), so Day 041 may safely be a rich mobile-first `2d` game without extending a 2D streak. It deliberately moves away from close object repair, rectangular interior planning, and food/cooking into an organic living-network puzzle: rotate mushroom-root nodes, send timed glowing nutrient pulses through branching mycelium, bloom requested caps in order, mist dry paths, shoo beetles, and keep the forest chorus synchronized.

Recent screenshot/visual variety notes to avoid repeating:

- Day 040 used a dark purple/amber repair bench, oval tray, porcelain shards, gold seams, side control column, and sparrow helper.
- Day 039 used top-down green-gold tatami rectangles, room cards, seam/path overlays, shoji moonbeams, and calico helper.
- Day 038 used black griddle lanes, round cakes, amber cooking light, topping buttons, smoke, and shiba helper.

Day 041 should use a lush forest-floor board with irregular glowing mycelium strands, mushroom-cap nodes, dew reservoirs, spore lanterns, beetle hazards, moss patches, pulse wavefronts, and a kodama helper. Avoid oval repair trays, porcelain shards, gold lacquer, clamps, dust, rectangular room/mat grids, griddles/cakes/sauce/smoke, water tanks/fish/nets/bowls/ripples, gear teeth/axles/couplers/bells, bridges/rivers/bamboo trusses, centered thread spheres, radial pigment fans, valve ducts, floral stems, orchard fruit, wooden lattice strips, stealth cones, tea foam, firework arcs, pachinko pegs, mochi platforms, brush-calligraphy tracing, kite strings, sand rakes, underwater routes, taiko pads, maze boards, spider web strands, pottery profiles, bamboo canal tiles, origami crease grids, parasols, snow blocks, kimono panels, conveyor food, windbell notes, rail tracks, or koi ponds.

## Code isolation / no previous game source

The implementation must be written from scratch for this day. Do not open, inspect, copy, diff, grep, or adapt code from previous games, including old `apps/day-*` folders, old `release/games/NNN/` HTML/CSS/JS files, or old public alias folders. You may inspect previous metadata, prompts, postmortems, and screenshots only to avoid repeating concepts and visual identity. The new game's HTML/CSS/JS must come from this prompt and general browser/canvas/WebAudio game knowledge, not from earlier game implementations.

## Mode variety / 3D cadence

Inspection target: `src/data/games.ts` currently ends with Day 038 `3d`, Day 039 `2d`, and Day 040 `3d`. The latest generated-mode streak is one `3d`.

Mode decision: Day 041 is rich mobile-first `2d`, selected after a real 3D day. It must be mechanically deep enough to justify the mode:

- Use static-browser HTML/CSS/JS with Canvas/SVG/DOM/WebAudio as appropriate; no backend.
- Render a 2D living mycelium board where node type, branch orientation, pulse timing, nutrient color, wetness, beetle pressure, spore wind, bloom order, and chorus harmony matter mechanically.
- Gameplay must depend on 2D network state: mushroom-cap nodes, root junctions, one-way hypha arrows, dew reservoirs, blocked moss cells, dry/cracked paths, pulsing wavefronts, beetle bites, spore charge, chorus targets, and bloom chains.
- Player actions must manipulate the system: select a node, rotate branches, flip one-way flow, send a nutrient pulse, mist spores, shoo beetles, harvest glow, lock a route, use Bloom Focus to preview pulse paths and timing windows, pause/restart, and inspect tutorial hints.
- Portrait mobile is the default supported layout; no landscape gate.

## Design

- Objective: Bloom requested mushroom caps by routing colored nutrient pulses through a glowing mycelium network in the correct order, keeping branches moist, protecting key junctions from beetles, and maintaining forest chorus harmony before night dew evaporates.
- Win condition: Complete three forest commissions — First Spore Spark, Cedar Root Chorus, and Grand Kinoko Glowring — while reaching 5500 points to trigger “Kinoko Grand Mycelium Bloom”. After the banner, continue into endless grove commissions.
- Lose condition: Three grove hearts wither, night dew reaches 0%, five key branches dry out, beetles chew through three active routes, or the Grand Glowring commission receives wrong-color pulses twice.
- Core loop:
  1. Start on a title/menu screen with Day 041 badge, mode badge “2D”, public route `/kinoko/`, best score, best Grand Bloom time, tutorial, prompt link, audio note, and a large Start button.
  2. Show a portrait-friendly forest-floor board. The center is an irregular moss network with mushroom caps, root junctions, dew wells, spore gates, beetle approach lanes, and glowing pulse paths.
  3. A grove commission requests goals such as: “Bloom blue → amber → violet caps, keep dew above 45%, protect the fork junction, and complete one chorus chain without beetle damage.”
  4. Player selects the active node by tapping/clicking it or using Node −/+ controls. The selected node gets a luminous cap ring, branch endpoint dots, flow arrows, and a small bounce.
  5. Rotate Branch turns the selected junction through its available branch orientations. Valid paths glow green/gold; routes that would send pulses into dry moss glow vermilion.
  6. Flip Flow reverses one-way hypha arrows for the selected junction when allowed. Flip timing matters because wrong-way pulses bounce and waste dew.
  7. Pulse Nutrients sends the active color pulse from the dew well. Pulses travel along connected mycelium, split at forks, fade in dry sections, and bloom matching caps when they arrive during the requested timing window.
  8. Mist Spores restores wetness along a small area around the selected node and temporarily slows beetles, but over-misting dilutes color strength and reduces combo score.
  9. Shoo Beetles pushes beetles away from one active route. Beetles chew highlighted branches if ignored, forcing repairs and draining grove hearts.
  10. Lock Route protects one branch orientation for the current pulse chain but costs focus charge to unlock.
  11. Harvest Glow collects energy from freshly bloomed caps, raising score and charging Bloom Focus; harvesting too early reduces the cap's chorus value.
  12. Bloom Focus, charged by clean pulse arrivals and no-damage chains, overlays predicted pulse paths, color mixing, arrival timing, dry-route risk, beetle targets, next best node, and commission-matching caps.
  13. Completing a commission stamps a mushroom seal, restores one grove heart if needed, awards points, changes network shape and constraints, and unlocks faster beetles, branching pulses, alternating colors, hidden dry spots, and multi-cap chorus orders.
  14. Pause/restart remain visible throughout.
- 15+ minute play-value strategy:
  - Save best score, fastest Kinoko Grand Mycelium Bloom time, longest clean chorus chain, highest endless grove, fewest dry branches, most beetles shooed without damage, highest wetness finish, most perfect color pulses, and collected mushroom seal badges in localStorage.
  - Include three authored grove commissions:
    - First Spore Spark: small network, three caps, broad timing window, guided first Rotate Branch and Pulse Nutrients, no heart penalty for the first tutorial misroute.
    - Cedar Root Chorus: medium network with two dew wells, first Flip Flow requirement, beetle warning lane, one dry branch, and blue/amber pulse order.
    - Grand Kinoko Glowring: large circular-but-irregular grove, branching split pulse, violet/blue/amber order, required Bloom Focus preview, beetle pressure, and dew target above 40%.
  - Deterministic Day 041 seed varies node positions, branch graph, dew well strength, cap colors, pulse speed, dry-route decay, spore mist radius, beetle spawn timing, color mixing, focus charge, and endless constraints while keeping opening seconds fair.
  - Mastery badges: complete First Spore Spark with zero misroutes, trigger Grand Bloom under 285 seconds, finish Cedar Root Chorus with no beetle bites, complete Grand Glowring with dew above 55%, bloom three caps in one pulse chain, harvest five glow caps at perfect timing.
  - Strategic scoring rewards network planning: rotate junctions before pulsing, preserve wetness on long routes, flip one-way branches only when the order demands it, mist before a pulse enters a dry lane, shoo beetles away from high-value forks, and save Bloom Focus for split-pulse chorus chains.
  - Endless mode after Grand Bloom adds extra cap colors, beetle feints, hidden dry patches, forked pulses, shorter dew timer, chorus echo bonuses, and bonus elder-mushroom commissions without shrinking touch controls.
- Difficulty scaling:
  - 0-45 seconds: small graph, slow beetles, broad timing, obvious branch previews, forgiving dew.
  - 45-150 seconds: two colors, Flip Flow, first dry branch, beetle warning lane, mist management.
  - 150-285 seconds: split pulses, required Bloom Focus, tighter arrival timing, more caps, faster dew evaporation.
  - 285+ seconds/endless: hidden dry patches, color-mix decoys, faster beetles, same readable controls.
  - Keep mobile fair: nodes, branches, pulse wavefronts, commission card, dew meter, beetle warnings, helper, and action buttons must be readable at 390x844; primary touch buttons should be 52px+ where possible and never below 44px; no tiny survival-critical nodes.
- Scoring/rewards:
  - Valid branch rotation that opens a requested path: +140 points times combo tier.
  - Correct-color pulse reaches requested cap: +260 points and Bloom Focus charge.
  - Split pulse blooms two caps: +420 points.
  - Mist restores a critical dry route before pulse arrival: +170 points.
  - Shoo Beetles before a bite: +160 points and preserve combo.
  - Harvest Glow at full bloom: +210 points.
  - Complete commission before dew warning: +980 points and restore one grove heart if below max.
  - Perfect no-damage chorus: +1450 points.
  - Kinoko Grand Mycelium Bloom: +3100 points and endless groves unlock.
  - Wrong-color bloom, dry-route fade, bounced pulse, or beetle bite: combo reset, dew/grove-heart penalty.

## Controls and layout

- Desktop:
  - Mouse click/tap: select nodes, press controls, start/pause overlay button, prompt link, or explainable HUD chips.
  - Mouse drag on the board: move the selector to nearby nodes and preview the next branch orientation; direct node selection remains deterministic.
  - Arrow keys or WASD: move selection to adjacent node.
  - Q/E or Space: Rotate Branch.
  - F: Flip Flow.
  - Enter: Pulse Nutrients.
  - M: Mist Spores.
  - B: Shoo Beetles.
  - L: Lock Route.
  - H: Harvest Glow.
  - Shift or G: Bloom Focus when charged.
  - P: pause/resume.
  - R: restart current run.
- Mobile/touch:
  - Tap a node to select it. Drag within the board to scrub between large node targets with a visible offset so branch endpoints remain visible above the finger.
  - Use large Node −, Node +, Rotate Branch, Flip Flow, Pulse Nutrients, Mist Spores, Shoo Beetles, Lock Route, Harvest Glow, Bloom Focus, Pause, Restart, Audio, and Prompt buttons.
  - Tapping dew/color/beetle/dryness/focus chips may show short explanations.
  - No tiny virtual joystick. Interaction is direct node select/drag plus labeled network/action controls.
- Mobile layout/orientation:
  - Default target is portrait phone play around 390x844; do not require landscape.
  - Top: compact Kinoko HUD with score, best, grove hearts, dew %, dry branches, combo, active node, active color, beetle risk, Bloom Focus charge, and elapsed time. Use mushroom/root/dew/spore/beetle/glow chips, not shard/tatami/cake/fish/gear/bridge/thread/fan/valve/flower/fruit/lattice/shrine/tea-foam/firework/cat-coin/rabbit/brush-calligraphy/kite/sand/pearl/drum icons.
  - Below top: grove commission card with requested cap colors/order, dew target, beetle-protection target, branch count, chorus progress, and timing ticks.
  - Center: large forest-floor mycelium board with nodes, branch lines, flow arrows, pulse wavefronts, mushroom caps, dew wells, dry cracks, beetles, helper art, and readable feedback. It must remain playable without zooming.
  - Bottom: status helper plus large network/action controls. Controls must not cover nodes, pulse previews, commission card, helper, beetle warnings, or branch paths.
  - Tutorial must fit on the first portrait screen; optional details may be collapsible but objective, select/rotate node, Flip Flow, Pulse Nutrients, Mist Spores, Shoo Beetles, Lock Route, Harvest Glow, Bloom Focus, pause/restart must be visible.
  - Requests must combine text, icons, cap shapes, branch outlines, pulse patterns, progress ticks, and labels so hue alone is not required.

## Menu and tutorial

Implement these states:

1. Title screen
   - Shows title “Kinoko Mycelium Glowkeeper”.
   - Shows Day 041 badge, mode badge “2D”, public route `/kinoko/`, best score, best Grand Bloom time if available, and a prompt link.
   - Shows a large Start button and visible tutorial panel by default.
   - Notes: “Audio starts after you press Start; visual pulse, dew, beetle, color, and bloom cues work if muted.”
2. Tutorial text
   - Objective: “Rotate the glowing mycelium, send nutrient pulses, bloom the requested mushrooms, and protect the grove before the dew fades.”
   - Network: select a node, Rotate Branch to connect roots, and Flip Flow when an arrow points the wrong way.
   - Pulses: Pulse Nutrients from the dew well; match cap colors/order and timing windows.
   - Wetness/safety: Mist Spores before dry cracks fade a pulse; Shoo Beetles before they chew active routes.
   - Harvest: Harvest Glow after a cap fully blooms to score and charge Bloom Focus.
   - Bloom Focus: previews pulse paths, timing, dry risks, beetle targets, and commission matches when charged.
   - Pause/restart: P/R on desktop or visible buttons on mobile.
3. In-game HUD
   - Score, best score, grove hearts, dew %, dry branches, commission name, combo, selected node, active pulse color, beetle risk, Bloom Focus charge, elapsed time, latest warning.
   - Pause/restart controls visible or immediately accessible.
4. Status helper
   - Non-blocking helper showing selected node, route hint, next cap, dew warning, beetle warning, pulse timing, Bloom Focus readiness, and expected score effect.
   - Must not cover the mycelium board or bottom controls on mobile.
5. Pause overlay
   - Resume, restart, tutorial reminder, controls summary, audio/mute toggle, prompt link.
6. Game-over/results overlay
   - Final score, best score, commission reached, Grand Bloom status, dry branches, beetle bites, clean pulse chains, harvest timing, badges, restart button.
7. Kinoko Grand Mycelium Bloom banner
   - Trigger once per run after all three grove commissions and 5500 score.
   - Non-blocking celebration: all caps glow in a ring, pulse paths shimmer like constellations under moss, the kodama helper stamps a mushroom seal, spore motes swirl upward, and endless commissions continue after the banner fades.

## Assets

Prefer Imagegen2 (`openai/gpt-image-2`) for final visual art: kodama mushroom helper mascot, portrait bioluminescent cedar forest floor background, mushroom-cap/mycelium/dew/beetle sprite sheet, and mushroom/root/dew/spore/beetle/glow UI icon sheet. Canvas/SVG code may render the interactive branch graph, pulse wavefronts, node highlights, flow arrows, dry cracks, beetle path overlays, particles, and UI chrome. It should not create final character/background/texture/icon art from scratch unless Imagegen2 is unavailable after a real attempt.

Archive source generated art under `release/games/041/assets/source/` and use optimized playable copies under `release/games/041/assets/`. Also copy optimized playable assets into `apps/day-041-kinoko-mycelium-glowkeeper/assets/` and the public alias `release/kinoko/assets/`.

For mobile-first crop safety: keep important content centered, leave 12-16% safe margins, avoid baked-in text, avoid watermarks, avoid fake UI labels, avoid tiny branch details that disappear at final in-game size, and keep helper/mushrooms/roots/dew/beetles/spores/glow/focus silhouettes distinct against dark moss and violet forest backgrounds.

Generate or provide at least these final art assets:

1. Kodama mushroom helper mascot
   - Target: transparent PNG if possible, square source, final optimized texture around 512x512 or 256x256.
   - Archive path: `release/games/041/assets/source/kinoko-helper-source.png`
   - Optimized path: `release/games/041/assets/kinoko-helper.png`
   - Imagegen2 prompt: “A charming tiny kodama mushroom helper mascot for a mobile Japanese forest-floor mycelium routing puzzle game, small friendly spirit with a round mushroom cap hat, moss-green scarf, holding a glowing dew drop lantern and tiny twig pointer, kind curious expression, violet bioluminescent rim light, centered readable silhouette, transparent or solid warm parchment background, no checkerboard background, no text, no watermark, sprite-friendly, high contrast at small size.”
   - Aspect ratio: square.
2. Bioluminescent cedar forest floor background source
   - Target: portrait-friendly background suitable behind a large 2D mycelium board with open readable center.
   - Archive path: `release/games/041/assets/source/kinoko-forest-source.png`
   - Optimized path: `release/games/041/assets/kinoko-forest.png`
   - Imagegen2 prompt: “A magical midnight Japanese cedar forest floor for a portrait mobile 2D puzzle game, soft moss, glowing mushrooms, amber dew drops, violet spore mist, small cedar roots at the edges, deep indigo and emerald palette, open readable central moss area for an overlaid mycelium network board, crop-safe for phone portrait, no characters in the center, no readable text, no watermark.”
   - Aspect ratio: portrait.
3. Mushroom cap, mycelium, dew, and beetle sprite sheet source
   - Target: square sheet with separated readable materials that can be used as sprites/decals.
   - Archive path: `release/games/041/assets/source/kinoko-pieces-source.png`
   - Optimized path: `release/games/041/assets/kinoko-pieces.png`
   - Imagegen2 prompt: “Sprite sheet of small readable forest mycelium puzzle pieces: blue glowing mushroom cap, amber glowing mushroom cap, violet glowing mushroom cap, branching white mycelium root segment, fork junction, dew well, spore mist puff, moss patch, dry cracked branch, tiny black beetle, golden bloom sparkle, each element separated with generous margins, transparent or warm parchment background, no checkerboard background, no text, no watermark, readable at 40-96 pixels.”
   - Aspect ratio: square.
4. Kinoko root, dew, spore, beetle, bloom, and focus UI icon sheet source
   - Target: square icon sheet for objectives, hazards, tools, rewards, and UI decals.
   - Archive path: `release/games/041/assets/source/kinoko-icons-source.png`
   - Optimized path: `release/games/041/assets/kinoko-icons.png`
   - Imagegen2 prompt: “Small readable icon sheet for a Japanese mycelium glow routing puzzle game: mushroom cap, rotate branch arrow, one-way flow arrow, nutrient pulse, dew drop, mist spores, beetle warning, lock route, harvest glow, dry cracked root, Bloom Focus mushroom-ring emblem, grove heart leaf, mushroom seal, Grand Mycelium Bloom crest, transparent or solid warm parchment background, no checkerboard background, high contrast, no text, no watermark, generous margins so no icons are cut off.”
   - Aspect ratio: square.

If Imagegen2 is unavailable or fails after a real attempt, create a clearly labeled emergency fallback using simple SVG/canvas kodama/mushroom/root/dew/beetle/icon silhouettes, document the failure in `ai/postmortems/day-041.md`, and still keep source/fallback files under the same asset paths.

### Mandatory generated-image QA

For every generated image, include a real inspection step after generation and before integration:

- Analyze the actual generated file visually, not just the prompt text.
- For the kodama helper mascot, verify transparent/cutout quality or clean background handling, readable friendly silhouette, centered pivot/crop margins, no unwanted text/watermarks, stable upright orientation, and that dew-lantern/twig pose is compatible with static helper placement.
- For the pieces sheet, verify separated blue/amber/violet mushroom caps, readable mycelium root/junction/dew/mist/moss/dry/beetle/glow elements at final 40-96px size, usable crop margins, no baked checkerboard, no unwanted text/watermark, and a documented visual baseline for cap color/order and branch flow direction.
- Verify control-to-motion alignment in-game: selecting a node must visibly highlight the intended node, Rotate Branch must visibly change branch endpoints, Flip Flow must reverse arrows, Pulse Nutrients must animate along connected routes, Mist Spores must restore wetness, Shoo Beetles must move/slow beetles, Lock Route must visibly mark a protected branch, Harvest Glow must collect bloom energy, Bloom Focus must preview pulse/dry/beetle risks, Pause/Restart must work.
- For the background, verify the central board remains readable after portrait mobile crop and does not hide nodes, branches, pulse wavefronts, commission card, helper, beetles, or controls.
- For the icon sheet, verify mushroom cap, rotate, flow, nutrient pulse, dew, mist, beetle, lock, harvest, dry root, Bloom Focus, grove heart, mushroom seal, and Grand Bloom crest are distinct at final HUD/button size and cannot be confused. Watch specifically for fake checkerboard transparency; alpha-clean or composite onto warm parchment if needed and inspect again.
- If inspection finds a problem, regenerate or post-process the image and inspect again. Do not ship broken visual assets just because tests pass.

## Audio and game feel

Because glowing pulses, dew droplets, spore mist, mushroom blooms, beetle warnings, and forest chorus are central to the theme, include lightweight WebAudio cues initialized only after a user gesture:

- Soft moss tap when selecting a node.
- Gentle root-click when Rotate Branch or Flip Flow changes orientation.
- Liquid chime when Pulse Nutrients launches.
- Rising shimmer as a pulse reaches a correct cap.
- Dry crack tick when a pulse enters a dry branch.
- Mist spray hush when Mist Spores restores wetness.
- Tiny wooden clack when Shoo Beetles succeeds.
- Warm glow pluck when Harvest Glow collects a cap.
- Deep forest hum when Bloom Focus activates.
- Calm bell-and-cricket flourish when Kinoko Grand Mycelium Bloom triggers.

Audio must not block play if WebAudio is unavailable. Verify no autoplay errors: audio context should be created/resumed only after Start or another user interaction. Include a visible mute toggle in pause/results or HUD. Expose a narrow debug handle such as `window.__day041Audio = { ctx, enabled }` after user-gesture initialization so Playwright can assert audio state.

## Prompt page output

The archived `release/games/041/prompt.html` must be a consistent rendered HTML page, not raw Markdown pasted into a `<pre>` block. It should include:

- A clear `<title>` and `<h1>` using `Day 041 Game Generation Prompt`.
- A back-to-game link near the top.
- Semantic rendered sections (`h2`, `h3`, `ul/ol/li`, `p`, `pre/code` only for actual code/commands).
- The same readable prompt-page style pattern across days so prompt pages feel like one system.

## Subagents to dispatch

1. Implementation subagent
   - Build the static 2D game under `apps/day-041-kinoko-mycelium-glowkeeper/`.
   - Integrate it into immutable release output under `release/games/041/`.
   - Create the public playable route under `release/kinoko/`.
   - Use static HTML/CSS/JS with Canvas/SVG/WebAudio and no backend.
   - The public alias must be self-contained or asset paths must be alias-safe.
2. Asset/polish subagent
   - Generate/prepare Imagegen2 assets, archive source files, optimize playable copies, inspect generated images, remove fake checkerboards if present, document cap-color/branch-flow visual baselines, and tune mobile readability/game feel.
3. QA/browser/mobile subagent
   - Run desktop and mobile smoke checks, verify no console errors, verify menu/tutorial/objective/controls/restart/pause, prompt links, mycelium board render, node selection/drag, Node −/+, Rotate Branch, Flip Flow, Pulse Nutrients, Mist Spores, Shoo Beetles, Lock Route, Harvest Glow, Bloom Focus control presence and visible mechanical effect, pulse/dew/dry/beetle/bloom feedback, generated screenshot, generated assets, WebAudio initialization after user gesture, and 390x844 portrait layout.
4. Reflection/self-improvement subagent
   - Write `ai/postmortems/day-041.md` after validation with what worked, what failed, generated-image inspection notes, cap-color/branch-flow visual baseline, audio verification, code-isolation confirmation, and whether generator/template/rubric improvements are justified.

## Acceptance criteria

- Static build passes.
- Code isolation is documented in QA/postmortem: no previous game implementation code was opened, inspected, copied, diffed, grepped, or adapted.
- Mode choice follows the cadence rule: Day 041 is `2d` after Day 040 `3d`, with meaningful living-network routing/timing mechanics rather than low-effort flat decoration.
- Desktop smoke passes.
- Mobile portrait smoke passes at about 390x844 with readable HUD/tutorial/grove card, usable 44px+ node/action/pause/restart controls, no forced landscape canvas, and no tiny survival-critical nodes.
- Prompt is visible from gallery and release folder.
- `prompts/day-041.md` is copied exactly to `release/games/041/prompt.md` and `release/kinoko/prompt.md`.
- `release/games/041/prompt.html` and `release/kinoko/prompt.html` render the prompt in browser-readable semantic HTML with the standard prompt-page styling, not a raw Markdown `<pre>` dump.
- Public alias `release/kinoko/index.html`, `release/kinoko/prompt.html`, `release/kinoko/screenshot.png`, and `release/kinoko/assets/` exist and work.
- Gallery card for Day 041 shows prompt availability, generation duration, public `/kinoko/` links, mode `2d`, and actual generated date.
- Screenshot exists at `release/games/041/screenshot.png` and is non-empty/readable. Prefer a readable desktop gameplay screenshot for gallery cards; mobile screenshots are QA evidence unless the design is intentionally portrait-card friendly.
- Image/source assets exist under `release/games/041/assets/source/` and optimized assets exist under `release/games/041/assets/`, or a documented emergency fallback exists.
- Every generated image has an inspection note in the postmortem or QA notes; interactive node/root/pulse/dew/beetle visuals have verified background handling, orientation/pivot/crop, readability, and control-to-motion alignment.
- WebAudio initializes after user gesture and creates no autoplay console errors; audio is failsafe if unsupported and visual pulse/dew/dry/beetle/order cues remain playable muted.
- No console errors during desktop or mobile smoke. Add data-URI favicons to game and prompt pages if needed to avoid favicon request noise.
- Existing `release/games/001/**` through `release/games/040/**` from origin/main remain unchanged.
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
# Screenshot/static checks: verify release/games/041/screenshot.png, prompt.md, prompt.html, index.html, game.js, styles.css, release/kinoko/index.html, release/kinoko/prompt.html, release/kinoko/screenshot.png, optimized assets, and source assets exist and are non-empty.
# Prompt copy check: cmp prompts/day-041.md release/games/041/prompt.md and cmp prompts/day-041.md release/kinoko/prompt.md.
# Prompt HTML check: verify release/games/041/prompt.html has semantic h1/h2/list markup and a back-to-game link, not a raw Markdown dump inside <pre>, and no malformed ul > p or ol > p nodes, no direct nested lists, and no strong/b tags inside code.
# Browser smoke: open the local/static /kinoko/ route and verify menu, tutorial, gameplay start, mycelium board render, node selection/drag, Node −/+, Rotate Branch, Flip Flow, Pulse Nutrients, Mist Spores, Shoo Beetles, Lock Route, Harvest Glow, Bloom Focus, pulse/dew/dry/beetle/bloom feedback, pause, restart, prompt page, WebAudio after user gesture, no console errors.
# Mobile smoke: repeat at a portrait phone viewport such as 390x844 and verify playable node/action controls plus readable HUD/grove card/stage/controls.
# Static screenshot check: inspect release/games/041/screenshot.png and release/kinoko/screenshot.png for non-empty readable game content; use vision to judge actual visual quality.
# Image QA: inspect every Imagegen2 source/optimized asset and document the actual inspection result in ai/postmortems/day-041.md.
# Docker/static smoke: build the Docker image locally, run it, curl /kinoko/ and /kinoko/prompt.html, then stop the container.
# Immutable guard: confirm no release/games folders from origin/main changed except new Day 041.
```
