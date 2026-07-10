# Day 028 Game Generation Prompt

## Game identity

- Day: 028
- Title: Akane Foxfire Shrine Sentinel
- Slug: akane-foxfire-shrine-sentinel
- Public route word: akane
- Mode: 3D
- Genre: mobile-first 3D stealth-routing / lantern-defense / foxfire escort score chase
- Mood/style: crimson akane dusk at a mountain Inari shrine, vermilion torii gates, mossy stone steps, paper lanterns, small blue foxfire wisps, brass suzu bells, masked shadow-yokai patrol cones, warm candle pools against deep violet cedar forest; real 3D courtyard depth, vertical steps, patrol sightlines, and light-radius management rather than matcha whisking, fireworks sky painting, koban pachinko, moon-mochi hopping, sumi tracing, kite cartography, dry-garden raking, underwater diving, taiko rhythm lanes, daruma rolling, web weaving, pottery shaping, bamboo canals, origami folding, parasol procession, snow stacking, kimono stamping, bento cooking, windbell tuning, rail running, or koi collection.

## Why this game today

The generated series currently ends with:

- Day 025 `2d`: red-and-gold maneki-neko koban pachinko with coin drops, paw bumpers, charm gates, bells, trays, and cat helper art.
- Day 026 `3d`: indigo summer fireworks sky painting with launch tubes, shell arcs, altitude/depth rings, smoke, and tanuki helper art.
- Day 027 `2d`: bright spring matcha atelier with circular whisking, foam crest management, clumps, temperature/bitterness, and tea helper art.

The latest generated-mode streak is one `2d` (Day 027). Day 028 deliberately selects real `3D` to keep the cadence strong and avoid two intimate tabletop craft games in a row. The new verb set is stealthy foxfire sentinel work: rotate a shrine courtyard camera, guide fragile blue flame wisps through torii lanes and up/down stone steps, light paper lanterns in order, hide inside warm light pools, distract shadow-yokai patrols with suzu bells, and spend Moon Veil focus to preview patrol cones and safe paths.

Recent screenshot/visual variety notes to avoid repeating:

- Day 027 used pale tea-room wood, matcha greens, large circular bowl, foam pearls, clump hazards, and soft cream/green UI cards.
- Day 026 used dark open sky, lantern towers on the sides, firework rings/bursts, smoky teal/gold/magenta controls, and a tanuki pyrotechnician.
- Day 025 used a dense vermilion lucky-cat cabinet, peg board, coin trays, paw bumpers, red/gold/brown UI, and maneki-neko helper.

Day 028 should shift to a spatial shrine patrol scene: dusk vermilion torii corridors, cedar shadows, raised stone stair platforms, glowing foxfire wisps, lantern pools, shadow-yokai cones, bell distraction ripples, paper ema charms, and a small kitsune sentinel helper. Avoid tabletop tea bowls/foam/whisks, open firework skies/shell arcs, pachinko cabinets/coins/cat trays, mochi pads/rabbits, brush-stroke washi scrolls, kite-thread star maps, zen sand rakes, underwater oxygen/pearls, rhythm drum pads, tilt boards, silver webs, pottery profiles, bamboo irrigation channels, origami crease routes, rain parasols, snow blocks, kimono cloth panels, generic tower defense grids, or endless runner lanes.

## Code isolation / no previous game source

The implementation must be written from scratch for this day. Do not open, inspect, copy, diff, grep, or adapt code from previous games, including old `apps/day-*` folders, old `release/games/NNN/` HTML/CSS/JS files, or old public alias folders. You may inspect previous metadata, prompts, postmortems, and screenshots only to avoid repeating concepts and visual identity. The new game's HTML/CSS/JS must come from this prompt and general browser/Three.js/WebGL/WebAudio game knowledge, not from earlier game implementations.

## Mode variety / 3D cadence

Inspection target: `src/data/games.ts` currently ends with Day 025 `2d`, Day 026 `3d`, and Day 027 `2d`. The latest generated-mode streak is one `2d`.

