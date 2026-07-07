# Day 025 Game Generation Prompt

## Game identity

- Day: 025
- Title: Neko Koban Bell Cascade
- Slug: neko-koban-bell-cascade
- Public route word: neko
- Mode: 2D
- Genre: mobile-first luck-physics pachinko arcade / charm-routing score chase
- Mood/style: cozy red-and-gold maneki-neko fortune shop at night, glossy koban coins, ceramic lucky cats, lacquer shelves, tiny shrine bells, paper omikuji slips, teal patina coin trays, warm lantern reflections, playful coin-bounce audio and tactile bumper routing; direct 2D coin-drop planning rather than 3D mochi hopping, calligraphy brush tracing, kite-thread sky navigation, dry-garden raking, underwater cartography, taiko rhythm lanes, shrine tilt mazes, silver webs, pottery shaping, bamboo canals, origami folding, rain sheltering, snow stacking, kimono stamping, bento cooking, windbell tuning, rail running, or koi collection.

## Why this game today

The generated series currently ends with:

- Day 022 `3d`: nebuta kite sky cartography with ordered star nodes, thread tension, wind ribbons, shrine beacons, cloud tangles, and a kitsune kite mascot.
- Day 023 `2d`: sumi calligraphy with direct brush strokes, wetness/blots, washi paper, fox-scribe helper, and vermilion seal placement.
- Day 024 `3d`: usagi moon-mochi platform hopping with charged jump arcs, spring pads, rice sparks, tray gates, and rooftop depth.

The latest generated-mode streak is one `3d`; latest 2D streak is zero. Day 025 deliberately chooses `2D` because it follows a 3D day and the series benefits from a crisp portrait-first touch game with readable objects, physics timing, and satisfying coin/bell feedback. The new verb set is luck-machine routing: choose coin drop slots, rotate cat-paw bumpers, open/close charm gates, ring bells, bank matching koban coins into fortune trays, and spend Lucky Paw focus to slow the cascade.

Recent screenshot/visual variety notes to avoid repeating:

- Day 022 used dark cobalt sky, sparse star depth, nebuta kite mascot, altitude/tension HUD, and blue/pink action buttons.
- Day 023 used warm washi paper, charcoal table, black sumi strokes, vermilion seal target, fox-scribe mascot, and direct drawing controls.
- Day 024 used lavender moon rooftops, floating mochi pads, a white rabbit, jump arcs, rice spark order, and 3D platform depth.

Day 025 should shift to a compact lucky-cat shop/pachinko cabinet: deep vermilion wood, gold coin trails, cream ceramic cats, small bronze bells, emerald/teal tray patina, paper fortune slips, and chunky readable bumpers. Avoid moon-platform visuals, lavender rooftop depth, brush/washi/seal language as core UI, kite/thread/star-map navigation, dry-garden sand/moss/stone boards, underwater teal corridors, taiko rhythm pads, tilt-maze boards, web anchors, clay profiles, bamboo pipes, origami creases, parasols/rain, snow blocks, kimono cloth panels, or generic slot-machine reels.

## Code isolation / no previous game source

The implementation must be written from scratch for this day. Do not open, inspect, copy, diff, grep, or adapt code from previous games, including old `apps/day-*` folders, old `release/games/NNN/` HTML/CSS/JS files, or old public alias folders. You may inspect previous metadata, prompts, postmortems, and screenshots only to avoid repeating concepts and visual identity. The new game's HTML/CSS/JS must come from this prompt and general browser/canvas/WebAudio game knowledge, not from earlier game implementations.

## Mode variety / 3D cadence

Inspection target: `src/data/games.ts` currently ends with Day 022 `3d`, Day 023 `2d`, and Day 024 `3d`. The latest generated-mode streak is one `3d`; latest 2D streak is zero.

Mode decision: Day 025 is `2D`. This is allowed and intentional because it follows 3D and does not extend a 2D streak. The 2D implementation must still be mechanically rich and visually polished:

- Use static-browser HTML/CSS/JS with a canvas-based pachinko/coin-routing board and semantic UI; no backend.
- Render a portrait-first lucky-cat cabinet with real coin positions/velocities, pegs, rotatable paw bumpers, charm gates, bells, trays, misfortune gutters, score sparks, and path previews.
- Gameplay must depend on 2D state: drop slot, coin velocity, bumper angle, gate state, bell charge, tray target order, lucky chain combo, cabinet shake, wrong-tray risk, and focus timing.
- Player actions must manipulate the system: choose a drop slot, release coin waves, rotate paw bumpers, open/close charm gates, ring the Fortune Bell, nudge the cabinet within safe limits, spend Lucky Paw focus to slow/predict, pause/restart, and inspect tutorial hints.
- Portrait mobile is the default supported layout; no landscape gate.

