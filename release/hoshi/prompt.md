# Day 022 Game Generation Prompt

## Game identity

- Day: 022
- Title: Hoshi Nebuta Kite Cartographer
- Slug: hoshi-nebuta-kite-cartographer
- Public route word: hoshi
- Mode: 3D
- Genre: mobile-first 3D kite-thread navigation / constellation tracing arcade score chase
- Mood/style: high summer night above a shrine hill, glowing nebuta-paper kite lanterns, deep cobalt sky, gold star ink, red-and-white braided kite thread, cloud shelves, tiny kitsune kite pilot charm, observatory torii silhouettes, tactile thread tension and wind-current feedback; real spatial sky navigation rather than dry-garden raking, underwater diving, rhythm lanes, shrine tilt boards, silver-web tension, pottery sculpting, bamboo water-routing, origami folding, rainy sheltering, snow stacking, textile stamping, cooking, windbell tuning, or rail running.

## Why this game today

The generated series currently ends with:

- Day 019 `2d`: blue-hour matsuri rhythm-routing with Don/Ka/Hi/Ya taiko pads, lantern gates, carrier routing, call-and-response, and WebAudio timing.
- Day 020 `3d`: underwater pearl cartography with a diver, oxygen, guide shells, currents, air bells, jellyfish, and teal 3D depth navigation.
- Day 021 `hybrid`: autumn karesansui sand-ripple routing with rake strokes, standing stones, maple leaves, moss/no-rake zones, basins, and Still Garden focus.

The latest generated-mode streak is one `hybrid`, and the latest 2D streak is zero. Day 022 deliberately chooses real `3D` so the next entry has clear spatial camera/depth after the tactile 2.5D dry-garden board. The new verb set is sky-thread navigation: steer a luminous nebuta-paper kite through star gates, control thread tension, ride wind shelves, trace constellation strokes in depth, avoid cloud tangles, and return star ink to shrine beacons.

Recent screenshot/visual variety notes to avoid repeating:

- Day 019 used saturated indigo festival streets, vertical rhythm lanes, fireworks, lantern strings, taiko pad buttons, and fox-mask mascot art.
- Day 020 used teal underwater fog, kelp silhouettes, pearl beacons, oxygen ring, diver mascot, guide-shell controls, and a central depth corridor.
- Day 021 used warm dry-garden sand, moss islands, standing stones, maple leaves, tanuki mascot, and large rake/action controls.

Day 022 should shift to an open night-sky aerial scene: cobalt-to-violet sky gradient, luminous paper kite body, braided thread arcs, star-ink nodes, cloud shelf platforms, red shrine beacons far below, and sweeping parallax depth. Avoid beige sand boards, underwater teal corridors, drum-pad lanes, raised wooden maze ramps, web circles/anchors, clay rings, bamboo canal tiles, origami crease sheets, umbrellas/rain, snow blocks, kimono cloth panels, windbell ribbons, rail vehicles, and generic spaceship/runner movement.

## Code isolation / no previous game source

The implementation must be written from scratch for this day. Do not open, inspect, copy, diff, grep, or adapt code from previous games, including old `apps/day-*` folders, old `release/games/NNN/` HTML/CSS/JS files, or old public alias folders. You may inspect previous metadata, prompts, postmortems, and screenshots only to avoid repeating concepts and visual identity. The new game's HTML/CSS/JS must come from this prompt and general browser/Three.js game knowledge, not from earlier game implementations.

## Mode variety / 3D cadence

Inspection target: `src/data/games.ts` currently ends with Day 019 `2d`, Day 020 `3d`, and Day 021 `hybrid`. The latest generated-mode streak is one `hybrid`; latest 2D streak is zero.

Mode decision: Day 022 is `3D`. It must implement real spatial gameplay, not decorative perspective:

- Use Three.js/WebGL or equivalent static-browser 3D rendering.
- Render an actual depth-visible night-sky course with a kite, braided tether, wind-current ribbons, star-ink nodes, cloud shelves, shrine beacons, cloud-tangle hazards, and constellation gates.
- Gameplay must depend on 3D state: x/y/z kite position, forward depth, altitude, velocity, thread tension, wind direction, gate ordering, beacon distance, cloud shelf lift, and hazard proximity.
- Player actions must manipulate the 3D system: steer left/right/up/down, reel in/out to change tension and altitude, pulse the kite tail to stabilize, place star-thread markers, trigger Kitsune Gust to reveal a route, and bank completed constellation strokes at shrine beacons.
- Portrait mobile is the default supported layout; no landscape gate.

