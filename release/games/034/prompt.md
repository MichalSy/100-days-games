# Day 034 Game Generation Prompt

## Game identity

- Day: 034
- Title: Temari Thread Orbit Weaver
- Slug: temari-thread-orbit-weaver
- Public route word: temari
- Mode: 3D
- Genre: mobile-first 3D spherical embroidery puzzle / silk-thread tension routing / geometric craft score chase
- Mood/style: quiet night festival craft table, lacquered temari ball floating in a shallow wooden ring, silk threads in indigo, vermilion, gold, jade, and ivory, pearl pins, washi pattern cards, low lantern light, tiny helpful sparrow threadkeeper mascot, precise tactile thread-pluck feedback; real 3D orbital stitching around a sphere rather than uchiwa fan dye sectors, onsen steam valves, ikebana flower balance, mikan orchard harvesting, kumiko woodworking, foxfire shrine stealth, matcha whisking, fireworks arcs, pachinko coins, mochi hopping, sumi tracing, kite cartography, dry-garden raking, underwater oxygen routing, taiko rhythm lanes, daruma rolling, silverweb weaving, pottery shaping, bamboo canals, origami folding, rain parasols, snow stacking, kimono stamping, bento cooking, windbell tuning, rail running, or koi collection.

## Why this game today

The generated series currently ends with:

- Day 031 `2d`: Botan Ikebana Balance Atelier with pale floral studio, suiban/kenzan, peony stems, negative-space composition, freshness, and balance meters.
- Day 032 `3d`: Onsen Steamline Bathkeeper with blue-gold bathhouse, 3D pools, copper valves/ducts, steam ribbons, pressure, temperatures, and macaque comfort.
- Day 033 `2d`: Uchiwa Fan Dye Maestro with bright washi fan workshop, radial paper sectors, bamboo ribs, indigo/coral/saffron pigment, stencil alignment, dry gaps, and bleed controls.

The latest generated-mode streak is one `2d` (Day 033). Day 034 deliberately chooses real `3D` to keep the cadence strong and to move away from flat radial paper/fan play. The new verb set is spherical craft: rotate a temari ball in 3D, pin start/end anchors on latitude/longitude bands, choose silk color, wrap thread along great-circle arcs, tune tension before knots slip, lock pearl pins at intersections, avoid tangles, and use Kagome Focus to preview over/under thread paths on the curved surface.

Recent screenshot/visual variety notes to avoid repeating:

- Day 033 used off-white fan paper, radial wedge sectors, pigment blooms, stencils, pale/gold craft UI, and a kappa helper.
- Day 032 used dark teal/copper onsen scenery, rectangular 3D bathhouse stage, circular pools, pipes, valves, steam bubbles, and pressure/temperature chips.
- Day 031 used cream/pink ikebana studio, pale suiban canvas, stems/flowers, negative-space moon, and rounded floral HUD cards.

Day 034 should use a tactile textile craft language: a central 3D sphere with colored thread arcs wrapping around it, pearl pins, latitude/longitude guide bands, tension glints, knot cards, spool trays, soft lantern shadows, and a sparrow threadkeeper helper. Avoid fan/paper dye/stencils/bleed, pools/steam/valves/macaques, flowers/vases/stems, citrus trees/crates/hornets, wood lattice/clamps, shrine stealth cones/foxfire, tea foam/whisks, fireworks/night sky burst arcs, pachinko coins/cats, rabbits/mochi, calligraphy scroll strokes, kite threads/star maps, raked sand/stone gardens, underwater pearls/oxygen, drum pads, tilt labyrinths, spider-web anchors, pottery wheel profiles, bamboo irrigation grids, origami crease routes, rain parasols, snow block stacking, kimono panels, restaurant timers, or generic connect-the-dots.

## Code isolation / no previous game source