## Design

- Objective: Drop glossy koban coins through a maneki-neko fortune board, rotate paw bumpers and charm gates, ring bells, and guide requested coin types into matching fortune trays before luck runs out.
- Win condition: Complete three fortune commissions — First Paw Chime, Lantern Coin Spiral, and Golden Maneki Offering — while reaching 3900 points to trigger “Neko Grand Fortune”. After the fortune banner, continue into endless shop commissions.
- Lose condition: Three luck bells crack, the commission timer expires, the misfortune meter reaches 100%, too many requested coins fall into wrong trays/gutters, or cabinet shake exceeds the safe line after repeated nudges.
- Core loop:
  1. Start on a title/menu screen with Day 025 badge, mode badge “2D”, public route `/neko/`, best score, best Grand Fortune time, tutorial, prompt link, and a large Start button.
  2. Show a portrait-friendly lucky-cat pachinko board. A coin slot rail sits at the top, rotatable cat-paw bumpers and charm gates fill the center, bells and paper fortunes sit along paths, matching trays line the bottom, and a maneki-neko helper watches from one side.
  3. A fortune card requests goals, for example: “Bank 3 gold koban in Tray A, ring 2 bronze bells, keep misfortune under 30%, finish with one Lucky Paw unused.”
  4. Player selects a top drop slot and releases one coin or a small coin wave. Coins bounce through pegs, paw bumpers, gates, bells, and tray mouths using readable arcade physics.
  5. Paw bumpers rotate in 45-degree steps and bend coin paths. Charm gates toggle open/closed but can only change while no coin overlaps them, encouraging planning.
  6. Fortune Bell charges through clean tray deliveries. Ringing it magnetizes the nearest requested coin toward the correct tray for a short time.
  7. Nudge Cabinet gives a small horizontal impulse to active coins; repeated nudges raise shake/misfortune and can crack a luck bell if abused.
  8. Lucky Paw focus, charged by clean bell/tray combos, slows coins and overlays a short predicted path before release.
  9. Completing a commission lights a ceramic cat, awards points, repairs one luck bell if needed, and unlocks more complex bumper/gate layouts.
  10. Pause/restart remain available throughout.
- 15+ minute play-value strategy:
  - Save best score, fastest Neko Grand Fortune time, longest lucky chain, highest endless commission, most perfect tray deliveries, fewest nudges, best low-misfortune finish, and collected fortune seals in localStorage.
  - Include three authored commissions:
    - First Paw Chime: wide trays, two coin types, slow coin speed, visible path preview, two rotatable paw bumpers, no penalty during first guided drop.
    - Lantern Coin Spiral: adds silver coins, three trays, first toggle gates, bell-ring tutorial, misfortune gutter, and gentle moving peg rows.
    - Golden Maneki Offering: adds mixed coin order, narrower tray mouths, crossing bumpers, misfortune slips, stricter nudge/shake meter, and Lucky Paw focus mastery.
  - Deterministic Day 025 seed varies peg layouts, bumper start angles, gate positions, coin type order, bell locations, tray targets, nudge drift, and endless constraints while keeping the opening fair.
  - Mastery badges: finish First Paw Chime without a gutter drop, trigger Grand Fortune under 235 seconds, bank 24 requested coins in clean order, ring 12 bells in one run, complete a commission with zero nudges, complete an endless fortune with all luck bells.
  - Strategic scoring rewards planning: rotate bumpers before release, use gates to sort rather than block, save Fortune Bell for a wrong-lane rescue, spend Lucky Paw before high-value waves, nudge lightly near tray mouths, and avoid chasing bonus bells when requested trays are already aligned.
  - Endless mode after Grand Fortune adds denser pegs, faster coins, alternating tray orders, fewer gate toggles, stronger gutter pull, stricter shake limits, and more coin waves without shrinking touch controls.
