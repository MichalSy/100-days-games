# Day 050 Game Generation Prompt

## Game identity

- Day: 050
- Title: Kagura Mask Star Dancer
- Slug: kagura-mask-star-dancer
- Public route word: kagura
- Mode: 3D
- Genre: mobile-first 3D ritual-dance rhythm puzzle / spatial pose matching / shrine-stage score chase
- Mood/style: a moonlit outdoor kagura shrine stage with polished cedar boards, indigo night sky, hanging shimenawa rope, white gohei paper streamers, vermilion lantern posts, lacquered fox/oni/okame masks, gold star chalk marks, soft bell ribbons, and crisp depth cues; a choreographed spatial dance game rather than mounted archery, glass cutting, dragonfly flight, roof repair, toy juggling, dessert sculpting, card scanning, insect climbing, mycelium routing, kintsugi repair, tatami layout, griddle cooking, fish scooping, gear trains, bridges, thread spheres, fan dye sectors, valves, flowers, fruit harvesting, stealth patrols, tea foam, fireworks, pachinko, mochi platforms, calligraphy, kite mapping, dry-garden raking, pearls, taiko routing, daruma rolling, web weaving, pottery, bamboo canals, origami folds, parasols, snow lanterns, kimono panels, bento service, windbell tuning, rails, or koi collection.

## Why this game today

The generated series currently ends with:

- Day 045 `2d`: Kendama Star Cup Juggler, warm dusk toy-stall pendulum/cup timing.
- Day 046 `3d`: Shachi Roofline Rainwright, cool blue-hour 3D temple roof repair and rain routing.
- Day 047 `2d`: Tombo Dewline Glider, airy green-and-gold rice-paddy dragonfly dewline flight.
- Day 048 `3d`: Kiriko Lantern Prism Cutter, dark ruby/cobalt 3D glass cutting with caustic light targets.
- Day 049 `2d`: Yabusame Willow Target Archer, warm dusk riverside mounted-archery timing with horse pace, bow draw, target order, wind, and willow occlusion.

The latest generated-mode streak is one `2d` (Day 049), so Day 050 deliberately returns to real `3d` for the midpoint milestone. It must be meaningfully spatial: the player moves a dancer across a raised stage grid with front/middle/back depth lanes, rotates body orientation, matches mask-facing, raises/lowers a gohei wand, lands poses on beat windows, and traces star-path choreography around lantern markers. It must not be a flat rhythm-button panel with perspective decoration; stage position, depth lane, facing angle, mask state, beat phase, pose height, lantern-light cone, balance, audience hush, and choreographic order must all matter mechanically.

Visual contrast notes from recent screenshots:

- Day 049 is warm brown/vermillion riverside archery with circular targets, horse/rider at lower left, large arrow arcs, and dark rectangular controls.
- Day 048 is dark ruby/cobalt kiriko craft with a central glass object, caustic beams, compact HUD chips, and jewel-toned workbench background.
- Day 047 is pale green/gold rice terrace flight with a wide 2D field, dragonfly silhouette, dew beads, and cream buttons.

Day 050 should feel ceremonial and staged: centered raised cedar stage, deep indigo sky, white paper streamers, vermilion lanterns, gold constellation floor marks, mask silhouettes, bell ribbons, soft audience shadow, and dancer footwork seen from a slightly elevated 3D camera. Avoid target discs, bows, arrows, horses, willow branches, glass cups/facets/caustics, dragonflies, dew beads, rice rows, frogs, roof tiles, rain chains, kendama cups/balls, shaved ice, syrup, card spreads, tree trunks, beetles, mushrooms, ceramic shards, tatami rectangles, griddles, fish tanks, gears, bridges, embroidery/web threads, fan dye sectors, valves, flower stems, fruit baskets, stealth cones, tea bowls, firework launch tubes, pachinko pegs, mochi pads, brush strokes, kite strings, sand rake marks, pearls, drums as primary inputs, rolling mazes, pottery wheels, bamboo tile routes, origami creases, parasol shields, snow blocks, kimono cloth panels, bento trays, windbells, rail tracks, and koi ponds.