The implementation must be written from scratch for this day. Do not open, inspect, copy, diff, grep, or adapt code from previous games, including old `apps/day-*` folders, old `release/games/NNN/` HTML/CSS/JS files, or old public alias folders. You may inspect previous metadata, prompts, postmortems, and screenshots only to avoid repeating concepts and visual identity. The new game's HTML/CSS/JS must come from this prompt and general browser/Three.js/WebGL/WebAudio game knowledge, not from earlier game implementations.

## Mode variety / 3D cadence

Inspection target: `src/data/games.ts` currently ends with Day 031 `2d`, Day 032 `3d`, and Day 033 `2d`. The latest generated-mode streak is one `2d`.

Mode decision: Day 034 is real `3D`. It must implement meaningful spatial gameplay, not decorative perspective:

- Use Three.js/WebGL or equivalent static-browser 3D rendering.
- Render an actual depth-readable temari sphere with latitude/longitude guide rings, visible front/back thread arcs, pearl pins, spool trays, tension glints, knot markers, camera/orbit cues, and curved-surface selection.
- Gameplay must depend on 3D state: active hemisphere, anchor pin position, thread color, great-circle route, over/under crossing order, tension, slack, tangle risk, pattern symmetry, knot lock timing, camera angle, and pattern-card goals.
- Player actions must manipulate the 3D system: rotate the ball, choose anchor band, move pin around the active ring, set thread start/end anchors, choose silk color, wrap thread, tighten/loosen tension, lock pearl pins, undo one recent wrap, use Kagome Focus to slow/preview thread crossings, pause/restart, and inspect tutorial hints.
- Portrait mobile is the default supported layout; no landscape gate.

## Design

- Objective: Complete temari pattern commissions by wrapping colored silk threads around a 3D ball, matching pattern-card intersections, balancing tension, locking pearl pins, and preserving clean over/under crossings before the thread frays.
- Win condition: Complete three commissions — First Star Wrap, Kagome Lantern Lattice, and Moon Festival Temari — while reaching 4800 points to trigger “Temari Grand Orbit”. After the banner, continue into endless pattern commissions.
- Lose condition: Three thread hearts fray, tangle meter reaches 100%, the commission timer expires, too many wrong-color wraps are locked, or three tension snaps occur in one run.
- Core loop:
  1. Start on a title/menu screen with Day 034 badge, mode badge “3D”, public route `/temari/`, best score, best Grand Orbit time, tutorial, prompt link, and a large Start button.
  2. Show a portrait-friendly craft table. A 3D temari ball floats in the center with readable front guide bands; a commission card sits above; spool/tension/pin controls sit below.
  3. A commission card requests goals such as: “Wrap 3 indigo north-south arcs, lock 4 gold pearl intersections, preserve jade diagonal symmetry, keep tangle under 35%.”
  4. Player rotates the ball or uses Ring −/+ and Pin −/+ controls to select a latitude/longitude/diagonal anchor position. The active pin glows with a large target reticle.
  5. Player sets Start Pin and End Pin, chooses silk color, then Wrap Thread. The thread animates along a curved great-circle or diagonal band; valid routes glow, wrong routes raise tangle and slack.
  6. Tighten/Loosen adjusts tension. Correct tension makes the thread lie against the ball and boosts score; too loose creates slack loops, too tight risks fray/snap.
  7. Pearl Pin locks an intersection and freezes over/under crossing order. Locking too early can trap later wraps and increase tangle.
  8. Undo Wrap removes one recent thread segment per commission but costs combo and time.
  9. Kagome Focus, charged by clean symmetry and safe tension, slows timers and overlays predicted crossings, front/back hidden arcs, safe tension bands, and next required intersections for a short window.
  10. Completing a commission stamps a washi seal, restores one thread heart if needed, awards points, and unlocks more diagonal bands, stricter over/under orders, faster fray, and denser pattern cards.
  11. Pause/restart remain available throughout.
