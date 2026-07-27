# Day 045 Game Generation Prompt

## Game identity

- Day: 045
- Title: Kendama Star Cup Juggler
- Slug: kendama-star-cup-juggler
- Public route word: kendama
- Mode: 2D
- Genre: mobile-first pendulum dexterity arcade / cup-and-spike timing / festival toy score chase
- Mood/style: a warm dusk Japanese toy-stall counter with a polished wooden kendama, lacquer cups, a red ball on a string, tiny paper star charms, lantern bokeh, chalk timing arcs, wood-clack feedback, and crisp toy-physics readability; a tactile 2D skill game rather than shaved-ice 3D sculpting, karuta card scanning, cedar trunk climbing, mycelium routing, kintsugi shard repair, tatami room planning, griddle cooking, goldfish scooping, karakuri gears, bridge trusses, temari thread orbits, fan dyeing, onsen valves, ikebana, orchard harvesting, kumiko woodworking, shrine stealth, matcha whisking, fireworks, pachinko, mochi hopping, calligraphy, kite mapping, dry-garden raking, underwater pearls, taiko routing, daruma tilting, web weaving, pottery shaping, canal routing, origami folding, parasol sheltering, snow stacking, kimono stamping, bento service, windbell tuning, rail running, or koi collection.

## Why this game today

The generated series currently ends with:

- Day 041 `2d`: Kinoko Mycelium Glowkeeper, dark bioluminescent forest network routing with mushroom caps and nutrient pulses.
- Day 042 `3d`: Kabuto Cedar Canopy Climber, bright vertical 3D cedar trunk with orbiting beetle, sap beads, and branch leaps.
- Day 043 `2d`: Karuta Mooncall Duelist, dark indigo card-table reaction/memory duel with reader cues and rival hand lanes.
- Day 044 `3d`: Kakigori Prism Shavewright, bright 3D dessert sculpting with translucent shaved ice, syrup channels, toppings, and melt pressure.

The latest generated-mode streak is one `3d` (Day 044), so Day 045 deliberately returns to a high-feel `2d` dexterity game while preserving the alternating cadence. It should not feel like a flat board puzzle: the core is pendulum timing, cup geometry, string tension, ball momentum, target arcs, and catch/release rhythm. The game should read immediately on a phone, reward repeated mastery, and contrast Day 044's slow sculpting by emphasizing short, satisfying wood-clack actions.

Recent visual variety notes from screenshots:

- Day 044 is bright cream/cyan with a centered 3D ice mound, broad HUD chips, a dessert order card, and 16 chunky controls.
- Day 043 is a dark indigo horizontal card table with cream cards, rival overlay, warm gold labels, and dense bottom card controls.
- Day 042 is a bright sky-blue vertical trunk climb with a central cedar column, beetle proxy, branch ledges, and two-row climb controls.
- Day 041 is dark green glowing organic route networks and mushroom objective nodes.

Day 045 should contrast with a single heroic toy silhouette on a warm lacquer counter: honey maple wood, vermilion ball, indigo string, chalk-white trajectory arcs, paper star charms, tiny brass score bell, fabric shadows, and lantern reflections. Avoid translucent dessert mounds, syrup flows, card spreads, reader panels, rival hands, vertical trunks, beetles, sap beads, branch ledges, glowing mycelium networks, mushroom caps, porcelain shards, gold crack seams, tatami rectangles, griddles/cakes/smoke, fish tanks/nets, gears/couplers, bridge trusses, thread spheres, pigment fan sectors, valve ducts, floral stems, fruit baskets, kumiko lattice strips, stealth cones, tea foam bowls, firework launch arcs, pachinko pegs, mochi platforms, brush strokes, kite strings, sand rake lines, pearls, taiko pads, maze boards, web strands, pottery profiles, bamboo canal tiles, origami creases, parasols, snow blocks, kimono panels, conveyor food, windbell notes, rail tracks, or koi ponds.

## Code isolation / no previous game source

The implementation must be written from scratch for this day. Do not open, inspect, copy, diff, grep, or adapt code from previous games, including old `apps/day-*` folders, old `release/games/NNN/` HTML/CSS/JS files, or old public alias folders. You may inspect previous metadata, prompts, postmortems, and screenshots only to avoid repeating concepts and visual identity. The new game's HTML/CSS/JS must come from this prompt and general browser/Canvas/WebAudio game knowledge, not from earlier game implementations.

