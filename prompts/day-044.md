# Day 044 Game Generation Prompt

## Game identity

- Day: 044
- Title: Kakigori Prism Shavewright
- Slug: kakigori-prism-shavewright
- Public route word: kakigori
- Mode: 3D
- Genre: mobile-first 3D dessert sculpting arcade / syrup-channel routing / melt-pressure score chase
- Mood/style: a bright summer matsuri dessert stall at late afternoon, translucent shaved-ice mountain on a lacquer tray, rainbow syrup ribbons, glassy ice facets, brass hand-crank shaver, tiny tanuki vendor helper, paper festival flags, cool mist and syrup sparkle; a tactile 3D sculpting/routing game rather than karuta card scanning, cedar trunk climbing, mycelium routing, kintsugi repair, tatami room planning, griddle cooking, goldfish scooping, gear engineering, bridge building, thread wrapping, fan dyeing, onsen valves, ikebana, orchard harvesting, kumiko woodworking, shrine stealth, tea foam, fireworks, pachinko, mochi hopping, calligraphy tracing, kite mapping, sand raking, underwater pearl routing, taiko rhythm routing, daruma maze tilting, web weaving, pottery shaping, bamboo canal routing, origami folding, parasol sheltering, snow lantern stacking, kimono stamping, bento service, windbell tuning, rail running, or koi collection.

## Why this game today

The generated series currently ends with:

- Day 040 `3d`: Kohaku Kintsugi Star Mender, dark porcelain repair tray, gold lacquer seams, curved shards, clamps, sparrow helper.
- Day 041 `2d`: Kinoko Mycelium Glowkeeper, bioluminescent forest network, mushroom caps, nutrient pulses, beetles, kodama helper.
- Day 042 `3d`: Kabuto Cedar Canopy Climber, bright vertical cedar trunk, orbiting beetle, sap beads, branch leaps, canopy bell.
- Day 043 `2d`: Karuta Mooncall Duelist, dark indigo card table, reader cue, cream cards, rival hand, card-sweep timing.

The latest generated-mode streak is one `2d` (Day 043), so Day 044 deliberately returns to real `3d` to maintain the strong alternating cadence. It should be meaningfully spatial: the player rotates a translucent shaved-ice mound, carves terraces into its 3D surface, routes colored syrup down grooves, places toppings at height/depth targets, and fights melting over time. The game must not be a flat 2D dessert board with perspective decoration; height, mound angle, groove depth, syrup flow, melt rate, spoon tilt, and topping placement must matter mechanically.

Recent visual variety notes from screenshots:

- Day 043 uses a dark horizontal card-table composition with cream cards, indigo cloth, rival hand lane, warm gold labels, and many bottom controls.
- Day 042 uses a bright vertical blue-sky field with a central brown cedar trunk, beetle/climb controls, and chunky cream/gold UI.
- Day 041 uses a dark green glowing organic network board with mushroom nodes and route pulses.
- Day 040 uses a dark amber/purple repair bench with porcelain shards and gold seams.

Day 044 should contrast with a cool translucent dessert sculpture and a sunlit festival-stall palette: crushed ice whites, cyan shadows, strawberry red, matcha green, mikan orange, ramune blue, condensed milk ivory, lacquer black tray, and brass crank details. Avoid card spreads, reader panels, rival hands, vertical trunks, beetles, sap beads, branch ledges, glowing mycelium networks, mushroom caps, porcelain shards, gold crack seams, tatami rectangles, griddles/cakes/smoke, fish tanks/nets, gears/couplers, bridge trusses, thread spheres, pigment fan sectors, onsen ducts, floral stems, fruit baskets, kumiko lattice strips, stealth cones, tea foam bowls, firework arcs, pachinko pegs, mochi platforms, brush strokes, kite strings, sand rake lines, pearls, taiko pads, maze boards, web strands, pottery profiles, bamboo canal tiles, origami creases, parasols, snow blocks/lanterns, kimono panels, conveyor bento, windbell notes, rail tracks, or koi ponds.