## Code isolation / no previous game source

The implementation must be written from scratch for this day. Do not open, inspect, copy, diff, grep, or adapt code from previous games, including old `apps/day-*` folders, old `release/games/NNN/` HTML/CSS/JS files, or old public alias folders. You may inspect previous metadata, prompts, postmortems, and screenshots only to avoid repeating concepts and visual identity. The new game's HTML/CSS/JS must come from this prompt and general browser/Three.js/WebGL/WebAudio game knowledge, not from earlier game implementations.

## Mode variety / 3D cadence

Inspection target: `src/data/games.ts` currently ends with Day 045 `2d`, Day 046 `3d`, Day 047 `2d`, Day 048 `3d`, and Day 049 `2d`. The latest generated-mode streak is one `2d`.

Mode decision: Day 050 is real `3d`:

- Use Three.js/WebGL or equivalent static-browser 3D rendering.
- Render a raised 3D kagura stage with readable front/mid/back depth, left/center/right floor tiles, lantern-light cones, star floor marks, shimenawa/gohei paper streamers, dancer body orientation, mask pose, balance ribbons, and beat rings.
- Gameplay must depend on 3D state: stage tile, depth lane, facing angle, mask alignment, pose height, gohei wand angle, beat phase, lantern spotlight, footwork order, balance meter, hush meter, focus charge, and camera-relative controls.
- Player actions must manipulate the 3D system: Step Left, Step Right, Step Forward, Step Back, Turn Left, Turn Right, Raise Gohei, Lower Gohei, Strike Pose, Ring Kagura Bells, Mask Swap, Star Focus, pause/restart, audio toggle, and prompt link.
- Portrait mobile is the default supported layout; no landscape gate.

## Design

- Objective: Perform three kagura dance sequences on a moonlit shrine stage by stepping through ordered star marks, facing lantern directions, swapping masks at cue gates, matching high/low gohei poses, ringing bells on the beat, and preserving audience hush before the ritual lanterns dim.
- Win condition: Complete three choreography commissions — First Star Step, Lantern Mask Spiral, and Moon Rope Finale — while reaching 6400 points to trigger “Kagura Midpoint Blessing”. After the banner, continue into endless shrine-stage sequences.
- Lose condition: Three spirit-heart lives are lost, audience hush reaches 0%, balance reaches 0% during a stumble, lantern timer reaches 100%, six required star marks fade unstepped, the final commission receives two wrong-mask poses, or pose strain reaches 100% while the dancer is off-balance.
- Core loop:
  1. Start on a title/menu screen with Day 050 badge, mode badge “3D”, public route `/kagura/`, best score, best Midpoint Blessing time, tutorial, prompt link, audio note, and a large Start button.
  2. Show a portrait-friendly 3D stage. The camera sits slightly above/front, looking down at a 3x3 raised cedar stage with front/middle/back rows. A readable dancer silhouette stands on one tile with a visible facing arrow and mask crest.
  3. A choreography card requests goals such as: “Step front-left star 1, face east lantern, raise gohei high, Strike Pose on the blue beat, Mask Swap to fox, then ring Kagura Bells at center.”
  4. Player uses Step Left/Right/Forward/Back to move between stage tiles. Each step has a tiny rhythm landing window; landing early/late lowers balance but should not instantly fail during the opening tutorial.
  5. Turn Left/Turn Right rotates the dancer’s facing. Certain star marks score only when the dancer faces the matching lantern or shimenawa rope direction.
  6. Raise Gohei / Lower Gohei changes pose height. High poses catch moon ribbons; low poses ground the feet and restore balance. Holding one height too long raises pose strain.
  7. Strike Pose locks the current tile/facing/mask/height into the active choreography mark. Correct pose on beat stamps the mark and sends gold paper streamers outward; wrong tile, facing, mask, or height gives a small practice score but resets combo and may count as wrong-mask in the finale.
  8. Ring Kagura Bells during the blue beat ring to widen the next step/pose window and restore audience hush. Ringing off-beat creates a harsh clank and slightly advances lantern timer.
  9. Mask Swap cycles fox / oni / okame mask states only at mask-gate floor marks or while Star Focus is active; otherwise it explains why the current mask remains required.
  10. Star Focus, charged by clean steps, correct facing, balanced pose height, on-beat bells, and perfect pose locks, overlays ordered star path, beat ring, next mask gate, lantern-facing arrows, balance risk, hush pressure, and safest next action.
  11. Completing a choreography sequence stamps a paper omamori seal, restores one spirit heart if below max, awards points, shifts stage lighting, and unlocks moving star marks, crossing lantern cones, stricter mask gates, off-center balance checks, faster beat rings, and optional bonus moon marks.
  12. Pause/restart remain visible throughout.
