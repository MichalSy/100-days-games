# Day 029 Game Generation Prompt

## Game identity

- Day: 029
- Title: Hinoki Kumiko Screenwright
- Slug: hinoki-kumiko-screenwright
- Public route word: hinoki
- Mode: 2D
- Genre: mobile-first tactile woodworking / kumiko lattice placement puzzle / precision craft score chase
- Mood/style: warm hinoki carpentry atelier at late afternoon, pale cypress wood grain, shoji paper glow, brass measuring squares, soft sawdust motes, indigo blueprint cards, tiny wooden sparrow apprentice, crisp kumiko lattice geometry, calming but precise handcraft feedback; direct 2D strip placement, trimming, clamping, and grain-stress management rather than shrine stealth routing, matcha whisking, fireworks arcs, koban pachinko, mochi hopping, sumi tracing, kite cartography, dry-garden raking, underwater navigation, taiko rhythm lanes, daruma rolling, web weaving, pottery shaping, bamboo canals, origami folding, parasols, snow stacking, kimono stamping, bento cooking, windbell tuning, rail running, or koi collection.

## Why this game today

The generated series currently ends with:

- Day 026 `3d`: Natsu fireworks sky painting with 3D launch arcs, fuse timing, sky rings, smoke management, and dark festival visuals.
- Day 027 `2d`: Haru matcha whisking with circular bowl input, foam/clump/temperature/bitterness management, and pale spring tea-room visuals.
- Day 028 `3d`: Akane foxfire shrine sentinel with 3D torii paths, lantern light pools, patrol cones, wisp escorting, and dark crimson shrine visuals.

The latest generated-mode streak is one `3d` (Day 028). Day 029 deliberately chooses `2D` because it follows a 3D day and the series benefits from a quiet, tactile, portrait-first precision puzzle that is not another route escort, sky shooter, circular bowl, or stealth scene. The new verb set is woodworking craft: select hinoki strips, rotate them into a kumiko lattice blueprint, trim notches, clamp intersections, plane raised edges, manage grain stress, and complete three shoji screen panels.

Recent screenshot/visual variety notes to avoid repeating:

- Day 028 used dark violet/crimson shrine corridors, torii gates, lantern pools, foxfire wisps, shadow cones, and many purple HUD chips.
- Day 027 used pale tea-room greens, a large round matcha bowl, foam pearls, clumps, temperature/bitterness cards, and soft cream UI.
- Day 026 used indigo night sky, bright firework trails/rings/bursts, smoke ribbons, launch racks, and tanuki pyrotechnician art.

Day 029 should shift to a warm cypress workbench and geometric handcraft: pale golden hinoki boards, shoji paper rectangles, diagonal/vertical lattice strips, blueprint guides, brass measuring tools, clamps, a small wooden sparrow helper, curled sawdust, sharp chisel taps, and clean joinery satisfaction. Avoid torii patrol routes/foxfire/lantern-order stealth, matcha bowls/foam/whisks/temperature, fireworks/night-sky shells/rings/smoke, pachinko cabinets/coins/cats, moon rabbits/mochi pads, sumi brush strokes, kite thread star maps, dry sand/stone boards, underwater oxygen/pearls, drum pads, tilt mazes, silk web anchors, spinning pottery profiles, bamboo pipe irrigation, origami crease routes, parasol rain processions, snow blocks, kimono cloth panels, restaurant timers, or generic Tetris blocks.

## Code isolation / no previous game source

The implementation must be written from scratch for this day. Do not open, inspect, copy, diff, grep, or adapt code from previous games, including old `apps/day-*` folders, old `release/games/NNN/` HTML/CSS/JS files, or old public alias folders. You may inspect previous metadata, prompts, postmortems, and screenshots only to avoid repeating concepts and visual identity. The new game's HTML/CSS/JS must come from this prompt and general browser/canvas/WebAudio game knowledge, not from earlier game implementations.

## Mode variety / 3D cadence

