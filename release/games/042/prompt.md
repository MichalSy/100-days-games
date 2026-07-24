# Day 042 Game Generation Prompt

## Game identity

- Day: 042
- Title: Kabuto Cedar Canopy Climber
- Slug: kabuto-cedar-canopy-climber
- Public route word: kabuto
- Mode: 3D
- Genre: mobile-first 3D vertical climbing arcade / bark-orbit navigation / canopy-rescue score chase
- Mood/style: dawn sunlight high in a Japanese cedar canopy, massive bark columns, mossy ledges, glossy kabutomushi beetle shell, amber sap beads, fluttering leaves, tanuki rope flags far below, tiny suzumushi cricket guide, tactile claw-grip and wing-buzz feedback; a vertical spatial action game rather than mycelium network routing, kintsugi shard repair, tatami room layout, okonomiyaki cooking, goldfish scooping, karakuri gears, bridge trusses, temari thread orbits, fan dyeing, onsen valves, ikebana, orchard harvesting, kumiko woodworking, shrine stealth, matcha whisking, fireworks, pachinko, mochi hopping, calligraphy, kite mapping, dry-garden raking, underwater pearls, taiko routing, daruma tilting, web weaving, pottery shaping, canal routing, origami folding, parasol sheltering, snow stacking, kimono stamping, bento service, windbell tuning, rail running, or koi collection.

## Why this game today

The generated series currently ends with:

- Day 038 `3d`: Yatai Okonomiyaki Flipmaster, warm night-market griddle, 3D cakes, heat lanes, smoke, sauce, toppings, shiba helper.
- Day 039 `2d`: Tatami Moonroom Matwright, moonlit washitsu grid, mat rectangles, grain arrows, seam/path rules, calico helper.
- Day 040 `3d`: Kohaku Kintsugi Star Mender, dark lacquer repair tray, 3D porcelain shards, gold seams, clamps, dust, sparrow helper.
- Day 041 `2d`: Kinoko Mycelium Glowkeeper, dark cedar forest floor, glowing network branches, mushroom caps, dew, beetles, kodama helper.

The latest generated-mode streak is one `2d` (Day 041), so Day 042 deliberately returns to real `3D` to keep the cadence strong and to contrast with Day 041's flat forest-floor network. It should move the camera and play space upward: a vertical cedar trunk with cylindrical depth, orbital movement around the bark, branch ledges projecting toward/away from the camera, leap arcs, claw grip, sap-route choices, falling leaf gusts, and a rescue ascent toward a canopy bell.

Recent screenshot/visual variety notes to avoid repeating:

- Day 041 used a dark green board, glowing mycelium lines, mushroom nodes, beetle hazards as tiny 2D dots, a compact top HUD, commission card, and dense bottom controls.
- Day 040 used a dark purple/amber workbench, oval tray, porcelain shards, gold seams, side control column, and sparrow helper.
- Day 039 used top-down green-gold tatami rectangles, shoji room framing, seam/path overlays, and calico helper.
- Day 038 used a black griddle with warm amber/brown lighting, three heat lanes, cakes, steam, and shiba helper.

Day 042 should contrast by using a bright dawn vertical composition: sky-blue gaps between cedar trunks, tall bark texture, leaf shadows, golden sap beads, red-white climbing flags, shell reflections, and strong up/down motion. Avoid glowing underground networks, mushroom caps as objectives, porcelain shards/trays/gold lacquer, rectangular room/mat grids, griddles/cakes/sauce/smoke, water tanks/fish/nets/bowls/ripples, gear teeth/axles/couplers/bells, bridges/rivers/bamboo trusses, centered thread spheres, radial pigment fans, valve ducts, floral stems, orchard fruit baskets, wooden lattice strips, stealth cones, tea foam, firework arcs, pachinko pegs, mochi platforms, brush-calligraphy tracing, kite strings, sand rakes, underwater routes, taiko pads, maze boards, spider web strands, pottery profiles, bamboo canal tiles, origami crease grids, parasols, snow blocks, kimono panels, conveyor food, windbell notes, rail tracks, or koi ponds.