## Code isolation / no previous game source

The implementation must be written from scratch for this day. Do not open, inspect, copy, diff, grep, or adapt code from previous games, including old `apps/day-*` folders, old `release/games/NNN/` HTML/CSS/JS files, or old public alias folders. You may inspect previous metadata, prompts, postmortems, and screenshots only to avoid repeating concepts and visual identity. The new game's HTML/CSS/JS must come from this prompt and general browser/Three.js/WebGL/WebAudio game knowledge, not from earlier game implementations.

## Mode variety / 3D cadence

Inspection target: `src/data/games.ts` currently ends with Day 040 `3d`, Day 041 `2d`, Day 042 `3d`, and Day 043 `2d`. The latest generated-mode streak is one `2d`.

Mode decision: Day 044 is real `3d`. It must implement meaningful spatial gameplay, not decorative perspective:

- Use Three.js/WebGL or equivalent static-browser 3D rendering.
- Render a real 3D kakigori mound/cone/tray scene with camera depth, visible mound rotation, sculpted terraces, grooves at different heights, syrup streams that travel down the mound surface, topping targets on near/mid/far faces, drip paths, melt puddles, and a dessert stall background.
- Gameplay must depend on 3D state: mound yaw, spoon angle, shave height, groove depth, syrup color/viscosity, gravity direction on the rotated surface, topping height bands, melt percentage, tray puddle position, cold mist reserves, customer order target map, and camera-relative controls.
- Player actions must manipulate the 3D system: rotate the bowl, shave ice, carve channels, pour colored syrup, tilt spoon, place toppings, freeze mist, drain puddle, use Prism Focus to preview routes/orders/melt risk, pause/restart, and inspect tutorial hints.
- Portrait mobile is the default supported layout; no landscape gate.

## Design

- Objective: Sculpt a translucent kakigori mound, carve syrup channels, pour requested flavors in the right height bands, place toppings cleanly, and serve three festival dessert orders before the ice melts into the tray.
- Win condition: Complete three dessert orders — First Strawberry Snow, Mikan Prism Steps, and Grand Matsuri Rainbow — while reaching 5800 points to trigger “Kakigori Prism Service”. After the banner, continue into endless summer-stall orders.
- Lose condition: Three chill hearts melt, total melt reaches 100%, syrup muddiness exceeds 70%, five toppings slide off the mound, the tray puddle overflows twice in one order, or the Grand Matsuri order receives the wrong syrup route twice.
- Core loop:
  1. Start on a title/menu screen with Day 044 badge, mode badge “3D”, public route `/kakigori/`, best score, best Prism Service time, tutorial, prompt link, audio note, and a large Start button.
  2. Show a portrait-friendly 3D stall stage. The lower center contains a lacquer tray and translucent shaved-ice mound. The camera is slightly above/front, with rotation controls so the player can see near/mid/far faces.
  3. An order card requests targets such as: “Carve two mid-height grooves, route strawberry down left ridge, ramune down front ribbon, place azuki on the crown, keep melt below 45%, drain one blue puddle.”
  4. Player rotates the bowl left/right. The mound visibly turns; syrup, toppings, and carved grooves maintain their 3D positions, so hidden back-face problems can rotate into view.
  5. Shave Ice adds fluffy volume to the selected height band and restores a little chill, but overshaving buries existing grooves and can blur flavor boundaries.
  6. Carve Channel cuts a shallow or deep groove along the selected lane. Deep grooves hold syrup better but weaken the mound and increase local melt.
  7. Pour Syrup cycles or selects strawberry, matcha, mikan, and ramune. Syrup flows downhill along current grooves, stains ice facets, can split at forks, and can muddle if two colors collide outside requested blend zones.
  8. Tilt Spoon nudges a syrup stream or loose topping sideways on the 3D surface. It is strongest before syrup reaches a puddle lip.
  9. Place Topping drops azuki, shiratama, mikan wedge, or festival sprinkle onto the selected target band. Toppings stick on cold flat terraces and slide on hot steep faces.
  10. Freeze Mist spends chill charge to slow melting, lock one topping, and crystallize a syrup route temporarily. Overusing it fogs the view and reduces combo reward.
  11. Drain Puddle clears one tray puddle lane before overflow and earns a save bonus if used during a blue warning pulse.
  12. Prism Focus, charged by clean routes, correct toppings, and low muddiness, overlays downhill syrup paths, valid groove depths, target height bands, melt hotspots, slide risk, order completion ticks, and the safest next action.
  13. Completing an order stamps a dessert ticket, restores one chill heart if below max, awards points, changes mound geometry and constraints, and unlocks sharper slopes, two-color blends, faster melt, moving spoon shadows, fragile toppings, and hidden back-face target bands.
  14. Pause/restart remain visible throughout.