Inspection target: `src/data/games.ts` currently ends with Day 026 `3d`, Day 027 `2d`, and Day 028 `3d`. The latest generated-mode streak is one `3d`; latest 2D streak is zero.

Mode decision: Day 029 is `2D`. This is allowed and intentional because it follows a 3D day and does not extend a 2D streak. The implementation must still be mechanically rich and visually polished:

- Use static-browser HTML/CSS/JS with a canvas-based or DOM/canvas hybrid workbench, grid/blueprint state, movable lattice strips, notch/clamp/plane actions, grain stress, mistake tracking, and semantic UI; no backend.
- Render a portrait-first workbench with a shoji panel frame, blueprint overlay, draggable/steppable hinoki strips, highlighted intersections, grain arrows, clamp markers, raised burrs, sawdust particles, and craft-status feedback.
- Gameplay must depend on 2D spatial state: strip position, orientation, length, notch alignment, intersection clamp strength, grain direction, stress accumulation, blueprint coverage, plane smoothness, tool cooldowns, and commission goals.
- Player actions must manipulate the system: move selected strip, rotate it 45°/90°, trim a notch, clamp an intersection, plane raised grain, swap strip length, dry-fit/commit placement, use Calm Measure focus to preview stress and valid joinery, pause/restart, and inspect tutorial hints.
- Portrait mobile is the default supported layout; no landscape gate.

## Design

- Objective: Build precise kumiko lattice panels by fitting hinoki strips to blueprint patterns, clamping clean joints, smoothing raised grain, and finishing each shoji screen before stress cracks the panel.
- Win condition: Complete three commissions — First Asa-no-ha Panel, Sakura Hex Screen, and Festival Shoji Masterwork — while reaching 4300 points to trigger “Hinoki Master Screen”. After the banner, continue into endless custom lattice commissions.
- Lose condition: Three craft hearts crack, grain stress reaches 100%, the commission timer expires, too many strips are committed off-blueprint, or the panel accumulates five unplaned burrs.
- Core loop:
  1. Start on a title/menu screen with Day 029 badge, mode badge “2D”, public route `/hinoki/`, best score, best Master Screen time, tutorial, prompt link, and a large Start button.
  2. Show a portrait-friendly carpentry workbench. A shoji panel frame fills the center, with a visible blueprint pattern, current hinoki strip, spare strip rack, clamp points, grain direction arrows, burr markers, and a wooden sparrow helper.
  3. A commission card requests goals, for example: “Complete 8 blueprint cells, clamp 4 clean intersections, keep stress under 35%, plane 2 burrs, finish with 90% symmetry.”
  4. Player chooses or receives a strip, moves it by large step buttons or drag, rotates it, and dry-fits it over blueprint guides. Valid joinery glows warm gold; invalid overlap glows red and raises stress if committed.
  5. Trim Notch cuts an intersection notch when the strip crosses another strip at a valid guide point. Notched strips sit flush and score; missing notches create raised burrs.
  6. Clamp Joint strengthens a correct intersection and briefly locks nearby strips from slipping. Bad clamping creates stress splinters.
  7. Plane Burr smooths raised grain/burr markers and lowers stress if used near the correct edge; over-planing thins the strip and can reduce score.
  8. Grain direction matters: strips aligned with the board grain tolerate more stress; cross-grain pieces need cleaner notches and clamps.
  9. Calm Measure focus, charged by clean placements and symmetric cells, slows timers and overlays valid notch points, stress heat, and symmetry mirrors for a short window.
  10. Completing a panel awards points, restores one craft heart if needed, saves mastery badges, and unlocks denser diagonal/hex patterns.
  11. Pause/restart remain available throughout.