## Code isolation / no previous game source

The implementation must be written from scratch for this day. Do not open, inspect, copy, diff, grep, or adapt code from previous games, including old `apps/day-*` folders, old `release/games/NNN/` HTML/CSS/JS files, or old public alias folders. You may inspect previous metadata, prompts, postmortems, and screenshots only to avoid repeating concepts and visual identity. The new game's HTML/CSS/JS must come from this prompt and general browser/Three.js/WebGL/WebAudio game knowledge, not from earlier game implementations.

## Mode variety / 3D cadence

Inspection target: `src/data/games.ts` currently ends with Day 038 `3d`, Day 039 `2d`, Day 040 `3d`, and Day 041 `2d`. The latest generated-mode streak is one `2d`.

Mode decision: Day 042 is real `3d`. It must implement meaningful spatial gameplay, not decorative perspective:

- Use Three.js/WebGL or equivalent static-browser 3D rendering.
- Render a real vertical 3D cedar-climbing stage with a cylindrical trunk, visible camera depth, wrap-around left/right orbit lanes, foreground/background branch ledges, bark ridges, sap beads at different heights/depths, wind leaves, hazard beetles/woodpecker shadows, and a canopy bell target.
- Gameplay must depend on 3D state: height, angular position around the trunk, depth lane, grip stamina, leap trajectory, branch distance, wind direction, bark slickness, sap chain route, shell charge, hazard approach angle, and camera-relative controls.
- Player actions must manipulate the 3D system: climb up/down, orbit left/right around the trunk, leap to side branches, lock claw grip, charge horn, dash through sap lines, fan wings to slow falls, use Canopy Focus to preview reachable ledges/wind/hazards, pause/restart, and inspect tutorial hints.
- Portrait mobile is the default supported layout; no landscape gate.

## Design

- Objective: Guide a glossy kabutomushi climber up a towering cedar, collect ordered amber sap beads, rescue scattered lantern firefly charms from branch ledges, dodge falling leaves and woodpecker shadows, manage claw grip, and ring the canopy bell before dusk haze rolls in.
- Win condition: Complete three ascent commissions — First Bark Grip, Sap Spiral Crossing, and Grand Canopy Bell — while reaching 5600 points to trigger “Kabuto Dawn Canopy Ring”. After the banner, continue into endless cedar ascents.
- Lose condition: Three shell hearts crack, grip stamina reaches 0 while airborne/falling, the beetle misses five leap-safe ledges, hazard strikes reach three in one ascent, dusk haze reaches 100%, or Grand Canopy Bell receives the wrong sap order twice.
- Core loop:
  1. Start on a title/menu screen with Day 042 badge, mode badge “3D”, public route `/kabuto/`, best score, best Canopy Ring time, tutorial, prompt link, audio note, and a large Start button.
  2. Show a portrait-friendly vertical cedar trunk stage. The trunk rises through the center; branch ledges and sap beads wrap around the cylinder in near/mid/far depth bands. Camera follows the beetle upward.
  3. An ascent card requests goals such as: “Collect blue-tag sap → gold-tag sap → red-tag sap, rescue 2 firefly charms, keep grip above 35%, avoid two leaf gusts, ring the bell before haze 80%.”
  4. Player selects the active route by moving the beetle directly. Orbit Left/Right wraps around the trunk; the beetle visibly travels around the cylindrical surface and can hide behind/peek around bark curvature.
  5. Climb Up/Down moves along the trunk. Climbing drains grip slowly on slick bark and restores small grip on moss pads.
  6. Leap Branch launches a short 3D arc toward a highlighted side branch or bark ledge. Good timing lands on gold reach rings; bad timing slides down but Fan Wings can save the fall.
  7. Lock Claws spends stamina to cling safely during gusts, woodpecker shadows, or while planning the next leap.
  8. Charge Horn builds a short forward burst that breaks brittle bark flakes, bumps rival beetles away, and collects a tight sap line. Overcharging overheats the shell and costs a shell-heart if released into stone-hard bark.
  9. Sap Dash converts collected sap into a fast climb along the next glowing sap vein. It must be aimed in the current angular lane; wrong-lane dashes miss beads and waste sap.
  10. Fan Wings slows falls, pushes the beetle outward from the trunk, and briefly reveals hidden firefly charms behind leaves. It has a cooldown and should be verified visually.
  11. Canopy Focus, charged by clean landings, ordered sap, and charm rescues, overlays reachable ledges, leap arcs, sap order labels, wind arrows, safe grip pockets, next best route, hazard cones, and bell distance.
  12. Completing an ascent stamps a cedar-shell seal, restores one shell heart if needed, awards points, changes trunk geometry and constraints, and unlocks forked branches, stronger gusts, slick rain bark, rival beetles, moving woodpecker shadows, and multi-sap route choices.
  13. Pause/restart remain visible throughout.
