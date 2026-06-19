# Day 010 Game Generation Prompt

## Game identity

- Day: 010
- Title: Kaze Windbell Atelier
- Slug: kaze-windbell-atelier
- Public route word: kaze
- Mode: 3D
- Genre: mobile-first 3D wind-routing / resonance puzzle arcade score chase
- Mood/style: breezy Japanese hilltop atelier at blue hour, glass furin windbells, braided cords, paper tanzaku strips, gold dusk light, teal wind ribbons, lacquered wood, calm craft turning into playful storm pressure

## Why this game today

The current generated series in `src/data/games.ts` ends with:

- Day 007 `2d`: bright seaside bento order-management and conveyor cooking.
- Day 008 `3d`: emerald moss shrine board with rotating root tiles, dew routing, and seedling basins.
- Day 009 `hybrid`: indigo paper-theater depth lanes, puppet posing, beat cue timing, and stage silhouettes.

The latest generated-mode streak is one `hybrid` game, so there is no active 2D streak. Day 010 deliberately returns to real `3D` spatial play to keep the cadence strong after the hybrid stage game. It must not repeat recent verbs: no cooking orders, no puppet cue timing, no moss/root tile board, no lane runner, no prism/beam alignment, and no vehicle/ring flight. The new verb set is: rotate suspended 3D windbells, catch and redirect visible gust ribbons through height-separated chime arcs, tune requested bell sequences, collect floating tanzaku charms, and calm storm crows with a Resonance Pulse.

Recent screenshot variety notes to avoid repeating:

- Day 007 used a warm food-counter background, horizontal conveyor lanes, pale cream panels, and bottom bento tray controls.
- Day 008 used a green 3D board centered in a forest floor scene with many square route tiles and bottom rotate/bridge buttons.
- Day 009 used a portrait indigo/washi puppet stage with near/mid/far horizontal rails, beat cue ring, and dark theatrical UI.

Day 010 should shift to a lighter open-air vertical composition: hanging bells at different depths/heights, curved wind ribbons, paper strips fluttering, glass highlights, and a hilltop sky/courtyard rather than a flat board or stage. The main play area should feel like a small 3D mobile diorama seen from a gentle front/isometric camera, with bells hanging in space and the player's choices changing actual wind paths through depth.

## Code isolation / no previous game source

The implementation must be written from scratch for this day. Do not open, inspect, copy, diff, grep, or adapt code from previous games, including old `apps/day-*` folders, old `release/games/NNN/` HTML/CSS/JS files, or old public alias folders. You may inspect previous metadata, prompts, postmortems, and screenshots only to avoid repeating concepts and visual identity. The new game's HTML/CSS/JS must come from this prompt and general web/game knowledge, not from earlier game implementations.

## Mode variety / 3D cadence

Inspection target: `src/data/games.ts` currently ends with Day 007 `2d`, Day 008 `3d`, and Day 009 `hybrid`. The latest generated mode streak is one `hybrid`; latest 2D streak is zero.

Mode decision: Day 010 is `3D`. It must implement real spatial gameplay, not decorative perspective:

- Use Three.js/WebGL or equivalent static-browser 3D rendering.
- Render a perspective windbell atelier with actual depth layers, height-separated hanging bells, curved visible gust ribbons, charm particles, storm crows, and camera depth cues.
- Gameplay must depend on 3D positions and rotations: each bell has yaw/tilt/tuning state that changes which incoming gust ribbon it catches and which depth/height outlet it sends sound/wind toward.
- Player actions must manipulate 3D objects: select a hanging bell, rotate its mouth/cord direction, tune its pitch family, and trigger Resonance Pulse.
- Portrait mobile is the default supported layout; no landscape gate.

## Design

