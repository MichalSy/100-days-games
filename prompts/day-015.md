# Day 015 Game Generation Prompt

## Game identity

- Day: 015
- Title: Midori Bamboo Canal Keeper
- Slug: midori-bamboo-canal-keeper
- Public route word: midori
- Mode: 2D
- Genre: mobile-first water-routing puzzle arcade / bamboo irrigation score chase
- Mood/style: lush morning bamboo grove, emerald water channels, carved bamboo gates, mossy stone basins, bright koi-orange reward beads, tiny tanuki canal keeper, sunlit dew, hand-painted garden-map clarity; fresh green watercraft puzzle rather than origami paper folds, rainy procession sheltering, snow stacking, textile stamping, windbell tuning, cooking, or vehicle flight

## Why this game today

The generated series currently ends with:

- Day 012 `3d`: snow-lantern stacking with real 3D blocks, balance, warmth, and gust shielding.
- Day 013 `hybrid`: rainy shrine-market procession with parasol shelter zones, layered lanes, puddles, gutters, and Thunder Drum timing.
- Day 014 `hybrid`: origami fold-layer route planning with mountain/valley folds, crane launch paths, ink seals, tear stress, and reinforcement.

The latest generated-mode streak is two `hybrid` games, and the latest generated 2D streak is zero. Day 015 deliberately returns to a crisp mobile-first `2D` game, not because the generator defaults to flat games, but because a high-quality tactile 2D water-routing puzzle is a strong contrast after two dense spatial hybrids. It should feel like a readable living garden mechanism: bamboo canals, flowing droplets, rotating splitters, basin requests, sun/evaporation pressure, and combo irrigation planning.

Recent screenshot and visual variety notes to avoid repeating:

- Day 012 used dark winter blues, a central 3D snow pedestal/stack, block queue cards, and dense 3D action controls.
- Day 013 used teal/amber rainy shrine-market paths, parasol shelter rings, lane labels, puddles, and gutter edges.
- Day 014 used dark green origami studio lighting, a large pale paper sheet, dashed crease lines, seal marks, and fold action buttons.

Day 015 should shift to bright, verdant, flowing garden clarity: top-down bamboo canal tiles on moss, animated water beads, rotating bamboo elbows and splitters, target seedling basins, sun-dry cracks, a tiny tanuki keeper mascot, koi-orange combo beads, and a compact gardener notebook HUD. Avoid paper fold sheets, umbrellas/rain curtains, snow/candle blocks, kimono grids, wind ribbons, puppet rails, rail runners, and generic square match-3 boards.

## Code isolation / no previous game source

The implementation must be written from scratch for this day. Do not open, inspect, copy, diff, grep, or adapt code from previous games, including old `apps/day-*` folders, old `release/games/NNN/` HTML/CSS/JS files, or old public alias folders. You may inspect previous metadata, prompts, postmortems, and screenshots only to avoid repeating concepts and visual identity. The new game's HTML/CSS/JS must come from this prompt and general browser/game knowledge, not from earlier game implementations.

## Mode variety / 3D cadence

Inspection target: `src/data/games.ts` currently ends with Day 012 `3d`, Day 013 `hybrid`, and Day 014 `hybrid`. The latest generated-mode streak is two `hybrid`; latest 2D streak is zero.

Mode decision: Day 015 is `2D`, and this is allowed by the cadence because there is no current 2D streak. It must still be a polished, mechanics-rich 2D game rather than a placeholder:

- Use responsive static-browser HTML/CSS/JS with a canvas or DOM/canvas hybrid.
- Gameplay must depend on readable water-routing state: channel direction, splitter orientation, basin request color/amount, evaporation, overflow, and timed drought pressure.
- The board must animate water flow clearly enough that players can predict and adjust routes before committing.
- Portrait mobile is the default supported layout; no landscape gate.
- The next day is not forced by this prompt, because Day 015 begins a new 2D streak of one; future cadence should still avoid more than three consecutive 2D games.

## Design