- 15+ minute play-value strategy:
  - Save best score, fastest Temari Grand Orbit time, longest clean-wrap chain, highest endless commission, lowest tangle finish, fewest tension snaps, best symmetry score, most perfect pearl locks, and collected temari seal badges in localStorage.
  - Include three authored commissions:
    - First Star Wrap: broad anchor bands, two silk colors, slow fray, guided first Start/End pin, no thread-heart penalty during the first tutorial mistake.
    - Kagome Lantern Lattice: adds diagonal bands, gold pearl intersections, over/under crossing order, first tension snap risk, and Undo Wrap timing.
    - Moon Festival Temari: adds five-color symmetry, hidden back-side arcs, required Kagome Focus preview, limited pearl pins, and stricter tangle threshold.
  - Deterministic Day 034 seed varies guide-band order, anchor positions, required color sequences, hidden back arcs, tension sweet spots, fray timers, pearl-lock windows, tangle penalties, and endless constraints while keeping the opening fair.
  - Mastery badges: finish First Star Wrap with zero tangle warnings, trigger Grand Orbit under 275 seconds, complete Kagome Lantern Lattice with 90%+ symmetry, finish a commission without Undo Wrap, finish below 10% tangle, complete an endless temari with all thread hearts.
  - Strategic scoring rewards planning: rotate to inspect back-side arcs before locking, place structural north-south wraps first, save gold pins for actual intersections, adjust tension after every long wrap, use Undo before a bad crossing cascades, and save Kagome Focus for dense diagonal cards.
  - Endless mode after Grand Orbit adds narrower bands, trickier over/under orders, more colors, faster fray, fewer undo charges, and multi-hemisphere symmetry requests without shrinking touch controls.
- Difficulty scaling:
  - 0-45 seconds: broad rings, two colors, slow tangle, visible tutorial arrows, forgiving tension band.
  - 45-150 seconds: diagonal wraps, pearl pins, over/under order, hidden back arcs, Undo Wrap.
  - 150-275 seconds: five colors, limited pins, faster fray, required Kagome Focus preview, stricter symmetry/tangle goals.
  - 275+ seconds/endless: faster timers, denser patterns, same readable controls.
  - Keep mobile fair: ball, selected pins, thread arcs, color spools, tension/tangle indicators, commission card, helper, and action buttons must be large/readable at 390x844; primary touch buttons should be 52px+ where possible and never below 44px; no tiny survival-critical pins.
- Scoring/rewards:
  - Correct colored wrap along requested band: +130 points times combo tier.
  - Clean over/under crossing match: +150 points and Kagome Focus charge.
  - Pearl Pin locks a target intersection in the sweet window: +175 points and tangle relief.
  - Tension adjusted into safe band after a long wrap: +145 points.
  - Symmetric pair completed across the sphere: +280 bonus.
  - Commission complete below tangle target: +880 points and restore one thread heart if below max.
  - Perfect no-snap temari: +1160 points.
  - Temari Grand Orbit: +2400 points and endless commissions unlock.
  - Wrong color/wrong band: combo soft-reset, tangle +8%, symmetry score drops.
  - Tension snap/fray: thread-heart damage if threshold crossed, tangle +14%, combo reset.
  - Over-locking pearl pins: raises future route difficulty and lowers finish score.

## Controls and layout

- Desktop:
  - Mouse click/tap: press action buttons, select visible pins/spools, start/pause overlay button, prompt link, or explainable HUD chips.
  - Mouse drag on the 3D ball: rotate the temari camera/ball slowly; click-to-select must remain clear and non-ambiguous.
  - Arrow keys or A/D: select previous/next pin around the active ring.
  - W/S or Up/Down: switch active ring/band group.
  - Q/E: rotate the ball/camera left/right when no text field is focused.
  - 1/2/3/4/5: choose indigo, vermilion, gold, jade, or ivory silk.
  - Space or Enter: set pin / wrap thread depending on state.
  - T: Tighten or cycle tension upward.
  - L: Loosen or cycle tension downward.
  - P: Pearl Pin or pause if overlay is open; pause button must also exist visibly.
  - U: Undo Wrap.
  - Shift or F: Kagome Focus when charged.
  - R: restart current run.
