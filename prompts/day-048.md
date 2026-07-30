# Day 048 Game Generation Prompt

## Game identity

- Day: 048
- Title: Kiriko Lantern Prism Cutter
- Slug: kiriko-lantern-prism-cutter
- Public route word: kiriko
- Mode: 3D
- Genre: mobile-first 3D glass-cutting precision puzzle / caustic light routing / atelier score chase
- Mood/style: a midnight Edo-kiriko glass atelier with ruby and cobalt cut-glass facets, brass cutting wheel, wet polishing tray, paper lantern beams, lacquer workbench, sparkling caustics, quiet glass chimes, and crisp gem-like depth cues; a tactile spatial craft game rather than dragonfly dew skimming, temple roof rain repair, kendama toy physics, shaved-ice sculpting, karuta card scanning, cedar climbing, mycelium routing, kintsugi shard repair, tatami layout, griddle cooking, goldfish scooping, gear trains, bridges, temari thread orbits, fan dyeing, onsen valves, ikebana, orchard harvesting, kumiko woodworking, shrine stealth, matcha foam, fireworks, pachinko, mochi hopping, calligraphy strokes, kite mapping, dry-garden raking, pearls, taiko pads, daruma mazes, spider webs, pottery profiles, bamboo canals, origami folds, parasols, snow lanterns, kimono panels, bento service, windbells, rail running, or koi collection.

## Why this game today

The generated series currently ends with:

- Day 043 `2d`: Karuta Mooncall Duelist, dark indigo card-table reaction and poem-card scanning.
- Day 044 `3d`: Kakigori Prism Shavewright, bright 3D dessert sculpting with syrup routes.
- Day 045 `2d`: Kendama Star Cup Juggler, warm dusk toy-stall pendulum/cup timing.
- Day 046 `3d`: Shachi Roofline Rainwright, cool blue-hour 3D temple roof repair and rain routing.
- Day 047 `2d`: Tombo Dewline Glider, airy green-and-gold 2D rice-paddy dragonfly dewline flight.

The latest generated-mode streak is one `2d` (Day 047), so Day 048 deliberately returns to real `3d` to preserve the alternating cadence. It must be meaningfully spatial: the player rotates a faceted kiriko glass cup/lantern, selects depth bands and facet columns, scores grooves with a cutting wheel, rinses heat, polishes facets, and routes lantern beams through actual facet angles into requested caustic targets. It must not be a flat pattern board with perspective decoration; glass yaw, tilt, selected band, facet normal, cut depth, heat, crack risk, polishing state, beam angle, and caustic target position must all matter mechanically.

Recent screenshot variety notes:

- Day 047 is pale emerald/gold with a broad rice-paddy background, dragonfly sprite, dew beads, frog warning arcs, and many cream controls.
- Day 046 is cool navy/charcoal with a central 3D roof model, gold shachi ornament, rain paths, copper chains, and brown/gold controls.
- Day 045 is warm maroon/gold with a large 2D kendama silhouette, red ball, indigo string, fox helper, and toy-stall controls.
- Day 044 is bright cream/cyan with a centered 3D shaved-ice mound, syrup/topping controls, and dessert order card.

Day 048 should contrast with a precise jeweled craft bench: deep ink background, ruby/cobalt/clear glass, white etched grooves, brass tools, mint-blue water cooling, amber lantern beams, star-like caustic spots, and crisp facet highlights. Avoid open rice terraces, insects, dew beads, frogs, silk, roof tiles, rain gutters, chains, toy cups, balls, strings, dessert mounds, syrup, card spreads, cedar trunks, beetles, mushrooms, ceramic shard repair, tatami rectangles, griddles, fish tanks, gears, bridge beams, embroidered thread spheres, fan sectors, steam ducts, floral stems, fruit baskets, lattice strips, stealth cones, tea bowls, launch tubes, pachinko pegs, mochi pads, calligraphy brushes, kite strings, sand rake lines, pearls, drums, rolling mazes, spider webs, pottery wheels, bamboo canal tiles, origami creases, parasol shields, snow blocks, kimono cloth, bento trays, windbell notes, rail tracks, and koi ponds.

