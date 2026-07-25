# Day 043 Game Generation Prompt

## Game identity

- Day: 043
- Title: Karuta Mooncall Duelist
- Slug: karuta-mooncall-duelist
- Public route word: karuta
- Mode: 2D
- Genre: mobile-first karuta memory-reaction arcade / poem-card scanning / calm duel score chase
- Mood/style: a lantern-lit winter karuta parlor at night, lacquer-red reader stand, cream poem cards scattered on a dark indigo play cloth, moonbeam card glints, quick hand-sweep motion, tiny suzume card-reader helper, paper flutter and bell timing; a touch-first listening/memory duel rather than cedar climbing, mycelium routing, kintsugi repair, tatami room planning, griddle cooking, fish scooping, gear engineering, bridge building, thread wrapping, fan dyeing, onsen valves, ikebana, orchard harvesting, kumiko woodworking, shrine stealth, tea foam, fireworks, pachinko, mochi hopping, calligraphy tracing, kite mapping, sand raking, underwater routing, taiko rhythm routing, daruma maze tilting, web weaving, pottery shaping, bamboo canal routing, origami folding, parasol sheltering, snow stacking, kimono stamping, bento service, windbell tuning, rail running, or koi collection.

## Why this game today

The generated series currently ends with:

- Day 039 `2d`: Tatami Moonroom Matwright, top-down room-layout logic, tatami rectangles, seam/path constraints, calico helper.
- Day 040 `3d`: Kohaku Kintsugi Star Mender, dark 3D repair tray, curved shards, gold lacquer, clamps, sparrow helper.
- Day 041 `2d`: Kinoko Mycelium Glowkeeper, dark forest-floor network routing, mushroom caps, pulse paths, beetles, kodama helper.
- Day 042 `3d`: Kabuto Cedar Canopy Climber, bright vertical 3D cedar trunk, orbit lanes, climbing, branch leaps, beetle hero.

The latest generated-mode streak is one `3d` (Day 042), so Day 043 may safely return to a rich mobile-first `2d` design. It should be quick, readable, and highly tactile on a phone: watching a poem cue, scanning a spread of cards, narrowing the correct target with memory tools, then sweeping the card before the rival hand reaches it. This differs from the recent alternation by using short rounds, card-recognition pressure, recall/combo strategy, and hand-sweep timing instead of continuous climbing, network routing, repair alignment, or room planning.

Recent visual variety notes to avoid repeating:

- Day 042 uses a bright sky-blue vertical field with a central brown trunk and two-row chunky controls.
- Day 041 uses a dark green board with glowing organic routes and mushroom-card HUD chips.
- Day 040 uses an amber/purple close-up workbench with oval tray, porcelain shards, and gold seam detail.
- Day 039 uses green-gold tatami rectangles and room-planning overlays.

Day 043 should use a low, horizontal card-table composition inside a portrait layout: warm paper cards, red reader cushion, indigo cloth, moonlit edges, card shadows, rival hand silhouettes, flutter trails, suzume helper, and crisp typographic cue panels. Avoid central trees/trunks/branch ledges, glowing root networks, porcelain shards/gold seams, room-layout grids, griddles/cakes, water/fish/nets, gears, bridges, thread spheres, pigment fans, valves, flowers, fruit baskets, lattice strips, stealth cones, tea foam, firework arcs, pachinko pegs, mochi pads, brush strokes, kite strings, sand rake lines, pearls, taiko pads, maze boards, web strands, pottery profiles, bamboo canal tiles, origami creases, parasols, snow blocks, kimono panels, conveyor food, windbell notes, rail tracks, or koi ponds.

## Code isolation / no previous game source

The implementation must be written from scratch for this day. Do not open, inspect, copy, diff, grep, or adapt code from previous games, including old `apps/day-*` folders, old `release/games/NNN/` HTML/CSS/JS files, or old public alias folders. You may inspect previous metadata, prompts, postmortems, and screenshots only to avoid repeating concepts and visual identity. The new game's HTML/CSS/JS must come from this prompt and general browser/Canvas/WebAudio game knowledge, not from earlier game implementations.

## Mode variety / 3D cadence

