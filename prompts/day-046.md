# Day 046 Game Generation Prompt

## Game identity

- Day: 046
- Title: Shachi Roofline Rainwright
- Slug: shachi-roofline-rainwright
- Public route word: shachi
- Mode: 3D
- Genre: mobile-first 3D roof-tile repair / rain-gutter routing / storm-pressure score chase
- Mood/style: a dramatic blue-hour Japanese temple roof after summer rain, glossy curved kawara tiles, gold shachihoko roof ornament helper, copper rain chains, moonlit puddle highlights, cedar beams, misty clouds, and warm shrine windows below; a real spatial roof-slope/rain-routing game rather than kendama toy physics, kakigori dessert sculpting, karuta card scanning, cedar trunk climbing, mycelium networks, kintsugi repair, tatami layout, griddle cooking, fish scooping, gear trains, bridge trusses, temari thread orbits, fan dyeing, onsen valves, ikebana, orchard harvesting, kumiko lattice, shrine stealth, matcha whisking, fireworks, pachinko, mochi hopping, calligraphy, kite mapping, dry-garden raking, underwater pearls, taiko routing, daruma tilting, web weaving, pottery shaping, bamboo canals, origami folding, parasol sheltering, snow stacking, kimono stamping, bento service, windbell tuning, rail running, or koi collection.

## Why this game today

The generated series currently ends with:

- Day 042 `3d`: Kabuto Cedar Canopy Climber, bright vertical cedar trunk orbit-climbing with sap beads and branch ledges.
- Day 043 `2d`: Karuta Mooncall Duelist, dark indigo card-table reaction/memory duel with reader cues and rival hand lanes.
- Day 044 `3d`: Kakigori Prism Shavewright, bright dessert stall with a translucent 3D shaved-ice mound, syrup routing, toppings, and melt pressure.
- Day 045 `2d`: Kendama Star Cup Juggler, warm dusk toy-stall 2D pendulum/cup/spike timing with fox helper and chunky wood-clack controls.

The latest generated-mode streak is one `2d` (Day 045), so Day 046 deliberately returns to real `3d` to preserve the strong alternating cadence. It should be meaningfully spatial: the player rotates/tilts a curved temple roof, replaces and seals tiles on near/mid/far roof faces, routes rain along 3D slopes into copper rain chains, braces gust-lifted ridge caps, and uses Shachi Focus to preview downhill water paths and leak risk. It must not be a flat tile board with perspective decoration; roof yaw, roof pitch, tile height, slope direction, water flow, gutter alignment, wind side, tile overlap, sealant cure, and ridge-cap stability must all matter mechanically.

Recent visual variety notes from screenshots:

- Day 045 is warm dark maroon/gold with a large 2D kendama silhouette, red ball, cup rings, fox helper card, and many compact brown controls.
- Day 044 is bright cream/cyan with a centered 3D shaved-ice mound, syrup/order controls, and a sunlit stall background.
- Day 043 is a dark indigo horizontal card table with cream poem cards, rival hand overlays, and warm gold labels.
- Day 042 is a bright sky-blue vertical trunk climb with a central cedar column, beetle proxy, and two-row climb controls.

Day 046 should contrast with a cool architectural storm palette: glazed charcoal roof tiles, moon-blue rain, aged copper gutters, vermilion shrine beams far below, gold shachihoko glints, wet reflections, diagonal rain streaks, and subtle lightning clouds. Avoid toy cups/balls/string/star charms, dessert mounds/syrup/toppings, card spreads/reader panels/rival hands, vertical trunks/beetles/sap/branch ledges, glowing mycelium, porcelain shards/gold cracks, tatami rectangles, griddles/cakes/smoke, fish tanks/nets, gears/couplers, bridge trusses, thread spheres, fan dye sectors, onsen ducts, floral stems, fruit baskets, kumiko lattice strips, stealth cones, tea foam bowls, firework arcs, pachinko pegs, mochi platforms, brush strokes, kite strings, sand rake lines, pearls, taiko pads, maze boards, web strands, pottery profiles, bamboo canal tiles, origami creases, parasols, snow blocks, kimono panels, conveyor food, windbell notes, rail tracks, or koi ponds.