## Design

- Objective: Guide a glowing nebuta-paper kite through layered night winds, collect star-ink nodes in order, trace constellation strokes through 3D gates, manage braided-thread tension, avoid cloud tangles, and light shrine beacons to complete the Hoshi Sky Map.
- Win condition: Complete three sky-map chapters — First Star Thread, Cloud Shelf Crossing, and Nebuta Dawn Map — while reaching 3600 points to trigger “Hoshi Sky Map Complete”. After the map, continue into endless kite commissions.
- Lose condition: Thread tension snaps at 100%, three kite-lantern hearts go dark, the kite stalls below the cloud shelf too often, too many star-ink nodes are collected out of order, or the chapter timer expires before required constellation strokes are banked.
- Core loop:
  1. Start on a title/menu screen with Day 022 badge, mode badge “3D”, public route `/hoshi/`, best score, best Sky Map time, tutorial, prompt link, and a large Start button.
  2. Show a portrait-friendly 3D night-sky course. The kite floats near the lower center, flying into depth. Star-ink nodes hang at different x/y/z positions, translucent wind ribbons curve through the scene, cloud shelves lift or block, shrine beacons glow far below, and cloud-tangle knots drift across near/mid/far lanes.
  3. A sky-map card requests goals, for example: “Trace 4 gold stars, cross 2 cloud shelves, bank at Beacon A, finish with tension under 65%.”
  4. Player steers through the sky with large direction buttons or keyboard. Short Tail Pulse stabilizes drift; Reel In increases speed/altitude but raises tension; Reel Out lowers tension and widens turns but risks missing high gates.
  5. Star-ink nodes attach as glowing dots on the kite tail. Collecting requested nodes in order draws a constellation stroke. Wrong-order stars award tiny points but raise thread noise and lure cloud tangles.
  6. Star-thread markers can be placed at safe wind eddies. A correct marker near a shrine beacon extends the visible route and gives a tension refund; careless markers in turbulent wind drift away.
  7. Kitsune Gust, charged by clean star chains, briefly reveals hidden wind arrows, cloud-tangle depth silhouettes, and the next constellation gate.
  8. Banking a complete stroke at a shrine beacon lights a lantern row, awards points, repairs one kite-lantern heart if needed, and unlocks stronger winds/deeper gates.
  9. Pause/restart remain available throughout.
- 15+ minute play-value strategy:
  - Save best score, fastest Hoshi Sky Map Complete time, longest clean star chain, highest endless sky commission, most correct star-thread markers, best low-tension finish, fewest cloud tangles, and collected kite seals in localStorage.
  - Include three authored chapters:
    - First Star Thread: broad wind corridor, three bright star nodes, one large shrine beacon, two obvious eddies, no instant tension loss during first guided steering.
    - Cloud Shelf Crossing: adds vertical altitude changes, two star colors, cloud shelf lift timing, first cloud-tangle lane, and Reel In/Reel Out tension tutorial.
    - Nebuta Dawn Map: deeper violet sky, hidden gates revealed by Kitsune Gust, crossing wind ribbons, two shrine beacons, stricter tension route, and cloud-tangle depth silhouettes.
  - Deterministic Day 022 seed varies star-node positions, wind ribbon bends, beacon timing, hidden gate order, cloud shelf lift, cloud-tangle patrol paths, and endless constraints while keeping the opening fair.
  - Mastery badges: finish First Star Thread without a tension warning, trigger Sky Map Complete under 225 seconds, collect 20 requested stars in clean order, place 10 correct star-thread markers, finish a chapter below 40% tension, complete an endless commission with all kite hearts.
  - Strategic scoring rewards planning: reel out before tight turns, ride wind ribbons only when they point toward ordered stars, save Kitsune Gust for hidden-gate sections, place thread markers in calm eddies, bank at beacons before chasing far bonus stars, and avoid wrong-order stars when cloud tangles are close.
  - Endless mode after Sky Map Complete adds stronger crosswinds, denser clouds, rarer beacons, alternating star orders, moving cloud shelves, and faster tangles without shrinking touch controls.
