# Day 051 Game Generation Prompt

## Game identity

- Day: 051
- Title: Matoi Ember Alley Brigade
- Slug: matoi-ember-alley-brigade
- Public route word: matoi
- Mode: hybrid
- Genre: mobile-first isometric fire-brigade strategy arcade / hose-pressure routing / rescue score chase
- Mood/style: an Edo-period night alley after a festival spark jumps roofs: indigo smoke, vermilion firewatch towers, wet stone lanes, cedar townhouses, paper lantern reflections, hand-pumped wooden water carts, braided hoses, matoi fire-brigade standards, glowing ember sprites, rescue cats, and steam plumes. It should feel like urgent cooperative fire control and alley routing, not ritual dancing, mounted archery, glass cutting, dragonfly flight, roof repair, kendama juggling, dessert sculpting, card scanning, cedar climbing, mycelium routing, kintsugi repair, tatami layout, griddle cooking, fish scooping, gear trains, bridge building, embroidery spheres, fan dyeing, onsen valves, ikebana, fruit picking, stealth escorting, tea foam, fireworks launching, pachinko, mochi hopping, calligraphy, kite mapping, dry-garden raking, pearl diving, taiko rhythm routing, daruma rolling, web weaving, pottery, bamboo canals, origami folds, parasols, snow blocks, kimono stamping, bento service, windbell tuning, rail running, or koi collecting.

## Why this game today

The generated series currently ends with:

- Day 046 `3d`: Shachi Roofline Rainwright, blue-hour temple roof repair and rain routing.
- Day 047 `2d`: Tombo Dewline Glider, green-gold rice-paddy dragonfly dewline flight.
- Day 048 `3d`: Kiriko Lantern Prism Cutter, dark ruby/cobalt glass cutting with caustic targets.
- Day 049 `2d`: Yabusame Willow Target Archer, warm dusk mounted archery with target order and wind.
- Day 050 `3d`: Kagura Mask Star Dancer, indigo shrine-stage rhythm/pose matching with masks, gohei, and beat rings.

The latest generated-mode streak is one `3d` (Day 050). Day 051 chooses a meaningful `hybrid`: a readable 2.5D/isometric alley board rendered with depth layers, parallax smoke, tile elevation, and spatial hose arcs, while keeping direct 2D touch controls and DOM/HUD clarity. The hybrid gameplay must matter mechanically: water source height, hose kinks, pump pressure, bucket-chain tile depth, wind-driven embers, ladder reach, smoke lines, and rescue paths influence outcomes. It must not be a decorative flat grid; the player should visibly route water and people through an alley with depth cues and pressure physics.

Visual contrast notes from recent screenshots:

- Day 050 uses a dark centered 3D stage, brown tiles, spotlight cones, a dancer billboard, star marks, and right-side ritual controls.
- Day 049 uses a warm wide archery course with large circular targets, horse/rider, bow arcs, willow and river scenery.
- Day 048 uses a dark jewel-toned craft bench with a central glass object, caustics, blue/red facets, and compact controls.

Day 051 should switch to civic emergency action: diagonal wet alley lanes, orange ember clusters against blue-black rain-smoke, hand pumps and braided hoses, water spray arcs, bucket lines, rescue markers, and matoi standards. Avoid stage grids, dancers, masks, gohei, beat rings, targets, horses, arrows, glass cups/facets, dragonflies, dew beads, roof tiles as the main repair object, kendama cups/balls, shaved ice, cards, tree trunks, mushrooms, ceramic shards, tatami rectangles, griddles, fish tanks, gears, bridges, thread or web systems, fan dye sectors, valves as an onsen duct puzzle, flowers, fruits, stealth cones, tea bowls, firework launch tubes, pachinko pegs, mochi pads, brush strokes, kites, rake lines, pearls, drums as primary inputs, rolling mazes, pottery wheels, bamboo canal tiles, origami creases, parasol shields, snow blocks, kimono cloth, bento trays, windbells, train rails, and koi ponds.

## Code isolation / no previous game source