- 15+ minute play-value strategy:
  - Save best score, fastest Hinoki Master Screen time, longest clean-joint chain, highest endless commission, fewest cracked strips, lowest stress finish, best symmetry score, most perfect clamps, and collected joinery seal badges in localStorage.
  - Include three authored commissions:
    - First Asa-no-ha Panel: simple star-hemp geometry, broad blueprint guides, few intersections, slow stress, guided first notch, no craft-heart penalty during the first tutorial mistake.
    - Sakura Hex Screen: adds hexagonal diagonals, grain-direction choices, more clamp timing, first burr pressure, and symmetry bonus.
    - Festival Shoji Masterwork: adds dense mixed diagonal/vertical lattice, stricter stress target, limited long strips, required Calm Measure preview, and final paper-glow finish.
  - Deterministic Day 029 seed varies blueprint pattern, strip rack order, grain arrow directions, clamp point bonuses, burr spawn edges, symmetry mirror axis, stress tolerance, and endless constraints while keeping the opening fair.
  - Mastery badges: finish First Asa-no-ha with zero stress cracks, trigger Master Screen under 250 seconds, build 29 clean joints, complete Sakura Hex with 95%+ symmetry, finish a panel without over-planing, complete an endless panel with all craft hearts.
  - Strategic scoring rewards planning: dry-fit before committing, trim notches before clamping, align long strips with grain, clamp crossing centers before edges, plane only when burrs threaten stress, save Calm Measure for dense pattern turns, and take safe low-score short strips instead of forcing invalid long strips.
  - Endless mode after Hinoki Master Screen adds denser patterns, stricter stress, faster slip/burr timers, rarer long strips, and mixed symmetry axes without shrinking touch controls.
- Difficulty scaling:
  - 0-45 seconds: simple pattern, broad guides, few joints, forgiving stress, guided first notch, one strip length.
  - 45-135 seconds: diagonal strips, grain-direction scoring, clamp timing, first burrs, symmetry target.
  - 135-250 seconds: dense hex/star pattern, limited long strips, stricter stress, Calm Measure required for safe joinery.
  - 250+ seconds/endless: faster stress growth, more intersections, alternating mirror axes, same readable controls.
  - Keep mobile fair: strips, blueprint lines, joints, burrs, grain arrows, clamp markers, status text, and action buttons must be large/readable at 390x844; primary touch buttons must be 52px+; no tiny survival-critical joints.
- Scoring/rewards:
  - Strip dry-fit matches blueprint cell: +65 points times combo tier.
  - Clean committed strip segment: +110 points and Calm Measure charge.
  - Proper notch before clamp: +130 points.
  - Perfect clamp at a blueprint intersection: +150 points.
  - Burr planed before stress tick: +120 points and stress relief.
  - Symmetric pair completed: +240 bonus.
  - Commission complete below stress target: +760 points and restore one craft heart if below max.
  - Perfect no-crack panel: +980 points.
  - Hinoki Master Screen: +1900 points and endless commissions unlock.
  - Invalid commit: combo soft-reset, stress +8%, one slip marker.
  - Cracked strip: craft-heart damage if threshold crossed, stress +14%, combo reset.
  - Over-planing: slight stress relief but strip-thinning penalty and lower finish score.

## Controls and layout

- Desktop:
  - Mouse click/tap: press action buttons, select strip rack pieces, start/pause overlay button, prompt link, or explainable HUD chips.
  - Mouse drag on the panel: position the selected strip; release should dry-fit, not commit, unless a clearly labeled Commit action is pressed.
  - Arrow keys or WASD: move selected strip north/west/south/east on the panel grid.
  - Q/E: rotate selected strip counterclockwise/clockwise through allowed orientations.
  - Space or Enter: Commit/Dry-fit selected strip depending on state.
  - 1: Trim Notch.
  - 2: Clamp Joint.
  - 3: Plane Burr.
  - 4: Swap Strip / next rack strip.
  - Shift or M: Calm Measure focus when charged.
  - P: pause/resume.
  - R: restart current run.
