# Day 023 Game Generation Prompt

## Game identity

- Day: 023
- Title: Sumi Ink Seal Scribe
- Slug: sumi-ink-seal-scribe
- Public route word: sumi
- Mode: 2D
- Genre: mobile-first brush-stroke precision arcade / calligraphy pressure puzzle score chase
- Mood/style: moonlit calligraphy studio with creamy washi paper, smoky black sumi ink, vermilion hanko seals, wet brush gloss, gold dust accents, ink-wash cranes, sliding poem cards, small fox-scribe apprentice mascot, tactile brush-drag feedback; focused mark-making and ink-pressure planning rather than 3D sky kites, dry-garden leaf routing, underwater diving, matsuri rhythm lanes, shrine tilt mazes, silver webs, pottery sculpting, bamboo canal routing, origami folding, rainy sheltering, snow stacking, textile stamping, cooking, windbell tuning, rail running, or lantern/koi collection.

## Why this game today

The generated series currently ends with:

- Day 020 `3d`: underwater pearl cartography with diver, oxygen, guide shells, current ribbons, air bells, and jellyfish depth lanes.
- Day 021 `hybrid`: autumn karesansui sand-ripple routing with raked paths, standing stones, maple leaves, basins, moss/no-rake zones, and a tanuki guide.
- Day 022 `3d`: nebuta kite sky cartography with ordered star nodes, thread tension, wind ribbons, shrine beacons, cloud tangles, and a kitsune kite mascot.

The latest generated-mode streak is one `3d`; latest 2D streak is zero. Day 023 deliberately chooses `2D` because the recent run already supplied strong 3D/hybrid cadence, and the series benefits from a close-up tactile input game that is genuinely mobile-first rather than another deep spatial navigation scene. The new verb set is brush-calligraphy: drag short ink strokes, manage brush wetness and pressure, match stroke order, place vermilion seals, dry paper before blot spread, and complete poem cards with readable first-screen touch controls.

Recent screenshot/visual variety notes to avoid repeating:

- Day 020 used teal underwater fog, kelp towers, pearl beacons, oxygen rings, diver mascot, and blue shell controls.
- Day 021 used warm beige dry-garden boards, moss islands, standing stones, maple leaves, tanuki mascot, and brown/orange rake controls.
- Day 022 used dark cobalt sky, giant title/mission card, star-thread checklist, kite mascot, altitude/tension HUD, and blue/pink action buttons.

Day 023 should shift to a light/dark ink-studio composition: warm washi paper panels over a charcoal table, glossy black brush strokes, red seal marks, gold scoring sparks, ink-wash edge blooms, and a calm fox-scribe helper. Avoid blue sky/underwater palettes, star/kite/thread/depth language, beige sand gardens, maple leaves as core pieces, pearl/oxygen UI, taiko/rhythm pads, maze tilt boards, web circles/anchors, clay profiles, bamboo pipes, origami crease grids, parasols/rain, snow blocks, kimono motif stamping, and generic drawing-app placeholders.

## Code isolation / no previous game source

The implementation must be written from scratch for this day. Do not open, inspect, copy, diff, grep, or adapt code from previous games, including old `apps/day-*` folders, old `release/games/NNN/` HTML/CSS/JS files, or old public alias folders. You may inspect previous metadata, prompts, postmortems, and screenshots only to avoid repeating concepts and visual identity. The new game's HTML/CSS/JS must come from this prompt and general browser/canvas/WebAudio game knowledge, not from earlier game implementations.

## Mode variety / 3D cadence

Inspection target: `src/data/games.ts` currently ends with Day 020 `3d`, Day 021 `hybrid`, and Day 022 `3d`. The latest generated-mode streak is one `3d`; latest 2D streak is zero.

Mode decision: Day 023 is `2D`. This is allowed and intentional because it follows 3D/hybrid/3D variety and does not extend a 2D streak. The 2D implementation must still be high-quality and mechanically rich:

- Use static-browser HTML/CSS/JS with a canvas-based calligraphy board and semantic UI; no backend.
- Render a portrait-first ink-studio playfield with real brush path input, pressure/wetness simulation, drying timers, target stroke silhouettes, vermilion seal placement, blot hazards, poem card objectives, and scoring feedback.
- Gameplay must depend on 2D state: stroke direction, stroke order, brush wetness, pressure/width, paper dryness, target coverage, blot spread, seal position, card timer, and combo quality.
- Player actions must manipulate the system: draw strokes, choose fine/loaded brush mode, lift/dry the brush, blot a mistake with rice paper, stamp a hanko seal, activate Calm Breath to slow blot spread, pause/restart, and inspect tutorial hints.
- Portrait mobile is the default supported layout; no landscape gate.

## Design

- Objective: Complete calligraphy poem cards by drawing requested sumi strokes in order, balancing ink wetness and pressure, preventing blots from spreading, and finishing each card with a clean vermilion seal.
- Win condition: Complete three poem commissions — First Moon Stroke, Crane Poem Margin, and Vermilion Festival Scroll — while reaching 3700 points to trigger “Sumi Master Seal”. After the ceremony, continue into endless scroll commissions.
- Lose condition: Three paper-heart margins tear, the card timer expires, ink blots cover more than 35% of the active card, too many strokes are drawn out of order, or a required seal is misplaced three times.
- Core loop:
  1. Start on a title/menu screen with Day 023 badge, mode badge “2D”, public route `/sumi/`, best score, best Master Seal time, tutorial, prompt link, and a large Start button.
  2. Show a portrait-friendly washi board: a current poem card in the center, ghost stroke silhouettes, brush cursor/preview, wet ink trail, drying shimmer, blot danger rings, vermilion seal target, and a small fox-scribe helper.
  3. A commission card requests goals, for example: “Trace 4 moon strokes in order, keep blot under 18%, place seal inside red corner, finish with 2 Fine Brush strokes.”
  4. Player draws short strokes by dragging/touching the canvas. The stroke must roughly follow target direction and coverage; clean starts/ends, controlled curve, and correct order build combo.
  5. Brush wetness decreases while drawing. Loaded Brush creates bold strokes and faster coverage but raises blot risk; Fine Brush gives control and lower risk but lower coverage/score.
  6. Paper dries over time. Drawing too much wet ink on one patch creates spreading blots. Rice Paper Dab can rescue a small blot but costs combo unless used before the blot ring expands.
  7. Hanko Seal is placed after required strokes. Correct seal placement banks the card, awards points, repairs one margin heart if needed, and unlocks the next card.
  8. Calm Breath, charged by accurate strokes, slows timers/blot spread and shows stroke-order hints for a short window.
  9. Pause/restart remain available throughout.
- 15+ minute play-value strategy:
  - Save best score, fastest Sumi Master Seal time, longest clean stroke chain, highest endless commission, fewest blot dabs, best seal accuracy, lowest final blot percentage, and collected calligraphy seals in localStorage.
  - Include three authored commissions:
    - First Moon Stroke: broad horizontal/diagonal strokes, large ghost targets, low blot risk, one seal corner, no penalty during first guided stroke.
    - Crane Poem Margin: adds curved strokes, alternating Fine/Loaded brush goals, moving drying bands, first blot hazard, and Rice Paper Dab tutorial.
    - Vermilion Festival Scroll: adds multi-part radicals, stricter stroke order, seal alignment, damp paper zones, shorter timer, and Calm Breath route preview.
  - Deterministic Day 023 seed varies ghost stroke shapes, target order, wetness decay, paper grain, blot growth, seal target position, gold bonus flakes, and endless constraints while keeping the opening fair.
  - Mastery badges: finish First Moon Stroke without a blot, trigger Master Seal under 230 seconds, complete 24 requested strokes in clean order, finish a card below 8% blot, place 10 perfect seals, complete an endless scroll with all paper hearts.
  - Strategic scoring rewards planning: use Loaded Brush only on broad targets, switch to Fine Brush for tight corners, lift early to prevent wet pooling, dab blots before they spread, save Calm Breath for multi-stroke radicals, and stamp seals only after the paper dries enough.
  - Endless mode after Sumi Master Seal adds more compact radicals, offset seal targets, faster wetness decay, damp paper zones, fewer dab charges, and mixed brush-mode requirements without shrinking touch controls.
