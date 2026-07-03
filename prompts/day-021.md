# Day 021 Game Generation Prompt

## Game identity

- Day: 021
- Title: Aki Karesansui Ripplekeeper
- Slug: aki-karesansui-ripplekeeper
- Public route word: aki
- Mode: hybrid
- Genre: mobile-first zen-garden routing puzzle / tactile sand-ripple arcade score chase
- Mood/style: late-autumn Japanese dry garden at golden hour, pale raked sand, dark moss islands, warm maple leaves, smooth standing stones, bronze water basin, tiny tanuki gardener charm, ink-brush UI labels, quiet rake-and-stone feedback; layered 2.5D/3D-feeling sand topology and path planning rather than underwater diving, rhythm lanes, shrine tilt mazes, silver webs, pottery sculpting, bamboo water routing, origami folding, rainy sheltering, snow stacking, textile stamping, cooking, windbell tuning, rail running, or vehicle flight.

## Why this game today

The generated series currently ends with:

- Day 018 `3d`: dawn daruma tilt labyrinth with a raised shrine board, inertia, torii gates, ema plaques, bells, ink pools, and offering bowl routing.
- Day 019 `2d`: blue-hour matsuri rhythm-routing with Don/Ka/Hi/Ya taiko pads, lantern gates, carrier routing, call-and-response, and WebAudio timing.
- Day 020 `3d`: underwater pearl cartography with a diver, oxygen, guide shells, currents, air bells, jellyfish, and teal 3D depth navigation.

The latest generated mode is one `3d`, and the latest 2D streak is zero. Day 021 deliberately chooses `hybrid`: the game is not another fully free-flight 3D scene, and not a flat lane/timing or grid game. It should feel like a tactile tabletop dry garden where the player edits layered sand flow fields, places/rotates stones, and watches maple leaves glide through raked ripples. The hybrid label is meaningful: the sand board is viewed in a shallow isometric/orthographic 3D-like space with height/elevation cues, overlapping ripple depth lanes, stone shadows, and path prediction, while remaining mobile-first and touch-friendly.

Recent screenshot/visual variety notes to avoid repeating:

- Day 018 used dawn oranges, a tan raised maze board, torii rails, a small daruma, shrine columns, and bottom tilt controls.
- Day 019 used saturated indigo matsuri festival street, vertical rhythm lanes, fireworks, lantern strings, taiko pad buttons, and fox-mask mascot art.
- Day 020 used teal underwater fog, kelp silhouettes, pearl beacons, oxygen ring, diver mascot, guide-shell controls, and a central depth corridor.

Day 021 should shift to a quiet autumn dry garden: ivory sand, moss-green islands, amber maple leaves, charcoal stone silhouettes, bronze/copper accents, and minimal ink-brush UI. Avoid water/oxygen/underwater assets, drum pads, vertical cue highways, wooden tilt-maze ramps, web circles/anchors, clay vessel profiles, bamboo canal tiles, origami crease sheets, umbrellas/rain, snow blocks, kimono cloth panels, windbell ribbons, rail vehicles, generic match-3 boards, or placeholder beige rectangles.

## Code isolation / no previous game source

The implementation must be written from scratch for this day. Do not open, inspect, copy, diff, grep, or adapt code from previous games, including old `apps/day-*` folders, old `release/games/NNN/` HTML/CSS/JS files, or old public alias folders. You may inspect previous metadata, prompts, postmortems, and screenshots only to avoid repeating concepts and visual identity. The new game's HTML/CSS/JS must come from this prompt and general browser/game knowledge, not from earlier game implementations.

## Mode variety / 3D cadence

Inspection target: `src/data/games.ts` currently ends with Day 018 `3d`, Day 019 `2d`, and Day 020 `3d`. The latest generated-mode streak is one `3d`; latest 2D streak is zero.

Mode decision: Day 021 is `hybrid`. It must implement meaningful layered spatial gameplay, not decorative perspective:

