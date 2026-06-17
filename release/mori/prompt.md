# Day 008 Game Generation Prompt

## Game identity

- Day: 008
- Title: Mori Mosslight Seedkeeper
- Slug: mori-mosslight-seedkeeper
- Public route word: mori
- Mode: 3D
- Genre: mobile-first 3D garden-routing strategy arcade / terrarium stewardship score chase
- Mood/style: miniature mossy forest shrine diorama, glowing dew beads, tiny kodama seedlings, cedar roots, warm lantern-green highlights, tactile board-game pieces, calm nature craft with escalating arcade pressure, readable portrait-phone 3D

## Why this game today

The current generated series in `src/data/games.ts` is:

- Day 001 `2d`: calm koi pond collection and drift survival.
- Day 002 `2d`: timed sky-courier route planning.
- Day 003 `3d`: neon bonsai ring-flight crafting.
- Day 004 `2d`: firefly path drawing / light routing.
- Day 005 `3d`: dream-rail lane runner.
- Day 006 `hybrid`: 3D moonbeam/prism alignment puzzle.
- Day 007 `2d`: seaside bento order-management cooking arcade.

The latest generated-mode streak is one 2D game after Day 007. Day 008 deliberately returns to real 3D to keep the cadence strong and prevent the series from drifting back toward flat canvas games.

Day 008 must feel unlike the previous entries:

- It is not steering a vehicle or lane runner.
- It is not path drawing with direct lines.
- It is not beam/prism reflection.
- It is not cooking/order sorting.
- It is not pure collection survival.

The new verb set is: inspect a small 3D forest diorama, place and rotate moss/root tiles, route rolling dew beads through elevation and slopes, protect seedling basins from soot mites, and time a special lantern pulse. The mood shifts from Day 007's bright kitchen counter to a damp, emerald, forest-floor shrine with tiny crafted 3D pieces and soft natural glow.

Recent screenshot variety notes:

- Day 005 was a deep blue 3D rail corridor with bottom lane buttons.
- Day 006 was a cool cyan/gold 3D observatory board with prism rotation controls.
- Day 007 was a warm top-down/2D bento counter with horizontal conveyor lanes and many HUD cards.

Day 008 should use a compact isometric/perspective 3D board: moss platforms, little root bridges, dew marbles, seedling cups, lantern posts, and forest backdrop. The screen should be quieter and more tactile than the recent HUD-heavy games, while still having clear arcade feedback.

## Code isolation / no previous game source

The implementation must be written from scratch for this day. Do not open, inspect, copy, diff, grep, or adapt code from previous games, including old `apps/day-*` folders, old `release/games/NNN/` HTML/CSS/JS files, or old public alias folders. You may inspect previous metadata, prompts, postmortems, and screenshots only to avoid repeating concepts and visual identity. The new game's HTML/CSS/JS must come from this prompt and general web/game knowledge, not from earlier game implementations.

## Mode variety / 3D cadence

Inspection target: `src/data/games.ts` currently ends with Day 005 `3d`, Day 006 `hybrid`, and Day 007 `2d`. The latest generated 2D streak is one.

Mode decision: Day 008 is `3D`. It must implement real spatial gameplay, not decorative perspective:

- Use Three.js/WebGL or equivalent static browser 3D rendering.
- Render a perspective/isometric forest-shrine board with actual depth, height tiers, ramps, slopes, seedling basins, dew paths, hazards, and camera depth cues.
- Gameplay must depend on 3D positions and elevations: dew beads roll/flow across tile pieces, down ramps, over root bridges, and into basins.
- Player actions must manipulate board pieces in 3D: select a tile, rotate its slope/root connector, place a temporary root bridge, or pulse a lantern to repel soot mites.
- Portrait mobile is the default supported layout; no landscape gate.

## Design