- Objective: Rotate and lock bamboo canal pieces to guide morning water beads from a spring source into thirsty moss basins and seedling bowls before the sun dries them out.
- Win condition: Complete three garden chapters — Dew Gate, Frog Basin, and Sunlit Grove — while reaching 2900 points to trigger “Midori Full-Grove Bloom”. After Full-Grove Bloom, continue into endless irrigation commissions.
- Lose condition: Drought reaches 100%, three seedling hearts wilt, the spring overflows from too many blocked routes, or the timer expires during a commission.
- Core loop:
  1. Start on a title/menu screen with Day 015 badge, mode badge “2D”, public route `/midori/`, best score, best Full-Grove time, tutorial, prompt link, and a large Start button.
  2. Show a portrait-friendly bamboo grove playfield with a spring source, rotating bamboo canal pieces, splitters, one-way reeds, moss basins, seedling bowls, sun cracks, and a small tanuki keeper near the active request.
  3. A garden commission card requests flow goals, for example: “Water 3 blue basins, feed 1 lotus bowl, keep overflow below 30%, collect 4 koi beads.”
  4. Player taps canal pieces to rotate them clockwise; long-press or a button locks a piece for the next water pulse; optional drag may paint a preferred route, but tap-rotate must be reliable.
  5. Water beads pulse from the spring along connected bamboo. Beads brighten valid routes, slow at splitters, evaporate on sun-cracked tiles, and fill matching basins.
  6. Some basins request blue clear water, green moss water, or gold koi water. Color is communicated by label/icon as well as hue.
  7. The tanuki’s “Moss Patch” action can repair one sun-cracked tile or slow evaporation, but it charges only through clean basin deliveries.
  8. Completing a commission blooms moss flowers, awards points, restores a seedling heart if needed, and unlocks the next chapter.
  9. Pause/restart remain available throughout.
- 15+ minute play-value strategy:
  - Save best score, fastest Midori Full-Grove Bloom time, longest clean-flow streak, highest endless commission, most koi beads in one pulse, and collected gardener badges in localStorage.
  - Include three authored chapters:
    - Dew Gate: small board, two straight canals, two elbows, one basin, teaches rotate/preview/pulse and no instant drought.
    - Frog Basin: adds splitter pieces, lotus bowl, first sun-cracked tile, first overflow risk, and Moss Patch.
    - Sunlit Grove: denser channel network, two colors of basin request, moving sunbeam evaporation lane, koi bead bonus route, stricter overflow and drought timer.
  - Deterministic Day 015 seed varies canal piece order, basin positions, request sequence, koi bead locations, sunbeam timing, cracked tiles, and endless constraints while keeping the opening fair.
  - Mastery badges: finish Dew Gate with zero overflow, trigger Full-Grove Bloom under 185 seconds, fill 20 basins, collect 15 koi beads, complete a commission without Moss Patch, survive an endless commission with all seedling hearts.
  - Strategic scoring rewards planning: preview the next pulse, rotate splitters before water arrives, lock critical elbows, deliberately send a small overflow to reach koi beads when safe, save Moss Patch for sun cracks, and build clean-flow combo chains.
  - Endless mode after Full-Grove Bloom adds more splitters, alternating water colors, shorter sunbeam warnings, stricter drought caps, and higher combo multipliers without shrinking touch controls.
- Difficulty scaling:
  - 0-45 seconds: broad board, slow pulse, large canal pieces, single basin color, no drought spike during first guided pulse.
  - 45-115 seconds: splitters, koi bead route, first sun crack, overflow meter, Moss Patch timing.
  - 115-185 seconds: multiple basin types, moving sunbeam, color/change request, stricter drought and overflow.
  - 185+ seconds/endless: denser channel network, faster pulses, more cracked tiles, multi-basin orders, same readable controls.
  - Keep mobile fair: canal pieces must be large enough to tap, route preview thick and high contrast, commission text short, 56px+ primary controls, no tiny hazard required for survival.
- Scoring/rewards:
  - Correct basin filled: +110 points times combo tier.
  - Water bead passes through a planned locked route: +25 points.
  - Koi bead collected during a pulse: +90 points.
  - Splitter sends water to two useful targets: +180 points.
  - Commission complete under drought target: +420 points and restore one seedling heart.
  - Perfect clean-flow commission with no overflow: +520 points.
  - Midori Full-Grove Bloom: +960 points and endless commissions unlock.
  - Water hits a dead end: overflow +6%, combo reset.
  - Water crosses sun-crack without patch: evaporation loss and drought +4%.
  - Wrong basin color/label filled: small overflow, combo reset, and request progress does not advance.

## Controls and layout

- Desktop:
  - Mouse click/tap: select and rotate a canal tile, action button, start/pause overlay button, or prompt link.
  - Shift-click or L: lock/unlock selected tile for next pulse.
  - Arrow keys or WASD: move tile focus.
  - Space or Enter: release/advance water pulse; also start from menu.
  - M: use Moss Patch when charged.
  - P: pause/resume.
  - R: restart current run.
