# Day 018 Game Generation Prompt

## Game identity

- Day: 018
- Title: Asa Daruma Wishwheel Labyrinth
- Slug: asa-daruma-wishwheel-labyrinth
- Public route word: asa
- Mode: 3D
- Genre: mobile-first 3D tilt-labyrinth arcade / wish-token routing score chase
- Mood/style: crisp dawn shrine terrace above misty hills, vermilion torii rails, lacquered tatami maze ramps, round friendly daruma wishwheel, golden ema plaques, black sumi ink hazard pools, pale sunrise beams, bell-and-wood tactile feedback; real spatial board-tilt play rather than silk-web tension, pottery sculpting, bamboo water routing, origami folding, rainy sheltering, snow stacking, textile stamping, cooking, windbell tuning, rail running, or vehicle flight.

## Why this game today

The generated series currently ends with:

- Day 015 `2d`: bamboo canal water-routing with tile rotations, basins, drought, overflow, and moss patching.
- Day 016 `3d`: pottery wheel sculpting with ring selection, vessel profile matching, glaze/carve placement, wobble/crack risk, and kiln heat controls.
- Day 017 `hybrid`: moonlit silverweb tension puzzle with near/mid/far strand layers, dew-star catching, moth fray, pluck/mend, and cool blue canopy visuals.

The latest generated mode is one `hybrid`, and the latest 2D streak is zero. Day 018 deliberately chooses real `3D` to keep the series spatial and physically tactile after a hybrid. The new verb set is distinct: tilt a raised 3D shrine-maze board, roll a daruma wishwheel along ramps, open gates with matched ema plaques, brake before ink pools, ring dawn bells, and route momentum through elevation changes. It should feel like a small premium wooden tabletop toy with arcade stakes, not another grid, route preview, clay object, web layer, water flow, or rail vehicle.

Recent visual variety notes to avoid repeating:

- Day 015 used bright bamboo greens, square canal tiles, water beads, basins, and gardener notebook HUD.
- Day 016 used warm amber pottery studio lighting, a centered clay vessel, ring chips, glaze bands, and kiln heat UI.
- Day 017 used cool midnight blues, cedar canopy, circular web depth rings, silver strands, anchor labels, and bottom web-action controls.

Day 018 should shift to dawn oranges, ivory mist, red torii rails, polished wood/tatami, and a single chunky rolling daruma. Avoid moonlit web lines, pottery wheel silhouettes, bamboo canal boards, water droplets, paper fold sheets, umbrellas/rain, snow blocks, kimono cloth grids, wind ribbons, puppet rails, rail vehicles, and generic marble-maze clones without objectives.

## Code isolation / no previous game source

The implementation must be written from scratch for this day. Do not open, inspect, copy, diff, grep, or adapt code from previous games, including old `apps/day-*` folders, old `release/games/NNN/` HTML/CSS/JS files, or old public alias folders. You may inspect previous metadata, prompts, postmortems, and screenshots only to avoid repeating concepts and visual identity. The new game's HTML/CSS/JS must come from this prompt and general browser/game knowledge, not from earlier game implementations.

## Mode variety / 3D cadence

Inspection target: `src/data/games.ts` currently ends with Day 015 `2d`, Day 016 `3d`, and Day 017 `hybrid`. The latest generated-mode streak is one `hybrid`; latest 2D streak is zero.

Mode decision: Day 018 is `3D`. It must implement real spatial gameplay, not decorative perspective:

- Use Three.js/WebGL or equivalent static-browser 3D rendering.
- Render an actual raised maze/tilt board with visible perspective, height, ramps, rails, gates, ink pools, bells, and a rolling daruma wishwheel whose position/velocity depend on board tilt and collisions.
- Gameplay must depend on 3D board state: x/z position, height/elevation, slope direction, momentum, rail collisions, gate openings, bridge alignment, bell arcs, brake cooldown, and hazard surfaces.
- Player actions must manipulate the 3D system: tilt north/south/east/west, feather tilt strength, brake/center the board, choose gate priorities, and use one “Stillness Seal” to calm momentum.
- Portrait mobile is the default supported layout; no landscape gate.

