# Day 026 Game Generation Prompt

## Game identity

- Day: 026
- Title: Natsu Hanabi Sky Painter
- Slug: natsu-hanabi-sky-painter
- Public route word: natsu
- Mode: 3D
- Genre: mobile-first 3D firework trajectory painting arcade / timing-and-altitude score chase
- Mood/style: warm Japanese summer riverbank fireworks festival at blue-hour night, lacquer launch racks, gold fuse sparks, teal smoke ribbons, paper lantern reflections, distant stalls, crisp hanabi bursts, a cheerful tanuki pyrotechnician helper, tactile launch-angle and burst-timing feedback; real 3D shell arcs and sky-depth timing rather than lucky-cat pachinko coin routing, moon-mochi platform hopping, sumi brush tracing, kite-thread navigation, dry-garden raking, underwater pearl diving, taiko rhythm lanes, daruma tilt mazes, silver webs, pottery shaping, bamboo canals, origami folding, rain sheltering, snow stacking, kimono stamping, bento cooking, windbell tuning, rail running, or koi collection.

## Why this game today

The generated series currently ends with:

- Day 023 `2d`: sumi calligraphy with creamy washi, black brush strokes, vermilion seals, direct drag input, wetness/blot management, and a fox-scribe helper.
- Day 024 `3d`: moon-rabbit mochi platform hopping with lavender rooftops, 3D pads, jump arcs, rice sparks, tray gates, and moon trays.
- Day 025 `2d`: maneki-neko koban pachinko with red-and-gold cabinet, coin drops, rotatable paw bumpers, charm gates, bells, trays, and a lucky-cat helper.

The latest generated-mode streak is one `2d`. Day 026 deliberately chooses real `3D` to keep the cadence strong after a tactile 2D pachinko day and to avoid a run of flat touch games. The new verb set is firework sky-painting: aim a launch tube in 3D, charge a shell, choose fuse timing, steer through altitude rings, burst at the correct depth, paint requested constellation strokes, clear smoke lanes, and chain color patterns above the river festival.

Recent screenshot/visual variety notes to avoid repeating:

- Day 025 used a deep vermilion/gold lucky-cat cabinet, top drop slots, pegged pachinko board, cat-paw bumpers, bottom tray targets, and broad red/orange UI cards.
- Day 024 used purple/lavender moon rooftops, floating mochi pads in depth, a tiny white rabbit, landing circles, rice sparks, and platform-jump controls.
- Day 023 used warm washi paper panels, charcoal desk, ghost brush strokes, vermilion seal target, fox-scribe helper, and direct drawing controls.

Day 026 should shift to open night-sky spectacle and launch engineering: dark indigo-to-teal summer sky, river reflections, distant festival lights, lacquer firework tubes, glowing fuse trails, large readable shell arcs, bloom patterns, smoke ribbons, and gold/cyan/magenta burst colors. Avoid red-gold pachinko cabinets, coin trays, cats, mochi pads, moon rabbits, washi scroll boards, brush strokes/seals, kite/thread/star-map navigation, dry sand/stone gardens, underwater teal corridors, drum/rhythm pads, tilt-maze boards, web anchors, clay profiles, bamboo pipes, origami creases, parasols/rain, snow blocks, kimono panels, and generic endless runner lanes.

## Code isolation / no previous game source

The implementation must be written from scratch for this day. Do not open, inspect, copy, diff, grep, or adapt code from previous games, including old `apps/day-*` folders, old `release/games/NNN/` HTML/CSS/JS files, or old public alias folders. You may inspect previous metadata, prompts, postmortems, and screenshots only to avoid repeating concepts and visual identity. The new game's HTML/CSS/JS must come from this prompt and general browser/Three.js/WebGL/WebAudio game knowledge, not from earlier game implementations.

## Mode variety / 3D cadence