The implementation must be written from scratch for this day. Do not open, inspect, copy, diff, grep, or adapt code from previous games, including old `apps/day-*` folders, old `release/games/NNN/` HTML/CSS/JS files, or old public alias folders. You may inspect previous metadata, prompts, postmortems, and screenshots only to avoid repeating concepts and visual identity. The new game's HTML/CSS/JS must come from this prompt and general browser/Canvas/SVG/WebAudio game knowledge, not from earlier game implementations.

## Mode variety / 3D cadence

Inspection target: `src/data/games.ts` currently ends with Day 046 `3d`, Day 047 `2d`, Day 048 `3d`, Day 049 `2d`, and Day 050 `3d`. The latest generated-mode streak is one `3d`.

Mode decision: Day 051 is a real `hybrid`:

- Use static-browser HTML/CSS/JS with Canvas/SVG/DOM/WebAudio and optional lightweight WebGL/2.5D transforms; no backend.
- Render an isometric Edo alley board with near/mid/far depth lanes, building elevations, smoke layers, fire-front height, pump carts, braided hose arcs, bucket carriers, ladders, and rescue markers.
- Gameplay must depend on hybrid spatial state: alley tile depth, pump source distance, hose bend/kink count, pressure loss over elevation, wind direction, ember spread, smoke density, ladder reach, rescue path clearance, water-spray angle, and matoi morale radius.
- Player actions must manipulate the system: Move Brigade, Rotate Hose, Pump Water, Bucket Chain, Raise Ladder, Rescue Cat, Stamp Firebreak, Swing Matoi, Mist Screen, Ember Focus, pause/restart, audio toggle, and prompt link.
- Portrait mobile is the default supported layout; no landscape gate.

## Design

- Objective: Command a compact Edo fire brigade to contain ember fronts, route pressure through hoses and bucket chains, rescue alley cats and lantern keepers, and protect three neighborhood blocks before the wind carries sparks to the shrine gate.
- Win condition: Complete three authored incidents — First Pump Cart, Lantern Row Rescue, and Shrine Gate Firebreak — while reaching 6500 points to trigger “Matoi Dawn All-Clear”. After the banner, continue into endless ember patrols.
- Lose condition: Three brigade-heart lives are lost, water pressure reaches 0% during an active fire, morale reaches 0%, smoke reaches 100%, shrine-gate risk reaches 100%, six rescue markers are missed, or two protected houses collapse in the final incident.
- Core loop:
  1. Start on a title/menu screen with Day 051 badge, mode badge “hybrid”, public route `/matoi/`, best score, best Dawn All-Clear time, tutorial, prompt link, audio note, and a large Start button.
  2. Show a portrait-friendly isometric alley board. The brigade leader stands near a wooden hand-pump cart. Fires appear as ember clusters on near/mid/far roof and lane tiles; wind arrows show spread direction.
  3. An incident card requests goals such as: “Route hose to mid-right brazier, pump twice, place firebreak on cedar stack, rescue cat at back-left, then swing Matoi to hold morale.”
  4. Move Brigade shifts the leader between adjacent alley tiles. Movement is blocked by heavy smoke unless Mist Screen or Bucket Chain has cleared a path.
  5. Rotate Hose changes the hose/nozzle direction and visible spray arc. Correct angle hits fires; kinks around corners lower pressure and force planning.
  6. Pump Water charges pressure and sends a visible water pulse along the hose. Pumping too fast can burst pressure/kink warnings; pumping too slowly lets embers spread.
  7. Bucket Chain creates a temporary line of helpers through clear tiles to carry water over one elevation step or around a kink. It is slower but reliable and very mobile-friendly.
  8. Raise Ladder reaches roof fires or rescue markers on elevated tiles; using it in the wrong lane wastes time and can block a hose path.
  9. Rescue Cat collects a rescue marker only when smoke is low enough and a path exists. Rescues restore morale and score but can expose the brigade if done before suppressing nearby embers.
  10. Stamp Firebreak places a wet clay/wood plank break on one tile edge to slow ember spread; it must visibly alter the next wind tick, not just a status message.
  11. Swing Matoi plants the brigade standard, expanding a morale circle, stabilizing bucket helpers, and slowing panic/smoke for a few seconds.
  12. Mist Screen spends pressure to clear smoke in a short cone and reveal hidden embers/rescues.
  13. Ember Focus, charged by efficient suppression, clean rescues, good hose angles, and morale saves, overlays predicted ember spread, pressure losses, kink risk, rescue path, ladder reach, safest firebreak edge, and best next action.
  14. Completing an incident stamps a paper firewatch seal, restores one brigade heart if below max, awards points, shifts scenery from alley to lantern row to shrine gate, and unlocks taller roofs, faster wind, oil-lantern flares, split hose routes, more rescues, stricter smoke, and bonus all-clear chains.
  15. Pause/restart remain visible throughout.