## Code isolation / no previous game source

The implementation must be written from scratch for this day. Do not open, inspect, copy, diff, grep, or adapt code from previous games, including old `apps/day-*` folders, old `release/games/NNN/` HTML/CSS/JS files, or old public alias folders. You may inspect previous metadata, prompts, postmortems, and screenshots only to avoid repeating concepts and visual identity. The new game's HTML/CSS/JS must come from this prompt and general browser/Three.js/WebGL/WebAudio game knowledge, not from earlier game implementations.

## Mode variety / 3D cadence

Inspection target: `src/data/games.ts` currently ends with Day 043 `2d`, Day 044 `3d`, Day 045 `2d`, Day 046 `3d`, and Day 047 `2d`. The latest generated-mode streak is one `2d`.

Mode decision: Day 048 is real `3d`. It must implement meaningful spatial gameplay, not decorative perspective:

- Use Three.js/WebGL or equivalent static-browser 3D rendering.
- Render a real 3D kiriko glass object: faceted cup or lantern shade with visible curved silhouette, near/mid/far facet columns, upper/middle/lower bands, selected grooves, cut depth, crack highlights, polishing shimmer, lantern beams, and projected caustic targets.
- Gameplay must depend on 3D state: glass yaw, glass tilt, selected band, selected facet column, facet normal, groove direction, cut depth, wheel pressure, heat/cooling, crack risk, polish quality, beam alignment, caustic target slot, and camera-relative controls.
- Player actions must manipulate the 3D system: Rotate Glass, Tilt Glass, Band −/+, Score Cut, Deepen Cut, Cool Rinse, Polish Facet, Shift Lantern, Catch Caustic, Repair Hairline, Kiriko Focus, pause/restart, audio toggle, and prompt link.
- Portrait mobile is the default supported layout; no landscape gate.

## Design

- Objective: Cut and polish a jewel-toned kiriko glass lantern so lantern beams refract through requested grooves and paint caustic patterns onto three rice-paper target cards before heat cracks the glass.
- Win condition: Complete three atelier commissions — First Star Groove, Cobalt Fan Beam, and Ruby Lantern Constellation — while reaching 6200 points to trigger “Kiriko Prism Illumination”. After the banner, continue into endless glass commissions.
- Lose condition: Three glass-heart lives are lost, crack meter reaches 100%, heat reaches 100%, six lantern beams miss all target cards, two required grooves are cut on the wrong band during the final commission, or polish quality falls below 20% while heat is above 70%.
- Core loop:
  1. Start on a title/menu screen with Day 048 badge, mode badge “3D”, public route `/kiriko/`, best score, best Prism Illumination time, tutorial, prompt link, audio note, and a large Start button.
  2. Show a portrait-friendly 3D atelier stage. The central object is a faceted ruby/cobalt/clear kiriko glass cup or lantern shade on a lacquer workbench. The camera sits slightly above/front; rotation and tilt reveal near, middle, far, left, right, upper, middle, and lower facets.
  3. A commission card requests goals such as: “Score two upper star grooves, deepen one cobalt fan groove, cool below 45%, shift lantern to amber beam, catch three caustics on the right rice-paper card.”
  4. Player rotates and tilts the glass to align facet bands. Selected facets glow with a thin chalk-white outline; invalid hidden/back facets are visible only after rotation.
  5. Band −/+ changes the active cutting band. Each commission has groove directions that only work on specific bands and facet columns.
  6. Score Cut lays a shallow white line along the selected facet. Correct direction and band creates a beam channel; wrong band raises crack risk.
  7. Deepen Cut increases refraction strength and score but also raises heat and crack risk. Deepening on already hot glass can spiderweb the facet.
  8. Cool Rinse sends a mint-blue water sweep across the active band, lowering heat and making the next cut safer. Rinsing during a lantern beam briefly dims caustic scoring.
  9. Polish Facet converts a rough groove into a sparkling clean prism path, increasing caustic accuracy and restoring polish quality. Polishing the wrong facet wastes time.
  10. Shift Lantern moves the amber light source left/center/right or high/low. Beam direction must match the current glass yaw/tilt and groove orientation; it is not an abstract lane switch.
  11. Catch Caustic locks a projected light spot onto the requested rice-paper target card when the beam lands inside the moving target ring.
  12. Repair Hairline stabilizes one cracked facet if applied before the crack flashes red twice. It costs focus and lowers combo but can save a run.
  13. Kiriko Focus, charged by clean cuts, correct caustic catches, timely rinses, and polished grooves, overlays valid groove directions, band requirements, heat risk, crack propagation, lantern beam paths, caustic landing zones, target card order, and the safest next action.
  14. Completing a commission stamps a tiny glassmaker seal, restores one glass heart if below max, awards points, shifts the glass color/facet pattern, and unlocks narrower cuts, crossing beams, moving caustic targets, hotter cutting wheels, asymmetric facets, and stricter polish targets.
  15. Pause/restart remain visible throughout.