- Objective: Guide glowing dew beads across a 3D moss shrine board into thirsty seedling basins while protecting the seedlings from soot mites and drought.
- Win condition: Complete three growth chapters — Fern Steps, Cedar Gate, and Kodama Bloom — and reach 2600 points to trigger “Mori Mosslight Bloom”. After Bloom, continue into endless forest-night scoring.
- Lose condition: Three seedlings wither because dew is lost off the board, soot mites reach basins, or the drought meter fills to 100%.
- Core loop:
  1. Start on a title/menu screen with Day 008 badge, mode badge “3D”, public route `/mori/`, best score, best Bloom time, tutorial, prompt link, and a large Start button.
  2. Show a compact 3D forest shrine board made of moss tiles at different heights, with seedling basins around the edges and a dew source near the center/top.
  3. Dew beads spawn in timed pulses and roll/flow along connected moss/root channels according to tile orientation and slope arrows.
  4. Player taps/clicks a tile to select it, then rotates the tile connector or slope using large controls. Some phases allow placing a temporary root bridge on an empty socket.
  5. Correctly routed dew charges seedling basins; fully charged basins grow leaves and score combo points.
  6. Soot mites occasionally crawl along roots toward basins. The player can route dew through cleansing moss or use the Mosslight Lantern special to push mites back.
  7. Misrouted dew falls into leaf gutters, raising drought. Too many mites or drought events wither seedlings.
  8. Pause/restart remain available throughout.
- 15+ minute play-value strategy:
  - Save best score, fastest Mosslight Bloom time, longest perfect dew-chain streak, and highest endless grove wave in localStorage.
  - Include three authored growth chapters:
    - Fern Steps: simple two-height board, one dew source, two basins, slow mites, teaches selection and rotation.
    - Cedar Gate: three-height board, split channels, temporary root bridge, first moving soot mite, drought pressure.
    - Kodama Bloom: four basins, crossing root paths, timed dew bursts, cleansing moss, multiple mites, route-priority decisions.
  - Deterministic Day 008 seed varies dew burst order, basin requests, mite spawn timing, bridge sockets, and bonus firefly dew while keeping early runs fair.
  - Mastery badges: finish Fern Steps without losing dew, grow 12 basins in a row, trigger Mosslight Bloom under 170 seconds, reach 4300 in endless.
  - Strategic scoring rewards foresight: route dew before it spawns, save bridge pieces for hard crossings, use Mosslight Lantern only when mites threaten, and maintain clean dew streaks.
  - Endless forest-night after Bloom adds more basins, faster dew pulses, higher drought pressure, and trickier root connectors while keeping tile targets large on mobile.
- Difficulty scaling:
  - 0-45 seconds: two simple rotatable tiles, one basin sequence, slow dew beads, no instant penalties.
  - 45-105 seconds: split route tiles, two requested basins, first soot mites, one bridge socket.
  - 105-170 seconds: height changes, crossing roots, cleansing moss, more frequent dew pulses, active basin priority.
  - 170+ seconds/endless: denser requests, faster mites, shorter planning windows, more rewarding combo chains.
  - Keep mobile fair: large 3D tiles, thick glowing route lines, visible direction arrows, 56px+ action controls, generous hit testing, no tiny collectible required for survival.
- Scoring/rewards:
  - Dew bead delivered to requested basin: +65 points times dew-chain combo.
  - Basin fully grown: +220 points and drought meter -8%.
  - Perfect dew pulse with no lost bead: +140 bonus and +12% Mosslight charge.
  - Cleansing moss mite removal: +95 points.
  - Complete chapter: +420 points plus restore one withered seedling if below max.
  - Mori Mosslight Bloom: +850 points and endless grove unlock.
  - Dew lost off board: +7% drought and combo reset.
  - Soot mite reaches basin: seedling stress +1; repeated stress withers a seedling.

## Controls and layout

- Desktop:
  - Mouse click: select a moss/root tile, basin, or bridge socket.
  - A/D or Arrow Left/Right: rotate selected tile counter-clockwise/clockwise.
  - Q/E: cycle selectable tiles.
  - Space or Shift: activate Mosslight Lantern when charged.
  - B: place/remove a temporary root bridge when a bridge socket is selected.
  - P: pause/resume.
  - R: restart current run.
  - Enter/click: start from menu or confirm restart.