## Code isolation / no previous game source

The implementation must be written from scratch for this day. Do not open, inspect, copy, diff, grep, or adapt code from previous games, including old `apps/day-*` folders, old `release/games/NNN/` HTML/CSS/JS files, or old public alias folders. You may inspect previous metadata, prompts, postmortems, and screenshots only to avoid repeating concepts and visual identity. The new game's HTML/CSS/JS must come from this prompt and general browser/Three.js/WebGL/WebAudio game knowledge, not from earlier game implementations.

## Mode variety / 3D cadence

Inspection target: `src/data/games.ts` currently ends with Day 042 `3d`, Day 043 `2d`, Day 044 `3d`, and Day 045 `2d`. The latest generated-mode streak is one `2d`.

Mode decision: Day 046 is real `3d`. It must implement meaningful spatial gameplay, not decorative perspective:

- Use Three.js/WebGL or equivalent static-browser 3D rendering.
- Render a real 3D curved temple roof scene with camera depth, visible roof yaw/pitch, near/mid/far tile lanes, ridge cap, eaves, gutters, rain chains, shachi ornament, leak spots, gust arrows, water droplets flowing down slopes, and sealant/glaze highlights.
- Gameplay must depend on 3D state: selected roof face, tile row/column, roof slope, yaw, pitch, water path, tile overlap, crack/leak severity, gutter chain alignment, wind side, ridge-cap lift, sealant cure timer, storm pressure, and camera-relative controls.
- Player actions must manipulate the 3D system: rotate roof, select tile row, lift/replace tile, seal crack, slide gutter, brace ridge, sweep leaves, ring rain chain, apply moon glaze, use Shachi Focus to preview flow/leaks/gusts, pause/restart, audio toggle, and open prompt.
- Portrait mobile is the default supported layout; no landscape gate.

## Design

- Objective: Repair a rain-lashed temple roof by replacing cracked kawara tiles, sealing overlaps, routing water into copper rain chains, bracing the ridge shachi, and keeping shrine rooms dry through three storm commissions.
- Win condition: Complete three roof commissions — First Eave Leak, Moon Gutter Turn, and Grand Shachi Stormseal — while reaching 6000 points to trigger “Shachi Moon-Roof Blessing”. After the banner, continue into endless storm repairs.
- Lose condition: Three dry-room hearts are lost, leak meter reaches 100%, storm pressure reaches 100%, the ridge cap lifts twice, six water streams miss all gutters, or the Grand Shachi commission receives two wrong tile replacements.
- Core loop:
  1. Start on a title/menu screen with Day 046 badge, mode badge “3D”, public route `/shachi/`, best score, best Moon-Roof Blessing time, tutorial, prompt link, audio note, and a large Start button.
  2. Show a portrait-friendly 3D roof stage. The central object is a curved charcoal kawara roof above a warm shrine glow. The camera is slightly above/front, with rotation controls so near, mid, far, left eave, right eave, and ridge details are visible.
  3. A commission card requests goals such as: “Replace two cracked left-eave tiles, seal the lower overlap, slide the copper gutter under blue stream, sweep cedar leaves, and keep leaks below 45%.”
  4. Player rotates the roof left/right and selects a row/face. Cracks, puddles, gutters, and rain chains keep their 3D positions, so hidden back-face leaks can rotate into view.
  5. Lift Tile previews a tile and shows overlap direction. Replacing the wrong tile increases storm pressure; replacing cracked tiles restores roof health and can redirect rain.
  6. Seal Crack applies moon glaze along one overlap. It cures over time; rain before cure can wash it away unless Moon Glaze was used.
  7. Slide Gutter shifts the copper gutter/rain-chain catch point along the eave. It must align with flowing water streams rather than abstract lanes.
  8. Brace Ridge clamps a wobbling ridge cap or steadies the gold shachi ornament through gusts. Bracing too early wastes charge; bracing during red gust warning protects combo.
  9. Sweep Leaves clears cedar leaves that block water flow or hide crack markings. Sweeping during heavy rain scatters leaves into adjacent gutters.
  10. Ring Rain Chain drains one aligned stream, scores if timed during a blue drip pulse, and briefly reveals hidden leak paths down the roof.
  11. Moon Glaze spends focus charge to accelerate seal cure, pearl-coat one replacement tile, slow leaks, and highlight safe water channels. Overuse reduces score efficiency.
  12. Shachi Focus, charged by clean repairs, aligned gutters, and timely bracing, overlays downhill rain paths, cracked tiles, valid overlap direction, gust side, ridge lift risk, gutter catches, dry-room hearts, and the safest next action.
  13. Completing a commission stamps a roof talisman, restores one dry-room heart if below max, awards points, changes roof geometry and storm constraints, and unlocks steeper slopes, diagonal wind, hidden back-face cracks, clogged gutters, faster cure timers, and multi-stream rain.
  14. Pause/restart remain visible throughout.