Inspection target: `src/data/games.ts` currently ends with Day 023 `2d`, Day 024 `3d`, and Day 025 `2d`. The latest generated-mode streak is one `2d`.

Mode decision: Day 026 is real `3D`. It must implement meaningful spatial gameplay, not decorative perspective:

- Use Three.js/WebGL or equivalent static-browser 3D rendering.
- Render an actual depth-visible festival sky stage with launch racks in the foreground, shell arcs rising through x/y/z space, altitude/depth rings, smoke volumes, floating lantern lane markers, burst targets, and parallax riverbank festival scenery.
- Gameplay must depend on 3D state: horizontal aim, elevation angle, shell velocity, fuse duration, altitude band, z-depth lane, wind drift, smoke density, burst radius, target constellation position, and camera framing.
- Player actions must manipulate the 3D system: aim left/right/up/down, charge launch power, choose shell color/order, set fuse timing, launch, adjust the tube angle before the next shell, trigger Wind Fan to clear smoke, use Slow Fuse focus to preview the arc/burst point, pause/restart, and inspect tutorial hints.
- Portrait mobile is the default supported layout; no landscape gate.

## Design

- Objective: Launch colorful hanabi shells through 3D sky rings and burst them at the correct altitude/depth to paint requested festival patterns while keeping smoke, misfires, and crowd patience under control.
- Win condition: Complete three firework commissions — First River Spark, Lantern Bridge Bloom, and Grand Summer Crest — while reaching 4000 points to trigger “Natsu Grand Hanabi”. After the grand banner, continue into endless sky-painting commissions.
- Lose condition: Three safety lanterns go dark, the commission timer expires, smoke saturation reaches 100%, too many shells burst in the wrong altitude/depth band, or crowd patience empties after repeated misfires.
- Core loop:
  1. Start on a title/menu screen with Day 026 badge, mode badge “3D”, public route `/natsu/`, best score, best Grand Hanabi time, tutorial, prompt link, and a large Start button.
  2. Show a portrait-friendly festival launch deck. Foreground lacquer tubes tilt toward a layered night sky. The sky contains large altitude/depth rings, color-coded burst targets, smoke clouds, floating lantern lane markers, and a riverbank backdrop.
  3. A commission card requests goals, for example: “Paint 2 gold bursts in high lane, 1 cyan ring at mid depth, clear smoke below 35%, finish with one Slow Fuse unused.”
  4. Player aims the tube with large direction buttons or drag-to-aim. Charge Launch sets shell speed. Fuse Timing selects early/mid/late burst. A preview arc appears when Slow Fuse is charged or during guided early shots.
  5. Launched shells travel in 3D arcs. Passing through sky rings builds combo, but bursting too early/late paints the wrong lane and raises smoke.
  6. Color shells have roles: Gold star shells score high in center targets, Cyan ring shells clear small smoke halos, Magenta chrysanthemum shells cover wide patterns but create more smoke, and White willow shells extend combo when timed late.
  7. Wind Fan clears a smoke ribbon and bends active shells slightly; using it at the wrong time can push shells out of target lanes.
  8. Slow Fuse focus, charged by clean ring-throughs and accurate bursts, slows the active shell and overlays a predicted burst sphere/path for a short window.
  9. Completing a commission lights paper lanterns along the river, awards points, restores one safety lantern if needed, and unlocks more complex depth lanes and moving targets.
  10. Pause/restart remain available throughout.