- Difficulty scaling:
  - 0-45 seconds: broad ghost strokes, generous coverage threshold, slow timer, one seal target, safe paper grain, guided first stroke.
  - 45-130 seconds: curved strokes, two brush modes, first blot growth, drying shimmer, Rice Paper Dab introduced.
  - 130-230 seconds: multi-part radicals, strict order, damp paper zones, seal precision, Calm Breath timing, faster timer.
  - 230+ seconds/endless: denser scrolls, shorter dry windows, fewer dabs, same readable controls.
  - Keep mobile fair: stroke targets, brush preview, blot rings, seal target, card timer, and helper cues must be large and readable at 390x844; primary touch buttons must be 52px+; no tiny survival-critical marks.
- Scoring/rewards:
  - Correct stroke in order: +115 points times combo tier.
  - Excellent coverage/angle within target: +70 bonus.
  - Clean pressure/wetness finish: +85 bonus.
  - Correct Hanko Seal: +260 points and Calm Breath charge.
  - Blot prevented with early Rice Paper Dab: +90 points.
  - Commission complete below blot target: +610 points and repair one paper heart if below max.
  - Perfect no-blot card: +760 points.
  - Sumi Master Seal: +1400 points and endless scroll commissions unlock.
  - Out-of-order stroke: combo soft-reset and blot risk +5%.
  - Over-wet blot spread: paper-heart damage if threshold crossed, combo reset.
  - Misplaced seal: card progress delay and margin stress +8%.

## Controls and layout

- Desktop:
  - Mouse click/tap/drag: draw brush strokes on the active washi card, press action buttons, stamp seal, start/pause, prompt link, or explainable HUD chips.
  - Arrow keys or WASD: nudge the brush preview / select next ghost stroke hint.
  - 1: Fine Brush.
  - 2: Loaded Brush.
  - Space or Enter: lift/dry brush, confirm start, or stamp when seal mode is active.
  - D: Rice Paper Dab.
  - S: Hanko Seal mode.
  - Shift or B: Calm Breath when charged.
  - P: pause/resume.
  - R: restart current run.
- Mobile/touch:
  - Drag directly on the washi card to draw strokes; taps on target chips explain the current requested stroke.
  - Use large Fine Brush, Loaded Brush, Lift/Dry, Rice Paper Dab, Hanko Seal, Calm Breath, Pause, Restart, and Prompt buttons.
  - Optional long-press pressure simulation can be supported, but visible brush-mode buttons are mandatory.
  - No tiny virtual joystick. Interaction is direct stroke drawing plus large action buttons.
- Mobile layout/orientation:
  - Default target is portrait phone play around 390x844; do not require landscape.
  - Top: compact ink-studio HUD with score, best, paper hearts, blot %, combo, brush mode, ink wetness, and time. Use paper/ink/seal chips, not sky/underwater/garden/depth chips.
  - Below top: commission card with requested stroke order, coverage target, blot limit, seal requirement, brush-mode goal, and progress ticks.
  - Center: large washi card/canvas with ghost strokes, active ink trail, brush preview, blot rings, seal target, dry shimmer, and fox-scribe helper. The active draw area must remain large enough for thumb/finger input.
  - Bottom: status helper plus large brush/action controls. Controls must not cover the active stroke target or seal corner.
  - Tutorial must fit on the first portrait screen; optional details may be collapsible but objective, drawing, Fine/Loaded brush, wetness, blot, Rice Paper Dab, Hanko Seal, Calm Breath, pause/restart must be visible.
  - Requests must combine text, symbols, stroke numbers, line styles, and labels so hue alone is not required.

## Menu and tutorial

Implement these states:

1. Title screen
   - Shows title “Sumi Ink Seal Scribe”.
   - Shows Day 023 badge, mode badge “2D”, public route `/sumi/`, best score, best Master Seal time if available, and a prompt link.
   - Shows a large Start button and visible tutorial panel by default.
   - Notes: “Audio starts after you press Start; visual ink/blot cues work if muted.”
2. Tutorial text
   - Objective: “Trace sumi strokes in order, control brush wetness, prevent blots, and finish each scroll with a vermilion seal.”
   - Drawing: drag through ghost strokes; clean direction and coverage build combo.
   - Brush modes: Fine Brush is safe and precise; Loaded Brush is bold but can blot.
   - Wetness/blots: lift/dry between wet patches; use Rice Paper Dab early before blots spread.
   - Seal: place the Hanko Seal inside the red target corner after required strokes.
   - Calm Breath: slows blot spread and reveals stroke-order hints when charged.
   - Pause/restart: P/R on desktop or visible buttons on mobile.