- 15+ minute play-value strategy:
  - Save best score, fastest Kakigori Prism Service time, lowest final melt, cleanest syrup purity, longest no-slide topping streak, most puddle saves, highest endless dessert order, fewest wrong pours, highest Prism Focus efficiency, and collected dessert ticket badges in localStorage.
  - Include three authored dessert orders:
    - First Strawberry Snow: short mound, broad front groove, one strawberry route, one azuki topping, guided first Rotate Bowl, Shave Ice, Carve Channel, and Pour Syrup. No chill-heart penalty for the first tutorial muddle.
    - Mikan Prism Steps: taller mound with two height bands, mikan and ramune routes, one back-face topping target, first Drain Puddle warning, and required Tilt Spoon correction.
    - Grand Matsuri Rainbow: full 3D mound with three syrup colors, one intentional blend zone, fragile shiratama topping, required Prism Focus preview, melt target below 50%, and final crown topping.
  - Deterministic Day 044 seed varies mound ridge shape, target band positions, syrup viscosity, gravity flow speed, groove strength, melt hotspots, topping slide risk, puddle lanes, freeze mist duration, order sequence, Prism Focus charge, and endless constraints while keeping opening seconds fair.
  - Mastery badges: complete First Strawberry Snow with zero muddle, trigger Prism Service under 285 seconds, finish Mikan Prism with no topping slides, clear Grand Matsuri with melt below 35%, route three syrup colors without collision, save three puddles during warning pulses, and win one order without Prism Focus.
  - Strategic scoring rewards spatial planning: rotate before carving hidden faces, shave only when volume is needed, carve deeper where syrup must turn, tilt spoon before a stream reaches an edge, place toppings on flat frozen terraces, drain puddles during warning pulses, and save Prism Focus for multi-color routes.
  - Endless mode after Prism Service adds taller asymmetrical mounds, extra syrup flavors, hidden target bands, steeper slopes, shorter chill timers, trickier blend zones, fragile toppings, and bonus customer tickets without shrinking touch targets.
- Difficulty scaling:
  - 0-45 seconds: short mound, slow melt, broad groove tolerances, one syrup, visible target ring, forgiving topping stickiness.
  - 45-150 seconds: two syrups, first back-face target, puddle warning, Tilt Spoon and Drain Puddle matter.
  - 150-285 seconds: three syrups, required Prism Focus, fragile toppings, blend zone, local melt hotspots, final crown placement.
  - 285+ seconds/endless: more asymmetric ridges, hidden bands, faster melting, same readable controls.
  - Keep mobile fair: mound, target bands, syrup streams, toppings, melt/puddle warnings, order card, helper, and action buttons must be readable at 390x844; primary touch buttons should be 52px+ where possible and never below 44px; no tiny survival-critical topping targets.