- 15+ minute play-value strategy:
  - Save best score, fastest Kiriko Prism Illumination time, fewest cracks, highest perfect-caustic chain, most clean polished facets, highest endless commission, best no-repair run, best no-focus commission, lowest final heat, and collected glassmaker seal badges in localStorage.
  - Include three authored commissions:
    - First Star Groove: front-facing clear glass, broad upper band, two obvious star grooves, slow heat, one fixed target card, guided first Rotate Glass, Band +/−, Score Cut, Cool Rinse, and Catch Caustic. No heart penalty for the first tutorial wrong band.
    - Cobalt Fan Beam: middle/lower bands, first Shift Lantern, first Polish Facet, two angled fan grooves, one hairline warning, moving left target, and required Cool Rinse timing.
    - Ruby Lantern Constellation: full ruby/cobalt glass with near/mid/far facets, two simultaneous lantern beams, required Kiriko Focus preview, one Repair Hairline opportunity, five caustic catches, heat below 55%, and no wrong-band cuts in the final chain.
  - Deterministic Day 048 seed varies facet counts, star/fan groove order, target card positions, beam angle, heat gain, crack warning phase, polish roughness, lantern pulse rhythm, focus charge, and endless constraints while keeping the opening seconds fair.
  - Mastery badges: complete First Star Groove with zero wrong cuts, trigger Prism Illumination under 285 seconds, finish Cobalt Fan Beam with every caustic perfect, clear Ruby Lantern Constellation with cracks below 25%, polish five facets in a row, catch four caustics on one lantern pulse, and complete a commission without Kiriko Focus.
  - Strategic scoring rewards spatial craft planning: rotate before cutting hidden facets, choose the correct band before scoring, rinse before deepening hot grooves, polish only after the groove is useful, shift lantern after aligning facet normals, catch caustics on pulse peaks, and save Repair Hairline for red-flashing cracks rather than panic-spamming.
  - Endless mode after Prism Illumination adds asymmetric glass shapes, shorter heat windows, moving rice-paper targets, split lantern beams, tougher band requirements, rougher polish states, and bonus glassmaker seals without shrinking touch targets.
- Difficulty scaling:
  - 0-45 seconds: front facet, upper band, broad target card, slow heat, visible groove hints.
  - 45-150 seconds: tilted facets, fan grooves, first lantern shift, first polish, first hairline crack.
  - 150-285 seconds: required Kiriko Focus, two beams, moving target, heat/rinse timing, wrong-band pressure.
  - 285+ seconds/endless: more facets, hotter cuts, crossing beams, narrower target rings, same readable controls.
  - Keep mobile fair: glass object, selected facet, bands, groove lines, lantern beams, caustic spots, target cards, crack warnings, commission card, helper, heat/crack/polish HUD, and action buttons must be readable at 390x844; primary touch buttons should be 52px+ where possible and never below 44px; no tiny survival-critical facet labels.