Inspection target: `src/data/games.ts` currently ends with Day 039 `2d`, Day 040 `3d`, Day 041 `2d`, and Day 042 `3d`. The latest generated-mode streak is one `3d`.

Mode decision: Day 043 is a substantial `2d` game selected after a real 3D day. It must have genuine depth in its 2D mechanics:

- Use static-browser HTML/CSS/JS with Canvas/SVG/DOM/WebAudio as appropriate; no backend.
- Render a 2D karuta table with a shuffled card field, readable card backs/faces, cue line, rival hand lanes, memory marks, card confidence glows, sweep trails, and round progress.
- Gameplay must depend on 2D state: card positions, cue syllable sequence, suit/season mark, revealed memory, rival reach path, false-card decoys, player scan cone, focus charge, streak, sweep timing, card lock, and remaining poem deck.
- Player actions must manipulate the system: scan cards, move selection, mark memory, lock a suspected card, sweep the active card, guard against rival hand, reshuffle a small fan, use Mooncall Focus to preview likely matches, pause/restart, mute/audio, and open prompt.
- Portrait mobile is the default supported layout; no landscape gate.

## Design

- Objective: Listen to each mooncall cue, identify the matching karuta card among decoys, sweep it before the rival hand, preserve memory streaks, and win three poem sets before the lantern timer burns down.
- Win condition: Complete three duel sets — First Moon Syllable, Crane Verse Rush, and Full Lantern Match — while reaching 5700 points to trigger “Karuta Mooncall Victory”. After the banner, continue into endless card-call rounds.
- Lose condition: Three focus hearts are lost, the rival hand wins six cards, three wrong sweeps happen in one set, lantern time reaches 0%, or the final Full Lantern cue is missed twice.
- Core loop:
  1. Start on a title/menu screen with Day 043 badge, mode badge “2D”, public route `/karuta/`, best score, best Mooncall Victory time, tutorial, prompt link, audio note, and a large Start button.
  2. Show a portrait-friendly karuta table. The center contains 10-16 cards on an indigo cloth. Cards have large symbol groups, season seals, moon/call marks, and short romanized cue fragments; never rely on tiny Japanese text for survival-critical matching.
  3. A reader card calls a cue such as “Moon reed / blue seal / third beat”. The matching card has a related symbol/season/cue combination; decoys share one or two traits.
  4. Player taps cards or uses Card −/+ to move selection. The selected card lifts, glows, and shows its remembered traits in the helper line.
  5. Scan Fan briefly reveals two traits on nearby cards and increases confidence rings around likely matches.
  6. Memory Mark places a small moon pin on a suspected card; marked cards stay easier to identify after flutter/reshuffle.
  7. Lock Card commits the current suspected target and slows the rival hand briefly, but a wrong lock costs combo and focus.
  8. Sweep Card performs the decisive hand sweep. Correct sweep before rival reach scores, collects the card, and advances poem chain. Wrong sweep knocks the card field and reveals false-card penalties.
  9. Guard Rival blocks one rival hand lane for a short window. It is strongest when used after the rival silhouette enters a red warning zone.
  10. Reshuffle Fan rotates a small cluster of cards to expose hidden symbols but spends lantern time and can move a marked card unless locked.
  11. Mooncall Focus, charged by correct sweeps and memory streaks, overlays likely target cards, rival paths, decoy warnings, cue trait matches, safe sweep timing, and set progress.
  12. Completing a set stamps a poem seal, restores one focus heart if below max, awards points, changes card count/cue complexity, and unlocks faster rival hands, more decoys, moving moon shadows, two-stage cues, and multi-card chain calls.
  13. Pause/restart remain visible throughout.