## Mode variety / 3D cadence

Inspection target: `src/data/games.ts` currently ends with Day 041 `2d`, Day 042 `3d`, Day 043 `2d`, and Day 044 `3d`. The latest generated-mode streak is one `3d`.

Mode decision: Day 045 is a substantial `2d` game selected after a real 3D day. It must have meaningful physics/timing depth rather than low-effort flat decoration:

- Use static-browser HTML/CSS/JS with Canvas/SVG/DOM/WebAudio as appropriate; no backend.
- Render a 2D kendama stage with a handle, big cup, small cup, base cup, spike, ball, string, target arcs, star charms, catch windows, balance wobble, and wood-clack feedback.
- Gameplay must depend on 2D physical state: ball position/velocity, string tension, handle tilt, cup selection, catch window, spike alignment, star target lane, combo rhythm, trick order, focus charge, balance meter, miss grace, and player timing.
- Player actions must manipulate the system: tilt handle, swing ball, pull string, cup catch, spike catch, toss release, balance hold, swap cup, Star Focus preview, pause/restart, mute/audio, and open prompt.
- Portrait mobile is the default supported layout; no landscape gate.

## Design

- Objective: Perform kendama tricks by swinging the red ball into requested cups, spiking star charms, holding balance through wobble, and completing three festival trick cards before the lantern timer fades.
- Win condition: Complete three trick cards — First Cup Clack, Lantern Orbit, and Grand Star Spike — while reaching 5900 points to trigger “Kendama Star Cup Ceremony”. After the banner, continue into endless trick chains.
- Lose condition: Three focus hearts are lost, the ball hits the floor five times, string tension snaps once, lantern time reaches 0%, balance overload reaches 100%, or the Grand Star Spike card gets two wrong-cup catches.
- Core loop:
  1. Start on a title/menu screen with Day 045 badge, mode badge “2D”, public route `/kendama/`, best score, best Ceremony time, tutorial, prompt link, audio note, and a large Start button.
  2. Show a portrait-friendly toy-stall stage. The handle pivots near the lower center, the red ball swings above/on the side, cups and spike are visibly labeled by silhouette, and chalk arcs show predicted motion when focus or pull is active.
  3. A trick card requests goals such as: “Swing to Big Cup, hold balance 1.2s, catch one star charm, swap to Small Cup, then spike before lantern 70%.”
  4. Player tilts the handle left/right. The cups rotate with the handle, catch windows move, and the ball's string angle changes visibly.
  5. Swing Ball adds controlled momentum. Repeated swings build rhythm but too much speed raises tension and miss risk.
  6. Pull String shortens the pendulum briefly, lifting the ball toward the selected cup or spike. Pulling at the wrong phase tangles the string.
  7. Cup Catch attempts a catch in the selected cup. A correct catch lands with a wood clack, starts a balance hold, and advances the trick card.
  8. Spike Catch attempts a precise spike. It requires low sideways velocity and aligned angle; successful spike awards big points and star charm progress.
  9. Toss Release pops a caught ball upward to transition between cups or toward the spike. It is useful for trick chains but can over-toss into a floor miss.
  10. Balance Hold keeps a caught ball stable through wobble. The player must keep tilt inside a highlighted safe band for the requested duration.
  11. Swap Cup cycles Big Cup, Small Cup, Base Cup, and Spike as the active target. The active catch silhouette and helper line must update immediately.
  12. Star Focus, charged by clean catches, long balances, and star pickups, overlays predicted ball arc, cup window, spike alignment, tension risk, star lane, safe pull phase, trick progress ticks, and best next action.
  13. Completing a trick card stamps a wooden festival ticket, restores one focus heart if below max, awards points, changes pendulum constraints, and unlocks faster rhythm, moving star charms, tighter cup windows, wind puffs, trick chains, and decoy catch windows.
  14. Pause/restart remain visible throughout.