- 15+ minute play-value strategy:
  - Save best score, fastest Natsu Grand Hanabi time, longest clean ring chain, highest endless commission, fewest misfires, lowest smoke finish, best color-order accuracy, and collected festival crest badges in localStorage.
  - Include three authored commissions:
    - First River Spark: wide rings, slow shell speed, gold/cyan only, visible guided arc, one high burst target, no safety penalty during the first guided shell.
    - Lantern Bridge Bloom: adds magenta shells, mid/deep lanes, moving bridge target, first smoke ribbons, Wind Fan tutorial, and stricter fuse timing.
    - Grand Summer Crest: adds white willow shells, three-color order, narrower high/deep burst windows, crossing lantern markers, smoke-density pressure, and Slow Fuse mastery.
  - Deterministic Day 026 seed varies ring positions, depth lanes, target shapes, shell order, wind drift, smoke cloud starting points, fuse tolerance, and endless constraints while keeping the opening fair.
  - Mastery badges: finish First River Spark without a misfire, trigger Grand Hanabi under 240 seconds, paint 26 requested bursts in order, complete a commission below 12% smoke, clear 10 smoke ribbons with perfect Wind Fan timing, complete an endless crest with all safety lanterns.
  - Strategic scoring rewards planning: aim for ring-throughs before burst targets, choose low-smoke cyan shells before wide magenta bursts, save Wind Fan for smoke bottlenecks, use Slow Fuse before high/deep targets, time white willow bursts late for combo extension, and avoid overcharging when wind drift is strong.
  - Endless mode after Natsu Grand Hanabi adds denser ring fields, moving burst targets, stronger wind, shorter fuse windows, more smoke overlap, and mixed shell orders without shrinking touch controls.
- Difficulty scaling:
  - 0-45 seconds: wide rings, slow shells, generous fuse timing, one target lane, guided first shot, smoke mostly decorative.
  - 45-130 seconds: mid/deep lanes, magenta shells, first moving target, visible wind drift, Wind Fan introduced.
  - 130-240 seconds: three-color orders, narrow high/deep windows, crossing lantern markers, smoke pressure, Slow Fuse timing, stricter crowd patience.
  - 240+ seconds/endless: denser 3D sky, faster target drift, fewer safe fan windows, same readable controls.
  - Keep mobile fair: shells, rings, burst spheres, smoke ribbons, lantern markers, target cards, and action buttons must be large/readable at 390x844; primary touch buttons must be 52px+; no tiny survival-critical targets.
- Scoring/rewards:
  - Shell passes through requested sky ring: +110 points times combo tier.
  - Accurate burst in correct altitude/depth lane: +150 points and Slow Fuse charge.
  - Correct color-order burst: +95 bonus.
  - Clean center-burst on target sphere: +210 bonus.
  - Wind Fan clears smoke while preserving shell lane: +140 points.
  - Commission complete below smoke target: +700 points and restore one safety lantern if below max.
  - Perfect no-misfire commission: +850 points.
  - Natsu Grand Hanabi: +1600 points and endless commissions unlock.
  - Wrong lane burst: combo soft-reset, smoke +8%, crowd patience -5%.
  - Misfire/off-screen burst: safety lantern damage if threshold crossed, smoke +14%, combo reset.
  - Over-fanning active shell out of target lane: small smoke clear but accuracy penalty.

## Controls and layout

- Desktop:
  - Mouse click/tap: press aim/action buttons, select shell color, start/pause overlay button, prompt link, or explainable HUD chips.
  - Mouse drag on the sky/stage: aim tube direction and elevation; release does not automatically launch unless the UI is unambiguous.
  - Arrow keys or WASD: aim left/right/up/down.
  - Space or Enter: Charge/Release Launch / confirm start.
  - 1/2/3/4: select Gold, Cyan, Magenta, or White shell.
  - F: cycle Fuse Timing early/mid/late.
  - W: Wind Fan when available.
  - Shift or B: Slow Fuse focus when charged.
  - P: pause/resume.
  - R: restart current run.
- Mobile/touch:
  - Use large Aim Left, Aim Right, Aim Up, Aim Down buttons plus optional drag-to-aim on the sky.
  - Use large Charge Launch, Fuse Timing, Shell Color, Wind Fan, Slow Fuse, Pause, Restart, and Prompt buttons.
  - Tapping ring/target/smoke chips may show short explanations.
  - No tiny virtual joystick. Interaction is aiming, charging/releasing launch, choosing shell/fuse, fan, focus, pause/restart.
