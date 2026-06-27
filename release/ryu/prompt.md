# Day 016 Game Generation Prompt

## Game identity

- Day: 016
- Title: Ryu Ember Kiln Potter
- Slug: ryu-ember-kiln-potter
- Public route word: ryu
- Mode: 3D
- Genre: mobile-first 3D pottery wheel sculpting / kiln heat-management arcade score chase
- Mood/style: warm Japanese mountain pottery studio at late afternoon, glowing dragon kiln embers, wet clay shine, ash-glaze blues, cedar shelves, raku bowls, carved dragon scale stamps, smoke ribbons, tactile craft tension; sculptural 3D shaping rather than bamboo water routing, origami folds, rain sheltering, snow stacking, kimono stamping, or vehicle flight.

## Why this game today

The generated series currently ends with:

- Day 013 `hybrid`: rainy shrine-market parasol procession with lane-aware sheltering, puddles, and gutters.
- Day 014 `hybrid`: origami fold-layer route planning with mountain/valley folds, crane route preview, seals, and paper stress.
- Day 015 `2d`: bamboo canal water-routing with tile rotations, basin requests, drought, overflow, and moss patching.

The latest generated-mode streak is one `2d`, so the cadence allows any mode, but Day 016 deliberately chooses real `3D` to keep the series spatial and ambitious immediately after the readable 2D canal puzzle. The new verb set is different from recent days: rotate a clay vessel on a 3D wheel, push/pull profile rings, carve grooves and dragon-scale stamps, apply glaze bands, manage kiln heat and cracks, and match vessel silhouettes for ceramic commissions.

Recent visual variety notes to avoid repeating:

- Day 013 used teal rainy market paths, umbrellas, shelter rings, stone reflections, and bottom lane/tilt controls.
- Day 014 used a dark origami studio, pale paper sheet, dashed crease lines, crane route, and fold action buttons.
- Day 015 used bright bamboo grove greens, square canal tiles, water beads, basins, drought/overflow HUD, and tap-rotate controls.

Day 016 should shift to warm amber clay and real 3D form-making: a centered spinning vessel, visible profile rings, thumb/paddle sculpt controls, kiln bellows, glaze brush bands, dragon-scale carving stamps, crack warnings, and smoke/ember particles. Avoid gridded boards, route previews, water canals, paper fold lines, umbrellas, snow block stacks, textile stamp panels, wind ribbons, and generic spaceship/runner movement.

## Code isolation / no previous game source

The implementation must be written from scratch for this day. Do not open, inspect, copy, diff, grep, or adapt code from previous games, including old `apps/day-*` folders, old `release/games/NNN/` HTML/CSS/JS files, or old public alias folders. You may inspect previous metadata, prompts, postmortems, and screenshots only to avoid repeating concepts and visual identity. The new game's HTML/CSS/JS must come from this prompt and general browser/game knowledge, not from earlier game implementations.

## Mode variety / 3D cadence

Inspection target: `src/data/games.ts` currently ends with Day 013 `hybrid`, Day 014 `hybrid`, and Day 015 `2d`. The latest generated-mode streak is one `2d`; latest 2D streak is one.

Mode decision: Day 016 is `3D`. It must implement real spatial gameplay, not decorative perspective:

- Use Three.js/WebGL or equivalent static-browser 3D rendering.
- Render an actual 3D pottery wheel work area with a rotating vessel, depth-visible profile rings, camera/light depth cues, and sculpting deformations that change the vessel silhouette.
- Gameplay must depend on 3D vessel shape: ring radius, vertical profile, symmetry/wobble, wall thickness, carved groove depth, glaze band position, heat zones, and crack risk.
- Player actions must manipulate the 3D object: select a height ring, widen/narrow it, smooth wobble, carve a groove/stamp mark, brush glaze bands, control kiln bellows, and fire the piece.
- Portrait mobile is the default supported layout; no landscape gate.

## Design