- 15+ minute play-value strategy:
  - Save best score, fastest Kagura Midpoint Blessing time, longest perfect-pose chain, highest on-beat bell streak, highest balanced-step combo, most correct mask-gate swaps, highest endless choreography number, fewest wrong-mask poses, best no-focus dance, lowest final pose strain, and collected omamori stage seals in localStorage.
  - Include three authored commissions:
    - First Star Step: broad center/front marks, slow beat, one mask, obvious facing arrows, guided first Step, Turn, Raise/Lower Gohei, Strike Pose, and Ring Kagura Bells. No heart penalty for the first tutorial miss.
    - Lantern Mask Spiral: ordered route around left/center/right and front/mid/back tiles, first mask-gate swap, first off-beat warning, first audience-hush recovery, and one lantern-facing check.
    - Moon Rope Finale: seven marks across all depth lanes, required Star Focus preview, moving moon mark, two mask gates, high/low gohei alternation, lantern timer below 55%, and no wrong-mask poses in the final chain.
  - Deterministic Day 050 seed varies star order, stage lane depth, beat ring phase, lantern direction, mask gate timing, balance drain, pose strain gain, hush pressure, focus charge, sequence length, and endless constraints while keeping opening seconds fair.
  - Mastery badges: complete First Star Step with zero misses, trigger Midpoint Blessing under 285 seconds, finish Lantern Mask Spiral with every pose perfect, clear Moon Rope Finale with hush above 70%, chain nine correct marks, ring five blue-beat bells, swap masks correctly at three gates, and complete a commission without Star Focus.
  - Strategic scoring rewards dance planning: step before turning when the mark is diagonal, face lantern before striking, lower gohei to recover balance, raise gohei for moon-ribbon marks, ring bells before hard turns, swap masks only at gates, and save Star Focus for spiral/finale routes rather than using it as a panic button.
  - Endless mode after Midpoint Blessing adds split-stage star paths, faster beat rings, moving lantern cones, paired mask gates, stricter high/low pose windows, balance tremors, bonus constellation marks, and higher combo multipliers without shrinking touch targets.
- Difficulty scaling:
  - 0-45 seconds: slow beat, broad center mark, simple facing, one mask, forgiving balance/hush, visible route hints.
  - 45-150 seconds: depth-lane steps, first mask gate, lantern-facing checks, on-beat bell timing, first high/low pose alternation.
  - 150-285 seconds: required Star Focus, moving moon mark, two mask gates, stricter final route, hush timer below 55%.
  - 285+ seconds/endless: faster beats, longer paths, more lantern cones, stricter mask/pose rules, same readable controls.
  - Keep mobile fair: dancer, stage tiles, star marks, facing arrow, mask state, gohei height, beat ring, lantern cones, commission card, helper, focus/balance/hush/strain/timer HUD, and action buttons must be readable at 390x844; primary touch buttons should be 52px+ where possible and never below 44px; no tiny survival-critical mark labels.