- Mobile/touch:
  - Use large Step Up, Step Left, Step Right, Step Down controls plus optional drag-to-position on the panel.
  - Use large Rotate, Dry Fit, Commit Strip, Trim Notch, Clamp Joint, Plane Burr, Swap Strip, Calm Measure, Pause, Restart, and Prompt buttons.
  - Tapping strip/joint/burr/stress chips may show short explanations.
  - No tiny virtual joystick. Interaction is strip stepping/dragging, rotating, dry-fitting, committing, notching, clamping, planing, swapping, focus, pause/restart.
- Mobile layout/orientation:
  - Default target is portrait phone play around 390x844; do not require landscape.
  - Top: compact craft HUD with score, best, craft hearts, stress %, combo, active strip, grain alignment, Calm Measure charge, symmetry %, and elapsed time. Use wood/blueprint/clamp/chisel/plane/stress chips, not foxfire/lantern/cone/matcha/firework/cat/rabbit/brush/kite icons.
  - Below top: commission card with blueprint progress, joint/clamp count, stress limit, burr limit, symmetry target, and progress ticks.
  - Center: large workbench panel with shoji frame, blueprint overlay, current strip, committed lattice, notch points, clamp markers, burr markers, grain arrows, sawdust, helper art, and route-free geometric feedback. It must remain playable without zooming.
  - Bottom: status helper plus large movement/action controls. Controls must not cover critical joints, active strip ends, stress warnings, or blueprint guide points.
  - Tutorial must fit on the first portrait screen; optional details may be collapsible but objective, strip movement, rotation, dry-fit/commit, notches, clamps, planing, grain stress, Calm Measure, pause/restart must be visible.
  - Requests must combine text, symbols, line styles, progress ticks, and shapes so hue alone is not required.

## Menu and tutorial

Implement these states:

1. Title screen
   - Shows title “Hinoki Kumiko Screenwright”.
   - Shows Day 029 badge, mode badge “2D”, public route `/hinoki/`, best score, best Master Screen time if available, and a prompt link.
   - Shows a large Start button and visible tutorial panel by default.
   - Notes: “Audio starts after you press Start; visual blueprint and stress cues work if muted.”
2. Tutorial text
   - Objective: “Fit hinoki strips to the kumiko blueprint, trim notches, clamp clean joints, and keep the panel from cracking.”
   - Movement: step with buttons/keys or drag the selected strip across the panel.
   - Rotation: rotate strips to match vertical, horizontal, and diagonal guides.
   - Dry-fit/commit: dry-fit previews stress; commit only when the guide glows warm.
   - Notches/clamps: trim a notch before clamping an intersection for clean joinery.
   - Grain/stress: align with grain when possible, plane burrs, and avoid invalid overlaps.
   - Calm Measure: slows the workshop and previews valid notch points/stress heat when charged.
   - Pause/restart: P/R on desktop or visible buttons on mobile.
3. In-game HUD
   - Score, best score, craft hearts, stress %, commission name, combo, active strip length/orientation, grain alignment, elapsed time, blueprint progress, clean joints, burr count, symmetry %, Calm Measure charge, latest warning.
   - Pause/restart controls visible or immediately accessible.
4. Status helper
   - Non-blocking helper showing next best joint, dry-fit status, stress advice, notch/clamp readiness, burr warning, Calm Measure readiness, and expected score effect.
   - Must not cover the workbench panel or bottom controls on mobile.
5. Pause overlay
   - Resume, restart, tutorial reminder, controls summary, audio/mute toggle, prompt link.
6. Game-over/results overlay
   - Final score, best score, commission reached, Master Screen status, clean-joint chain, symmetry, cracks, burrs planed, stress finish, mastery badges, restart button.
7. Hinoki Master Screen banner
   - Trigger once per run after all three commissions and 4300 score.
   - Non-blocking celebration: the shoji paper behind the lattice glows gold, sawdust motes swirl into a hinoki leaf seal, the sparrow helper pecks a tiny applause rhythm, clamps snap into a perfect border, and endless commissions continue after the banner fades.

## Assets