- Objective: Shape wet clay on a spinning wheel into requested tea bowls, incense cups, and dragon-kiln vases, then glaze and fire them without cracking so the mountain kiln can complete the Ryu Ember Offering.
- Win condition: Complete three ceramic commissions — Tea Bowl Foot, Incense Cup Lip, and Dragon Kiln Vase — while reaching 3000 points to trigger “Ryu Ember Offering”. After the offering, continue into endless kiln commissions.
- Lose condition: Crack risk reaches 100%, three apprentice patience tiles break, the vessel collapses from too much wobble/thin wall, or the kiln overheats during firing.
- Core loop:
  1. Start on a title/menu screen with Day 016 badge, mode badge “3D”, public route `/ryu/`, best score, best Ember Offering time, tutorial, prompt link, and a large Start button.
  2. Show a portrait-friendly 3D pottery wheel with a centered spinning clay vessel, profile target ghost, selectable height rings, kiln ember meter, glaze tray, and assistant mascot.
  3. A commission card requests vessel traits, for example: “Wide foot, narrow waist, flared lip, 2 ash-blue glaze bands, carve 3 dragon scales, fire at steady heat <72%.”
  4. Player selects a height ring by tapping the vessel, ring chips, or up/down controls. The selected ring gets a bright contour halo.
  5. Widen / Narrow changes ring radius. Smooth reduces wobble but costs time. Carve adds a groove or dragon-scale stamp to selected ring. Glaze applies a colored band to selected ring.
  6. Shape feedback updates live: silhouette ghost shows target vs actual, wall-thickness warning marks risky thin zones, wobble meter rises if adjacent rings differ too much, and score/combo rewards clean sculpting.
  7. When the shape is close enough, player taps Fire Kiln. During firing, use Bellows and Vent controls to keep heat inside the requested ember band while cracks threaten thin/wobbly rings.
  8. Completing a commission stamps the vessel with a vermilion kiln seal, awards points, restores one patience tile if needed, and unlocks the next vessel.
  9. Pause/restart remain available throughout.
- 15+ minute play-value strategy:
  - Save best score, fastest Ryu Ember Offering time, smoothest vessel percentage, highest endless commission, most perfect firings, and collected kiln badges in localStorage.
  - Include three authored commissions:
    - Tea Bowl Foot: three profile rings, broad foot, gentle bowl curve, one glaze band, no instant collapse during first tutorial sculpt.
    - Incense Cup Lip: five rings, narrow waist, flared lip, first dragon-scale carve requirement, wobble tradeoff, first firing heat band.
    - Dragon Kiln Vase: seven rings, tall profile, alternating glaze bands, strict wall-thickness, carve/groove placement, active bellows/vent heat control.
  - Deterministic Day 016 seed varies target profiles, clay stiffness, glaze colors, carve requirements, heat wind timing, crack-prone rings, and endless constraints while keeping the opening fair.
  - Mastery badges: finish Tea Bowl Foot with 90%+ silhouette match, trigger Ember Offering under 195 seconds, fire three pieces without cracks, carve 12 dragon scales, complete a commission with zero smoothing, survive an endless commission with all patience tiles.
  - Strategic scoring rewards planning: widen broad forms before thinning lips, smooth only after large profile changes, keep adjacent rings gradual, place glaze bands before final firing, save Vent for heat spikes, and stop sculpting when close enough instead of overworking clay.
  - Endless mode after Ember Offering adds taller vessels, stricter silhouette targets, shorter firing heat windows, multiple glaze/carve constraints, and wobble-sensitive clay without shrinking touch controls.
- Difficulty scaling:
  - 0-45 seconds: three rings, forgiving radius targets, slow wheel, one glaze band, generous heat range.
  - 45-115 seconds: five rings, wobble and wall-thickness warnings, first carve marks, first bellows/vent firing phase.
  - 115-195 seconds: seven rings, tall profile, tighter silhouette tolerance, alternating glaze bands, faster heat spikes, crack-prone zones.
  - 195+ seconds/endless: variable ring counts, stricter target matching, unstable clay, hotter kiln, same readable controls.
  - Keep mobile fair: selected ring halos must be thick, target silhouette visible, commission text short, 56px+ primary controls, no tiny moving hazard required for survival.