- 15+ minute play-value strategy:
  - Save best score, fastest Kendama Star Cup Ceremony time, longest clean catch chain, best no-floor run, highest endless trick card, most star charms collected, longest balance hold, fewest wrong-cup catches, highest spike streak, and collected wooden ticket badges in localStorage.
  - Include three authored trick cards:
    - First Cup Clack: broad Big Cup catch, slow pendulum, one visible star charm, guided first Tilt Handle, Swing Ball, Pull String, and Cup Catch. No heart penalty for the first tutorial miss.
    - Lantern Orbit: Big Cup to Small Cup transition, first Toss Release, first Balance Hold duration, moving star charm, required Swap Cup, and one tension warning.
    - Grand Star Spike: tighter rhythm, Base Cup setup, required Star Focus preview, two star charms, final Spike Catch, balance target below 45% overload, and no wrong-cup catch in the last chain.
  - Deterministic Day 045 seed varies starting pendulum angle, cup window width, star charm lanes, wind puff timing, string elasticity, pull strength, balance wobble, floor grace, trick card order, focus charge, spike alignment tolerance, and endless constraints while keeping opening seconds fair.
  - Mastery badges: complete First Cup Clack with zero floor drops, trigger Star Cup Ceremony under 285 seconds, finish Lantern Orbit with no tension warning, clear Grand Star Spike with balance overload below 30%, chain six cup catches, spike three star charms, and complete a card without Star Focus.
  - Strategic scoring rewards rhythm and restraint: swing before pulling, pull near the upward phase, choose the correct cup early, use Balance Hold only after a clean catch, Toss Release at low wobble, save Star Focus for spike or cup-transition chains, and accept a reset rather than panic-catch the wrong cup.
  - Endless mode after Star Cup Ceremony adds rotating trick cards, smaller catch windows, moving charms, wind puffs, shorter lantern timer, alternating cup order, higher string tension, and bonus trick chains without shrinking touch targets.
- Difficulty scaling:
  - 0-45 seconds: slow pendulum, broad Big Cup window, visible arc hints, forgiving floor grace, one star charm.
  - 45-150 seconds: cup swaps, first Toss Release, balance duration, moving charm, tension warning.
  - 150-285 seconds: required Star Focus, spike alignment, multi-cup chain, tighter side velocity tolerance.
  - 285+ seconds/endless: smaller windows, wind puffs, quicker trick cards, same readable controls.
  - Keep mobile fair: ball, string, cups, spike, arc, star charms, trick card, helper, focus/tension/balance HUD, and action buttons must be readable at 390x844; primary touch buttons should be 52px+ where possible and never below 44px; no tiny survival-critical star targets.
- Scoring/rewards:
  - Correct active cup selected before catch: +120 points times combo tier.
  - Clean Cup Catch: +260 points and Star Focus charge.
  - Balance Hold completes requested duration: +320 points.
  - Star charm collected on swing path: +190 points.
  - Toss Release transitions to another cup: +240 points.
  - Spike Catch: +520 points and combo protect.
  - Complete trick card before lantern warning: +1040 points and restore one focus heart if below max.
  - Perfect no-floor trick card: +1500 points.
  - Kendama Star Cup Ceremony: +3500 points and endless trick cards unlock.
  - Floor drop, wrong cup, string tangle, over-tension, or panic spike: combo reset and heart/lantern/balance penalty.

## Controls and layout

- Desktop:
  - Mouse click/tap on the stage: set handle tilt target, select cups/spike, press controls, start/pause overlay button, prompt link, or explainable HUD chips.
  - Mouse drag on the stage: tilt the handle and preview pendulum arc with a visible offset so the finger/cursor does not hide the ball.
  - Arrow keys or A/D: Tilt Handle left/right.
  - W/S: choose higher/lower active target or adjust pull timing.
  - Space or Enter: Cup Catch.
  - Shift or K: Spike Catch.
  - X: Swing Ball.
  - Z: Pull String.
  - T: Toss Release.
  - B: Balance Hold.
  - C: Swap Cup.
  - F: Star Focus when charged.
  - P: pause/resume.
  - R: restart current run.
- Mobile/touch:
  - Drag horizontally on the stage to tilt the handle. Drag slightly upward/downward to adjust pull timing; the handle ghost and predicted arc remain visible above the finger.
  - Tap cup/spike silhouettes to select the active target, then use large action buttons.
  - Use large Tilt Left, Tilt Right, Swing Ball, Pull String, Cup Catch, Spike Catch, Toss Release, Balance Hold, Swap Cup, Star Focus, Pause, Restart, Audio, and Prompt buttons.
  - Tapping tension/balance/focus/trick/star chips may show short explanations.
  - No tiny virtual joystick. Interaction is direct stage drag plus labeled kendama/action controls.