- 15+ minute play-value strategy:
  - Save best score, fastest Karuta Mooncall Victory time, longest perfect sweep streak, most cards won before rival, fewest wrong locks, highest endless poem set, best no-focus victory, and collected poem-seal badges in localStorage.
  - Include three authored duel sets:
    - First Moon Syllable: 10 cards, broad trait matches, visible first target, guided Scan Fan and Sweep Card, no heart penalty for the first tutorial wrong card.
    - Crane Verse Rush: 12 cards, first rival hand, two trait decoys, required Memory Mark, first Guard Rival warning, and one cluster reshuffle.
    - Full Lantern Match: 16 cards, faster rival, two-stage cue, required Mooncall Focus preview, three decoys sharing traits, and final chain of three correct sweeps.
  - Deterministic Day 043 seed varies card layout, cue order, symbols, season seals, rival lane timing, flutter strength, decoy density, scan radius, focus charge, lock slowdown, sweep tolerance, and endless constraints while keeping the first seconds fair.
  - Mastery badges: complete First Moon Syllable with zero wrong sweeps, trigger Mooncall Victory under 285 seconds, finish Crane Verse with every Memory Mark correct, beat Full Lantern while rival wins fewer than two cards, chain five correct sweeps, win a set without Mooncall Focus, and block three rival hands perfectly.
  - Strategic scoring rewards attention and recall: scan before sweeping, mark cards that match two traits, lock only when confident, guard after red warning instead of too early, reshuffle only when target is hidden, save Mooncall Focus for two-stage cues, and preserve combo by accepting a missed rival card instead of a panic wrong sweep.
  - Endless mode after Mooncall Victory adds more card symbols, rotating card fans, alternating cue traits, faster rival hands, mirror decoys, shorter lantern timer, and bonus poem chains without shrinking touch targets.
- Difficulty scaling:
  - 0-45 seconds: 10 cards, slow rival, one-trait cues, strong highlights, forgiving sweep windows.
  - 45-150 seconds: 12 cards, trait decoys, first rival hand, Memory Mark and Guard Rival matter.
  - 150-285 seconds: 16 cards, two-stage cues, faster rival, required Mooncall Focus, cluster reshuffles.
  - 285+ seconds/endless: more decoys, moving moon shadows, tighter cue windows, same readable controls.
  - Keep mobile fair: cards, cue panel, rival warning, helper, focus/rival/lantern HUD, and action buttons must be readable at 390x844; primary touch buttons should be 52px+ where possible and never below 44px; no tiny survival-critical glyphs.
- Scoring/rewards:
  - Correct card selected before sweep: +110 points times combo tier.
  - Correct Sweep Card before rival: +260 points and Mooncall Focus charge.
  - Perfect sweep after Lock Card: +320 points.
  - Memory Mark later proves correct: +180 points and combo protect.
  - Guard Rival during red warning: +210 points.
  - Scan Fan reveals hidden target trait: +140 points.
  - Complete set before lantern warning: +980 points and restore one focus heart if below max.
  - Perfect no-wrong set: +1500 points.
  - Karuta Mooncall Victory: +3300 points and endless poem sets unlock.
  - Wrong sweep, wrong lock, or panic reshuffle: combo reset and heart/lantern penalty.

## Controls and layout

- Desktop:
  - Mouse click/tap: select cards, press controls, start/pause overlay button, prompt link, or explainable HUD chips.
  - Mouse drag across the table: sweep toward the selected card with a visible trail and target ring.
  - Arrow keys or WASD: move selection between nearest cards.
  - Space or Enter: Sweep Card.
  - S: Scan Fan.
  - M: Memory Mark.
  - L: Lock Card.
  - G: Guard Rival.
  - F: Reshuffle Fan.
  - Shift or C: Mooncall Focus when charged.
  - P: pause/resume.
  - R: restart current run.
- Mobile/touch:
  - Tap a card to select it; drag a short swipe over it to Sweep Card. Card targets are large and have a visible lift/glow so the finger does not hide the symbol.
  - Use large Card −, Card +, Scan Fan, Memory Mark, Lock Card, Sweep Card, Guard Rival, Reshuffle Fan, Mooncall Focus, Pause, Restart, Audio, and Prompt buttons.
  - Tapping cue/lantern/rival/focus/combo chips may show short explanations.
  - No tiny virtual joystick. Interaction is direct card tap/swipe plus labeled action controls.
