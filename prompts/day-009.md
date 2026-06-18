# Day 009 Game Generation Prompt

## Game identity

- Day: 009
- Title: Tsuki Shadow Puppet Troupe
- Slug: tsuki-shadow-puppet-troupe
- Public route word: tsuki
- Mode: hybrid
- Genre: mobile-first 2.5D silhouette timing puzzle / stage-layer arcade score chase
- Mood/style: moonlit Japanese paper-theater stage, translucent washi screens, hand-cut shadow puppets, indigo night, warm candle amber, silver moonlight, theatrical but readable portrait-phone play

## Why this game today

The current generated series in `src/data/games.ts` is:

- Day 001 `2d`: calm koi pond collection and drift survival.
- Day 002 `2d`: timed sky-courier route planning.
- Day 003 `3d`: neon bonsai ring-flight crafting.
- Day 004 `2d`: firefly path drawing / light routing.
- Day 005 `3d`: dream-rail lane runner.
- Day 006 `hybrid`: moonbeam/prism alignment puzzle.
- Day 007 `2d`: seaside bento order-management cooking arcade.
- Day 008 `3d`: moss/root tile routing on a 3D forest shrine board.

The latest generated mode is Day 008 `3d`, so there is no active 2D streak. Day 009 uses `hybrid` to broaden the series without repeating a full 3D board or vehicle/cooking/routing idea. It should feel like a playable paper-theater performance rather than another path-routing, beam-alignment, lane-runner, or sorting game.

Recent screenshot variety notes:

- Day 006 was a cool blue/gold observatory board with prism rotation controls and a wide circular play field.
- Day 007 was a bright warm bento counter with horizontal tide lanes, order cards, and food icons.
- Day 008 was an emerald 3D moss shrine board with top HUD, labeled basin edges, and bottom rotation controls.

Day 009 should shift into a stage-performance silhouette palette: deep indigo, ink black, washi cream, candle amber, silver moon, and vermilion stamp accents. The main play area should be a vertical puppet stage with layered curtains/screens and clearly separated near/mid/far shadow puppet rods. The new verb set is: cue puppet poses, slide rods between depth lanes, align silhouettes with moon-script target shapes, hit beat windows, rescue drifting paper charms, and improvise with a Moon Freeze special.

## Code isolation / no previous game source

The implementation must be written from scratch for this day. Do not open, inspect, copy, diff, grep, or adapt code from previous games, including old `apps/day-*` folders, old `release/games/NNN/` HTML/CSS/JS files, or old public alias folders. You may inspect previous metadata, prompts, postmortems, and screenshots only to avoid repeating concepts and visual identity. The new game's HTML/CSS/JS must come from this prompt and general web/game knowledge, not from earlier game implementations.

## Mode variety / 3D cadence

Inspection target: `src/data/games.ts` currently ends with Day 006 `hybrid`, Day 007 `2d`, and Day 008 `3d`. The latest generated 2D streak is zero.

Mode decision: Day 009 is `hybrid`. It must be a meaningful hybrid, not just a flat 2D game with decorative perspective:

- Use a 2D canvas/DOM game layer plus real depth-lane logic and visual parallax: near, mid, and far puppet rods have different scale, opacity, blur, timing offsets, hit windows, and collision/overlap behavior.
- Gameplay must depend on depth order: target silhouettes require specific puppet layers to be in front/behind, ink-blot hazards only strike certain depth lanes, and paper charms drift through lane-specific wind.
- The visual treatment should use CSS perspective/parallax or canvas transforms to make the washi screens and puppets feel spatial, while remaining performant on phones.
- Portrait mobile is the default supported layout; no landscape gate.

## Design