## Design

- Objective: Tilt a dawn shrine wish-maze so a round daruma wishwheel collects ema plaques, opens matching torii gates, rings three dawn bells, and reaches the offering bowl before ink pools or lost momentum break the wish chain.
- Win condition: Complete three shrine-maze chapters — First Wish Roll, Torii Bridge Turn, and Sunrise Bell Offering — while reaching 3200 points to trigger “Asa Dawn Wish Fulfilled”. After the fulfillment, continue into endless shrine boards.
- Lose condition: Three wish hearts crack, the daruma falls into an ink pool too many times, the dawn timer expires during a chapter, or the wishwheel is stuck at zero momentum for too long while a gate is closed.
- Core loop:
  1. Start on a title/menu screen with Day 018 badge, mode badge “3D”, public route `/asa/`, best score, best Dawn Wish time, tutorial, prompt link, and a large Start button.
  2. Show a portrait-friendly 3D shrine-maze board: raised lacquer/tatami platform, low torii rails, sloped ramps, two or three color/shape-coded gates, ema plaque tokens, black sumi ink hazard pools, dawn bells, offering bowl, and a friendly daruma wishwheel.
  3. A chapter card requests goals, for example: “Collect 2 sun ema, ring Bell A, open red torii, finish with hearts ≥2.”
  4. Player tilts the board with large directional controls or keyboard. The daruma rolls with inertia; rail bumps redirect it; ramps and bridges make elevation matter.
  5. Ema plaques attach to the daruma as visible little tags. Matching plaques open gates or charge bell rings. Wrong-order plaques are not fatal but reduce combo.
  6. Brake/Center slows the board and recenters tilt; Stillness Seal freezes the daruma briefly and clears a nearby ink smear, but charges only through clean bell rings.
  7. Ringing a bell emits WebAudio chime after user gesture, awards points, and marks a chapter step. The offering bowl completes the chapter only when required plaques/bells are satisfied.
  8. Completing a chapter paints one daruma eye, awards points, restores one cracked wish heart if needed, and unlocks a more complex board.
  9. Pause/restart remain available throughout.
- 15+ minute play-value strategy:
  - Save best score, fastest Asa Dawn Wish Fulfilled time, longest clean-roll streak, highest endless board, most bells rung in one run, fewest ink touches, and collected wish seals in localStorage.
  - Include three authored chapters:
    - First Wish Roll: small bowl-shaped board, one red gate, two sun ema, one bell, no instant ink loss during first guided tilt.
    - Torii Bridge Turn: adds a hinged bridge/ramp lane, blue moon ema, two gates, first ink pool, and Brake/Center timing.
    - Sunrise Bell Offering: all goals active, three bell arcs, moving dawn shadow over ink pools, gold ema bonus route, stricter timer, and Stillness Seal mastery.
  - Deterministic Day 018 seed varies board peg positions, token order, gate pairings, bell placement, ink shimmer timing, bridge alignment, and endless constraints while keeping the opening fair.
  - Mastery badges: finish First Wish Roll without rail panic, trigger Dawn Wish Fulfilled under 210 seconds, collect 12 ema without wrong-order break, ring all three bells in one continuous combo, clear a board without Stillness Seal, finish an endless board with all wish hearts.
  - Strategic scoring rewards planning: carry only the plaques needed for the next gate, slow before steep ramps, tap Brake before a corner rather than after hitting rails, use rail rebounds to line up bells, save Stillness Seal for ink/shadow overlaps, and choose longer gold routes only when combo is safe.
  - Endless mode after Dawn Wish Fulfilled adds split-level boards, stricter gate order, shorter bell windows, more ink pools, one-way torii flaps, and stronger inertia without shrinking touch controls.