- Mobile layout/orientation:
  - Default target is portrait phone play around 390x844; do not require landscape.
  - Top: compact Karuta HUD with score, best, focus hearts, lantern %, rival cards, combo, active card, cue trait, sweep window, rival risk, Mooncall Focus charge, and elapsed time. Use card/moon/fan/hand/bell/lantern/poem chips, not beetle/sap/trunk/root/mushroom/shard/tatami/cake/fish/gear/bridge/thread/fan-dye/valve/flower/fruit/lattice/shrine/tea-foam/firework/cat-coin/rabbit/brush/kite/sand/pearl/drum icons.
  - Below top: reader/cue card with current poem set, cue fragments, trait marks, rival countdown, progress ticks, and latest call.
  - Center: large karuta table with cards, selection ring, memory pins, lock moon, rival hand path, sweep trail, flutter particles, suzume helper art, and readable feedback. It must remain playable without zooming.
  - Bottom: status helper plus large card/action controls. Controls must not cover cards, cue panel, helper, rival warnings, or sweep trails.
  - Tutorial must fit on the first portrait screen; optional details may be collapsible but objective, select card, Scan Fan, Memory Mark, Lock Card, Sweep Card, Guard Rival, Reshuffle Fan, Mooncall Focus, pause/restart must be visible.
  - Requests must combine text, icons, card shapes, trait marks, progress ticks, sweep windows, and labels so hue alone is not required.

## Menu and tutorial

Implement these states:

1. Title screen
   - Shows title “Karuta Mooncall Duelist”.
   - Shows Day 043 badge, mode badge “2D”, public route `/karuta/`, best score, best Mooncall Victory time if available, and a prompt link.
   - Shows a large Start button and visible tutorial panel by default.
   - Notes: “Audio starts after you press Start; visual cue, card, rival, lantern, and focus cues work if muted.”
2. Tutorial text
   - Objective: “Listen to the mooncall, find the matching card, and sweep it before the rival hand.”
   - Reading cues: match cue fragments with card symbols, season seals, and moon marks.
   - Memory: use Scan Fan to reveal traits, Memory Mark suspected cards, and Lock Card only when confident.
   - Duel timing: Sweep Card before the rival hand reaches the card; Guard Rival in the red warning lane.
   - Mooncall Focus: previews likely targets, decoys, rival paths, and safe sweep timing when charged.
   - Pause/restart: P/R on desktop or visible buttons on mobile.
3. In-game HUD
   - Score, best score, focus hearts, lantern %, rival cards, set name, combo, selected/active card, cue trait, sweep window, rival risk, Mooncall Focus charge, elapsed time, latest warning.
   - Pause/restart controls visible or immediately accessible.
4. Status helper
   - Non-blocking helper showing selected card, cue match count, decoy warning, rival warning, lock confidence, Mooncall Focus readiness, and expected score effect.
   - Must not cover the karuta table or bottom controls on mobile.
5. Pause overlay
   - Resume, restart, tutorial reminder, controls summary, audio/mute toggle, prompt link.
6. Game-over/results overlay
   - Final score, best score, poem set reached, Mooncall Victory status, wrong sweeps, rival wins, correct marks, guard saves, badges, restart button.
7. Karuta Mooncall Victory banner
   - Trigger once per run after all three duel sets and 5700 score.
   - Non-blocking celebration: cards flutter into a crescent, moon seals glow, the suzume reader bows from the cushion, a tiny bell rings, and endless poem calls continue after the banner fades.

## Assets

Prefer Imagegen2 (`openai/gpt-image-2`) for final visual art: suzume karuta reader helper mascot, portrait karuta parlor/table background, card/symbol/rival-hand sprite sheet, and karuta UI icon sheet. Canvas/SVG code may render the interactive card rectangles, selection rings, confidence glows, rival paths, sweep trails, particles, and UI chrome. It should not create final character/background/texture/icon art from scratch unless Imagegen2 is unavailable after a real attempt.

Archive source generated art under `release/games/043/assets/source/` and use optimized playable copies under `release/games/043/assets/`. Also copy optimized playable assets into `apps/day-043-karuta-mooncall-duelist/assets/` and the public alias `release/karuta/assets/`.