- Scoring/rewards:
  - Clean step landing on route: +130 points times combo tier.
  - Correct facing before a mark: +180 points.
  - Strike Pose with correct tile/facing/mask/height: +320 points and Star Focus charge.
  - Perfect pose on the blue beat ring: +420 points and combo protect.
  - Ring Kagura Bells on blue beat: +260 points and audience-hush restore.
  - Correct Mask Swap at a gate: +300 points.
  - High gohei moon-ribbon catch: +250 points.
  - Low gohei balance recovery before stumble: +240 points.
  - Complete choreography before lantern warning: +1180 points and restore one spirit heart if below max.
  - Perfect no-miss choreography: +1700 points.
  - Kagura Midpoint Blessing: +4000 points and endless sequences unlock.
  - Wrong mask, wrong facing, off-beat pose, overheld gohei, missed star mark, or ignored hush cue: combo reset and balance/hush/timer penalty.

## Controls and layout

- Desktop:
  - Mouse click/tap on the stage: select/explain stage tile, star mark, lantern cone, mask gate, beat ring, dancer facing, balance chip, or active sequence mark.
  - Mouse drag on the stage: rotate the stage camera slightly and show an offset dance cursor above the pointer.
  - Arrow keys or WASD: Step Left/Right/Forward/Back.
  - Q/E: Turn Left / Turn Right.
  - W/S while focused on actions: Raise Gohei / Lower Gohei.
  - Space or Enter: Strike Pose.
  - B: Ring Kagura Bells.
  - M: Mask Swap.
  - F: Star Focus when charged.
  - P or Escape: pause/resume.
  - R: restart current run.
- Mobile/touch:
  - Drag/tap stage tiles to inspect route marks, but primary movement uses large labeled controls so thumbs do not hide the dancer or star path.
  - Use large Step Left, Step Right, Step Forward, Step Back, Turn Left, Turn Right, Raise Gohei, Lower Gohei, Strike Pose, Ring Kagura Bells, Mask Swap, Star Focus, Pause, Restart, Audio, and Prompt buttons.
  - Tapping balance/hush/strain/timer/focus/mask/commission chips may show short explanations.
  - No tiny virtual joystick. Interaction is direct stage inspection plus labeled dance/action controls.
- Mobile layout/orientation:
  - Default target is portrait phone play around 390x844; do not require landscape.
  - Top: compact Kagura HUD with score, best, spirit hearts, balance %, hush %, pose strain %, lantern timer %, combo, active tile, facing, mask, Star Focus charge, and elapsed time. Use mask/gohei/star/lantern/bell/shimenawa/balance/hush/omamori chips, not bow/target/horse/willow/glass/dew/roof/rain/toy/dessert/card/beetle/mushroom/shard/tatami/cake/fish/gear/bridge/thread/fan/valve/flower/fruit/lattice/tea/firework/koi icons.
  - Below top: choreography commission card with ordered star marks, required facing, mask gates, gohei height, bell beat note, progress ticks, and current shrine-master note.
  - Center: large 3D kagura stage with dancer, cedar tiles, star floor marks, facing arrow, mask gate, beat ring, lantern cones, gohei paper streamers, helper art, and readable hit feedback. It must remain playable without zooming.
  - Bottom: status helper plus large dance/action controls. Controls must not cover dancer, star marks, beat rings, lantern cones, helper, commission card, mask gates, or Star Focus overlays.
  - Tutorial must fit on the first portrait screen; optional details may be collapsible but objective, Step controls, Turn controls, Raise/Lower Gohei, Strike Pose, Ring Kagura Bells, Mask Swap, Star Focus, pause/restart must be visible.
  - Requests must combine text, icons, tile coordinates, facing arrows, mask symbols, pose-height chips, progress ticks, star halos, and labels so hue alone is not required.

## Menu and tutorial

Implement these states:

1. Title screen
   - Shows title “Kagura Mask Star Dancer”.
   - Shows Day 050 badge, mode badge “3D”, public route `/kagura/`, best score, best Midpoint Blessing time if available, and a prompt link.
   - Shows a large Start button and visible tutorial panel by default.
   - Notes: “Audio starts after you press Start; visual dancer, star mark, mask, gohei, lantern, bell, balance, hush, and focus cues work if muted.”