- 15+ minute play-value strategy:
  - Save best score, fastest Shachi Moon-Roof Blessing time, lowest final leak, longest dry-room streak, most blue-pulse rain-chain drains, highest endless storm commission, fewest wrong tile replacements, best no-focus repair, and collected roof-talisman badges in localStorage.
  - Include three authored commissions:
    - First Eave Leak: broad front roof face, two obvious cracked tiles, slow rain, one gutter target, guided first Rotate Roof, Row −/+, Lift Tile, Seal Crack, and Slide Gutter. No dry-heart penalty for the first tutorial wrong tile.
    - Moon Gutter Turn: left/right eave flow split, first Sweep Leaves clog, first Ring Rain Chain pulse, one hidden mid-face crack that requires Rotate Roof, and first Brace Ridge warning.
    - Grand Shachi Stormseal: full roof with near/mid/far cracks, diagonal gust, two simultaneous water streams, required Shachi Focus preview, Moon Glaze cure timing, ridge cap below 40% lift risk, and no wrong replacements in the last chain.
  - Deterministic Day 046 seed varies crack positions, tile overlap direction, water stream source, gutter target, wind gust side, leaf clog timing, seal cure speed, ridge lift risk, rain-chain pulse rhythm, Shachi Focus charge, and endless constraints while keeping opening seconds fair.
  - Mastery badges: complete First Eave Leak with zero wrong tiles, trigger Moon-Roof Blessing under 285 seconds, finish Moon Gutter Turn with every chain pulse timed, clear Grand Shachi with leaks below 30%, brace three ridge gusts perfectly, drain five streams in a row, and complete a commission without Shachi Focus.
  - Strategic scoring rewards spatial planning: rotate before acting on hidden faces, choose tile rows before replacing, seal overlaps facing uphill-to-downhill, slide gutters under actual streams, sweep leaves before they enter a gutter, ring chains on blue pulses, save Moon Glaze for storm peaks, and brace ridge during red gust warnings instead of panic-spamming.
  - Endless mode after Moon-Roof Blessing adds asymmetrical roofs, extra cracked tile types, crossed gutters, split water streams, shorter cure timers, stronger gusts, hidden back-face leaks, and bonus talismans without shrinking touch targets.
- Difficulty scaling:
  - 0-45 seconds: front face, slow rain, large cracks, one gutter, generous tile/row selection, visible flow hints.
  - 45-150 seconds: left/right eaves, leaves, first hidden face, rain-chain pulse, ridge gust warning.
  - 150-285 seconds: diagonal gust, two streams, required Shachi Focus, Moon Glaze cure timing, tighter overlap correctness.
  - 285+ seconds/endless: more cracks, steeper slopes, clogged gutters, shorter cure windows, same readable controls.
  - Keep mobile fair: roof, cracked tiles, gutters, water streams, ridge shachi, gust warnings, commission card, helper, focus/leak/storm HUD, and action buttons must be readable at 390x844; primary touch buttons should be 52px+ where possible and never below 44px; no tiny survival-critical tile cracks.
