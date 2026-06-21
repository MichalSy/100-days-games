# Day 011 Game Generation Prompt

## Game identity

- Day: 011
- Title: Hana Kimono Pattern Weaver
- Slug: hana-kimono-pattern-weaver
- Public route word: hana
- Mode: 2D
- Genre: mobile-first pattern-placement puzzle / textile atelier arcade score chase
- Mood/style: refined Japanese kimono workshop at spring dusk, lacquered fabric trays, washi order cards, blooming sakura motifs, indigo ink, ivory silk, muted rose, plum shadows, gold thread accents; tactile craft puzzle with crisp readable symbols rather than busy decoration

## Why this game today

The current generated series in `src/data/games.ts` ends with:

- Day 007 `2d`: seaside bento order-management and conveyor cooking.
- Day 008 `3d`: moss/root tile routing on a miniature forest shrine board.
- Day 009 `hybrid`: shadow-puppet depth lanes, pose matching, and beat cue timing.
- Day 010 `3d`: hilltop windbell atelier, real 3D hanging bells, wind ribbons, pitch tuning, crows, and storm pressure.

The latest generated-mode streak is one `3d`, and the latest 2D streak is zero. Day 011 may safely return to `2D` while preserving cadence. It deliberately shifts away from recent verbs: no route-building, no beam/wind routing, no lane runner, no cooking orders, no puppet beat timing, no 3D object tuning, no vehicle movement. The new verb set is: read a textile commission, stamp fabric motifs onto a kimono panel grid, rotate/flip motif blocks, preserve symmetry, manage dye saturation, clear moth/nick mistakes, and chain elegant pattern matches.

Recent screenshot and visual variety notes:

- Day 008 used emerald moss, a chunky 3D board, square route tiles, and forest shrine texture.
- Day 009 used deep indigo/amber theater silhouettes, near/mid/far rails, and rhythm UI.
- Day 010 used teal/gold blue-hour 3D eaves, hanging windbells, a wide central diorama, top HUD boxes, and bottom rotation/tuning controls.

Day 011 should be flatter, calmer, and more textile/editorial: a portrait atelier surface with a central kimono-shaped cloth panel, patterned stamp blocks, washi commission cards, fabric swatches, and blossom-thread particles. Avoid teal wind ribbons, hanging bells, storm/crow iconography, heavy 3D perspective, and the same six-box top HUD look. The composition should feel like laying fabric on a table, not steering objects through space.

## Code isolation / no previous game source

The implementation must be written from scratch for this day. Do not open, inspect, copy, diff, grep, or adapt code from previous games, including old `apps/day-*` folders, old `release/games/NNN/` HTML/CSS/JS files, or old public alias folders. You may inspect previous metadata, prompts, postmortems, and screenshots only to avoid repeating concepts and visual identity. The new game's HTML/CSS/JS must come from this prompt and general web/game knowledge, not from earlier game implementations.

## Mode variety / 3D cadence

Inspection target: `src/data/games.ts` currently ends with Day 008 `3d`, Day 009 `hybrid`, and Day 010 `3d`. The latest generated mode streak is one `3d`; latest 2D streak is zero.

Mode decision: Day 011 is `2D`. This is allowed because the latest game is 3D and there is no 2D streak. The next day is not forced by cadence, but if Day 012 also chooses 2D, the planner should be mindful that Day 013 should strongly prefer 3D/hybrid before the series drifts flat.

Day 011 must be a strong 2D game, not a placeholder:

- Use a responsive 2D canvas or DOM/canvas hybrid that works in portrait phones.
- The game should depend on spatial pattern composition: stamp shapes, rotations, mirror symmetry, motif adjacency, dye saturation, and commission constraints.
- Visual richness should come from Imagegen2 textile art plus crisp programmatic placement/interaction, not from procedural placeholder doodles.
- Portrait mobile is the default supported layout; no landscape gate.

## Design