- Use static-browser HTML/CSS/JS with canvas, SVG, or Three.js/WebGL where useful. A Three.js orthographic board is preferred if practical, but a performant canvas is acceptable if it clearly renders layered sand elevation and depth cues.
- Render a dry-garden board with raked sand lanes, raised moss islands, smooth standing stones, maple leaves, moon-view targets, bronze water basin, and a small tanuki gardener guide.
- Gameplay must depend on board state: ripple direction fields, stone placement/rotation, leaf drift, sand ridge height, moss no-rake zones, wind-gust timing, basin target readiness, and path prediction.
- Player actions must manipulate the layered system: rake directional ripple strokes, rotate/place limited stones, tamp sand ridges, release maple leaves, ring the basin bell, and spend a Still Garden focus to freeze gusts and preview the route.
- Portrait mobile is the default supported layout; no landscape gate.

## Design

- Objective: Rake calm sand-ripple paths, place standing stones, and guide glowing autumn maple leaves into moon-view basins while preserving moss islands and completing three karesansui compositions.
- Win condition: Complete three garden commissions — First Rake Circle, Crane Stone Crossing, and Moon Basin Reflection — while reaching 3500 points to trigger “Aki Golden Stillness”. After the stillness ceremony, continue into endless garden commissions.
- Lose condition: Three harmony seals crack, the garden timer expires, too many leaves drift into moss/no-rake zones, sand turbulence reaches 100%, or a required moon-view basin is missed after leaf release.
- Core loop:
  1. Start on a title/menu screen with Day 021 badge, mode badge “hybrid”, public route `/aki/`, best score, best Golden Stillness time, tutorial, prompt link, and a large Start button.
  2. Show a portrait-friendly dry-garden board: raked sand field in shallow isometric depth, moss islands, smooth standing stones, small maple leaves waiting at the gate, bronze basins, goal chips, turbulence meter, and predicted leaf path.
  3. A commission card requests goals, for example: “Guide 3 red leaves to Moon Basin A, place 2 crane stones, keep moss untouched, finish with turbulence under 35%.”
  4. Player selects a rake direction and drags/taps short strokes across sand cells/segments. Each stroke creates visible ripple arrows/ridges that gently steer released leaves.
  5. Player can rotate/place a limited number of stones. Stones bend nearby ripples, block strong gusts, and create calm eddies, but careless placement may trap leaves or raise turbulence.
  6. Leaves are released in small waves. They drift along ripple gradients, bounce softly around stones, avoid moss islands, and score when they pass through matching basins in requested order.
  7. Tamp Sand smooths a noisy patch; Basin Bell briefly attracts the nearest correct leaf; Still Garden focus freezes gusts and shows a clearer path preview, charging only through clean basin deliveries.
  8. Completing a commission lights a moon-view reflection, awards points, restores one harmony seal if needed, and unlocks stronger gusts/deeper ripple interactions.
  9. Pause/restart remain available throughout.
- 15+ minute play-value strategy:
  - Save best score, fastest Aki Golden Stillness time, longest clean leaf chain, highest endless commission, fewest moss touches, most perfect basin deliveries, and collected garden seals in localStorage.
  - Include three authored commissions:
    - First Rake Circle: small board, one red leaf type, one basin, two stones already placed as teaching anchors, broad path preview, no harmony penalty during first guided release.
    - Crane Stone Crossing: adds white/yellow leaves, two basins, player stone rotation, moss no-rake island, first cross-gust, and Tamp Sand tutorial.
    - Moon Basin Reflection: all leaf colors, three basins, standing-stone shadow lanes, stronger gust pulses, stricter moss preservation, and Still Garden route preview mastery.
  - Deterministic Day 021 seed varies moss island shapes, stone starting positions, basin order, gust pulse timing, leaf color order, sand ridge decay, and endless constraints while keeping the opening fair.
  - Mastery badges: finish First Rake Circle without a moss touch, trigger Golden Stillness under 220 seconds, deliver 18 requested leaves in clean order, complete a commission with zero turbulence damage, solve a board using only two new strokes, finish an endless commission with all harmony seals.
  - Strategic scoring rewards planning: rake fewer high-quality strokes, use stones to bend rather than block leaves, preserve smooth central corridors, tamp only noisy choke points, save Basin Bell for late wrong turns, and use Still Garden before release rather than after chaos begins.
  - Endless mode after Golden Stillness adds irregular moss islands, alternating basin orders, stronger gusts, faster ridge decay, fewer stone placements, and more leaf waves without shrinking touch controls.