- Difficulty scaling:
  - 0-45 seconds: gentle slopes, large rails, slow daruma acceleration, one gate, one bell, no ink penalty during the first guided roll.
  - 45-120 seconds: bridge ramp, second gate, first ink pool, Brake timing, two ema symbols.
  - 120-210 seconds: three bell arcs, moving shadow/ink shimmer, gold bonus route, tighter gate order, stricter timer.
  - 210+ seconds/endless: stronger tilt, denser rails, multiple ramps, stricter goals, same readable controls.
  - Keep mobile fair: daruma, rails, gates, plaques, bells, and ink pools must be large and readable at 390x844; controls must be 56px+ primary buttons; no tiny hazard required for survival.
- Scoring/rewards:
  - Correct ema plaque collected: +95 points times combo tier.
  - Gate opened with matching plaques: +180 points.
  - Dawn bell rung from clean momentum: +220 points and Stillness Seal charge.
  - Brake-assisted corner without rail collision: +75 points.
  - Chapter complete with hearts ≥2: +520 points and restore one wish heart if below max.
  - Perfect no-ink chapter: +640 points.
  - Asa Dawn Wish Fulfilled: +1100 points and endless shrine boards unlock.
  - Ink touch: wish heart damage, combo reset, and a short slippery penalty.
  - Wrong gate bump: timer penalty and combo reset.
  - Falling off a ramp/edge: heart damage and respawn at last bell perch if hearts remain.

## Controls and layout

- Desktop:
  - Mouse/touch click: press direction/action buttons, start/pause overlay button, or prompt link.
  - Arrow keys or WASD: tilt the board north/west/south/east; holding increases tilt up to a safe cap.
  - Space or Enter: Brake/Center; also start from menu.
  - Shift: Stillness Seal when charged.
  - Q/E: subtle camera yaw nudge if implemented, but gameplay must not depend on camera rotation.
  - P: pause/resume.
  - R: restart current run.
- Mobile/touch:
  - Use large Tilt Up, Tilt Left, Tilt Right, Tilt Down buttons around or below the board; controls must be thumb-friendly and not cover the daruma.
  - Use large Brake/Center, Stillness Seal, Pause, and Restart buttons.
  - Optional swipe tilt can be supported, but visible buttons are mandatory.
  - Tap plaque/gate/bell chips for short explanations.
  - No virtual joystick. Interaction is directional board tilt, brake/center, Stillness Seal, pause/restart.
- Mobile layout/orientation:
  - Default target is portrait phone play around 390x844; do not require landscape.
  - Top: compact dawn shrine HUD with score, best, wish hearts, chapter, combo, time, tilt strength, and current objective. Use ema tags and sunrise chips, not the recent web/pottery/bamboo chip layouts.
  - Below top: chapter card with required plaques, gate status, bell status, offering bowl readiness, and progress ticks.
  - Center: 3D shrine-maze board with visible rails, ramps, gates, plaques, bells, ink, offering bowl, and daruma wishwheel. It must remain playable without zooming.
  - Bottom: selected/status helper plus large tilt/action controls. Controls must not cover the board or important objectives.
  - Tutorial must fit on the first portrait screen; optional details may be collapsible but objective, tilt, plaques, gates, bells, ink, Brake/Center, Stillness Seal, pause/restart must be visible.
  - Requests must combine text, symbols, shapes, labels, and color so hue alone is not required.

## Menu and tutorial

Implement these states:

1. Title screen
   - Shows title “Asa Daruma Wishwheel Labyrinth”.
   - Shows Day 018 badge, mode badge “3D”, public route `/asa/`, best score, best Dawn Wish time if available, and a prompt link.
   - Shows a large Start button and visible tutorial panel by default.
2. Tutorial text
   - Objective: “Tilt the dawn shrine board, collect matching ema plaques, ring bells, and roll the daruma into the offering bowl.”
   - Tilt: use arrows/WASD or big touch buttons; small tilts are safer than holding full tilt.
   - Ema/Gates: plaques open matching torii gates; goal chips show symbol + label.
   - Bells/Offering: ring required bells, then finish at the offering bowl.
   - Ink/Brake: avoid sumi ink; Brake/Center calms momentum before corners.
   - Stillness Seal: spend charged seal to pause motion and clear nearby ink.
   - Pause/restart: P/R on desktop or visible buttons on mobile.