- Objective: Fulfill kimono workshop commissions by placing, rotating, and flipping motif stamps onto a kimono cloth panel so the final pattern matches the requested theme, symmetry, color balance, and motif count before the dye tray dries.
- Win condition: Complete three atelier chapters — Sakura Lining, Crane Sleeve, and Festival Obi — while reaching 2600 points to trigger “Hana Grand Fitting”. After Grand Fitting, continue into endless custom commissions.
- Lose condition: The dye tray dries out because too many placements miss constraints, moths chew pinned motifs, dye saturation overflows, or three customer patience petals fall.
- Core loop:
  1. Start on a title/menu screen with Day 011 badge, mode badge “2D”, public route `/hana/`, best score, best Grand Fitting time, tutorial, prompt link, and a large Start button.
  2. Show a portrait kimono cloth panel in the center with an 5x6 or 6x7 placement grid shaped like body/sleeves/obi, not a generic square board.
  3. A washi commission card requests a pattern using readable text + icons, for example: “Sakura x4 mirrored on sleeves, Wave border on hem, one Gold Crane on obi, keep Indigo under 40% saturation.”
  4. Player selects a motif stamp from a tray: Sakura, Wave, Crane, Plum Dot, Gold Thread, or Empty/Undo.
  5. Player taps/drag-drops onto cloth cells. Rotate and Flip controls adjust the stamp before/after placement. Mirror Guide previews the corresponding symmetric cell.
  6. Correct placements glow with stitched gold thread; wrong placements create dye smudges that can be repaired with limited blotting cloths.
  7. Silk moths drift toward pinned motifs. Tapping a moth before it lands saves the cloth; ignoring it chews a motif and costs patience.
  8. Completing a commission seals the fabric with a blossom stamp, awards points, restores one patience petal if needed, and introduces the next chapter.
  9. Pause/restart remain available throughout.
- 15+ minute play-value strategy:
  - Save best score, fastest Hana Grand Fitting time, longest perfect-commission streak, highest endless commission, and collected textile stamp badges in localStorage.
  - Include three authored chapters:
    - Sakura Lining: small kimono panel, simple mirrored sleeve pairs, slow dye timer, no moths for first commission.
    - Crane Sleeve: larger panel, rotate/flip requirements, first moths, color-balance requests, repair cloth decisions.
    - Festival Obi: full panel with obi band constraints, border continuity, forbidden cells, faster drying, multi-step commission chain.
  - Deterministic Day 011 seed varies commission order, motif palette, moth approach timing, forbidden cells, bonus symmetry targets, and endless constraints while keeping the opening fair.
  - Mastery badges: complete Sakura Lining without a smudge, finish 12 mirrored pairs, complete Grand Fitting under 185 seconds, repair no more than two mistakes, stop 20 moths, complete an endless commission with all patience petals.
  - Strategic scoring rewards planning before placing: use Mirror Guide, preserve dye saturation, place border motifs first, decide when to spend a repair cloth, and leave high-value gold thread motifs for exact cells.
  - Endless mode after Grand Fitting adds denser commission combinations, stricter color balance, more moth feints, and fewer repair cloths without shrinking touch targets.
- Difficulty scaling:
  - 0-45 seconds: 5x6 shaped panel, two motif types, large mirrored targets, broad timer, no moth penalty during tutorial placements.
  - 45-115 seconds: three to four motif types, rotate/flip constraints, first moths, first dye saturation cap.
  - 115-185 seconds: full panel, obi/border constraints, forbidden smudge cells, faster drying, multi-condition commission cards.
  - 185+ seconds/endless: combined symmetry + color + adjacency constraints, faster moths, higher combo multipliers, but same 44px+ controls and readable cells.
  - Keep mobile fair: cloth cells must be large enough to tap around 390x844, motif icons remain distinct at final size, commission card uses short lines/chips, and no tiny moving hazard is required for survival.
- Scoring/rewards:
  - Correct motif placement: +45 points times combo tier.
  - Correct mirrored pair: +130 points and +8% Mirror Guide charge.
  - Perfect commission with no smudges: +260 points and restore one repair cloth.
  - Moth stopped before landing: +55 points; stop three in a row for a “Silk Guard” bonus.
  - Dye balance bonus: +180 points if final color saturation stays inside requested range.
  - Chapter complete: +420 points and restore one patience petal if below max.
  - Hana Grand Fitting: +880 points and endless custom commissions unlock.
  - Wrong motif/rotation/forbidden cell: one smudge, combo reset, dye tray dries faster.
  - Moth chews pinned motif: patience -1 and that cell must be repaired/replaced.

## Controls and layout