- Mobile layout/orientation:
  - Default target is portrait phone play around 390x844; do not require landscape.
  - Top: compact Kendama HUD with score, best, focus hearts, lantern %, balance %, string tension, combo, active target, trick step, catch window, Star Focus charge, and elapsed time. Use toy/ball/cup/spike/string/star/wood/bell chips, not dessert/syrup/card/hand/beetle/trunk/root/mushroom/shard/tatami/cake/fish/gear/bridge/thread/fan-dye/valve/flower/fruit/lattice/shrine/tea-foam/firework/koi icons.
  - Below top: trick card with requested cup/spike chain, balance duration, star charm count, tension target, progress ticks, and current festival judge note.
  - Center: large 2D kendama stage with handle, cups, ball, string, target cup halo, chalk arc, star charms, floor warning, helper art, and readable feedback. It must remain playable without zooming.
  - Bottom: status helper plus large kendama/action controls. Controls must not cover ball, cup windows, spike, string, star charms, trick card, helper, floor warning, or Star Focus overlays.
  - Tutorial must fit on the first portrait screen; optional details may be collapsible but objective, Tilt Handle, Swing Ball, Pull String, Cup Catch, Spike Catch, Toss Release, Balance Hold, Swap Cup, Star Focus, pause/restart must be visible.
  - Requests must combine text, icons, cup/spike silhouettes, timing arcs, progress ticks, target halos, and labels so hue alone is not required.

## Menu and tutorial

Implement these states:

1. Title screen
   - Shows title “Kendama Star Cup Juggler”.
   - Shows Day 045 badge, mode badge “2D”, public route `/kendama/`, best score, best Star Cup Ceremony time if available, and a prompt link.
   - Shows a large Start button and visible tutorial panel by default.
   - Notes: “Audio starts after you press Start; visual ball, string, cup, spike, balance, tension, star, and focus cues work if muted.”
2. Tutorial text
   - Objective: “Swing the ball, catch it in the requested cup, balance it, collect star charms, then spike the finale.”
   - Movement: tilt the handle and watch the string angle; timing matters more than speed.
   - Rhythm: Swing Ball builds momentum, Pull String lifts the ball, Cup Catch lands when the cup window glows.
   - Tricks: Toss Release transitions between cups, Balance Hold steadies a catch, Spike Catch needs low sideways speed.
   - Star Focus: previews ball arcs, catch windows, spike alignment, tension risk, and trick progress when charged.
   - Pause/restart: P/R on desktop or visible buttons on mobile.
3. In-game HUD
   - Score, best score, focus hearts, lantern %, balance %, string tension, trick card name, combo, active target, catch window, Star Focus charge, elapsed time, latest warning.
   - Pause/restart controls visible or immediately accessible.
4. Status helper
   - Non-blocking helper showing active cup/spike, string tension, ball phase, catch readiness, balance wobble, star lane, Star Focus readiness, and expected score effect.
   - Must not cover the kendama stage or bottom controls on mobile.
5. Pause overlay
   - Resume, restart, tutorial reminder, controls summary, audio/mute toggle, prompt link.
6. Game-over/results overlay
   - Final score, best score, trick card reached, Star Cup Ceremony status, floor drops, tension warnings, spike streak, star charms, longest balance, badges, restart button.
7. Kendama Star Cup Ceremony banner
   - Trigger once per run after all three trick cards and 5900 score.
   - Non-blocking celebration: the red ball spikes cleanly, paper star charms orbit the cup, a tiny bell rings, wood grain glows, the fox toy judge stamps a ticket, and endless trick cards continue after the banner fades.

## Assets

Prefer Imagegen2 (`openai/gpt-image-2`) for final visual art: fox toy-stall judge helper mascot, portrait matsuri toy-stall background, kendama ball/cup/star/string material sprite sheet, and kendama action/focus UI icon sheet. Canvas/SVG code may render the interactive handle geometry, ball physics, string line, catch windows, chalk arcs, target halos, particles, floor warning, and UI chrome. It should not create final character/background/texture/icon art from scratch unless Imagegen2 is unavailable after a real attempt.