- Objective: Conduct a moonlit shadow-puppet troupe by moving three puppet rods through depth lanes and cueing poses so their combined silhouettes match incoming moon-script target shapes before the rhythm window closes.
- Win condition: Complete three performance acts — Candle Prologue, Fox-Moon Chase, and Silver Curtain Finale — and reach 2500 points to trigger “Tsuki Full-Moon Ovation”. After Ovation, continue into endless encore scoring.
- Lose condition: The audience loses three lanterns because too many cue windows are missed, ink blots strike active puppets, or the stage focus meter empties.
- Core loop:
  1. Start on a title/menu screen with Day 009 badge, mode badge “hybrid”, public route `/tsuki/`, best score, best Ovation time, tutorial, prompt link, and a large Start button.
  2. A vertical washi theater stage fills the center. Three puppet rods sit on near/mid/far depth rails, each with a distinct puppet shape and large handle.
  3. Moon-script target cards descend or pulse at the top of the stage, showing a silhouette recipe: pose icons, depth order, and beat count.
  4. Player taps/clicks a puppet rod to select it, slides it left/right within its lane, changes its pose, and optionally swaps its depth rail when a target requires a front/back silhouette.
  5. When the beat ring reaches the cue zone, the player taps “Cue Scene” or presses Space. Correct combined silhouettes score with a paper-lantern burst and extend combo.
  6. Ink blots, tangled strings, and gusts of paper wind interrupt specific lanes. The player can dodge by moving a puppet to another depth lane or activate Moon Freeze when charged.
  7. Paper charm bonuses drift through the stage; collecting them without breaking the silhouette alignment charges Moon Freeze and awards mastery bonuses.
  8. Pause/restart remain available throughout.
- 15+ minute play-value strategy:
  - Save best score, fastest Full-Moon Ovation time, longest perfect cue streak, highest endless encore act, and collected theater stamps in localStorage.
  - Include three authored performance acts:
    - Candle Prologue: two-puppet silhouettes, slow beat rings, one depth swap tutorial, no lane hazards for the first cues.
    - Fox-Moon Chase: three puppet silhouettes, moving fox/moon target recipes, first ink blots, tangled strings, charm collection.
    - Silver Curtain Finale: layered front/back silhouettes, alternating beat tempos, gusts that move charms between lanes, stage focus pressure.
  - Deterministic Day 009 seed varies target recipe order, charm drift, ink-blot timing, audience bonus prompts, and encore tempo while keeping the opening fair.
  - Mastery badges: complete Candle Prologue without a miss, land 15 perfect cues, trigger Full-Moon Ovation under 175 seconds, finish an encore act with all three audience lanterns lit, collect 30 paper charms.
  - Strategic scoring rewards reading ahead: pre-position rods, keep the correct depth order, time cue windows, use Moon Freeze only during cluttered recipes, and decide whether a charm is worth risking a cue.
  - Endless encore after Ovation adds more recipe permutations, shorter beat windows, cross-lane hazards, and faster charm drift without shrinking touch targets.
- Difficulty scaling:
  - 0-45 seconds: two puppets, large cue window, slow target cards, obvious depth order.
  - 45-105 seconds: three puppets, first depth swaps, lane-specific ink blot warnings, medium cue windows.
  - 105-175 seconds: mixed pose/depth recipes, charm risk decisions, beat tempo changes, stage focus decay.
  - 175+ seconds/endless: denser target queue, alternating tempos, faster ink warnings, higher score multipliers, but all core controls remain large and reachable.
  - Keep mobile fair: puppet handles at least 48px visual size, action buttons at least 56px tall, forgiving drag/tap hit zones, clear beat ring, short icon labels, and no tiny hazards required for survival.
- Scoring/rewards:
  - Correct puppet position/pose within cue window: +45 points per puppet.
  - Perfect full-scene cue: +210 points times combo tier and +14% Moon Freeze charge.
  - Good but not perfect cue: +110 points, smaller combo gain.
  - Paper charm collected while still matching the target: +90 points.
  - Act completed: +380 points and restore one audience lantern if below max.
  - Tsuki Full-Moon Ovation: +850 points and endless encore unlock.
  - Missed cue: audience lantern stress +1, combo reset, stage focus -10%.
  - Ink blot hits active puppet: stage focus -18%, puppet briefly stunned, combo reset.

## Controls and layout

- Desktop:
  - Mouse click/tap: select a puppet rod, pose button, depth lane, or target helper.
  - Mouse drag: slide selected puppet rod along its lane.
  - A/D or Arrow Left/Right: move selected puppet left/right.
  - W/S or Arrow Up/Down: swap selected puppet to far/near depth rail when legal.
  - Q/E: cycle selected puppet.
  - Z/X/C or 1/2/3: set pose for selected puppet.
  - Space or Enter: Cue Scene.
  - Shift or M: activate Moon Freeze when charged.
  - P: pause/resume.
  - R: restart current run.