- Mobile layout/orientation:
  - Default target is portrait phone play around 390x844; do not require landscape.
  - Top: compact hanabi HUD with score, best, safety lanterns, smoke %, combo, selected shell, fuse timing, active aim angle, and elapsed time. Use firework/shell/ring/lantern chips, not cat/coin/rabbit/mochi/brush/ink/kite/garden/depth chips.
  - Below top: commission card with requested shell colors, target altitude/depth lanes, smoke limit, ring count, and progress ticks.
  - Center: tall 3D sky stage with tube deck, shell arc, rings, target spheres, smoke ribbons, lantern lane markers, riverbank background, and burst particles. It must remain playable without zooming.
  - Bottom: status helper plus large aim/action controls. Controls must not cover the active tube, burst target, smoke warning, or ring path.
  - Tutorial must fit on the first portrait screen; optional details may be collapsible but objective, aiming, Charge Launch, fuse timing, shell colors, rings, burst lanes, Wind Fan, Slow Fuse, pause/restart must be visible.
  - Requests must combine text, shell icons, lane labels, shapes, and line styles so hue alone is not required.

## Menu and tutorial

Implement these states:

1. Title screen
   - Shows title “Natsu Hanabi Sky Painter”.
   - Shows Day 026 badge, mode badge “3D”, public route `/natsu/`, best score, best Grand Hanabi time if available, and a prompt link.
   - Shows a large Start button and visible tutorial panel by default.
   - Notes: “Audio starts after you press Start; visual arcs and burst rings work if muted.”
2. Tutorial text
   - Objective: “Launch hanabi shells, pass through sky rings, and burst at the right altitude/depth to paint the summer sky.”
   - Aiming: use arrows/WASD or big touch buttons; the aim reticle and tube show direction.
   - Launch/fuse: Charge Launch sets distance; Fuse Timing controls where the shell bursts.
   - Shell colors: Gold scores precise stars, Cyan clears smoke, Magenta paints wide blooms, White extends late combos.
   - Smoke: accurate bursts stay clean; misfires and wide blooms fill smoke. Use Wind Fan carefully.
   - Slow Fuse: slows the active shell and previews the burst sphere when charged.
   - Pause/restart: P/R on desktop or visible buttons on mobile.
3. In-game HUD
   - Score, best score, safety lanterns, smoke %, commission name, combo, selected shell, fuse timing, aim angle, elapsed time, requested shell order, target lane progress, ring count, Wind Fan charge, Slow Fuse charge, latest warning.
   - Pause/restart controls visible or immediately accessible.
4. Status helper
   - Non-blocking helper showing next requested shell, aim/fuse advice, likely altitude lane, smoke risk, fan readiness, Slow Fuse readiness, and expected score effect.
   - Must not cover the 3D sky stage or bottom controls on mobile.
5. Pause overlay
   - Resume, restart, tutorial reminder, controls summary, audio/mute toggle, prompt link.
6. Game-over/results overlay
   - Final score, best score, commission reached, Grand Hanabi status, clean ring chain, accurate bursts, misfires, smoke finish, mastery badges, restart button.
7. Natsu Grand Hanabi banner
   - Trigger once per run after all three commissions and 4000 score.
   - Non-blocking celebration: gold/cyan/magenta/white bursts bloom into a summer crest, river lanterns brighten, smoke clears, the tanuki helper waves a fan, and endless commissions continue after the banner fades.

## Assets

Prefer Imagegen2 (`openai/gpt-image-2`) for final visual art: tanuki pyrotechnician helper mascot, portrait summer festival riverbank/launch-deck background, firework shell/ring/smoke/icon sheet, and decorative hanabi crest pieces. Three.js primitives may render interactive 3D shell arcs, rings, burst targets, smoke volumes, lantern lane markers, launch tubes, particles, camera, fog, and UI chrome. Procedural code may crop, resize, alpha-clean, atlas-pack, optimize, animate, or place generated assets; it should not create final character/background/icon art from scratch unless Imagegen2 is unavailable after a real attempt.

