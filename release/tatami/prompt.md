# Day 039 Game Generation Prompt

## Game identity

- Day: 039
- Title: Tatami Moonroom Matwright
- Slug: tatami-moonroom-matwright
- Public route word: tatami
- Mode: 2D
- Genre: mobile-first tatami-layout logic puzzle / room-flow planning / harmony score chase
- Mood/style: quiet moonlit washitsu room, woven igusa tatami texture, dark green cloth borders, shoji moonbeams, low lacquer table, incense timer, sleepy calico cat helper, tactile mat-sliding and seam-click feedback; a calm but strategic spatial puzzle rather than okonomiyaki cooking, goldfish scooping, karakuri gears, bridge trusses, temari thread orbits, uchiwa dyeing, onsen valves, ikebana balancing, orchard harvesting, kumiko woodworking, shrine stealth, matcha whisking, fireworks, pachinko, mochi hopping, calligraphy tracing, kite mapping, dry-garden raking, underwater pearl navigation, taiko rhythm routing, daruma labyrinths, spider webs, pottery wheels, canal grids, origami folds, rain parasols, snow stacking, kimono stamping, bento conveyors, windbell tuning, rail running, or koi collection.

## Why this game today

The generated series currently ends with:

- Day 036 `3d`: Takumi Karakuri Gearwright, dark indigo/amber layered brass gears, axles, couplers, torque, jam, bells.
- Day 037 `2d`: Kingyo Poi Festival Scooper, blue-hour festival water tank, fish sprites, poi net, paper wetness, ripples, bowl orders.
- Day 038 `3d`: Yatai Okonomiyaki Flipmaster, warm night-market griddle, 3D heat lanes, cakes, sauce, toppings, smoke, shiba helper.

The latest generated-mode streak is one `3d` (Day 038), so Day 039 may safely be a rich `2d` game without extending a 2D streak. It deliberately moves away from food/water/mechanical routing into a rules-based interior arrangement puzzle: lay tatami mats in a moonlit room, rotate half/full mats, avoid four-corner seam violations, preserve guest walking flow, place cushion/tea-table zones, and complete room commissions before incense burns down.

Recent screenshot/visual variety notes to avoid repeating:

- Day 038 used amber/black cooking surfaces, three heat lanes, round 3D cakes, sauce/topping buttons, smoke, and a shiba chef helper.
- Day 037 used deep blue water, fish sprites, circular scoop rings, lantern reflections, paper wetness chips, and a bottom dexterity control row.
- Day 036 used translucent 3D plates, brass gears, circular tooth outlines, torque arrows, dark mechanical cards, and compact engineering controls.

Day 039 should use a top-down but richly textured washitsu floor board: rectangular tatami mats, half-mats, visible woven grain direction, cloth borders, seam intersections, shoji moonlight strips, alcove/tokonoma edge, cushion/low-table silhouettes, incense countdown, guest-footstep path previews, and a sleepy calico cat helper. Avoid griddles/cakes/sauce/smoke/cooking tickets, water tanks/fish/nets/bowls/ripples, gears/axles/couplers/bells, bridges/rivers/bamboo trusses/stress heatmaps, centered spheres/thread arcs, radial fans/pigment sectors, valves/steam ducts, floral vases, orchard baskets, lattice strips, stealth cones, tea-bowl foam, firework arcs, pachinko coins, mochi platforms, brush-stroke tracing, kite strings, sand rakes, underwater routes, taiko pads, tilt labyrinths, web strands, pottery profiles, canal tiles, origami crease grids, parasols, snow blocks, kimono panels, restaurant conveyors, windbell notes, rail tracks, or koi ponds.

## Code isolation / no previous game source

The implementation must be written from scratch for this day. Do not open, inspect, copy, diff, grep, or adapt code from previous games, including old `apps/day-*` folders, old `release/games/NNN/` HTML/CSS/JS files, or old public alias folders. You may inspect previous metadata, prompts, postmortems, and screenshots only to avoid repeating concepts and visual identity. The new game's HTML/CSS/JS must come from this prompt and general browser/canvas/WebAudio game knowledge, not from earlier game implementations.

## Mode variety / 3D cadence