- Scoring/rewards:
  - Correct band/facet selected before cutting: +120 points times combo tier.
  - Score Cut on the requested groove: +280 points and Kiriko Focus charge.
  - Deepen Cut without overheating: +260 points and stronger beam.
  - Cool Rinse before heat warning: +220 points and crack-risk reduction.
  - Polish Facet after a valid groove: +300 points and combo protect.
  - Shift Lantern to align with an active groove: +240 points.
  - Catch Caustic inside target ring on pulse peak: +380 points.
  - Repair Hairline before red flash: +260 points and heart protect.
  - Complete commission before heat warning: +1120 points and restore one glass heart if below max.
  - Perfect no-crack commission: +1600 points.
  - Kiriko Prism Illumination: +3800 points and endless commissions unlock.
  - Wrong band, over-deepened hot cut, missed caustic, unpolished rough groove, or ignored crack: combo reset and heat/crack penalty.

## Controls and layout

- Desktop:
  - Mouse/tap on the 3D glass: select facet, band marker, groove, caustic target, crack, lantern chip, or explainable stage chip.
  - Mouse drag on the stage: rotate glass horizontally and tilt vertically with a visible tool cursor offset above the pointer.
  - Arrow keys or WASD: Rotate Glass left/right and Tilt Glass up/down.
  - Q/E or [ / ]: Band − / Band +.
  - Space or Enter: Score Cut.
  - Shift or D: Deepen Cut.
  - C: Cool Rinse.
  - P: Polish Facet when gameplay focus is on the tool row; Escape or overlay buttons handle pause/resume.
  - L: Shift Lantern.
  - X: Catch Caustic.
  - R: Repair Hairline or restart from results/title context; visible Restart button is always available.
  - F: Kiriko Focus when charged.
- Mobile/touch:
  - Drag horizontally on the stage to rotate the glass. Drag vertically to tilt; the cutter cursor stays above the finger so facets, grooves, beams, and caustic targets remain visible.
  - Tap visible facets, target cards, cracks, or lantern chips to select them, then use large action buttons.
  - Use large Band −, Band +, Rotate Left, Rotate Right, Tilt Up, Tilt Down, Score Cut, Deepen Cut, Cool Rinse, Polish Facet, Shift Lantern, Catch Caustic, Repair Hairline, Kiriko Focus, Pause, Restart, Audio, and Prompt buttons.
  - Tapping heat/crack/polish/focus/commission chips may show short explanations.
  - No tiny virtual joystick. Interaction is direct glass drag/tap plus labeled cutter/action controls.
- Mobile layout/orientation:
  - Default target is portrait phone play around 390x844; do not require landscape.
  - Top: compact Kiriko HUD with score, best, glass hearts, heat %, crack %, polish %, combo, selected band, active facet, lantern position, Kiriko Focus charge, and elapsed time. Use glass/facet/groove/beam/caustic/water/polish/crack/lantern/seal chips, not dragonfly/dew/roof/rain/toy/dessert/card/beetle/mushroom/shard/tatami/cake/fish/gear/bridge/thread/fan/valve/flower/fruit/lattice/tea/firework/koi icons.
  - Below top: atelier commission card with requested grooves, band targets, lantern beam target, caustic count, heat target, progress ticks, and current glassmaster note.
  - Center: tall 3D kiriko glass stage with faceted glass, selected band, groove overlays, cutter wheel trail, lantern beam paths, caustic target cards, crack warnings, helper art, and readable feedback. It must remain playable without zooming.
  - Bottom: status helper plus large cutter/action controls. Controls must not cover the glass, facet selection, beams, target cards, helper, commission card, crack warnings, or Kiriko Focus overlays.
  - Tutorial must fit on the first portrait screen; optional details may be collapsible but objective, Rotate/Tilt, Band −/+, Score Cut, Deepen Cut, Cool Rinse, Polish Facet, Shift Lantern, Catch Caustic, Repair Hairline, Kiriko Focus, pause/restart must be visible.
  - Requests must combine text, icons, groove shapes, band labels, beam arrows, progress ticks, target halos, and labels so hue alone is not required.

## Menu and tutorial

Implement these states:

1. Title screen
   - Shows title “Kiriko Lantern Prism Cutter”.
   - Shows Day 048 badge, mode badge “3D”, public route `/kiriko/`, best score, best Prism Illumination time if available, and a prompt link.
   - Shows a large Start button and visible tutorial panel by default.
   - Notes: “Audio starts after you press Start; visual glass, groove, beam, caustic, heat, crack, polish, lantern, and focus cues work if muted.”