- Scoring/rewards:
  - Ring adjusted toward target: +35 points times combo tier.
  - Smooth adjacent profile with wobble under target: +80 points.
  - Correct glaze band or carve mark: +110 points.
  - Firing heat held in band for a full tick: +45 points and +3% kiln seal charge.
  - Commission complete above 82% match: +420 points and restore one patience tile if below max.
  - Perfect firing with no cracks: +520 points.
  - Ryu Ember Offering: +980 points and endless kiln commissions unlock.
  - Over-thin wall or sharp radius jump: wobble/crack risk rises and combo resets.
  - Kiln overheat or cold firing: crack risk rises and the commission loses quality.
  - Vessel collapse: patience -1, score penalty, current piece resets to last safe profile if patience remains.

## Controls and layout

- Desktop:
  - Mouse click/tap: select vessel ring, action button, start/pause overlay button, or prompt link.
  - Mouse drag horizontally on the vessel: gently rotate/orbit the camera/wheel preview; drag vertically on a selected ring may widen/narrow if implemented, but buttons are mandatory.
  - Arrow Up/Down or W/S: select previous/next height ring.
  - Arrow Left/Right or A/D: narrow/widen selected ring.
  - Q/E: rotate view or nudge wheel view.
  - Space or Enter: Fire Kiln when sculpting is ready; also start from menu.
  - C: Carve selected ring.
  - G: Glaze selected ring.
  - M: Smooth selected ring.
  - B: Bellows during firing.
  - V: Vent during firing.
  - P: pause/resume.
  - R: restart current run.
- Mobile/touch:
  - Tap a large vessel ring or ring chip to select it.
  - Use large Ring Up, Ring Down, Widen, Narrow, Smooth, Carve, Glaze, Fire Kiln, Bellows, Vent, Pause, and Restart buttons.
  - Optional drag on the 3D scene may orbit slightly, but gameplay must work through tap-select plus visible buttons.
  - No virtual joystick. Interaction is ring select, sculpt buttons, glaze/carve, fire, heat controls, pause/restart.
- Mobile layout/orientation:
  - Default target is portrait phone play around 390x844; do not require landscape.
  - Top: compact ceramic studio HUD with score, best, patience tiles, wobble/crack risk, heat, chapter, combo, and time. Use clay tags and ember chips, not the recent six-box water/paper/rain layouts.
  - Below top: commission card with target traits, silhouette percentage, glaze/carve chips, heat range, and progress ticks.
  - Center: 3D pottery wheel scene with selected ring contour, target silhouette ghost, wall-thickness marks, glaze bands, carve marks, kiln smoke/ember particles, and assistant mascot/charm.
  - Bottom: selected-ring helper plus large sculpt/fire controls. Controls must not cover the vessel silhouette.
  - During firing, bottom controls simplify to Bellows, Vent, Hold Steady, Pause, Restart with large touch targets.
  - Tutorial must fit on the first portrait screen; optional details may be collapsible but objective, ring selection, widen/narrow, smooth, carve, glaze, firing heat, pause/restart must be visible.
  - Requests must combine text, icons, target silhouette lines, and labels so hue alone is not required.

## Menu and tutorial

Implement these states:

1. Title screen
   - Shows title “Ryu Ember Kiln Potter”.
   - Shows Day 016 badge, mode badge “3D”, public route `/ryu/`, best score, best Ember Offering time if available, and a prompt link.
   - Shows a large Start button and visible tutorial panel by default.
