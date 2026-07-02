# Day 020 Game Generation Prompt

## Game identity

- Day: 020
- Title: Umi Pearl Kelp Cartographer
- Slug: umi-pearl-kelp-cartographer
- Public route word: umi
- Mode: 3D
- Genre: mobile-first 3D underwater navigation / oxygen-routing arcade score chase
- Mood/style: quiet luminous Japanese coastal cove below the surface, teal-blue depth fog, swaying kelp towers, pearl-lit shrine buoys, coral torii arches, ama-diver charm, moon-jelly hazards, bubble trails, polished shell UI, gentle sonar feedback; real spatial depth/oxygen play rather than matsuri rhythm lanes, daruma tilt mazes, silverweb tension, pottery sculpting, bamboo water-routing, origami folding, rainy sheltering, snow stacking, textile stamping, cooking, windbell tuning, rail running, or bird/glider delivery.

## Why this game today

The generated series currently ends with:

- Day 016 `3d`: pottery wheel sculpting with ring selection, vessel profile matching, glaze/carve placement, wobble/crack risk, and kiln heat controls.
- Day 017 `hybrid`: moonlit silverweb tension puzzle with near/mid/far strand layers, dew-star catching, moth fray, pluck/mend, and cool blue canopy visuals.
- Day 018 `3d`: dawn daruma tilt labyrinth with a raised board, inertia, torii gates, ema plaques, bells, ink pools, and offering bowl routing.
- Day 019 `2d`: blue-hour matsuri rhythm-routing with Don/Ka/Hi/Ya taiko pads, lantern gates, carrier routing, call-and-response, and WebAudio timing.

The latest generated mode streak is one `2d`, so the cadence allows any mode, but Day 020 deliberately chooses real `3D` to avoid following the rhythm day with another flat lane/pad game. The new verb set is spatial and survival-oriented: dive through a vertical kelp canyon, chart pearl beacons, ride/avoid currents, manage oxygen, surface at air bells, place guide-shell markers, and complete route constellations in depth.

Recent screenshot/visual variety notes to avoid repeating:

- Day 016 used warm amber pottery studio lighting, a centered clay vessel, ring controls, kiln heat, and brown/ash-blue craft textures.
- Day 017 used cool midnight cedar canopy, circular depth rings, silver silk strands, labeled anchor knots, moon-moth hazards, and bottom web-action buttons.
- Day 018 used dawn oranges, a tan raised maze board, red torii rails, small rolling daruma, tilt controls, and shrine terrace background.
- Day 019 used saturated indigo matsuri festival street, vertical rhythm lanes, fireworks, lantern strings, taiko pad buttons, mascot art, and timing hit band.

Day 020 should shift to an underwater cove: teal/ultramarine gradients, kelp silhouettes with parallax, pearl glints, coral torii shapes, soft bioluminescent shell controls, bubble trails, oxygen rings, and a gentle ama-diver/sea-spirit mascot. Avoid drum pads, vertical note highways, wooden maze ramps, web circles/anchors, clay rings, bamboo canal tiles, paper folds, umbrellas, snow blocks, kimono cloth panels, wind ribbons, rail vehicles, generic spaceship movement, or flat aquatic tile-routing.

## Code isolation / no previous game source

The implementation must be written from scratch for this day. Do not open, inspect, copy, diff, grep, or adapt code from previous games, including old `apps/day-*` folders, old `release/games/NNN/` HTML/CSS/JS files, or old public alias folders. You may inspect previous metadata, prompts, postmortems, and screenshots only to avoid repeating concepts and visual identity. The new game's HTML/CSS/JS must come from this prompt and general browser/Three.js game knowledge, not from earlier game implementations.

## Mode variety / 3D cadence

Inspection target: `src/data/games.ts` currently ends with Day 016 `3d`, Day 017 `hybrid`, Day 018 `3d`, and Day 019 `2d`. The latest generated-mode streak is one `2d`; latest 2D streak is one.

Mode decision: Day 020 is `3D`. It must implement real spatial gameplay, not decorative perspective:

- Use Three.js/WebGL or equivalent static-browser 3D rendering.
- Render a depth-visible underwater kelp canyon with a player diver/charm, pearl beacons, current ribbons, kelp gates, air bells, jellyfish hazards, shrine buoys, and route markers.
- Gameplay must depend on 3D state: x/y/z position, depth, forward lane, oxygen level, current direction, buoy visibility, beacon ordering, hazard distance, and surface/air-bell timing.
- Player actions must manipulate the 3D system: steer left/right/up/down, pulse forward, brake/drift, drop guide-shell markers, collect pearls, surface/refill at air bells, and trigger a Sonar Bloom that reveals hidden beacons.
- Portrait mobile is the default supported layout; no landscape gate.

## Design

- Objective: Guide a tiny ama-diver pearl cartographer through a layered underwater kelp canyon, collect requested pearl beacons, place guide-shell markers along safe routes, refill oxygen at air bells, and draw three glowing constellation maps for the coastal shrine.
- Win condition: Complete three dive maps — Shallow Shell Path, Kelp Torii Channel, and Moon-Jelly Trench — while reaching 3400 points to trigger “Umi Pearl Atlas”. After the atlas, continue into endless dive commissions.
- Lose condition: Oxygen reaches 0%, three shell-heart charms crack, too many pearls are lost to moon-jelly shocks, or the dive timer expires before required beacons and markers are charted.
- Core loop:
  1. Start on a title/menu screen with Day 020 badge, mode badge “3D”, public route `/umi/`, best score, best Pearl Atlas time, tutorial, prompt link, and a large Start button.
  2. Show a portrait-friendly 3D underwater cove/canyon. The player diver/charm floats near the lower center, looking into depth. Pearl beacons glimmer at different x/y/z positions, kelp gates sway, current ribbons bend bubbles, air bells pulse with oxygen halos, and jellyfish drift through near/mid/far depth lanes.
  3. A dive-map card requests goals, for example: “Collect 3 moon pearls, place 2 guide shells, refill at Bell A, finish with oxygen above 45%.”
  4. Player steers through the canyon with large direction buttons or keyboard. Short forward pulses move deeper into the scene; Up/Down change depth level; Left/Right dodge kelp and align beacons. Brake/Drift slows movement and preserves oxygen.
  5. Pearl beacons attach to the diver as glowing trail dots. Collecting the requested order draws route lines on a mini pearl atlas. Wrong-order pearls are allowed but lower combo and may lure jellyfish.
  6. Guide-shell markers can be dropped in safe eddies. A correct marker near a shrine buoy extends the safe route and awards oxygen savings; careless markers in current ribbons drift away.
  7. Air bells refill oxygen if approached cleanly. Sonar Bloom, charged by clean pearl chains, briefly reveals hidden beacons, current arrows, and jellyfish depth silhouettes.
  8. Completing a dive map lights a coastal shrine buoy, awards points, repairs one shell-heart if needed, and unlocks stronger currents/deeper gates.
  9. Pause/restart remain available throughout.
- 15+ minute play-value strategy:
  - Save best score, fastest Umi Pearl Atlas time, longest clean pearl chain, highest endless dive, most guide-shell markers placed correctly, best oxygen finish, fewest jellyfish shocks, and collected atlas badges in localStorage.
  - Include three authored dive maps:
    - Shallow Shell Path: gentle currents, three bright pearl beacons, one air bell, two obvious guide-shell eddies, no instant oxygen loss during the first guided move.
    - Kelp Torii Channel: adds vertical depth changes, coral torii gates, two pearl colors, kelp sway timing, first jellyfish lane, and Brake/Drift tutorial.
    - Moon-Jelly Trench: deeper blue fog, hidden beacons revealed by Sonar Bloom, crossing current ribbons, two air bells, stricter oxygen route, and jellyfish depth silhouettes.
  - Deterministic Day 020 seed varies beacon positions, current ribbon bends, air-bell timing, hidden pearl order, kelp gate sway, jellyfish patrol paths, and endless constraints while keeping the opening fair.
  - Mastery badges: finish Shallow Shell Path without oxygen warning, trigger Pearl Atlas under 215 seconds, collect 18 requested pearls in clean order, place 12 correct guide-shell markers, finish a dive above 80% oxygen, complete an endless dive with all shell-hearts.
  - Strategic scoring rewards planning: drift before tight kelp gates, follow current ribbons only when they point toward air bells, save Sonar Bloom for hidden-beacon sections, drop shells in still eddies, surface/refill early rather than chasing a far pearl with low oxygen, and avoid wrong-order pearls when jellyfish are close.
  - Endless mode after Pearl Atlas adds deeper fog, more crossing currents, rarer air bells, alternating pearl orders, moving kelp gates, and faster jellyfish without shrinking touch controls.