Prefer Imagegen2 (`openai/gpt-image-2`) for final visual art: wooden sparrow carpenter helper mascot, portrait hinoki workshop background, kumiko/joinery/tool icon sheet, and decorative finish-seal pieces. Canvas/SVG/DOM code may render interactive lattice strips, blueprint guides, hitboxes, stress heat, burrs, clamps, sawdust particles, score sparks, and UI chrome. It should not create final character/background/icon art from scratch unless Imagegen2 is unavailable after a real attempt.

Archive source generated art under `release/games/029/assets/source/` and use optimized playable copies under `release/games/029/assets/`. Also copy optimized playable assets into `apps/day-029-hinoki-kumiko-screenwright/assets/` and the public alias `release/hinoki/assets/`.

For mobile-first crop safety: keep important content centered, leave 12-16% safe margins, avoid baked-in text, avoid watermarks, avoid fake UI labels, avoid tiny joints/tools that disappear at final in-game size, and keep helper/strip/notch/clamp/plane/stress/blueprint silhouettes distinct against warm wood backgrounds.

Generate or provide at least these final art assets:

1. Wooden sparrow carpenter helper mascot
   - Target: transparent PNG if possible, square source, final optimized texture around 512x512 or 256x256.
   - Archive path: `release/games/029/assets/source/hinoki-helper-source.png`
   - Optimized path: `release/games/029/assets/hinoki-helper.png`
   - Imagegen2 prompt: “A charming friendly wooden sparrow carpenter apprentice mascot for a mobile 2D kumiko woodworking browser puzzle game, tiny carved sparrow with warm hinoki grain, little indigo craftsman headband, holding a brass measuring square and a tiny chisel, kind focused expression, soft shoji workshop rim light, centered readable silhouette, transparent or solid warm cypress background, no checkerboard background, no text, no watermark, sprite-friendly, high contrast at small size.”
   - Aspect ratio: square.
2. Hinoki kumiko workshop background source
   - Target: portrait-friendly background suitable behind a large shoji-panel workbench with open readable center.
   - Archive path: `release/games/029/assets/source/hinoki-workshop-source.png`
   - Optimized path: `release/games/029/assets/hinoki-workshop.png`
   - Imagegen2 prompt: “A serene Japanese hinoki woodworking atelier for a portrait mobile kumiko lattice puzzle game, pale cypress workbench, shoji paper glow, brass measuring square, chisels, small clamps, curled wood shavings, indigo blueprint sheets at the edges, warm late-afternoon light, open readable central work surface for a rectangular lattice panel, crop-safe for phone portrait, no characters in the center, no readable text, no watermark.”
   - Aspect ratio: portrait.
3. Kumiko strips, notches, clamps, plane, grain stress, and craft UI icon sheet source
   - Target: square icon sheet for objectives, hazards, tools, rewards, and UI decals.
   - Archive path: `release/games/029/assets/source/hinoki-icons-source.png`
   - Optimized path: `release/games/029/assets/hinoki-icons.png`
   - Imagegen2 prompt: “Small readable icon sheet for a Japanese hinoki kumiko screenmaking arcade puzzle game: pale wooden lattice strip, diagonal kumiko joint, trimmed notch, brass clamp, tiny hand plane, chisel, grain arrow, red stress crack, sawdust sparkle, indigo blueprint card, Calm Measure focus emblem, craft heart, symmetry mirror mark, finished shoji screen seal, transparent or solid warm cypress background, no checkerboard background, high contrast, no text, no watermark, generous margins so no icons are cut off.”
   - Aspect ratio: square.

If Imagegen2 is unavailable or fails after a real attempt, create a clearly labeled emergency fallback using simple SVG/canvas sparrow/wood/tool silhouettes, document the failure in `ai/postmortems/day-029.md`, and still keep source/fallback files under the same asset paths.

### Mandatory generated-image QA

For every generated image, include a real inspection step after generation and before integration:

- Analyze the actual generated file visually, not just the prompt text.
- For the sparrow helper mascot, verify transparent/cutout quality or clean background handling, readable friendly silhouette, centered pivot/crop margins, no unwanted text/watermarks, stable upright helper orientation, and that tool pose does not imply incompatible movement or rotation.
- Verify control-to-motion alignment in-game: Step Up/Left/Right/Down must move the selected strip in expected directions, Rotate must visibly change orientation, Dry Fit must preview valid/invalid stress, Commit Strip must lock a visible piece, Trim Notch must create a visible notch at intended joints, Clamp Joint must visibly secure intersections, Plane Burr must remove intended burrs/lower stress, Swap Strip must change the active piece, and Calm Measure must slow/preview valid joinery/stress as described.
- For the background, verify the central workbench remains readable after portrait mobile crop and does not hide the panel, blueprint lines, current strip, joints, burrs, commission card, helper, or controls.
- For the icon sheet, verify wooden strip, joint, notch, clamp, plane, chisel, grain arrow, stress crack, sawdust, blueprint, Calm Measure, craft heart, symmetry mark, and finished shoji seal are distinct at final HUD/button size and cannot be confused. Watch specifically for fake checkerboard transparency; alpha-clean or composite onto warm cypress if needed and inspect again.
- If inspection finds a problem, regenerate or post-process the image and inspect again. Do not ship broken visual assets just because tests pass.

## Audio and game feel

Because woodworking, notching, clamping, planing, grain stress, and shoji completion are central to the theme, include lightweight WebAudio cues initialized only after a user gesture:

- Soft wood tap when stepping or dry-fitting a strip.
- Crisp chisel tick when trimming a notch.
- Warm clamp click when a joint locks cleanly.
- Smooth plane scrape when removing a burr, with pitch tied to stress relief.
- Tiny splinter crack when invalid placement raises stress.
- Paper-shoji shimmer when a panel section completes.
- Sparkly measuring-bell shimmer when Calm Measure activates.
- Rising koto/woodblock arpeggio when Hinoki Master Screen triggers.

Audio must not block play if WebAudio is unavailable. Verify no autoplay errors: audio context should be created/resumed only after Start or another user interaction. Include a visible mute toggle in pause/results or HUD.

## Prompt page output

The archived `release/games/029/prompt.html` must be a consistent rendered HTML page, not raw Markdown pasted into a `<pre>` block. It should include:

- A clear `<title>` and `<h1>` using `Day 029 Game Generation Prompt`.
- A back-to-game link near the top.
- Semantic rendered sections (`h2`, `h3`, `ul/ol/li`, `p`, `pre/code` only for actual code/commands).
- The same readable prompt-page style pattern across days so prompt pages feel like one system.

## Subagents to dispatch

1. Implementation subagent
   - Build the static 2D game under `apps/day-029-hinoki-kumiko-screenwright/`.
   - Integrate it into immutable release output under `release/games/029/`.
   - Create the public playable route under `release/hinoki/`.
   - Use static HTML/CSS/JS with Canvas/SVG/WebAudio and no backend.
   - The public alias must be self-contained or asset paths must be alias-safe.
2. Asset/polish subagent
   - Generate/prepare Imagegen2 assets, archive source files, optimize playable copies, inspect generated images, remove fake checkerboards if present, and tune mobile readability/game feel.
3. QA/browser/mobile subagent
   - Run desktop and mobile smoke checks, verify no console errors, verify menu/tutorial/objective/controls/restart/pause, prompt links, workbench render, Step controls, Rotate, Dry Fit, Commit Strip, Trim Notch, Clamp Joint, Plane Burr, Swap Strip, Calm Measure control presence, blueprint/stress/burr/clamp feedback, generated screenshot, generated assets, WebAudio initialization after user gesture, and 390x844 portrait layout.
4. Reflection/self-improvement subagent
   - Write `ai/postmortems/day-029.md` after validation with what worked, what failed, generated-image inspection notes, audio verification, code-isolation confirmation, and whether generator/template/rubric improvements are justified.