2. Tutorial text
   - Objective: “Shape the spinning clay vessel to match each silhouette, glaze it, then fire it without cracks.”
   - Ring selection: tap a vessel ring or ring chip to choose where your hands work.
   - Sculpting: Widen/Narrow changes the profile; Smooth lowers wobble; avoid thin walls and harsh jumps.
   - Carve/Glaze: add required dragon scales, grooves, and glaze bands before firing.
   - Firing: keep heat in the requested ember range with Bellows and Vent; overheating cracks thin clay.
   - Pause/restart: P/R on desktop or visible buttons on mobile.
3. In-game HUD
   - Score, best score, patience tiles, wobble, crack risk, heat, chapter name, combo, elapsed time, current commission, selected ring, silhouette match percentage, Fire readiness.
   - Pause/restart controls visible or immediately accessible.
4. Selected-ring helper
   - Non-blocking helper showing selected ring number/height, current radius vs target, wall thickness, wobble contribution, glaze/carve state, and expected score effect.
   - Must not cover the vessel or bottom controls on mobile.
5. Pause overlay
   - Resume, restart, tutorial reminder, controls summary, prompt link.
6. Game-over/results overlay
   - Final score, best score, commission reached, Ember Offering status, smoothest vessel, perfect firing count, mastery badges, restart button.
7. Ryu Ember Offering banner
   - Trigger once per run after all three commissions and 3000 score.
   - Non-blocking dragon-kiln glow: ember dragon silhouette coils through smoke, glaze bands shimmer, vermilion seal stamps the vessel, apprentice bows; endless kiln commissions continue after the banner fades.

## Assets

Prefer Imagegen2 (`openai/gpt-image-2`) for final visual art: pottery apprentice mascot, warm kiln-studio background, pottery/glaze/icon sheet, and decorative dragon-kiln pieces. Three.js primitives may render the interactive 3D clay vessel, target silhouette, selected rings, glaze bands, carved grooves, heat/crack overlays, particles, hit volumes, and UI chrome. Procedural code may crop, resize, alpha-clean, atlas-pack, optimize, animate, or place generated assets; it should not create final character/background/icon art from scratch unless Imagegen2 is unavailable after a real attempt.

Archive source generated art under `release/games/016/assets/source/` and use optimized playable copies under `release/games/016/assets/`. Also copy optimized playable assets into `apps/day-016-ryu-ember-kiln-potter/assets/` and the public alias `release/ryu/assets/`.

For mobile-first crop safety: keep important content centered, leave 12-16% safe margins, avoid baked-in text, avoid watermarks, avoid fake UI labels, avoid tiny pottery details that disappear at final in-game size, and keep mascot/vessel/icon silhouettes distinct against warm amber and dark cedar backgrounds.

Generate or provide at least these final art assets:

1. Pottery apprentice mascot/source charm
   - Target: transparent PNG if possible, square source, final optimized texture around 512x512 or 256x256.
   - Archive path: `release/games/016/assets/source/ryu-apprentice-source.png`
   - Optimized path: `release/games/016/assets/ryu-apprentice.png`
   - Imagegen2 prompt: “A charming Japanese pottery apprentice mascot for a mobile 3D browser pottery wheel arcade game, small friendly craftsperson in indigo clay apron and rolled sleeves, holding a wet clay tea bowl and bamboo rib tool, tiny ember dragon charm, warm kiln glow, centered readable silhouette, transparent or plain pale clay background, no text, no watermark, sprite-friendly, high contrast at small size.”
   - Aspect ratio: square.
2. Mountain pottery studio / dragon kiln background source
   - Target: portrait-friendly background suitable behind a 3D pottery wheel playfield with open readable center.
   - Archive path: `release/games/016/assets/source/ryu-kiln-studio-source.png`
   - Optimized path: `release/games/016/assets/ryu-kiln-studio.png`
   - Imagegen2 prompt: “A warm Japanese mountain pottery studio for a portrait mobile 3D pottery wheel game, glowing dragon kiln at the side, cedar shelves with raku bowls, clay tools, ash-glaze jars, late afternoon light, ember smoke ribbons, open readable center area for a spinning clay vessel, crop-safe for phone portrait, no characters, no text, no watermark.”
   - Aspect ratio: portrait.