- Mobile/touch:
  - Tap a large tile to select it; selected tile glows and displays direction arrows.
  - Use two large rotate buttons at the bottom, each at least 56px tall.
  - Tap a bridge socket then tap the large “Root Bridge” button to place or recall the bridge.
  - Large Mosslight button near lower right, at least 56px target.
  - Pause and Restart controls with 44px+ targets.
  - No tiny virtual joystick. Interaction is tap-select plus large rotate/place controls.
- Mobile layout/orientation:
  - Default target is portrait phone play around 390x844; do not require landscape.
  - Top: compact HUD with score, best, seedlings, drought meter, chapter, combo, current basin request, Mosslight charge.
  - Center: 3D board fills the main viewport with the camera angled enough to see height differences and rolling dew.
  - Bottom: large rotate left/right, Root Bridge, Mosslight, Pause/Restart controls; controls must not cover the selected tile or requested basin labels.
  - Tutorial must fit on the first portrait screen; optional details may be collapsible but objective, rotation, bridge, mites, and Mosslight special must be visible.
  - Tile/basin signs must combine color, shape, icon, and short text labels such as FERN, CEDAR, KODA, DEW so hue alone is not required.

## Menu and tutorial

Implement these states:

1. Title screen
   - Shows title “Mori Mosslight Seedkeeper”.
   - Shows Day 008 badge, mode badge “3D”, public route `/mori/`, best score, best Bloom time if available, and a prompt link.
   - Shows a large Start button and visible tutorial panel by default.
2. Tutorial text
   - Objective: “Rotate moss tiles, guide dew into seedling basins, and keep soot mites away.”
   - Rotation: desktop A/D or mobile rotate buttons turn the selected root tile.
   - Dew routing: glowing beads follow connected roots and slopes; deliver them to the requested basin.
   - Root Bridge: place a temporary bridge on marked sockets to cross gaps.
   - Hazards: lost dew raises drought; soot mites stress seedlings.
   - Mosslight Lantern: pushes mites back and slows drought when charged.
   - Pause/restart: P/R on desktop or visible buttons on mobile.
3. In-game HUD
   - Score, best score, seedling health, drought meter, chapter, grown basins, combo, selected tile, current request, Mosslight charge.
   - Pause/restart controls visible or immediately accessible.
4. Selected-tile helper overlay
   - Non-blocking hint near selected tile showing connector directions and next rotation.
   - Must not cover active dew paths or basins on mobile.
5. Pause overlay
   - Resume, restart, tutorial reminder, controls summary, prompt link.
6. Game-over/results overlay
   - Final score, best score, chapter reached, Bloom status, perfect dew-chain streak, mastery badges, restart button.
7. Mori Mosslight Bloom banner
   - Trigger once per run after all three growth chapters and 2600 score.
   - Non-blocking emerald lantern bloom, seedlings sprout, kodama fireflies rise; endless play continues after the banner fades.

## Assets

Prefer Imagegen2 (`openai/gpt-image-2`) for final visual art: seedkeeper mascot/charm, forest shrine background, moss/root icon sheet, and key decorative pieces. Three.js primitives may render the board geometry, route channels, dew beads, basins, mites, hit volumes, guide arrows, particles, and UI chrome. Procedural code may crop, resize, alpha-clean, atlas-pack, optimize, animate, or place generated assets; it should not create final character/background/icon art from scratch unless Imagegen2 is unavailable after a real attempt.

Archive source generated art under `release/games/008/assets/source/` and use optimized playable copies under `release/games/008/assets/`. Also copy optimized playable assets into `apps/day-008-mori-mosslight-seedkeeper/assets/` and the public alias `release/mori/assets/`.

For mobile-first crop safety: keep important content centered, leave 12-16% safe margins, avoid baked-in text, avoid watermarks, avoid tiny details that disappear at final in-game size, and keep high-contrast silhouettes.

Generate or provide at least these final art assets:

1. Mosslight seedkeeper mascot/source charm
   - Target: transparent PNG, square source, final optimized texture around 512x512 or 256x256.
   - Archive path: `release/games/008/assets/source/mori-seedkeeper-source.png`
   - Optimized path: `release/games/008/assets/mori-seedkeeper.png`
   - Imagegen2 prompt: “A tiny magical Japanese forest seedkeeper mascot for a 3D mobile browser garden puzzle game, kodama-like wooden spirit with moss cloak, small paper lantern, acorn satchel, cedar leaf crown, warm emerald and gold glow, centered readable silhouette, transparent or plain dark forest background, no text, no watermark, sprite-friendly, high contrast at small size.”
   - Aspect ratio: square.
2. Forest shrine terrarium background source
   - Target: portrait-friendly background/skybox texture suitable for an isometric 3D moss board.
   - Archive path: `release/games/008/assets/source/mori-terrarium-source.png`
   - Optimized path: `release/games/008/assets/mori-terrarium.png`
   - Imagegen2 prompt: “A miniature mossy Japanese forest shrine terrarium for a portrait mobile 3D puzzle game, cedar roots, stone lanterns, tiny moss platforms, dewdrops, soft morning mist, open readable center area for a 3D board, emerald green, bark brown, warm lantern gold, crop-safe for phone portrait, no characters, no text, no watermark.”
   - Aspect ratio: portrait.
3. Moss/root garden icon sheet source
   - Target: square icon sheet for UI and board decals.
   - Archive path: `release/games/008/assets/source/mori-icons-source.png`
   - Optimized path: `release/games/008/assets/mori-icons.png`
   - Imagegen2 prompt: “Small readable icon sheet for a mosslight forest shrine puzzle game: glowing dew bead, seedling basin, root bridge, moss tile, fern chapter badge, cedar gate badge, kodama bloom badge, soot mite hazard, drought leaf, Mosslight lantern, cleansing moss, perfect dew chain badge, transparent or plain dark forest background, high contrast, no text, no watermark.”
   - Aspect ratio: square.

If Imagegen2 is unavailable or fails after a real attempt, create a clearly labeled emergency fallback using simple SVG/canvas/Three.js materials, document the failure in `ai/postmortems/day-008.md`, and still keep source/fallback files under the same asset paths.

### Mandatory generated-image QA

For every generated image, include a real inspection step after generation and before integration:

- Analyze the actual generated file visually, not just the prompt text.
- For the seedkeeper mascot, verify transparent/cutout quality or clean background removal, readable silhouette, centered pivot, crop margins, no unwanted text/watermarks, and a stable upright orientation.
- Verify control-to-motion alignment in-game: dew beads must visibly follow the channel direction; tile rotation controls must rotate route arrows in the expected direction; root bridge placement must align with the selected socket.
- For the background, verify the center board area remains readable after portrait mobile crop and does not hide dew beads, tiles, basins, soot mites, or action controls.
- For the icon sheet, verify icons are distinct at final HUD/button size and hazards cannot be confused with dew or bonuses.
- If inspection finds a problem, regenerate or post-process the image and inspect again. Do not ship broken visual assets just because tests pass.

## Prompt page output

The archived `release/games/008/prompt.html` must be a consistent rendered HTML page, not raw Markdown pasted into a `<pre>` block. It should include:

- A clear `<title>` and `<h1>` using `Day 008 Game Generation Prompt`.
- A back-to-game link near the top.
- Semantic rendered sections (`h2`, `h3`, `ul/ol/li`, `p`, `pre/code` only for actual code/commands).
- The same readable prompt-page style pattern across days so prompt pages feel like one system.

## Subagents to dispatch

1. Implementation subagent
   - Build the static 3D game under `apps/day-008-mori-mosslight-seedkeeper/`.
   - Integrate it into immutable release output under `release/games/008/`.
   - Create the public playable route under `release/mori/`.
   - Use static HTML/CSS/JS with Three.js/WebGL and no backend.
   - The public alias must be self-contained or asset paths must be alias-safe.
   - If vendoring `three.module*.js`, also copy the matching `three.core*.js` beside it in the app, release archive, and `/mori/` alias assets.