3. In-game HUD
   - Score, best score, wish hearts, chapter name, combo, elapsed time, tilt strength, current objective, carried plaques, gate/bell status, Stillness Seal charge, Brake readiness.
   - Pause/restart controls visible or immediately accessible.
4. Status helper
   - Non-blocking helper showing current tilt direction/strength, daruma speed, carried plaques, next recommended gate/bell, ink risk, and expected score effect.
   - Must not cover the board or bottom controls on mobile.
5. Pause overlay
   - Resume, restart, tutorial reminder, controls summary, prompt link.
6. Game-over/results overlay
   - Final score, best score, chapter reached, Dawn Wish Fulfilled status, clean-roll streak, bells rung, ink touches, mastery badges, restart button.
7. Asa Dawn Wish Fulfilled banner
   - Trigger once per run after all three chapters and 3200 score.
   - Non-blocking dawn animation: the second daruma eye fills in, sunrise beams sweep through torii rails, bells ring, ema plaques flutter into the sky, and endless shrine boards continue after the banner fades.

## Assets

Prefer Imagegen2 (`openai/gpt-image-2`) for final visual art: daruma wishwheel mascot/texture, dawn shrine terrace background, shrine-maze/gate/icon sheet, and decorative ema/bell pieces. Three.js primitives may render the interactive board, rails, gates, ramps, daruma sphere/cylinder, plaques, collision guides, ink hazards, particles, hit volumes, and UI chrome. Procedural code may crop, resize, alpha-clean, atlas-pack, optimize, animate, or place generated assets; it should not create final character/background/icon art from scratch unless Imagegen2 is unavailable after a real attempt.

Archive source generated art under `release/games/018/assets/source/` and use optimized playable copies under `release/games/018/assets/`. Also copy optimized playable assets into `apps/day-018-asa-daruma-wishwheel-labyrinth/assets/` and the public alias `release/asa/assets/`.

For mobile-first crop safety: keep important content centered, leave 12-16% safe margins, avoid baked-in text, avoid watermarks, avoid fake UI labels, avoid tiny maze details that disappear at final in-game size, and keep daruma/ema/gate/bell/ink silhouettes distinct against dawn wood and mist backgrounds.

Generate or provide at least these final art assets:

1. Daruma wishwheel mascot/source texture
   - Target: transparent PNG if possible, square source, final optimized texture around 512x512 or 256x256.
   - Archive path: `release/games/018/assets/source/asa-daruma-source.png`
   - Optimized path: `release/games/018/assets/asa-daruma.png`
   - Imagegen2 prompt: “A charming friendly Japanese daruma wishwheel mascot for a mobile 3D browser tilt-labyrinth arcade game, round red daruma doll with one painted eye and golden wish trim, tiny ema plaque tassels, sunrise glow, centered readable silhouette, transparent or plain pale dawn background, no text, no watermark, sprite-friendly, high contrast at small size, suitable as a rolling game piece.”
   - Aspect ratio: square.
2. Dawn shrine terrace / torii maze background source
   - Target: portrait-friendly background suitable behind a 3D shrine maze board with open readable center.
   - Archive path: `release/games/018/assets/source/asa-shrine-terrace-source.png`
   - Optimized path: `release/games/018/assets/asa-shrine-terrace.png`
   - Imagegen2 prompt: “A dawn Japanese shrine terrace above misty hills for a portrait mobile 3D tilt-maze game, vermilion torii rails, polished wood and tatami textures, soft orange sunrise beams, hanging ema plaques and small bells on the sides, open readable center area for a raised maze board, crop-safe for phone portrait, no characters, no text, no watermark.”
   - Aspect ratio: portrait.