- 15+ minute play-value strategy:
  - Save best score, fastest Kabuto Dawn Canopy Ring time, longest perfect landing chain, highest endless canopy, fewest missed leaps, most firefly charms rescued, highest final grip, longest sap dash chain, most hazard-free ascents, and collected cedar-shell seal badges in localStorage.
  - Include three authored ascent commissions:
    - First Bark Grip: low cedar segment, broad orbit lanes, three sap beads, one moss rest pad, guided first Orbit Right, Climb Up, and Leap Branch, no shell-heart penalty for the first tutorial slide.
    - Sap Spiral Crossing: taller trunk with wrap-around sap order, first firefly charm rescue, first leaf gust, required Lock Claws during warning, and one branch ledge in the far depth band.
    - Grand Canopy Bell: high trunk segment with split sap routes, two charms, woodpecker shadow sweep, required Canopy Focus preview, grip target above 35%, and final leap to a hanging bell.
  - Deterministic Day 042 seed varies trunk ridge positions, angular sap lanes, branch height/depth, moss-rest pockets, gust timing, charm positions, horn charge rate, shell heat, sap dash speed, focus charge, bell route, and endless constraints while keeping opening seconds fair.
  - Mastery badges: complete First Bark Grip with zero slides, trigger Canopy Ring under 285 seconds, finish Sap Spiral with all charms, reach Grand Canopy with grip above 60%, collect five sap beads in one dash chain, land three branch leaps perfectly, and avoid all woodpecker shadows.
  - Strategic scoring rewards spatial planning: orbit to line up sap lanes before climbing, rest on moss pads before long slick sections, save Lock Claws for gust warnings, leap only when reach ring is gold, Fan Wings before falling past a charm, use Charge Horn for rival beetles and brittle flakes, and save Canopy Focus for split branch routes.
  - Endless mode after Canopy Ring adds taller trunks, offset branch rings, hidden charms, stronger crosswinds, bark flakes, rival beetle pushes, alternating sap order, shorter haze timer, and bonus shrine-rope flags without shrinking touch controls.
- Difficulty scaling:
  - 0-45 seconds: short trunk, broad orbit and leap tolerances, slow haze, visible sap order labels, forgiving grip.
  - 45-150 seconds: taller trunk, first branch leap, one gust, first charm rescue, sap order matters, Lock Claws introduced.
  - 150-285 seconds: split routes, required Canopy Focus, woodpecker shadow timing, slick bark, final bell leap, tighter grip target.
  - 285+ seconds/endless: more angular lanes, hidden depth ledges, stronger wind, rival beetles, same readable controls.
  - Keep mobile fair: beetle, trunk, sap beads, ledges, reach rings, gust arrows, hazard shadows, ascent card, grip meter, helper, and action buttons must be readable at 390x844; primary touch buttons should be 52px+ where possible and never below 44px; no tiny survival-critical ledges.