For mobile-first crop safety: keep important content centered, leave 12-16% safe margins, avoid baked-in readable text, avoid watermarks, avoid fake UI labels, avoid tiny card glyph details that disappear at final size, and keep helper/cards/rival hand/moon/fan/lantern/focus silhouettes distinct against indigo cloth and warm paper backgrounds.

Generate or provide at least these final art assets:

1. Suzume karuta reader helper mascot
   - Target: transparent PNG if possible, square source, final optimized texture around 512x512 or 256x256.
   - Archive path: `release/games/043/assets/source/karuta-helper-source.png`
   - Optimized path: `release/games/043/assets/karuta-helper.png`
   - Imagegen2 prompt: “A charming tiny suzume sparrow karuta reader mascot for a mobile Japanese karuta memory-reaction arcade game, small friendly sparrow wearing a crimson reader vest, perched beside a lacquer poem stand, holding a tiny fan and moon-seal card, bright attentive eyes, warm lantern rim light, centered readable silhouette, transparent or solid warm parchment background, no checkerboard background, no readable text, no watermark, sprite-friendly, high contrast at small size.”
   - Aspect ratio: square.
2. Moonlit karuta parlor table background source
   - Target: portrait-friendly background suitable behind a large 2D card table with open readable center.
   - Archive path: `release/games/043/assets/source/karuta-parlor-source.png`
   - Optimized path: `release/games/043/assets/karuta-parlor.png`
   - Imagegen2 prompt: “A moonlit Japanese karuta parlor for a portrait mobile 2D card-reaction game, dark indigo play cloth on a low lacquer table, warm lanterns at the edges, a red reader cushion and small poem stand near the top, cream paper cards suggested around the edges, soft moonbeam highlights, open readable central table space for interactive overlaid cards, crop-safe for phone portrait, no central character, no readable text, no watermark.”
   - Aspect ratio: portrait.
3. Karuta card, moon seal, fan, and rival-hand sprite sheet source
   - Target: square sheet with separated readable materials that can be used as sprites/decals.
   - Archive path: `release/games/043/assets/source/karuta-pieces-source.png`
   - Optimized path: `release/games/043/assets/karuta-pieces.png`
   - Imagegen2 prompt: “Sprite sheet of small readable karuta duel game pieces: blank cream poem card front with abstract moon mark, red card back, blue season seal, gold moon seal, small folded paper fan, memory pin, lock moon, sweeping hand motion blur, rival hand silhouette, lantern spark, poem seal badge, each element separated with generous margins, transparent or warm parchment background, no checkerboard background, no readable text, no watermark, readable at 40-96 pixels.”
   - Aspect ratio: square.
4. Karuta card, scan, mark, lock, sweep, rival, lantern, and focus UI icon sheet source
   - Target: square icon sheet for objectives, hazards, tools, rewards, and UI decals.
   - Archive path: `release/games/043/assets/source/karuta-icons-source.png`
   - Optimized path: `release/games/043/assets/karuta-icons.png`
   - Imagegen2 prompt: “Small readable icon sheet for a Japanese karuta memory-reaction arcade game: poem card, mooncall cue, scan fan, memory mark pin, lock card moon, sweep hand, rival hand warning, reshuffle fan, lantern timer, focus heart, Mooncall Focus crescent emblem, poem seal, combo star, Victory crescent card crest, transparent or solid warm parchment background, no checkerboard background, high contrast, no readable text, no watermark, generous margins so no icons are cut off.”
   - Aspect ratio: square.

If Imagegen2 is unavailable or fails after a real attempt, create a clearly labeled emergency fallback using simple SVG/canvas suzume/card/fan/hand/icon silhouettes, document the failure in `ai/postmortems/day-043.md`, and still keep source/fallback files under the same asset paths.

### Mandatory generated-image QA

For every generated image, include a real inspection step after generation and before integration:

- Analyze the actual generated file visually, not just the prompt text.
- For the suzume helper mascot, verify transparent/cutout quality or clean background handling, readable sparrow silhouette, centered pivot/crop margins, no unwanted text/watermarks, stable upright orientation, and that fan/card pose is compatible with static helper placement.
- For the pieces sheet, verify separated card front/back, seals, fan, memory pin, lock moon, sweep hand blur, rival hand silhouette, spark, and poem seal at final 40-96px size, usable crop margins, no baked checkerboard, no unwanted readable text/watermark, and a documented visual baseline: card front is cream with abstract marks; rival hand silhouette points toward contested card; player sweep trail is warm gold.
- Verify control-to-motion alignment in-game: selecting a card must visibly highlight the intended card, Scan Fan must reveal/confidence-mark traits, Memory Mark must add/remove a pin, Lock Card must slow/commit, Sweep Card must animate a trail toward the selected card and remove/score correct cards, Guard Rival must visibly slow/block a rival path, Reshuffle Fan must move card cluster, Mooncall Focus must preview targets/decoys/rival paths, Pause/Restart must work.
- For the background, verify the central table remains readable after portrait mobile crop and does not hide cards, cue card, helper, rival warnings, sweep trails, or controls.
- For the icon sheet, verify card, cue, scan, mark, lock, sweep, rival, reshuffle, lantern, focus heart, Mooncall Focus, poem seal, combo, and Victory crest are distinct at final HUD/button size and cannot be confused. Watch specifically for fake checkerboard transparency; alpha-clean or composite onto warm parchment if needed and inspect again.
- If inspection finds a problem, regenerate or post-process the image and inspect again. Do not ship broken visual assets just because tests pass.

## Audio and game feel

Because spoken/called cues, card flutter, hand sweeps, rival warnings, lantern pressure, and poem victory bells are central to the theme, include lightweight WebAudio cues initialized only after a user gesture:

- Soft reader woodblock tick when a new cue appears.
- Paper tap when selecting a card.
- Fan flutter when Scan Fan or Reshuffle Fan is used.
- Small moon chime when Memory Mark or Lock Card succeeds.
- Fast paper swoosh when Sweep Card fires.
- Warm bell when a correct sweep lands.
- Dull paper slap for wrong sweep.
- Low warning knock when rival hand enters red lane.
- Lantern hiss when time pressure rises.
- Crescent shimmer when Mooncall Focus activates.
- Bright bell-and-paper-flutter flourish when Karuta Mooncall Victory triggers.

Audio must not block play if WebAudio is unavailable. Verify no autoplay errors: audio context should be created/resumed only after Start or another user interaction. Include a visible mute toggle in pause/results or HUD. Expose a narrow debug handle such as `window.__day043Audio = { ctx, enabled }` after user-gesture initialization so Playwright can assert audio state.

## Prompt page output

The archived `release/games/043/prompt.html` must be a consistent rendered HTML page, not raw Markdown pasted into a `<pre>` block. It should include:

- A clear `<title>` and `<h1>` using `Day 043 Game Generation Prompt`.
- A back-to-game link near the top.
- Semantic rendered sections (`h2`, `h3`, `ul/ol/li`, `p`, `pre/code` only for actual code/commands).
- The same readable prompt-page style pattern across days so prompt pages feel like one system.

## Subagents to dispatch

1. Implementation subagent
   - Build the static 2D game under `apps/day-043-karuta-mooncall-duelist/`.
   - Integrate it into immutable release output under `release/games/043/`.
   - Create the public playable route under `release/karuta/`.
   - Use static HTML/CSS/JS with Canvas/SVG/DOM/WebAudio and no backend.
   - The public alias must be self-contained or asset paths must be alias-safe.
2. Asset/polish subagent
   - Generate/prepare Imagegen2 assets, archive source files, optimize playable copies, inspect generated images, remove fake checkerboards if present, document card/front/rival-hand/sweep visual baselines, and tune mobile readability/game feel.
3. QA/browser/mobile subagent
   - Run desktop and mobile smoke checks, verify no console errors, verify menu/tutorial/objective/controls/restart/pause, prompt links, card table render, card selection/tap/drag, Card −/+, Scan Fan, Memory Mark, Lock Card, Sweep Card, Guard Rival, Reshuffle Fan, Mooncall Focus control presence and visible mechanical effect, cue/card/rival/lantern/focus feedback, generated screenshot, generated assets, WebAudio initialization after user gesture, and 390x844 portrait layout.
