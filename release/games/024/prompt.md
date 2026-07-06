# Day 024 Game Generation Prompt

## Game identity

- Day: 024
- Title: Usagi Mochi Moon Hopper
- Slug: usagi-mochi-moon-hopper
- Public route word: usagi
- Mode: 3D
- Genre: mobile-first 3D hop-platform arcade / moon-mochi timing score chase
- Mood/style: pearly moonlit rooftop mochi festival above a quiet Japanese town, tiny usagi moon-rabbit courier, soft lavender night fog, jade mochi pads, gold rice sparks, lacquered tray gates, floating paper charms, warm lantern windows below, springy landing feedback and tactile jump arcs; real spatial hopping and platform timing rather than calligraphy brush tracing, kite-thread sky cartography, dry-garden raking, underwater diving, matsuri rhythm lanes, shrine tilt mazes, silver webs, pottery shaping, bamboo canal routing, origami folding, rainy sheltering, snow stacking, kimono stamping, bento cooking, windbell tuning, rail running, or koi lantern collecting.

## Why this game today

The generated series currently ends with:

- Day 021 `hybrid`: autumn karesansui sand-ripple routing with raked paths, standing stones, maple leaves, basins, moss/no-rake zones, and a tanuki guide.
- Day 022 `3d`: nebuta kite sky cartography with ordered star nodes, thread tension, wind ribbons, shrine beacons, cloud tangles, and a kitsune kite mascot.
- Day 023 `2d`: close-up sumi calligraphy with direct brush strokes, wetness/blots, washi paper, fox-scribe helper, and vermilion seal placement.

The latest generated-mode streak is one `2d`; latest 2D streak is one. Day 024 deliberately chooses real `3D` to keep the cadence strong immediately after a tactile 2D drawing game. The new verb set is springy moon-platform traversal: choose jump direction and strength, land on 3D mochi pads, collect ordered rice sparks, knead unstable pads, dash through tray gates, avoid soot-bat shadows, and deliver glowing mochi offerings to moon trays.

Recent screenshot/visual variety notes to avoid repeating:

- Day 021 used warm beige dry-garden boards, moss islands, standing stones, maple leaves, tanuki mascot, and brown/orange rake controls.
- Day 022 used dark cobalt sky, giant title/mission card, sparse star depth, nebuta kite mascot, altitude/tension HUD, and blue/pink action buttons.
- Day 023 used warm washi paper, charcoal table, black sumi strokes, vermilion seal target, fox-scribe mascot, and brush/action controls.

Day 024 should shift to a soft moon-festival platform scene: lavender and pearl moonlight, rounded jade/cream mochi pads with squash/stretch, red lacquer trays, rice-spark trails, paper charm wind markers, distant tiled rooftops, and a friendly white usagi mascot. Avoid calligraphy/washi/stroke/seal language as core UI, avoid kite/thread/star-map navigation, avoid dry-garden sand/moss/stone boards, avoid underwater teal corridors, taiko rhythm pads, maze tilt boards, web anchors, clay profiles, bamboo pipes, origami creases, parasols/rain, snow blocks, kimono cloth panels, or generic endless runner lanes.

## Code isolation / no previous game source

The implementation must be written from scratch for this day. Do not open, inspect, copy, diff, grep, or adapt code from previous games, including old `apps/day-*` folders, old `release/games/NNN/` HTML/CSS/JS files, or old public alias folders. You may inspect previous metadata, prompts, postmortems, and screenshots only to avoid repeating concepts and visual identity. The new game's HTML/CSS/JS must come from this prompt and general browser/Three.js/WebAudio game knowledge, not from earlier game implementations.

## Mode variety / 3D cadence

Inspection target: `src/data/games.ts` currently ends with Day 021 `hybrid`, Day 022 `3d`, and Day 023 `2d`. The latest generated-mode streak is one `2d`; latest 2D streak is one.

Mode decision: Day 024 is `3D`. It must implement real spatial gameplay, not decorative perspective:

- Use Three.js/WebGL or equivalent static-browser 3D rendering.
- Render an actual depth-visible moon rooftop/platform course with a hopping usagi, springy mochi pads, tray gates, rice-spark arcs, moon trays, paper charm wind cues, soot-bat shadow hazards, and parallax rooftops below.
- Gameplay must depend on 3D state: x/z platform position, y jump height, landing velocity, jump charge/angle, pad springiness, platform stability, gate depth/order, wind drift, tray distance, shadow hazard proximity, and camera framing.
- Player actions must manipulate the 3D system: aim left/right/forward/back, charge/release hop, short-hop, knead/brace a shaky mochi pad, moon-dash through a tray gate, drop a rice marker on the current pad, trigger Moon Whisker Focus to slow/preview landing arcs, pause/restart, and inspect tutorial hints.
- Portrait mobile is the default supported layout; no landscape gate.

## Design

- Objective: Hop a tiny moon rabbit across springy 3D mochi pads, collect requested rice sparks in order, stabilize wobbling pads, pass lacquer tray gates, avoid soot-bat shadows, and deliver glowing mochi offerings to moon trays.
- Win condition: Complete three festival deliveries — First Mooncake Hop, Lantern Tray Crossing, and Jade Rabbit Offering — while reaching 3800 points to trigger “Usagi Moon Feast”. After the feast banner, continue into endless rooftop commissions.
- Lose condition: Three moon-heart mochi crack, the delivery timer expires, the usagi falls below the rooftops too often, too many ordered rice sparks are missed or collected out of order, or a moon tray delivery is missed after gate activation.
- Core loop:
  1. Start on a title/menu screen with Day 024 badge, mode badge “3D”, public route `/usagi/`, best score, best Moon Feast time, tutorial, prompt link, and a large Start button.
  2. Show a portrait-friendly 3D rooftop course. The usagi starts on a near mochi pad. Ahead are rounded pads at different heights/depths, rice sparks on jump arcs, red tray gates, moon trays, paper charm wind cues, and soot-bat shadows crossing near/mid/far lanes.
  3. A delivery card requests goals, for example: “Collect 4 gold rice sparks, land on 3 jade pads, pass Tray Gate A, deliver with pad stability above 60%.”
  4. Player aims with large direction buttons or drag-to-aim. Holding Charge Hop fills a visible arc preview; releasing hops. Short Hop makes safe local jumps; Moon Dash crosses a marked tray gate but consumes charge.
  5. Each landing compresses a mochi pad. Clean center landings bounce higher, build combo, and spawn rice sparks. Edge landings wobble the pad, increase crack risk, and shift the next arc.
  6. Knead/Brace repairs or stabilizes the current pad before jumping. Rice Marker drops a tiny glowing grain on the current pad, improving path memory and awarding bonuses when future landings chain through marked pads.
  7. Ordered rice sparks attach to the usagi tail like a glowing trail. Collecting the requested sequence unlocks the next moon tray; wrong-order sparks give tiny points but add moon drift and lure soot-bats.
  8. Moon Whisker Focus, charged by clean center landings, slows shadow hazards and shows the predicted landing circle/tray gate for a short window.
  9. Completing a delivery lights a tray, awards points, repairs one moon-heart if needed, and unlocks higher floating pads/deeper gate timing.
  10. Pause/restart remain available throughout.
- 15+ minute play-value strategy:
  - Save best score, fastest Usagi Moon Feast time, longest clean landing chain, highest endless delivery, most perfect center landings, fewest cracked pads, best moon tray accuracy, and collected mochi seals in localStorage.
  - Include three authored deliveries:
    - First Mooncake Hop: wide pads, slow soot-bats, visible arc preview, three gold rice sparks, one moon tray, no fall penalty during first guided jump.
    - Lantern Tray Crossing: adds height differences, wind charm drift, jade/white rice spark order, first tray gate, and Knead/Brace tutorial.
    - Jade Rabbit Offering: adds smaller raised pads, double tray gates, shadow crossings, moving moon tray, stricter ordered sparks, and Moon Whisker Focus mastery.
  - Deterministic Day 024 seed varies pad positions/heights, spark order, wind charm drift, tray gate timing, soot-bat patrol lanes, pad springiness, and endless constraints while keeping the opening fair.
  - Mastery badges: finish First Mooncake Hop with no cracked pads, trigger Moon Feast under 230 seconds, complete 24 clean center landings, collect 18 requested rice sparks in order, finish a delivery above 90% pad stability, complete an endless delivery with all moon-hearts.
  - Strategic scoring rewards planning: charge just enough instead of overjumping, land near pad centers, brace unstable pads before long jumps, save Moon Dash for gate lines, drop Rice Markers on safe hub pads, use Moon Whisker Focus before moving trays, and avoid wrong-order sparks when soot-bats are close.
  - Endless mode after Usagi Moon Feast adds taller pad stacks, shorter tray windows, stronger wind charm drift, rarer brace charges, more mixed spark sequences, and faster soot-bat shadows without shrinking touch controls.