3. In-game HUD
   - Score, best score, paper hearts, blot %, commission name, combo, brush mode, wetness, elapsed time, requested stroke order, coverage progress, seal status, dab charges, Calm Breath charge, latest warning.
   - Pause/restart controls visible or immediately accessible.
4. Status helper
   - Non-blocking helper showing active brush, next stroke number, angle/coverage advice, wetness risk, blot warning, seal readiness, and expected score effect.
   - Must not cover the washi card or bottom controls on mobile.
5. Pause overlay
   - Resume, restart, tutorial reminder, controls summary, audio/mute toggle, prompt link.
6. Game-over/results overlay
   - Final score, best score, commission reached, Master Seal status, clean stroke chain, blot finish, seal accuracy, dabs used, mastery badges, restart button.
7. Sumi Master Seal banner
   - Trigger once per run after all three commissions and 3700 score.
   - Non-blocking ceremony: black ink strokes bloom into a crane silhouette, vermilion seals glow, gold dust sparks around the scroll edge, fox-scribe bows, and endless scroll commissions continue after the banner fades.

## Assets

Prefer Imagegen2 (`openai/gpt-image-2`) for final visual art: fox-scribe mascot, moonlit calligraphy studio/washi background, ink/seal/brush icon sheet, and decorative scroll/hanko pieces. Canvas code may render the interactive ghost strokes, ink paths, blot masks, brush cursor, seal target, particles, UI chrome, hit testing, and fallback debug shapes. It should not create final character/background/icon art from scratch unless Imagegen2 is unavailable after a real attempt.

Archive source generated art under `release/games/023/assets/source/` and use optimized playable copies under `release/games/023/assets/`. Also copy optimized playable assets into `apps/day-023-sumi-ink-seal-scribe/assets/` and the public alias `release/sumi/assets/`.

For mobile-first crop safety: keep important content centered, leave 12-16% safe margins, avoid baked-in text, avoid watermarks, avoid fake UI labels, avoid tiny kanji/poem marks that disappear at final in-game size, and keep brush/ink/seal/blot/paper silhouettes distinct against warm washi and charcoal backgrounds.

Generate or provide at least these final art assets:

1. Fox-scribe calligraphy apprentice mascot
   - Target: transparent PNG if possible, square source, final optimized texture around 512x512 or 256x256.
   - Archive path: `release/games/023/assets/source/sumi-scribe-source.png`
   - Optimized path: `release/games/023/assets/sumi-scribe.png`
   - Imagegen2 prompt: “A charming friendly Japanese fox calligraphy apprentice mascot for a mobile 2D sumi ink browser arcade game, small kitsune wearing a simple indigo studio apron, holding a bamboo ink brush and tiny vermilion hanko seal, gentle focused smile, warm lantern rim light, centered readable silhouette, transparent or solid warm washi paper background, no checkerboard background, no text, no watermark, sprite-friendly, high contrast at small size.”
   - Aspect ratio: square.
2. Moonlit calligraphy studio / washi desk background source
   - Target: portrait-friendly background suitable behind a large interactive washi paper card with an open readable center.
   - Archive path: `release/games/023/assets/source/sumi-studio-source.png`
   - Optimized path: `release/games/023/assets/sumi-studio.png`
   - Imagegen2 prompt: “A refined Japanese moonlit calligraphy studio for a portrait mobile brush-stroke game, charcoal writing table, creamy washi paper sheets, black sumi ink stone, bamboo brush rest, small red hanko seal, soft lantern and moonlight, gold dust accents, subtle ink-wash cranes at the edges, open readable center area for an interactive scroll, crop-safe for phone portrait, no characters, no readable text, no watermark.”
   - Aspect ratio: portrait.