- Difficulty scaling:
  - 0-45 seconds: broad lanes, slow drift, visible star order, generous tension, one tangle-free route, one large beacon.
  - 45-125 seconds: vertical altitude changes, first crosswind ribbon, two star colors, cloud shelf timing, one cloud-tangle lane.
  - 125-225 seconds: hidden gates, stronger winds, two beacons, cloud shelf alignment, stricter tension, multiple cloud-tangle depth lanes.
  - 225+ seconds/endless: denser sky, shorter beacon windows, more hidden gates, same readable controls.
  - Keep mobile fair: kite, star nodes, beacons, cloud tangles, wind arrows, and marker previews must be large and readable at 390x844; controls must be 56px+ primary buttons; no tiny hazard required for survival.
- Scoring/rewards:
  - Requested star collected in order: +105 points times combo tier.
  - Wrong-order star collected safely: +35 points, combo soft-reset, small tension increase.
  - Star-thread marker placed in a safe wind eddy: +180 points and small tension refund.
  - Clean shrine beacon bank: +240 points and Kitsune Gust charge.
  - Cloud tangle avoided at close range: +95 points.
  - Sky-map chapter complete below tension target: +580 points and repair one kite heart if below max.
  - Perfect no-tangle chapter: +740 points.
  - Hoshi Sky Map Complete: +1350 points and endless kite commissions unlock.
  - Cloud tangle hit: kite-heart damage, tension +16%, combo reset.
  - Wind slam/cloud shelf collision: tension +7% and drift penalty.
  - Tension snap: kite-heart damage and respawn at last shrine beacon if hearts remain.

## Controls and layout

- Desktop:
  - Mouse click/tap: press direction/action buttons, start/pause overlay button, prompt link, or explainable HUD chips.
  - Arrow keys or WASD: steer left/right/up/down through the 3D sky.
  - Space or Enter: Tail Pulse / start from menu.
  - Q/E: Reel Out / Reel In.
  - G: drop Star Thread marker.
  - B or Shift: trigger Kitsune Gust when charged.
  - P: pause/resume.
  - R: restart current run.
- Mobile/touch:
  - Use large Steer Up, Steer Left, Steer Right, Steer Down buttons around or below the playfield.
  - Use large Tail Pulse, Reel Out, Reel In, Star Thread, Kitsune Gust, Pause, and Restart buttons.
  - Optional swipe steering can be supported, but visible buttons are mandatory.
  - Tap star/beacon/cloud/wind chips for short explanations.
  - No tiny virtual joystick. Interaction is directional steering, tail pulse, reeling, star-thread marker, gust reveal, pause/restart.
- Mobile layout/orientation:
  - Default target is portrait phone play around 390x844; do not require landscape.
  - Top: compact night-sky HUD with score, best, kite hearts, tension ring, sky map, combo, elapsed time, and current altitude. Use star/thread/kite chips, not recent garden, underwater oxygen, matsuri drum, shrine maze, web, pottery, or bamboo chip layouts.
  - Below top: sky-map card with requested star order, star-thread target, shrine beacon requirement, tension target, and progress ticks.
  - Center: 3D night-sky course with kite/charm, star nodes, wind ribbons, cloud shelves, shrine beacons, star-thread previews, cloud-tangle silhouettes, route trail, and sky depth fog. It must remain playable without zooming.
  - Bottom: status helper plus large steering/action controls. Controls must not cover the kite, beacon, active star route, or hazard warnings.
  - Tutorial must fit on the first portrait screen; optional details may be collapsible but objective, tension, steering, Tail Pulse, Reel In/Out, star order, thread markers, shrine beacons, Kitsune Gust, cloud tangles, pause/restart must be visible.
  - Requests must combine text, symbols, shapes, labels, altitude bands, and line styles so hue alone is not required.

## Menu and tutorial

Implement these states:

1. Title screen
   - Shows title “Hoshi Nebuta Kite Cartographer”.
   - Shows Day 022 badge, mode badge “3D”, public route `/hoshi/`, best score, best Sky Map time if available, and a prompt link.
   - Shows a large Start button and visible tutorial panel by default.
   - Notes: “Audio starts after you press Start; visual wind/tension cues work if muted.”
2. Tutorial text
   - Objective: “Steer a glowing kite, trace star routes, manage thread tension, and complete the Hoshi Sky Map.”
   - Steering: use arrows/WASD or big touch buttons to steer through 3D altitude and depth; Tail Pulse stabilizes drift.
   - Tension: Reel In climbs faster but raises tension; Reel Out calms tension and widens turns.
   - Stars: collect requested stars in order to draw constellation strokes.
   - Star Thread: drop markers in calm eddies near shrine beacons for tension refunds.
   - Kitsune Gust: reveal hidden gates, winds, and cloud-tangle depth lanes when charged.
   - Pause/restart: P/R on desktop or visible buttons on mobile.