- Mobile/touch:
  - Tap a large canal tile to rotate it clockwise.
  - Use large Lock, Pulse Water, Moss Patch, Pause, and Restart buttons.
  - Optional long-press locks a tile, but visible Lock button is mandatory.
  - Tap basin/request chips for short explanations.
  - No virtual joystick. Interaction is tap-rotate, lock, pulse, patch, pause/restart.
- Mobile layout/orientation:
  - Default target is portrait phone play around 390x844; do not require landscape.
  - Top: compact gardener notebook HUD with score, best, seedling hearts, drought, overflow, chapter, combo, and time.
  - Below top: commission card with requested basins, color/icon labels, koi bead count, drought/overflow targets, and progress ticks.
  - Center: bamboo canal board with source, pieces, route preview, animated water beads, basins, sun cracks, koi beads, and tanuki keeper. It must remain playable without zooming.
  - Bottom: selected-tile helper plus large Lock, Pulse Water, Moss Patch, Pause, and Restart controls. Controls must not cover the active board.
  - Tutorial must fit on the first portrait screen; optional details may be collapsible but objective, rotate canals, lock route, pulse water, overflow/drought, Moss Patch, pause/restart must be visible.
  - Requests must combine text, icons, flow patterns, and labels so hue alone is not required.

## Menu and tutorial

Implement these states:

1. Title screen
   - Shows title “Midori Bamboo Canal Keeper”.
   - Shows Day 015 badge, mode badge “2D”, public route `/midori/`, best score, best Full-Grove time if available, and a prompt link.
   - Shows a large Start button and visible tutorial panel by default.
2. Tutorial text
   - Objective: “Rotate bamboo canals, pulse spring water, and fill every requested basin before drought wins.”
   - Canal pieces: tap a bamboo tile to rotate its openings.
   - Preview/lock: pale-blue arrows show likely flow; lock key pieces before pulsing water.
   - Basins: match the requested basin icon/label and avoid wrong-color fills.
   - Drought/overflow: dead ends raise overflow; sun cracks evaporate water and raise drought.
   - Moss Patch: spend tanuki charge to repair one cracked tile or slow evaporation.
   - Pause/restart: P/R on desktop or visible buttons on mobile.
3. In-game HUD
   - Score, best score, seedling hearts, drought, overflow, chapter name, combo, elapsed time, current commission, selected canal tile, Moss Patch charge, Pulse readiness.
   - Pause/restart controls visible or immediately accessible.
4. Selected-tile helper
   - Non-blocking helper showing selected tile row/column, current piece type, openings, lock state, expected flow effect, and stress/overflow risk.
   - Must not cover active canal pieces or bottom controls on mobile.
5. Pause overlay
   - Resume, restart, tutorial reminder, controls summary, prompt link.
6. Game-over/results overlay
   - Final score, best score, chapter reached, Full-Grove Bloom status, clean-flow streak, koi beads collected, mastery badges, restart button.
7. Midori Full-Grove Bloom banner
   - Trigger once per run after all three chapters and 2900 score.
   - Non-blocking grove-bloom animation: moss flowers open around basins, tanuki bows, koi-orange beads spiral from the spring, morning sun softens; endless irrigation commissions continue after the banner fades.

## Assets

Prefer Imagegen2 (`openai/gpt-image-2`) for final visual art: tanuki canal keeper mascot, bamboo grove/canal background, canal/basin/icon sheet, and decorative garden pieces. Canvas/SVG/DOM code may draw interactive canal hitboxes, water route previews, animated beads, basin fill levels, sunbeam overlays, crack warnings, labels, particles, and UI chrome. It should not create final character/background/icon art from scratch unless Imagegen2 is unavailable after a real attempt.

Archive source generated art under `release/games/015/assets/source/` and use optimized playable copies under `release/games/015/assets/`. Also copy optimized playable assets into `apps/day-015-midori-bamboo-canal-keeper/assets/` and the public alias `release/midori/assets/`.

For mobile-first crop safety: keep important content centered, leave 12-16% safe margins, avoid baked-in text, avoid watermarks, avoid fake UI labels, avoid tiny canal details that disappear at final in-game size, and keep tanuki/canal/basin silhouettes distinct against green moss and bamboo backgrounds.