2. Tutorial text
   - Objective: “Rotate the kiriko glass, cut the requested grooves, cool and polish facets, then catch lantern caustics on rice-paper targets.”
   - 3D movement: rotate and tilt before cutting; hidden far facets matter.
   - Cutting: choose the correct band, Score Cut first, Deepen Cut only while heat is safe, and Cool Rinse before cracks spread.
   - Light: Shift Lantern to send beams through polished grooves, then Catch Caustic on target rings.
   - Repairs: Repair Hairline before red cracks flash twice.
   - Kiriko Focus: previews valid groove directions, heat/crack risk, beam paths, target rings, and safest next tool.
   - Pause/restart: visible buttons on mobile or keyboard shortcuts on desktop.
3. In-game HUD
   - Score, best score, glass hearts, heat %, crack %, polish %, commission name, combo, selected band, active facet, lantern position, Kiriko Focus charge, elapsed time, latest warning.
   - Pause/restart controls visible or immediately accessible.
4. Status helper
   - Non-blocking helper showing active band/facet, current tool, groove validity, heat/crack risk, beam alignment, target-card readiness, Kiriko Focus readiness, and expected score effect.
   - Must not cover the 3D glass or bottom controls on mobile.
5. Pause overlay
   - Resume, restart, tutorial reminder, controls summary, audio/mute toggle, prompt link.
6. Game-over/results overlay
   - Final score, best score, commission reached, Prism Illumination status, cracks, heat peak, polished facets, caustic catches, wrong cuts, badges, restart button.
7. Kiriko Prism Illumination banner
   - Trigger once per run after all three commissions and 6200 score.
   - Non-blocking celebration: the glass glows ruby and cobalt, white grooves sparkle, lantern beams split into star caustics, a glassmaker seal stamps the commission card, chimes ring, and endless commissions continue after the banner fades.

## Assets

Prefer Imagegen2 (`openai/gpt-image-2`) for final visual art: glassmaster helper mascot, portrait kiriko atelier background, glass/facet/beam/cutting material sprite sheet, and kiriko action/focus UI icon sheet. Three.js primitives may render the interactive glass geometry, facet grid, groove lines, beam projections, caustic rings, crack overlays, particles, and UI chrome. It should not create final character/background/texture/icon art from scratch unless Imagegen2 is unavailable after a real attempt.

Archive source generated art under `release/games/048/assets/source/` and use optimized playable copies under `release/games/048/assets/`. Also copy optimized playable assets into `apps/day-048-kiriko-lantern-prism-cutter/assets/` and the public alias `release/kiriko/assets/`.

For mobile-first crop safety: keep important content centered, leave 12-16% safe margins, avoid baked-in readable text, avoid watermarks, avoid fake UI labels, avoid tiny facet/groove details that disappear at final in-game size, and keep glass/facet/groove/beam/caustic/water/polish/crack/lantern/seal silhouettes distinct against a dark jewel-toned atelier background.

Generate or provide at least these final art assets:

1. Glassmaster tanuki helper mascot
   - Target: transparent PNG if possible, square source, final optimized texture around 512x512 or 256x256.
   - Archive path: `release/games/048/assets/source/kiriko-helper-source.png`
   - Optimized path: `release/games/048/assets/kiriko-helper.png`
   - Imagegen2 prompt: “A charming small tanuki glassmaster helper mascot for a mobile 3D Edo-kiriko glass cutting arcade game, friendly tanuki artisan wearing an indigo workshop apron and round safety glasses, holding a tiny brass cutting wheel and ruby cut-glass charm, warm lantern rim light, centered readable silhouette, transparent or solid pale rice-paper background, no checkerboard background, no readable text, no watermark, sprite-friendly, high contrast at small size.”
   - Aspect ratio: square.