- 15+ minute play-value strategy:
  - Save best score, fastest Matoi Dawn All-Clear time, longest no-collapse streak, highest pressure-efficiency combo, most cats rescued, most perfect firebreaks, most roof fires suppressed, highest endless incident, best no-focus clear, lowest final smoke, and collected firewatch seal badges in localStorage.
  - Include three authored incidents:
    - First Pump Cart: one low alley fire, broad spray window, slow wind, guided Move Brigade, Rotate Hose, Pump Water, and Swing Matoi. No heart penalty for the first tutorial miss.
    - Lantern Row Rescue: two depth lanes, first cat rescue, first ladder roof marker, first bucket chain around a corner, first smoke cone, and one firebreak before a wind tick.
    - Shrine Gate Firebreak: five ember fronts, two elevation levels, required Ember Focus preview, one hidden rescue under smoke, two firebreak placements, shrine-gate risk below 55%, and no more than one protected-house collapse.
  - Deterministic Day 051 seed varies wind direction, fire source order, pump distance, hose kink severity, roof height, ladder reach, smoke opacity, rescue timing, morale drain, focus charge, incident length, and endless constraints while keeping opening seconds fair.
  - Mastery badges: complete First Pump Cart with zero spread ticks, trigger Dawn All-Clear under 285 seconds, rescue every Lantern Row cat, clear Shrine Gate Firebreak with smoke below 45%, suppress five fires with one pressure chain, place three perfect firebreaks, complete a roof incident without ladder mistakes, and clear one incident without Ember Focus.
  - Strategic scoring rewards planning: rotate hose before pumping, pump to the green pressure band, choose Bucket Chain for blocked corners, clear smoke before rescues, ladder only for elevated threats, stamp firebreaks ahead of wind, swing Matoi when morale drops, and save Ember Focus for wind turns or shrine-gate danger.
  - Endless mode after Dawn All-Clear adds oil flares, split alley paths, taller roofs, faster wind ticks, moving civilians, stronger smoke curtains, limited pump rest windows, bonus rescue seals, and higher combo multipliers without shrinking touch targets.
- Difficulty scaling:
  - 0-45 seconds: one fire, slow wind, high pressure reserve, broad hose angle, route hints, morale cannot drop below 55%.
  - 45-150 seconds: two depth lanes, first bucket chain, first rescue, first ladder reach, smoke cone, firebreak timing.
  - 150-285 seconds: required Ember Focus, hidden rescue, roof fire, split ember fronts, shrine risk below 55%.
  - 285+ seconds/endless: faster wind, taller roofs, oil flares, longer hose paths, stricter smoke/morale, same readable controls.
  - Keep mobile fair: board tiles, brigade leader, fires, spray arc, pressure pulse, wind arrows, smoke, rescue icons, ladders, firebreak edge, incident card, helper, focus/pressure/morale/smoke/shrine HUD, and action buttons must be readable at 390x844; primary touch buttons should be 52px+ where possible and never below 44px; no tiny survival-critical fire labels.