- Difficulty scaling:
  - 0-45 seconds: large trays, slow coins, broad bumpers, one bell, visible path preview, guided first drop.
  - 45-130 seconds: silver coin type, first gate, first gutter, three trays, Fortune Bell introduced, mild moving pegs.
  - 130-235 seconds: mixed coin order, tighter tray mouths, misfortune slips, crossing bumper angles, Lucky Paw timing, stricter shake.
  - 235+ seconds/endless: denser board, quicker coin waves, fewer safe toggles, same readable controls.
  - Keep mobile fair: coins, bumpers, gates, bells, tray mouths, gutter warnings, path previews, and action buttons must be large/readable at 390x844; primary touch buttons must be 52px+; no tiny survival-critical collision target.
- Scoring/rewards:
  - Requested coin banked in correct tray: +120 points times combo tier.
  - Bell ring before correct tray: +85 bonus and focus charge.
  - Clean paw-bumper redirect into requested tray: +170 bonus.
  - Correct gate toggle that prevents a wrong tray: +110 bonus.
  - Fortune Bell rescue delivery: +260 points and luck bell repair charge.
  - Commission complete below misfortune target: +650 points and repair one luck bell if below max.
  - Perfect no-gutter commission: +800 points.
  - Neko Grand Fortune: +1500 points and endless fortune commissions unlock.
  - Wrong tray: combo soft-reset, misfortune +8%.
  - Gutter drop: luck-bell damage if threshold crossed, misfortune +14%, combo reset.
  - Over-nudge/shake warning: cabinet shake +12%; crack a luck bell if abused while coins are active.

## Controls and layout

- Desktop:
  - Mouse click/tap: choose top drop slot, select/rotate a paw bumper, toggle a charm gate, press action buttons, start/pause overlay button, prompt link, or explainable HUD chips.
  - Mouse drag on the board: optional aim preview for the next drop slot; release only through the main Drop Coin button unless the UI is unambiguous.
  - Arrow keys or A/D: move the selected drop slot left/right.
  - Q/E: rotate selected paw bumper counterclockwise/clockwise.
  - G: toggle selected charm gate.
  - Space or Enter: Drop Coin / confirm start.
  - B: Fortune Bell when charged.
  - N: Nudge Cabinet.
  - Shift or L: Lucky Paw focus when charged.
  - P: pause/resume.
  - R: restart current run.
- Mobile/touch:
  - Use large Slot Left, Slot Right, Drop Coin, Rotate Paw, Toggle Gate, Fortune Bell, Nudge, Lucky Paw, Pause, and Restart buttons.
  - Tapping a bumper selects it; tapping Rotate Paw turns it visibly. Tapping a gate selects it; Toggle Gate opens/closes it if safe.
  - Tapping tray/bell/coin chips may show short explanations.
  - Optional drag-to-preview is allowed, but visible buttons are mandatory.
  - No tiny virtual joystick. Interaction is slot selection, coin drop, bumper rotation, gate toggling, bell rescue, nudge, focus, pause/restart.
- Mobile layout/orientation:
  - Default target is portrait phone play around 390x844; do not require landscape.
  - Top: compact fortune-shop HUD with score, best, luck bells, misfortune, combo, active slot, active tool, and elapsed time. Use cat/coin/bell/tray chips, not moon/rabbit/brush/kite/garden/depth chips.
  - Below top: fortune card with requested coin order, tray target, bell count, misfortune limit, nudge limit, and progress ticks.
  - Center: tall lucky-cat board with drop rail, coins, pegs, paw bumpers, gates, bells, trays, gutters, helper art, and path preview. It must remain playable without zooming.
  - Bottom: status helper plus large controls. Controls must not cover the active tray mouths, gutter warnings, or selected bumper/gate.
  - Tutorial must fit on the first portrait screen; optional details may be collapsible but objective, drop slots, bumpers, gates, bells, trays, nudge, Lucky Paw, pause/restart must be visible.
  - Requests must combine text, coin shapes, tray letters, symbols, and line styles so hue alone is not required.

## Menu and tutorial

Implement these states:

1. Title screen
   - Shows title “Neko Koban Bell Cascade”.
   - Shows Day 025 badge, mode badge “2D”, public route `/neko/`, best score, best Grand Fortune time if available, and a prompt link.
   - Shows a large Start button and visible tutorial panel by default.
   - Notes: “Audio starts after you press Start; visual coin paths work if muted.”