Inspection target: `src/data/games.ts` currently ends with Day 036 `3d`, Day 037 `2d`, and Day 038 `3d`. The latest generated-mode streak is one `3d`.

Mode decision: Day 039 is rich mobile-first `2d`, selected after a real 3D day. It must be mechanically deep enough to justify the mode:

- Use static-browser HTML/CSS/JS with Canvas/SVG/DOM/WebAudio as appropriate; no backend.
- Render a top-down tatami planning board where mat position, mat orientation, mat size, seam intersections, grain direction, walking path, furniture anchors, harmony meters, incense time, and cat disruption matter mechanically.
- Gameplay must depend on 2D spatial state: grid cells, full/half mat footprints, rotation, seam endpoints, four-corner conflicts, forbidden alcove cells, moonbeam bonus zones, cushion/table anchor requirements, guest path continuity, cat nap zones, undo/budget, and room harmony.
- Player actions must manipulate the system: select a mat, rotate it, slide/drag it to board cells, swap full/half mat, lock a mat, place/reposition cushion and low table markers, preview guest walk, calm the cat, use Ma Focus to preview rule violations and optimal negative space, pause/restart, and inspect tutorial hints.
- Portrait mobile is the default supported layout; no landscape gate.

## Design

- Objective: Arrange tatami mats for requested washitsu room commissions, satisfying mat-count, grain-flow, seam, furniture, moonbeam, and guest-path constraints before the incense timer burns down.
- Win condition: Complete three room commissions — First Moon Mat, Tea Guest Flow, and Grand Tokonoma Room — while reaching 5300 points to trigger “Tatami Moonroom Harmony”. After the banner, continue into endless room-layout commissions.
- Lose condition: Three harmony hearts break, incense burns out, four-corner seam violations reach four in one room, guest path is blocked three times, or the cat scatters unlocked mats after repeated uncalmed disruptions.
- Core loop:
  1. Start on a title/menu screen with Day 039 badge, mode badge “2D”, public route `/tatami/`, best score, best Harmony time, tutorial, prompt link, audio note, and a large Start button.
  2. Show a portrait-friendly moonlit washitsu. The center is a rectangular planning board with cells, alcove edge, moonbeam bonus strips, existing door/threshold markers, and large draggable mats.
  3. A room commission requests goals such as: “Lay 4 full mats + 1 half mat, no four-corner seams, align two mats with moonbeam grain, leave a path from shoji door to cushion, table centered on calm seam.”
  4. Player selects the active mat by tapping/clicking it or using Mat −/+ controls. The selected mat gets a glowing rim, woven-grain arrow, and footprint preview.
  5. Drag/Slide Mat moves the selected mat between board cells. Invalid overlaps glow vermilion, valid footprints glow gold/green, and snap points are large enough for thumbs.
  6. Rotate Mat flips woven-grain direction between east-west and north-south. Grain matters for commission bonuses, moonbeam comfort, and seam harmony.
  7. Swap Full/Half toggles between a full rectangular mat and a half mat when the room commission allows it; half mats solve edge gaps but can create forbidden seam clusters.
  8. Lock Mat protects a placed mat from cat disruption and accidental drag, but locked mats cost an undo token to unlock.
  9. Place Cushion and Place Table controls move/rest the tea cushion and low table anchors. They must sit on stable mats and preserve guest walking flow.
  10. Preview Walk draws a guest-footstep route from the shoji door through the room to the cushion/table. Blocked, awkward, or seam-heavy paths reduce harmony.
  11. Calm Cat moves the sleepy calico helper out of the selected footprint and prevents one disruption; ignoring cat warnings lets it paw an unlocked mat off-grid.
  12. Ma Focus, charged by clean placements and no-violation room completions, overlays four-corner seam risks, grain-flow arrows, guest-path score, moonbeam comfort zones, negative-space balance, and the next best mat candidate.
  13. Completing a room stamps a tatami room seal, restores one harmony heart if needed, awards points, changes room shape and constraints, and unlocks irregular alcoves, two doors, more half mats, stricter guest paths, and mischievous cat naps.
  14. Pause/restart remain visible throughout.