- Objective: Tune a hilltop atelier of glass windbells by rotating and pitch-tuning hanging bells so glowing gust ribbons pass through requested bell sequences before the evening storm scatters the charms.
- Win condition: Complete three atelier commissions — Porch Breeze, Lantern Eaves, and Storm-Calm Finale — and reach 2700 points to trigger “Kaze Grand Chime”. After Grand Chime, continue into endless twilight commissions.
- Lose condition: The storm meter fills because too many gusts miss their requested bells, storm crows snatch tanzaku charms, or three fragile bells crack from wrong-pitch overloads.
- Core loop:
  1. Start on a title/menu screen with Day 010 badge, mode badge “3D”, public route `/kaze/`, best score, best Grand Chime time, tutorial, prompt link, and a large Start button.
  2. Show a compact 3D atelier frame: five to seven hanging furin bells arranged at near/mid/far depths and low/mid/high cords, with a wind source at one side and target lantern receivers at the other/top.
  3. A commission card requests a short sequence such as “Blue LOW → Amber MID → Silver HIGH” using both text/chips and icons.
  4. Visible gust ribbons enter the scene in pulses. They curve toward the nearest bell opening that is facing them; correctly aligned/tuned bells ring, redirect the ribbon, and fill the next requested note.
  5. Player taps/clicks a bell to select it, then uses large controls to rotate left/right, tilt high/low, and cycle pitch color/family. On desktop, keyboard shortcuts mirror those controls.
  6. Tanzaku charm bonuses drift through the scene; catching them with a correctly tuned wind path charges Resonance Pulse.
  7. Storm crows sweep through specific depth layers and can snatch charms or rattle bells. Resonance Pulse slows gust timing, scares crows, and briefly previews the ideal bell order.
  8. Pause/restart remain available throughout.
- 15+ minute play-value strategy:
  - Save best score, fastest Kaze Grand Chime time, longest perfect commission streak, highest endless twilight wave, and collected charm stamps in localStorage.
  - Include three authored commissions:
    - Porch Breeze: three bells, slow gusts, no crows, teaches selection/rotation/tuning and one height change.
    - Lantern Eaves: five bells, two height layers, first storm crow lane, drifting charm risk/reward, mixed pitch families.
    - Storm-Calm Finale: seven bells, near/mid/far depth changes, alternating gust entry points, faster crows, wrong-pitch overload pressure.
  - Deterministic Day 010 seed varies commission order, gust entry height, charm drift, crow lane timing, and bonus wind spirals while keeping the opening fair.
  - Mastery badges: complete Porch Breeze without a miss, ring 18 perfect notes in a row, trigger Grand Chime under 180 seconds, calm 12 storm crows, finish an endless commission with no cracked bells.
  - Strategic scoring rewards planning ahead: pre-align bell mouths, tune pitch before gust arrival, choose when a charm is worth diverting wind, and save Resonance Pulse for crowded finale patterns.
  - Endless twilight after Grand Chime adds more commission permutations, shorter gust windows, alternating depth lanes, and stronger crow pressure without shrinking mobile controls.
- Difficulty scaling:
  - 0-45 seconds: three bells, one gust source, broad catch cones, slow commission card, no instant penalties.
  - 45-110 seconds: five bells, two heights, first crows, two pitch families, charm drift.
  - 110-180 seconds: seven bells, three depth layers, mixed entry points, wrong-pitch overload, shorter setup time.
  - 180+ seconds/endless: denser sequences, faster gust pulses, more crow feints, higher combo multipliers, same 44px+ controls.
  - Keep mobile fair: large bell hit zones, clear selected-bell halo, thick wind ribbons, readable commission chips, 56px+ main action buttons, and no tiny collectible required for survival.
- Scoring/rewards:
  - Correct note in the requested sequence: +60 points times combo tier.
  - Perfect full commission with no missed gust: +240 points and +14% Resonance charge.
  - Tanzaku charm collected by a valid wind path: +85 points.
  - Storm crow calmed by Resonance Pulse: +110 points.
  - Complete an atelier commission: +430 points and repair one cracked bell if below max.
  - Kaze Grand Chime: +900 points and endless twilight unlock.
  - Missed gust: storm meter +8%, combo reset.
  - Wrong-pitch overload: selected bell crack stress +1, storm meter +5%, combo reset.
  - Crow snatches a charm: storm meter +6%; repeated crow hits can crack a bell.

## Controls and layout

- Desktop:
  - Mouse click: select a hanging windbell, commission chip, or start/pause overlay button.
  - A/D or Arrow Left/Right: rotate selected bell mouth left/right.
  - W/S or Arrow Up/Down: tilt selected bell outlet high/low.
  - Q/E: cycle selectable bells.
  - Z/X/C or 1/2/3: set pitch family (Blue low, Amber mid, Silver high) for selected bell.
  - Space or Enter: trigger Resonance Pulse when charged; also start from menu.
  - P: pause/resume.
  - R: restart current run.