2. Tutorial text
   - Objective: “Drop koban coins, rotate paw bumpers, ring bells, and bank coins into matching fortune trays.”
   - Drop slots: pick a slot before releasing each coin wave; Lucky Paw previews the likely path.
   - Paw bumpers: rotate bumpers before coins arrive to redirect toward requested trays.
   - Charm gates: toggle gates to sort coins, but gates cannot close through an active coin.
   - Fortune Bell: rescue a nearby requested coin when charged.
   - Nudge: small cabinet nudges can save a coin, but overuse raises misfortune.
   - Pause/restart: P/R on desktop or visible buttons on mobile.
3. In-game HUD
   - Score, best score, luck bells, misfortune %, commission name, combo, active slot, elapsed time, requested coin/tray order, bell count, gate toggles, Fortune Bell charge, Lucky Paw charge, latest warning.
   - Pause/restart controls visible or immediately accessible.
4. Status helper
   - Non-blocking helper showing next requested coin, selected bumper/gate, likely tray, current shake risk, bell readiness, and expected score effect.
   - Must not cover the pachinko board or bottom controls on mobile.
5. Pause overlay
   - Resume, restart, tutorial reminder, controls summary, audio/mute toggle, prompt link.
6. Game-over/results overlay
   - Final score, best score, commission reached, Grand Fortune status, lucky chain, gutter drops, wrong trays, nudge count, mastery badges, restart button.
7. Neko Grand Fortune banner
   - Trigger once per run after all three commissions and 3900 score.
   - Non-blocking celebration: ceramic cats glow, koban coins spiral through bells, paper fortunes flutter open, trays shine gold, the helper waves a paw, and endless fortune commissions continue after the banner fades.

## Assets

Prefer Imagegen2 (`openai/gpt-image-2`) for final visual art: maneki-neko helper mascot, portrait lucky-cat fortune shop/cabinet background, coin/bell/tray/gate icon sheet, and decorative koban/fortune pieces. Canvas code may render interactive coins, pegs, bumpers, gate hitboxes, path previews, score sparks, physics, UI chrome, and fallback debug shapes. It should not create final character/background/icon art from scratch unless Imagegen2 is unavailable after a real attempt.

Archive source generated art under `release/games/025/assets/source/` and use optimized playable copies under `release/games/025/assets/`. Also copy optimized playable assets into `apps/day-025-neko-koban-bell-cascade/assets/` and the public alias `release/neko/assets/`.

For mobile-first crop safety: keep important content centered, leave 12-16% safe margins, avoid baked-in text, avoid watermarks, avoid fake UI labels, avoid tiny coin/peg details that disappear at final in-game size, and keep maneki-neko/coin/bell/tray/gate/gutter silhouettes distinct against red-and-gold shop backgrounds.

Generate or provide at least these final art assets:

1. Maneki-neko fortune helper mascot
   - Target: transparent PNG if possible, square source, final optimized texture around 512x512 or 256x256.
   - Archive path: `release/games/025/assets/source/neko-helper-source.png`
   - Optimized path: `release/games/025/assets/neko-helper.png`
   - Imagegen2 prompt: “A charming friendly Japanese maneki-neko fortune helper mascot for a mobile 2D koban coin pachinko browser arcade game, cream ceramic lucky cat with one raised paw, tiny vermilion collar bell, holding a glossy gold koban coin and paper fortune slip, playful smile, warm lantern rim light, centered readable silhouette, transparent or solid warm cream background, no checkerboard background, no text, no watermark, sprite-friendly, high contrast at small size.”
   - Aspect ratio: square.
2. Lucky-cat koban pachinko cabinet / shop background source
   - Target: portrait-friendly background suitable behind a tall 2D coin-drop board with open readable center.
   - Archive path: `release/games/025/assets/source/neko-cabinet-source.png`
   - Optimized path: `release/games/025/assets/neko-cabinet.png`
   - Imagegen2 prompt: “A cozy Japanese lucky-cat fortune shop pachinko cabinet for a portrait mobile arcade game, deep vermilion lacquer wood, gold trim, ceramic maneki-neko figurines at the sides, bronze shrine bells, paper omikuji slips, teal patina coin trays, warm lantern reflections, open readable vertical center area for falling koban coins and bumpers, crop-safe for phone portrait, no characters in the center, no readable text, no watermark.”
   - Aspect ratio: portrait.