Archive source generated art under `release/games/026/assets/source/` and use optimized playable copies under `release/games/026/assets/`. Also copy optimized playable assets into `apps/day-026-natsu-hanabi-sky-painter/assets/` and the public alias `release/natsu/assets/`.

For mobile-first crop safety: keep important content centered, leave 12-16% safe margins, avoid baked-in text, avoid watermarks, avoid fake UI labels, avoid tiny burst/ring details that disappear at final in-game size, and keep shell/ring/smoke/lantern/target silhouettes distinct against dark indigo festival backgrounds.

Generate or provide at least these final art assets:

1. Tanuki pyrotechnician helper mascot
   - Target: transparent PNG if possible, square source, final optimized texture around 512x512 or 256x256.
   - Archive path: `release/games/026/assets/source/natsu-helper-source.png`
   - Optimized path: `release/games/026/assets/natsu-helper.png`
   - Imagegen2 prompt: “A charming friendly Japanese tanuki pyrotechnician helper mascot for a mobile 3D hanabi fireworks browser arcade game, small tanuki wearing a navy summer happi coat and safety sash, holding a folding fan and a tiny golden firework shell, delighted smile, warm lantern rim light, centered readable silhouette, transparent or solid dark indigo festival background, no checkerboard background, no text, no watermark, sprite-friendly, high contrast at small size.”
   - Aspect ratio: square.
2. Summer riverbank fireworks launch deck background source
   - Target: portrait-friendly background suitable behind a 3D sky/launch-stage with open readable center.
   - Archive path: `release/games/026/assets/source/natsu-festival-source.png`
   - Optimized path: `release/games/026/assets/natsu-festival.png`
   - Imagegen2 prompt: “A magical Japanese summer riverbank fireworks festival for a portrait mobile 3D sky-painting game, dark indigo and teal night sky, warm paper lantern reflections on river water, distant festival stalls, lacquer hanabi launch racks at the bottom edges, subtle smoke ribbons, tiny non-readable crowd silhouettes, open readable vertical center sky for interactive firework arcs and burst targets, crop-safe for phone portrait, no readable text, no watermark.”
   - Aspect ratio: portrait.
3. Firework shell, burst, ring, smoke, lantern, and tool icon sheet source
   - Target: square icon sheet for objectives, hazards, tools, rewards, and UI decals.
   - Archive path: `release/games/026/assets/source/natsu-icons-source.png`
   - Optimized path: `release/games/026/assets/natsu-icons.png`
   - Imagegen2 prompt: “Small readable icon sheet for a Japanese natsu hanabi fireworks arcade game: gold star shell, cyan ring shell, magenta chrysanthemum shell, white willow shell, altitude sky ring, target burst sphere, smoke cloud hazard, paper safety lantern, Wind Fan tool, Slow Fuse focus emblem, fuse timing dial, launch tube, crowd patience icon, Natsu Grand Hanabi crest, transparent or solid dark indigo background, no checkerboard background, high contrast, no text, no watermark, generous margins so no icons are cut off.”
   - Aspect ratio: square.

If Imagegen2 is unavailable or fails after a real attempt, create a clearly labeled emergency fallback using simple SVG/Three.js firework/tanuki silhouettes, document the failure in `ai/postmortems/day-026.md`, and still keep source/fallback files under the same asset paths.

### Mandatory generated-image QA

For every generated image, include a real inspection step after generation and before integration:

- Analyze the actual generated file visually, not just the prompt text.
- For the tanuki mascot, verify transparent/cutout quality or clean background handling, readable friendly silhouette, centered pivot/crop margins, no unwanted text/watermarks, stable upright helper orientation, and that fan/shell pose does not imply incompatible movement or rotation.
- Verify control-to-motion alignment in-game: Aim Left/Right/Up/Down must move the launch tube/reticle in the expected direction, Charge Launch must visibly change arc distance, Fuse Timing must move the predicted burst point, Shell Color must change shell/burst visuals, Wind Fan must clear/push intended smoke/shell lanes, Slow Fuse must slow/preview as described, and wrong-lane/misfire feedback must affect intended areas.
- For the background, verify the center sky remains readable after portrait mobile crop and does not hide shell arcs, rings, burst targets, smoke, commission card, helper, or controls.
- For the icon sheet, verify shell colors, sky ring, target burst, smoke, safety lantern, Wind Fan, Slow Fuse, fuse dial, launch tube, crowd patience, and Grand Hanabi crest are distinct at final HUD/button size and cannot be confused. Watch specifically for fake checkerboard transparency; alpha-clean or composite onto dark indigo if needed and inspect again.
- If inspection finds a problem, regenerate or post-process the image and inspect again. Do not ship broken visual assets just because tests pass.

## Audio and game feel

Because firework launch, fuse timing, sky rings, smoke clearing, and burst painting are central to the theme, include lightweight WebAudio cues initialized only after a user gesture:

- Soft fuse hiss while charging launch, pitch rising with charge.
- Wooden tube thump and rocket whistle when a shell launches.
- Bright sky-ring chime when a shell passes through a requested ring.
- Layered firework bloom sound for accurate bursts, with color-specific timbre.
- Smoky low puff/rattle for wrong-lane bursts or misfires.
- Paper fan whoosh for Wind Fan.
- Sparkly slowed-time shimmer when Slow Fuse activates.
- Rising taiko/koto/firework arpeggio when Natsu Grand Hanabi triggers.

Audio must not block play if WebAudio is unavailable. Verify no autoplay errors: audio context should be created/resumed only after Start or another user interaction. Include a visible mute toggle in pause/results or HUD.

## Prompt page output

The archived `release/games/026/prompt.html` must be a consistent rendered HTML page, not raw Markdown pasted into a `<pre>` block. It should include:

- A clear `<title>` and `<h1>` using `Day 026 Game Generation Prompt`.
- A back-to-game link near the top.
- Semantic rendered sections (`h2`, `h3`, `ul/ol/li`, `p`, `pre/code` only for actual code/commands).
- The same readable prompt-page style pattern across days so prompt pages feel like one system.

## Subagents to dispatch

1. Implementation subagent
   - Build the static 3D game under `apps/day-026-natsu-hanabi-sky-painter/`.
   - Integrate it into immutable release output under `release/games/026/`.
   - Create the public playable route under `release/natsu/`.
   - Use static HTML/CSS/JS with Three.js/WebGL/WebAudio and no backend.
   - The public alias must be self-contained or asset paths must be alias-safe.
   - If vendoring `three.module*.js`, also copy the matching `three.core*.js` beside it in the app, release archive, and `/natsu/` alias assets.
2. Asset/polish subagent
   - Generate/prepare Imagegen2 assets, archive source files, optimize playable copies, inspect generated images, remove fake checkerboards if present, and tune mobile readability/game feel.
3. QA/browser/mobile subagent
   - Run desktop and mobile smoke checks, verify no console errors, verify menu/tutorial/objective/controls/restart/pause, prompt links, 3D sky render, aim controls, Charge Launch, Fuse Timing, Shell Color, Wind Fan, Slow Fuse control presence, ring-through feedback, burst target feedback, smoke/misfire feedback, generated screenshot, generated assets, WebAudio initialization after user gesture, and 390x844 portrait layout.
4. Reflection/self-improvement subagent
   - Write `ai/postmortems/day-026.md` after validation with what worked, what failed, generated-image inspection notes, audio verification, code-isolation confirmation, and whether generator/template/rubric improvements are justified.