- Mobile/touch:
  - Tap a large bell body/label to select it; selected bell gets a halo and helper card.
  - Use large Rotate ◀ / Rotate ▶ buttons to change yaw.
  - Use large Tilt High / Tilt Low buttons to change outlet height.
  - Use large Pitch button to cycle Blue/Amber/Silver.
  - Tap Resonance Pulse when charged.
  - Pause and Restart controls with 44px+ targets.
  - No virtual joystick. Interaction is tap-select plus large action buttons.
- Mobile layout/orientation:
  - Default target is portrait phone play around 390x844; do not require landscape.
  - Top: compact HUD with score, best, bells intact, storm meter, commission/chapter, combo, current commission, Resonance charge.
  - Upper center: commission card with requested note sequence, chip labels, progress ticks, and remaining gust window.
  - Center: 3D windbell atelier fills the main viewport with bells, gust ribbons, charms, crows, and target lanterns visible.
  - Bottom: large rotate, tilt, pitch, Resonance, pause, and restart controls; controls must not cover selected bell or active wind ribbon endpoints.
  - Tutorial must fit on the first portrait screen; optional details may be collapsible but objective, bell selection, rotate/tilt/tune, gust routing, crows, Resonance, pause/restart must be visible.
  - Commission requests must combine color, text labels, icons, and height chips so hue alone is not required.

## Menu and tutorial

Implement these states:

1. Title screen
   - Shows title “Kaze Windbell Atelier”.
   - Shows Day 010 badge, mode badge “3D”, public route `/kaze/`, best score, best Grand Chime time if available, and a prompt link.
   - Shows a large Start button and visible tutorial panel by default.
2. Tutorial text
   - Objective: “Rotate and tune hanging windbells so gust ribbons ring the requested notes.”
   - Bell selection: tap/click a bell, then rotate/tilt/tune with buttons or keys.
   - Gust routing: wind follows the open bell mouth and redirects through depth/height layers.
   - Pitch: commission chips require Blue low, Amber mid, and Silver high note families.
   - Hazards: missed gusts raise storm; storm crows can snatch charms and crack rattled bells.
   - Resonance Pulse: slows gusts, scares crows, and previews the next good bell when charged.
   - Pause/restart: P/R on desktop or visible buttons on mobile.
3. In-game HUD
   - Score, best score, intact bells, storm meter, commission name, combo, elapsed time, current sequence, selected bell, Resonance charge.
   - Pause/restart controls visible or immediately accessible.
4. Selected-bell helper overlay
   - Non-blocking helper near the selected bell showing yaw arrow, tilt, pitch family, and likely next catch/outlet.
   - Must not cover active gust ribbons, target lanterns, or bottom controls on mobile.
5. Pause overlay
   - Resume, restart, tutorial reminder, controls summary, prompt link.
6. Game-over/results overlay
   - Final score, best score, commission reached, Grand Chime status, perfect note streak, mastery badges, restart button.
7. Kaze Grand Chime banner
   - Trigger once per run after all three commissions and 2700 score.
   - Non-blocking gold/teal wind spiral, all bells ring, tanzaku strips rise, crows scatter; endless twilight continues after the banner fades.

## Assets

Prefer Imagegen2 (`openai/gpt-image-2`) for final visual art: windbell keeper mascot, hilltop atelier background, furin/icon sheet, and key decorative pieces. Three.js primitives may render bell glass bodies, cords, wind ribbons, lantern receivers, charm particles, crows, hit volumes, guide arrows, and UI chrome. Procedural code may crop, resize, alpha-clean, atlas-pack, optimize, animate, or place generated assets; it should not create final character/background/icon art from scratch unless Imagegen2 is unavailable after a real attempt.

Archive source generated art under `release/games/010/assets/source/` and use optimized playable copies under `release/games/010/assets/`. Also copy optimized playable assets into `apps/day-010-kaze-windbell-atelier/assets/` and the public alias `release/kaze/assets/`.