3. Ema plaque, torii gate, bell, ink, and UI icon sheet source
   - Target: square icon sheet for objectives, hazards, rewards, and UI decals.
   - Archive path: `release/games/018/assets/source/asa-icons-source.png`
   - Optimized path: `release/games/018/assets/asa-icons.png`
   - Imagegen2 prompt: “Small readable icon sheet for a Japanese dawn shrine tilt-maze game: red torii gate, blue gate, gold gate, sun ema plaque, moon ema plaque, star ema plaque, dawn bell, offering bowl, black sumi ink hazard, brake/center seal, Stillness Seal, wish heart, Asa Dawn Wish Fulfilled seal, transparent or plain pale dawn background, high contrast, no text, no watermark, generous margins so no icons are cut off.”
   - Aspect ratio: square.

If Imagegen2 is unavailable or fails after a real attempt, create a clearly labeled emergency fallback using simple SVG/canvas/Three.js materials, document the failure in `ai/postmortems/day-018.md`, and still keep source/fallback files under the same asset paths.

### Mandatory generated-image QA

For every generated image, include a real inspection step after generation and before integration:

- Analyze the actual generated file visually, not just the prompt text.
- For the daruma mascot/texture, verify transparent/cutout quality or clean background handling, readable silhouette, centered pivot/crop margins, no unwanted text/watermarks, stable upright art, and that rolling/rotation in code does not make the face orientation absurd or unreadable.
- Verify control-to-motion alignment in-game: Tilt Up/Down/Left/Right must push the daruma in the expected screen/board direction, Brake/Center must visibly slow/recenter, Stillness Seal must pause/clear as described, gates must open when matching plaques are carried, bells must ring when reached, and ink hazards must affect the intended area.
- For the background, verify the center play area remains readable after portrait mobile crop and does not hide the board, rails, daruma, plaques, gates, bells, ink, chapter card, helper, or controls.
- For the icon sheet, verify torii gates, ema symbols, dawn bell, offering bowl, ink hazard, Brake/Center, Stillness Seal, wish heart, and fulfillment seal are distinct at final HUD/button size and cannot be confused.
- If inspection finds a problem, regenerate or post-process the image and inspect again. Do not ship broken visual assets just because tests pass.

## Audio and game feel

Because bells, wood impacts, and daruma rolling are central to the theme, include lightweight WebAudio cues initialized only after a user gesture:

- A soft wooden roll/click or short thunk when the daruma bumps a rail.
- A small chime when collecting an ema plaque.
- A brighter bell tone when ringing a dawn bell, with pitch varying by bell.
- A low ink splash/muffle when touching sumi ink.
- A short sunrise arpeggio when Asa Dawn Wish Fulfilled triggers.

Audio must not block play if WebAudio is unavailable. Verify no autoplay errors: audio context should be created/resumed only after Start or another user interaction.

## Prompt page output

The archived `release/games/018/prompt.html` must be a consistent rendered HTML page, not raw Markdown pasted into a `<pre>` block. It should include:

- A clear `<title>` and `<h1>` using `Day 018 Game Generation Prompt`.
- A back-to-game link near the top.
- Semantic rendered sections (`h2`, `h3`, `ul/ol/li`, `p`, `pre/code` only for actual code/commands).
- The same readable prompt-page style pattern across days so prompt pages feel like one system.

## Subagents to dispatch

1. Implementation subagent
   - Build the static 3D game under `apps/day-018-asa-daruma-wishwheel-labyrinth/`.
   - Integrate it into immutable release output under `release/games/018/`.
   - Create the public playable route under `release/asa/`.
   - Use static HTML/CSS/JS with Three.js/WebGL and no backend.
   - The public alias must be self-contained or asset paths must be alias-safe.
   - If vendoring `three.module*.js`, also copy the matching `three.core*.js` beside it in the app, release archive, and `/asa/` alias assets.
2. Asset/polish subagent
   - Generate/prepare Imagegen2 assets, archive source files, optimize playable copies, inspect generated images, and tune mobile readability/game feel.
3. QA/browser/mobile subagent
   - Run desktop and mobile smoke checks, verify no console errors, verify menu/tutorial/objective/controls/restart/pause, prompt links, 3D board rendering, tilt controls, Brake/Center, Stillness Seal, plaque collection, gate opening, bell feedback, ink hazards, offering bowl completion, generated screenshot, generated assets, audio initialization, and 390x844 portrait layout.