3. In-game HUD
   - Score, best score, kite hearts, tension, sky map name, combo, elapsed time, altitude, requested star order, collected stars, marker count, beacon status, Kitsune Gust charge, latest warning.
   - Pause/restart controls visible or immediately accessible.
4. Status helper
   - Non-blocking helper showing current altitude, tension advice, next requested star, current direction/drift, nearest beacon, wind ribbon warning, and marker readiness.
   - Must not cover the sky course or bottom controls on mobile.
5. Pause overlay
   - Resume, restart, tutorial reminder, controls summary, audio/mute toggle, prompt link.
6. Game-over/results overlay
   - Final score, best score, chapter reached, Sky Map Complete status, clean star chain, tension finish, markers placed, cloud tangles hit, mastery badges, restart button.
7. Hoshi Sky Map Complete banner
   - Trigger once per run after all three chapters and 3600 score.
   - Non-blocking celebration: star routes connect into a glowing paper-lantern constellation, the kite tail writes gold ink, shrine beacons shine below, cloud tangles drift away, and the kite bows; endless sky commissions continue after the banner fades.

## Assets

Prefer Imagegen2 (`openai/gpt-image-2`) for final visual art: nebuta kite/kitsune pilot mascot, night shrine-sky background, star/thread/cloud/beacon icon sheet, and decorative kite-tail or shrine-beacon pieces. Three.js primitives may render the interactive 3D sky course, kite body planes, star nodes, wind ribbons, hit volumes, cloud shelves, route trails, fog, particles, and UI chrome. Procedural code may crop, resize, alpha-clean, atlas-pack, optimize, animate, or place generated assets; it should not create final character/background/icon art from scratch unless Imagegen2 is unavailable after a real attempt.

Archive source generated art under `release/games/022/assets/source/` and use optimized playable copies under `release/games/022/assets/`. Also copy optimized playable assets into `apps/day-022-hoshi-nebuta-kite-cartographer/assets/` and the public alias `release/hoshi/assets/`.

For mobile-first crop safety: keep important content centered, leave 12-16% safe margins, avoid baked-in text, avoid watermarks, avoid fake UI labels, avoid tiny stars/cloud details that disappear at final in-game size, and keep kite/star/beacon/cloud/wind silhouettes distinct against cobalt night backgrounds.

Generate or provide at least these final art assets:

1. Nebuta kite kitsune mascot/source charm
   - Target: transparent PNG if possible, square source, final optimized texture around 512x512 or 256x256.
   - Archive path: `release/games/022/assets/source/hoshi-kite-source.png`
   - Optimized path: `release/games/022/assets/hoshi-kite.png`
   - Imagegen2 prompt: “A charming friendly Japanese nebuta paper-kite mascot for a mobile 3D browser kite-navigation arcade game, luminous fox-shaped kite with a tiny kitsune pilot charm, red and white braided tail thread, gold star-ink tassels, gentle smile, cobalt night rim light, centered readable silhouette, transparent or solid pale night-blue background, no checkerboard background, no text, no watermark, sprite-friendly, high contrast at small size, suitable as a flying game piece.”
   - Aspect ratio: square.
2. Night shrine sky / constellation course background source
   - Target: portrait-friendly background suitable behind a 3D sky course with open readable center.
   - Archive path: `release/games/022/assets/source/hoshi-sky-source.png`
   - Optimized path: `release/games/022/assets/hoshi-sky.png`
   - Imagegen2 prompt: “A magical Japanese shrine hill night sky for a portrait mobile 3D kite cartography game, deep cobalt and violet sky, distant red torii and shrine lanterns far below, soft cloud shelves at the sides, gold star constellations, faint wind ribbons, open readable center area for a flying paper kite route, crop-safe for phone portrait, no characters, no text, no watermark.”
   - Aspect ratio: portrait.