Mode decision: Day 028 is real `3D`. It must implement meaningful spatial gameplay, not decorative perspective:

- Use Three.js/WebGL or equivalent static-browser 3D rendering.
- Render an actual depth-visible shrine courtyard with raised stone paths, torii gate lanes, lantern posts, sight cones, hiding light pools, stairs, patrol routes, target lanterns, bell stations, foxfire wisps, and a camera that shows depth clearly.
- Gameplay must depend on 3D state: x/z path position, step height, lantern light radius, foxfire visibility, patrol cone direction/range, shadow alert level, bell ripple distance, gate order, camera yaw/tilt, wisp grouping, and safe-pool timing.
- Player actions must manipulate the 3D system: move the sentinel, call/hold/release wisps, rotate shrine camera, light lanterns, ring suzu bells, plant ema charms, activate Moon Veil focus to preview safe paths/cones, pause/restart, and inspect tutorial hints.
- Portrait mobile is the default supported layout; no landscape gate.

## Design

- Objective: Escort foxfire wisps through the 3D Inari shrine, light requested lanterns in order, avoid shadow-yokai sight cones, and preserve shrine harmony until the Akane Grand Vigil ignites.
- Win condition: Complete three shrine vigils — First Torii Spark, Cedar Stair Procession, and Akane Grand Vigil — while reaching 4200 points to trigger “Akane Grand Vigil”. After the banner, continue into endless dusk patrol commissions.
- Lose condition: Three spirit seals crack, the vigil timer expires, shadow alert reaches 100%, too many wisps are snuffed by patrol cones, or lantern order mistakes collapse the route twice in one commission.
- Core loop:
  1. Start on a title/menu screen with Day 028 badge, mode badge “3D”, public route `/akane/`, best score, best Grand Vigil time, tutorial, prompt link, and a large Start button.
  2. Show a portrait-friendly 3D shrine courtyard. A kitsune sentinel stands near a stone path. Blue foxfire wisps hover behind. Paper lantern targets glow faintly beyond torii gates and raised stairs. Shadow-yokai patrol cones sweep between cedar trunks.
  3. A vigil card requests goals, for example: “Light 3 lanterns in order, keep 4 wisps alive, ring 1 bell distraction, finish with alert under 35%.”
  4. Player moves the sentinel with large step buttons or drag-to-path. Wisps follow with inertia and can be called close, held still in a light pool, or released to drift toward the active lantern.
  5. Paper lanterns create warm safe pools. Wisps inside safe pools brighten and score; wisps outside safe pools become visible to shadows.
  6. Shadow-yokai patrol cones sweep in actual 3D. If a cone catches a wisp outside safe light, alert rises and the wisp flickers/snuffs unless rescued quickly.
  7. Suzu Bell creates a visible ripple that turns nearby patrol cones away for a short window. Bad timing can pull patrols toward the route after the ripple fades.
  8. Ema Charm marks a temporary safe waypoint that gently attracts wisps and blocks one alert tick, but it has limited charges.
  9. Moon Veil focus, charged by clean lantern lights and close group escort, slows patrol sweeps and overlays predicted safe arcs and cone paths for a short window.
  10. Completing a vigil lights a larger torii lantern, restores one spirit seal if needed, awards points, and unlocks more vertical steps, split wisp groups, and crossing patrols.
  11. Pause/restart remain available throughout.