- Scoring/rewards:
  - Climb into correct sap lane: +130 points times combo tier.
  - Ordered sap bead collected: +230 points and Canopy Focus charge.
  - Perfect branch leap landing: +280 points and grip restore.
  - Firefly charm rescued: +360 points.
  - Lock Claws through a gust without sliding: +190 points.
  - Charge Horn clears hazard/rival cleanly: +220 points.
  - Sap Dash collects a chain: +150 per bead plus chain bonus.
  - Complete ascent before haze warning: +980 points and restore one shell heart if below max.
  - Perfect no-slide ascent: +1450 points.
  - Kabuto Dawn Canopy Ring: +3200 points and endless ascents unlock.
  - Wrong sap order, missed leap, overcharged horn, or hazard strike: combo reset, grip/haze/shell penalty.

## Controls and layout

- Desktop:
  - Mouse/tap on trunk or branch: steer toward angular lane/ledge, select reachable target, press controls, start/pause overlay button, prompt link, or explainable HUD chips.
  - Mouse drag on the 3D stage: orbit the beetle around the trunk and preview a leap direction with a visible thumb/mouse offset.
  - Arrow keys or WASD: Climb Up/Down and Orbit Left/Right.
  - Space or Enter: Leap Branch.
  - C or L: Lock Claws.
  - H: Charge Horn / release horn burst.
  - D: Sap Dash when sap charge is ready.
  - F: Fan Wings.
  - Shift or G: Canopy Focus when charged.
  - P: pause/resume.
  - R: restart current run.
- Mobile/touch:
  - Drag vertically on the stage to climb and horizontally to orbit; the beetle keeps a visible offset above the finger.
  - Tap highlighted branch ledges to preview/launch Leap Branch when reachable.
  - Use large Climb Up, Climb Down, Orbit Left, Orbit Right, Leap Branch, Lock Claws, Charge Horn, Sap Dash, Fan Wings, Canopy Focus, Pause, Restart, Audio, and Prompt buttons.
  - Tapping grip/sap/wind/hazard/focus chips may show short explanations.
  - No tiny virtual joystick. Interaction is direct trunk drag plus labeled climbing/action controls.
- Mobile layout/orientation:
  - Default target is portrait phone play around 390x844; do not require landscape.
  - Top: compact Kabuto HUD with score, best, shell hearts, grip %, haze %, combo, height, active lane, sap order, hazard risk, Canopy Focus charge, and elapsed time. Use beetle/sap/claw/wing/leaf/bell/shell chips, not mushroom/root/dew/spore/kintsugi/tatami/cake/fish/gear/bridge/thread/fan-dye/valve/flower/fruit/lattice/shrine/tea-foam/firework/cat-coin/rabbit/brush/kite/sand/pearl/drum icons.
  - Below top: ascent commission card with requested sap order, charm rescue count, grip target, hazard warnings, bell distance, progress ticks, and current route hint.
  - Center: tall 3D cedar climbing stage with trunk cylinder, beetle, branch ledges, sap beads, reach rings, firefly charms, leaf gusts, woodpecker shadows, helper art, and readable feedback. It must remain playable without zooming.
  - Bottom: status helper plus large climbing/action controls. Controls must not cover beetle, sap beads, branch ledges, reach previews, commission card, helper, or hazards.
  - Tutorial must fit on the first portrait screen; optional details may be collapsible but objective, climb/orbit, Leap Branch, Lock Claws, Charge Horn, Sap Dash, Fan Wings, Canopy Focus, pause/restart must be visible.
  - Requests must combine text, icons, bead shapes, route rings, motion arrows, progress ticks, and labels so hue alone is not required.

## Menu and tutorial

Implement these states:

1. Title screen
   - Shows title “Kabuto Cedar Canopy Climber”.
   - Shows Day 042 badge, mode badge “3D”, public route `/kabuto/`, best score, best Canopy Ring time if available, and a prompt link.
   - Shows a large Start button and visible tutorial panel by default.
   - Notes: “Audio starts after you press Start; visual climb, grip, sap, wind, hazard, and bell cues work if muted.”