- Mobile/touch:
  - Tap a large puppet handle to select; drag horizontally to slide it within its rail.
  - Use large Pose Previous / Pose Next buttons to change pose.
  - Use large Far / Near depth buttons to swap depth rails.
  - Tap large “Cue Scene” button for the beat window.
  - Tap Moon Freeze when charged.
  - Pause and Restart controls with 44px+ targets.
  - No virtual joystick. Interaction is tap-select, drag rods, and large action buttons.
- Mobile layout/orientation:
  - Default target is portrait phone play around 390x844; do not require landscape.
  - Top: compact HUD with score, best, audience lanterns, act, combo, stage focus, current target, Moon Freeze charge.
  - Upper center: target recipe card and beat ring, always readable.
  - Center: washi stage with three depth rails and puppets; rail labels NEAR/MID/FAR or icon equivalents must remain legible.
  - Bottom: large Pose, Far/Near, Cue Scene, Moon Freeze, Pause, and Restart controls; controls must not hide the stage target zone.
  - Tutorial must fit on the first portrait screen; optional details may be collapsible but objective, puppet movement, pose, depth, cue timing, hazards, and Moon Freeze must be visible.
  - Target recipes must combine shape, icon, short text, and depth chips so hue alone is not required.

## Menu and tutorial

Implement these states:

1. Title screen
   - Shows title “Tsuki Shadow Puppet Troupe”.
   - Shows Day 009 badge, mode badge “hybrid”, public route `/tsuki/`, best score, best Ovation time if available, and a prompt link.
   - Shows a large Start button and visible tutorial panel by default.
2. Tutorial text
   - Objective: “Match the moon-script silhouettes by posing puppets, sliding rods, and cueing on the beat.”
   - Puppet rods: select and drag a rod to place it on the stage.
   - Poses: switch the selected puppet pose to match target icons.
   - Depth: near/mid/far lanes change which shadow appears in front and which hazards can hit.
   - Cue timing: tap Cue Scene when the beat ring enters the silver cue zone.
   - Hazards: ink blots stun puppets, tangled strings block swaps, gusts move paper charms.
   - Moon Freeze: slows target timing, suspends ink blots, and highlights the correct depth order when charged.
   - Pause/restart: P/R on desktop or visible buttons on mobile.
3. In-game HUD
   - Score, best score, audience lantern health, act, cue streak/combo, stage focus, elapsed time, current target, Moon Freeze charge.
   - Pause/restart controls visible or immediately accessible.
4. Target helper overlay
   - Non-blocking hint near the target recipe showing needed puppet names, pose icons, and depth order.
   - Must not cover active puppet handles or cue controls on mobile.
5. Pause overlay
   - Resume, restart, tutorial reminder, controls summary, prompt link.
6. Game-over/results overlay
   - Final score, best score, act reached, Ovation status, perfect cue streak, mastery badges, restart button.
7. Tsuki Full-Moon Ovation banner
   - Trigger once per run after all three acts and 2500 score.
   - Non-blocking silver moon bloom, paper lanterns rise, audience silhouettes clap, endless encore continues after the banner fades.

## Assets

Prefer Imagegen2 (`openai/gpt-image-2`) for final visual art: puppet troupe mascot/lead puppet, moonlit paper-theater background, puppet/icon sheet, and key decorative pieces. Canvas/SVG/DOM code may animate, crop, alpha-clean, resize, composite, optimize, draw beat rings, rails, helper lines, particles, hit zones, UI chrome, and debug shapes. It should not create final character/background/icon art from scratch unless Imagegen2 is unavailable after a real attempt.

Archive source generated art under `release/games/009/assets/source/` and use optimized playable copies under `release/games/009/assets/`. Also copy optimized playable assets into `apps/day-009-tsuki-shadow-puppet-troupe/assets/` and the public alias `release/tsuki/assets/`.