2. Midnight kiriko glass atelier background source
   - Target: portrait-friendly background suitable behind a large overlaid 3D faceted glass object with open readable center.
   - Archive path: `release/games/048/assets/source/kiriko-atelier-source.png`
   - Optimized path: `release/games/048/assets/kiriko-atelier.png`
   - Imagegen2 prompt: “A midnight Edo-kiriko glass cutting atelier for a portrait mobile 3D arcade game, dark lacquer workbench, ruby and cobalt glass pieces near the edges, brass cutting tools, wet polishing tray, warm paper lanterns, tiny sparkling caustic light spots, deep ink shadows, open readable central space for an overlaid faceted glass object and lantern beams, crop-safe for phone portrait, no central character, no readable text, no watermark.”
   - Aspect ratio: portrait.
3. Kiriko glass, facet, beam, and tool material sprite sheet source
   - Target: square sheet with separated readable materials usable as sprites/decals/textures.
   - Archive path: `release/games/048/assets/source/kiriko-pieces-source.png`
   - Optimized path: `release/games/048/assets/kiriko-pieces.png`
   - Imagegen2 prompt: “Sprite sheet of small readable Edo-kiriko glass cutting game pieces: ruby cut-glass facet, cobalt cut-glass facet, clear glass shard with white groove, brass cutting wheel, mint-blue rinse splash, polishing cloth sparkle, amber lantern beam, star-shaped caustic spot, red hairline crack, rice-paper target card, glass heart, glassmaker seal, each element separated with generous margins, transparent or pale rice-paper background, no checkerboard background, no readable text, no watermark, readable at 40-96 pixels.”
   - Aspect ratio: square.
4. Kiriko action, heat, crack, caustic, and focus UI icon sheet source
   - Target: square icon sheet for objectives, hazards, tools, rewards, and UI decals.
   - Archive path: `release/games/048/assets/source/kiriko-icons-source.png`
   - Optimized path: `release/games/048/assets/kiriko-icons.png`
   - Imagegen2 prompt: “Small readable icon sheet for a Japanese Edo-kiriko glass cutting arcade game: rotate glass arrows, tilt glass, band up/down, score cut wheel, deepen groove, cool rinse splash, polish facet cloth, shift lantern, catch caustic star, repair hairline crack, heat warning, crack meter, polish sparkle, Kiriko Focus prism eye crest, glassmaker seal, Prism Illumination crest, transparent or solid pale rice-paper background, no checkerboard background, high contrast, no readable text, no watermark, generous margins so no icons are cut off.”
   - Aspect ratio: square.

If Imagegen2 is unavailable or fails after a real attempt, create a clearly labeled emergency fallback using simple SVG/Three.js tanuki/glass/facet/beam/icon silhouettes, document the failure in `ai/postmortems/day-048.md`, and still keep source/fallback files under the same asset paths.

### Mandatory generated-image QA

For every generated image, include a real inspection step after generation and before integration:

- Analyze the actual generated file visually, not just the prompt text.
- For the helper mascot, verify transparent/cutout quality or clean background handling, readable tanuki glassmaster silhouette, centered pivot/crop margins, no unwanted text/watermarks, stable upright orientation, and that cutting-wheel/glass-charm pose is compatible with static helper placement.
- For the pieces sheet, verify separated ruby facet, cobalt facet, clear grooved glass, cutting wheel, rinse splash, polish sparkle, lantern beam, caustic spot, hairline crack, target card, glass heart, and seal at final 40-96px size, usable crop margins, no baked checkerboard, no unwanted readable text/watermark, and a documented visual baseline: groove marks are white etched lines, caustics are star-like projected spots, cracks are red branching warnings, rinse is mint-blue, and target cards are rice-paper rectangles.
- Verify control-to-motion alignment in-game: Rotate Glass must visibly yaw the 3D glass, Tilt Up/Down must change facet normals/beam landing, Band −/+ must change highlighted band, Score Cut must draw a new groove, Deepen Cut must thicken/brighten the groove and raise heat, Cool Rinse must visibly sweep the band and lower heat, Polish Facet must add sparkle/accuracy, Shift Lantern must move beam direction, Catch Caustic must lock a projected spot only when aligned, Repair Hairline must stabilize/remove a crack warning, Kiriko Focus must preview valid grooves/heat/beam/target paths, Pause/Restart must work.
- For the background, verify the central glass stage remains readable after portrait mobile crop and does not hide facets, grooves, beams, target cards, commission card, helper, crack warnings, or controls.
- For the icon sheet, verify rotate, tilt, band, score cut, deepen, cool rinse, polish, lantern, caustic, repair, heat, crack, polish, focus, seal, and Prism Illumination icons are distinct at final HUD/button size and cannot be confused. Watch specifically for fake checkerboard transparency; alpha-clean or composite onto pale rice paper if needed and inspect again.
- If inspection finds a problem, regenerate or post-process the image and inspect again. Do not ship broken visual assets just because tests pass.