- Scoring/rewards:
  - Correct roof face/row selected before action: +120 points times combo tier.
  - Replace a genuinely cracked tile with correct overlap: +280 points and Shachi Focus charge.
  - Seal Crack cures before rain washout: +260 points.
  - Slide Gutter under a live water stream: +240 points.
  - Ring Rain Chain during blue drip pulse: +300 points and combo protect.
  - Sweep Leaves before clogging a gutter: +180 points.
  - Brace Ridge during red gust warning: +340 points.
  - Moon Glaze protects an active repair without overuse: +260 points.
  - Complete commission before storm warning: +1080 points and restore one dry-heart if below max.
  - Perfect no-leak commission: +1500 points.
  - Shachi Moon-Roof Blessing: +3600 points and endless storm repairs unlock.
  - Wrong tile, washed seal, missed gutter, unclamped ridge lift, or leaf clog: combo reset and leak/storm penalty.

## Controls and layout

- Desktop:
  - Mouse/tap on the 3D roof: select tile row, cracked tile, gutter catch, ridge cap, leaf clog, rain-chain pulse, or explainable stage chip.
  - Mouse drag on the stage: rotate roof horizontally and choose tile row vertically with a visible tool cursor offset above the pointer.
  - Arrow keys or WASD: Rotate Roof left/right and select Row −/+.
  - Space or Enter: Lift Tile / Replace Tile.
  - S: Seal Crack.
  - G: Slide Gutter.
  - B: Brace Ridge.
  - L: Sweep Leaves.
  - C: Ring Rain Chain.
  - M: Moon Glaze.
  - Shift or F: Shachi Focus when charged.
  - P: pause/resume.
  - R: restart current run.
- Mobile/touch:
  - Drag horizontally on the stage to rotate the roof. Drag vertically to choose roof row; the tool cursor stays above the finger so tiles, water streams, and gutters remain visible.
  - Tap visible cracked tiles, gutters, leaves, or ridge cap to select them, then use large action buttons.
  - Use large Row −, Row +, Rotate Left, Rotate Right, Lift Tile, Seal Crack, Slide Gutter, Brace Ridge, Sweep Leaves, Ring Rain Chain, Moon Glaze, Shachi Focus, Pause, Restart, Audio, and Prompt buttons.
  - Tapping leak/storm/gutter/focus/commission chips may show short explanations.
  - No tiny virtual joystick. Interaction is direct roof drag/tap plus labeled roofwright/action controls.
- Mobile layout/orientation:
  - Default target is portrait phone play around 390x844; do not require landscape.
  - Top: compact Shachi HUD with score, best, dry-room hearts, leak %, storm %, combo, selected row, active face, gutter alignment, ridge risk, Shachi Focus charge, and elapsed time. Use roof/tile/rain/gutter/chain/gust/shachi/moon-glaze/talisman chips, not toy/dessert/card/beetle/root/mushroom/shard/tatami/cake/fish/gear/bridge/thread/fan-dye/valve/flower/fruit/lattice/tea/firework/koi icons.
  - Below top: roof commission card with requested replacements, seal count, gutter target, rain-chain pulse, ridge-risk target, progress ticks, and current shrine-carpenter note.
  - Center: tall 3D temple-roof stage with roof tiles, ridge shachi, gutters, water streams, leak sparks, leaf clogs, gust arrows, helper art, and readable feedback. It must remain playable without zooming.
  - Bottom: status helper plus large roof/action controls. Controls must not cover roof, water streams, crack markers, gutter targets, helper, commission card, gust warnings, or Shachi Focus overlays.
  - Tutorial must fit on the first portrait screen; optional details may be collapsible but objective, rotate/select row, Lift Tile, Seal Crack, Slide Gutter, Brace Ridge, Sweep Leaves, Ring Rain Chain, Moon Glaze, Shachi Focus, pause/restart must be visible.
  - Requests must combine text, icons, tile shapes, crack marks, water-path arrows, progress ticks, target halos, and labels so hue alone is not required.

## Menu and tutorial

Implement these states:

1. Title screen
   - Shows title “Shachi Roofline Rainwright”.
   - Shows Day 046 badge, mode badge “3D”, public route `/shachi/`, best score, best Moon-Roof Blessing time if available, and a prompt link.
   - Shows a large Start button and visible tutorial panel by default.
   - Notes: “Audio starts after you press Start; visual roof, tile, rain, gutter, chain, leak, ridge, storm, and focus cues work if muted.”
2. Tutorial text
   - Objective: “Replace cracked roof tiles, seal overlaps, guide rain into chains, brace the ridge, and keep the shrine dry.”
   - 3D movement: rotate the roof and select tile rows; hidden eaves matter.
   - Repairs: Lift Tile to replace cracks, Seal Crack before rain washes it, and Slide Gutter under live streams.
   - Storm tools: Sweep Leaves, Ring Rain Chain on blue pulses, Brace Ridge during red gusts, and use Moon Glaze for curing.
   - Shachi Focus: previews rain paths, crack risk, gutter catches, gust side, ridge lift, and safest next repair.
   - Pause/restart: visible buttons on mobile or keyboard shortcuts on desktop.
3. In-game HUD
   - Score, best score, dry-room hearts, leak %, storm %, commission name, combo, selected row, active face, gutter alignment, ridge risk, Shachi Focus charge, elapsed time, latest warning.
   - Pause/restart controls visible or immediately accessible.
4. Status helper
   - Non-blocking helper showing selected row/face, current roof tool, crack/overlap validity, water-flow risk, gutter catch, ridge warning, Shachi Focus readiness, and expected score effect.
   - Must not cover the 3D roof or bottom controls on mobile.
5. Pause overlay
   - Resume, restart, tutorial reminder, controls summary, audio/mute toggle, prompt link.
6. Game-over/results overlay
   - Final score, best score, commission reached, Moon-Roof Blessing status, leak %, storm %, wrong tiles, chain drains, ridge saves, badges, restart button.
7. Shachi Moon-Roof Blessing banner
   - Trigger once per run after all three roof commissions and 6000 score.
   - Non-blocking celebration: rain becomes silver threads, the gold shachi glows, copper chains ring, dry-room lanterns brighten below the roof, a moon talisman stamps onto the card, and endless storm repairs continue after the banner fades.

## Assets

Prefer Imagegen2 (`openai/gpt-image-2`) for final visual art: gold shachihoko roof-helper mascot, portrait blue-hour temple-roof background, kawara tile/rain/gutter material sprite sheet, and roofwright tool/UI icon sheet. Three.js primitives may render the interactive roof geometry, tile grid, crack markers, water flows, gutters, rain-chain pulses, gust arrows, particles, and UI chrome. It should not create final character/background/texture/icon art from scratch unless Imagegen2 is unavailable after a real attempt.

Archive source generated art under `release/games/046/assets/source/` and use optimized playable copies under `release/games/046/assets/`. Also copy optimized playable assets into `apps/day-046-shachi-roofline-rainwright/assets/` and the public alias `release/shachi/assets/`.

For mobile-first crop safety: keep important content centered, leave 12-16% safe margins, avoid baked-in readable text, avoid watermarks, avoid fake UI labels, avoid tiny roof details that disappear at final in-game size, and keep shachi/tile/rain/gutter/chain/gust/moon-glaze/talisman silhouettes distinct against blue-hour storm backgrounds.

Generate or provide at least these final art assets:

1. Gold shachihoko roof-helper mascot
   - Target: transparent PNG if possible, square source, final optimized texture around 512x512 or 256x256.
   - Archive path: `release/games/046/assets/source/shachi-helper-source.png`
   - Optimized path: `release/games/046/assets/shachi-helper.png`
   - Imagegen2 prompt: “A charming small gold shachihoko roof-guardian mascot for a mobile 3D Japanese temple roof rain-repair arcade game, friendly tiger-fish dragon roof ornament with expressive eyes, tiny carpenter headband, holding a moon-glaze brush and copper rain-chain bell, wet gold highlights, blue storm rim light, centered readable silhouette, transparent or solid pale moon parchment background, no checkerboard background, no readable text, no watermark, sprite-friendly, high contrast at small size.”
   - Aspect ratio: square.