## Acceptance criteria

- Static build passes.
- Code isolation is documented in QA/postmortem: no previous game implementation code was opened, inspected, copied, diffed, grepped, or adapted.
- Mode choice follows the cadence rule: Day 029 is `2d` after Day 028 `3d` with zero latest 2D streak, and the mechanic is rich spatial/craft puzzle play rather than a low-effort flat demo.
- Desktop smoke passes.
- Mobile portrait smoke passes at about 390x844 with readable HUD/tutorial/commission card, usable 52px+ movement/action/pause/restart controls, no forced landscape canvas, and no tiny survival-critical joints or strips.
- Prompt is visible from gallery and release folder.
- `prompts/day-029.md` is copied exactly to `release/games/029/prompt.md` and `release/hinoki/prompt.md`.
- `release/games/029/prompt.html` and `release/hinoki/prompt.html` render the prompt in browser-readable semantic HTML with the standard prompt-page styling, not a raw Markdown `<pre>` dump.
- Public alias `release/hinoki/index.html`, `release/hinoki/prompt.html`, `release/hinoki/screenshot.png`, and `release/hinoki/assets/` exist and work.
- Gallery card for Day 029 shows prompt availability, generation duration, public `/hinoki/` links, mode `2d`, and actual generated date.
- Screenshot exists at `release/games/029/screenshot.png` and is non-empty/readable. Prefer a readable desktop gameplay screenshot for gallery cards; mobile screenshots are QA evidence unless the design is intentionally portrait-card friendly.
- Image/source assets exist under `release/games/029/assets/source/` and optimized assets exist under `release/games/029/assets/`, or a documented emergency fallback exists.
- Every generated image has an inspection note in the postmortem or QA notes; interactive strip/joint/clamp/plane visuals have verified background handling, orientation/pivot/crop, readability, and control-to-motion alignment.
- WebAudio initializes after user gesture and creates no autoplay console errors; audio is failsafe if unsupported and visual blueprint/stress/joinery cues remain playable muted.
- No console errors during desktop or mobile smoke. Add data-URI favicons to game and prompt pages if needed to avoid favicon request noise.
- Existing `release/games/001/**` through `release/games/028/**` from origin/main remain unchanged.
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
# Screenshot/static checks: verify release/games/029/screenshot.png, prompt.md, prompt.html, index.html, game.js, styles.css, release/hinoki/index.html, release/hinoki/prompt.html, release/hinoki/screenshot.png, optimized assets, and source assets exist and are non-empty.
# Prompt copy check: cmp prompts/day-029.md release/games/029/prompt.md and cmp prompts/day-029.md release/hinoki/prompt.md.
# Prompt HTML check: verify release/games/029/prompt.html has semantic h1/h2/list markup and a back-to-game link, not a raw Markdown dump inside <pre>, and no malformed ul > p or ol > p nodes.
# Browser smoke: open the local/static /hinoki/ route and verify menu, tutorial, gameplay start, workbench panel render, Step controls, Rotate, Dry Fit, Commit Strip, Trim Notch, Clamp Joint, Plane Burr, Swap Strip, Calm Measure, pause, restart, prompt page, WebAudio after user gesture, no console errors.
# Mobile smoke: repeat at a portrait phone viewport such as 390x844 and verify playable strip/action controls plus readable HUD/commission card/panel/controls.
# Static screenshot check: inspect release/games/029/screenshot.png and release/hinoki/screenshot.png for non-empty readable game content; use vision to judge actual visual quality.
# Image QA: inspect every Imagegen2 source/optimized asset and document the actual inspection result in ai/postmortems/day-029.md.
# Docker/static smoke: build the Docker image locally, run it, curl /hinoki/ and /hinoki/prompt.html, then stop the container.
# Immutable guard: confirm no release/games folders from origin/main changed except new Day 029.
```