2. Tutorial text
   - Objective: “Step through ordered star marks, face lanterns, match masks and gohei height, strike poses on the beat, and keep the shrine audience hushed.”
   - 3D movement: Step Left/Right/Forward/Back across front/mid/back stage tiles; facing direction matters.
   - Pose matching: Turn first, Raise or Lower Gohei, then Strike Pose on the blue beat ring.
   - Rhythm/support: Ring Kagura Bells on blue beats to restore hush and widen the next timing window.
   - Masks: Mask Swap only works at gate marks unless Star Focus is active; wrong masks break finale chains.
   - Star Focus: previews route order, beat window, mask gates, lantern-facing arrows, balance risk, hush pressure, and safest next action.
   - Pause/restart: visible buttons on mobile or keyboard shortcuts on desktop.
3. In-game HUD
   - Score, best score, spirit hearts, balance %, hush %, pose strain %, lantern timer %, commission name, combo, active tile, facing, current mask, Star Focus charge, elapsed time, latest warning.
   - Pause/restart controls visible or immediately accessible.
4. Status helper
   - Non-blocking helper showing next star mark, tile/facing validity, pose height, beat timing, mask gate status, balance risk, Star Focus readiness, and expected score effect.
   - Must not cover the 3D stage or bottom controls on mobile.
5. Pause overlay
   - Resume, restart, tutorial reminder, controls summary, audio/mute toggle, prompt link.
6. Game-over/results overlay
   - Final score, best score, commission reached, Midpoint Blessing status, hush %, balance %, strain peak, wrong-mask poses, perfect poses, blue-beat bell hits, badges, restart button.
7. Kagura Midpoint Blessing banner
   - Trigger once per run after all three choreographies and 6400 score.
   - Non-blocking celebration: cedar stage glows with a gold constellation, fox/oni/okame masks orbit the dancer, gohei paper streamers shimmer, lantern cones bloom, a midpoint omamori seal stamps the commission card, bells ring, and endless choreographies continue after the banner fades.

## Assets

Prefer Imagegen2 (`openai/gpt-image-2`) for final visual art: kagura dancer/helper sprite, portrait shrine-stage background, mask/star/gohei/lantern material sprite sheet, and Kagura action/focus UI icon sheet. Three.js primitives may render the interactive stage tiles, dancer billboard/plane, star marks, beat rings, lantern cones, pose trails, hitboxes, particles, and UI chrome. It should not create final character/background/texture/icon art from scratch unless Imagegen2 is unavailable after a real attempt.

Archive source generated art under `release/games/050/assets/source/` and use optimized playable copies under `release/games/050/assets/`. Also copy optimized playable assets into `apps/day-050-kagura-mask-star-dancer/assets/` and the public alias `release/kagura/assets/`. The public alias should receive optimized playable copies only, not a duplicated `assets/source/` tree.

For mobile-first crop safety: keep important content centered, leave 12-16% safe margins, avoid baked-in readable text, avoid watermarks, avoid fake UI labels, avoid tiny mask/star details that disappear at final in-game size, and keep dancer/mask/gohei/star/lantern/bell/omamori silhouettes distinct against deep indigo and warm cedar shrine-stage backgrounds.

Generate or provide at least these final art assets:

1. Kagura dancer/helper sprite
   - Target: transparent PNG if possible, square source, final optimized texture around 512x512 or 256x256.
   - Archive path: `release/games/050/assets/source/kagura-dancer-source.png`
   - Optimized path: `release/games/050/assets/kagura-dancer.png`
   - Imagegen2 prompt: “A charming readable kagura shrine dancer hero for a mobile 3D Japanese ritual dance arcade game, youthful masked dancer in white and vermilion shrine robes, holding a white gohei paper wand, small brass bell sash, fox mask tilted on the head, poised mid-step facing slightly to the right as the natural forward direction, warm lantern rim light, centered sprite silhouette, transparent or solid pale rice-paper background, no checkerboard background, no readable text, no watermark, high contrast at 64-128 pixels.”
   - Aspect ratio: square.