- 15+ minute play-value strategy:
  - Save best score, fastest Tatami Moonroom Harmony time, longest no-violation chain, highest endless room, fewest undo tokens used, best guest-flow score, most moonbeam-grain bonuses, calmest cat streak, and collected room seal badges in localStorage.
  - Include three authored room commissions:
    - First Moon Mat: simple 3x3 room, three full mats and one half mat, generous incense, highlighted first Rotate Mat, no heart penalty for first tutorial overlap.
    - Tea Guest Flow: larger room with door and cushion/table anchors, two grain-direction requirements, first cat nap zone, one moonbeam bonus strip, and a guest route score.
    - Grand Tokonoma Room: irregular alcove, full and half mat mixture, no four-corner seam tolerance, required Ma Focus preview, two path targets, table centered, incense under pressure.
  - Deterministic Day 039 seed varies room shape, door location, alcove cells, moonbeam strips, mat inventory, grain bonuses, cat nap timing, incense decay, table/cushion anchor requirements, seam penalty, focus charge, and endless constraints while keeping opening seconds fair.
  - Mastery badges: complete First Moon Mat with zero violations, trigger Harmony under 285 seconds, finish Tea Guest Flow with 90%+ walk score, complete Grand Tokonoma with no four-corner seams, earn three moonbeam-grain bonuses, calm the cat three times without losing a mat.
  - Strategic scoring rewards spatial planning: place full mats first to avoid corner clusters, reserve half mats for alcove edges, rotate grains to create calm flow, lock only stable mats, keep a clear guest path, calm the cat before it reaches unlocked mats, and save Ma Focus for irregular rooms.
  - Endless mode after Harmony adds odd room footprints, double doors, stricter negative-space goals, faster incense, cat feints, and bonus scroll commissions without shrinking touch controls.
- Difficulty scaling:
  - 0-45 seconds: small room, broad snap zones, obvious four-corner warning, forgiving incense, one half mat.
  - 45-150 seconds: cushion/table anchors, guest path preview, cat nap warning, moonbeam grain bonuses.
  - 150-285 seconds: irregular alcove, stricter seams, required Ma Focus, fewer undo tokens, tighter incense.
  - 285+ seconds/endless: odd shapes, multiple doors, stricter harmony targets, same readable controls.
  - Keep mobile fair: board cells, mats, grain arrows, seam warnings, room card, harmony hearts, incense meter, helper, and action buttons must be readable at 390x844; touch buttons should be 52px+ where possible and never below 44px; no tiny survival-critical cells.
- Scoring/rewards:
  - Valid mat placed: +130 points times combo tier.
  - Correct grain direction in requested zone: +170 points and Ma Focus charge.
  - No four-corner seam after placement: +145 points.
  - Guest path preview reaches cushion/table cleanly: +260 points and incense relief.
  - Cushion/table anchor satisfied: +210 points.
  - Calm Cat before disruption: +150 points and preserve combo.
  - Complete room before incense warning: +980 points and restore one harmony heart if below max.
  - Perfect no-violation room: +1300 points.
  - Moonbeam-grain bonus chain: +520 bonus.
  - Tatami Moonroom Harmony: +2900 points and endless rooms unlock.
  - Invalid overlap/forbidden alcove: no placement, status warning.
  - Four-corner seam violation: harmony penalty and combo reset.
  - Guest path blocked or cat scatters mat: harmony-heart damage, incense penalty, combo reset.

## Controls and layout

- Desktop:
  - Mouse click/tap: select mats, board cells, action buttons, start/pause overlay button, prompt link, or explainable HUD chips.
  - Mouse drag on the board: move selected mat with snap preview and a thumb/mouse offset.
  - Arrow keys or WASD: nudge selected mat one cell.
  - Q/E or Space: Rotate Mat.
  - H: Swap Full/Half when available.
  - L: Lock Mat / Unlock with undo token.
  - C: Place Cushion.
  - T: Place Table.
  - W: Preview Walk.
  - G: Calm Cat.
  - Shift or M: Ma Focus when charged.
  - P: pause/resume.
  - R: restart current run.
- Mobile/touch:
  - Tap a mat to select it. Drag inside the board to slide the selected mat with a visible offset so the footprint remains visible above the finger.
  - Use large Mat −, Mat +, Slide ↑/↓/←/→, Rotate Mat, Swap Full/Half, Lock Mat, Place Cushion, Place Table, Preview Walk, Calm Cat, Ma Focus, Pause, Restart, and Prompt buttons.
  - Tapping seam/incense/grain/path/cat chips may show short explanations.
  - No tiny virtual joystick. Interaction is direct mat select/drag plus labeled layout/action controls.