- 15+ minute play-value strategy:
  - Save best score, fastest Akane Grand Vigil time, longest no-alert escort chain, highest endless vigil, most wisps preserved, lowest alert finish, best lantern-order accuracy, fewest bell uses, and collected Inari seal badges in localStorage.
  - Include three authored vigils:
    - First Torii Spark: one flat shrine path, slow patrol cone, three lanterns, one bell, guided first wisp call, generous safe pools, no seal penalty during first guided mistake.
    - Cedar Stair Procession: adds raised stone steps, two patrols at different depths, wisp hold/release tutorial, one ema charm, and order-sensitive lanterns.
    - Akane Grand Vigil: adds crossing cones, split high/low lantern route, moving safe pools, stricter alert window, required Moon Veil preview, and four-wisp preservation mastery.
  - Deterministic Day 028 seed varies patrol timing, lantern order, bell station placement, safe-pool size, step heights, wisp drift, ema recharge timing, and endless constraints while keeping the opening fair.
  - Mastery badges: finish First Torii Spark with zero alert, trigger Grand Vigil under 250 seconds, preserve all wisps through Cedar Stair Procession, light 28 lanterns in correct order, complete a vigil without ringing a bell, complete an endless vigil with all spirit seals.
  - Strategic scoring rewards planning: keep wisps grouped before crossing cones, ring bells only as patrol cones turn inward, use ema charms at stair corners, light nearby lanterns to create new safe pools, save Moon Veil for crossing patrol patterns, and choose safe low-score detours instead of rushing exposed wisps.
  - Endless mode after Grand Vigil adds faster cones, smaller light pools, alternating high/low lantern routes, more wisp drift, and mixed bell/ema constraints without shrinking touch controls.
- Difficulty scaling:
  - 0-45 seconds: one patrol, broad light pools, slow wisp drift, visible path guide, generous lantern order.
  - 45-140 seconds: raised stairs, second patrol, bell distraction risk, hold/release wisp timing, first ema charm.
  - 140-250 seconds: crossing patrol cones, high/low route split, smaller safe pools, required Moon Veil timing, stricter alert.
  - 250+ seconds/endless: denser patrols, quicker alert ticks, stronger wisp drift, same readable controls.
  - Keep mobile fair: sentinel, wisps, lanterns, cones, light pools, bell ripples, ema charms, route arrows, commission card, and action buttons must be large/readable at 390x844; primary touch buttons must be 52px+; no tiny survival-critical wisps or lanterns.
- Scoring/rewards:
  - Wisp kept inside safe pool during patrol sweep: +70 points times combo tier.
  - Lantern lit in correct order: +170 points and Moon Veil charge.
  - Full wisp group reaches a lantern: +240 bonus.
  - Bell turns a cone away without raising alert: +160 points.
  - Ema charm rescue blocks an alert tick: +130 points.
  - Commission complete below alert target: +760 points and restore one spirit seal if below max.
  - Perfect all-wisp vigil: +920 points.
  - Akane Grand Vigil: +1800 points and endless commissions unlock.
  - Wisp seen by cone: combo soft-reset, alert +8%, wisp flicker.
  - Wisp snuffed: spirit seal damage if threshold crossed, alert +15%, combo reset.
  - Wrong lantern order: route collapse warning, alert +10%, next correct lantern gets a reduced safe pool.

## Controls and layout

- Desktop:
  - Mouse click/tap: press movement/action buttons, select lantern/bell/ema chips, start/pause overlay button, prompt link, or explainable HUD chips.
  - Mouse drag on the 3D stage: optional path preview for sentinel movement; click-to-step must remain clear and non-ambiguous.
  - Arrow keys or WASD: move sentinel north/west/south/east on the shrine path.
  - Q/E: rotate camera left/right.
  - Space or Enter: Call/Release Wisps / confirm start depending on state.
  - 1: Light Lantern when in range.
  - 2: Ring Suzu Bell when charged/near station.
  - 3: Place Ema Charm.
  - Shift or M: Moon Veil focus when charged.
  - P: pause/resume.
  - R: restart current run.
- Mobile/touch:
  - Use large Step Up, Step Left, Step Right, Step Down buttons plus optional tap-to-path on the shrine stage.
  - Use large Call/Hold Wisps, Release Wisps, Light Lantern, Suzu Bell, Ema Charm, Moon Veil, Camera, Pause, Restart, and Prompt buttons.
  - Tapping lantern/cone/wisp/bell chips may show short explanations.
  - No tiny virtual joystick. Interaction is stepping/path preview, wisp group management, lantern lighting, bell distraction, ema rescue, focus, camera, pause/restart.
