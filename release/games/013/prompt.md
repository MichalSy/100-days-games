# Day 013 Game Generation Prompt

## Game identity

- Day: 013
- Title: Ame Parasol Puddle Conductor
- Slug: ame-parasol-puddle-conductor
- Public route word: ame
- Mode: hybrid
- Genre: mobile-first rain-procession timing / isometric shelter-management arcade score chase
- Mood/style: rainy Japanese shrine market at early evening, lacquer-red bridge rails, glossy stone paths, paper wagasa parasols, lantern reflections in puddles, soft teal rain haze, plum-violet storm clouds, warm amber vendor light; cozy tactical rain choreography rather than stacking, routing, textile stamping, windbell tuning, cooking, or vehicle movement

## Why this game today

The generated series currently ends with:

- Day 009 `hybrid`: shadow-puppet depth lanes, pose matching, and beat cue timing.
- Day 010 `3d`: windbell tuning/routing with hanging 3D bells and gust ribbons.
- Day 011 `2d`: kimono textile motif stamping, symmetry, and moth pressure.
- Day 012 `3d`: snow-lantern stacking with 3D blocks, balance, warmth, and gust shielding.

The latest generated-mode streak is one `3d`, and the latest 2D streak is zero. Day 013 deliberately chooses `hybrid`: not a full 3D object-manipulation game immediately after Day 012, but more spatial than a flat board. It should use layered/isometric depth, crossing footpaths, rain curtains, puddle reflection gates, and depth-aware guest movement so positioning matters in near/mid/far lanes. The new verb set is: place and tilt paper parasols over walking guests, conduct a rainy procession across layered shrine paths, bounce rain streaks into gutters, open reflection stepping-stones at puddles, manage guest dryness/joy, and time Thunder Drum pauses.

Recent screenshot and visual variety notes to avoid repeating:

- Day 010 used teal/gold blue-hour eaves, hanging windbells, wind ribbons, and bottom rotation/tuning controls.
- Day 011 used a pale textile table, kimono-shaped grid, motif stamp tray, rose/ivory palette, and flat cloth cells.
- Day 012 used dark winter shrine blues, a central 3D snow pedestal/stack, block queue, shift/drop controls, and snow/torii geometry.

Day 013 should visually shift to rain-slick motion and crowd protection: a diagonal/isometric stone path network under rain, moving guests with colorful parasols, circular shelter zones, puddle reflections that briefly become stepping-stones, gutter channels along the edges, lantern glow reflected on the floor, and a gentle festival-market ambience. Avoid block stacking, 3D construction, kimono grids, stamp trays, hanging bells, wind ribbons, snow palettes, puppet rails, and repeated six-box HUD layouts.

## Code isolation / no previous game source

The implementation must be written from scratch for this day. Do not open, inspect, copy, diff, grep, or adapt code from previous games, including old `apps/day-*` folders, old `release/games/NNN/` HTML/CSS/JS files, or old public alias folders. You may inspect previous metadata, prompts, postmortems, and screenshots only to avoid repeating concepts and visual identity. The new game's HTML/CSS/JS must come from this prompt and general browser/game knowledge, not from earlier game implementations.

## Mode variety / 3D cadence

Inspection target: `src/data/games.ts` currently ends with Day 010 `3d`, Day 011 `2d`, and Day 012 `3d`. The latest generated mode streak is one `3d`; latest 2D streak is zero.

Mode decision: Day 013 is `hybrid`. It must be meaningful spatial hybrid gameplay, not decorative perspective:

- Use a responsive 2D canvas/DOM-canvas hybrid with an isometric or pseudo-depth playfield.
- Render at least three depth lanes/paths where objects can visually pass in front of/behind each other.
- Gameplay must depend on lane/depth/overlap: parasol shelter circles cover guests only when they are in the correct lane and radius; puddle stepping-stones open on timed reflections; rain curtains sweep across specific path bands.
- Player actions manipulate spatial shelter and timing: select/move parasols, rotate/tilt them to change shelter shape, trigger Thunder Drum pause, and route rain into gutters.
- Portrait mobile is the default supported layout; no landscape gate.

## Design