- Scoring/rewards:
  - Correct height-band shave or groove: +140 points times combo tier.
  - Syrup reaches requested target route cleanly: +270 points and Prism Focus charge.
  - Correct two-color blend inside a requested blend zone: +430 points.
  - Topping placed on a stable cold terrace: +260 points.
  - Tilt Spoon saves a stream before puddle/muddle: +190 points.
  - Drain Puddle during warning: +210 points and combo protect.
  - Freeze Mist locks a topping or route without excess fog: +230 points.
  - Complete order before melt warning: +1020 points and restore one chill heart if below max.
  - Perfect no-muddle order: +1500 points.
  - Kakigori Prism Service: +3400 points and endless orders unlock.
  - Wrong syrup, muddy collision, overshave, topping slide, or puddle overflow: combo reset and melt/chill penalty.

## Controls and layout

- Desktop:
  - Mouse/tap on the 3D mound: select a height band, groove lane, topping target, or explainable stage chip.
  - Mouse drag on the stage: rotate the bowl horizontally and scrub selected height vertically with a visible spoon cursor offset.
  - Arrow keys or WASD: Rotate Bowl left/right and select height band up/down.
  - Space or Enter: Carve Channel.
  - S: Shave Ice.
  - P or Y: Pour Syrup.
  - T: Tilt Spoon.
  - O: Place Topping.
  - M: Freeze Mist.
  - D: Drain Puddle.
  - Shift or F: Prism Focus when charged.
  - Escape or P with overlay context: pause/resume.
  - R: restart current run.
- Mobile/touch:
  - Drag horizontally on the stage to rotate the bowl. Drag vertically to choose height band; the spoon cursor stays above the finger so grooves and syrup remain visible.
  - Tap visible target bands/toppings to select them, then use large action buttons.
  - Use large Band −, Band +, Rotate Left, Rotate Right, Shave Ice, Carve Channel, Pour Syrup, Tilt Spoon, Place Topping, Freeze Mist, Drain Puddle, Prism Focus, Pause, Restart, Audio, and Prompt buttons.
  - Tapping melt/syrup/puddle/focus/order chips may show short explanations.
  - No tiny virtual joystick. Interaction is direct mound drag/tap plus labeled dessert/action controls.
- Mobile layout/orientation:
  - Default target is portrait phone play around 390x844; do not require landscape.
  - Top: compact Kakigori HUD with score, best, chill hearts, melt %, syrup purity, combo, selected band, active syrup, puddle risk, Prism Focus charge, and elapsed time. Use ice/syrup/spoon/topping/mist/puddle/ticket chips, not card/moon/hand/beetle/trunk/sap/root/mushroom/shard/tatami/cake/fish/gear/bridge/thread/fan-dye/valve/flower/fruit/lattice/shrine/tea-foam/firework/rabbit/brush/kite/sand/pearl/drum icons.
  - Below top: dessert order card with requested syrup routes, target height bands, topping count, melt target, puddle warning, progress ticks, and current customer note.
  - Center: tall 3D kakigori stage with mound, tray, grooves, syrup streams, toppings, target rings, melt drips, puddle lanes, helper art, and readable feedback. It must remain playable without zooming.
  - Bottom: status helper plus large dessert/action controls. Controls must not cover mound, syrup streams, target rings, helper, order card, puddle warnings, or Prism Focus overlays.
  - Tutorial must fit on the first portrait screen; optional details may be collapsible but objective, rotate/select band, Shave Ice, Carve Channel, Pour Syrup, Tilt Spoon, Place Topping, Freeze Mist, Drain Puddle, Prism Focus, pause/restart must be visible.
  - Requests must combine text, icons, height rings, syrup patterns, target ticks, topping silhouettes, and labels so hue alone is not required.

## Menu and tutorial

Implement these states:

1. Title screen
   - Shows title “Kakigori Prism Shavewright”.
   - Shows Day 044 badge, mode badge “3D”, public route `/kakigori/`, best score, best Prism Service time if available, and a prompt link.
   - Shows a large Start button and visible tutorial panel by default.
   - Notes: “Audio starts after you press Start; visual syrup, melt, topping, puddle, order, and focus cues work if muted.”