- Difficulty scaling:
  - 0-45 seconds: broad sand lanes, one basin, visible path preview, gentle leaf speed, pre-placed stones, no penalty during first guided release.
  - 45-125 seconds: two basins, player stone rotation, first moss island, first gust pulse, Tamp Sand introduced.
  - 125-220 seconds: three basin goals, mixed leaf colors, stricter order, stronger gusts, deeper ripple decay, Still Garden preview windows.
  - 220+ seconds/endless: denser moss, shorter previews, fewer spare stones, more gust overlap, same readable controls.
  - Keep mobile fair: leaves, stones, moss islands, basins, ripple arrows, and warning rings must be large and readable at 390x844; primary touch buttons must be 52px+; no tiny survival-critical target.
- Scoring/rewards:
  - Correct leaf delivered to requested basin: +100 points times combo tier.
  - Clean path segment with no moss touch: +45 points.
  - Stone bend that redirects a leaf into a basin: +170 points.
  - Tamp Sand prevents turbulence before release: +80 points.
  - Basin Bell rescue delivery: +210 points and Still Garden charge.
  - Commission complete under turbulence target: +560 points and repair one harmony seal if below max.
  - Perfect no-moss commission: +720 points.
  - Aki Golden Stillness: +1300 points and endless commissions unlock.
  - Moss/no-rake touch: harmony damage, combo reset, turbulence +10%.
  - Wrong basin delivery: turbulence +8%, combo soft-reset.
  - Over-raking one patch: turbulence +5% and local ridge decay.

## Controls and layout

- Desktop:
  - Mouse click/tap/drag: select rake direction, draw short rake strokes, rotate/place stones, press action buttons, start/pause overlay button, prompt link, or explainable HUD chips.
  - Arrow keys or WASD: move the rake cursor / nudge selected stone.
  - 1/2/3/4: choose rake direction (north/east/south/west or curved left/right if implemented).
  - Space or Enter: Release Leaves / confirm selected action / start from menu.
  - Q/E: rotate selected stone or rake direction.
  - T: Tamp Sand.
  - B: Basin Bell when charged.
  - Shift: Still Garden focus when charged.
  - P: pause/resume.
  - R: restart current run.
- Mobile/touch:
  - Use large Rake ↗, Rake ↘, Rake ↙, Rake ↖ or directional stroke buttons plus a clear selected-mode chip.
  - Use large Release Leaves, Rotate Stone, Tamp Sand, Basin Bell, Still Garden, Pause, and Restart buttons.
  - Tapping a stone selects it; tapping rotate turns it through readable orientations. Dragging on sand draws a short ripple stroke only in the selected rake mode.
  - Optional swipe strokes can be supported, but visible buttons are mandatory.
  - No tiny virtual joystick. Interaction is rake strokes, stone rotation/placement, release, tamp, basin bell, focus, pause/restart.
- Mobile layout/orientation:
  - Default target is portrait phone play around 390x844; do not require landscape.
  - Top: compact autumn HUD with score, best, harmony seals, turbulence, commission, combo, elapsed time, and active tool. Use leaf/stone/ink chips, not recent underwater oxygen, matsuri drum, shrine maze, web, pottery, or bamboo chip layouts.
  - Below top: commission card with requested leaf colors, basin order, moss limit, stone/rake budget, and progress ticks.
  - Center: dry-garden board with sand ripples, moss islands, stones, leaves, basins, path preview, gust shadows, and depth/elevation cues. It must remain playable without zooming.
  - Bottom: status helper plus large rake/action controls. Controls must not cover the active leaf path, basins, or moss warnings.
  - Tutorial must fit on the first portrait screen; optional details may be collapsible but objective, rake strokes, stones, moss/no-rake zones, leaf release, basins, Tamp Sand, Basin Bell, Still Garden, pause/restart must be visible.
  - Requests must combine text, symbols, shapes, labels, leaf silhouettes, and line styles so hue alone is not required.

## Menu and tutorial

Implement these states:

1. Title screen
   - Shows title “Aki Karesansui Ripplekeeper”.
   - Shows Day 021 badge, mode badge “hybrid”, public route `/aki/`, best score, best Golden Stillness time if available, and a prompt link.
   - Shows a large Start button and visible tutorial panel by default.
   - Notes: “Audio starts after you press Start; visual path previews work if muted.”