- Objective: Guide festival guests through a rainy shrine-market procession by placing and tilting paper parasols, keeping guests dry and cheerful, opening puddle reflection stepping-stones, and channeling heavy rain into gutters before the storm overwhelms the route.
- Win condition: Complete three procession chapters — Market Drizzle, Red Bridge Crossing, and Lantern Downpour — while reaching 2700 points to trigger “Ame Moonlit Procession”. After Moonlit Procession, continue into endless rainy-night commissions.
- Lose condition: Guest dryness reaches zero, three guest joy charms break, the storm bowl fills from missed rain channels, or too many guests are stranded by closed puddle reflections.
- Core loop:
  1. Start on a title/menu screen with Day 013 badge, mode badge “hybrid”, public route `/ame/`, best score, best Moonlit Procession time, tutorial, prompt link, and a large Start button.
  2. Show a portrait-friendly isometric shrine path with near/mid/far walking lanes, lantern booths at the edges, puddle pools, and gutter channels.
  3. A procession card requests guest groups, for example: “Escort 6 guests, keep dryness above 70%, open 3 reflection stones, collect 4 lantern stamps.”
  4. Guests enter from the top-left or side gate and walk along visible paths toward the shrine exit. Each guest has a small dryness/joy indicator and a preferred parasol color/shape.
  5. Player taps/drag-selects one of several wagasa parasols, moves it to a lane, and uses Tilt Left / Tilt Right / Wide / Narrow controls to reshape its shelter zone. Shelter zones protect guests only when lane and radius match.
  6. Rain curtains sweep through lanes in timed waves. Correctly tilted parasols deflect rain streaks into gutter channels for score and storm relief.
  7. Puddle reflections pulse open for short windows. Tapping a puddle or placing a parasol reflection on it creates stepping-stones that let guests cross without losing joy.
  8. Thunder Drum charges from clean deflections and lantern stamps. Triggering it pauses rain curtains, reopens all reflection stones briefly, and highlights the safest path.
  9. Pause/restart remain available throughout.
- 15+ minute play-value strategy:
  - Save best score, fastest Ame Moonlit Procession time, longest dry guest streak, highest endless procession, and collected umbrella stamp badges in localStorage.
  - Include three authored chapters:
    - Market Drizzle: two parasols, one gentle rain curtain, one puddle, broad shelter zones, teaches drag/tap placement and tilt.
    - Red Bridge Crossing: three parasols, near/mid/far paths, narrow bridge chokepoint, two puddles, first joy charm risk, first color preference bonus.
    - Lantern Downpour: four parasols, alternating rain curtains, gutter routing bonuses, fast reflection windows, multiple guest groups, Thunder Drum timing pressure.
  - Deterministic Day 013 seed varies guest order, rain curtain timing, puddle pulse schedule, lantern stamp positions, preferred parasol colors, and endless path requests while keeping the opening fair.
  - Mastery badges: finish Market Drizzle with all guests dry, open 10 reflection stones, trigger Moonlit Procession under 185 seconds, deflect 30 rain streaks into gutters, complete Lantern Downpour without a broken joy charm, finish an endless chapter with 90%+ dryness.
  - Strategic scoring rewards anticipation: place parasols ahead of guest paths, angle them before heavy rain arrives, decide when a puddle is worth opening, save Thunder Drum for bridge/downpour overlap, and keep one parasol near the exit for late stragglers.
  - Endless mode after Moonlit Procession adds denser guests, shorter reflection windows, trickier lane splits, stronger storm bowl pressure, and higher combo multipliers without shrinking touch controls.
- Difficulty scaling:
  - 0-45 seconds: two parasols, slow guests, broad shelters, a single puddle, no instant joy penalties.
  - 45-115 seconds: three parasols, color preference bonuses, bridge chokepoint, two rain lanes, first gutter-routing score objective.
  - 115-185 seconds: four parasols, alternating rain curtains, short reflection pulses, multi-group path splits, storm bowl pressure.
  - 185+ seconds/endless: faster rain pulses, overlapping guest groups, moving lantern stamp bonuses, tighter shelter requirements, same readable controls.
  - Keep mobile fair: guest icons and parasol handles must be large, shelter rings thick, path lanes readable, request text short, 56px+ main controls, no tiny hazards required for survival.
- Scoring/rewards:
  - Guest protected during a rain tick: +28 points times combo tier.
  - Rain deflected into gutter: +45 points and +4% Thunder charge.
  - Reflection stepping-stone opened with a guest crossing: +90 points.
  - Lantern stamp collected by dry guest: +120 points.
  - Full group escorted with dryness above target: +320 points and restore one joy charm.
  - Chapter complete: +460 points.
  - Ame Moonlit Procession: +900 points and endless rainy-night commissions unlock.
  - Guest soaked by heavy rain: dryness loss, combo reset, storm bowl +4%.
  - Guest stranded at closed puddle: joy charm damage and storm bowl +6%.
  - Mis-tilted parasol causing rain splashback: small dryness loss and combo reset.

## Controls and layout