2. Tutorial text
   - Objective: “Sculpt the ice, route syrup down carved channels, place toppings, and serve before the kakigori melts.”
   - 3D movement: rotate the bowl and select height bands; hidden faces matter.
   - Channels: Shave Ice to build volume, Carve Channel to guide syrup, Pour Syrup only when the path is ready.
   - Corrections: Tilt Spoon redirects a stream, Freeze Mist locks a route or topping, Drain Puddle saves the tray.
   - Prism Focus: previews syrup paths, target bands, melt hotspots, topping slide risk, and order completion.
   - Pause/restart: visible buttons on mobile or keyboard shortcuts on desktop.
3. In-game HUD
   - Score, best score, chill hearts, melt %, syrup purity, order name, combo, selected band, active syrup, puddle risk, Prism Focus charge, elapsed time, latest warning.
   - Pause/restart controls visible or immediately accessible.
4. Status helper
   - Non-blocking helper showing selected band, active route, syrup risk, topping stability, melt warning, puddle warning, Prism Focus readiness, and expected score effect.
   - Must not cover the 3D mound or bottom controls on mobile.
5. Pause overlay
   - Resume, restart, tutorial reminder, controls summary, audio/mute toggle, prompt link.
6. Game-over/results overlay
   - Final score, best score, order reached, Prism Service status, melt %, syrup purity, topping slides, puddle saves, badges, restart button.
7. Kakigori Prism Service banner
   - Trigger once per run after all three dessert orders and 5800 score.
   - Non-blocking celebration: syrup ribbons glow into a rainbow prism, ice facets sparkle, the tanuki vendor stamps a dessert ticket, festival flags flutter, and endless orders continue after the banner fades.

## Assets

Prefer Imagegen2 (`openai/gpt-image-2`) for final visual art: tanuki kakigori vendor helper mascot, portrait matsuri dessert stall background, ice/syrup/topping/tray material sprite sheet, and kakigori tool/UI icon sheet. Three.js primitives may render the interactive mound geometry, grooves, syrup flows, topping markers, target rings, melt drips, puddle overlays, particles, and UI chrome. It should not create final character/background/texture/icon art from scratch unless Imagegen2 is unavailable after a real attempt.

Archive source generated art under `release/games/044/assets/source/` and use optimized playable copies under `release/games/044/assets/`. Also copy optimized playable assets into `apps/day-044-kakigori-prism-shavewright/assets/` and the public alias `release/kakigori/assets/`.

For mobile-first crop safety: keep important content centered, leave 12-16% safe margins, avoid baked-in readable text, avoid watermarks, avoid fake UI labels, avoid tiny dessert details that disappear at final in-game size, and keep tanuki/ice/syrup/toppings/tray/mist/puddle/focus silhouettes distinct against sunlit stall backgrounds.

Generate or provide at least these final art assets:

1. Tanuki kakigori vendor helper mascot
   - Target: transparent PNG if possible, square source, final optimized texture around 512x512 or 256x256.
   - Archive path: `release/games/044/assets/source/kakigori-helper-source.png`
   - Optimized path: `release/games/044/assets/kakigori-helper.png`
   - Imagegen2 prompt: “A charming tiny tanuki kakigori vendor mascot for a mobile 3D Japanese shaved-ice dessert sculpting arcade game, small friendly tanuki wearing a blue summer happi coat and headband, holding a tiny brass ice shaver crank and syrup ladle, bright helpful eyes, cool cyan rim light and warm festival lantern accents, centered readable silhouette, transparent or solid pale parchment background, no checkerboard background, no readable text, no watermark, sprite-friendly, high contrast at small size.”
   - Aspect ratio: square.