4. Reflection/self-improvement subagent
   - Write `ai/postmortems/day-018.md` after validation with what worked, what failed, generated-image inspection notes, audio verification, code-isolation confirmation, and whether generator/template/rubric improvements are justified.

## Acceptance criteria

- Static build passes.
- Code isolation is documented in QA/postmortem: no previous game implementation code was opened, inspected, copied, diffed, grepped, or adapted.
- Mode choice follows the cadence rule: Day 018 is real `3d` with spatial tilt-board gameplay, momentum, ramps, collisions, gates, bells, ink hazards, and offering bowl routing.
- Desktop smoke passes.
- Mobile portrait smoke passes at about 390x844 with readable HUD/tutorial/chapter card, usable tilt/brake/seal/pause/restart controls, no forced landscape canvas, and 44px+ controls.
- Prompt is visible from gallery and release folder.
- `prompts/day-018.md` is copied exactly to `release/games/018/prompt.md` and `release/asa/prompt.md`.
- `release/games/018/prompt.html` and `release/asa/prompt.html` render the prompt in browser-readable semantic HTML with the standard prompt-page styling, not a raw Markdown `<pre>` dump.
- Public alias `release/asa/index.html`, `release/asa/prompt.html`, `release/asa/screenshot.png`, and `release/asa/assets/` exist and work.
- Gallery card for Day 018 shows prompt availability, generation duration, public `/asa/` links, mode `3d`, and actual generated date.
- Screenshot exists at `release/games/018/screenshot.png` and is non-empty/readable. Prefer a readable desktop gameplay screenshot for gallery cards; mobile screenshots are QA evidence unless the design is intentionally portrait-card friendly.
- Image/source assets exist under `release/games/018/assets/source/` and optimized assets exist under `release/games/018/assets/`, or a documented emergency fallback exists.
- Every generated image has an inspection note in the postmortem or QA notes; interactive daruma/maze visuals have verified background handling, orientation/pivot/crop, readability, and control-to-motion alignment.
- WebAudio initializes after user gesture and creates no autoplay console errors; audio is optional/failsafe if unsupported.
- No console errors during desktop or mobile smoke. Add data-URI favicon links to game and prompt pages if needed to avoid favicon request noise.
- Existing `release/games/001/**` through `release/games/017/**` from origin/main remain unchanged.
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
# Screenshot/static checks: verify release/games/018/screenshot.png, prompt.md, prompt.html, index.html, game.js, styles.css, release/asa/index.html, release/asa/prompt.html, release/asa/screenshot.png, optimized assets, and source assets exist and are non-empty.
# Prompt copy check: cmp prompts/day-018.md release/games/018/prompt.md and cmp prompts/day-018.md release/asa/prompt.md.
# Prompt HTML check: verify release/games/018/prompt.html has semantic h1/h2/list markup and a back-to-game link, not a raw Markdown dump inside <pre>, and no malformed ul > p or ol > p nodes.
# Browser smoke: open the local/static /asa/ route and verify menu, tutorial, gameplay start, 3D render, Tilt Up/Left/Right/Down, Brake/Center, Stillness Seal control presence, plaque collection, gate opening, bell feedback, ink hazard feedback, pause, restart, prompt page, WebAudio after user gesture, no console errors.
# Mobile smoke: repeat at a portrait phone viewport such as 390x844 and verify playable tap controls and readable HUD/chapter card/3D board.
# Static screenshot check: inspect release/games/018/screenshot.png and release/asa/screenshot.png for non-empty readable game content; use vision to judge actual visual quality.
# Image QA: inspect every Imagegen2 source/optimized asset and document the actual inspection result in ai/postmortems/day-018.md.
# Docker/static smoke: build the Docker image locally, run it, curl /asa/ and /asa/prompt.html, then stop the container.
# Immutable guard: confirm no release/games folders from origin/main changed except new Day 018.
```