- Desktop:
  - Mouse click/tap: select parasol, puddle, action button, start/pause overlay button, or prompt link.
  - Mouse drag: move selected parasol along the isometric path/lane; drag handles should snap to legal shelter anchors.
  - A/D or Arrow Left/Right: move selected parasol to previous/next lane anchor.
  - W/S or Arrow Up/Down: nudge selected parasol up/down the current path.
  - Q/E: tilt selected parasol left/right.
  - Z/X: widen/narrow shelter shape.
  - Space or Enter: trigger Thunder Drum when charged; also start from menu.
  - P: pause/resume.
  - R: restart current run.
- Mobile/touch:
  - Tap a large parasol body/handle to select it; selected parasol gets a bright ring and helper card.
  - Drag selected parasol to a legal path anchor or tap anchor dots to move it.
  - Use large Tilt Left, Tilt Right, Wide/Narrow, Thunder Drum, Pause, and Restart buttons.
  - Tap puddles during reflection pulses to open stepping-stones.
  - No virtual joystick. Interaction is tap-select, drag/tap-place, tilt/width controls, puddle taps, and Thunder Drum.
- Mobile layout/orientation:
  - Default target is portrait phone play around 390x844; do not require landscape.
  - Top: compact rain-ribbon HUD with score, best, dryness, joy charms, storm bowl, chapter, combo, and time. Avoid the Day 012 dark equal stat boxes; use flowing rain tabs or lantern-paper strips.
  - Below top: procession card with group goal, dryness target, reflection/gutter requirements, and progress ticks.
  - Center: isometric shrine path playfield with guests, parasols, shelter rings, rain curtains, gutters, puddles, and lantern stamps. It must remain readable without zooming.
  - Bottom: parasol selector/status plus large Tilt/Wide/Thunder/Pause/Restart controls. Controls must not cover active guests or puddle crossings.
  - Tutorial must fit on the first portrait screen; optional details may be collapsible but objective, parasol placement, tilt/wide controls, rain curtains, puddle reflections, gutters, Thunder Drum, pause/restart must be visible.
  - Requests must combine text, icons, pattern chips, and labels so hue alone is not required.

## Menu and tutorial

Implement these states:

1. Title screen
   - Shows title “Ame Parasol Puddle Conductor”.
   - Shows Day 013 badge, mode badge “hybrid”, public route `/ame/`, best score, best Moonlit Procession time if available, and a prompt link.
   - Shows a large Start button and visible tutorial panel by default.
2. Tutorial text
   - Objective: “Move and tilt paper parasols to keep shrine guests dry through the rainy procession.”
   - Parasol selection: tap a parasol, then drag it or tap anchor dots to place shelter over guests.
   - Tilt/width: adjust the shelter shape so rain deflects into gutters and covers the correct lane.
   - Puddles: tap glowing reflections to open stepping-stones before guests arrive.
   - Rain/storm: heavy rain raises the storm bowl if it is not sheltered or deflected.
   - Thunder Drum: pauses rain, opens reflections, and highlights safe path when charged.
   - Pause/restart: P/R on desktop or visible buttons on mobile.
3. In-game HUD
   - Score, best score, group dryness, joy charms, storm bowl, chapter name, combo, elapsed time, current request, selected parasol, Thunder charge.
   - Pause/restart controls visible or immediately accessible.
4. Selected-parasol helper
   - Non-blocking helper near selected parasol showing lane, tilt, width, current protected guest count, and likely gutter deflection.
   - Must not cover guests, puddles, or bottom controls on mobile.
5. Pause overlay
   - Resume, restart, tutorial reminder, controls summary, prompt link.
6. Game-over/results overlay
   - Final score, best score, chapter reached, Moonlit Procession status, dry guest streak, mastery badges, restart button.
7. Ame Moonlit Procession banner
   - Trigger once per run after all three chapters and 2700 score.
   - Non-blocking lantern reflection bloom, rain slows to glitter, guests bow under opened parasols, shrine bell silhouette; endless rainy-night commissions continue after the banner fades.

## Assets

Prefer Imagegen2 (`openai/gpt-image-2`) for final visual art: rain procession guide mascot, rainy shrine-market background, parasol/guest/icon sheet, and key decorative pieces. Canvas/SVG/DOM code may draw the interactive shelter rings, path anchors, rain streaks, gutters, puddle pulses, hit zones, helper labels, particles, and UI chrome. It should not create final character/background/icon art from scratch unless Imagegen2 is unavailable after a real attempt.

Archive source generated art under `release/games/013/assets/source/` and use optimized playable copies under `release/games/013/assets/`. Also copy optimized playable assets into `apps/day-013-ame-parasol-puddle-conductor/assets/` and the public alias `release/ame/assets/`.