- Difficulty scaling:
  - 0-45 seconds: large pads, low height gaps, slow timer, one tray, visible landing preview, gentle shadows, guided first hop.
  - 45-125 seconds: pad height changes, first gate, two spark colors, pad wobble/crack state, wind charm drift, Knead/Brace introduced.
  - 125-230 seconds: moving tray, double gates, smaller raised pads, stricter spark order, soot-bat depth lanes, Moon Whisker Focus timing.
  - 230+ seconds/endless: denser roof course, quicker tray gates, more shadow overlap, same readable controls.
  - Keep mobile fair: usagi, pads, spark trails, tray gates, moon trays, shadow hazards, landing circles, and action buttons must be large/readable at 390x844; primary touch buttons must be 52px+; no tiny survival-critical collectibles.
- Scoring/rewards:
  - Clean center landing: +120 points times combo tier.
  - Requested rice spark collected in order: +105 points and Focus charge.
  - Wrong-order spark collected safely: +35 points, combo soft-reset, small moon drift increase.
  - Knead/Brace prevents a pad crack before a hop: +95 points.
  - Rice Marker chain landing: +160 points and small stability refund.
  - Moon Dash through a correct tray gate: +230 points.
  - Moon tray delivery above stability target: +620 points and repair one moon-heart if below max.
  - Perfect no-crack delivery: +780 points.
  - Usagi Moon Feast: +1450 points and endless deliveries unlock.
  - Edge landing or overcharge slam: stability damage, crack risk +12%, combo reset.
  - Fall below rooftop: moon-heart damage and respawn at last safe pad if hearts remain.
  - Soot-bat shadow hit: drift spike, stability -15%, combo reset.

## Controls and layout

- Desktop:
  - Mouse click/tap: press direction/action buttons, start/pause overlay button, prompt link, or explainable HUD chips.
  - Mouse drag on the playfield: aim the next hop direction; release or Charge Hop button confirms depending on implementation.
  - Arrow keys or WASD: aim left/right/forward/back across the 3D course.
  - Space or Enter: Charge/Release Hop / start from menu.
  - Q: Short Hop.
  - E: Moon Dash when charged.
  - K or C: Knead/Brace current pad.
  - M: drop Rice Marker.
  - Shift or B: Moon Whisker Focus when charged.
  - P: pause/resume.
  - R: restart current run.
- Mobile/touch:
  - Use large Aim Left, Aim Right, Aim Forward, Aim Back buttons near or below the playfield, plus optional drag-to-aim on the 3D stage.
  - Use large Charge Hop, Short Hop, Moon Dash, Knead/Brace, Rice Marker, Moon Whisker Focus, Pause, and Restart buttons.
  - Optional swipe/drag aiming can be supported, but visible buttons are mandatory.
  - Tapping pads/trays/sparks/chips may show short explanations.
  - No tiny virtual joystick. Interaction is aiming, charging/releasing hops, stabilizing pads, dashing, marking, focus, pause/restart.
- Mobile layout/orientation:
  - Default target is portrait phone play around 390x844; do not require landscape.
  - Top: compact moon-festival HUD with score, best, moon-hearts, stability, combo, active hop mode, rice spark order, and elapsed time. Use rabbit/mochi/tray/spark chips, not calligraphy ink, kite thread, dry-garden leaves, underwater oxygen, matsuri drum, shrine maze, web, pottery, or bamboo chips.
  - Below top: delivery card with requested spark order, pad stability target, tray gate requirement, moon tray status, and progress ticks.
  - Center: 3D rooftop/mochi course with usagi, visible landing arc/circle, pads, rice sparks, tray gates, soot-bat shadows, paper charm wind cues, moon trays, and parallax rooftops. It must remain playable without zooming.
  - Bottom: status helper plus large aim/action controls. Controls must not cover the active landing circle, next pad, tray gate, or hazard warnings.
  - Tutorial must fit on the first portrait screen; optional details may be collapsible but objective, aim, Charge Hop, pad stability, Knead/Brace, rice spark order, tray gates, Moon Dash, Moon Whisker Focus, pause/restart must be visible.
  - Requests must combine text, symbols, shapes, labels, altitude bands, and line styles so hue alone is not required.