2. Moonlit kagura shrine-stage background source
   - Target: portrait-friendly background suitable behind an overlaid 3D raised stage with open readable center.
   - Archive path: `release/games/050/assets/source/kagura-stage-source.png`
   - Optimized path: `release/games/050/assets/kagura-stage.png`
   - Imagegen2 prompt: “A moonlit outdoor Japanese kagura shrine stage for a portrait mobile 3D arcade game, raised polished cedar platform, vermilion lantern posts near the edges, hanging shimenawa rope and white gohei streamers above, indigo night sky, soft audience shadows, distant shrine roof at the sides, gold star floor chalk marks near the edges, open readable central space for overlaid dancer and 3D stage tiles, crop-safe for phone portrait, no central character, no readable text, no watermark.”
   - Aspect ratio: portrait.
3. Kagura masks, stars, gohei, lantern, and bell sprite sheet source
   - Target: square sheet with separated readable materials usable as sprites/decals/textures.
   - Archive path: `release/games/050/assets/source/kagura-pieces-source.png`
   - Optimized path: `release/games/050/assets/kagura-pieces.png`
   - Imagegen2 prompt: “Sprite sheet of small readable Japanese kagura dance game pieces: fox mask, oni mask, okame mask, gold star floor mark, white gohei paper streamer, vermilion lantern cone, brass kagura bell, blue beat ring, cedar stage tile marker, shimenawa rope charm, spirit heart, balance ribbon, audience hush crescent, omamori seal, perfect pose burst, each element separated with generous margins, transparent or pale rice-paper background, no checkerboard background, no readable text, no watermark, readable at 40-96 pixels.”
   - Aspect ratio: square.
4. Kagura action, rhythm, mask, and focus UI icon sheet source
   - Target: square icon sheet for controls, hazards, rewards, and UI decals.
   - Archive path: `release/games/050/assets/source/kagura-icons-source.png`
   - Optimized path: `release/games/050/assets/kagura-icons.png`
   - Imagegen2 prompt: “Small readable icon sheet for a Japanese kagura ritual dance arcade game: step left, step right, step forward, step back, turn left, turn right, raise gohei, lower gohei, strike pose, ring kagura bells, mask swap, Star Focus constellation eye crest, balance warning, hush meter, pose strain, lantern timer, omamori seal, Midpoint Blessing crest, transparent or solid pale rice-paper background, no checkerboard background, high contrast, no readable text, no watermark, generous margins so no icons are cut off.”
   - Aspect ratio: square.

If Imagegen2 is unavailable or fails after a real attempt, create a clearly labeled emergency fallback using simple SVG/Three.js dancer/mask/star/gohei/lantern/icon silhouettes, document the failure in `ai/postmortems/day-050.md`, and still keep source/fallback files under the same asset paths.

### Mandatory generated-image QA

For every generated image, include a real inspection step after generation and before integration:

- Analyze the actual generated file visually, not just the prompt text.
- For the dancer sprite, verify transparent/cutout quality or clean background handling, readable dancer silhouette, centered pivot/crop margins, no unwanted text/watermarks, natural forward direction facing slightly right, gohei wand visible but not fragile at small size, and that runtime movement/turning uses this right-facing baseline correctly.
- For the pieces sheet, verify separated fox/oni/okame masks, gold star mark, gohei streamer, lantern cone, bell, blue beat ring, cedar tile marker, shimenawa charm, spirit heart, balance ribbon, hush crescent, omamori seal, and perfect pose burst at final 40-96px size, usable crop margins, no baked checkerboard, no unwanted readable text/watermark, and a documented visual baseline: masks are state symbols, star marks are route targets, blue rings are timing windows, lantern cones are facing guides, bells are hush recovery, omamori are rewards.
- Verify control-to-motion alignment in-game: Step controls must visibly move the dancer between 3D tiles, Turn controls must rotate the facing arrow/dancer baseline, Raise/Lower Gohei must visibly change pose height, Strike Pose must stamp a mark only when tile/facing/mask/height align, Ring Kagura Bells must visibly pulse the beat ring and affect hush, Mask Swap must change or explain mask state, Star Focus must preview route/beat/mask/lantern/balance/hush paths, Pause/Restart must work.
- For the background, verify the central stage remains readable after portrait mobile crop and does not hide dancer, star marks, beat rings, lantern cones, commission card, helper, or controls.
- For the icon sheet, verify step, turn, gohei, strike pose, bells, mask swap, Star Focus, balance, hush, strain, lantern, omamori, and blessing icons are distinct at final HUD/button size and cannot be confused. Watch specifically for fake checkerboard transparency; alpha-clean or composite onto pale rice paper if needed and inspect again.
- If inspection finds a problem, regenerate or post-process the image and inspect again. Do not ship broken visual assets just because tests pass.