2. Summer matsuri kakigori stall background source
   - Target: portrait-friendly background suitable behind a large 3D shaved-ice mound with open readable center.
   - Archive path: `release/games/044/assets/source/kakigori-stall-source.png`
   - Optimized path: `release/games/044/assets/kakigori-stall.png`
   - Imagegen2 prompt: “A bright summer Japanese matsuri kakigori dessert stall for a portrait mobile 3D arcade game, lacquer counter, brass hand-crank ice shaver at the side, colorful syrup bottles near the edges, paper festival flags and soft lanterns, cool mist and sunlight, open readable central space for an overlaid translucent shaved-ice mound, crop-safe for phone portrait, no central character, no readable text, no watermark.”
   - Aspect ratio: portrait.
3. Ice, syrup, topping, and tray material sprite sheet source
   - Target: square sheet with separated readable materials that can be used as sprites/decals/textures.
   - Archive path: `release/games/044/assets/source/kakigori-pieces-source.png`
   - Optimized path: `release/games/044/assets/kakigori-pieces.png`
   - Imagegen2 prompt: “Sprite sheet of small readable kakigori dessert game pieces: translucent shaved ice crystal patch, strawberry red syrup ribbon, matcha green syrup ribbon, mikan orange syrup ribbon, ramune blue syrup ribbon, condensed milk drizzle, azuki bean topping, shiratama mochi topping, mikan wedge, festival sprinkle, blue melt puddle, lacquer tray corner, prism sparkle, each element separated with generous margins, transparent or pale parchment background, no checkerboard background, no readable text, no watermark, readable at 40-96 pixels.”
   - Aspect ratio: square.
4. Kakigori tool, syrup, topping, melt, and focus UI icon sheet source
   - Target: square icon sheet for objectives, hazards, tools, rewards, and UI decals.
   - Archive path: `release/games/044/assets/source/kakigori-icons-source.png`
   - Optimized path: `release/games/044/assets/kakigori-icons.png`
   - Imagegen2 prompt: “Small readable icon sheet for a Japanese kakigori shaved-ice sculpting arcade game: ice mound, shave ice crank, carve spoon channel, syrup ladle, tilt spoon, azuki topping, shiratama topping, freeze mist snowflake, drain puddle, melt warning drop, syrup purity prism, chill heart, dessert ticket, Prism Focus rainbow snowflake emblem, Grand Matsuri Rainbow crest, transparent or solid pale parchment background, no checkerboard background, high contrast, no readable text, no watermark, generous margins so no icons are cut off.”
   - Aspect ratio: square.

If Imagegen2 is unavailable or fails after a real attempt, create a clearly labeled emergency fallback using simple SVG/Three.js tanuki/ice/syrup/topping/tray/icon silhouettes, document the failure in `ai/postmortems/day-044.md`, and still keep source/fallback files under the same asset paths.

### Mandatory generated-image QA

For every generated image, include a real inspection step after generation and before integration:

- Analyze the actual generated file visually, not just the prompt text.
- For the tanuki helper mascot, verify transparent/cutout quality or clean background handling, readable friendly silhouette, centered pivot/crop margins, no unwanted text/watermarks, stable upright orientation, and that crank/ladle pose is compatible with static helper placement.
- For the pieces sheet, verify separated ice crystal, strawberry/matcha/mikan/ramune syrup ribbons, condensed milk, azuki, shiratama, mikan wedge, sprinkles, puddle, tray, and prism sparkle at final 40-96px size, usable crop margins, no baked checkerboard, no unwanted readable text/watermark, and a documented visual baseline: syrup flows downward along grooves; toppings sit upright; puddles stay on tray lanes.
- Verify control-to-motion alignment in-game: Rotate Bowl must visibly turn the mound, Shave Ice must add visible ice volume, Carve Channel must cut/show grooves, Pour Syrup must animate colored flow along the selected path, Tilt Spoon must redirect a stream/topping, Place Topping must drop/stick/slide visibly, Freeze Mist must slow/lock/frost, Drain Puddle must clear a tray lane, Prism Focus must preview paths/targets/melt, Pause/Restart must work.
- For the background, verify the central mound remains readable after portrait mobile crop and does not hide syrup streams, target rings, order card, helper, melt/puddle warnings, or controls.
- For the icon sheet, verify ice mound, shaver, carve spoon, syrup ladle, tilt spoon, toppings, freeze mist, drain puddle, melt warning, purity prism, chill heart, ticket, Prism Focus, and Grand Matsuri crest are distinct at final HUD/button size and cannot be confused. Watch specifically for fake checkerboard transparency; alpha-clean or composite onto pale parchment if needed and inspect again.
- If inspection finds a problem, regenerate or post-process the image and inspect again. Do not ship broken visual assets just because tests pass.