For mobile-first crop safety: keep important content centered, leave 12-16% safe margins, avoid baked-in text, avoid watermarks, avoid fake UI labels, avoid tiny rain details that disappear at final in-game size, and keep parasol/guest silhouettes distinct against both teal rain and warm lantern backgrounds.

Generate or provide at least these final art assets:

1. Rain procession guide mascot/source charm
   - Target: transparent PNG if possible, square source, final optimized texture around 512x512 or 256x256.
   - Archive path: `release/games/013/assets/source/ame-guide-source.png`
   - Optimized path: `release/games/013/assets/ame-guide.png`
   - Imagegen2 prompt: “A charming Japanese rainy shrine procession guide mascot for a mobile hybrid browser arcade puzzle game, small friendly attendant wearing indigo rain coat and holding a red paper wagasa parasol, amber lantern charm, teal rain accents, centered readable silhouette, transparent or plain pale rainy background, no text, no watermark, sprite-friendly, high contrast at small size.”
   - Aspect ratio: square.
2. Rainy shrine-market path background source
   - Target: portrait-friendly background suitable behind an isometric rain-procession playfield with open readable center.
   - Archive path: `release/games/013/assets/source/ame-market-source.png`
   - Optimized path: `release/games/013/assets/ame-market.png`
   - Imagegen2 prompt: “A rainy Japanese shrine market path at early evening for a portrait mobile arcade puzzle game, wet stone paths, lacquer-red bridge rail, paper lantern stalls at the sides, puddle reflections, soft teal rain haze, warm amber lights, open readable center area for moving guests and parasols, crop-safe for phone portrait, no characters, no text, no watermark.”
   - Aspect ratio: portrait.
3. Parasol, guest, rain, and UI icon sheet source
   - Target: square icon sheet for parasol selectors, guest groups, hazards, rewards, and UI decals.
   - Archive path: `release/games/013/assets/source/ame-icons-source.png`
   - Optimized path: `release/games/013/assets/ame-icons.png`
   - Imagegen2 prompt: “Small readable icon sheet for a Japanese rainy parasol procession puzzle game: red wagasa parasol, blue wagasa parasol, gold wagasa parasol, smiling guest, dryness droplet, joy charm, rain curtain, gutter channel, puddle reflection stepping-stone, thunder drum, lantern stamp, storm bowl warning, transparent or plain pale teal background, high contrast, no text, no watermark.”
   - Aspect ratio: square.

If Imagegen2 is unavailable or fails after a real attempt, create a clearly labeled emergency fallback using simple SVG/canvas parasol and rain silhouettes, document the failure in `ai/postmortems/day-013.md`, and still keep source/fallback files under the same asset paths.

### Mandatory generated-image QA

For every generated image, include a real inspection step after generation and before integration:

- Analyze the actual generated file visually, not just the prompt text.
- For the rain procession guide mascot, verify transparent/cutout quality or clean background handling, readable silhouette, centered pivot, crop margins, no unwanted text/watermarks, stable upright orientation, and that the parasol direction does not imply wrong gameplay controls.
- Verify control-to-motion alignment in-game: dragging/tapping must move the selected parasol to the indicated anchor, Tilt Left/Right must visibly tilt the shelter direction in the expected direction, Wide/Narrow must visibly change the shelter radius/shape, tapping puddles must open the intended reflection, and Thunder Drum feedback must align with rain/guest behavior.
- For the background, verify the center play area remains readable after portrait mobile crop and does not hide guests, parasol shelters, puddles, gutters, procession card, rain curtains, or controls.
- For the icon sheet, verify red/blue/gold parasols, guest, droplet, joy charm, rain curtain, gutter, reflection stones, thunder drum, lantern stamp, and storm bowl are distinct at final HUD/button size and cannot be confused.
- If inspection finds a problem, regenerate or post-process the image and inspect again. Do not ship broken visual assets just because tests pass.

## Prompt page output

The archived `release/games/013/prompt.html` must be a consistent rendered HTML page, not raw Markdown pasted into a `<pre>` block. It should include:

- A clear `<title>` and `<h1>` using `Day 013 Game Generation Prompt`.
- A back-to-game link near the top.
- Semantic rendered sections (`h2`, `h3`, `ul/ol/li`, `p`, `pre/code` only for actual code/commands).
- The same readable prompt-page style pattern across days so prompt pages feel like one system.

## Subagents to dispatch

1. Implementation subagent
   - Build the static hybrid game under `apps/day-013-ame-parasol-puddle-conductor/`.
   - Integrate it into immutable release output under `release/games/013/`.
   - Create the public playable route under `release/ame/`.
   - Use static HTML/CSS/JS with no backend.
   - The public alias must be self-contained or asset paths must be alias-safe.