2. Tutorial text
   - Objective: “Climb the cedar, collect sap in order, rescue firefly charms, and ring the canopy bell before grip and daylight fade.”
   - Movement: climb up/down and orbit around the trunk; sap lanes wrap around the cedar cylinder.
   - Leaps: use Leap Branch only when the reach ring turns gold; Fan Wings can slow a fall.
   - Safety: Lock Claws during leaf gusts and woodpecker shadows; Charge Horn clears brittle bark and rival beetles.
   - Sap: collect ordered sap beads, then use Sap Dash along a glowing vein for score chains.
   - Canopy Focus: previews reachable ledges, wind, hazards, sap order, and the safest route when charged.
   - Pause/restart: P/R on desktop or visible buttons on mobile.
3. In-game HUD
   - Score, best score, shell hearts, grip %, haze %, ascent name, combo, height, active lane, next sap, hazard risk, Canopy Focus charge, elapsed time, latest warning.
   - Pause/restart controls visible or immediately accessible.
4. Status helper
   - Non-blocking helper showing current lane, next ledge, sap order hint, grip warning, wind warning, hazard warning, Canopy Focus readiness, and expected score effect.
   - Must not cover the 3D climbing stage or bottom controls on mobile.
5. Pause overlay
   - Resume, restart, tutorial reminder, controls summary, audio/mute toggle, prompt link.
6. Game-over/results overlay
   - Final score, best score, ascent reached, Canopy Ring status, missed leaps, charms rescued, sap chains, hazards avoided, grip finish, badges, restart button.
7. Kabuto Dawn Canopy Ring banner
   - Trigger once per run after all three ascent commissions and 5600 score.
   - Non-blocking celebration: sunrise beams flare through the cedar needles, sap beads sparkle into a spiral, the beetle taps the hanging bell, the cricket guide bows on a leaf, and endless ascents continue after the banner fades.

## Assets

Prefer Imagegen2 (`openai/gpt-image-2`) for final visual art: glossy kabutomushi climber hero, portrait cedar canopy climbing background, bark/sap/leaf/charm/hazard material sprite sheet, and beetle/claw/sap/wing/wind/bell UI icon sheet. Three.js primitives may render the interactive trunk cylinder, beetle proxy mesh, branch ledges, sap beads, reach rings, wind arrows, hazard shadows, particles, and UI chrome. It should not create final character/background/texture/icon art from scratch unless Imagegen2 is unavailable after a real attempt.

Archive source generated art under `release/games/042/assets/source/` and use optimized playable copies under `release/games/042/assets/`. Also copy optimized playable assets into `apps/day-042-kabuto-cedar-canopy-climber/assets/` and the public alias `release/kabuto/assets/`.

For mobile-first crop safety: keep important content centered, leave 12-16% safe margins, avoid baked-in text, avoid watermarks, avoid fake UI labels, avoid tiny bark details that disappear at final in-game size, and keep beetle/sap/branch/leaf/gust/charm/bell/hazard/focus silhouettes distinct against bright dawn cedar backgrounds.

Generate or provide at least these final art assets:

1. Kabutomushi climber hero mascot
   - Target: transparent PNG if possible, square source, final optimized texture around 512x512 or 256x256.
   - Archive path: `release/games/042/assets/source/kabuto-hero-source.png`
   - Optimized path: `release/games/042/assets/kabuto-hero.png`
   - Imagegen2 prompt: “A charming glossy Japanese rhinoceros beetle kabutomushi hero for a mobile 3D cedar canopy climbing arcade game, cute but athletic beetle with polished dark chestnut shell, small golden scarf flag, bright friendly eyes, strong horn silhouette, tiny clawed feet gripping bark, dawn sunlight rim light, centered readable silhouette, transparent or solid warm parchment background, no checkerboard background, no text, no watermark, sprite-friendly, high contrast at small size.”
   - Aspect ratio: square.