For mobile-first crop safety: keep important content centered, leave 12-16% safe margins, avoid baked-in text, avoid watermarks, avoid fake UI labels, avoid tiny glass details that disappear at final in-game size, and keep high-contrast silhouettes for mascot/charm/crow shapes.

Generate or provide at least these final art assets:

1. Windbell keeper mascot/source charm
   - Target: transparent PNG if possible, square source, final optimized texture around 512x512 or 256x256.
   - Archive path: `release/games/010/assets/source/kaze-keeper-source.png`
   - Optimized path: `release/games/010/assets/kaze-keeper.png`
   - Imagegen2 prompt: “A charming Japanese windbell atelier keeper mascot for a mobile 3D browser puzzle arcade game, small shrine artisan with teal haori, braided cord, glass furin bell, paper tanzaku charm, breezy gold and cyan accents, centered readable silhouette, transparent or plain light sky background, no text, no watermark, sprite-friendly, high contrast at small size.”
   - Aspect ratio: square.
2. Hilltop windbell atelier background source
   - Target: portrait-friendly background/skybox texture suitable behind a 3D hanging-bell diorama with an open readable center.
   - Archive path: `release/games/010/assets/source/kaze-atelier-source.png`
   - Optimized path: `release/games/010/assets/kaze-atelier.png`
   - Imagegen2 prompt: “A breezy Japanese hilltop windbell atelier at blue hour for a portrait mobile 3D puzzle game, wooden eaves, hanging glass furin bells, paper tanzaku strips, distant town lights, soft gold lanterns, teal evening sky, open readable center area for 3D gameplay, crop-safe for phone portrait, no characters, no text, no watermark.”
   - Aspect ratio: portrait.
3. Windbell icon sheet source
   - Target: square icon sheet for UI and object decals.
   - Archive path: `release/games/010/assets/source/kaze-icons-source.png`
   - Optimized path: `release/games/010/assets/kaze-icons.png`
   - Imagegen2 prompt: “Small readable icon sheet for a Japanese windbell atelier puzzle game: blue low note bell, amber mid note bell, silver high note bell, gust ribbon, tanzaku paper charm, storm crow hazard, cracked bell, Resonance Pulse spiral, lantern receiver, perfect chime badge, Grand Chime stamp, transparent or plain teal sky background, high contrast, no text, no watermark.”
   - Aspect ratio: square.

If Imagegen2 is unavailable or fails after a real attempt, create a clearly labeled emergency fallback using simple SVG/canvas/Three.js materials, document the failure in `ai/postmortems/day-010.md`, and still keep source/fallback files under the same asset paths.

### Mandatory generated-image QA

For every generated image, include a real inspection step after generation and before integration:

- Analyze the actual generated file visually, not just the prompt text.
- For the windbell keeper mascot, verify transparent/cutout quality or clean background removal, readable silhouette, centered pivot, crop margins, no unwanted text/watermarks, and stable upright orientation.
- Verify control-to-motion alignment in-game: Rotate left/right must visibly rotate the selected bell mouth in the expected direction, Tilt High/Low must move the outlet guide up/down, Pitch must update the selected bell color/label, and Resonance Pulse feedback must align with wind/crow behavior.
- For the background, verify the center play area remains readable after portrait mobile crop and does not hide bells, wind ribbons, commission cards, crows, charms, or action controls.
- For the icon sheet, verify pitch icons, charms, crows, cracked-bell warning, Resonance, and Grand Chime stamp are distinct at final HUD/button size and cannot be confused.
- If inspection finds a problem, regenerate or post-process the image and inspect again. Do not ship broken visual assets just because tests pass.

## Prompt page output

The archived `release/games/010/prompt.html` must be a consistent rendered HTML page, not raw Markdown pasted into a `<pre>` block. It should include:

- A clear `<title>` and `<h1>` using `Day 010 Game Generation Prompt`.
- A back-to-game link near the top.
- Semantic rendered sections (`h2`, `h3`, `ul/ol/li`, `p`, `pre/code` only for actual code/commands).
- The same readable prompt-page style pattern across days so prompt pages feel like one system.

## Subagents to dispatch