## Audio and game feel

Because rhythm, bell timing, footfalls, pose locks, hush pressure, and shrine blessing are central to the mechanic, include lightweight WebAudio cues initialized only after a user gesture:

- Soft wooden footstep and shrine ambience when Start begins.
- Low/high footstep clicks for front/back depth lane movement.
- Paper gohei rustle when Raise/Lower Gohei changes pose height.
- Clean clack when Strike Pose locks correctly, dull thud for wrong pose.
- Bright kagura bell when Ring Kagura Bells lands on the blue beat.
- Soft audience hush swell when balance/hush recovers.
- Lantern pulse drum when timer pressure rises.
- Mask-gate shimmer when Mask Swap is allowed.
- Star Focus shimmer when preview activates.
- Shrine bell/flourish when Kagura Midpoint Blessing triggers.

Audio must not block play if WebAudio is unavailable. Verify no autoplay errors: audio context should be created/resumed only after Start or another user interaction. Include a visible mute toggle in pause/results or HUD. Expose a narrow debug handle such as `window.__day050Audio = { ctx, enabled }` after user-gesture initialization so Playwright can assert audio state.

## Prompt page output

The archived `release/games/050/prompt.html` must be a consistent rendered HTML page, not raw Markdown pasted into a `<pre>` block. It should include:

- A clear `<title>` and `<h1>` using `Day 050 Game Generation Prompt`.
- A back-to-game link near the top.
- Semantic rendered sections (`h2`, `h3`, `ul/ol/li`, `p`, `pre/code` only for actual code/commands).
- The same readable prompt-page style pattern across days so prompt pages feel like one system.

## Subagents to dispatch

1. Implementation subagent
   - Build the static 3D game under `apps/day-050-kagura-mask-star-dancer/`.
   - Integrate it into immutable release output under `release/games/050/`.
   - Create the public playable route under `release/kagura/`.
   - Use static HTML/CSS/JS with Three.js/WebGL/DOM/WebAudio and no backend.
   - The public alias must be self-contained or asset paths must be alias-safe.
2. Asset/polish subagent
   - Generate/prepare Imagegen2 assets, archive source files, optimize playable copies, inspect generated images, remove fake checkerboards if present, document dancer/mask/star/gohei/lantern/bell visual baselines, and tune mobile readability/game feel.
3. QA/browser/mobile subagent
   - Run desktop and mobile smoke checks, verify no console errors, verify menu/tutorial/objective/controls/restart/pause, prompt links, 3D stage render, stage tile selection/drag, Step Left/Right/Forward/Back, Turn Left/Right, Raise/Lower Gohei, Strike Pose, Ring Kagura Bells, Mask Swap, Star Focus control presence and visible mechanical effect, balance/hush/strain/timer/mask/facing/commission feedback, generated screenshot, generated assets, WebAudio initialization after user gesture, and 390x844 portrait layout.
4. Reflection/self-improvement subagent
   - Write `ai/postmortems/day-050.md` after validation with what worked, what failed, generated-image inspection notes, dancer/mask/star/gohei/lantern/bell visual baseline, audio verification, code-isolation confirmation, and whether generator/template/rubric improvements are justified.

## Acceptance criteria