Generate or provide at least these final art assets:

1. Tanuki bamboo canal keeper mascot/source charm
   - Target: transparent PNG if possible, square source, final optimized texture around 512x512 or 256x256.
   - Archive path: `release/games/015/assets/source/midori-keeper-source.png`
   - Optimized path: `release/games/015/assets/midori-keeper.png`
   - Imagegen2 prompt: “A charming Japanese tanuki bamboo canal keeper mascot for a mobile 2D browser puzzle arcade game, small friendly tanuki gardener wearing moss-green happi coat and straw hat, holding a carved bamboo water scoop and a tiny seedling, koi-orange bead charm, centered readable silhouette, transparent or plain pale green background, no text, no watermark, sprite-friendly, high contrast at small size.”
   - Aspect ratio: square.
2. Bamboo grove canal board background source
   - Target: portrait-friendly background suitable behind a top-down bamboo water-routing playfield with open readable center.
   - Archive path: `release/games/015/assets/source/midori-grove-source.png`
   - Optimized path: `release/games/015/assets/midori-grove.png`
   - Imagegen2 prompt: “A lush Japanese morning bamboo grove for a portrait mobile water-routing puzzle game, moss floor, carved bamboo canals, stone water basins, dew, soft sunlight through bamboo leaves, tiny garden tools on the sides, open readable center area for an interactive canal board, crop-safe for phone portrait, no characters, no text, no watermark.”
   - Aspect ratio: portrait.
3. Bamboo canal, basin, water, and UI icon sheet source
   - Target: square icon sheet for canal pieces, basins, hazards, rewards, and UI decals.
   - Archive path: `release/games/015/assets/source/midori-icons-source.png`
   - Optimized path: `release/games/015/assets/midori-icons.png`
   - Imagegen2 prompt: “Small readable icon sheet for a Japanese bamboo water canal puzzle game: straight bamboo canal, elbow canal, T splitter, cross splitter, spring source, moss basin, lotus bowl, blue water bead, green moss water bead, koi-orange reward bead, sun-crack hazard, tanuki moss patch, seedling heart, Full-Grove Bloom seal, transparent or plain pale moss background, high contrast, no text, no watermark, generous margins so no icons are cut off.”
   - Aspect ratio: square.

If Imagegen2 is unavailable or fails after a real attempt, create a clearly labeled emergency fallback using simple SVG/canvas bamboo canal silhouettes, document the failure in `ai/postmortems/day-015.md`, and still keep source/fallback files under the same asset paths.

### Mandatory generated-image QA

For every generated image, include a real inspection step after generation and before integration:

- Analyze the actual generated file visually, not just the prompt text.
- For the tanuki keeper mascot, verify transparent/cutout quality or clean background handling, readable silhouette, centered pivot, crop margins, no unwanted text/watermarks, stable upright orientation, and that the water scoop pose does not imply wrong gameplay direction.
- Verify control-to-motion alignment in-game: tapping a canal tile rotates the intended tile, Lock marks the intended tile, Pulse Water follows the preview route, Moss Patch affects the intended cracked tile, overflow/drought feedback aligns with actual route failures, and basin fill feedback matches requests.
- For the background, verify the center play area remains readable after portrait mobile crop and does not hide canal pieces, water beads, basins, sun cracks, commission card, or controls.
- For the icon sheet, verify straight/elbow/T/cross canals, spring source, moss basin, lotus bowl, water beads, koi bead, sun crack, Moss Patch, seedling heart, and Full-Grove Bloom seal are distinct at final HUD/button size and cannot be confused.
- If inspection finds a problem, regenerate or post-process the image and inspect again. Do not ship broken visual assets just because tests pass.

## Prompt page output

The archived `release/games/015/prompt.html` must be a consistent rendered HTML page, not raw Markdown pasted into a `<pre>` block. It should include:

- A clear `<title>` and `<h1>` using `Day 015 Game Generation Prompt`.
- A back-to-game link near the top.
- Semantic rendered sections (`h2`, `h3`, `ul/ol/li`, `p`, `pre/code` only for actual code/commands).
- The same readable prompt-page style pattern across days so prompt pages feel like one system.

## Subagents to dispatch

1. Implementation subagent
   - Build the static 2D game under `apps/day-015-midori-bamboo-canal-keeper/`.
   - Integrate it into immutable release output under `release/games/015/`.
   - Create the public playable route under `release/midori/`.
   - Use static HTML/CSS/JS with no backend.
   - The public alias must be self-contained or asset paths must be alias-safe.