- Scoring/rewards:
  - Clean water hit on active ember: +310 points and Ember Focus charge.
  - Suppress fire before wind tick: +430 points and combo protect.
  - Efficient pressure chain with no kink: +260 points.
  - Bucket Chain delivery around a blocked route: +330 points.
  - Correct ladder roof suppression or rescue: +360 points.
  - Rescue Cat through a cleared route: +380 points and morale restore.
  - Perfect Firebreak that prevents spread: +420 points.
  - Swing Matoi when morale is in warning range: +260 points and helper-stability boost.
  - Complete incident before shrine warning: +1200 points and restore one brigade heart if below max.
  - Perfect no-collapse incident: +1750 points.
  - Matoi Dawn All-Clear: +4100 points and endless patrols unlock.
  - Wrong hose angle, pressure burst, missed rescue, late wind spread, smoke panic, bad ladder placement, or firebreak on the wrong edge: combo reset and pressure/morale/smoke/shrine penalty.

## Controls and layout

- Desktop:
  - Mouse click/tap on the board: select/explain tile, fire, wind arrow, smoke, rescue, hose kink, ladder reach, pressure chip, or incident target.
  - Mouse drag on the board: aim/rotate the hose nozzle with a pointer offset so the spray path stays visible.
  - Arrow keys or WASD: Move Brigade across alley tiles.
  - Q/E: Rotate Hose left/right.
  - Space or Enter: Pump Water.
  - B: Bucket Chain.
  - L: Raise Ladder.
  - C: Rescue Cat.
  - X: Stamp Firebreak.
  - M: Swing Matoi.
  - S: Mist Screen.
  - F: Ember Focus when charged.
  - P or Escape: pause/resume.
  - R: restart current run.
- Mobile/touch:
  - Tap tiles/fires/rescues/wind arrows to inspect, but primary movement/action uses large labeled controls so thumbs do not hide the fire line.
  - Drag on the board to aim the hose; visible spray preview stays above the finger.
  - Use large Move Brigade, Rotate Hose, Pump Water, Bucket Chain, Raise Ladder, Rescue Cat, Stamp Firebreak, Swing Matoi, Mist Screen, Ember Focus, Pause, Restart, Audio, and Prompt buttons. If Move Brigade is a cycling/nearest-control button, also provide compact directional arrows or tile tap-to-move with visible confirmation.
  - Tapping pressure/morale/smoke/shrine/focus/incident chips may show short explanations.
  - No tiny virtual joystick. Interaction is direct board inspection plus labeled brigade/action controls.
- Mobile layout/orientation:
  - Default target is portrait phone play around 390x844; do not require landscape.
  - Top: compact Matoi HUD with score, best, brigade hearts, pressure %, morale %, smoke %, shrine risk %, combo, active tile, wind, hose direction, Ember Focus charge, and elapsed time. Use pump/hose/bucket/ladder/cat/firebreak/matoi/smoke/ember/wind/water/seal chips, not dancer/mask/gohei/target/horse/arrow/glass/dew/roof-repair/rain-chain/kendama/dessert/card/beetle/mushroom/shard/tatami/cake/fish/gear/bridge/thread/fan/flower/fruit/tea/firework/koi icons.
  - Below top: incident card with ordered fires/rescues, pressure route, wind note, ladder or firebreak requirement, progress ticks, and current fire-captain note.
  - Center: large isometric alley board with brigade, pump cart, hoses, water arcs, ember fronts, wind arrows, smoke layers, rescue markers, ladders, helper art, and readable hit feedback. It must remain playable without zooming.
  - Bottom: status helper plus large brigade/action controls. Controls must not cover fires, water arcs, rescue markers, wind arrows, smoke warnings, incident card, helper, firebreak previews, or Ember Focus overlays.
  - Tutorial must fit on the first portrait screen; optional details may be collapsible but objective, Move Brigade, Rotate Hose, Pump Water, Bucket Chain, Raise Ladder, Rescue Cat, Stamp Firebreak, Swing Matoi, Mist Screen, Ember Focus, pause/restart must be visible.
  - Requests must combine text, icons, tile coordinates, arrows, pressure pulses, progress ticks, rescue halos, and labels so hue alone is not required.

## Menu and tutorial

Implement these states:

1. Title screen
   - Shows title “Matoi Ember Alley Brigade”.
   - Shows Day 051 badge, mode badge “hybrid”, public route `/matoi/`, best score, best Dawn All-Clear time if available, and a prompt link.
   - Shows a large Start button and visible tutorial panel by default.
   - Notes: “Audio starts after you press Start; visual hose, water, fire, smoke, rescue, wind, pressure, morale, and focus cues work if muted.”