## Acceptance criteria

- Static build passes.
- Code isolation is documented in QA/postmortem: no previous game implementation code was opened, inspected, copied, diffed, grepped, or adapted.
- Mode choice follows the cadence rule: Day 026 is real `3d` after Day 025 `2d`, with spatial firework arcs, altitude/depth lanes, target spheres, smoke volumes, wind drift, and fuse timing that matter mechanically.
- Desktop smoke passes.
- Mobile portrait smoke passes at about 390x844 with readable HUD/tutorial/commission card, usable 52px+ aim/action/pause/restart controls, no forced landscape canvas, and no tiny survival-critical rings/targets.
- Prompt is visible from gallery and release folder.
- `prompts/day-026.md` is copied exactly to `release/games/026/prompt.md` and `release/natsu/prompt.md`.
- `release/games/026/prompt.html` and `release/natsu/prompt.html` render the prompt in browser-readable semantic HTML with the standard prompt-page styling, not a raw Markdown `<pre>` dump.
- Public alias `release/natsu/index.html`, `release/natsu/prompt.html`, `release/natsu/screenshot.png`, and `release/natsu/assets/` exist and work.
- Gallery card for Day 026 shows prompt availability, generation duration, public `/natsu/` links, mode `3d`, and actual generated date.
- Screenshot exists at `release/games/026/screenshot.png` and is non-empty/readable. Prefer a readable desktop gameplay screenshot for gallery cards; mobile screenshots are QA evidence unless the design is intentionally portrait-card friendly.
- Image/source assets exist under `release/games/026/assets/source/` and optimized assets exist under `release/games/026/assets/`, or a documented emergency fallback exists.
- Every generated image has an inspection note in the postmortem or QA notes; interactive shell/ring/target/smoke visuals have verified background handling, orientation/pivot/crop, readability, and control-to-motion alignment.
- WebAudio initializes after user gesture and creates no autoplay console errors; audio is failsafe if unsupported and visual arc/burst cues remain playable muted.
- No console errors during desktop or mobile smoke. Add data-URI favicons to game and prompt pages if needed to avoid favicon request noise.
- Existing `release/games/001/**` through `release/games/025/**` from origin/main remain unchanged.
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
# Screenshot/static checks: verify release/games/026/screenshot.png, prompt.md, prompt.html, index.html, game.js, styles.css, release/natsu/index.html, release/natsu/prompt.html, release/natsu/screenshot.png, optimized assets, and source assets exist and are non-empty.
# Prompt copy check: cmp prompts/day-026.md release/games/026/prompt.md and cmp prompts/day-026.md release/natsu/prompt.md.
# Prompt HTML check: verify release/games/026/prompt.html has semantic h1/h2/list markup and a back-to-game link, not a raw Markdown dump inside <pre>, and no malformed ul > p or ol > p nodes.
# Browser smoke: open the local/static /natsu/ route and verify menu, tutorial, gameplay start, 3D sky render, aim controls, Charge Launch, Fuse Timing, Shell Color, Wind Fan, Slow Fuse control presence, ring-through feedback, burst/smoke/misfire feedback, pause, restart, prompt page, WebAudio after user gesture, no console errors.
# Mobile smoke: repeat at a portrait phone viewport such as 390x844 and verify playable aim/launch/fuse controls plus readable HUD/commission card/sky stage/controls.
# Static screenshot check: inspect release/games/026/screenshot.png and release/natsu/screenshot.png for non-empty readable game content; use vision to judge actual visual quality.
# Image QA: inspect every Imagegen2 source/optimized asset and document the actual inspection result in ai/postmortems/day-026.md.
# Docker/static smoke: build the Docker image locally, run it, curl /natsu/ and /natsu/prompt.html, then stop the container.
# Immutable guard: confirm no release/games folders from origin/main changed except new Day 026.
```