3. Koban coin, paw bumper, bell, tray, gate, and fortune UI icon sheet source
   - Target: square icon sheet for objectives, hazards, tools, rewards, and UI decals.
   - Archive path: `release/games/025/assets/source/neko-icons-source.png`
   - Optimized path: `release/games/025/assets/neko-icons.png`
   - Imagegen2 prompt: “Small readable icon sheet for a Japanese maneki-neko koban coin pachinko arcade game: gold koban coin, silver koban coin, copper coin, cat-paw bumper, bronze fortune bell, teal coin tray A, red coin tray B, charm gate open, charm gate closed, misfortune gutter, paper omikuji slip, Lucky Paw focus emblem, luck bell heart, cabinet nudge arrows, Neko Grand Fortune emblem, transparent or solid warm cream background, no checkerboard background, high contrast, no text, no watermark, generous margins so no icons are cut off.”
   - Aspect ratio: square.

If Imagegen2 is unavailable or fails after a real attempt, create a clearly labeled emergency fallback using simple SVG/canvas lucky-cat/coin silhouettes, document the failure in `ai/postmortems/day-025.md`, and still keep source/fallback files under the same asset paths.

### Mandatory generated-image QA

For every generated image, include a real inspection step after generation and before integration:

- Analyze the actual generated file visually, not just the prompt text.
- For the maneki-neko mascot, verify transparent/cutout quality or clean background handling, readable friendly silhouette, centered pivot/crop margins, no unwanted text/watermarks, stable upright orientation, and that the raised paw/coin pose does not imply incompatible movement or rotation.
- Verify control-to-motion alignment in-game: Slot Left/Right must move the release slot in the expected direction, Drop Coin must spawn from the selected slot, Rotate Paw must visibly change bumper angle and redirect coins, Toggle Gate must affect coin sorting, Fortune Bell must attract the intended nearby coin, Nudge must push coins horizontally with risk, Lucky Paw must slow/preview as described, and trays/gutters/wrong-route feedback must affect intended areas.
- For the background, verify the center play area remains readable after portrait mobile crop and does not hide coins, pegs, bumpers, gates, bells, trays, gutter warnings, fortune card, helper, or controls.
- For the icon sheet, verify coin types, paw bumper, bell, trays, gate states, gutter, fortune slip, Lucky Paw, luck bell, nudge arrows, and Grand Fortune emblem are distinct at final HUD/button size and cannot be confused. Watch specifically for fake checkerboard transparency; alpha-clean or composite onto warm cream if needed and inspect again.
- If inspection finds a problem, regenerate or post-process the image and inspect again. Do not ship broken visual assets just because tests pass.

## Audio and game feel

Because coins, bumpers, bells, gates, and lucky-cat shop feedback are central to the theme, include lightweight WebAudio cues initialized only after a user gesture:

- Bright koban clink when a coin spawns, pitch varied by coin type.
- Soft ceramic bump when a coin hits a paw bumper, pitch based on impact speed.
- Tiny wooden gate click when toggling a charm gate.
- Bronze bell chime when a coin rings a fortune bell or when Fortune Bell activates.
- Low unlucky rattle when a coin enters a gutter or wrong tray.
- Gentle cabinet thump for Nudge with escalating warning tone if overused.
- Sparkly slowed-time shimmer when Lucky Paw focus activates.
- Rising koto/bell arpeggio when Neko Grand Fortune triggers.

Audio must not block play if WebAudio is unavailable. Verify no autoplay errors: audio context should be created/resumed only after Start or another user interaction. Include a visible mute toggle in pause/results or HUD.

## Prompt page output

The archived `release/games/025/prompt.html` must be a consistent rendered HTML page, not raw Markdown pasted into a `<pre>` block. It should include:

- A clear `<title>` and `<h1>` using `Day 025 Game Generation Prompt`.
- A back-to-game link near the top.
- Semantic rendered sections (`h2`, `h3`, `ul/ol/li`, `p`, `pre/code` only for actual code/commands).
- The same readable prompt-page style pattern across days so prompt pages feel like one system.

## Subagents to dispatch

1. Implementation subagent
   - Build the static 2D game under `apps/day-025-neko-koban-bell-cascade/`.
   - Integrate it into immutable release output under `release/games/025/`.
   - Create the public playable route under `release/neko/`.
   - Use static HTML/CSS/JS with Canvas/WebAudio and no backend.
   - The public alias must be self-contained or asset paths must be alias-safe.
2. Asset/polish subagent
   - Generate/prepare Imagegen2 assets, archive source files, optimize playable copies, inspect generated images, remove fake checkerboards if present, and tune mobile readability/game feel.