- Difficulty scaling:
  - 0-45 seconds: broad lanes, slow drift, visible beacon order, generous oxygen, one jellyfish-free route, one large air bell.
  - 45-125 seconds: vertical depth changes, first current ribbon, two pearl colors, kelp gate timing, one jellyfish lane.
  - 125-215 seconds: hidden beacons, stronger currents, two air bells, coral gate alignment, stricter oxygen, multiple jellyfish depth lanes.
  - 215+ seconds/endless: denser fog, shorter air-bell windows, more hidden beacons, same readable controls.
  - Keep mobile fair: diver, pearl beacons, air bells, jellyfish, current arrows, and guide-shell marker previews must be large and readable at 390x844; controls must be 56px+ primary buttons; no tiny hazard required for survival.
- Scoring/rewards:
  - Requested pearl collected in order: +95 points times combo tier.
  - Wrong-order pearl collected safely: +30 points, combo soft-reset.
  - Guide-shell marker placed in a safe eddy: +170 points and small oxygen refund.
  - Clean air-bell refill: +220 points and Sonar Bloom charge.
  - Jellyfish avoided at close range: +90 points.
  - Dive map complete above oxygen target: +540 points and repair one shell-heart if below max.
  - Perfect no-shock dive: +680 points.
  - Umi Pearl Atlas: +1250 points and endless dive commissions unlock.
  - Jellyfish shock: shell-heart damage, oxygen -12%, combo reset.
  - Kelp collision/current slam: oxygen -5% and drift penalty.
  - Oxygen empty: shell-heart damage and respawn at last air bell if hearts remain.

## Controls and layout

- Desktop:
  - Mouse click/tap: press direction/action buttons, start/pause overlay button, prompt link, or explainable HUD chips.
  - Arrow keys or WASD: steer left/right/up/down through the underwater 3D space.
  - Space or Enter: forward Pulse / start from menu.
  - Shift: Brake/Drift while held, or Sonar Bloom if charged when tapped with a control button.
  - G: drop Guide Shell marker.
  - B: trigger Sonar Bloom when charged.
  - P: pause/resume.
  - R: restart current run.
- Mobile/touch:
  - Use large Steer Up, Steer Left, Steer Right, Steer Down buttons around or below the playfield.
  - Use large Pulse, Brake/Drift, Guide Shell, Sonar Bloom, Pause, and Restart buttons.
  - Optional swipe steering can be supported, but visible buttons are mandatory.
  - Tap pearl/air/jellyfish/current chips for short explanations.
  - No tiny virtual joystick. Interaction is directional steering, pulse, brake/drift, guide shell, sonar, pause/restart.
- Mobile layout/orientation:
  - Default target is portrait phone play around 390x844; do not require landscape.
  - Top: compact underwater HUD with score, best, shell-hearts, oxygen ring, dive map, combo, elapsed time, and current depth. Use pearl/shell chips and oxygen rings, not recent matsuri drum, shrine maze, web, pottery, or bamboo chip layouts.
  - Below top: dive-map card with requested pearl order, guide-shell target, air-bell requirement, oxygen target, and progress ticks.
  - Center: 3D underwater canyon with diver/charm, pearl beacons, kelp gates, current ribbons, air bells, guide-shell previews, jellyfish silhouettes, route trail, and depth fog. It must remain playable without zooming.
  - Bottom: status helper plus large steering/action controls. Controls must not cover the diver, air bell, active pearl route, or hazard warnings.
  - Tutorial must fit on the first portrait screen; optional details may be collapsible but objective, oxygen, steering, Pulse, Brake/Drift, pearl order, guide shells, air bells, Sonar Bloom, jellyfish, pause/restart must be visible.
  - Requests must combine text, symbols, shapes, labels, depth bands, and line styles so hue alone is not required.

## Menu and tutorial

Implement these states:

1. Title screen
   - Shows title “Umi Pearl Kelp Cartographer”.
   - Shows Day 020 badge, mode badge “3D”, public route `/umi/`, best score, best Pearl Atlas time if available, and a prompt link.
   - Shows a large Start button and visible tutorial panel by default.
   - Notes: “Audio starts after you press Start; visual sonar/oxygen cues work if muted.”