2. Dawn cedar canopy climbing background source
   - Target: portrait-friendly background suitable behind a tall 3D trunk with open readable center.
   - Archive path: `release/games/042/assets/source/kabuto-canopy-source.png`
   - Optimized path: `release/games/042/assets/kabuto-canopy.png`
   - Imagegen2 prompt: “A bright dawn Japanese cedar forest canopy for a portrait mobile 3D climbing arcade game, tall cedar trunks rising upward, blue morning sky gaps, gold sunbeams through needles, mossy branch ledges at edges, hanging shimenawa rope flags far above, amber sap glints, open readable central vertical space for an overlaid 3D climbing trunk, crop-safe for phone portrait, no central character, no readable text, no watermark.”
   - Aspect ratio: portrait.
3. Bark, sap, leaf, charm, and hazard sprite sheet source
   - Target: square sheet with separated readable materials that can be used as textures/decals.
   - Archive path: `release/games/042/assets/source/kabuto-pieces-source.png`
   - Optimized path: `release/games/042/assets/kabuto-pieces.png`
   - Imagegen2 prompt: “Sprite sheet of small readable cedar canopy climbing game pieces: rough cedar bark patch, moss rest pad, amber sap bead, blue-tag sap bead, red-tag sap bead, firefly lantern charm, falling green leaf, brittle bark flake, rival tiny beetle, woodpecker shadow mark, golden reach ring, small hanging bell, each element separated with generous margins, transparent or warm parchment background, no checkerboard background, no text, no watermark, readable at 40-96 pixels.”
   - Aspect ratio: square.
4. Kabuto claw, sap, wing, wind, hazard, and focus UI icon sheet source
   - Target: square icon sheet for objectives, hazards, tools, rewards, and UI decals.
   - Archive path: `release/games/042/assets/source/kabuto-icons-source.png`
   - Optimized path: `release/games/042/assets/kabuto-icons.png`
   - Imagegen2 prompt: “Small readable icon sheet for a Japanese kabutomushi cedar climbing arcade game: beetle shell, claw grip, climb arrow, orbit arrow around trunk, leap branch arc, horn charge, sap dash bead, fan wings, leaf gust, woodpecker warning shadow, firefly charm, moss rest, shell heart, Canopy Focus cedar-bell emblem, cedar-shell seal, Grand Canopy Bell crest, transparent or solid warm parchment background, no checkerboard background, high contrast, no text, no watermark, generous margins so no icons are cut off.”
   - Aspect ratio: square.

If Imagegen2 is unavailable or fails after a real attempt, create a clearly labeled emergency fallback using simple SVG/Three.js beetle/bark/sap/leaf/charm/bell/icon silhouettes, document the failure in `ai/postmortems/day-042.md`, and still keep source/fallback files under the same asset paths.

### Mandatory generated-image QA

For every generated image, include a real inspection step after generation and before integration:

- Analyze the actual generated file visually, not just the prompt text.
- For the kabutomushi hero, verify transparent/cutout quality or clean background handling, readable horn/shell silhouette, centered pivot/crop margins, no unwanted text/watermarks, stable upright/head-up climbing orientation, and that the claw pose is compatible with trunk climbing placement and movement.
- For the pieces sheet, verify separated bark, moss, amber/blue/red sap beads, firefly charm, falling leaf, brittle bark, rival beetle, woodpecker shadow, reach ring, and bell elements at final 40-96px size, usable crop margins, no baked checkerboard, no unwanted text/watermark, and a documented visual baseline: beetle head/horn points upward by default; sap beads are round route collectibles; reach rings are gold landing targets.
- Verify control-to-motion alignment in-game: Climb Up/Down must move the beetle vertically, Orbit Left/Right must visibly wrap it around the cylindrical trunk, Leap Branch must show an arc and land/fall, Lock Claws must visibly cling/reduce slide, Charge Horn must show a buildup/release, Sap Dash must move along a glowing vein, Fan Wings must slow fall/reveal charm, Canopy Focus must preview routes/hazards, Pause/Restart must work.
- For the background, verify the central trunk remains readable after portrait mobile crop and does not hide beetle, sap beads, ledges, commission card, helper, hazards, or controls.
- For the icon sheet, verify beetle shell, claw, climb, orbit, leap, horn, sap dash, wing, leaf gust, woodpecker warning, firefly charm, moss, shell heart, Canopy Focus, cedar-shell seal, and Grand Bell crest are distinct at final HUD/button size and cannot be confused. Watch specifically for fake checkerboard transparency; alpha-clean or composite onto warm parchment if needed and inspect again.
- If inspection finds a problem, regenerate or post-process the image and inspect again. Do not ship broken visual assets just because tests pass.