## Menu and tutorial

Implement these states:

1. Title screen
   - Shows title “Usagi Mochi Moon Hopper”.
   - Shows Day 024 badge, mode badge “3D”, public route `/usagi/`, best score, best Moon Feast time if available, and a prompt link.
   - Shows a large Start button and visible tutorial panel by default.
   - Notes: “Audio starts after you press Start; visual jump arcs and landing cues work if muted.”
2. Tutorial text
   - Objective: “Hop across springy mochi pads, collect rice sparks in order, and deliver glowing mochi trays to the moon.”
   - Aiming: use arrows/WASD or big touch buttons; the landing circle shows where the usagi will land.
   - Hops: Charge Hop reaches far pads, Short Hop is safer for local repositioning, Moon Dash crosses tray gates.
   - Stability: clean center landings build combo; edge landings crack pads. Knead/Brace before risky jumps.
   - Sparks/trays: collect requested rice sparks in order, then deliver to the glowing moon tray.
   - Moon Whisker Focus: slows shadows and reveals a safer landing arc when charged.
   - Pause/restart: P/R on desktop or visible buttons on mobile.
3. In-game HUD
   - Score, best score, moon-hearts, pad stability, delivery name, combo, elapsed time, active hop mode, requested rice order, collected sparks, tray gate status, Moon Dash charge, Moon Whisker Focus charge, latest warning.
   - Pause/restart controls visible or immediately accessible.
4. Status helper
   - Non-blocking helper showing next requested spark, current pad stability, landing quality prediction, gate/tray advice, shadow warning, and expected score effect.
   - Must not cover the 3D course or bottom controls on mobile.
5. Pause overlay
   - Resume, restart, tutorial reminder, controls summary, audio/mute toggle, prompt link.
6. Game-over/results overlay
   - Final score, best score, delivery reached, Moon Feast status, clean landing chain, sparks collected in order, pad cracks, tray accuracy, mastery badges, restart button.
7. Usagi Moon Feast banner
   - Trigger once per run after all three deliveries and 3800 score.
   - Non-blocking celebration: the usagi lands on a glowing moon tray, mochi pads bounce in sequence, rice sparks form a rabbit constellation, lantern rooftops brighten below, and endless deliveries continue after the banner fades.

## Assets

Prefer Imagegen2 (`openai/gpt-image-2`) for final visual art: usagi moon-rabbit mascot, portrait moonlit rooftop/mochi festival background, mochi/rice/tray/hazard icon sheet, and decorative tray/mochi pieces. Three.js primitives may render the interactive 3D pads, landing arcs, spark nodes, tray gates, hit volumes, hazards, particles, camera, fog, and UI chrome. Procedural code may crop, resize, alpha-clean, atlas-pack, optimize, animate, or place generated assets; it should not create final character/background/icon art from scratch unless Imagegen2 is unavailable after a real attempt.

Archive source generated art under `release/games/024/assets/source/` and use optimized playable copies under `release/games/024/assets/`. Also copy optimized playable assets into `apps/day-024-usagi-mochi-moon-hopper/assets/` and the public alias `release/usagi/assets/`.

For mobile-first crop safety: keep important content centered, leave 12-16% safe margins, avoid baked-in text, avoid watermarks, avoid fake UI labels, avoid tiny spark details that disappear at final in-game size, and keep usagi/mochi/tray/spark/shadow silhouettes distinct against lavender moon backgrounds.

Generate or provide at least these final art assets:

1. Usagi moon-rabbit hopper mascot
   - Target: transparent PNG if possible, square source, final optimized texture around 512x512 or 256x256.
   - Archive path: `release/games/024/assets/source/usagi-hopper-source.png`
   - Optimized path: `release/games/024/assets/usagi-hopper.png`
   - Imagegen2 prompt: “A charming friendly Japanese moon rabbit mascot for a mobile 3D mochi platform-hopping browser arcade game, small white usagi wearing a tiny indigo festival vest and red cord, holding a glowing mochi mallet and a gold rice spark, energetic mid-hop pose but centered readable silhouette, soft lavender moon rim light, transparent or solid pale moonlit background, no checkerboard background, no text, no watermark, sprite-friendly, high contrast at small size, suitable as a hopping game piece.”
   - Aspect ratio: square.