2. Tutorial text
   - Objective: “Rake sand ripples, bend paths with stones, and guide autumn leaves into moon basins.”
   - Raking: choose a direction and draw short strokes; fewer clean strokes keep harmony high.
   - Stones: rotate stones to bend leaves and block gusts; do not trap the route.
   - Moss: do not rake moss islands or let leaves scrape them.
   - Release/Basins: release leaves after previewing the path; deliver colors in requested basin order.
   - Tools: Tamp Sand calms noisy ridges, Basin Bell attracts one leaf, Still Garden freezes gusts and previews the route.
   - Pause/restart: P/R on desktop or visible buttons on mobile.
3. In-game HUD
   - Score, best score, harmony seals, turbulence, commission name, combo, elapsed time, active tool, requested leaf order, basin progress, stone/rake budget, Still Garden charge, latest warning.
   - Pause/restart controls visible or immediately accessible.
4. Status helper
   - Non-blocking helper showing active tool, selected stone/rake, next requested basin, path confidence, moss risk, gust countdown, and expected score effect.
   - Must not cover the garden board or bottom controls on mobile.
5. Pause overlay
   - Resume, restart, tutorial reminder, controls summary, audio/mute toggle, prompt link.
6. Game-over/results overlay
   - Final score, best score, commission reached, Golden Stillness status, clean leaf chain, moss touches, turbulence finish, perfect basin deliveries, mastery badges, restart button.
7. Aki Golden Stillness banner
   - Trigger once per run after all three commissions and 3500 score.
   - Non-blocking ceremony: maple leaves settle into a golden spiral, stones cast long calm shadows, basin water reflects a crescent moon, sand ripples glow softly, tanuki bows; endless garden commissions continue after the banner fades.

## Assets

Prefer Imagegen2 (`openai/gpt-image-2`) for final visual art: tanuki garden keeper mascot, autumn karesansui garden background, leaf/stone/basin/tool icon sheet, and decorative maple/basin pieces. Canvas/SVG/Three.js code may draw interactive sand ripples, path previews, collision zones, strokes, particles, UI chrome, hit volumes, and fallback debug shapes. It should not create final character/background/icon art from scratch unless Imagegen2 is unavailable after a real attempt.

Archive source generated art under `release/games/021/assets/source/` and use optimized playable copies under `release/games/021/assets/`. Also copy optimized playable assets into `apps/day-021-aki-karesansui-ripplekeeper/assets/` and the public alias `release/aki/assets/`.

For mobile-first crop safety: keep important content centered, leave 12-16% safe margins, avoid baked-in text, avoid watermarks, avoid fake UI labels, avoid tiny sand/rake details that disappear at final in-game size, and keep tanuki/leaves/stones/basins/moss/tool silhouettes distinct against pale sand and warm autumn backgrounds.

Generate or provide at least these final art assets:

1. Tanuki garden keeper mascot/source charm
   - Target: transparent PNG if possible, square source, final optimized texture around 512x512 or 256x256.
   - Archive path: `release/games/021/assets/source/aki-tanuki-source.png`
   - Optimized path: `release/games/021/assets/aki-tanuki.png`
   - Imagegen2 prompt: “A charming friendly Japanese tanuki karesansui garden keeper mascot for a mobile hybrid browser puzzle game, small tanuki wearing a simple indigo work apron, holding a bamboo sand rake and one amber maple leaf, gentle smile, subtle gold-hour rim light, centered readable silhouette, transparent or solid pale sand background, no checkerboard background, no text, no watermark, sprite-friendly, high contrast at small size.”
   - Aspect ratio: square.
2. Autumn karesansui dry-garden background source
   - Target: portrait-friendly background suitable behind a layered sand-ripple board with an open readable center.
   - Archive path: `release/games/021/assets/source/aki-garden-source.png`
   - Optimized path: `release/games/021/assets/aki-garden.png`
   - Imagegen2 prompt: “A tranquil Japanese karesansui dry garden at late-autumn golden hour for a portrait mobile puzzle game, pale raked sand, moss islands at the sides, smooth dark standing stones, bronze water basin, low bamboo fence, falling amber maple leaves, warm sunlight and long soft shadows, open readable center area for an interactive sand board, crop-safe for phone portrait, no characters, no text, no watermark.”
   - Aspect ratio: portrait.