2. Tutorial text
   - Objective: “Chart pearl routes through the kelp canyon, refill oxygen at air bells, and complete the Umi Pearl Atlas.”
   - Steering: use arrows/WASD or big touch buttons to steer through 3D depth; Pulse moves deeper, Brake slows drift.
   - Pearls: collect requested pearls in order to draw the atlas route.
   - Guide Shells: drop markers in calm eddies near shrine buoys for oxygen savings.
   - Air/Oxygen: refill at air bells before the oxygen ring empties.
   - Sonar Bloom: reveal hidden beacons, currents, and jellyfish depth lanes when charged.
   - Pause/restart: P/R on desktop or visible buttons on mobile.
3. In-game HUD
   - Score, best score, shell-hearts, oxygen, dive map name, combo, elapsed time, current depth, requested pearl order, collected pearls, guide-shell count, air-bell status, Sonar Bloom charge, latest warning.
   - Pause/restart controls visible or immediately accessible.
4. Status helper
   - Non-blocking helper showing current depth, oxygen advice, next requested pearl, current direction/drift, nearest air bell, current ribbon warning, and guide-shell readiness.
   - Must not cover the canyon or bottom controls on mobile.
5. Pause overlay
   - Resume, restart, tutorial reminder, controls summary, audio/mute toggle, prompt link.
6. Game-over/results overlay
   - Final score, best score, dive reached, Pearl Atlas status, clean pearl chain, oxygen finish, guide shells placed, jellyfish shocks, mastery badges, restart button.
7. Umi Pearl Atlas banner
   - Trigger once per run after all three dive maps and 3400 score.
   - Non-blocking celebration: pearl routes connect into a glowing coastal constellation, kelp bends aside, shrine buoys shine, bubbles spiral upward, and the diver bows; endless dive commissions continue after the banner fades.

## Assets

Prefer Imagegen2 (`openai/gpt-image-2`) for final visual art: ama-diver pearl cartographer mascot, underwater kelp-cove background, pearl/jellyfish/shell/oxygen icon sheet, and decorative shrine buoy/coral torii pieces. Three.js primitives may render the interactive 3D canyon, kelp planes, pearl beacons, bubbles, current ribbons, hit volumes, guide-shell markers, route trails, fog, and UI chrome. Procedural code may crop, resize, alpha-clean, atlas-pack, optimize, animate, or place generated assets; it should not create final character/background/icon art from scratch unless Imagegen2 is unavailable after a real attempt.

Archive source generated art under `release/games/020/assets/source/` and use optimized playable copies under `release/games/020/assets/`. Also copy optimized playable assets into `apps/day-020-umi-pearl-kelp-cartographer/assets/` and the public alias `release/umi/assets/`.

For mobile-first crop safety: keep important content centered, leave 12-16% safe margins, avoid baked-in text, avoid watermarks, avoid fake UI labels, avoid tiny fish/coral details that disappear at final in-game size, and keep diver/pearl/air-bell/jellyfish/current silhouettes distinct against teal underwater backgrounds.

Generate or provide at least these final art assets:

1. Ama-diver pearl cartographer mascot/source charm
   - Target: transparent PNG if possible, square source, final optimized texture around 512x512 or 256x256.
   - Archive path: `release/games/020/assets/source/umi-diver-source.png`
   - Optimized path: `release/games/020/assets/umi-diver.png`
   - Imagegen2 prompt: “A charming friendly Japanese ama-diver pearl cartographer mascot for a mobile 3D underwater browser arcade game, small sea-spirit diver with indigo swim wrap, pearl lantern satchel, shell compass, tiny bubble trail, gentle smile, centered readable silhouette, transparent or plain pale aqua background, no text, no watermark, sprite-friendly, high contrast at small size, suitable as a floating game piece.”
   - Aspect ratio: square.
2. Underwater kelp cove / coral torii background source
   - Target: portrait-friendly background suitable behind a 3D underwater canyon with open readable center.
   - Archive path: `release/games/020/assets/source/umi-kelp-cove-source.png`
   - Optimized path: `release/games/020/assets/umi-kelp-cove.png`
   - Imagegen2 prompt: “A luminous underwater Japanese coastal cove for a portrait mobile 3D pearl-diving game, tall swaying kelp towers at the sides, coral torii arches, shrine buoys glowing with pearls, teal-blue depth fog, sun rays from the surface, gentle bubble trails, open readable center area for a 3D diver route, crop-safe for phone portrait, no characters, no text, no watermark.”
   - Aspect ratio: portrait.