- Mobile layout/orientation:
  - Default target is portrait phone play around 390x844; do not require landscape.
  - Top: compact Tatami HUD with score, best, harmony hearts, incense %, combo, active mat, inventory, violations, Ma Focus charge, and elapsed time. Use mat/grain/seam/path/incense/cat/chashitsu chips, not griddle/fish/gear/bridge/thread/fan/valve/flower/fruit/lattice/shrine/tea-foam/firework/cat-coin/rabbit/brush/kite/sand/pearl/drum icons.
  - Below top: room commission card with requested mat inventory, grain goals, cushion/table anchors, path target, seam limit, moonbeam bonus, and progress ticks.
  - Center: large tatami board stage with mats, seam intersections, grain arrows, shoji/moonbeam overlays, cushion/table markers, cat helper, path preview, violation highlights, and readable feedback. It must remain playable without zooming.
  - Bottom: status helper plus large layout/action controls. Controls must not cover the board, room card, seam warnings, cat, or path preview.
  - Tutorial must fit on the first portrait screen; optional details may be collapsible but objective, select/drag mat, Rotate Mat, Swap Full/Half, Lock Mat, Place Cushion/Table, Preview Walk, Calm Cat, Ma Focus, pause/restart must be visible.
  - Requests must combine text, icons, grain arrows, seam markers, patterns, and progress ticks so hue alone is not required.

## Menu and tutorial

Implement these states:

1. Title screen
   - Shows title “Tatami Moonroom Matwright”.
   - Shows Day 039 badge, mode badge “2D”, public route `/tatami/`, best score, best Harmony time if available, and a prompt link.
   - Shows a large Start button and visible tutorial panel by default.
   - Notes: “Audio starts after you press Start; visual seam, grain, path, cat, and incense cues work if muted.”
2. Tutorial text
   - Objective: “Arrange tatami mats, avoid bad seam clusters, keep the guest path open, and finish before incense burns out.”
   - Placement: drag mats onto the room grid; green/gold footprints are valid, vermilion means overlap or forbidden alcove.
   - Rotation: Rotate Mat changes woven grain direction; match moonbeams and commission goals.
   - Harmony: avoid four mat corners meeting at one point; use half mats and negative space to solve irregular rooms.
   - Furniture/path: place cushion and low table, then Preview Walk from shoji door to guest seat.
   - Cat: Calm Cat before it paws an unlocked mat away.
   - Ma Focus: previews seam risks, grain flow, path score, and calm negative space when charged.
   - Pause/restart: P/R on desktop or visible buttons on mobile.
3. In-game HUD
   - Score, best score, harmony hearts, incense %, commission name, combo, active mat, inventory, violation count, Ma Focus charge, elapsed time, latest warning.
   - Pause/restart controls visible or immediately accessible.
4. Status helper
   - Non-blocking helper showing selected mat, next placement hint, seam risk, grain advice, path warning, cat warning, Ma Focus readiness, and expected score effect.
   - Must not cover the tatami board or bottom controls on mobile.
5. Pause overlay
   - Resume, restart, tutorial reminder, controls summary, audio/mute toggle, prompt link.
6. Game-over/results overlay
   - Final score, best score, room reached, Harmony status, seam violations, path score, cat disruptions, moonbeam bonuses, badges, restart button.
7. Tatami Moonroom Harmony banner
   - Trigger once per run after all three room commissions and 5300 score.
   - Non-blocking celebration: moonbeams sweep across woven mats, seam warnings dissolve into gold, the cat curls on the perfect cushion, incense smoke forms a room seal, and endless commissions continue after the banner fades.

## Assets

Prefer Imagegen2 (`openai/gpt-image-2`) for final visual art: sleepy calico tatami helper mascot, portrait moonlit washitsu room background, tatami mat/furniture texture sprite sheet, and mat/grain/seam/path/incense/cat UI icon sheet. Canvas/SVG/DOM code may render the interactive grid, mat rectangles, seam markers, grain arrows, path lines, highlights, particles, and UI chrome. It should not create final character/background/texture/icon art from scratch unless Imagegen2 is unavailable after a real attempt.