## Audio and game feel

Because glass cutting, rinse water, polishing, lantern beams, caustic catches, cracks, and chimes are central to the theme, include lightweight WebAudio cues initialized only after a user gesture:

- Soft glass-bench chime when Start begins.
- Tiny brass-wheel rasp when Score Cut fires.
- Deeper glass grind when Deepen Cut succeeds.
- Mint water sweep when Cool Rinse activates.
- Clean sparkle rub when Polish Facet succeeds.
- Warm lantern slide tone when Shift Lantern moves.
- Bright star-chime when Catch Caustic locks a target.
- Sharp warning tick when a hairline crack flashes.
- Low heat shimmer when heat crosses warning thresholds.
- Crystal arpeggio when Kiriko Focus activates.
- Ruby/cobalt bell flourish when Kiriko Prism Illumination triggers.

Audio must not block play if WebAudio is unavailable. Verify no autoplay errors: audio context should be created/resumed only after Start or another user interaction. Include a visible mute toggle in pause/results or HUD. Expose a narrow debug handle such as `window.__day048Audio = { ctx, enabled }` after user-gesture initialization so Playwright can assert audio state.

## Prompt page output

The archived `release/games/048/prompt.html` must be a consistent rendered HTML page, not raw Markdown pasted into a `<pre>` block. It should include:

- A clear `<title>` and `<h1>` using `Day 048 Game Generation Prompt`.
- A back-to-game link near the top.
- Semantic rendered sections (`h2`, `h3`, `ul/ol/li`, `p`, `pre/code` only for actual code/commands).
- The same readable prompt-page style pattern across days so prompt pages feel like one system.

## Subagents to dispatch

1. Implementation subagent
   - Build the static 3D game under `apps/day-048-kiriko-lantern-prism-cutter/`.
   - Integrate it into immutable release output under `release/games/048/`.
   - Create the public playable route under `release/kiriko/`.
   - Use static HTML/CSS/JS with Three.js/WebGL/WebAudio and no backend.
   - The public alias must be self-contained or asset paths must be alias-safe.
   - If vendoring `three.module*.js`, also copy the matching `three.core*.js` beside it in the app, release archive, and `/kiriko/` alias assets.
2. Asset/polish subagent
   - Generate/prepare Imagegen2 assets, archive source files, optimize playable copies, inspect generated images, remove fake checkerboards if present, document glass/facet/groove/beam/caustic visual baselines, and tune mobile readability/game feel.
3. QA/browser/mobile subagent
   - Run desktop and mobile smoke checks, verify no console errors, verify menu/tutorial/objective/controls/restart/pause, prompt links, 3D glass render, Rotate Glass, direct stage drag, Tilt Up/Down, Band −/+, Score Cut, Deepen Cut, Cool Rinse, Polish Facet, Shift Lantern, Catch Caustic, Repair Hairline, Kiriko Focus control presence and visible mechanical effect, heat/crack/polish/beam/caustic/commission feedback, generated screenshot, generated assets, WebAudio initialization after user gesture, and 390x844 portrait layout.
4. Reflection/self-improvement subagent
   - Write `ai/postmortems/day-048.md` after validation with what worked, what failed, generated-image inspection notes, glass/facet/groove/beam/caustic visual baseline, audio verification, code-isolation confirmation, and whether generator/template/rubric improvements are justified.

## Acceptance criteria