## Audio and game feel

Because ice shaving, syrup pouring, toppings sliding, cold mist, puddles, and festival service are central to the theme, include lightweight WebAudio cues initialized only after a user gesture:

- Soft crank scrape when Shave Ice adds volume.
- Crisp ice-chip tick when Carve Channel cuts a groove.
- Liquid glissando when Pour Syrup flows.
- Tiny spoon clink when Tilt Spoon redirects a stream.
- Mochi/pop plop when Place Topping lands.
- Frosty hush when Freeze Mist activates.
- Tray slurp when Drain Puddle saves a lane.
- Warm warning knock when melt/puddle risk rises.
- Bright prism shimmer when Prism Focus activates.
- Festival bell-and-ice-sparkle flourish when Kakigori Prism Service triggers.

Audio must not block play if WebAudio is unavailable. Verify no autoplay errors: audio context should be created/resumed only after Start or another user interaction. Include a visible mute toggle in pause/results or HUD. Expose a narrow debug handle such as `window.__day044Audio = { ctx, enabled }` after user-gesture initialization so Playwright can assert audio state.

## Prompt page output

The archived `release/games/044/prompt.html` must be a consistent rendered HTML page, not raw Markdown pasted into a `<pre>` block. It should include:

- A clear `<title>` and `<h1>` using `Day 044 Game Generation Prompt`.
- A back-to-game link near the top.
- Semantic rendered sections (`h2`, `h3`, `ul/ol/li`, `p`, `pre/code` only for actual code/commands).
- The same readable prompt-page style pattern across days so prompt pages feel like one system.

## Subagents to dispatch

1. Implementation subagent
   - Build the static 3D game under `apps/day-044-kakigori-prism-shavewright/`.
   - Integrate it into immutable release output under `release/games/044/`.
   - Create the public playable route under `release/kakigori/`.
   - Use static HTML/CSS/JS with Three.js/WebGL/WebAudio and no backend.
   - The public alias must be self-contained or asset paths must be alias-safe.
   - If vendoring `three.module*.js`, also copy the matching `three.core*.js` beside it in the app, release archive, and `/kakigori/` alias assets.
2. Asset/polish subagent
   - Generate/prepare Imagegen2 assets, archive source files, optimize playable copies, inspect generated images, remove fake checkerboards if present, document syrup-flow/topping/puddle visual baselines, and tune mobile readability/game feel.
3. QA/browser/mobile subagent
   - Run desktop and mobile smoke checks, verify no console errors, verify menu/tutorial/objective/controls/restart/pause, prompt links, 3D kakigori mound render, Rotate Bowl, direct stage drag, Band −/+, Shave Ice, Carve Channel, Pour Syrup, Tilt Spoon, Place Topping, Freeze Mist, Drain Puddle, Prism Focus control presence and visible mechanical effect, melt/syrup/puddle/topping/order feedback, generated screenshot, generated assets, WebAudio initialization after user gesture, and 390x844 portrait layout.
4. Reflection/self-improvement subagent
   - Write `ai/postmortems/day-044.md` after validation with what worked, what failed, generated-image inspection notes, syrup-flow/topping/puddle visual baseline, audio verification, code-isolation confirmation, and whether generator/template/rubric improvements are justified.

## Acceptance criteria