3. Maple leaf, stone, basin, rake, moss, and garden-tool icon sheet source
   - Target: square icon sheet for objectives, hazards, tools, rewards, and UI decals.
   - Archive path: `release/games/021/assets/source/aki-icons-source.png`
   - Optimized path: `release/games/021/assets/aki-icons.png`
   - Imagegen2 prompt: “Small readable icon sheet for a Japanese autumn karesansui ripple puzzle game: red maple leaf, gold maple leaf, white ginkgo leaf, smooth standing stone, crane stone, moss island, bronze moon basin, bamboo rake, tamp sand stamp, Basin Bell, Still Garden seal, harmony seal heart, turbulence swirl, Aki Golden Stillness emblem, transparent or solid pale sand background, no checkerboard background, high contrast, no text, no watermark, generous margins so no icons are cut off.”
   - Aspect ratio: square.

If Imagegen2 is unavailable or fails after a real attempt, create a clearly labeled emergency fallback using simple SVG/canvas garden silhouettes, document the failure in `ai/postmortems/day-021.md`, and still keep source/fallback files under the same asset paths.

### Mandatory generated-image QA

For every generated image, include a real inspection step after generation and before integration:

- Analyze the actual generated file visually, not just the prompt text.
- For the tanuki mascot, verify transparent/cutout quality or clean background handling, readable friendly silhouette, centered pivot, crop margins, no unwanted text/watermarks, stable upright orientation, and that the rake pose does not imply an incompatible movement/rotation direction.
- Verify control-to-motion alignment in-game: rake direction buttons must create strokes in the expected screen direction, Rotate Stone must visibly change the selected stone’s bend, Release Leaves must follow the preview, Tamp Sand must reduce local turbulence, Basin Bell must attract the correct nearby leaf, Still Garden must freeze gusts/preview route, moss contacts and wrong basins must affect intended areas.
- For the background, verify the center play area remains readable after portrait mobile crop and does not hide leaves, stones, basins, moss islands, path previews, commission card, helper, or controls.
- For the icon sheet, verify maple leaf colors/types, stone types, moss, basin, rake, tamp, Basin Bell, Still Garden seal, harmony seal, turbulence, and Golden Stillness emblem are distinct at final HUD/button size and cannot be confused. Watch specifically for fake checkerboard transparency; alpha-clean or composite onto pale sand if needed and inspect again.
- If inspection finds a problem, regenerate or post-process the image and inspect again. Do not ship broken visual assets just because tests pass.

## Audio and game feel

Because raking, stone placement, basin bells, and quiet garden stillness are central to the theme, include lightweight WebAudio cues initialized only after a user gesture:

- Soft sand-rake brush when drawing a ripple stroke, with pitch/length based on stroke distance.
- Low stone click when rotating/placing a stone.
- Dry leaf flutter when releasing leaves.
- Bronze basin chime when a leaf enters the correct basin.
- Muted moss scrape / turbulence rustle when a leaf or rake touches a no-rake zone.
- Gentle breath/ping when Still Garden focus activates.
- Short warm koto-like arpeggio when Aki Golden Stillness triggers.

Audio must not block play if WebAudio is unavailable. Verify no autoplay errors: audio context should be created/resumed only after Start or another user interaction. Include a visible mute toggle in pause/results or HUD.

## Prompt page output

The archived `release/games/021/prompt.html` must be a consistent rendered HTML page, not raw Markdown pasted into a `<pre>` block. It should include:

- A clear `<title>` and `<h1>` using `Day 021 Game Generation Prompt`.
- A back-to-game link near the top.
- Semantic rendered sections (`h2`, `h3`, `ul/ol/li`, `p`, `pre/code` only for actual code/commands).
- The same readable prompt-page style pattern across days so prompt pages feel like one system.

## Subagents to dispatch

1. Implementation subagent
   - Build the static hybrid game under `apps/day-021-aki-karesansui-ripplekeeper/`.
   - Integrate it into immutable release output under `release/games/021/`.
   - Create the public playable route under `release/aki/`.
   - Use static HTML/CSS/JS with no backend. Canvas/SVG/Three.js are acceptable; the public alias must be self-contained or asset paths must be alias-safe.
   - If vendoring `three.module*.js`, also copy the matching `three.core*.js` beside it in the app, release archive, and `/aki/` alias assets.
2. Asset/polish subagent
   - Generate/prepare Imagegen2 assets, archive source files, optimize playable copies, inspect generated images, remove fake checkerboards if present, and tune mobile readability/game feel.