Archive source generated art under `release/games/039/assets/source/` and use optimized playable copies under `release/games/039/assets/`. Also copy optimized playable assets into `apps/day-039-tatami-moonroom-matwright/assets/` and the public alias `release/tatami/assets/`.

For mobile-first crop safety: keep important content centered, leave 12-16% safe margins, avoid baked-in text, avoid watermarks, avoid fake UI labels, avoid tiny woven details that disappear at final in-game size, and keep helper/mats/grain/seams/cushion/table/incense/path/focus silhouettes distinct against moonlit green-gold room backgrounds.

Generate or provide at least these final art assets:

1. Sleepy calico tatami helper mascot
   - Target: transparent PNG if possible, square source, final optimized texture around 512x512 or 256x256.
   - Archive path: `release/games/039/assets/source/tatami-helper-source.png`
   - Optimized path: `release/games/039/assets/tatami-helper.png`
   - Imagegen2 prompt: “A charming sleepy calico cat helper mascot for a mobile Japanese tatami room layout puzzle game, small cute cat wearing a tiny indigo furoshiki collar charm, gently pawing a rolled tatami edge, kind calm expression, moonlit shoji rim light, centered readable silhouette, transparent or solid warm parchment background, no checkerboard background, no text, no watermark, sprite-friendly, high contrast at small size.”
   - Aspect ratio: square.
2. Moonlit washitsu tatami room background source
   - Target: portrait-friendly background suitable behind a top-down tatami planning board with open readable center.
   - Archive path: `release/games/039/assets/source/tatami-room-source.png`
   - Optimized path: `release/games/039/assets/tatami-room.png`
   - Imagegen2 prompt: “A quiet moonlit Japanese washitsu tatami room for a portrait mobile 2D puzzle game, shoji screens with soft moonbeams, tokonoma alcove edge, low lacquer table and cushions at room edges, woven green-gold tatami floor atmosphere, incense holder, calm nighttime palette, open readable central floor area for interactive tatami mat layout, crop-safe for phone portrait, no characters in the center, no readable text, no watermark.”
   - Aspect ratio: portrait.
3. Tatami mat and furniture texture sprite sheet source
   - Target: square sheet with separated readable materials that can be cropped or sampled into runtime sprites.
   - Archive path: `release/games/039/assets/source/tatami-pieces-source.png`
   - Optimized path: `release/games/039/assets/tatami-pieces.png`
   - Imagegen2 prompt: “Sprite sheet of small readable Japanese washitsu puzzle pieces: full tatami mat top with green cloth border, half tatami mat, woven igusa grain samples in two directions, square cushion zabuton, low chabudai table top, shoji door marker, incense smoke puff, moonbeam strip, each element separated with generous margins, transparent or warm parchment background, no checkerboard background, no text, no watermark, readable at 40-96 pixels.”
   - Aspect ratio: square.
4. Tatami layout, grain, seam, path, incense, and focus UI icon sheet source
   - Target: square icon sheet for objectives, hazards, tools, rewards, and UI decals.
   - Archive path: `release/games/039/assets/source/tatami-icons-source.png`
   - Optimized path: `release/games/039/assets/tatami-icons.png`
   - Imagegen2 prompt: “Small readable icon sheet for a Japanese tatami room layout puzzle game: full mat, half mat, rotate grain arrow, four-corner seam warning, shoji door, cushion seat, low table, guest footstep path, incense timer, sleepy cat paw, lock mat, undo token, Ma Focus moon-room emblem, harmony heart, room seal, Grand Harmony crest, transparent or solid warm parchment background, no checkerboard background, high contrast, no text, no watermark, generous margins so no icons are cut off.”
   - Aspect ratio: square.

If Imagegen2 is unavailable or fails after a real attempt, create a clearly labeled emergency fallback using simple SVG/canvas cat/tatami/cushion/table/incense/icon silhouettes, document the failure in `ai/postmortems/day-039.md`, and still keep source/fallback files under the same asset paths.

### Mandatory generated-image QA

For every generated image, include a real inspection step after generation and before integration:

- Analyze the actual generated file visually, not just the prompt text.
- For the cat helper mascot, verify transparent/cutout quality or clean background handling, readable friendly silhouette, centered pivot/crop margins, no unwanted text/watermarks, stable upright/curled orientation, and that the pawing pose is compatible with static helper placement.
- For tatami pieces, verify separated full/half mats, readable woven grain direction, distinct cushion/table/shoji/incense/moonbeam elements at final 40-96px size, usable crop margins, no baked checkerboard, no unwanted text/watermark, and a documented visual baseline for east-west vs north-south grain.
- Verify control-to-motion alignment in-game: selecting a mat must visibly highlight the intended mat, drag/Slide must move it between grid cells, Rotate Mat must visibly change grain direction/footprint orientation, Swap Full/Half must change piece size, Lock Mat must visibly mark and protect it, Place Cushion/Table must move anchors, Preview Walk must draw a route, Calm Cat must move/quiet the helper warning, Ma Focus must preview seam/grain/path risks, Pause/Restart must work.
- For the background, verify the central board remains readable after portrait mobile crop and does not hide mats, seam intersections, grain arrows, commission card, helper, path, or controls.
- For the icon sheet, verify full mat, half mat, rotate arrow, seam warning, shoji door, cushion, low table, footstep path, incense timer, cat paw, lock, undo, Ma Focus, harmony heart, room seal, and Grand Harmony crest are distinct at final HUD/button size and cannot be confused. Watch specifically for fake checkerboard transparency; alpha-clean or composite onto warm parchment if needed and inspect again.
- If inspection finds a problem, regenerate or post-process the image and inspect again. Do not ship broken visual assets just because tests pass.

## Audio and game feel

Because woven mats, shoji-room calm, incense countdown, cat pawing, and snap-into-place seams are central to the theme, include lightweight WebAudio cues initialized only after a user gesture:

- Soft tatami rustle when selecting or sliding a mat.
- Crisp woven snap when a mat lands on a valid cell.
- Gentle hollow thump when Rotate Mat changes grain direction.
- Quiet warning click when a four-corner seam risk appears.
- Paper-shoji swish when Preview Walk draws a successful route.
- Tiny bell/incense chime when a room commission completes.
- Soft cat mew/paw tap when Calm Cat succeeds or a cat warning begins.
- Moon shimmer when Ma Focus activates.
- Calm koto-like flourish when Tatami Moonroom Harmony triggers.

Audio must not block play if WebAudio is unavailable. Verify no autoplay errors: audio context should be created/resumed only after Start or another user interaction. Include a visible mute toggle in pause/results or HUD. Expose a narrow debug handle such as `window.__day039Audio = { ctx, enabled }` after user-gesture initialization so Playwright can assert audio state.

## Prompt page output

The archived `release/games/039/prompt.html` must be a consistent rendered HTML page, not raw Markdown pasted into a `<pre>` block. It should include:

- A clear `<title>` and `<h1>` using `Day 039 Game Generation Prompt`.
- A back-to-game link near the top.
- Semantic rendered sections (`h2`, `h3`, `ul/ol/li`, `p`, `pre/code` only for actual code/commands).
- The same readable prompt-page style pattern across days so prompt pages feel like one system.

## Subagents to dispatch

1. Implementation subagent
   - Build the static 2D game under `apps/day-039-tatami-moonroom-matwright/`.
   - Integrate it into immutable release output under `release/games/039/`.
   - Create the public playable route under `release/tatami/`.
   - Use static HTML/CSS/JS with Canvas/SVG/WebAudio and no backend.
   - The public alias must be self-contained or asset paths must be alias-safe.
2. Asset/polish subagent
   - Generate/prepare Imagegen2 assets, archive source files, optimize playable copies, inspect generated images, remove fake checkerboards if present, document mat-grain visual baseline, and tune mobile readability/game feel.
3. QA/browser/mobile subagent
   - Run desktop and mobile smoke checks, verify no console errors, verify menu/tutorial/objective/controls/restart/pause, prompt links, tatami board render, mat selection/drag, Mat −/+, Slide, Rotate Mat, Swap Full/Half, Lock Mat, Place Cushion, Place Table, Preview Walk, Calm Cat, Ma Focus control presence and visible mechanical effect, seam/grain/path/incense/cat feedback, generated screenshot, generated assets, WebAudio initialization after user gesture, and 390x844 portrait layout.