- Desktop:
  - Mouse click/tap: select motif stamp, cloth cell, rotate/flip/mirror/repair/pause/restart buttons.
  - Mouse drag: drag selected motif from tray onto cloth cell.
  - Arrow keys or WASD: move a keyboard focus cursor across cloth cells.
  - 1-6: select motif stamp.
  - Q/E: rotate selected motif counterclockwise/clockwise.
  - F: flip selected motif.
  - M or Space: toggle/activate Mirror Guide when charged.
  - Backspace or U: undo last placement when allowed.
  - P: pause/resume.
  - R: restart current run.
- Mobile/touch:
  - Tap a large motif stamp in the tray, then tap a cloth cell to place it.
  - Drag-and-drop from tray to cloth should also work, but tap-select/tap-place is mandatory for reliability.
  - Use large Rotate, Flip, Undo/Repair, and Mirror Guide buttons.
  - Tap moths directly when they approach; hit zones should be forgiving.
  - Pause and Restart controls with 44px+ targets.
  - No virtual joystick. The interaction model is tap-select, tap-place, rotate/flip, and optional drag.
- Mobile layout/orientation:
  - Default target is portrait phone play around 390x844; do not require landscape.
  - Top: compact but distinct atelier status strip with score, best, patience petals, dye dryness, chapter, combo, and time. Avoid copying Day 010's six equal dark boxes; use a softer textile ribbon or card layout.
  - Below top: commission card with motif chips, symmetry/border/color constraints, progress ticks, and remaining dye window.
  - Center: kimono cloth panel with shaped grid, readable motifs, mirrored ghost preview, smudge highlights, and moth approach paths.
  - Bottom: motif tray and large action controls. The selected motif should be obvious, and controls must not cover the active cloth panel.
  - Tutorial must fit on the first portrait screen; optional details may be collapsible but objective, motif selection, placement, rotate/flip, symmetry, smudges/repair, moths, and pause/restart must be visible.
  - Commission requests must combine text, icons, shapes, and pattern chips so hue alone is not required.

## Menu and tutorial

Implement these states:

1. Title screen
   - Shows title “Hana Kimono Pattern Weaver”.
   - Shows Day 011 badge, mode badge “2D”, public route `/hana/`, best score, best Grand Fitting time if available, and a prompt link.
   - Shows a large Start button and visible tutorial panel by default.
2. Tutorial text
   - Objective: “Stamp, rotate, and mirror motifs to finish each kimono commission before the dye dries.”
   - Motif selection: tap a stamp, then tap the cloth panel to place it.
   - Rotate/flip: some commissions care about motif direction; rotate or flip before placing.
   - Symmetry: sleeve and lining requests often need mirrored pairs; use Mirror Guide to preview partner cells.
   - Dye/smudges: wrong placements create smudges; repair cloths are limited.
   - Moths: tap silk moths before they chew pinned motifs.
   - Pause/restart: P/R on desktop or visible buttons on mobile.
3. In-game HUD
   - Score, best score, patience petals, dye dryness/timer, chapter name, combo, elapsed time, current commission, selected motif, repair cloths, Mirror Guide charge.
   - Pause/restart controls visible or immediately accessible.
4. Selected-motif helper
   - Non-blocking helper showing current motif, rotation, flip state, and whether the hovered/tapped cell satisfies a commission condition.
   - Must not cover cloth cells or bottom controls on mobile.
5. Pause overlay
   - Resume, restart, tutorial reminder, controls summary, prompt link.
6. Game-over/results overlay
   - Final score, best score, chapter reached, Grand Fitting status, perfect commission streak, mastery badges, restart button.
7. Hana Grand Fitting banner
   - Trigger once per run after all three chapters and 2600 score.
   - Non-blocking blossom-thread flourish across the completed kimono, gold seal stamp, customer silhouette bow, endless custom commissions continue after banner fades.

## Assets

Prefer Imagegen2 (`openai/gpt-image-2`) for final visual art: kimono artisan mascot, kimono workshop/table background, motif/icon sheet, and key decorative textile pieces. Canvas/SVG/DOM code may draw the interactive grid, placement highlights, hit zones, particles, guide lines, UI chrome, text labels, and simple debug shapes. It should not create final character/background/icon art from scratch unless Imagegen2 is unavailable after a real attempt.

Archive source generated art under `release/games/011/assets/source/` and use optimized playable copies under `release/games/011/assets/`. Also copy optimized playable assets into `apps/day-011-hana-kimono-pattern-weaver/assets/` and the public alias `release/hana/assets/`.

For mobile-first crop safety: keep important content centered, leave 12-16% safe margins, avoid baked-in text, avoid watermarks, avoid fake UI labels, avoid tiny textile details that disappear at final in-game size, and keep motif silhouettes distinct even when scaled down for grid cells.