- Mobile layout/orientation:
  - Default target is portrait phone play around 390x844; do not require landscape.
  - Top: compact shrine HUD with score, best, spirit seals, alert %, combo, wisp count, active lantern order, Moon Veil charge, camera angle, and elapsed time. Use shrine/foxfire/lantern/cone/bell chips, not tea/foam/firework/coin/mochi/brush icons.
  - Below top: vigil card with requested lantern sequence, wisp preservation target, alert limit, bell/ema requirements, and progress ticks.
  - Center: tall 3D shrine stage with sentinel, foxfire wisps, torii lanes, lantern pools, patrol cones, steps, bells, ema waypoints, helper art, and route preview. It must remain playable without zooming.
  - Bottom: status helper plus large movement/action controls. Controls must not cover exposed wisps, active lanterns, cone warnings, or route arrows.
  - Tutorial must fit on the first portrait screen; optional details may be collapsible but objective, step/path movement, call/hold/release wisps, lantern order, shadow cones, bell distraction, ema charm, Moon Veil, pause/restart must be visible.
  - Requests must combine text, symbols, numbers, lantern shapes, cone line styles, and progress ticks so hue alone is not required.

## Menu and tutorial

Implement these states:

1. Title screen
   - Shows title “Akane Foxfire Shrine Sentinel”.
   - Shows Day 028 badge, mode badge “3D”, public route `/akane/`, best score, best Grand Vigil time if available, and a prompt link.
   - Shows a large Start button and visible tutorial panel by default.
   - Notes: “Audio starts after you press Start; visual cone and light-pool cues work if muted.”
2. Tutorial text
   - Objective: “Escort blue foxfire wisps, light shrine lanterns in order, and avoid shadow-yokai sight cones.”
   - Movement: step with buttons/keys or tap a path; rotate camera to read depth.
   - Wisps: Call/Hold keeps wisps close or still inside safe light; Release sends them toward the active lantern.
   - Lanterns: light them in the requested order to create safe pools and score.
   - Shadows: cones snuff exposed wisps; hide in lantern light or distract patrols with Suzu Bell.
   - Ema/Moon Veil: place a temporary safe waypoint, then use Moon Veil to slow/preview patrol cones.
   - Pause/restart: P/R on desktop or visible buttons on mobile.
3. In-game HUD
   - Score, best score, spirit seals, alert %, commission/vigil name, combo, wisp count, lantern order, active lantern distance, bell charge, ema charges, Moon Veil charge, camera angle, elapsed time, latest warning.
   - Pause/restart controls visible or immediately accessible.
4. Status helper
   - Non-blocking helper showing next lantern, wisp safety, cone timing, bell readiness, ema advice, Moon Veil readiness, and expected score effect.
   - Must not cover the 3D shrine stage or bottom controls on mobile.
5. Pause overlay
   - Resume, restart, tutorial reminder, controls summary, audio/mute toggle, prompt link.
6. Game-over/results overlay
   - Final score, best score, vigil reached, Grand Vigil status, wisps preserved, lantern accuracy, alert finish, bell/ema uses, mastery badges, restart button.
7. Akane Grand Vigil banner
   - Trigger once per run after all three vigils and 4200 score.
   - Non-blocking celebration: torii lanterns ignite in sequence, foxfire wisps spiral into a blue chrysanthemum flame, cedar shadows recede, the kitsune helper bows, and endless dusk commissions continue after the banner fades.

## Assets