1. Implementation subagent
   - Build the static 3D game under `apps/day-010-kaze-windbell-atelier/`.
   - Integrate it into immutable release output under `release/games/010/`.
   - Create the public playable route under `release/kaze/`.
   - Use static HTML/CSS/JS with Three.js/WebGL and no backend.
   - The public alias must be self-contained or asset paths must be alias-safe.
   - If vendoring `three.module*.js`, also copy the matching `three.core*.js` beside it in the app, release archive, and `/kaze/` alias assets.
2. Asset/polish subagent
   - Generate/prepare Imagegen2 assets, archive source files, optimize playable copies, inspect generated images, and tune mobile readability/game feel.
3. QA/browser/mobile subagent
   - Run desktop and mobile smoke checks, verify no console errors, verify menu/tutorial/objective/controls/restart/pause, prompt links, 3D bell interaction, bell selection, rotate/tilt/pitch controls, Resonance Pulse, wind routing, crows/storm, generated screenshot, generated assets, and 390x844 portrait layout.
4. Reflection/self-improvement subagent
   - Write `ai/postmortems/day-010.md` after validation with what worked, what failed, generated-image inspection notes, code-isolation confirmation, and whether generator/template/rubric improvements are justified.

## Acceptance criteria

- Static build passes.
- Code isolation is documented in QA/postmortem: no previous game implementation code was opened, inspected, copied, diffed, grepped, or adapted.
- Mode choice follows the cadence rule: Day 010 is real `3D` spatial gameplay with actual depth/height separated bells, wind ribbons, object rotations, pitch states, crows/charms, and camera depth cues.
- Desktop smoke passes.
- Mobile portrait smoke passes at about 390x844 with readable HUD/tutorial/commission card, usable tap/rotate/tilt/pitch/resonance controls, no forced landscape canvas, and 44px+ controls.
- Prompt is visible from gallery and release folder.
- `prompts/day-010.md` is copied exactly to `release/games/010/prompt.md` and `release/kaze/prompt.md`.
- `release/games/010/prompt.html` and `release/kaze/prompt.html` render the prompt in browser-readable semantic HTML with the standard prompt-page styling, not a raw Markdown `<pre>` dump.
- Public alias `release/kaze/index.html`, `release/kaze/prompt.html`, `release/kaze/screenshot.png`, and `release/kaze/assets/` exist and work.
- Gallery card for Day 010 shows prompt availability, generation duration, public `/kaze/` links, mode `3d`, and actual generated date.
- Screenshot exists at `release/games/010/screenshot.png` and is non-empty/readable.
- Image/source assets exist under `release/games/010/assets/source/` and optimized assets exist under `release/games/010/assets/`, or a documented emergency fallback exists.
- Every generated image has an inspection note in the postmortem or QA notes; moving/interactive bell/wind/crow visuals have verified cutout/background handling where relevant, orientation/pivot/crop, readability, and control-to-motion alignment.
- No console errors during desktop or mobile smoke.
- Existing `release/games/001/**` through `release/games/009/**` from origin/main remain unchanged.
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
# Screenshot/static checks: verify release/games/010/screenshot.png, prompt.md, prompt.html, index.html, game.js, styles.css, release/kaze/index.html, release/kaze/prompt.html, release/kaze/screenshot.png, optimized assets, and source assets exist and are non-empty.
# Prompt copy check: cmp prompts/day-010.md release/games/010/prompt.md and cmp prompts/day-010.md release/kaze/prompt.md.
# Prompt HTML check: verify release/games/010/prompt.html has semantic h1/h2/list markup and a back-to-game link, not a raw Markdown dump inside <pre>, and no malformed ul > p or ol > p nodes.
# Browser smoke: open the local/static /kaze/ route and verify menu, tutorial, gameplay start, bell selection, rotate controls, tilt controls, pitch cycling, Resonance control presence, pause, restart, prompt link, no console errors.
# Mobile smoke: repeat at a portrait phone viewport such as 390x844 and verify playable tap/rotate/tilt/pitch controls and readable HUD/commission/scene.
# Static screenshot check: inspect release/games/010/screenshot.png for non-empty readable game content.
# Image QA: inspect every generated Imagegen2 source/optimized asset and document the actual inspection result in ai/postmortems/day-010.md.
# Docker/static smoke: build the Docker image locally, run it, curl /kaze/ and /kaze/prompt.html, then stop the container.
# Immutable guard: confirm no release/games folders from origin/main changed except new Day 010.
```