Generate or provide at least these final art assets:

1. Kimono artisan mascot/source charm
   - Target: transparent PNG if possible, square source, final optimized texture around 512x512 or 256x256.
   - Archive path: `release/games/011/assets/source/hana-artisan-source.png`
   - Optimized path: `release/games/011/assets/hana-artisan.png`
   - Imagegen2 prompt: “A charming Japanese kimono pattern artisan mascot for a mobile browser puzzle arcade game, small friendly textile craftsperson with indigo apron, sakura hairpin, gold thread spool, holding a carved fabric stamp, muted rose and ivory accents, centered readable silhouette, transparent or plain warm washi background, no text, no watermark, sprite-friendly, high contrast at small size.”
   - Aspect ratio: square.
2. Kimono workshop table background source
   - Target: portrait-friendly background suitable behind a flat 2D kimono-cloth puzzle panel with open readable center.
   - Archive path: `release/games/011/assets/source/hana-workshop-source.png`
   - Optimized path: `release/games/011/assets/hana-workshop.png`
   - Imagegen2 prompt: “A refined Japanese kimono workshop table at spring dusk for a portrait mobile 2D puzzle game, folded silk bolts, lacquered stamp trays, washi paper commission cards, scattered sakura petals, indigo ink dish, warm lantern glow, open readable center area for a kimono cloth grid, crop-safe for phone portrait, no characters, no text, no watermark.”
   - Aspect ratio: portrait.
3. Motif stamp and textile icon sheet source
   - Target: square icon sheet for motif stamps, commission chips, hazards, rewards, and UI decals.
   - Archive path: `release/games/011/assets/source/hana-icons-source.png`
   - Optimized path: `release/games/011/assets/hana-icons.png`
   - Imagegen2 prompt: “Small readable icon sheet for a Japanese kimono pattern weaving puzzle game: sakura blossom stamp, wave border stamp, crane stamp, plum dot, gold thread spool, mirror symmetry guide, repair blotting cloth, silk moth hazard, dye smudge, patience petal, Grand Fitting seal, transparent or plain ivory background, high contrast textile motifs, no text, no watermark.”
   - Aspect ratio: square.

If Imagegen2 is unavailable or fails after a real attempt, create a clearly labeled emergency fallback using simple SVG/canvas textile silhouettes, document the failure in `ai/postmortems/day-011.md`, and still keep source/fallback files under the same asset paths.

### Mandatory generated-image QA

For every generated image, include a real inspection step after generation and before integration:

- Analyze the actual generated file visually, not just the prompt text.
- For the artisan mascot, verify transparent/cutout quality or clean background handling, readable silhouette, centered pivot, crop margins, no unwanted text/watermarks, and stable upright orientation.
- Verify control-to-motion alignment in-game: tapping a motif stamp must set the matching selected motif, Rotate must visibly rotate/mark orientation in the expected direction, Flip must mirror the selected stamp, Mirror Guide must preview the symmetric partner cell, and tapping/dragging a cloth cell must place the motif exactly where indicated.
- For the background, verify the center play area remains readable after portrait mobile crop and does not hide cloth cells, commission cards, moths, smudges, motif tray, or action controls.
- For the icon sheet, verify sakura, wave, crane, plum, gold thread, repair cloth, moth, smudge, petal, mirror, and Grand Fitting seal are distinct at final grid/HUD/button size and cannot be confused.
- If inspection finds a problem, regenerate or post-process the image and inspect again. Do not ship broken visual assets just because tests pass.

## Prompt page output

The archived `release/games/011/prompt.html` must be a consistent rendered HTML page, not raw Markdown pasted into a `<pre>` block. It should include:

- A clear `<title>` and `<h1>` using `Day 011 Game Generation Prompt`.
- A back-to-game link near the top.
- Semantic rendered sections (`h2`, `h3`, `ul/ol/li`, `p`, `pre/code` only for actual code/commands).
- The same readable prompt-page style pattern across days so prompt pages feel like one system.

## Subagents to dispatch

1. Implementation subagent
   - Build the static 2D game under `apps/day-011-hana-kimono-pattern-weaver/`.
   - Integrate it into immutable release output under `release/games/011/`.
   - Create the public playable route under `release/hana/`.
   - Use static HTML/CSS/JS with no backend.
   - The public alias must be self-contained or asset paths must be alias-safe.