3. Pearl, shell, oxygen, current, jellyfish, and UI icon sheet source
   - Target: square icon sheet for objectives, hazards, rewards, and UI decals.
   - Archive path: `release/games/020/assets/source/umi-icons-source.png`
   - Optimized path: `release/games/020/assets/umi-icons.png`
   - Imagegen2 prompt: “Small readable icon sheet for a Japanese underwater pearl cartography game: white moon pearl, blue tide pearl, gold shrine pearl, guide shell marker, oxygen bubble ring, air bell, teal current arrow, moon jellyfish hazard, kelp gate, coral torii buoy, sonar bloom seal, shell-heart charm, Umi Pearl Atlas emblem, transparent or plain pale aqua background, high contrast, no text, no watermark, generous margins so no icons are cut off.”
   - Aspect ratio: square.

If Imagegen2 is unavailable or fails after a real attempt, create a clearly labeled emergency fallback using simple SVG/canvas/Three.js underwater silhouettes, document the failure in `ai/postmortems/day-020.md`, and still keep source/fallback files under the same asset paths.

### Mandatory generated-image QA

For every generated image, include a real inspection step after generation and before integration:

- Analyze the actual generated file visually, not just the prompt text.
- For the diver mascot, verify transparent/cutout quality or clean background handling, readable friendly silhouette, centered pivot, crop margins, no unwanted text/watermarks, stable upright orientation, and that the body/compass pose does not imply a wrong forward direction.
- Verify control-to-motion alignment in-game: Steer Up/Down/Left/Right must move in the expected screen/depth directions, Pulse must move deeper/forward, Brake/Drift must visibly slow the diver, Guide Shell must drop at the current route position, Sonar Bloom must reveal hidden items, air bells must refill oxygen, and jellyfish/kelp hazards must affect intended areas.
- For the background, verify the center play area remains readable after portrait mobile crop and does not hide the diver, pearls, air bells, jellyfish, current arrows, dive-map card, helper, or controls.
- For the icon sheet, verify pearl colors/types, guide shell, oxygen, air bell, current arrow, jellyfish, kelp gate, coral torii buoy, sonar seal, shell-heart, and atlas emblem are distinct at final HUD/button size and cannot be confused.
- If inspection finds a problem, regenerate or post-process the image and inspect again. Do not ship broken visual assets just because tests pass.

## Audio and game feel

Because oxygen, sonar, bubbles, and air bells are central to the theme, include lightweight WebAudio cues initialized only after a user gesture:

- Soft bubble pop when collecting a pearl, with pitch varying by pearl type.
- Low whoosh when a current ribbon catches the diver.
- Clear glassy chime when refilling at an air bell.
- Muted zap/warble when a jellyfish shock occurs.
- Brief sonar ping sequence when Sonar Bloom reveals hidden beacons.
- Rising pearl arpeggio when Umi Pearl Atlas triggers.

Audio must not block play if WebAudio is unavailable. Verify no autoplay errors: audio context should be created/resumed only after Start or another user interaction. Include a visible mute toggle in pause/results or HUD.

## Prompt page output

The archived `release/games/020/prompt.html` must be a consistent rendered HTML page, not raw Markdown pasted into a `<pre>` block. It should include:

- A clear `<title>` and `<h1>` using `Day 020 Game Generation Prompt`.
- A back-to-game link near the top.
- Semantic rendered sections (`h2`, `h3`, `ul/ol/li`, `p`, `pre/code` only for actual code/commands).
- The same readable prompt-page style pattern across days so prompt pages feel like one system.

## Subagents to dispatch

1. Implementation subagent
   - Build the static 3D game under `apps/day-020-umi-pearl-kelp-cartographer/`.
   - Integrate it into immutable release output under `release/games/020/`.
   - Create the public playable route under `release/umi/`.
   - Use static HTML/CSS/JS with Three.js/WebGL and no backend.
   - The public alias must be self-contained or asset paths must be alias-safe.
   - If vendoring `three.module*.js`, also copy the matching `three.core*.js` beside it in the app, release archive, and `/umi/` alias assets.
2. Asset/polish subagent
   - Generate/prepare Imagegen2 assets, archive source files, optimize playable copies, inspect generated images, and tune mobile readability/game feel.