2. Tutorial text
   - Objective: “Contain ember fronts, route water pressure, rescue alley cats, stamp firebreaks, and keep morale high until dawn.”
   - Hybrid board: move across near/mid/far isometric alley tiles; elevation and wind affect spread and hose reach.
   - Pressure routing: Rotate Hose, pump into the green pressure band, use Bucket Chain around kinks or smoke.
   - Rescue/support: clear smoke, Raise Ladder for roof tiles, Rescue Cat only when the path is safe, Swing Matoi to steady morale.
   - Ember Focus: previews spread, pressure loss, kink risk, rescue path, ladder reach, and best firebreak edge.
   - Pause/restart: visible buttons on mobile or keyboard shortcuts on desktop.
3. In-game HUD
   - Score, best score, brigade hearts, pressure %, morale %, smoke %, shrine risk %, incident name, combo, active tile, wind, hose direction, Ember Focus charge, elapsed time, latest warning.
   - Pause/restart controls visible or immediately accessible.
4. Status helper
   - Non-blocking helper showing next fire/rescue, hose angle validity, pressure band, wind tick, smoke risk, morale warning, Ember Focus readiness, and expected score effect.
   - Must not cover the board or bottom controls on mobile.
5. Pause overlay
   - Resume, restart, tutorial reminder, controls summary, audio/mute toggle, prompt link.
6. Game-over/results overlay
   - Final score, best score, incident reached, Dawn All-Clear status, pressure efficiency, smoke peak, rescues saved, protected houses, perfect firebreaks, badges, restart button.
7. Matoi Dawn All-Clear banner
   - Trigger once per run after all three incidents and 6500 score.
   - Non-blocking celebration: blue dawn light pushes through smoke, water arcs become gold mist, rescued cats gather by the pump, firewatch seals stamp the incident card, the matoi standard spins, lantern reflections return, and endless patrols continue after the banner fades.

## Assets

Prefer Imagegen2 (`openai/gpt-image-2`) for final visual art: brigade leader/helper sprite, portrait Edo alley background, fire/hose/rescue/material sprite sheet, and Matoi action/focus UI icon sheet. Canvas/SVG/WebGL code may render the interactive isometric board, hitboxes, water arcs, smoke overlays, wind arrows, tile elevation, particles, pressure pulses, and UI chrome. It should not create final character/background/texture/icon art from scratch unless Imagegen2 is unavailable after a real attempt.

Archive source generated art under `release/games/051/assets/source/` and use optimized playable copies under `release/games/051/assets/`. Also copy optimized playable assets into `apps/day-051-matoi-ember-alley-brigade/assets/` and the public alias `release/matoi/assets/`. The public alias should receive optimized playable copies only, not a duplicated `assets/source/` tree.

For mobile-first crop safety: keep important content centered, leave 12-16% safe margins, avoid baked-in readable text, avoid watermarks, avoid fake UI labels, avoid tiny flames/cats/hoses that disappear at final in-game size, and keep brigade/matoi/hose/water/fire/smoke/rescue/wind silhouettes distinct against blue-black alley backgrounds and warm ember lighting.

Generate or provide at least these final art assets:

1. Matoi brigade leader/helper sprite
   - Target: transparent PNG if possible, square source, final optimized texture around 512x512 or 256x256.
   - Archive path: `release/games/051/assets/source/matoi-brigade-source.png`
   - Optimized path: `release/games/051/assets/matoi-brigade.png`
   - Imagegen2 prompt: “A charming readable Edo-period Japanese fire brigade leader hero for a mobile isometric fire-control arcade game, short indigo happi coat with white geometric fire brigade patterns, headband, holding a small matoi standard and brass hose nozzle, determined friendly expression, natural forward direction facing slightly to the right, warm ember rim light and cool blue smoke edge light, centered full-body sprite silhouette, transparent or solid pale rice-paper background, no checkerboard background, no readable text, no watermark, high contrast at 64-128 pixels.”
   - Aspect ratio: square.