- Static build passes.
- Code isolation is documented in QA/postmortem: no previous game implementation code was opened, inspected, copied, diffed, grepped, or adapted.
- Mode choice follows the cadence rule: Day 044 is real `3d` after Day 043 `2d`, with meaningful mound rotation, height bands, syrup flow, grooves, toppings, melt, and puddle mechanics rather than decorative perspective.
- Desktop smoke passes.
- Mobile portrait smoke passes at about 390x844 with readable HUD/tutorial/order card, usable 44px+ dessert/action/pause/restart controls, no forced landscape canvas, and no tiny survival-critical topping targets.
- Prompt is visible from gallery and release folder.
- `prompts/day-044.md` is copied exactly to `release/games/044/prompt.md` and `release/kakigori/prompt.md`.
- `release/games/044/prompt.html` and `release/kakigori/prompt.html` render the prompt in browser-readable semantic HTML with the standard prompt-page styling, not a raw Markdown `<pre>` dump.
- Public alias `release/kakigori/index.html`, `release/kakigori/prompt.html`, `release/kakigori/screenshot.png`, and `release/kakigori/assets/` exist and work.
- Gallery card for Day 044 shows prompt availability, generation duration, public `/kakigori/` links, mode `3d`, and actual generated date.
- Screenshot exists at `release/games/044/screenshot.png` and is non-empty/readable. Prefer a readable desktop gameplay screenshot for gallery cards; mobile screenshots are QA evidence unless the design is intentionally portrait-card friendly.
- Image/source assets exist under `release/games/044/assets/source/` and optimized assets exist under `release/games/044/assets/`, or a documented emergency fallback exists.
- Every generated image has an inspection note in the postmortem or QA notes; interactive mound/syrup/groove/topping/melt/puddle visuals have verified background handling, orientation/pivot/crop, readability, and control-to-motion alignment.
- WebAudio initializes after user gesture and creates no autoplay console errors; audio is failsafe if unsupported and visual syrup/melt/topping/puddle/order cues remain playable muted.
- No console errors during desktop or mobile smoke. Add data-URI favicons to game and prompt pages if needed to avoid favicon request noise.
- Existing `release/games/001/**` through `release/games/043/**` from origin/main remain unchanged.
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
# Screenshot/static checks: verify release/games/044/screenshot.png, prompt.md, prompt.html, index.html, game.js, styles.css, release/kakigori/index.html, release/kakigori/prompt.html, release/kakigori/screenshot.png, optimized assets, source assets, and vendored Three.js files (if used) exist and are non-empty.
# Prompt copy check: cmp prompts/day-044.md release/games/044/prompt.md and cmp prompts/day-044.md release/kakigori/prompt.md.
# Prompt HTML check: verify release/games/044/prompt.html has semantic h1/h2/list markup and a back-to-game link, not a raw Markdown dump inside <pre>, and no malformed ul > p or ol > p nodes, no direct nested lists, and no strong/b tags inside code.
# Browser smoke: open the local/static /kakigori/ route and verify menu, tutorial, gameplay start, 3D mound render, Rotate Bowl, stage drag, Band −/+, Shave Ice, Carve Channel, Pour Syrup, Tilt Spoon, Place Topping, Freeze Mist, Drain Puddle, Prism Focus, melt/syrup/puddle/topping/order feedback, pause, restart, prompt page, WebAudio after user gesture, no console errors.
# Mobile smoke: repeat at a portrait phone viewport such as 390x844 and verify playable dessert/action controls plus readable HUD/order card/stage/controls.
# Static screenshot check: inspect release/games/044/screenshot.png and release/kakigori/screenshot.png for non-empty readable game content; use vision to judge actual visual quality.
# Image QA: inspect every Imagegen2 source/optimized asset and document the actual inspection result in ai/postmortems/day-044.md.
# Docker/static smoke: build the Docker image locally, run it, curl /kakigori/ and /kakigori/prompt.html, then stop the container.
# Immutable guard: confirm no release/games folders from origin/main changed except new Day 044.
```