- Mobile/touch:
  - Use large Ring −, Ring +, Pin −, Pin + controls plus optional direct tap on large visible pins.
  - Use large Silk Color, Start Pin, End Pin, Wrap Thread, Tighten, Loosen, Pearl Pin, Undo Wrap, Kagome Focus, Pause, Restart, and Prompt buttons.
  - Tapping tension/tangle/symmetry/spool chips may show short explanations.
  - No tiny virtual joystick. Interaction is ring/pin stepping, drag-to-orbit, color selection, pin setting, wrapping, tensioning, pearl locking, undo, focus, pause/restart.
- Mobile layout/orientation:
  - Default target is portrait phone play around 390x844; do not require landscape.
  - Top: compact temari HUD with score, best, thread hearts, tangle %, combo, active ring, selected silk color, Kagome Focus charge, and elapsed time. Use ball/thread/pin/spool/tension/kagome chips, not fan/pigment/pool/steam/flower/fruit/wood/shrine/tea/firework/cat/rabbit/brush/kite icons.
  - Below top: commission card with target colors, required rings/intersections, tension limit, pearl-pin requirements, symmetry score, and progress ticks.
  - Center: large 3D temari stage with readable sphere, thread arcs, front/back cues, pins, guide bands, selected route ghost, helper art, and feedback. It must remain playable without zooming.
  - Bottom: status helper plus large ring/action controls. Controls must not cover active pins, thread crossing warnings, tangle indicators, or commission progress.
  - Tutorial must fit on the first portrait screen; optional details may be collapsible but objective, ball rotation, ring/pin selection, start/end pins, silk color, wrap, tension, pearl pins, Undo Wrap, Kagome Focus, pause/restart must be visible.
  - Requests must combine text, symbols, line styles, icons, progress ticks, and patterns so hue alone is not required.

## Menu and tutorial

Implement these states:

1. Title screen
   - Shows title “Temari Thread Orbit Weaver”.
   - Shows Day 034 badge, mode badge “3D”, public route `/temari/`, best score, best Grand Orbit time if available, and a prompt link.
   - Shows a large Start button and visible tutorial panel by default.
   - Notes: “Audio starts after you press Start; visual thread, tangle, and tension cues work if muted.”
2. Tutorial text
   - Objective: “Wrap silk around the temari sphere, lock pearl intersections, match the pattern card, and keep tension safe.”
   - Selection: rotate the ball, choose a ring and pin, then set Start and End pins.
   - Silk: choose a color before wrapping; color plus band and crossing order decide score.
   - Tension: tighten loose threads, loosen before snaps, and watch the safe tension band.
   - Pearl pins: lock real intersections only after over/under order is correct.
   - Kagome Focus: slows the craft table and previews hidden arcs/crossings when charged.
   - Pause/restart: visible buttons on mobile; keyboard shortcuts on desktop.
3. In-game HUD
   - Score, best score, thread hearts, tangle %, commission name, combo, active ring/pin, selected silk color, tension band, symmetry, Kagome Focus charge, elapsed time, latest warning.
   - Pause/restart controls visible or immediately accessible.
4. Status helper
   - Non-blocking helper showing next target ring/color, tension advice, tangle warning, pearl-pin readiness, Kagome Focus readiness, and expected score effect.
   - Must not cover the 3D temari stage or bottom controls on mobile.
5. Pause overlay
   - Resume, restart, tutorial reminder, controls summary, audio/mute toggle, prompt link.
6. Game-over/results overlay
   - Final score, best score, commission reached, Grand Orbit status, clean-wrap chain, symmetry score, tangle finish, snaps/frays, badges, restart button.
7. Temari Grand Orbit banner
   - Trigger once per run after all three commissions and 4800 score.
   - Non-blocking celebration: the temari sphere rotates through completed silk constellations, pearl pins glint, lantern petals drift, the sparrow helper stamps a washi seal, and endless commissions continue after the banner fades.

## Assets