3. QA/browser/mobile subagent
   - Run desktop and mobile smoke checks, verify no console errors, verify menu/tutorial/objective/controls/restart/pause, prompt links, garden board rendering, rake strokes, stone selection/rotation, Release Leaves, Tamp Sand, Basin Bell, Still Garden control presence, leaf delivery, moss/no-rake penalty, generated screenshot, generated assets, WebAudio initialization after user gesture, and 390x844 portrait layout.
4. Reflection/self-improvement subagent
   - Write `ai/postmortems/day-021.md` after validation with what worked, what failed, generated-image inspection notes, audio verification, code-isolation confirmation, and whether generator/template/rubric improvements are justified.

## Acceptance criteria

- Static build passes.
- Code isolation is documented in QA/postmortem: no previous game implementation code was opened, inspected, copied, diffed, grepped, or adapted.
- Mode choice follows the cadence rule: Day 021 is meaningful `hybrid` after Day 020 `3d`, with layered sand-ripple routing where rake directions, stone bends, moss zones, gusts, leaf paths, basins, and tool timing matter.
- Desktop smoke passes.
- Mobile portrait smoke passes at about 390x844 with readable HUD/tutorial/commission card, usable 52px+ rake/action/pause/restart controls, no forced landscape canvas, and no tiny survival-critical leaves/basins/moss zones.
- Prompt is visible from gallery and release folder.
- `prompts/day-021.md` is copied exactly to `release/games/021/prompt.md` and `release/aki/prompt.md`.
- `release/games/021/prompt.html` and `release/aki/prompt.html` render the prompt in browser-readable semantic HTML with the standard prompt-page styling, not a raw Markdown `<pre>` dump.
- Public alias `release/aki/index.html`, `release/aki/prompt.html`, `release/aki/screenshot.png`, and `release/aki/assets/` exist and work.
- Gallery card for Day 021 shows prompt availability, generation duration, public `/aki/` links, mode `hybrid`, and actual generated date.
- Screenshot exists at `release/games/021/screenshot.png` and is non-empty/readable. Prefer a readable desktop gameplay screenshot for gallery cards; mobile screenshots are QA evidence unless the design is intentionally portrait-card friendly.
- Image/source assets exist under `release/games/021/assets/source/` and optimized assets exist under `release/games/021/assets/`, or a documented emergency fallback exists.
- Every generated image has an inspection note in the postmortem or QA notes; interactive tanuki/garden/ripple visuals have verified background handling, orientation/pivot/crop, readability, and control-to-motion alignment.
- WebAudio initializes after user gesture and creates no autoplay console errors; audio is failsafe if unsupported and visual path previews remain playable muted.
- No console errors during desktop or mobile smoke. Add data-URI favicons to game and prompt pages if needed to avoid favicon request noise.
- Existing `release/games/001/**` through `release/games/020/**` from origin/main remain unchanged.
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
# Screenshot/static checks: verify release/games/021/screenshot.png, prompt.md, prompt.html, index.html, game.js, styles.css, release/aki/index.html, release/aki/prompt.html, release/aki/screenshot.png, optimized assets, and source assets exist and are non-empty.
# Prompt copy check: cmp prompts/day-021.md release/games/021/prompt.md and cmp prompts/day-021.md release/aki/prompt.md.
# Prompt HTML check: verify release/games/021/prompt.html has semantic h1/h2/list markup and a back-to-game link, not a raw Markdown dump inside <pre>, and no malformed ul > p or ol > p nodes.
# Browser smoke: open the local/static /aki/ route and verify menu, tutorial, gameplay start, garden board render, rake directions, stone select/rotate, Release Leaves, Tamp Sand, Basin Bell, Still Garden control presence, leaf delivery, moss/no-rake feedback, pause, restart, prompt page, WebAudio after user gesture, no console errors.
# Mobile smoke: repeat at a portrait phone viewport such as 390x844 and verify playable tap controls and readable HUD/commission card/garden board.
# Static screenshot check: inspect release/games/021/screenshot.png and release/aki/screenshot.png for non-empty readable game content; use vision to judge actual visual quality.
# Image QA: inspect every Imagegen2 source/optimized asset and document the actual inspection result in ai/postmortems/day-021.md.
# Docker/static smoke: build the Docker image locally, run it, curl /aki/ and /aki/prompt.html, then stop the container.
# Immutable guard: confirm no release/games folders from origin/main changed except new Day 021.
```