4. Reflection/self-improvement subagent
   - Write `ai/postmortems/day-039.md` after validation with what worked, what failed, generated-image inspection notes, mat-grain visual baseline, audio verification, code-isolation confirmation, and whether generator/template/rubric improvements are justified.

## Acceptance criteria

- Static build passes.
- Code isolation is documented in QA/postmortem: no previous game implementation code was opened, inspected, copied, diffed, grepped, or adapted.
- Mode choice follows the cadence rule: Day 039 is `2d` after Day 038 `3d`, with tactile mat-layout logic mechanics rather than low-effort flat decoration.
- Desktop smoke passes.
- Mobile portrait smoke passes at about 390x844 with readable HUD/tutorial/room card, usable 44px+ drag/touch/action/pause/restart controls, no forced landscape canvas, and no tiny survival-critical cells.
- Prompt is visible from gallery and release folder.
- `prompts/day-039.md` is copied exactly to `release/games/039/prompt.md` and `release/tatami/prompt.md`.
- `release/games/039/prompt.html` and `release/tatami/prompt.html` render the prompt in browser-readable semantic HTML with the standard prompt-page styling, not a raw Markdown `<pre>` dump.
- Public alias `release/tatami/index.html`, `release/tatami/prompt.html`, `release/tatami/screenshot.png`, and `release/tatami/assets/` exist and work.
- Gallery card for Day 039 shows prompt availability, generation duration, public `/tatami/` links, mode `2d`, and actual generated date.
- Screenshot exists at `release/games/039/screenshot.png` and is non-empty/readable. Prefer a readable desktop gameplay screenshot for gallery cards; mobile screenshots are QA evidence unless the design is intentionally portrait-card friendly.
- Image/source assets exist under `release/games/039/assets/source/` and optimized assets exist under `release/games/039/assets/`, or a documented emergency fallback exists.
- Every generated image has an inspection note in the postmortem or QA notes; interactive mat/grain/seam/path visuals have verified background handling, orientation/pivot/crop, readability, and control-to-motion alignment.
- WebAudio initializes after user gesture and creates no autoplay console errors; audio is failsafe if unsupported and visual seam/grain/path/cat/order cues remain playable muted.
- No console errors during desktop or mobile smoke. Add data-URI favicons to game and prompt pages if needed to avoid favicon request noise.
- Existing `release/games/001/**` through `release/games/038/**` from origin/main remain unchanged.
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
# Screenshot/static checks: verify release/games/039/screenshot.png, prompt.md, prompt.html, index.html, game.js, styles.css, release/tatami/index.html, release/tatami/prompt.html, release/tatami/screenshot.png, optimized assets, and source assets exist and are non-empty.
# Prompt copy check: cmp prompts/day-039.md release/games/039/prompt.md and cmp prompts/day-039.md release/tatami/prompt.md.
# Prompt HTML check: verify release/games/039/prompt.html has semantic h1/h2/list markup and a back-to-game link, not a raw Markdown dump inside <pre>, and no malformed ul > p or ol > p nodes, no direct nested lists, and no strong/b tags inside code.
# Browser smoke: open the local/static /tatami/ route and verify menu, tutorial, gameplay start, tatami board render, mat selection/drag, Mat −/+, Slide controls, Rotate Mat, Swap Full/Half, Lock Mat, Place Cushion, Place Table, Preview Walk, Calm Cat, Ma Focus, seam/grain/path/incense/cat feedback, pause, restart, prompt page, WebAudio after user gesture, no console errors.
# Mobile smoke: repeat at a portrait phone viewport such as 390x844 and verify playable drag/action controls plus readable HUD/room card/stage/controls.
# Static screenshot check: inspect release/games/039/screenshot.png and release/tatami/screenshot.png for non-empty readable game content; use vision to judge actual visual quality.
# Image QA: inspect every Imagegen2 source/optimized asset and document the actual inspection result in ai/postmortems/day-039.md.
# Docker/static smoke: build the Docker image locally, run it, curl /tatami/ and /tatami/prompt.html, then stop the container.
# Immutable guard: confirm no release/games folders from origin/main changed except new Day 039.
```