Prefer Imagegen2 (`openai/gpt-image-2`) for final visual art: sparrow threadkeeper helper mascot, portrait temari craft-room background, thread/spool/pin/tool icon sheet, and decorative Grand Orbit seal pieces. Three.js primitives may render the interactive sphere, thread arcs, pins, guide rings, tension glints, camera, particles, and UI chrome. Procedural code may crop, resize, alpha-clean, atlas-pack, optimize, animate, or place generated assets; it should not create final character/background/icon art from scratch unless Imagegen2 is unavailable after a real attempt.

Archive source generated art under `release/games/034/assets/source/` and use optimized playable copies under `release/games/034/assets/`. Also copy optimized playable assets into `apps/day-034-temari-thread-orbit-weaver/assets/` and the public alias `release/temari/assets/`.

For mobile-first crop safety: keep important content centered, leave 12-16% safe margins, avoid baked-in text, avoid watermarks, avoid fake UI labels, avoid tiny thread/tool details that disappear at final in-game size, and keep helper/temari/spool/pin/tension/focus silhouettes distinct against dark warm craft-room backgrounds.

Generate or provide at least these final art assets:

1. Sparrow threadkeeper helper mascot
   - Target: transparent PNG if possible, square source, final optimized texture around 512x512 or 256x256.
   - Archive path: `release/games/034/assets/source/temari-helper-source.png`
   - Optimized path: `release/games/034/assets/temari-helper.png`
   - Imagegen2 prompt: “A charming friendly Japanese sparrow threadkeeper mascot for a mobile 3D temari silk-thread weaving browser puzzle game, small suzume bird wearing a tiny indigo craft apron, holding a pearl pin and a gold silk spool, kind focused expression, warm lantern craft-room rim light, centered readable silhouette, transparent or solid warm ivory background, no checkerboard background, no text, no watermark, sprite-friendly, high contrast at small size.”
   - Aspect ratio: square.
2. Temari craft-room background source
   - Target: portrait-friendly background suitable behind a large 3D temari sphere stage with open readable center.
   - Archive path: `release/games/034/assets/source/temari-workroom-source.png`
   - Optimized path: `release/games/034/assets/temari-workroom.png`
   - Imagegen2 prompt: “A quiet Japanese temari craft room at night for a portrait mobile 3D textile puzzle game, low wooden table, silk thread spools in indigo vermilion gold jade and ivory, pearl pins, washi geometric pattern cards at the edges, small lanterns, lacquered wooden ring stand, soft amber shadows, open readable central table area for an interactive floating temari ball, crop-safe for phone portrait, no characters in the center, no readable text, no watermark.”
   - Aspect ratio: portrait.
3. Temari thread, spool, pin, tension, and pattern UI icon sheet source
   - Target: square icon sheet for objectives, hazards, tools, rewards, and UI decals.
   - Archive path: `release/games/034/assets/source/temari-icons-source.png`
   - Optimized path: `release/games/034/assets/temari-icons.png`
   - Imagegen2 prompt: “Small readable icon sheet for a Japanese temari silk-thread 3D puzzle game: temari ball, indigo silk spool, vermilion silk spool, gold silk spool, jade silk spool, ivory silk spool, pearl pin, start pin, end pin, tension gauge, loose loop, fray warning, knot lock, symmetry star, Kagome Focus lattice emblem, thread heart, Grand Orbit washi seal, transparent or solid warm ivory background, no checkerboard background, high contrast, no text, no watermark, generous margins so no icons are cut off.”
   - Aspect ratio: square.

If Imagegen2 is unavailable or fails after a real attempt, create a clearly labeled emergency fallback using simple SVG/Three.js sparrow/temari/spool/pin silhouettes, document the failure in `ai/postmortems/day-034.md`, and still keep source/fallback files under the same asset paths.

### Mandatory generated-image QA

For every generated image, include a real inspection step after generation and before integration:

- Analyze the actual generated file visually, not just the prompt text.
- For the sparrow helper mascot, verify transparent/cutout quality or clean background handling, readable friendly silhouette, centered pivot/crop margins, no unwanted text/watermarks, stable upright helper orientation, and that pin/spool pose does not imply incompatible movement or rotation.
- Verify control-to-motion alignment in-game: Ring −/+ must change the active guide band, Pin −/+ must move the target pin visibly around the ring, drag/orbit must rotate the ball as expected, Start/End Pin must mark two readable anchors, Silk Color must change route color, Wrap Thread must draw the intended curved arc, Tighten/Loosen must visibly change tension/tangle feedback, Pearl Pin must lock an actual intersection, Undo Wrap must remove the intended recent arc, and Kagome Focus must slow/preview hidden arcs and crossings.
- For the background, verify the central temari stage remains readable after portrait mobile crop and does not hide the sphere, guide rings, thread arcs, selected pins, commission card, helper, or controls.
- For the icon sheet, verify temari ball, silk spools, pearl/start/end pins, tension gauge, loose loop, fray warning, knot lock, symmetry star, Kagome Focus, thread heart, and Grand Orbit seal are distinct at final HUD/button size and cannot be confused. Watch specifically for fake checkerboard transparency; alpha-clean or composite onto warm ivory if needed and inspect again.
- If inspection finds a problem, regenerate or post-process the image and inspect again. Do not ship broken visual assets just because tests pass.

## Audio and game feel

Because silk wrapping, pin locking, tension adjustment, fray danger, and quiet craft-room atmosphere are central to the theme, include lightweight WebAudio cues initialized only after a user gesture:

- Soft wooden tick when selecting a ring or pin.
- Silk spool flutter when changing color.
- Thread whoosh when Wrap Thread draws an arc.
- Pearl click when locking an intersection.
- Gentle tension twang when Tighten/Loosen enters safe band.
- Sharp fray pluck when tension nears snap.
- Cloth rustle when Undo Wrap removes a segment.
- Lattice bell shimmer when Kagome Focus activates.
- Rising koto/temari bell arpeggio when Temari Grand Orbit triggers.

Audio must not block play if WebAudio is unavailable. Verify no autoplay errors: audio context should be created/resumed only after Start or another user interaction. Include a visible mute toggle in pause/results or HUD.

## Prompt page output

The archived `release/games/034/prompt.html` must be a consistent rendered HTML page, not raw Markdown pasted into a `<pre>` block. It should include:

- A clear `<title>` and `<h1>` using `Day 034 Game Generation Prompt`.
- A back-to-game link near the top.
- Semantic rendered sections (`h2`, `h3`, `ul/ol/li`, `p`, `pre/code` only for actual code/commands).
- The same readable prompt-page style pattern across days so prompt pages feel like one system.

## Subagents to dispatch

1. Implementation subagent
   - Build the static 3D game under `apps/day-034-temari-thread-orbit-weaver/`.
   - Integrate it into immutable release output under `release/games/034/`.
   - Create the public playable route under `release/temari/`.
   - Use static HTML/CSS/JS with Three.js/WebGL/WebAudio and no backend.
   - The public alias must be self-contained or asset paths must be alias-safe.
   - If vendoring `three.module*.js`, also copy the matching `three.core*.js` beside it in the app, release archive, and `/temari/` alias assets.
2. Asset/polish subagent
   - Generate/prepare Imagegen2 assets, archive source files, optimize playable copies, inspect generated images, remove fake checkerboards if present, and tune mobile readability/game feel.
3. QA/browser/mobile subagent
   - Run desktop and mobile smoke checks, verify no console errors, verify menu/tutorial/objective/controls/restart/pause, prompt links, 3D temari render, Ring/Pin controls, Start/End Pin, Silk Color, Wrap Thread, Tighten/Loosen, Pearl Pin, Undo Wrap, Kagome Focus control presence, tension/tangle/symmetry feedback, generated screenshot, generated assets, WebAudio initialization after user gesture, and 390x844 portrait layout.