3. Pottery, glaze, heat, and UI icon sheet source
   - Target: square icon sheet for ring controls, clay states, hazards, rewards, and UI decals.
   - Archive path: `release/games/016/assets/source/ryu-icons-source.png`
   - Optimized path: `release/games/016/assets/ryu-icons.png`
   - Imagegen2 prompt: “Small readable icon sheet for a Japanese pottery wheel kiln game: clay ring profile, widen paddle, narrow rib tool, smoothing sponge, dragon-scale carving stamp, ash-blue glaze brush, ember heat flame, vent fan, bellows, crack warning, patience kiln tile, Ryu Ember Offering seal, transparent or plain pale clay background, high contrast, no text, no watermark, generous margins so no icons are cut off.”
   - Aspect ratio: square.

If Imagegen2 is unavailable or fails after a real attempt, create a clearly labeled emergency fallback using simple SVG/canvas/Three.js materials, document the failure in `ai/postmortems/day-016.md`, and still keep source/fallback files under the same asset paths.

### Mandatory generated-image QA

For every generated image, include a real inspection step after generation and before integration:

- Analyze the actual generated file visually, not just the prompt text.
- For the pottery apprentice mascot, verify transparent/cutout quality or clean background handling, readable silhouette, centered pivot, crop margins, no unwanted text/watermarks, stable upright orientation, and that the clay/tool pose does not imply a wrong gameplay direction.
- Verify control-to-motion alignment in-game: Ring Up/Down must select the expected vessel height, Widen/Narrow must visibly change the selected ring radius in the expected direction, Smooth must lower wobble feedback, Carve/Glaze must mark the intended ring, Fire Kiln must enter the firing phase, and Bellows/Vent must move heat in opposite/readable directions.
- For the background, verify the center play area remains readable after portrait mobile crop and does not hide vessel rings, silhouette target, commission card, heat/crack warnings, selected helper, or controls.
- For the icon sheet, verify widen, narrow, smooth, carve, glaze, heat, vent, bellows, crack, patience tile, and offering seal are distinct at final HUD/button size and cannot be confused.
- If inspection finds a problem, regenerate or post-process the image and inspect again. Do not ship broken visual assets just because tests pass.

## Prompt page output

The archived `release/games/016/prompt.html` must be a consistent rendered HTML page, not raw Markdown pasted into a `<pre>` block. It should include:

- A clear `<title>` and `<h1>` using `Day 016 Game Generation Prompt`.
- A back-to-game link near the top.
- Semantic rendered sections (`h2`, `h3`, `ul/ol/li`, `p`, `pre/code` only for actual code/commands).
- The same readable prompt-page style pattern across days so prompt pages feel like one system.

## Subagents to dispatch

1. Implementation subagent
   - Build the static 3D game under `apps/day-016-ryu-ember-kiln-potter/`.
   - Integrate it into immutable release output under `release/games/016/`.
   - Create the public playable route under `release/ryu/`.
   - Use static HTML/CSS/JS with Three.js/WebGL and no backend.
   - The public alias must be self-contained or asset paths must be alias-safe.
   - If vendoring `three.module*.js`, also copy the matching `three.core*.js` beside it in the app, release archive, and `/ryu/` alias assets.
2. Asset/polish subagent
   - Generate/prepare Imagegen2 assets, archive source files, optimize playable copies, inspect generated images, and tune mobile readability/game feel.
3. QA/browser/mobile subagent
   - Run desktop and mobile smoke checks, verify no console errors, verify menu/tutorial/objective/controls/restart/pause, prompt links, 3D scene rendering, ring selection, widen/narrow, smooth, carve, glaze, Fire Kiln, Bellows/Vent control presence, commission completion feedback, generated screenshot, generated assets, and 390x844 portrait layout.