4. Reflection/self-improvement subagent
   - Write `ai/postmortems/day-043.md` after validation with what worked, what failed, generated-image inspection notes, card/rival-hand/sweep visual baselines, audio verification, code-isolation confirmation, and whether generator/template/rubric improvements are justified.

## Acceptance criteria

- Static build passes.
- Code isolation is documented in QA/postmortem: no previous game implementation code was opened, inspected, copied, diffed, grepped, or adapted.
- Mode choice follows the cadence rule: Day 043 is `2d` after Day 042 `3d`, with meaningful card recognition, memory, rival timing, sweep, and focus mechanics rather than low-effort flat decoration.
- Desktop smoke passes.
- Mobile portrait smoke passes at about 390x844 with readable HUD/tutorial/cue card/table, usable 44px+ card/action/pause/restart controls, no forced landscape canvas, and no tiny survival-critical symbols.
- Prompt is visible from gallery and release folder.
- `prompts/day-043.md` is copied exactly to `release/games/043/prompt.md` and `release/karuta/prompt.md`.
- `release/games/043/prompt.html` and `release/karuta/prompt.html` render the prompt in browser-readable semantic HTML with the standard prompt-page styling, not a raw Markdown `<pre>` dump.
- Public alias `release/karuta/index.html`, `release/karuta/prompt.html`, `release/karuta/screenshot.png`, and `release/karuta/assets/` exist and work.
- Gallery card for Day 043 shows prompt availability, generation duration, public `/karuta/` links, mode `2d`, and actual generated date.
- Screenshot exists at `release/games/043/screenshot.png` and is non-empty/readable. Prefer a readable desktop gameplay screenshot for gallery cards; mobile screenshots are QA evidence unless the design is intentionally portrait-card friendly.
- Image/source assets exist under `release/games/043/assets/source/` and optimized assets exist under `release/games/043/assets/`, or a documented emergency fallback exists.
- Every generated image has an inspection note in the postmortem or QA notes; interactive card/table/rival/sweep visuals have verified background handling, orientation/pivot/crop, readability, and control-to-motion alignment.
- WebAudio initializes after user gesture and creates no autoplay console errors; audio is failsafe if unsupported and visual cue/card/rival/lantern/order cues remain playable muted.
- No console errors during desktop or mobile smoke. Add data-URI favicons to game and prompt pages if needed to avoid favicon request noise.
- Existing `release/games/001/**` through `release/games/042/**` from origin/main remain unchanged.
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
# Screenshot/static checks: verify release/games/043/screenshot.png, prompt.md, prompt.html, index.html, game.js, styles.css, release/karuta/index.html, release/karuta/prompt.html, release/karuta/screenshot.png, optimized assets, and source assets exist and are non-empty.
# Prompt copy check: cmp prompts/day-043.md release/games/043/prompt.md and cmp prompts/day-043.md release/karuta/prompt.md.
# Prompt HTML check: verify release/games/043/prompt.html has semantic h1/h2/list markup and a back-to-game link, not a raw Markdown dump inside <pre>, and no malformed ul > p or ol > p nodes, no direct nested lists, and no strong/b tags inside code.
# Browser smoke: open the local/static /karuta/ route and verify menu, tutorial, gameplay start, card table render, card selection/drag, Card −/+, Scan Fan, Memory Mark, Lock Card, Sweep Card, Guard Rival, Reshuffle Fan, Mooncall Focus, cue/card/rival/lantern/focus feedback, pause, restart, prompt page, WebAudio after user gesture, no console errors.
# Mobile smoke: repeat at a portrait phone viewport such as 390x844 and verify playable card/action controls plus readable HUD/cue card/stage/controls.
# Static screenshot check: inspect release/games/043/screenshot.png and release/karuta/screenshot.png for non-empty readable game content; use vision to judge actual visual quality.
# Image QA: inspect every Imagegen2 source/optimized asset and document the actual inspection result in ai/postmortems/day-043.md.
# Docker/static smoke: build the Docker image locally, run it, curl /karuta/ and /karuta/prompt.html, then stop the container.
# Immutable guard: confirm no release/games folders from origin/main changed except new Day 043.
```