4. Reflection/self-improvement subagent
   - Write `ai/postmortems/day-034.md` after validation with what worked, what failed, generated-image inspection notes, audio verification, code-isolation confirmation, and whether generator/template/rubric improvements are justified.

## Acceptance criteria

- Static build passes.
- Code isolation is documented in QA/postmortem: no previous game implementation code was opened, inspected, copied, diffed, grepped, or adapted.
- Mode choice follows the cadence rule: Day 034 is real `3d` after Day 033 `2d`, with spherical thread wrapping, curved-surface pins, guide bands, front/back arcs, tension, and crossing order that matter mechanically.
- Desktop smoke passes.
- Mobile portrait smoke passes at about 390x844 with readable HUD/tutorial/commission card, usable 44px+ ring/pin/action/pause/restart controls, no forced landscape canvas, and no tiny survival-critical pins.
- Prompt is visible from gallery and release folder.
- `prompts/day-034.md` is copied exactly to `release/games/034/prompt.md` and `release/temari/prompt.md`.
- `release/games/034/prompt.html` and `release/temari/prompt.html` render the prompt in browser-readable semantic HTML with the standard prompt-page styling, not a raw Markdown `<pre>` dump.
- Public alias `release/temari/index.html`, `release/temari/prompt.html`, `release/temari/screenshot.png`, and `release/temari/assets/` exist and work.
- Gallery card for Day 034 shows prompt availability, generation duration, public `/temari/` links, mode `3d`, and actual generated date.
- Screenshot exists at `release/games/034/screenshot.png` and is non-empty/readable. Prefer a readable desktop gameplay screenshot for gallery cards; mobile screenshots are QA evidence unless the design is intentionally portrait-card friendly.
- Image/source assets exist under `release/games/034/assets/source/` and optimized assets exist under `release/games/034/assets/`, or a documented emergency fallback exists.
- Every generated image has an inspection note in the postmortem or QA notes; interactive temari/thread/pin/tool visuals have verified background handling, orientation/pivot/crop, readability, and control-to-motion alignment.
- WebAudio initializes after user gesture and creates no autoplay console errors; audio is failsafe if unsupported and visual thread/tension/tangle cues remain playable muted.
- No console errors during desktop or mobile smoke. Add data-URI favicons to game and prompt pages if needed to avoid favicon request noise.
- Existing `release/games/001/**` through `release/games/033/**` from origin/main remain unchanged.
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
# Screenshot/static checks: verify release/games/034/screenshot.png, prompt.md, prompt.html, index.html, game.js, styles.css, release/temari/index.html, release/temari/prompt.html, release/temari/screenshot.png, optimized assets, source assets, and vendored Three.js files (if used) exist and are non-empty.
# Prompt copy check: cmp prompts/day-034.md release/games/034/prompt.md and cmp prompts/day-034.md release/temari/prompt.md.
# Prompt HTML check: verify release/games/034/prompt.html has semantic h1/h2/list markup and a back-to-game link, not a raw Markdown dump inside <pre>, and no malformed ul > p or ol > p nodes.
# Browser smoke: open the local/static /temari/ route and verify menu, tutorial, gameplay start, 3D temari render, Ring −/+, Pin −/+, Start/End Pin, Silk Color, Wrap Thread, Tighten/Loosen, Pearl Pin, Undo Wrap, Kagome Focus, tension/tangle/symmetry feedback, pause, restart, prompt page, WebAudio after user gesture, no console errors.
# Mobile smoke: repeat at a portrait phone viewport such as 390x844 and verify playable ring/pin/action controls plus readable HUD/commission card/stage/controls.
# Static screenshot check: inspect release/games/034/screenshot.png and release/temari/screenshot.png for non-empty readable game content; use vision to judge actual visual quality.
# Image QA: inspect every Imagegen2 source/optimized asset and document the actual inspection result in ai/postmortems/day-034.md.
# Docker/static smoke: build the Docker image locally, run it, curl /temari/ and /temari/prompt.html, then stop the container.
# Immutable guard: confirm no release/games folders from origin/main changed except new Day 034.
```