2. Edo ember alley background source
   - Target: portrait-friendly background suitable behind an overlaid isometric alley board with open readable center.
   - Archive path: `release/games/051/assets/source/matoi-alley-source.png`
   - Optimized path: `release/games/051/assets/matoi-alley.png`
   - Imagegen2 prompt: “A dramatic Edo-period Japanese night alley during a small fire emergency for a portrait mobile hybrid arcade game, wet stone lane, cedar townhouses at the sides, vermilion firewatch tower silhouettes, paper lantern reflections, blue-black smoke layers near the top and edges, orange ember glow at side roofs, wooden hand pump cart near the lower edge, open readable central space for overlaid isometric board, hoses, water arcs, and rescue markers, crop-safe for phone portrait, no central character, no readable text, no watermark.”
   - Aspect ratio: portrait.
3. Fire, hose, bucket, rescue, and alley material sprite sheet source
   - Target: square sheet with separated readable materials usable as sprites/decals/textures.
   - Archive path: `release/games/051/assets/source/matoi-pieces-source.png`
   - Optimized path: `release/games/051/assets/matoi-pieces.png`
   - Imagegen2 prompt: “Sprite sheet of small readable Edo fire brigade game pieces: orange ember cluster, blue water splash arc, braided hose bend, wooden bucket, ladder section, wet clay firebreak plank, smoky tile, wind arrow ribbon, rescue cat silhouette, paper firewatch seal, protected house charm, morale matoi standard, pressure droplet, shrine gate warning, each element separated with generous margins, transparent or pale rice-paper background, no checkerboard background, no readable text, no watermark, readable at 40-96 pixels.”
   - Aspect ratio: square.
4. Matoi action, pressure, rescue, and focus UI icon sheet source
   - Target: square icon sheet for controls, hazards, rewards, and UI decals.
   - Archive path: `release/games/051/assets/source/matoi-icons-source.png`
   - Optimized path: `release/games/051/assets/matoi-icons.png`
   - Imagegen2 prompt: “Small readable icon sheet for an Edo Japanese fire brigade arcade game: move brigade, rotate hose, pump water, bucket chain, raise ladder, rescue cat, stamp firebreak, swing matoi, mist screen, Ember Focus flame-eye crest, pressure meter droplet, morale banner, smoke warning, shrine risk, wind tick, protected house, firewatch seal, Dawn All-Clear crest, transparent or solid pale rice-paper background, no checkerboard background, high contrast, no readable text, no watermark, generous margins so no icons are cut off.”
   - Aspect ratio: square.

If Imagegen2 is unavailable or fails after a real attempt, create a clearly labeled emergency fallback using simple SVG/canvas brigade/hose/fire/water/cat/matoi/icon silhouettes, document the failure in `ai/postmortems/day-051.md`, and still keep source/fallback files under the same asset paths.

### Mandatory generated-image QA

For every generated image, include a real inspection step after generation and before integration:

- Analyze the actual generated file visually, not just the prompt text.
- For the brigade sprite, verify transparent/cutout quality or clean background handling, readable silhouette, centered pivot/crop margins, no unwanted text/watermarks, natural forward direction facing slightly right, matoi/nozzle visible but not fragile at small size, and that runtime movement/turning uses this right-facing baseline correctly.
- For the pieces sheet, verify separated ember, water arc, hose bend, bucket, ladder, firebreak, smoke tile, wind ribbon, rescue cat, firewatch seal, protected-house charm, matoi morale standard, pressure droplet, and shrine warning at final 40-96px size, usable crop margins, no baked checkerboard, no unwanted text/watermark, and a documented visual baseline: embers are threats, blue water arcs are suppression, hoses carry pressure, cats are rescues, firebreaks stop wind spread, matoi boosts morale.
- Verify control-to-motion alignment in-game: Move Brigade must visibly change board tile, Rotate Hose must rotate the nozzle/spray preview, Pump Water must visibly send a pressure pulse and suppress eligible embers, Bucket Chain must create a visible helper route, Raise Ladder must extend reach to roof tiles, Rescue Cat must collect only safe route markers, Stamp Firebreak must visibly block a predicted spread edge, Swing Matoi must pulse morale radius, Mist Screen must clear smoke, Ember Focus must preview spread/pressure/kink/rescue/ladder/firebreak paths, Pause/Restart must work.
- For the background, verify the central alley board remains readable after portrait mobile crop and does not hide fires, water arcs, rescue markers, wind arrows, smoke warnings, incident card, helper, or controls.
- For the icon sheet, verify move, hose, pump, bucket, ladder, cat, firebreak, matoi, mist, focus, pressure, morale, smoke, shrine, wind, house, seal, and all-clear icons are distinct at final HUD/button size and cannot be confused. Watch specifically for fake checkerboard transparency; alpha-clean or composite onto pale rice paper if needed and inspect again.
- If inspection finds a problem, regenerate or post-process the image and inspect again. Do not ship broken visual assets just because tests pass.