Prefer Imagegen2 (`openai/gpt-image-2`) for final visual art: kitsune sentinel helper mascot, portrait akane-dusk shrine background, foxfire/lantern/cone/bell/ema icon sheet, and decorative Inari seal pieces. Three.js primitives may render interactive 3D paths, torii gates, lantern pools, sight cones, wisps, patrol markers, bells, ema waypoints, camera, fog, particles, and UI chrome. Procedural code may crop, resize, alpha-clean, atlas-pack, optimize, animate, or place generated assets; it should not create final character/background/icon art from scratch unless Imagegen2 is unavailable after a real attempt.

Archive source generated art under `release/games/028/assets/source/` and use optimized playable copies under `release/games/028/assets/`. Also copy optimized playable assets into `apps/day-028-akane-foxfire-shrine-sentinel/assets/` and the public alias `release/akane/assets/`.

For mobile-first crop safety: keep important content centered, leave 12-16% safe margins, avoid baked-in text, avoid watermarks, avoid fake UI labels, avoid tiny wisp/cone/lantern details that disappear at final in-game size, and keep kitsune/wisp/lantern/cone/bell/ema silhouettes distinct against crimson-violet shrine backgrounds.

Generate or provide at least these final art assets:

1. Kitsune shrine sentinel helper mascot
   - Target: transparent PNG if possible, square source, final optimized texture around 512x512 or 256x256.
   - Archive path: `release/games/028/assets/source/akane-helper-source.png`
   - Optimized path: `release/games/028/assets/akane-helper.png`
   - Imagegen2 prompt: “A charming friendly kitsune shrine sentinel helper mascot for a mobile 3D foxfire escort browser arcade game, small fox spirit with cream and russet fur, tiny vermilion shrine scarf, holding a brass suzu bell and a glowing blue foxfire wisp, watchful but kind expression, akane dusk rim light, centered readable silhouette, transparent or solid deep violet shrine background, no checkerboard background, no text, no watermark, sprite-friendly, high contrast at small size.”
   - Aspect ratio: square.
2. Akane dusk Inari shrine courtyard background source
   - Target: portrait-friendly background suitable behind a 3D shrine stage with open readable center.
   - Archive path: `release/games/028/assets/source/akane-shrine-source.png`
   - Optimized path: `release/games/028/assets/akane-shrine.png`
   - Imagegen2 prompt: “A cinematic Japanese Inari mountain shrine courtyard at akane crimson dusk for a portrait mobile 3D stealth-routing game, vermilion torii gates, mossy stone steps, paper lanterns, cedar forest shadows, small brass bells, ema charm boards at the edges, glowing warm lantern pools, open readable central path area for foxfire wisps and patrol cones, crop-safe for phone portrait, no readable text, no watermark, no characters in the center.”
   - Aspect ratio: portrait.
3. Foxfire, lantern, shadow cone, suzu bell, ema charm, and shrine UI icon sheet source
   - Target: square icon sheet for objectives, hazards, tools, rewards, and UI decals.
   - Archive path: `release/games/028/assets/source/akane-icons-source.png`
   - Optimized path: `release/games/028/assets/akane-icons.png`
   - Imagegen2 prompt: “Small readable icon sheet for a Japanese akane dusk foxfire shrine sentinel arcade game: blue foxfire wisp, warm paper lantern, vermilion torii gate, shadow-yokai sight cone, brass suzu bell, wooden ema charm, spirit seal heart, Moon Veil focus emblem, alert mask icon, safe light pool, route arrow, kitsune paw mark, Akane Grand Vigil Inari seal, transparent or solid deep violet background, no checkerboard background, high contrast, no text, no watermark, generous margins so no icons are cut off.”
   - Aspect ratio: square.

If Imagegen2 is unavailable or fails after a real attempt, create a clearly labeled emergency fallback using simple SVG/Three.js kitsune/wisp/lantern silhouettes, document the failure in `ai/postmortems/day-028.md`, and still keep source/fallback files under the same asset paths.

### Mandatory generated-image QA

For every generated image, include a real inspection step after generation and before integration:

- Analyze the actual generated file visually, not just the prompt text.
- For the kitsune mascot, verify transparent/cutout quality or clean background handling, readable friendly silhouette, centered pivot/crop margins, no unwanted text/watermarks, stable upright helper orientation, and that bell/wisp pose does not imply incompatible movement or rotation.
- Verify control-to-motion alignment in-game: Step Up/Left/Right/Down must move the sentinel in expected directions relative to camera cues, Camera must visibly rotate stage/depth, Call/Hold Wisps must gather/stabilize wisps, Release Wisps must send them toward the active lantern, Light Lantern must expand a visible safe pool, Suzu Bell must redirect intended patrol cones, Ema Charm must create a visible waypoint/rescue, and Moon Veil must slow/preview cone paths.
- For the background, verify the central stage remains readable after portrait mobile crop and does not hide wisps, lanterns, cones, status helper, commission card, helper, or controls.
- For the icon sheet, verify foxfire, lantern, torii, cone, bell, ema, spirit seal, Moon Veil, alert mask, safe pool, route arrow, kitsune paw, and Grand Vigil seal are distinct at final HUD/button size and cannot be confused. Watch specifically for fake checkerboard transparency; alpha-clean or composite onto deep violet if needed and inspect again.
- If inspection finds a problem, regenerate or post-process the image and inspect again. Do not ship broken visual assets just because tests pass.

## Audio and game feel

Because foxfire escorting, lantern lighting, patrol cones, bells, and shrine atmosphere are central to the theme, include lightweight WebAudio cues initialized only after a user gesture:

- Soft footstep/stone tap when the sentinel steps.
- Tiny blue flame flutter while wisps are called close.
- Warm paper-lantern bloom chime when a lantern lights.
- Low shadow hiss when a cone nearly catches a wisp.
- Brass suzu bell ring with a visible ripple when distracting patrols.
- Wooden ema clack when placing a charm.
- Sparkly slowed-night shimmer when Moon Veil activates.
- Rising koto/flute/bell arpeggio when Akane Grand Vigil triggers.

Audio must not block play if WebAudio is unavailable. Verify no autoplay errors: audio context should be created/resumed only after Start or another user interaction. Include a visible mute toggle in pause/results or HUD.

## Prompt page output

The archived `release/games/028/prompt.html` must be a consistent rendered HTML page, not raw Markdown pasted into a `<pre>` block. It should include:

- A clear `<title>` and `<h1>` using `Day 028 Game Generation Prompt`.
- A back-to-game link near the top.
- Semantic rendered sections (`h2`, `h3`, `ul/ol/li`, `p`, `pre/code` only for actual code/commands).
- The same readable prompt-page style pattern across days so prompt pages feel like one system.

## Subagents to dispatch

1. Implementation subagent
   - Build the static 3D game under `apps/day-028-akane-foxfire-shrine-sentinel/`.
   - Integrate it into immutable release output under `release/games/028/`.
   - Create the public playable route under `release/akane/`.
   - Use static HTML/CSS/JS with Three.js/WebGL/WebAudio and no backend.
   - The public alias must be self-contained or asset paths must be alias-safe.
   - If vendoring `three.module*.js`, also copy the matching `three.core*.js` beside it in the app, release archive, and `/akane/` alias assets.
2. Asset/polish subagent
   - Generate/prepare Imagegen2 assets, archive source files, optimize playable copies, inspect generated images, remove fake checkerboards if present, and tune mobile readability/game feel.
3. QA/browser/mobile subagent
   - Run desktop and mobile smoke checks, verify no console errors, verify menu/tutorial/objective/controls/restart/pause, prompt links, 3D shrine render, Step controls, Camera, Call/Hold Wisps, Release Wisps, Light Lantern, Suzu Bell, Ema Charm, Moon Veil control presence, wisp/cone/lantern feedback, generated screenshot, generated assets, WebAudio initialization after user gesture, and 390x844 portrait layout.
4. Reflection/self-improvement subagent
   - Write `ai/postmortems/day-028.md` after validation with what worked, what failed, generated-image inspection notes, audio verification, code-isolation confirmation, and whether generator/template/rubric improvements are justified.