3. Ink, brush, seal, blot, paper, and UI icon sheet source
   - Target: square icon sheet for objectives, hazards, tools, rewards, and UI decals.
   - Archive path: `release/games/023/assets/source/sumi-icons-source.png`
   - Optimized path: `release/games/023/assets/sumi-icons.png`
   - Imagegen2 prompt: “Small readable icon sheet for a Japanese sumi calligraphy pressure puzzle game: bamboo brush, fine brush tip, loaded ink brush, black ink drop, wetness ring, spreading blot hazard, rice paper dab, vermilion hanko seal, paper-heart margin, gold dust combo spark, Calm Breath seal, stroke-order ghost mark, Sumi Master Seal emblem, transparent or solid warm washi background, no checkerboard background, high contrast, no text, no watermark, generous margins so no icons are cut off.”
   - Aspect ratio: square.

If Imagegen2 is unavailable or fails after a real attempt, create a clearly labeled emergency fallback using simple SVG/canvas ink silhouettes, document the failure in `ai/postmortems/day-023.md`, and still keep source/fallback files under the same asset paths.

### Mandatory generated-image QA

For every generated image, include a real inspection step after generation and before integration:

- Analyze the actual generated file visually, not just the prompt text.
- For the fox-scribe mascot, verify transparent/cutout quality or clean background handling, readable friendly silhouette, centered pivot/crop margins, no unwanted text/watermarks, stable upright orientation, and that the brush/seal pose does not imply an incompatible movement direction.
- Verify control-to-motion alignment in-game: drag strokes must create ink where the finger/mouse moves, Fine/Loaded Brush must visibly change width/wetness, Lift/Dry must reduce wetness risk, Rice Paper Dab must shrink intended blot areas, Hanko Seal must stamp at the intended target position, Calm Breath must slow/reveal as described, and wrong-order/blot feedback must affect intended areas.
- For the background, verify the center play area remains readable after portrait mobile crop and does not hide ghost strokes, ink path, blot rings, seal target, commission card, helper, or controls.
- For the icon sheet, verify brush modes, ink, wetness, blot, dab, hanko seal, paper heart, combo spark, Calm Breath, ghost stroke, and Master Seal emblem are distinct at final HUD/button size and cannot be confused. Watch specifically for fake checkerboard transparency; alpha-clean or composite onto warm washi if needed and inspect again.
- If inspection finds a problem, regenerate or post-process the image and inspect again. Do not ship broken visual assets just because tests pass.

## Audio and game feel

Because brush strokes, ink wetness, blot spread, and seal stamping are central to the theme, include lightweight WebAudio cues initialized only after a user gesture:

- Soft brush-swish while drawing, with pitch/length based on stroke length and mode.
- Wet ink plop warning when a blot starts spreading.
- Dry paper rustle when Lift/Dry succeeds.
- Gentle paper dab sound for Rice Paper Dab.
- Crisp vermilion stamp thump when a Hanko Seal lands.
- Breath bell shimmer when Calm Breath activates.
- Rising koto/ink-bloom arpeggio when Sumi Master Seal triggers.

Audio must not block play if WebAudio is unavailable. Verify no autoplay errors: audio context should be created/resumed only after Start or another user interaction. Include a visible mute toggle in pause/results or HUD.

## Prompt page output

The archived `release/games/023/prompt.html` must be a consistent rendered HTML page, not raw Markdown pasted into a `<pre>` block. It should include:

- A clear `<title>` and `<h1>` using `Day 023 Game Generation Prompt`.
- A back-to-game link near the top.
- Semantic rendered sections (`h2`, `h3`, `ul/ol/li`, `p`, `pre/code` only for actual code/commands).
- The same readable prompt-page style pattern across days so prompt pages feel like one system.

## Subagents to dispatch

1. Implementation subagent
   - Build the static 2D game under `apps/day-023-sumi-ink-seal-scribe/`.
   - Integrate it into immutable release output under `release/games/023/`.
   - Create the public playable route under `release/sumi/`.
   - Use static HTML/CSS/JS with Canvas/WebAudio and no backend.
   - The public alias must be self-contained or asset paths must be alias-safe.
2. Asset/polish subagent
   - Generate/prepare Imagegen2 assets, archive source files, optimize playable copies, inspect generated images, remove fake checkerboards if present, and tune mobile readability/game feel.
3. QA/browser/mobile subagent
   - Run desktop and mobile smoke checks, verify no console errors, verify menu/tutorial/objective/controls/restart/pause, prompt links, canvas render, stroke drawing, Fine/Loaded Brush, Lift/Dry, Rice Paper Dab, Hanko Seal, Calm Breath control presence, blot feedback, commission completion feedback, generated screenshot, generated assets, WebAudio initialization after user gesture, and 390x844 portrait layout.