4. Reflection/self-improvement subagent
   - Write `ai/postmortems/day-016.md` after validation with what worked, what failed, generated-image inspection notes, code-isolation confirmation, and whether generator/template/rubric improvements are justified.

## Acceptance criteria

- Static build passes.
- Code isolation is documented in QA/postmortem: no previous game implementation code was opened, inspected, copied, diffed, grepped, or adapted.
- Mode choice follows the cadence rule: Day 016 is real `3d` with spatial pottery-wheel shaping, ring selection, 3D silhouette/profile matching, wobble/thickness, glaze/carve placement, and kiln heat management.
- Desktop smoke passes.
- Mobile portrait smoke passes at about 390x844 with readable HUD/tutorial/commission card, usable ring/sculpt/carve/glaze/fire/heat controls, no forced landscape canvas, and 44px+ controls.
- Prompt is visible from gallery and release folder.
- `prompts/day-016.md` is copied exactly to `release/games/016/prompt.md` and `release/ryu/prompt.md`.
- `release/games/016/prompt.html` and `release/ryu/prompt.html` render the prompt in browser-readable semantic HTML with the standard prompt-page styling, not a raw Markdown `<pre>` dump.
- Public alias `release/ryu/index.html`, `release/ryu/prompt.html`, `release/ryu/screenshot.png`, and `release/ryu/assets/` exist and work.
- Gallery card for Day 016 shows prompt availability, generation duration, public `/ryu/` links, mode `3d`, and actual generated date.
- Screenshot exists at `release/games/016/screenshot.png` and is non-empty/readable. Prefer a readable desktop gameplay screenshot for gallery cards; mobile screenshots are QA evidence unless the design is intentionally portrait-card friendly.
- Image/source assets exist under `release/games/016/assets/source/` and optimized assets exist under `release/games/016/assets/`, or a documented emergency fallback exists.
- Every generated image has an inspection note in the postmortem or QA notes; interactive vessel/kiln visuals have verified background handling, orientation/pivot/crop, readability, and control-to-motion alignment.
- If the game uses audio cues, initialize WebAudio only after user gesture and verify no autoplay errors. Audio is optional because this is not a rhythm/sound-themed day.
- No console errors during desktop or mobile smoke. Add data-URI favicons to game and prompt pages if needed to avoid favicon request noise.
- Existing `release/games/001/**` through `release/games/015/**` from origin/main remain unchanged.
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
# Screenshot/static checks: verify release/games/016/screenshot.png, prompt.md, prompt.html, index.html, game.js, styles.css, release/ryu/index.html, release/ryu/prompt.html, release/ryu/screenshot.png, optimized assets, and source assets exist and are non-empty.
# Prompt copy check: cmp prompts/day-016.md release/games/016/prompt.md and cmp prompts/day-016.md release/ryu/prompt.md.
# Prompt HTML check: verify release/games/016/prompt.html has semantic h1/h2/list markup and a back-to-game link, not a raw Markdown dump inside <pre>, and no malformed ul > p or ol > p nodes.
# Browser smoke: open the local/static /ryu/ route and verify menu, tutorial, gameplay start, 3D render, ring selection, Ring Up/Down, Widen, Narrow, Smooth, Carve, Glaze, Fire Kiln, Bellows/Vent control presence, pause, restart, prompt page, no console errors.
# Mobile smoke: repeat at a portrait phone viewport such as 390x844 and verify playable tap controls and readable HUD/commission/3D vessel.
# Static screenshot check: inspect release/games/016/screenshot.png and release/ryu/screenshot.png for non-empty readable game content; use vision to judge actual visual quality.
# Image QA: inspect every Imagegen2 source/optimized asset and document the actual inspection result in ai/postmortems/day-016.md.
# Docker/static smoke: build the Docker image locally, run it, curl /ryu/ and /ryu/prompt.html, then stop the container.
# Immutable guard: confirm no release/games folders from origin/main changed except new Day 016.
```