Archive source generated art under `release/games/045/assets/source/` and use optimized playable copies under `release/games/045/assets/`. Also copy optimized playable assets into `apps/day-045-kendama-star-cup-juggler/assets/` and the public alias `release/kendama/assets/`.

For mobile-first crop safety: keep important content centered, leave 12-16% safe margins, avoid baked-in readable text, avoid watermarks, avoid fake UI labels, avoid tiny toy details that disappear at final in-game size, and keep fox helper/kendama/ball/string/star/cup/spike/focus silhouettes distinct against warm toy-stall backgrounds.

Generate or provide at least these final art assets:

1. Fox toy-stall judge helper mascot
   - Target: transparent PNG if possible, square source, final optimized texture around 512x512 or 256x256.
   - Archive path: `release/games/045/assets/source/kendama-helper-source.png`
   - Optimized path: `release/games/045/assets/kendama-helper.png`
   - Imagegen2 prompt: “A charming tiny fox toy-stall judge mascot for a mobile Japanese kendama dexterity arcade game, small friendly kitsune wearing a navy summer happi coat, holding a miniature wooden score paddle and brass bell, bright encouraging eyes, warm lantern rim light, centered readable silhouette, transparent or solid pale parchment background, no checkerboard background, no readable text, no watermark, sprite-friendly, high contrast at small size.”
   - Aspect ratio: square.
2. Dusk matsuri kendama toy-stall background source
   - Target: portrait-friendly background suitable behind a large overlaid 2D kendama play stage with open readable center.
   - Archive path: `release/games/045/assets/source/kendama-stall-source.png`
   - Optimized path: `release/games/045/assets/kendama-stall.png`
   - Imagegen2 prompt: “A warm dusk Japanese matsuri toy stall for a portrait mobile 2D kendama arcade game, lacquer counter, wooden toys and kendama displays pushed to the edges, lantern bokeh, fabric awning shadows, chalk practice marks on the counter, tiny brass score bell near the side, open readable central space for an overlaid ball-and-cup toy, crop-safe for phone portrait, no central character, no readable text, no watermark.”
   - Aspect ratio: portrait.
3. Kendama ball, cups, string, and star charm sprite sheet source
   - Target: square sheet with separated readable materials that can be used as sprites/decals/textures.
   - Archive path: `release/games/045/assets/source/kendama-pieces-source.png`
   - Optimized path: `release/games/045/assets/kendama-pieces.png`
   - Imagegen2 prompt: “Sprite sheet of small readable kendama festival game pieces: polished maple wood grain patch, vermilion red kendama ball, indigo string coil, big cup halo, small cup halo, base cup halo, sharp spike tip, paper star charm, brass bell, chalk arc mark, floor warning puff, wooden festival ticket, each element separated with generous margins, transparent or pale parchment background, no checkerboard background, no readable text, no watermark, readable at 40-96 pixels.”
   - Aspect ratio: square.
4. Kendama action, balance, tension, and focus UI icon sheet source
   - Target: square icon sheet for objectives, hazards, tools, rewards, and UI decals.
   - Archive path: `release/games/045/assets/source/kendama-icons-source.png`
   - Optimized path: `release/games/045/assets/kendama-icons.png`
   - Imagegen2 prompt: “Small readable icon sheet for a Japanese kendama cup-and-spike arcade game: kendama handle, red ball, string tension, tilt arrows, swing ball arc, pull string hand, cup catch, spike catch, toss release, balance wobble, swap cup, paper star charm, focus heart, Star Focus star-cup emblem, floor drop warning, Ceremony crest, transparent or solid pale parchment background, no checkerboard background, high contrast, no readable text, no watermark, generous margins so no icons are cut off.”
   - Aspect ratio: square.

If Imagegen2 is unavailable or fails after a real attempt, create a clearly labeled emergency fallback using simple SVG/canvas fox/kendama/ball/star/icon silhouettes, document the failure in `ai/postmortems/day-045.md`, and still keep source/fallback files under the same asset paths.

### Mandatory generated-image QA

For every generated image, include a real inspection step after generation and before integration:

- Analyze the actual generated file visually, not just the prompt text.
- For the fox helper mascot, verify transparent/cutout quality or clean background handling, readable friendly silhouette, centered pivot/crop margins, no unwanted text/watermarks, stable upright orientation, and that bell/paddle pose is compatible with static helper placement.
- For the pieces sheet, verify separated wood patch, red ball, string coil, cup halos, spike tip, star charm, bell, chalk arc, warning puff, and ticket at final 40-96px size, usable crop margins, no baked checkerboard, no unwanted readable text/watermark, and a documented visual baseline: red ball is round and high-contrast; string is a thin indigo line; cup halos are catch windows; spike points upward; star charms float as collectibles.
- Verify control-to-motion alignment in-game: Tilt Left/Right must rotate the handle, Swing Ball must increase visible ball arc, Pull String must shorten/lift the ball, Cup Catch must land/bounce visibly in the selected cup, Spike Catch must visibly align/spike or miss, Toss Release must pop a caught ball upward, Balance Hold must steady/measure wobble, Swap Cup must update active target, Star Focus must preview arc/window/tension, Pause/Restart must work.
- For the background, verify the central kendama stage remains readable after portrait mobile crop and does not hide ball, string, cup windows, trick card, helper, star charms, floor warning, or controls.
- For the icon sheet, verify handle, ball, string tension, tilt, swing, pull, cup catch, spike catch, toss, balance, swap, star charm, focus heart, Star Focus, floor warning, and Ceremony crest are distinct at final HUD/button size and cannot be confused. Watch specifically for fake checkerboard transparency; alpha-clean or composite onto pale parchment if needed and inspect again.
- If inspection finds a problem, regenerate or post-process the image and inspect again. Do not ship broken visual assets just because tests pass.

## Audio and game feel

Because wood clacks, string pulls, ball swings, cup catches, spike hits, balance wobble, floor drops, and festival bells are central to the theme, include lightweight WebAudio cues initialized only after a user gesture:

- Soft toy-counter tap when Start begins.
- String swish when Swing Ball builds momentum.
- Short elastic pluck when Pull String fires.
- Warm hollow wood clack when Cup Catch succeeds.
- Sharper spike knock when Spike Catch succeeds.
- Small bounce thunk for wrong cup or floor drop.
- Quiet wobble rattle during Balance Hold risk.
- Paper-star shimmer when a star charm is collected.
- Low string creak warning when tension is high.
- Bright star-cup flourish when Kendama Star Cup Ceremony triggers.

Audio must not block play if WebAudio is unavailable. Verify no autoplay errors: audio context should be created/resumed only after Start or another user interaction. Include a visible mute toggle in pause/results or HUD. Expose a narrow debug handle such as `window.__day045Audio = { ctx, enabled }` after user-gesture initialization so Playwright can assert audio state.

## Prompt page output

The archived `release/games/045/prompt.html` must be a consistent rendered HTML page, not raw Markdown pasted into a `<pre>` block. It should include:

- A clear `<title>` and `<h1>` using `Day 045 Game Generation Prompt`.
- A back-to-game link near the top.
- Semantic rendered sections (`h2`, `h3`, `ul/ol/li`, `p`, `pre/code` only for actual code/commands).
- The same readable prompt-page style pattern across days so prompt pages feel like one system.

## Subagents to dispatch

1. Implementation subagent
   - Build the static 2D game under `apps/day-045-kendama-star-cup-juggler/`.
   - Integrate it into immutable release output under `release/games/045/`.
   - Create the public playable route under `release/kendama/`.
   - Use static HTML/CSS/JS with Canvas/SVG/DOM/WebAudio and no backend.
   - The public alias must be self-contained or asset paths must be alias-safe.
2. Asset/polish subagent
   - Generate/prepare Imagegen2 assets, archive source files, optimize playable copies, inspect generated images, remove fake checkerboards if present, document ball/string/cup/spike visual baselines, and tune mobile readability/game feel.
3. QA/browser/mobile subagent
   - Run desktop and mobile smoke checks, verify no console errors, verify menu/tutorial/objective/controls/restart/pause, prompt links, kendama stage render, stage drag tilt, Tilt Left/Right, Swing Ball, Pull String, Cup Catch, Spike Catch, Toss Release, Balance Hold, Swap Cup, Star Focus control presence and visible mechanical effect, ball/string/cup/spike/balance/tension/trick feedback, generated screenshot, generated assets, WebAudio initialization after user gesture, and 390x844 portrait layout.