For mobile-first crop safety: keep important content centered, leave 12-16% safe margins, avoid baked-in text, avoid watermarks, avoid fake UI labels, avoid tiny silhouette details that disappear at final in-game size, and keep high-contrast puppet shapes.

Generate or provide at least these final art assets:

1. Shadow puppet lead mascot source
   - Target: transparent PNG if possible, square source, final optimized texture around 512x512 or 256x256.
   - Archive path: `release/games/009/assets/source/tsuki-lead-puppet-source.png`
   - Optimized path: `release/games/009/assets/tsuki-lead-puppet.png`
   - Imagegen2 prompt: “A charming Japanese shadow puppet troupe lead character for a mobile browser stage-timing game, hand-cut washi paper puppet with fox mask, small moon fan, bamboo control rods, indigo and warm candle amber accents, centered readable silhouette, transparent or plain dark stage background, no text, no watermark, sprite-friendly, high contrast at small size.”
   - Aspect ratio: square.
2. Moonlit paper theater background source
   - Target: portrait-friendly background suitable for a phone game stage with an open center play area.
   - Archive path: `release/games/009/assets/source/tsuki-theater-source.png`
   - Optimized path: `release/games/009/assets/tsuki-theater.png`
   - Imagegen2 prompt: “A moonlit Japanese paper shadow-puppet theater stage for a portrait mobile arcade puzzle game, layered washi screens, bamboo frame, hanging lanterns, silver full moon visible through paper, deep indigo night, warm candle amber edges, open readable center area for puppet rails and silhouettes, crop-safe for phone portrait, no characters, no text, no watermark.”
   - Aspect ratio: portrait.
3. Puppet pose and theater icon sheet source
   - Target: square icon sheet for puppets, poses, hazards, target recipe chips, and UI decals.
   - Archive path: `release/games/009/assets/source/tsuki-icons-source.png`
   - Optimized path: `release/games/009/assets/tsuki-icons.png`
   - Imagegen2 prompt: “Small readable icon sheet for a Japanese shadow puppet theater timing game: fox puppet pose, crane puppet pose, moon fan pose, near/mid/far depth chips, cue beat ring, paper charm, ink blot hazard, tangled string, gust swirl, moon freeze icon, audience lantern, full moon ovation stamp, transparent or plain dark indigo background, high contrast silhouettes, no text, no watermark.”
   - Aspect ratio: square.

If Imagegen2 is unavailable or fails after a real attempt, create a clearly labeled emergency fallback using simple SVG/canvas silhouette assets, document the failure in `ai/postmortems/day-009.md`, and still keep source/fallback files under the same asset paths.

### Mandatory generated-image QA

For every generated image, include a real inspection step after generation and before integration:

- Analyze the actual generated file visually, not just the prompt text.
- For the lead puppet mascot, verify transparent/cutout quality or clean background removal, readable silhouette, centered pivot, crop margins, no unwanted text/watermarks, and clear upright rod/puppet orientation.
- Verify control-to-motion alignment in-game: dragging rods should visually move the selected puppet along the same horizontal rail, Far/Near controls should match the visible depth order/scale, pose buttons should update the selected puppet silhouette, and Cue Scene feedback should align with the beat ring.
- For the background, verify the center stage remains readable after portrait mobile crop and does not hide puppet handles, target recipes, beat ring, hazards, or bottom controls.
- For the icon sheet, verify pose icons, depth chips, charms, hazards, and Moon Freeze are distinct at final HUD/button size and cannot be confused with each other.
- If inspection finds a problem, regenerate or post-process the image and inspect again. Do not ship broken visual assets just because tests pass.

## Prompt page output

The archived `release/games/009/prompt.html` must be a consistent rendered HTML page, not raw Markdown pasted into a `<pre>` block. It should include:

- A clear `<title>` and `<h1>` using `Day 009 Game Generation Prompt`.
- A back-to-game link near the top.
- Semantic rendered sections (`h2`, `h3`, `ul/ol/li`, `p`, `pre/code` only for actual code/commands).
- The same readable prompt-page style pattern across days so prompt pages feel like one system.

## Subagents to dispatch