2. Blue-hour temple roof storm background source
   - Target: portrait-friendly background suitable behind a large 3D curved roof with open readable center.
   - Archive path: `release/games/046/assets/source/shachi-roof-source.png`
   - Optimized path: `release/games/046/assets/shachi-roof.png`
   - Imagegen2 prompt: “A blue-hour Japanese temple roof during gentle summer storm for a portrait mobile 3D arcade game, glossy charcoal kawara tiles and cedar beams near the edges, warm shrine windows glowing far below, misty clouds, copper rain chains to the sides, moonlit raindrops, open readable central space for an overlaid interactive roof model, crop-safe for phone portrait, no central character, no readable text, no watermark.”
   - Aspect ratio: portrait.
3. Kawara tile, rain, gutter, and roof material sprite sheet source
   - Target: square sheet with separated readable materials that can be used as sprites/decals/textures.
   - Archive path: `release/games/046/assets/source/shachi-pieces-source.png`
   - Optimized path: `release/games/046/assets/shachi-pieces.png`
   - Imagegen2 prompt: “Sprite sheet of small readable Japanese temple roof repair game pieces: glossy charcoal kawara tile, cracked tile, moon-glaze seal streak, blue rain droplet trail, copper gutter segment, copper rain chain loop, cedar leaf clog, red gust warning arrow, dry room heart lantern, gold shachi crest, moon roof talisman, silver leak sparkle, each element separated with generous margins, transparent or pale moon parchment background, no checkerboard background, no readable text, no watermark, readable at 40-96 pixels.”
   - Aspect ratio: square.
4. Roofwright tool, leak, storm, and focus UI icon sheet source
   - Target: square icon sheet for objectives, hazards, tools, rewards, and UI decals.
   - Archive path: `release/games/046/assets/source/shachi-icons-source.png`
   - Optimized path: `release/games/046/assets/shachi-icons.png`
   - Imagegen2 prompt: “Small readable icon sheet for a Japanese temple roof rain-repair arcade game: roof tile, lift tile tool, seal crack brush, slide gutter, brace ridge clamp, sweep leaves broom, ring rain chain, moon glaze bottle, rain path arrow, leak warning drop, storm pressure cloud, shachi focus gold crest, dry room heart lantern, roof talisman, Moon-Roof Blessing crest, transparent or solid pale moon parchment background, no checkerboard background, high contrast, no readable text, no watermark, generous margins so no icons are cut off.”
   - Aspect ratio: square.

If Imagegen2 is unavailable or fails after a real attempt, create a clearly labeled emergency fallback using simple SVG/Three.js shachi/tile/rain/gutter/chain/icon silhouettes, document the failure in `ai/postmortems/day-046.md`, and still keep source/fallback files under the same asset paths.

### Mandatory generated-image QA

For every generated image, include a real inspection step after generation and before integration:

- Analyze the actual generated file visually, not just the prompt text.
- For the shachi helper mascot, verify transparent/cutout quality or clean background handling, readable gold roof-guardian silhouette, centered pivot/crop margins, no unwanted text/watermarks, stable upright orientation, and that brush/bell pose is compatible with static helper placement.
- For the pieces sheet, verify separated kawara tile, cracked tile, moon-glaze streak, rain trail, copper gutter, rain chain, cedar leaf clog, gust arrow, dry-room lantern, shachi crest, talisman, and leak sparkle at final 40-96px size, usable crop margins, no baked checkerboard, no unwanted readable text/watermark, and a documented visual baseline: water flows downward along tile overlaps, gutter sits at eave, rain chain hangs vertically, gust arrow points from the wind side.
- Verify control-to-motion alignment in-game: Rotate Roof must visibly turn the roof, Row −/+ must change highlighted tile row, Lift Tile must replace or preview a selected cracked tile, Seal Crack must visibly glaze/cure a crack, Slide Gutter must move the catch point, Brace Ridge must reduce ridge wobble, Sweep Leaves must remove/move clogs, Ring Rain Chain must drain a stream on pulse, Moon Glaze must speed cure/highlight safe paths, Shachi Focus must preview flow/leak/gust/ridge paths, Pause/Restart must work.
- For the background, verify the central roof remains readable after portrait mobile crop and does not hide cracks, water streams, gutter targets, commission card, helper, gust warnings, or controls.
- For the icon sheet, verify roof tile, lift tool, seal brush, gutter, ridge clamp, broom, rain chain, moon glaze, rain path, leak warning, storm cloud, Shachi Focus, dry-room heart, talisman, and Blessing crest are distinct at final HUD/button size and cannot be confused. Watch specifically for fake checkerboard transparency; alpha-clean or composite onto pale parchment if needed and inspect again.
- If inspection finds a problem, regenerate or post-process the image and inspect again. Do not ship broken visual assets just because tests pass.