- Static build passes.
- Code isolation is documented in QA/postmortem: no previous game implementation code was opened, inspected, copied, diffed, grepped, or adapted.
- Mode choice follows the cadence rule: Day 050 is `3d` after Day 049 `2d`, with meaningful stage position, depth lane, facing angle, mask alignment, pose height, gohei wand angle, beat phase, lantern cone, balance/hush/timer pressure, and Star Focus mechanics rather than decorative stage art.
- Desktop smoke passes.
- Mobile portrait smoke passes at about 390x844 with readable HUD/tutorial/commission card/stage, usable 44px+ dance/action/pause/restart controls, no forced landscape canvas, and no tiny survival-critical mark labels.
- Prompt is visible from gallery and release folder.
- `prompts/day-050.md` is copied exactly to `release/games/050/prompt.md` and `release/kagura/prompt.md`.
- `release/games/050/prompt.html` and `release/kagura/prompt.html` render the prompt in browser-readable semantic HTML with the standard prompt-page styling, not a raw Markdown `<pre>` dump.
- Public alias `release/kagura/index.html`, `release/kagura/prompt.html`, `release/kagura/screenshot.png`, and `release/kagura/assets/` exist and work.
- Gallery card for Day 050 shows prompt availability, generation duration, public `/kagura/` links, mode `3d`, and actual generated date.
- Screenshot exists at `release/games/050/screenshot.png` and is non-empty/readable. Prefer a readable desktop gameplay screenshot for gallery cards; mobile screenshots are QA evidence unless the design is intentionally portrait-card friendly.
- Image/source assets exist under `release/games/050/assets/source/` and optimized assets exist under `release/games/050/assets/`, or a documented emergency fallback exists.
- Every generated image has an inspection note in the postmortem or QA notes; interactive dancer/mask/star/gohei/lantern/bell visuals have verified background handling, orientation/pivot/crop, readability, and control-to-motion alignment.
- WebAudio initializes after user gesture and creates no autoplay console errors; audio is failsafe if unsupported and visual dancer/star/mask/gohei/lantern/bell/commission cues remain playable muted.
- No console errors during desktop or mobile smoke. Add data-URI favicons to game and prompt pages if needed to avoid favicon request noise.
- Existing `release/games/001/**` through `release/games/049/**` from origin/main remain unchanged.
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
# Screenshot/static checks: verify release/games/050/screenshot.png, prompt.md, prompt.html, index.html, game.js, styles.css, release/kagura/index.html, release/kagura/prompt.html, release/kagura/screenshot.png, optimized assets, and source assets exist and are non-empty.
# Prompt copy check: cmp prompts/day-050.md release/games/050/prompt.md and cmp prompts/day-050.md release/kagura/prompt.md.
# Prompt HTML check: verify release/games/050/prompt.html has semantic h1/h2/list markup and a back-to-game link, not a raw Markdown dump inside <pre>, and no malformed ul > p or ol > p nodes, no direct nested lists, and no strong/b tags inside code.
# Browser smoke: open the local/static /kagura/ route and verify menu, tutorial, gameplay start, 3D stage/dancer render, stage tile selection, Step Left/Right/Forward/Back, Turn Left/Right, Raise/Lower Gohei, Strike Pose, Ring Kagura Bells, Mask Swap, Star Focus, balance/hush/strain/timer/mask/facing feedback, pause, restart, prompt page, WebAudio after user gesture, no console errors.
# Mobile smoke: repeat at a portrait phone viewport such as 390x844 and verify playable dance/action controls plus readable HUD/commission card/stage/controls.
# Static screenshot check: inspect release/games/050/screenshot.png and release/kagura/screenshot.png for non-empty readable game content; use vision to judge actual visual quality.
# Image QA: inspect every Imagegen2 source/optimized asset and document the actual inspection result in ai/postmortems/day-050.md.
# Docker/static smoke: build the Docker image locally, run it, curl /kagura/ and /kagura/prompt.html, then stop the container.
# Immutable guard: confirm no release/games folders from origin/main changed except new Day 050.
```