3. QA/browser/mobile subagent
   - Run desktop and mobile smoke checks, verify no console errors, verify menu/tutorial/objective/controls/restart/pause, prompt links, canvas board render, Slot Left/Right, Drop Coin, Rotate Paw, Toggle Gate, Fortune Bell, Nudge, Lucky Paw control presence, coin/tray/gutter feedback, generated screenshot, generated assets, WebAudio initialization after user gesture, and 390x844 portrait layout.
4. Reflection/self-improvement subagent
   - Write `ai/postmortems/day-025.md` after validation with what worked, what failed, generated-image inspection notes, audio verification, code-isolation confirmation, and whether generator/template/rubric improvements are justified.

## Acceptance criteria

- Static build passes.
- Code isolation is documented in QA/postmortem: no previous game implementation code was opened, inspected, copied, diffed, grepped, or adapted.
- Mode choice follows the cadence rule: Day 025 is `2d` after Day 024 `3d` with zero latest 2D streak, and the mechanic is rich direct coin-routing gameplay rather than a low-effort flat demo.
- Desktop smoke passes.
- Mobile portrait smoke passes at about 390x844 with readable HUD/tutorial/fortune card, tall board, usable 52px+ slot/action/pause/restart controls, no forced landscape canvas, and no tiny survival-critical coins/tray mouths.
- Prompt is visible from gallery and release folder.
- `prompts/day-025.md` is copied exactly to `release/games/025/prompt.md` and `release/neko/prompt.md`.
- `release/games/025/prompt.html` and `release/neko/prompt.html` render the prompt in browser-readable semantic HTML with the standard prompt-page styling, not a raw Markdown `<pre>` dump.
- Public alias `release/neko/index.html`, `release/neko/prompt.html`, `release/neko/screenshot.png`, and `release/neko/assets/` exist and work.
- Gallery card for Day 025 shows prompt availability, generation duration, public `/neko/` links, mode `2d`, and actual generated date.
- Screenshot exists at `release/games/025/screenshot.png` and is non-empty/readable. Prefer a readable desktop gameplay screenshot for gallery cards; mobile screenshots are QA evidence unless the design is intentionally portrait-card friendly.
- Image/source assets exist under `release/games/025/assets/source/` and optimized assets exist under `release/games/025/assets/`, or a documented emergency fallback exists.
- Every generated image has an inspection note in the postmortem or QA notes; interactive coin/bell/tray visuals have verified background handling, orientation/pivot/crop, readability, and control-to-motion alignment.
- WebAudio initializes after user gesture and creates no autoplay console errors; audio is failsafe if unsupported and visual coin path cues remain playable muted.
- No console errors during desktop or mobile smoke. Add data-URI favicons to game and prompt pages if needed to avoid favicon request noise.
- Existing `release/games/001/**` through `release/games/024/**` from origin/main remain unchanged.
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
# Screenshot/static checks: verify release/games/025/screenshot.png, prompt.md, prompt.html, index.html, game.js, styles.css, release/neko/index.html, release/neko/prompt.html, release/neko/screenshot.png, optimized assets, and source assets exist and are non-empty.
# Prompt copy check: cmp prompts/day-025.md release/games/025/prompt.md and cmp prompts/day-025.md release/neko/prompt.md.
# Prompt HTML check: verify release/games/025/prompt.html has semantic h1/h2/list markup and a back-to-game link, not a raw Markdown dump inside <pre>, and no malformed ul > p or ol > p nodes.
# Browser smoke: open the local/static /neko/ route and verify menu, tutorial, gameplay start, canvas board render, Slot Left/Right, Drop Coin, Rotate Paw, Toggle Gate, Fortune Bell, Nudge, Lucky Paw control presence, coin/tray/gutter feedback, pause, restart, prompt page, WebAudio after user gesture, no console errors.
# Mobile smoke: repeat at a portrait phone viewport such as 390x844 and verify playable tap controls plus readable HUD/fortune card/board/controls.
# Static screenshot check: inspect release/games/025/screenshot.png and release/neko/screenshot.png for non-empty readable game content; use vision to judge actual visual quality.
# Image QA: inspect every Imagegen2 source/optimized asset and document the actual inspection result in ai/postmortems/day-025.md.
# Docker/static smoke: build the Docker image locally, run it, curl /neko/ and /neko/prompt.html, then stop the container.
# Immutable guard: confirm no release/games folders from origin/main changed except new Day 025.
```