## Audio and game feel

Because rain, tile clacks, brush sealing, gutters, chains, gusts, ridge braces, and shrine blessing are central to the theme, include lightweight WebAudio cues initialized only after a user gesture:

- Soft rain bed or brief wet tile tap when Start begins.
- Ceramic lift clack when Lift Tile previews/replaces.
- Brush shimmer when Seal Crack applies moon glaze.
- Copper scrape when Slide Gutter moves.
- Wooden clamp knock when Brace Ridge succeeds.
- Broom swish when Sweep Leaves fires.
- Copper chain chime when Ring Rain Chain drains.
- Low gust whoosh warning when storm pressure rises.
- Leak drip warning when water misses gutters.
- Bright gold-water shimmer when Shachi Focus activates.
- Shrine bell/rain-chain flourish when Shachi Moon-Roof Blessing triggers.

Audio must not block play if WebAudio is unavailable. Verify no autoplay errors: audio context should be created/resumed only after Start or another user interaction. Include a visible mute toggle in pause/results or HUD. Expose a narrow debug handle such as `window.__day046Audio = { ctx, enabled }` after user-gesture initialization so Playwright can assert audio state.

## Prompt page output

The archived `release/games/046/prompt.html` must be a consistent rendered HTML page, not raw Markdown pasted into a `<pre>` block. It should include:

- A clear `<title>` and `<h1>` using `Day 046 Game Generation Prompt`.
- A back-to-game link near the top.
- Semantic rendered sections (`h2`, `h3`, `ul/ol/li`, `p`, `pre/code` only for actual code/commands).
- The same readable prompt-page style pattern across days so prompt pages feel like one system.

## Subagents to dispatch

1. Implementation subagent
   - Build the static 3D game under `apps/day-046-shachi-roofline-rainwright/`.
   - Integrate it into immutable release output under `release/games/046/`.
   - Create the public playable route under `release/shachi/`.
   - Use static HTML/CSS/JS with Three.js/WebGL/WebAudio and no backend.
   - The public alias must be self-contained or asset paths must be alias-safe.
   - If vendoring `three.module*.js`, also copy the matching `three.core*.js` beside it in the app, release archive, and `/shachi/` alias assets.
2. Asset/polish subagent
   - Generate/prepare Imagegen2 assets, archive source files, optimize playable copies, inspect generated images, remove fake checkerboards if present, document roof/tile/rain/gutter/ridge visual baselines, and tune mobile readability/game feel.
3. QA/browser/mobile subagent
   - Run desktop and mobile smoke checks, verify no console errors, verify menu/tutorial/objective/controls/restart/pause, prompt links, 3D roof render, Rotate Roof, direct stage drag, Row −/+, Lift Tile, Seal Crack, Slide Gutter, Brace Ridge, Sweep Leaves, Ring Rain Chain, Moon Glaze, Shachi Focus control presence and visible mechanical effect, leak/storm/gutter/ridge/commission feedback, generated screenshot, generated assets, WebAudio initialization after user gesture, and 390x844 portrait layout.
4. Reflection/self-improvement subagent
   - Write `ai/postmortems/day-046.md` after validation with what worked, what failed, generated-image inspection notes, roof/tile/rain/gutter/ridge visual baseline, audio verification, code-isolation confirmation, and whether generator/template/rubric improvements are justified.