3. Star, thread, wind, cloud, beacon, and kite UI icon sheet source
   - Target: square icon sheet for objectives, hazards, rewards, and UI decals.
   - Archive path: `release/games/022/assets/source/hoshi-icons-source.png`
   - Optimized path: `release/games/022/assets/hoshi-icons.png`
   - Imagegen2 prompt: “Small readable icon sheet for a Japanese night-sky kite cartography game: gold star ink node, blue star node, red shrine beacon, braided kite thread marker, tension ring, Reel In icon, Reel Out icon, Tail Pulse, Kitsune Gust seal, cloud tangle hazard, wind ribbon arrow, kite-heart lantern, Hoshi Sky Map emblem, transparent or solid pale night-blue background, no checkerboard background, high contrast, no text, no watermark, generous margins so no icons are cut off.”
   - Aspect ratio: square.

If Imagegen2 is unavailable or fails after a real attempt, create a clearly labeled emergency fallback using simple SVG/canvas/Three.js sky silhouettes, document the failure in `ai/postmortems/day-022.md`, and still keep source/fallback files under the same asset paths.

### Mandatory generated-image QA

For every generated image, include a real inspection step after generation and before integration:

- Analyze the actual generated file visually, not just the prompt text.
- For the kite mascot, verify transparent/cutout quality or clean background handling, readable friendly silhouette, centered pivot/crop margins, no unwanted text/watermarks, stable forward orientation, and that the tail/thread pose does not imply an incompatible movement/rotation direction.
- Verify control-to-motion alignment in-game: Steer Up/Down/Left/Right must move in the expected screen/altitude directions, Tail Pulse must visibly stabilize drift, Reel In/Out must change altitude/speed/tension in opposite/readable ways, Star Thread must drop at the current route position, Kitsune Gust must reveal hidden items, shrine beacons must bank completed strokes, and cloud tangles/wind hazards must affect intended areas.
- For the background, verify the center play area remains readable after portrait mobile crop and does not hide the kite, stars, beacons, cloud tangles, wind arrows, sky-map card, helper, or controls.
- For the icon sheet, verify star types, thread marker, tension, reeling, Tail Pulse, Kitsune Gust, cloud tangle, wind arrow, kite-heart, beacon, and Sky Map emblem are distinct at final HUD/button size and cannot be confused. Watch specifically for fake checkerboard transparency; alpha-clean or composite onto pale night-blue if needed and inspect again.
- If inspection finds a problem, regenerate or post-process the image and inspect again. Do not ship broken visual assets just because tests pass.

## Audio and game feel

Because wind, thread tension, star ink, and shrine beacons are central to the theme, include lightweight WebAudio cues initialized only after a user gesture:

- Soft paper flutter when steering or using Tail Pulse, with pitch/length based on drift speed.
- Thread twang when tension crosses warning thresholds.
- Sparkle pluck when collecting a requested star, with pitch varying by star type.
- Warm shrine lantern chime when banking at a beacon.
- Low cloud rustle when touching a cloud tangle.
- Brief airy whoosh when Kitsune Gust reveals hidden gates.
- Rising koto/chime arpeggio when Hoshi Sky Map Complete triggers.

Audio must not block play if WebAudio is unavailable. Verify no autoplay errors: audio context should be created/resumed only after Start or another user interaction. Include a visible mute toggle in pause/results or HUD.

## Prompt page output

The archived `release/games/022/prompt.html` must be a consistent rendered HTML page, not raw Markdown pasted into a `<pre>` block. It should include:

- A clear `<title>` and `<h1>` using `Day 022 Game Generation Prompt`.
- A back-to-game link near the top.
- Semantic rendered sections (`h2`, `h3`, `ul/ol/li`, `p`, `pre/code` only for actual code/commands).
- The same readable prompt-page style pattern across days so prompt pages feel like one system.

## Subagents to dispatch

1. Implementation subagent
   - Build the static 3D game under `apps/day-022-hoshi-nebuta-kite-cartographer/`.
   - Integrate it into immutable release output under `release/games/022/`.
   - Create the public playable route under `release/hoshi/`.
   - Use static HTML/CSS/JS with Three.js/WebGL and no backend.
   - The public alias must be self-contained or asset paths must be alias-safe.
   - If vendoring `three.module*.js`, also copy the matching `three.core*.js` beside it in the app, release archive, and `/hoshi/` alias assets.
2. Asset/polish subagent
   - Generate/prepare Imagegen2 assets, archive source files, optimize playable copies, inspect generated images, remove fake checkerboards if present, and tune mobile readability/game feel.