1. Implementation subagent
   - Build the static hybrid game under `apps/day-009-tsuki-shadow-puppet-troupe/`.
   - Integrate it into immutable release output under `release/games/009/`.
   - Create the public playable route under `release/tsuki/`.
   - Use static HTML/CSS/JS with no backend.
   - The public alias must be self-contained or asset paths must be alias-safe.
2. Asset/polish subagent
   - Generate/prepare Imagegen2 assets, archive source files, optimize playable copies, inspect generated images, and tune mobile readability/game feel.
3. QA/browser/mobile subagent
   - Run desktop and mobile smoke checks, verify no console errors, verify menu/tutorial/objective/controls/restart/pause, prompt links, puppet selection, rod dragging, pose changes, depth swaps, Cue Scene, Moon Freeze, hazards, 390x844 portrait layout, generated screenshot, and generated assets.
4. Reflection/self-improvement subagent
   - Write `ai/postmortems/day-009.md` after validation with what worked, what failed, generated-image inspection notes, code-isolation confirmation, and whether generator/template/rubric improvements are justified.

## Acceptance criteria

- Static build passes.
- Code isolation is documented in QA/postmortem: no previous game implementation code was opened, inspected, copied, diffed, grepped, or adapted.
- Mode choice follows the cadence rule: Day 009 is a meaningful `hybrid` after Day 008 `3d`, with actual depth-lane gameplay and visual parallax rather than decorative perspective only.
- Desktop smoke passes.
- Mobile portrait smoke passes at about 390x844 with readable HUD/tutorial/target cards, usable rod/pose/depth/cue controls, no forced landscape canvas, and 44px+ controls.
- Prompt is visible from gallery and release folder.
- `prompts/day-009.md` is copied exactly to `release/games/009/prompt.md` and `release/tsuki/prompt.md`.
- `release/games/009/prompt.html` and `release/tsuki/prompt.html` render the prompt in browser-readable semantic HTML with the standard prompt-page styling, not a raw Markdown `<pre>` dump.
- Public alias `release/tsuki/index.html`, `release/tsuki/prompt.html`, `release/tsuki/screenshot.png`, and `release/tsuki/assets/` exist and work.
- Gallery card for Day 009 shows prompt availability, generation duration, public `/tsuki/` links, mode `hybrid`, and actual generated date.
- Screenshot exists at `release/games/009/screenshot.png` and is non-empty/readable.
- Image/source assets exist under `release/games/009/assets/source/` and optimized assets exist under `release/games/009/assets/`, or a documented emergency fallback exists.
- Every generated image has an inspection note in the postmortem or QA notes; moving/interactive puppet visuals have verified cutout/background handling, orientation/pivot/crop, readability, depth order, and control-to-motion alignment.
- No console errors during desktop or mobile smoke.
- Existing `release/games/001/**` through `release/games/008/**` from origin/main remain unchanged.
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
# Screenshot/static checks: verify release/games/009/screenshot.png, prompt.md, prompt.html, index.html, game.js, styles.css, release/tsuki/index.html, release/tsuki/prompt.html, release/tsuki/screenshot.png, optimized assets, and source assets exist and are non-empty.
# Prompt copy check: cmp prompts/day-009.md release/games/009/prompt.md and cmp prompts/day-009.md release/tsuki/prompt.md.
# Prompt HTML check: verify release/games/009/prompt.html has semantic h1/h2/list markup and a back-to-game link, not a raw Markdown dump inside <pre>, and no malformed ul > p or ol > p nodes.
# Browser smoke: open the local/static /tsuki/ route and verify menu, tutorial, gameplay start, puppet selection, rod dragging or keyboard movement, pose changes, depth swaps, Cue Scene, Moon Freeze control, pause, restart, prompt link, no console errors.
# Mobile smoke: repeat at a portrait phone viewport such as 390x844 and verify playable tap/drag controls and readable HUD/target/stage.
# Static screenshot check: inspect release/games/009/screenshot.png for non-empty readable game content.
# Image QA: inspect every generated Imagegen2 source/optimized asset and document the actual inspection result in ai/postmortems/day-009.md.
# Docker/static smoke: build the Docker image locally, run it, curl /tsuki/ and /tsuki/prompt.html, then stop the container.
# Immutable guard: confirm no release/games folders from origin/main changed except new Day 009.
```