## Acceptance criteria

- Static build passes.
- Code isolation is documented in QA/postmortem: no previous game implementation code was opened, inspected, copied, diffed, grepped, or adapted.
- Mode choice follows the cadence rule: Day 046 is real `3d` after Day 045 `2d`, with meaningful roof rotation, tile replacement, crack sealing, water flow, gutter alignment, ridge bracing, wind, and storm mechanics rather than decorative perspective.
- Desktop smoke passes.
- Mobile portrait smoke passes at about 390x844 with readable HUD/tutorial/commission card, usable 44px+ roof/action/pause/restart controls, no forced landscape canvas, and no tiny survival-critical cracked tiles.
- Prompt is visible from gallery and release folder.
- `prompts/day-046.md` is copied exactly to `release/games/046/prompt.md` and `release/shachi/prompt.md`.
- `release/games/046/prompt.html` and `release/shachi/prompt.html` render the prompt in browser-readable semantic HTML with the standard prompt-page styling, not a raw Markdown `<pre>` dump.
- Public alias `release/shachi/index.html`, `release/shachi/prompt.html`, `release/shachi/screenshot.png`, and `release/shachi/assets/` exist and work.
- Gallery card for Day 046 shows prompt availability, generation duration, public `/shachi/` links, mode `3d`, and actual generated date.
- Screenshot exists at `release/games/046/screenshot.png` and is non-empty/readable. Prefer a readable desktop gameplay screenshot for gallery cards; mobile screenshots are QA evidence unless the design is intentionally portrait-card friendly.
- Image/source assets exist under `release/games/046/assets/source/` and optimized assets exist under `release/games/046/assets/`, or a documented emergency fallback exists.
- Every generated image has an inspection note in the postmortem or QA notes; interactive roof/tile/rain/gutter/ridge visuals have verified background handling, orientation/pivot/crop, readability, and control-to-motion alignment.
- WebAudio initializes after user gesture and creates no autoplay console errors; audio is failsafe if unsupported and visual roof/tile/rain/gutter/ridge/commission cues remain playable muted.
- No console errors during desktop or mobile smoke. Add data-URI favicons to game and prompt pages if needed to avoid favicon request noise.
- Existing `release/games/001/**` through `release/games/045/**` from origin/main remain unchanged.
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
# Screenshot/static checks: verify release/games/046/screenshot.png, prompt.md, prompt.html, index.html, game.js, styles.css, release/shachi/index.html, release/shachi/prompt.html, release/shachi/screenshot.png, optimized assets, source assets, and vendored Three.js files (if used) exist and are non-empty.
# Prompt copy check: cmp prompts/day-046.md release/games/046/prompt.md and cmp prompts/day-046.md release/shachi/prompt.md.
# Prompt HTML check: verify release/games/046/prompt.html has semantic h1/h2/list markup and a back-to-game link, not a raw Markdown dump inside <pre>, and no malformed ul > p or ol > p nodes, no direct nested lists, and no strong/b tags inside code.
# Browser smoke: open the local/static /shachi/ route and verify menu, tutorial, gameplay start, 3D roof render, Rotate Roof, stage drag, Row −/+, Lift Tile, Seal Crack, Slide Gutter, Brace Ridge, Sweep Leaves, Ring Rain Chain, Moon Glaze, Shachi Focus, leak/storm/gutter/ridge/commission feedback, pause, restart, prompt page, WebAudio after user gesture, no console errors.
# Mobile smoke: repeat at a portrait phone viewport such as 390x844 and verify playable roof/action controls plus readable HUD/commission card/stage/controls.
# Static screenshot check: inspect release/games/046/screenshot.png and release/shachi/screenshot.png for non-empty readable game content; use vision to judge actual visual quality.
# Image QA: inspect every Imagegen2 source/optimized asset and document the actual inspection result in ai/postmortems/day-046.md.
# Docker/static smoke: build the Docker image locally, run it, curl /shachi/ and /shachi/prompt.html, then stop the container.
# Immutable guard: confirm no release/games folders from origin/main changed except new Day 046.
```