2. Moonlit rooftop mochi festival background source
   - Target: portrait-friendly background suitable behind a 3D platform course with open readable center.
   - Archive path: `release/games/024/assets/source/usagi-rooftops-source.png`
   - Optimized path: `release/games/024/assets/usagi-rooftops.png`
   - Imagegen2 prompt: “A magical Japanese moonlit rooftop mochi festival for a portrait mobile 3D platform game, pearly full moon, lavender night sky, warm lantern windows below, tiled rooftops, red lacquer mochi trays, soft paper charms, floating jade and cream mochi pads near the edges, gold rice spark trails, open readable center area for interactive 3D hopping platforms, crop-safe for phone portrait, no characters, no readable text, no watermark.”
   - Aspect ratio: portrait.
3. Mochi, rice spark, tray, moon, and hazard UI icon sheet source
   - Target: square icon sheet for objectives, hazards, rewards, and UI decals.
   - Archive path: `release/games/024/assets/source/usagi-icons-source.png`
   - Optimized path: `release/games/024/assets/usagi-icons.png`
   - Imagegen2 prompt: “Small readable icon sheet for a Japanese moon-rabbit mochi hopping arcade game: jade mochi pad, cream mochi pad, gold rice spark, white rice spark, red lacquer tray gate, glowing moon tray, moon-heart mochi, cracked pad, soot-bat shadow hazard, wind paper charm, Charge Hop arc, Short Hop, Moon Dash, Knead Brace mallet, Rice Marker grain, Moon Whisker Focus emblem, Usagi Moon Feast emblem, transparent or solid pale lavender background, no checkerboard background, high contrast, no text, no watermark, generous margins so no icons are cut off.”
   - Aspect ratio: square.

If Imagegen2 is unavailable or fails after a real attempt, create a clearly labeled emergency fallback using simple SVG/Three.js moon-rabbit/mochi silhouettes, document the failure in `ai/postmortems/day-024.md`, and still keep source/fallback files under the same asset paths.

### Mandatory generated-image QA

For every generated image, include a real inspection step after generation and before integration:

- Analyze the actual generated file visually, not just the prompt text.
- For the usagi mascot, verify transparent/cutout quality or clean background handling, readable friendly silhouette, centered pivot/crop margins, no unwanted text/watermarks, stable upright/hopping orientation, and that the pose does not imply an incompatible movement direction or rotation baseline.
- Verify control-to-motion alignment in-game: Aim Forward/Back/Left/Right must shift the landing preview in the expected screen/depth direction, Charge Hop and Short Hop must visibly differ, Moon Dash must cross the intended tray gate, Knead/Brace must repair the current pad, Rice Marker must drop at the current pad, Moon Whisker Focus must slow/reveal as described, and falls/shadows/cracks must affect intended areas.
- For the background, verify the center play area remains readable after portrait mobile crop and does not hide pads, landing arc/circle, usagi, sparks, trays, shadow hazards, delivery card, helper, or controls.
- For the icon sheet, verify mochi pad types, rice spark colors, tray gate, moon tray, moon-heart, cracked pad, soot-bat hazard, wind charm, hop actions, Knead/Brace, Rice Marker, Moon Whisker Focus, and Moon Feast emblem are distinct at final HUD/button size and cannot be confused. Watch specifically for fake checkerboard transparency; alpha-clean or composite onto pale lavender if needed and inspect again.
- If inspection finds a problem, regenerate or post-process the image and inspect again. Do not ship broken visual assets just because tests pass.

## Audio and game feel

Because hopping, mochi bounce, tray delivery, and moon-festival cues are central to the theme, include lightweight WebAudio cues initialized only after a user gesture:

- Soft elastic mochi boing on clean center landings, pitch based on landing quality.
- Lower squish/crack warning on edge landings or unstable pads.
- Rice-spark chime when collecting a requested spark, with pitch varying by spark type.
- Wooden mallet tap when Knead/Brace succeeds.
- Airy whoosh for Moon Dash through a tray gate.
- Gentle shimmer/bell when Moon Whisker Focus activates.
- Rising koto/moon-bell arpeggio when Usagi Moon Feast triggers.