## Audio and game feel

Because pumping, water pulses, ember spread, bucket helpers, ladders, rescued cats, matoi morale, and dawn all-clear are central to the theme, include lightweight WebAudio cues initialized only after a user gesture:

- Soft pump clack and wet alley ambience when Start begins.
- Hose swivel click when Rotate Hose changes direction.
- Wooden pump thump and water rush when Pump Water fires.
- Bucket handoff splashes when Bucket Chain succeeds.
- Ladder creak when Raise Ladder extends.
- Cat mew and bell chime when Rescue Cat succeeds.
- Clay stomp when Stamp Firebreak blocks a spread edge.
- Matoi banner flutter and drum tap when Swing Matoi restores morale.
- Smoke hiss when Mist Screen clears a cone.
- Focus shimmer when Ember Focus activates.
- Shrine bell and rain-on-stone flourish when Matoi Dawn All-Clear triggers.

Audio must not block play if WebAudio is unavailable. Verify no autoplay errors: audio context should be created/resumed only after Start or another user interaction. Include a visible mute toggle in pause/results or HUD. Expose a narrow debug handle such as `window.__day051Audio = { ctx, enabled }` after user-gesture initialization so Playwright can assert audio state.

## Prompt page output

The archived `release/games/051/prompt.html` must be a consistent rendered HTML page, not raw Markdown pasted into a `<pre>` block. It should include:

- A clear `<title>` and `<h1>` using `Day 051 Game Generation Prompt`.
- A back-to-game link near the top.
- Semantic rendered sections (`h2`, `h3`, `ul/ol/li`, `p`, `pre/code` only for actual code/commands).
- The same readable prompt-page style pattern across days so prompt pages feel like one system.

## Subagents to dispatch

1. Implementation subagent
   - Build the static hybrid game under `apps/day-051-matoi-ember-alley-brigade/`.
   - Integrate it into immutable release output under `release/games/051/`.
   - Create the public playable route under `release/matoi/`.
   - Use static HTML/CSS/JS with Canvas/SVG/DOM/WebAudio and no backend.
   - The public alias must be self-contained or asset paths must be alias-safe.
2. Asset/polish subagent
   - Generate/prepare Imagegen2 assets, archive source files, optimize playable copies, inspect generated images, remove fake checkerboards if present, document brigade/fire/water/hose/cat/matoi visual baselines, and tune mobile readability/game feel.
3. QA/browser/mobile subagent
   - Run desktop and mobile smoke checks, verify no console errors, verify menu/tutorial/objective/controls/restart/pause, prompt links, isometric board render, board tile selection/drag, Move Brigade, Rotate Hose, Pump Water, Bucket Chain, Raise Ladder, Rescue Cat, Stamp Firebreak, Swing Matoi, Mist Screen, Ember Focus control presence and visible mechanical effect, pressure/morale/smoke/shrine/wind/incident feedback, generated screenshot, generated assets, WebAudio initialization after user gesture, and 390x844 portrait layout.
4. Reflection/self-improvement subagent
   - Write `ai/postmortems/day-051.md` after validation with what worked, what failed, generated-image inspection notes, brigade/fire/water/hose/cat/matoi visual baseline, audio verification, code-isolation confirmation, and whether generator/template/rubric improvements are justified.