2. Asset/polish subagent
   - Generate/prepare Imagegen2 assets, archive source files, optimize playable copies, inspect generated images, and tune mobile readability/game feel.
3. QA/browser/mobile subagent
   - Run desktop and mobile smoke checks, verify no console errors, verify menu/tutorial/objective/controls/restart/pause, prompt links, 3D board interaction, tile selection/rotation, root bridge, Mosslight Lantern, dew routing, mites/drought, and 390x844 portrait layout.
4. Reflection/self-improvement subagent
   - Write `ai/postmortems/day-008.md` after validation with what worked, what failed, generated-image inspection notes, code-isolation confirmation, and whether generator/template/rubric improvements are justified.

## Acceptance criteria

- Static build passes.
- Code isolation is documented in QA/postmortem: no previous game implementation code was opened, inspected, copied, diffed, grepped, or adapted.
- Mode choice follows the cadence rule: Day 008 is real 3D spatial gameplay with a perspective/isometric board, height tiers, route channels, rolling/flowing dew beads, basins, hazards, and player manipulation of 3D tile pieces.
- Desktop smoke passes.
- Mobile portrait smoke passes at about 390x844 with readable HUD/tutorial, usable tap/rotate/place controls, no forced landscape canvas, and 44px+ controls.
- Prompt is visible from gallery and release folder.
- `prompts/day-008.md` is copied exactly to `release/games/008/prompt.md`.
- `release/games/008/prompt.html` renders the prompt in browser-readable semantic HTML with the standard prompt-page styling, not a raw Markdown `<pre>` dump.
- Public alias `release/mori/index.html`, `release/mori/prompt.html`, `release/mori/screenshot.png`, and `release/mori/assets/` exist and work.
- Gallery card for Day 008 shows prompt availability, generation duration, public `/mori/` links, and actual generated date.
- Screenshot exists at `release/games/008/screenshot.png` and is non-empty/readable.
- Image/source assets exist under `release/games/008/assets/source/` and optimized assets exist under `release/games/008/assets/`, or a documented emergency fallback exists.
- Every generated image has an inspection note in the postmortem or QA notes; moving/interactive dew/tile/bridge visuals have verified cutout/background handling where relevant, orientation/pivot/crop, readability, and control-to-motion alignment.
- No console errors during desktop or mobile smoke.
- Existing `release/games/001/**`, `release/games/002/**`, `release/games/003/**`, `release/games/004/**`, `release/games/005/**`, `release/games/006/**`, and `release/games/007/**` from origin/main remain unchanged.
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
# Screenshot/static checks: verify release/games/008/screenshot.png, prompt.md, prompt.html, index.html, game.js, styles.css, release/mori/index.html, release/mori/prompt.html, release/mori/screenshot.png, optimized assets, and source assets exist and are non-empty.
# Prompt copy check: cmp prompts/day-008.md release/games/008/prompt.md and cmp prompts/day-008.md release/mori/prompt.md.
# Prompt HTML check: verify release/games/008/prompt.html has semantic h1/h2/list markup and a back-to-game link, not a raw Markdown dump inside <pre>, and no malformed ul > p or ol > p nodes.
# Browser smoke: open the local/static /mori/ route and verify menu, tutorial, gameplay start, tile selection, rotate controls, root bridge, Mosslight path, pause, restart, prompt link, no console errors.
# Mobile smoke: repeat at a portrait phone viewport such as 390x844 and verify playable tap/rotate controls and readable HUD/board.
# Static screenshot check: inspect release/games/008/screenshot.png for non-empty readable game content.
# Image QA: inspect every generated Imagegen2 source/optimized asset and document the actual inspection result in ai/postmortems/day-008.md.
# Docker/static smoke: build the Docker image locally, run it, curl /mori/ and /mori/prompt.html, then stop the container.
# Immutable guard: confirm no release/games folders from origin/main changed except new Day 008.
```