## Audio and game feel

Because claw taps, wing buzzes, sap pops, bark scraping, leaf gusts, and the canopy bell are central to the theme, include lightweight WebAudio cues initialized only after a user gesture:

- Soft claw tap when selecting/starting a climb.
- Bark scratch loop or short scrape when Climb Up/Down moves.
- Wrapped whoosh when Orbit Left/Right crosses depth lanes.
- Elastic leap chirp and landing thud for Leap Branch.
- Claw-lock click when Lock Claws succeeds.
- Rising shell hum for Charge Horn and crisp knock on release.
- Sweet sap pop/shimmer when Sap Dash or ordered sap collection succeeds.
- Wing flutter when Fan Wings slows a fall.
- Dry leaf rustle warning for gusts and woodpecker shadow low knock.
- Bright cedar-bell flourish when Kabuto Dawn Canopy Ring triggers.

Audio must not block play if WebAudio is unavailable. Verify no autoplay errors: audio context should be created/resumed only after Start or another user interaction. Include a visible mute toggle in pause/results or HUD. Expose a narrow debug handle such as `window.__day042Audio = { ctx, enabled }` after user-gesture initialization so Playwright can assert audio state.

## Prompt page output

The archived `release/games/042/prompt.html` must be a consistent rendered HTML page, not raw Markdown pasted into a `<pre>` block. It should include:

- A clear `<title>` and `<h1>` using `Day 042 Game Generation Prompt`.
- A back-to-game link near the top.
- Semantic rendered sections (`h2`, `h3`, `ul/ol/li`, `p`, `pre/code` only for actual code/commands).
- The same readable prompt-page style pattern across days so prompt pages feel like one system.

## Subagents to dispatch

1. Implementation subagent
   - Build the static 3D game under `apps/day-042-kabuto-cedar-canopy-climber/`.
   - Integrate it into immutable release output under `release/games/042/`.
   - Create the public playable route under `release/kabuto/`.
   - Use static HTML/CSS/JS with Three.js/WebGL/WebAudio and no backend.
   - The public alias must be self-contained or asset paths must be alias-safe.
   - If vendoring `three.module*.js`, also copy the matching `three.core*.js` beside it in the app, release archive, and `/kabuto/` alias assets.
2. Asset/polish subagent
   - Generate/prepare Imagegen2 assets, archive source files, optimize playable copies, inspect generated images, remove fake checkerboards if present, document beetle orientation/sap/reach-ring visual baselines, and tune mobile readability/game feel.
3. QA/browser/mobile subagent
   - Run desktop and mobile smoke checks, verify no console errors, verify menu/tutorial/objective/controls/restart/pause, prompt links, 3D cedar trunk render, Climb Up/Down, Orbit Left/Right, direct stage drag, Leap Branch, Lock Claws, Charge Horn, Sap Dash, Fan Wings, Canopy Focus control presence and visible mechanical effect, grip/sap/wind/hazard/bell feedback, generated screenshot, generated assets, WebAudio initialization after user gesture, and 390x844 portrait layout.
4. Reflection/self-improvement subagent
   - Write `ai/postmortems/day-042.md` after validation with what worked, what failed, generated-image inspection notes, beetle orientation/sap/reach-ring visual baseline, audio verification, code-isolation confirmation, and whether generator/template/rubric improvements are justified.

## Acceptance criteria