3. QA/browser/mobile subagent
   - Run desktop and mobile smoke checks, verify no console errors, verify menu/tutorial/objective/controls/restart/pause, prompt links, 3D sky render, steer controls, Tail Pulse, Reel In/Out, Star Thread, Kitsune Gust control presence, star collection, tension/beacon feedback, wind/cloud hazard feedback, generated screenshot, generated assets, WebAudio initialization after user gesture, and 390x844 portrait layout.
4. Reflection/self-improvement subagent
   - Write `ai/postmortems/day-022.md` after validation with what worked, what failed, generated-image inspection notes, audio verification, code-isolation confirmation, and whether generator/template/rubric improvements are justified.

## Acceptance criteria

- Static build passes.
- Code isolation is documented in QA/postmortem: no previous game implementation code was opened, inspected, copied, diffed, grepped, or adapted.
- Mode choice follows the cadence rule: Day 022 is real `3d` after Day 021 `hybrid`, with spatial kite-thread gameplay where altitude, depth, wind direction, thread tension, markers, beacons, ordered stars, and hazards matter.
- Desktop smoke passes.
- Mobile portrait smoke passes at about 390x844 with readable HUD/tutorial/sky-map card, usable 56px+ steering/action/pause/restart controls, no forced landscape canvas, and no tiny survival-critical stars/hazards.
- Prompt is visible from gallery and release folder.
- `prompts/day-022.md` is copied exactly to `release/games/022/prompt.md` and `release/hoshi/prompt.md`.
- `release/games/022/prompt.html` and `release/hoshi/prompt.html` render the prompt in browser-readable semantic HTML with the standard prompt-page styling, not a raw Markdown `<pre>` dump.
- Public alias `release/hoshi/index.html`, `release/hoshi/prompt.html`, `release/hoshi/screenshot.png`, and `release/hoshi/assets/` exist and work.
- Gallery card for Day 022 shows prompt availability, generation duration, public `/hoshi/` links, mode `3d`, and actual generated date.
- Screenshot exists at `release/games/022/screenshot.png` and is non-empty/readable. Prefer a readable desktop gameplay screenshot for gallery cards; mobile screenshots are QA evidence unless the design is intentionally portrait-card friendly.
- Image/source assets exist under `release/games/022/assets/source/` and optimized assets exist under `release/games/022/assets/`, or a documented emergency fallback exists.
- Every generated image has an inspection note in the postmortem or QA notes; interactive kite/sky/thread visuals have verified background handling, orientation/pivot/crop, readability, and control-to-motion alignment.
- WebAudio initializes after user gesture and creates no autoplay console errors; audio is failsafe if unsupported and visual wind/tension cues remain playable muted.
- No console errors during desktop or mobile smoke. Add data-URI favicons to game and prompt pages if needed to avoid favicon request noise.
- Existing `release/games/001/**` through `release/games/021/**` from origin/main remain unchanged.
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
# Screenshot/static checks: verify release/games/022/screenshot.png, prompt.md, prompt.html, index.html, game.js, styles.css, release/hoshi/index.html, release/hoshi/prompt.html, release/hoshi/screenshot.png, optimized assets, and source assets exist and are non-empty.
# Prompt copy check: cmp prompts/day-022.md release/games/022/prompt.md and cmp prompts/day-022.md release/hoshi/prompt.md.
# Prompt HTML check: verify release/games/022/prompt.html has semantic h1/h2/list markup and a back-to-game link, not a raw Markdown dump inside <pre>, and no malformed ul > p or ol > p nodes.
# Browser smoke: open the local/static /hoshi/ route and verify menu, tutorial, gameplay start, 3D render, Steer Up/Left/Right/Down, Tail Pulse, Reel In/Out, Star Thread, Kitsune Gust control presence, star collection, tension/beacon feedback, wind/cloud hazard feedback, pause, restart, prompt page, WebAudio after user gesture, no console errors.
# Mobile smoke: repeat at a portrait phone viewport such as 390x844 and verify playable tap controls and readable HUD/sky-map/3D sky playfield.
# Static screenshot check: inspect release/games/022/screenshot.png and release/hoshi/screenshot.png for non-empty readable game content; use vision to judge actual visual quality.
# Image QA: inspect every Imagegen2 source/optimized asset and document the actual inspection result in ai/postmortems/day-022.md.
# Docker/static smoke: build the Docker image locally, run it, curl /hoshi/ and /hoshi/prompt.html, then stop the container.
# Immutable guard: confirm no release/games folders from origin/main changed except new Day 022.
```