## Acceptance criteria

- Static build passes.
- Code isolation is documented in QA/postmortem: no previous game implementation code was opened, inspected, copied, diffed, grepped, or adapted.
- Mode choice follows the cadence rule: Day 051 is `hybrid` after Day 050 `3d`, with meaningful depth lanes, elevation, pressure loss, hose kinks, wind spread, smoke, ladder reach, rescue paths, and firebreak prediction rather than decorative isometric art.
- Desktop smoke passes.
- Mobile portrait smoke passes at about 390x844 with readable HUD/tutorial/incident card/board, usable 44px+ brigade/action/pause/restart controls, no forced landscape canvas, and no tiny survival-critical fire labels.
- Prompt is visible from gallery and release folder.
- `prompts/day-051.md` is copied exactly to `release/games/051/prompt.md` and `release/matoi/prompt.md`.
- `release/games/051/prompt.html` and `release/matoi/prompt.html` render the prompt in browser-readable semantic HTML with the standard prompt-page styling, not a raw Markdown `<pre>` dump.
- Public alias `release/matoi/index.html`, `release/matoi/prompt.html`, `release/matoi/screenshot.png`, and `release/matoi/assets/` exist and work.
- Gallery card for Day 051 shows prompt availability, generation duration, public `/matoi/` links, mode `hybrid`, and actual generated date.
- Screenshot exists at `release/games/051/screenshot.png` and is non-empty/readable. Prefer a readable desktop gameplay screenshot for gallery cards; mobile screenshots are QA evidence unless the design is intentionally portrait-card friendly.
- Image/source assets exist under `release/games/051/assets/source/` and optimized assets exist under `release/games/051/assets/`, or a documented emergency fallback exists.
- Every generated image has an inspection note in the postmortem or QA notes; interactive brigade/fire/water/hose/cat/matoi visuals have verified background handling, orientation/pivot/crop, readability, and control-to-motion alignment.
- WebAudio initializes after user gesture and creates no autoplay console errors; audio is failsafe if unsupported and visual hose/water/fire/smoke/rescue/wind/commission cues remain playable muted.
- No console errors during desktop or mobile smoke. Add data-URI favicons to game and prompt pages if needed to avoid favicon request noise.
- Existing `release/games/001/**` through `release/games/050/**` from origin/main remain unchanged.
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
# Screenshot/static checks: verify release/games/051/screenshot.png, prompt.md, prompt.html, index.html, game.js, styles.css, release/matoi/index.html, release/matoi/prompt.html, release/matoi/screenshot.png, optimized assets, and source assets exist and are non-empty.
# Prompt copy check: cmp prompts/day-051.md release/games/051/prompt.md and cmp prompts/day-051.md release/matoi/prompt.md.
# Prompt HTML check: verify release/games/051/prompt.html has semantic h1/h2/list markup and a back-to-game link, not a raw Markdown dump inside <pre>, and no malformed ul > p or ol > p nodes, no direct nested lists, and no strong/b tags inside code.
# Browser smoke: open the local/static /matoi/ route and verify menu, tutorial, gameplay start, isometric board/brigade render, board tile selection/drag, Move Brigade, Rotate Hose, Pump Water, Bucket Chain, Raise Ladder, Rescue Cat, Stamp Firebreak, Swing Matoi, Mist Screen, Ember Focus, pressure/morale/smoke/shrine/wind feedback, pause, restart, prompt page, WebAudio after user gesture, no console errors.
# Mobile smoke: repeat at a portrait phone viewport such as 390x844 and verify playable brigade/action controls plus readable HUD/incident card/board/controls.
# Static screenshot check: inspect release/games/051/screenshot.png and release/matoi/screenshot.png for non-empty readable game content; use vision to judge actual visual quality.
# Image QA: inspect every Imagegen2 source/optimized asset and document the actual inspection result in ai/postmortems/day-051.md.
# Docker/static smoke: build the Docker image locally, run it, curl /matoi/ and /matoi/prompt.html, then stop the container.
# Immutable guard: confirm no release/games folders from origin/main changed except new Day 051.
```