2. Asset/polish subagent
   - Generate/prepare Imagegen2 assets, archive source files, optimize playable copies, inspect generated images, and tune mobile readability/game feel.
3. QA/browser/mobile subagent
   - Run desktop and mobile smoke checks, verify no console errors, verify menu/tutorial/objective/controls/restart/pause, prompt links, route rendering, parasol selection, tap/drag placement, tilt left/right, wide/narrow shelter, puddle reflection taps, Thunder Drum control presence, guest dryness/storm feedback, generated screenshot, generated assets, and 390x844 portrait layout.
4. Reflection/self-improvement subagent
   - Write `ai/postmortems/day-013.md` after validation with what worked, what failed, generated-image inspection notes, code-isolation confirmation, and whether generator/template/rubric improvements are justified.

## Acceptance criteria

- Static build passes.
- Code isolation is documented in QA/postmortem: no previous game implementation code was opened, inspected, copied, diffed, grepped, or adapted.
- Mode choice follows the cadence rule: Day 013 is allowed as `hybrid` after Day 012 `3d`; it must have meaningful layered/isometric spatial play where lane/depth/overlap affects shelter, guests, puddles, and rain curtains.
- Desktop smoke passes.
- Mobile portrait smoke passes at about 390x844 with readable HUD/tutorial/procession card, usable tap/drag/select/tilt/wide/puddle/thunder controls, no forced landscape canvas, and 44px+ controls.
- Prompt is visible from gallery and release folder.
- `prompts/day-013.md` is copied exactly to `release/games/013/prompt.md` and `release/ame/prompt.md`.
- `release/games/013/prompt.html` and `release/ame/prompt.html` render the prompt in browser-readable semantic HTML with the standard prompt-page styling, not a raw Markdown `<pre>` dump.
- Public alias `release/ame/index.html`, `release/ame/prompt.html`, `release/ame/screenshot.png`, and `release/ame/assets/` exist and work.
- Gallery card for Day 013 shows prompt availability, generation duration, public `/ame/` links, mode `hybrid`, and actual generated date.
- Screenshot exists at `release/games/013/screenshot.png` and is non-empty/readable. Prefer a readable desktop gameplay screenshot for gallery cards; mobile screenshots are QA evidence unless the design is intentionally portrait-card friendly.
- Image/source assets exist under `release/games/013/assets/source/` and optimized assets exist under `release/games/013/assets/`, or a documented emergency fallback exists.
- Every generated image has an inspection note in the postmortem or QA notes; interactive parasol/guest/rain visuals have verified background handling, orientation/pivot/crop, readability, and control-to-motion alignment.
- If the game uses audio cues, initialize WebAudio only after user gesture and verify no autoplay errors. Optional gentle rain/thunder cues are welcome but not required unless implemented.
- No console errors during desktop or mobile smoke. Add data-URI favicon links to game and prompt pages if needed to avoid favicon request noise.
- Existing `release/games/001/**` through `release/games/012/**` from origin/main remain unchanged.
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
# Screenshot/static checks: verify release/games/013/screenshot.png, prompt.md, prompt.html, index.html, game.js, styles.css, release/ame/index.html, release/ame/prompt.html, release/ame/screenshot.png, optimized assets, and source assets exist and are non-empty.
# Prompt copy check: cmp prompts/day-013.md release/games/013/prompt.md and cmp prompts/day-013.md release/ame/prompt.md.
# Prompt HTML check: verify release/games/013/prompt.html has semantic h1/h2/list markup and a back-to-game link, not a raw Markdown dump inside <pre>, and no malformed ul > p or ol > p nodes.
# Browser smoke: open the local/static /ame/ route and verify menu, tutorial, gameplay start, route rendering, parasol selection, drag/tap placement, tilt left/right, wide/narrow, puddle reflection tap, Thunder Drum control presence, pause, restart, prompt page, no console errors.
# Mobile smoke: repeat at a portrait phone viewport such as 390x844 and verify playable tap/drag controls and readable HUD/procession/scene.
# Static screenshot check: inspect release/games/013/screenshot.png and release/ame/screenshot.png for non-empty readable game content; use vision to judge actual visual quality.
# Image QA: inspect every Imagegen2 source/optimized asset and document the actual inspection result in ai/postmortems/day-013.md.
# Docker/static smoke: build the Docker image locally, run it, curl /ame/ and /ame/prompt.html, then stop the container.
# Immutable guard: confirm no release/games folders from origin/main changed except new Day 013.
```