2. Asset/polish subagent
   - Generate/prepare Imagegen2 assets, archive source files, optimize playable copies, inspect generated images, and tune mobile readability/game feel.
3. QA/browser/mobile subagent
   - Run desktop and mobile smoke checks, verify no console errors, verify menu/tutorial/objective/controls/restart/pause, prompt links, canal board rendering, tile rotation, lock/unlock, Pulse Water, route preview, Moss Patch control presence, basin fill/drought/overflow feedback, generated screenshot, generated assets, and 390x844 portrait layout.
4. Reflection/self-improvement subagent
   - Write `ai/postmortems/day-015.md` after validation with what worked, what failed, generated-image inspection notes, code-isolation confirmation, and whether generator/template/rubric improvements are justified.

## Acceptance criteria

- Static build passes.
- Code isolation is documented in QA/postmortem: no previous game implementation code was opened, inspected, copied, diffed, grepped, or adapted.
- Mode choice follows the cadence rule: Day 015 is allowed as `2d` after Day 013/014 `hybrid`; it must be a polished water-routing puzzle with actual flow state, not a placeholder grid.
- Desktop smoke passes.
- Mobile portrait smoke passes at about 390x844 with readable HUD/tutorial/commission card, usable tap-rotate/lock/pulse/patch controls, no forced landscape canvas, and 44px+ controls.
- Prompt is visible from gallery and release folder.
- `prompts/day-015.md` is copied exactly to `release/games/015/prompt.md` and `release/midori/prompt.md`.
- `release/games/015/prompt.html` and `release/midori/prompt.html` render the prompt in browser-readable semantic HTML with the standard prompt-page styling, not a raw Markdown `<pre>` dump.
- Public alias `release/midori/index.html`, `release/midori/prompt.html`, `release/midori/screenshot.png`, and `release/midori/assets/` exist and work.
- Gallery card for Day 015 shows prompt availability, generation duration, public `/midori/` links, mode `2d`, and actual generated date.
- Screenshot exists at `release/games/015/screenshot.png` and is non-empty/readable. Prefer a readable desktop gameplay screenshot for gallery cards; mobile screenshots are QA evidence unless the design is intentionally portrait-card friendly.
- Image/source assets exist under `release/games/015/assets/source/` and optimized assets exist under `release/games/015/assets/`, or a documented emergency fallback exists.
- Every generated image has an inspection note in the postmortem or QA notes; interactive canal/water visuals have verified background handling, orientation/pivot/crop, readability, and control-to-motion alignment.
- If the game uses audio cues, initialize WebAudio only after user gesture and verify no autoplay errors. Audio is optional because this is not a rhythm/sound-themed day.
- No console errors during desktop or mobile smoke. Add data-URI favicons to game and prompt pages if needed to avoid favicon request noise.
- Existing `release/games/001/**` through `release/games/014/**` from origin/main remain unchanged.
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
# Screenshot/static checks: verify release/games/015/screenshot.png, prompt.md, prompt.html, index.html, game.js, styles.css, release/midori/index.html, release/midori/prompt.html, release/midori/screenshot.png, optimized assets, and source assets exist and are non-empty.
# Prompt copy check: cmp prompts/day-015.md release/games/015/prompt.md and cmp prompts/day-015.md release/midori/prompt.md.
# Prompt HTML check: verify release/games/015/prompt.html has semantic h1/h2/list markup and a back-to-game link, not a raw Markdown dump inside <pre>, and no malformed ul > p or ol > p nodes.
# Browser smoke: open the local/static /midori/ route and verify menu, tutorial, gameplay start, canal board rendering, tile rotation, lock/unlock, Pulse Water, route preview, Moss Patch control presence, pause, restart, prompt page, no console errors.
# Mobile smoke: repeat at a portrait phone viewport such as 390x844 and verify playable tap controls and readable HUD/commission/board.
# Static screenshot check: inspect release/games/015/screenshot.png and release/midori/screenshot.png for non-empty readable game content; use vision to judge actual visual quality.
# Image QA: inspect every Imagegen2 source/optimized asset and document the actual inspection result in ai/postmortems/day-015.md.
# Docker/static smoke: build the Docker image locally, run it, curl /midori/ and /midori/prompt.html, then stop the container.
# Immutable guard: confirm no release/games folders from origin/main changed except new Day 015.
```