4. Reflection/self-improvement subagent
   - Write `ai/postmortems/day-023.md` after validation with what worked, what failed, generated-image inspection notes, audio verification, code-isolation confirmation, and whether generator/template/rubric improvements are justified.

## Acceptance criteria

- Static build passes.
- Code isolation is documented in QA/postmortem: no previous game implementation code was opened, inspected, copied, diffed, grepped, or adapted.
- Mode choice follows the cadence rule: Day 023 is `2d` after Day 022 `3d` with zero latest 2D streak, and the mechanic is rich direct brush-stroke gameplay rather than a low-effort flat demo.
- Desktop smoke passes.
- Mobile portrait smoke passes at about 390x844 with readable HUD/tutorial/commission card, large washi draw area, usable 52px+ brush/action/pause/restart controls, no forced landscape canvas, and no tiny survival-critical marks.
- Prompt is visible from gallery and release folder.
- `prompts/day-023.md` is copied exactly to `release/games/023/prompt.md` and `release/sumi/prompt.md`.
- `release/games/023/prompt.html` and `release/sumi/prompt.html` render the prompt in browser-readable semantic HTML with the standard prompt-page styling, not a raw Markdown `<pre>` dump.
- Public alias `release/sumi/index.html`, `release/sumi/prompt.html`, `release/sumi/screenshot.png`, and `release/sumi/assets/` exist and work.
- Gallery card for Day 023 shows prompt availability, generation duration, public `/sumi/` links, mode `2d`, and actual generated date.
- Screenshot exists at `release/games/023/screenshot.png` and is non-empty/readable. Prefer a readable desktop gameplay screenshot for gallery cards; mobile screenshots are QA evidence unless the design is intentionally portrait-card friendly.
- Image/source assets exist under `release/games/023/assets/source/` and optimized assets exist under `release/games/023/assets/`, or a documented emergency fallback exists.
- Every generated image has an inspection note in the postmortem or QA notes; interactive brush/ink/seal visuals have verified background handling, orientation/pivot/crop, readability, and control-to-motion alignment.
- WebAudio initializes after user gesture and creates no autoplay console errors; audio is failsafe if unsupported and visual ink/blot cues remain playable muted.
- No console errors during desktop or mobile smoke. Add data-URI favicons to game and prompt pages if needed to avoid favicon request noise.
- Existing `release/games/001/**` through `release/games/022/**` from origin/main remain unchanged.
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
# Screenshot/static checks: verify release/games/023/screenshot.png, prompt.md, prompt.html, index.html, game.js, styles.css, release/sumi/index.html, release/sumi/prompt.html, release/sumi/screenshot.png, optimized assets, and source assets exist and are non-empty.
# Prompt copy check: cmp prompts/day-023.md release/games/023/prompt.md and cmp prompts/day-023.md release/sumi/prompt.md.
# Prompt HTML check: verify release/games/023/prompt.html has semantic h1/h2/list markup and a back-to-game link, not a raw Markdown dump inside <pre>, and no malformed ul > p or ol > p nodes.
# Browser smoke: open the local/static /sumi/ route and verify menu, tutorial, gameplay start, canvas render, stroke drawing, Fine/Loaded Brush, Lift/Dry, Rice Paper Dab, Hanko Seal, Calm Breath control presence, blot feedback, seal/commission feedback, pause, restart, prompt page, WebAudio after user gesture, no console errors.
# Mobile smoke: repeat at a portrait phone viewport such as 390x844 and verify playable direct-drag drawing plus readable HUD/commission card/washi playfield/controls.
# Static screenshot check: inspect release/games/023/screenshot.png and release/sumi/screenshot.png for non-empty readable game content; use vision to judge actual visual quality.
# Image QA: inspect every Imagegen2 source/optimized asset and document the actual inspection result in ai/postmortems/day-023.md.
# Docker/static smoke: build the Docker image locally, run it, curl /sumi/ and /sumi/prompt.html, then stop the container.
# Immutable guard: confirm no release/games folders from origin/main changed except new Day 023.
```