- Static build passes.
- Code isolation is documented in QA/postmortem: no previous game implementation code was opened, inspected, copied, diffed, grepped, or adapted.
- Mode choice follows the cadence rule: Day 042 is real `3d` after Day 041 `2d`, with meaningful cylindrical trunk/orbit/height/depth/leap/grip mechanics rather than decorative perspective.
- Desktop smoke passes.
- Mobile portrait smoke passes at about 390x844 with readable HUD/tutorial/ascent card, usable 44px+ climb/action/pause/restart controls, no forced landscape canvas, and no tiny survival-critical ledges.
- Prompt is visible from gallery and release folder.
- `prompts/day-042.md` is copied exactly to `release/games/042/prompt.md` and `release/kabuto/prompt.md`.
- `release/games/042/prompt.html` and `release/kabuto/prompt.html` render the prompt in browser-readable semantic HTML with the standard prompt-page styling, not a raw Markdown `<pre>` dump.
- Public alias `release/kabuto/index.html`, `release/kabuto/prompt.html`, `release/kabuto/screenshot.png`, and `release/kabuto/assets/` exist and work.
- Gallery card for Day 042 shows prompt availability, generation duration, public `/kabuto/` links, mode `3d`, and actual generated date.
- Screenshot exists at `release/games/042/screenshot.png` and is non-empty/readable. Prefer a readable desktop gameplay screenshot for gallery cards; mobile screenshots are QA evidence unless the design is intentionally portrait-card friendly.
- Image/source assets exist under `release/games/042/assets/source/` and optimized assets exist under `release/games/042/assets/`, or a documented emergency fallback exists.
- Every generated image has an inspection note in the postmortem or QA notes; interactive beetle/trunk/sap/ledge/wind/hazard visuals have verified background handling, orientation/pivot/crop, readability, and control-to-motion alignment.
- WebAudio initializes after user gesture and creates no autoplay console errors; audio is failsafe if unsupported and visual climb/grip/sap/wind/hazard/order cues remain playable muted.
- No console errors during desktop or mobile smoke. Add data-URI favicons to game and prompt pages if needed to avoid favicon request noise.
- Existing `release/games/001/**` through `release/games/041/**` from origin/main remain unchanged.
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
# Screenshot/static checks: verify release/games/042/screenshot.png, prompt.md, prompt.html, index.html, game.js, styles.css, release/kabuto/index.html, release/kabuto/prompt.html, release/kabuto/screenshot.png, optimized assets, source assets, and vendored Three.js files (if used) exist and are non-empty.
# Prompt copy check: cmp prompts/day-042.md release/games/042/prompt.md and cmp prompts/day-042.md release/kabuto/prompt.md.
# Prompt HTML check: verify release/games/042/prompt.html has semantic h1/h2/list markup and a back-to-game link, not a raw Markdown dump inside <pre>, and no malformed ul > p or ol > p nodes, no direct nested lists, and no strong/b tags inside code.
# Browser smoke: open the local/static /kabuto/ route and verify menu, tutorial, gameplay start, 3D trunk render, Climb Up/Down, Orbit Left/Right, stage drag, Leap Branch, Lock Claws, Charge Horn, Sap Dash, Fan Wings, Canopy Focus, grip/sap/wind/hazard/bell feedback, pause, restart, prompt page, WebAudio after user gesture, no console errors.
# Mobile smoke: repeat at a portrait phone viewport such as 390x844 and verify playable climb/action controls plus readable HUD/ascent card/stage/controls.
# Static screenshot check: inspect release/games/042/screenshot.png and release/kabuto/screenshot.png for non-empty readable game content; use vision to judge actual visual quality.
# Image QA: inspect every Imagegen2 source/optimized asset and document the actual inspection result in ai/postmortems/day-042.md.
# Docker/static smoke: build the Docker image locally, run it, curl /kabuto/ and /kabuto/prompt.html, then stop the container.
# Immutable guard: confirm no release/games folders from origin/main changed except new Day 042.
```