Audio must not block play if WebAudio is unavailable. Verify no autoplay errors: audio context should be created/resumed only after Start or another user interaction. Include a visible mute toggle in pause/results or HUD.

## Prompt page output

The archived `release/games/024/prompt.html` must be a consistent rendered HTML page, not raw Markdown pasted into a `<pre>` block. It should include:

- A clear `<title>` and `<h1>` using `Day 024 Game Generation Prompt`.
- A back-to-game link near the top.
- Semantic rendered sections (`h2`, `h3`, `ul/ol/li`, `p`, `pre/code` only for actual code/commands).
- The same readable prompt-page style pattern across days so prompt pages feel like one system.

## Subagents to dispatch

1. Implementation subagent
   - Build the static 3D game under `apps/day-024-usagi-mochi-moon-hopper/`.
   - Integrate it into immutable release output under `release/games/024/`.
   - Create the public playable route under `release/usagi/`.
   - Use static HTML/CSS/JS with Three.js/WebGL and no backend.
   - The public alias must be self-contained or asset paths must be alias-safe.
   - If vendoring `three.module*.js`, also copy the matching `three.core*.js` beside it in the app, release archive, and `/usagi/` alias assets.
2. Asset/polish subagent
   - Generate/prepare Imagegen2 assets, archive source files, optimize playable copies, inspect generated images, remove fake checkerboards if present, and tune mobile readability/game feel.
3. QA/browser/mobile subagent
   - Run desktop and mobile smoke checks, verify no console errors, verify menu/tutorial/objective/controls/restart/pause, prompt links, 3D course render, aim controls, Charge Hop, Short Hop, Moon Dash, Knead/Brace, Rice Marker, Moon Whisker Focus control presence, landing feedback, spark order, tray delivery feedback, shadow/crack hazards, generated screenshot, generated assets, WebAudio initialization after user gesture, and 390x844 portrait layout.
4. Reflection/self-improvement subagent
   - Write `ai/postmortems/day-024.md` after validation with what worked, what failed, generated-image inspection notes, audio verification, code-isolation confirmation, and whether generator/template/rubric improvements are justified.

## Acceptance criteria

- Static build passes.
- Code isolation is documented in QA/postmortem: no previous game implementation code was opened, inspected, copied, diffed, grepped, or adapted.
- Mode choice follows the cadence rule: Day 024 is real `3d` after Day 023 `2d`, with spatial hopping gameplay where jump arcs, pad height/depth, stability, ordered sparks, gates, trays, wind, and shadow hazards matter.
- Desktop smoke passes.
- Mobile portrait smoke passes at about 390x844 with readable HUD/tutorial/delivery card, usable 52px+ aim/action/pause/restart controls, no forced landscape canvas, and no tiny survival-critical sparks/pads/hazards.
- Prompt is visible from gallery and release folder.
- `prompts/day-024.md` is copied exactly to `release/games/024/prompt.md` and `release/usagi/prompt.md`.
- `release/games/024/prompt.html` and `release/usagi/prompt.html` render the prompt in browser-readable semantic HTML with the standard prompt-page styling, not a raw Markdown `<pre>` dump.
- Public alias `release/usagi/index.html`, `release/usagi/prompt.html`, `release/usagi/screenshot.png`, and `release/usagi/assets/` exist and work.
- Gallery card for Day 024 shows prompt availability, generation duration, public `/usagi/` links, mode `3d`, and actual generated date.
- Screenshot exists at `release/games/024/screenshot.png` and is non-empty/readable. Prefer a readable desktop gameplay screenshot for gallery cards; mobile screenshots are QA evidence unless the design is intentionally portrait-card friendly.
- Image/source assets exist under `release/games/024/assets/source/` and optimized assets exist under `release/games/024/assets/`, or a documented emergency fallback exists.
- Every generated image has an inspection note in the postmortem or QA notes; interactive usagi/mochi/platform visuals have verified background handling, orientation/pivot/crop, readability, and control-to-motion alignment.
- WebAudio initializes after user gesture and creates no autoplay console errors; audio is failsafe if unsupported and visual hop/landing cues remain playable muted.
- No console errors during desktop or mobile smoke. Add data-URI favicons to game and prompt pages if needed to avoid favicon request noise.
- Existing `release/games/001/**` through `release/games/023/**` from origin/main remain unchanged.
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