- Static build passes.
- Code isolation is documented in QA/postmortem: no previous game implementation code was opened, inspected, copied, diffed, grepped, or adapted.
- Mode choice follows the cadence rule: Day 048 is real `3d` after Day 047 `2d`, with meaningful glass rotation/tilt, facet selection, band choice, groove cutting, heat/cooling, polishing, lantern beams, caustic targets, crack risk, and focus mechanics rather than decorative perspective.
- Desktop smoke passes.
- Mobile portrait smoke passes at about 390x844 with readable HUD/tutorial/commission card, usable 44px+ glass/action/pause/restart controls, no forced landscape canvas, and no tiny survival-critical facet labels.
- Prompt is visible from gallery and release folder.
- `prompts/day-048.md` is copied exactly to `release/games/048/prompt.md` and `release/kiriko/prompt.md`.
- `release/games/048/prompt.html` and `release/kiriko/prompt.html` render the prompt in browser-readable semantic HTML with the standard prompt-page styling, not a raw Markdown `<pre>` dump.
- Public alias `release/kiriko/index.html`, `release/kiriko/prompt.html`, `release/kiriko/screenshot.png`, and `release/kiriko/assets/` exist and work.
- Gallery card for Day 048 shows prompt availability, generation duration, public `/kiriko/` links, mode `3d`, and actual generated date.
- Screenshot exists at `release/games/048/screenshot.png` and is non-empty/readable. Prefer a readable desktop gameplay screenshot for gallery cards; mobile screenshots are QA evidence unless the design is intentionally portrait-card friendly.
- Image/source assets exist under `release/games/048/assets/source/` and optimized assets exist under `release/games/048/assets/`, or a documented emergency fallback exists.
- Every generated image has an inspection note in the postmortem or QA notes; interactive glass/facet/groove/beam/caustic visuals have verified background handling, orientation/pivot/crop, readability, and control-to-motion alignment.
- WebAudio initializes after user gesture and creates no autoplay console errors; audio is failsafe if unsupported and visual glass/groove/beam/caustic/commission cues remain playable muted.
- No console errors during desktop or mobile smoke. Add data-URI favicons to game and prompt pages if needed to avoid favicon request noise.
- Existing `release/games/001/**` through `release/games/047/**` from origin/main remain unchanged.
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
# Screenshot/static checks: verify release/games/048/screenshot.png, prompt.md, prompt.html, index.html, game.js, styles.css, release/kiriko/index.html, release/kiriko/prompt.html, release/kiriko/screenshot.png, optimized assets, source assets, and vendored Three.js files (if used) exist and are non-empty.
# Prompt copy check: cmp prompts/day-048.md release/games/048/prompt.md and cmp prompts/day-048.md release/kiriko/prompt.md.
# Prompt HTML check: verify release/games/048/prompt.html has semantic h1/h2/list markup and a back-to-game link, not a raw Markdown dump inside <pre>, and no malformed ul > p or ol > p nodes, no direct nested lists, and no strong/b tags inside code.
# Browser smoke: open the local/static /kiriko/ route and verify menu, tutorial, gameplay start, 3D glass render, Rotate Glass, stage drag, Tilt Up/Down, Band −/+, Score Cut, Deepen Cut, Cool Rinse, Polish Facet, Shift Lantern, Catch Caustic, Repair Hairline, Kiriko Focus, heat/crack/polish/beam/caustic/commission feedback, pause, restart, prompt page, WebAudio after user gesture, no console errors.
# Mobile smoke: repeat at a portrait phone viewport such as 390x844 and verify playable glass/action controls plus readable HUD/commission card/stage/controls.
# Static screenshot check: inspect release/games/048/screenshot.png and release/kiriko/screenshot.png for non-empty readable game content; use vision to judge actual visual quality.
# Image QA: inspect every Imagegen2 source/optimized asset and document the actual inspection result in ai/postmortems/day-048.md.
# Docker/static smoke: build the Docker image locally, run it, curl /kiriko/ and /kiriko/prompt.html, then stop the container.
# Immutable guard: confirm no release/games folders from origin/main changed except new Day 048.
```