2. Asset/polish subagent
   - Generate/prepare Imagegen2 assets, archive source files, optimize playable copies, inspect generated images, and tune mobile readability/game feel.
3. QA/browser/mobile subagent
   - Run desktop and mobile smoke checks, verify no console errors, verify menu/tutorial/objective/controls/restart/pause, prompt links, motif selection, tap placement, drag placement if implemented, rotate, flip, Mirror Guide, undo/repair, moth interaction, commission completion, generated screenshot, generated assets, and 390x844 portrait layout.
4. Reflection/self-improvement subagent
   - Write `ai/postmortems/day-011.md` after validation with what worked, what failed, generated-image inspection notes, code-isolation confirmation, and whether generator/template/rubric improvements are justified.

## Acceptance criteria

- Static build passes.
- Code isolation is documented in QA/postmortem: no previous game implementation code was opened, inspected, copied, diffed, grepped, or adapted.
- Mode choice follows the cadence rule: Day 011 is allowed as `2d` after Day 010 `3d`; it must be a fully playable pattern-placement game with meaningful spatial composition, not a static board mockup.
- Desktop smoke passes.
- Mobile portrait smoke passes at about 390x844 with readable HUD/tutorial/commission card, usable tap-select/tap-place/rotate/flip/mirror/repair controls, no forced landscape canvas, and 44px+ controls.
- Prompt is visible from gallery and release folder.
- `prompts/day-011.md` is copied exactly to `release/games/011/prompt.md` and `release/hana/prompt.md`.
- `release/games/011/prompt.html` and `release/hana/prompt.html` render the prompt in browser-readable semantic HTML with the standard prompt-page styling, not a raw Markdown `<pre>` dump.
- Public alias `release/hana/index.html`, `release/hana/prompt.html`, `release/hana/screenshot.png`, and `release/hana/assets/` exist and work.
- Gallery card for Day 011 shows prompt availability, generation duration, public `/hana/` links, mode `2d`, and actual generated date.
- Screenshot exists at `release/games/011/screenshot.png` and is non-empty/readable. Prefer a readable desktop gameplay screenshot for gallery cards; mobile screenshots are QA evidence unless the design is intentionally portrait-card friendly.
- Image/source assets exist under `release/games/011/assets/source/` and optimized assets exist under `release/games/011/assets/`, or a documented emergency fallback exists.
- Every generated image has an inspection note in the postmortem or QA notes; interactive stamp/motif visuals have verified background handling, orientation/pivot/crop, readability, and control-to-motion alignment.
- If the game uses audio cues, initialize WebAudio only after user gesture and verify no autoplay errors. Audio is optional because this is not a rhythm/sound-themed day.
- No console errors during desktop or mobile smoke. Add data-URI favicon links to game and prompt pages if needed to avoid favicon request noise.
- Existing `release/games/001/**` through `release/games/010/**` from origin/main remain unchanged.
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
# Screenshot/static checks: verify release/games/011/screenshot.png, prompt.md, prompt.html, index.html, game.js, styles.css, release/hana/index.html, release/hana/prompt.html, release/hana/screenshot.png, optimized assets, and source assets exist and are non-empty.
# Prompt copy check: cmp prompts/day-011.md release/games/011/prompt.md and cmp prompts/day-011.md release/hana/prompt.md.
# Prompt HTML check: verify release/games/011/prompt.html has semantic h1/h2/list markup and a back-to-game link, not a raw Markdown dump inside <pre>, and no malformed ul > p or ol > p nodes.
# Browser smoke: open the local/static /hana/ route and verify menu, tutorial, gameplay start, motif selection, tap placement, rotate, flip, Mirror Guide, undo/repair, moth interaction, pause, restart, prompt page, no console errors.
# Mobile smoke: repeat at a portrait phone viewport such as 390x844 and verify playable tap controls and readable HUD/commission/cloth panel.
# Static screenshot check: inspect release/games/011/screenshot.png and release/hana/screenshot.png for non-empty readable game content; use vision to judge actual visual quality.
# Image QA: inspect every Imagegen2 source/optimized asset and document the actual inspection result in ai/postmortems/day-011.md.
# Docker/static smoke: build the Docker image locally, run it, curl /hana/ and /hana/prompt.html, then stop the container.
# Immutable guard: confirm no release/games folders from origin/main changed except new Day 011.
```