## Acceptance criteria

- Static build passes.
- Code isolation is documented in QA/postmortem: no previous game implementation code was opened, inspected, copied, diffed, grepped, or adapted.
- Mode choice follows the cadence rule: Day 028 is real `3d` after Day 027 `2d`, with spatial shrine paths, depth-visible patrol cones, lantern light pools, step heights, and wisp escort mechanics that matter mechanically.
- Desktop smoke passes.
- Mobile portrait smoke passes at about 390x844 with readable HUD/tutorial/vigil card, usable 52px+ movement/action/pause/restart controls, no forced landscape canvas, and no tiny survival-critical wisps/lanterns/cones.
- Prompt is visible from gallery and release folder.
- `prompts/day-028.md` is copied exactly to `release/games/028/prompt.md` and `release/akane/prompt.md`.
- `release/games/028/prompt.html` and `release/akane/prompt.html` render the prompt in browser-readable semantic HTML with the standard prompt-page styling, not a raw Markdown `<pre>` dump.
- Public alias `release/akane/index.html`, `release/akane/prompt.html`, `release/akane/screenshot.png`, and `release/akane/assets/` exist and work.
- Gallery card for Day 028 shows prompt availability, generation duration, public `/akane/` links, mode `3d`, and actual generated date.
- Screenshot exists at `release/games/028/screenshot.png` and is non-empty/readable. Prefer a readable desktop gameplay screenshot for gallery cards; mobile screenshots are QA evidence unless the design is intentionally portrait-card friendly.
- Image/source assets exist under `release/games/028/assets/source/` and optimized assets exist under `release/games/028/assets/`, or a documented emergency fallback exists.
- Every generated image has an inspection note in the postmortem or QA notes; interactive sentinel/wisp/lantern/cone visuals have verified background handling, orientation/pivot/crop, readability, and control-to-motion alignment.
- WebAudio initializes after user gesture and creates no autoplay console errors; audio is failsafe if unsupported and visual wisp/cone/light cues remain playable muted.
- No console errors during desktop or mobile smoke. Add data-URI favicons to game and prompt pages if needed to avoid favicon request noise.
- Existing `release/games/001/**` through `release/games/027/**` from origin/main remain unchanged.
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
# Screenshot/static checks: verify release/games/028/screenshot.png, prompt.md, prompt.html, index.html, game.js, styles.css, release/akane/index.html, release/akane/prompt.html, release/akane/screenshot.png, optimized assets, and source assets exist and are non-empty.
# Prompt copy check: cmp prompts/day-028.md release/games/028/prompt.md and cmp prompts/day-028.md release/akane/prompt.md.
# Prompt HTML check: verify release/games/028/prompt.html has semantic h1/h2/list markup and a back-to-game link, not a raw Markdown dump inside <pre>, and no malformed ul > p or ol > p nodes.
# Browser smoke: open the local/static /akane/ route and verify menu, tutorial, gameplay start, 3D shrine render, Step controls, Camera, Call/Hold Wisps, Release Wisps, Light Lantern, Suzu Bell, Ema Charm, Moon Veil, wisp/cone/lantern feedback, pause, restart, prompt page, WebAudio after user gesture, no console errors.
# Mobile smoke: repeat at a portrait phone viewport such as 390x844 and verify playable movement/action controls plus readable HUD/vigil card/stage/controls.
# Static screenshot check: inspect release/games/028/screenshot.png and release/akane/screenshot.png for non-empty readable game content; use vision to judge actual visual quality.
# Image QA: inspect every Imagegen2 source/optimized asset and document the actual inspection result in ai/postmortems/day-028.md.
# Docker/static smoke: build the Docker image locally, run it, curl /akane/ and /akane/prompt.html, then stop the container.
# Immutable guard: confirm no release/games folders from origin/main changed except new Day 028.
```