3. QA/browser/mobile subagent
   - Run desktop and mobile smoke checks, verify no console errors, verify menu/tutorial/objective/controls/restart/pause, prompt links, 3D underwater render, steer controls, Pulse, Brake/Drift, Guide Shell, Sonar Bloom control presence, pearl collection, oxygen/air-bell feedback, current and jellyfish hazard feedback, generated screenshot, generated assets, WebAudio initialization after user gesture, and 390x844 portrait layout.
4. Reflection/self-improvement subagent
   - Write `ai/postmortems/day-020.md` after validation with what worked, what failed, generated-image inspection notes, audio verification, code-isolation confirmation, and whether generator/template/rubric improvements are justified.

## Acceptance criteria

- Static build passes.
- Code isolation is documented in QA/postmortem: no previous game implementation code was opened, inspected, copied, diffed, grepped, or adapted.
- Mode choice follows the cadence rule: Day 020 is real `3d` after Day 019 `2d`, with spatial underwater gameplay where depth, oxygen, current direction, guide-shell placement, air bells, pearl ordering, and hazards matter.
- Desktop smoke passes.
- Mobile portrait smoke passes at about 390x844 with readable HUD/tutorial/dive-map card, usable 56px+ steering/action/pause/restart controls, no forced landscape canvas, and no tiny survival-critical pearls/hazards.
- Prompt is visible from gallery and release folder.
- `prompts/day-020.md` is copied exactly to `release/games/020/prompt.md` and `release/umi/prompt.md`.
- `release/games/020/prompt.html` and `release/umi/prompt.html` render the prompt in browser-readable semantic HTML with the standard prompt-page styling, not a raw Markdown `<pre>` dump.
- Public alias `release/umi/index.html`, `release/umi/prompt.html`, `release/umi/screenshot.png`, and `release/umi/assets/` exist and work.
- Gallery card for Day 020 shows prompt availability, generation duration, public `/umi/` links, mode `3d`, and actual generated date.
- Screenshot exists at `release/games/020/screenshot.png` and is non-empty/readable. Prefer a readable desktop gameplay screenshot for gallery cards; mobile screenshots are QA evidence unless the design is intentionally portrait-card friendly.
- Image/source assets exist under `release/games/020/assets/source/` and optimized assets exist under `release/games/020/assets/`, or a documented emergency fallback exists.
- Every generated image has an inspection note in the postmortem or QA notes; interactive diver/canyon visuals have verified background handling, orientation/pivot/crop, readability, and control-to-motion alignment.
- WebAudio initializes after user gesture and creates no autoplay console errors; audio is failsafe if unsupported and visual oxygen/sonar cues remain playable muted.
- No console errors during desktop or mobile smoke. Add data-URI favicons to game and prompt pages if needed to avoid favicon request noise.
- Existing `release/games/001/**` through `release/games/019/**` from origin/main remain unchanged.
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
# Screenshot/static checks: verify release/games/020/screenshot.png, prompt.md, prompt.html, index.html, game.js, styles.css, release/umi/index.html, release/umi/prompt.html, release/umi/screenshot.png, optimized assets, and source assets exist and are non-empty.
# Prompt copy check: cmp prompts/day-020.md release/games/020/prompt.md and cmp prompts/day-020.md release/umi/prompt.md.
# Prompt HTML check: verify release/games/020/prompt.html has semantic h1/h2/list markup and a back-to-game link, not a raw Markdown dump inside <pre>, and no malformed ul > p or ol > p nodes.
# Browser smoke: open the local/static /umi/ route and verify menu, tutorial, gameplay start, 3D render, Steer Up/Left/Right/Down, Pulse, Brake/Drift, Guide Shell, Sonar Bloom control presence, pearl collection, oxygen/air-bell feedback, current and jellyfish hazard feedback, pause, restart, prompt page, WebAudio after user gesture, no console errors.
# Mobile smoke: repeat at a portrait phone viewport such as 390x844 and verify playable tap controls and readable HUD/dive-map/canyon playfield.
# Static screenshot check: inspect release/games/020/screenshot.png and release/umi/screenshot.png for non-empty readable game content; use vision to judge actual visual quality.
# Image QA: inspect every Imagegen2 source/optimized asset and document the actual inspection result in ai/postmortems/day-020.md.
# Docker/static smoke: build the Docker image locally, run it, curl /umi/ and /umi/prompt.html, then stop the container.
# Immutable guard: confirm no release/games folders from origin/main changed except new Day 020.
```