4. Reflection/self-improvement subagent
   - Write `ai/postmortems/day-045.md` after validation with what worked, what failed, generated-image inspection notes, ball/string/cup/spike visual baseline, audio verification, code-isolation confirmation, and whether generator/template/rubric improvements are justified.

## Acceptance criteria

- Static build passes.
- Code isolation is documented in QA/postmortem: no previous game implementation code was opened, inspected, copied, diffed, grepped, or adapted.
- Mode choice follows the cadence rule: Day 045 is `2d` after Day 044 `3d`, with meaningful pendulum/catch/tension/balance/spike mechanics rather than decorative flat toy art.
- Desktop smoke passes.
- Mobile portrait smoke passes at about 390x844 with readable HUD/tutorial/trick card/stage, usable 44px+ kendama/action/pause/restart controls, no forced landscape canvas, and no tiny survival-critical star targets.
- Prompt is visible from gallery and release folder.
- `prompts/day-045.md` is copied exactly to `release/games/045/prompt.md` and `release/kendama/prompt.md`.
- `release/games/045/prompt.html` and `release/kendama/prompt.html` render the prompt in browser-readable semantic HTML with the standard prompt-page styling, not a raw Markdown `<pre>` dump.
- Public alias `release/kendama/index.html`, `release/kendama/prompt.html`, `release/kendama/screenshot.png`, and `release/kendama/assets/` exist and work.
- Gallery card for Day 045 shows prompt availability, generation duration, public `/kendama/` links, mode `2d`, and actual generated date.
- Screenshot exists at `release/games/045/screenshot.png` and is non-empty/readable. Prefer a readable desktop gameplay screenshot for gallery cards; mobile screenshots are QA evidence unless the design is intentionally portrait-card friendly.
- Image/source assets exist under `release/games/045/assets/source/` and optimized assets exist under `release/games/045/assets/`, or a documented emergency fallback exists.
- Every generated image has an inspection note in the postmortem or QA notes; interactive ball/string/cup/spike/balance/tension visuals have verified background handling, orientation/pivot/crop, readability, and control-to-motion alignment.
- WebAudio initializes after user gesture and creates no autoplay console errors; audio is failsafe if unsupported and visual ball/string/cup/spike/balance/trick cues remain playable muted.
- No console errors during desktop or mobile smoke. Add data-URI favicons to game and prompt pages if needed to avoid favicon request noise.
- Existing `release/games/001/**` through `release/games/044/**` from origin/main remain unchanged.
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
# Screenshot/static checks: verify release/games/045/screenshot.png, prompt.md, prompt.html, index.html, game.js, styles.css, release/kendama/index.html, release/kendama/prompt.html, release/kendama/screenshot.png, optimized assets, and source assets exist and are non-empty.
# Prompt copy check: cmp prompts/day-045.md release/games/045/prompt.md and cmp prompts/day-045.md release/kendama/prompt.md.
# Prompt HTML check: verify release/games/045/prompt.html has semantic h1/h2/list markup and a back-to-game link, not a raw Markdown dump inside <pre>, and no malformed ul > p or ol > p nodes, no direct nested lists, and no strong/b tags inside code.
# Browser smoke: open the local/static /kendama/ route and verify menu, tutorial, gameplay start, kendama render, stage drag, Tilt Left/Right, Swing Ball, Pull String, Cup Catch, Spike Catch, Toss Release, Balance Hold, Swap Cup, Star Focus, ball/string/cup/spike/balance/tension feedback, pause, restart, prompt page, WebAudio after user gesture, no console errors.
# Mobile smoke: repeat at a portrait phone viewport such as 390x844 and verify playable kendama/action controls plus readable HUD/trick card/stage/controls.
# Static screenshot check: inspect release/games/045/screenshot.png and release/kendama/screenshot.png for non-empty readable game content; use vision to judge actual visual quality.
# Image QA: inspect every Imagegen2 source/optimized asset and document the actual inspection result in ai/postmortems/day-045.md.
# Docker/static smoke: build the Docker image locally, run it, curl /kendama/ and /kendama/prompt.html, then stop the container.
# Immutable guard: confirm no release/games folders from origin/main changed except new Day 045.
```
