# Day 040 Game Generation Prompt

## Game identity

- Day: 040
- Title: Kohaku Kintsugi Star Mender
- Slug: kohaku-kintsugi-star-mender
- Public route word: kohaku
- Mode: 3D
- Genre: mobile-first 3D ceramic shard alignment puzzle / lacquer-flow repair arcade / calm precision score chase
- Mood/style: a quiet lacquer repair atelier at midnight, amber-white porcelain shards hovering over a dark urushi work tray, gold kintsugi seams, star-map crack constellations, silk clamps, warm desk lamp, powdered gold dust, tiny sparrow apprentice helper, tactile rotate-and-snap mending feedback; real 3D shard curvature and seam alignment rather than tatami room layout, okonomiyaki cooking, goldfish scooping, karakuri gears, bridge trusses, temari threads, uchiwa dye, onsen valves, ikebana, orchard harvesting, kumiko screens, shrine stealth, matcha foam, fireworks, pachinko, mochi hopping, calligraphy, kite mapping, dry-garden raking, underwater pearls, taiko routing, daruma tilting, web weaving, pottery-wheel shaping, canal routing, origami folding, parasol sheltering, snow stacking, kimono stamping, bento service, windbell tuning, rail running, or koi collection.

## Why this game today

The generated series currently ends with:

- Day 037 `2d`: Kingyo Poi Festival Scooper, blue-hour festival water tank, fish sprites, poi net, paper wetness, ripples, bowl orders.
- Day 038 `3d`: Yatai Okonomiyaki Flipmaster, warm night-market griddle, 3D heat lanes, cakes, sauce, toppings, smoke, shiba helper.
- Day 039 `2d`: Tatami Moonroom Matwright, moonlit washitsu floor planning, mat rotation, seam clusters, guest path, cat helper.

The latest generated-mode streak is one `2d` (Day 039), so Day 040 deliberately chooses real `3d` to keep the cadence strong. It moves away from interior 2D grid planning and food/water dexterity into a meditative object-repair puzzle: rotate curved ceramic shards in 3D, match crack silhouettes on a bowl armature, brush gold lacquer through seam channels, clamp fragile joints, and complete constellation-like repairs before lacquer skin forms.

Recent screenshot/visual variety notes to avoid repeating:

- Day 039 used top-down green-gold tatami rectangles, room cards, seam/path overlays, shoji moonbeams, and a calico helper.
- Day 038 used black griddle lanes, round cakes, amber cooking light, topping buttons, smoke, and a shiba helper.
- Day 037 used indigo water, fish sprites, circular scoop rings, paper wetness, lantern reflections, and bowl targets.

Day 040 should use a close, sculptural 3D repair bench: a broken porcelain tea bowl or moon dish represented by curved shard meshes, floating crack-edge outlines, gold seam channels, tiny lacquer brush, silk clamp ribbons, lacquer viscosity meter, dust specks, star-map guide, and a sparrow apprentice helper. Avoid rectangular room/mat planning, griddle/cake/topping/smoke cooking surfaces, water tanks/fish/nets/bowls/ripples, gear teeth/axles/couplers/bells, bridges/rivers/bamboo trusses, centered thread spheres, radial fan pigment wedges, valve ducts, floral stems, orchard fruit, wooden lattice strips, stealth cones, matcha foam, firework arcs, pachinko pegs, mochi platforms, brush-calligraphy tracing, kite strings, sand rakes, underwater routes, taiko pads, maze boards, web strands, pottery wheel profiles, bamboo canal tiles, origami crease grids, parasols, snow blocks, kimono panels, conveyor food, windbell notes, rail tracks, or koi ponds.

## Code isolation / no previous game source

The implementation must be written from scratch for this day. Do not open, inspect, copy, diff, grep, or adapt code from previous games, including old `apps/day-*` folders, old `release/games/NNN/` HTML/CSS/JS files, or old public alias folders. You may inspect previous metadata, prompts, postmortems, and screenshots only to avoid repeating concepts and visual identity. The new game's HTML/CSS/JS must come from this prompt and general browser/Three.js/WebGL/WebAudio game knowledge, not from earlier game implementations.

## Mode variety / 3D cadence

Inspection target: `src/data/games.ts` currently ends with Day 037 `2d`, Day 038 `3d`, and Day 039 `2d`. The latest generated-mode streak is one `2d`.

Mode decision: Day 040 is real `3d`. It must implement meaningful spatial gameplay, not decorative perspective:

- Use Three.js/WebGL or equivalent static-browser 3D rendering.
- Render a real 3D repair tray with a curved bowl/dish armature, shard meshes with x/y/z position, yaw/pitch/roll, curved surface normals, crack-edge guide lines, depth-separated slots, clamps, and brush/lacquer trails.
- Gameplay must depend on 3D state: shard orientation, depth layer, edge alignment, seam gap, curvature match, lacquer flow direction, clamp tension, dust contamination, lacquer skin timer, guide-star order, and bowl stability.
- Player actions must manipulate the 3D system: select a shard, rotate yaw/pitch/roll, nudge/slide it across the tray, snap it into the bowl armature, brush lacquer along a highlighted seam, place a clamp, dust gold powder, warm/cool lacquer, use Star Focus to preview alignment, pause/restart, and inspect tutorial hints.
- Portrait mobile is the default supported layout; no landscape gate.

## Design

- Objective: Rebuild cracked kohaku porcelain pieces by aligning curved shards on a 3D bowl armature, filling seams with gold lacquer, clamping fragile joints, and completing star-map repair commissions before the lacquer skin timer hardens.
- Win condition: Complete three repair commissions — First Gold Hairline, Moon Bowl Rim, and Grand Star Kintsugi — while reaching 5400 points to trigger “Kohaku Star Mend”. After the banner, continue into endless repair commissions.
- Lose condition: Three porcelain hearts crack, lacquer skin reaches 100%, five shards are snapped with severe mismatch, clamp tension breaks three times, dust contamination reaches 100%, or the Grand Star seam is brushed in the wrong order twice.
- Core loop:
  1. Start on a title/menu screen with Day 040 badge, mode badge “3D”, public route `/kohaku/`, best score, best Star Mend time, tutorial, prompt link, audio note, and a large Start button.
  2. Show a portrait-friendly lacquer workbench. The center is a 3D tray with a ghost bowl silhouette, loose curved shards, crack-line guide stars, gold lacquer channels, clamps, and a tiny helper sparrow.
  3. A repair card requests goals such as: “Align 4 rim shards, keep seam gap under 18%, brush clockwise gold lacquer, clamp two red-risk joints, dust one star seam, keep contamination under 50%.”
  4. Player selects the active shard by tapping/clicking it or using Shard −/+ controls. The selected shard gets a luminous rim, normal arrow, crack-edge endpoints, and shadow.
  5. Slide Shard nudges it across tray/bowl depth. Moving near the ghost bowl previews snap quality using green/gold/vermilion seam ghosts.
  6. Rotate Yaw and Tilt Pitch/Roll change the shard's orientation. Correct angles align crack patterns and curved porcelain highlights; wrong angles widen seam gaps.
  7. Snap Shard locks a shard into the bowl armature when alignment is acceptable. Good snaps score and reveal the next seam; bad snaps cost a porcelain heart or require Undo Lacquer.
  8. Brush Lacquer draws a gold line through the active seam. Brush too fast creates bubbles; brush against requested order wastes lacquer and increases skin timer.
  9. Place Clamp adds a silk clamp to stabilize fragile seams. Clamp tension decays and must be released or retightened before it cracks the shard.
  10. Dust Gold sprinkles powdered gold on a freshly brushed seam for bonus points, but dusting before lacquer is ready contaminates adjacent shards.
  11. Warm Lamp / Cool Tray manage lacquer viscosity: warm flows into gaps faster, cool slows skin formation and bubble spread.
  12. Star Focus, charged by clean snaps and smooth brushing, overlays shard target ghosts, yaw/pitch/roll hints, seam-gap percentages, safe brush direction, clamp risk, dust-ready stars, and the next best shard candidate.
  13. Completing a repair stamps a kintsugi seal, restores one porcelain heart if needed, awards points, changes bowl shape and constraints, and unlocks thinner shards, hidden underside seams, stricter clamp windows, dust gusts, and multi-step star repairs.
  14. Pause/restart remain visible throughout.
- 15+ minute play-value strategy:
  - Save best score, fastest Kohaku Star Mend time, longest no-crack chain, highest endless repair, fewest bad snaps, smoothest lacquer brush score, best clamp discipline, most gold-star seams, and collected repair seal badges in localStorage.
  - Include three authored repair commissions:
    - First Gold Hairline: three large base shards, broad snap tolerance, guided first Rotate Yaw and Snap Shard, no heart penalty for the first tutorial mismatch.
    - Moon Bowl Rim: five shards around a bowl rim, first clamp requirement, clockwise Brush Lacquer order, one dust bonus, mild lacquer-skin pressure.
    - Grand Star Kintsugi: irregular moon dish with seven shards, underside curvature, two fragile seams, required Star Focus preview, dust timing, clamp release, and stricter seam gap.
  - Deterministic Day 040 seed varies shard shapes, rim/base curvature, crack endpoints, ghost target positions, lacquer flow speed, bubble chance, clamp tension, dust contamination, warm/cool lamp effects, star order, and endless constraints while keeping opening seconds fair.
  - Mastery badges: complete First Gold Hairline with zero mismatch, trigger Star Mend under 285 seconds, finish Moon Bowl Rim with all seams brushed in order, complete Grand Star with no porcelain cracks, keep contamination below 20%, and dust three gold-star seams in one run.
  - Strategic scoring rewards spatial planning: solve base curvature before rim shards, rotate yaw before tilt, snap only when seam gap is green/gold, brush lacquer in requested star order, clamp red-risk seams before warming, cool tray before bubbles spread, save Star Focus for irregular underside pieces.
  - Endless mode after Star Mend adds thinner shards, double-curved pieces, hidden underside guide stars, variable lacquer viscosity, gusty gold dust, stricter clamp timing, and bonus museum commissions without shrinking touch controls.
- Difficulty scaling:
  - 0-45 seconds: large shards, obvious ghost targets, forgiving yaw/pitch ranges, slow skin timer, no clamp breaks.
  - 45-150 seconds: rim repairs, brush order, clamp tension, dust-ready windows, warm/cool lamp choices.
  - 150-285 seconds: irregular curvature, underside target hints, required Star Focus, faster skin timer, fewer undo tokens.
  - 285+ seconds/endless: thinner shards, hidden seams, tighter gaps, gusts, multi-stage repairs, same readable controls.
  - Keep mobile fair: shards, target ghosts, seam gaps, brush paths, repair card, skin meter, helper, and action buttons must be readable at 390x844; primary touch buttons should be 52px+ where possible and never below 44px; no tiny survival-critical shards.
- Scoring/rewards:
  - Shard moved into a correct depth band: +130 points times combo tier.
  - Clean snap with seam gap under 12%: +240 points and Star Focus charge.
  - Correct yaw/pitch/roll alignment before snap: +180 points.
  - Smooth Brush Lacquer in requested direction: +220 points.
  - Clamp fragile seam before red risk: +170 points and heart protection.
  - Dust Gold at star-ready timing: +260 points.
  - Complete repair before skin warning: +980 points and restore one porcelain heart if below max.
  - Perfect no-crack commission: +1400 points.
  - Kohaku Star Mend: +3000 points and endless repairs unlock.
  - Bad snap, over-brush bubbles, wrong dust timing: combo reset, skin/contamination penalty.
  - Clamp break or severe mismatch: porcelain-heart damage.

## Controls and layout

- Desktop:
  - Mouse click/tap: select shards, press controls, start/pause overlay button, prompt link, or explainable HUD chips.
  - Mouse drag on the 3D stage: slide selected shard toward the pointer with depth-limited snap preview.
  - Arrow keys or WASD: nudge selected shard across tray/depth.
  - Q/E: Rotate Yaw left/right.
  - Z/X: Tilt Pitch/Roll cycle.
  - Space or Enter: Snap Shard.
  - B: Brush Lacquer.
  - C: Place Clamp / release current clamp when selected.
  - D: Dust Gold.
  - W: Warm Lamp.
  - S: Cool Tray.
  - Shift or F: Star Focus when charged.
  - P: pause/resume.
  - R: restart current run.
- Mobile/touch:
  - Tap a shard to select it. Drag within the 3D tray to slide the selected shard with a visible offset so the seam preview remains visible above the finger.
  - Use large Shard −, Shard +, Slide ↑/↓/←/→, Rotate Yaw, Tilt Pitch/Roll, Snap Shard, Brush Lacquer, Place Clamp, Dust Gold, Warm Lamp, Cool Tray, Star Focus, Pause, Restart, Audio, and Prompt buttons.
  - Tapping seam/skin/clamp/dust/focus chips may show short explanations.
  - No tiny virtual joystick. Interaction is direct shard select/drag plus labeled repair/action controls.
- Mobile layout/orientation:
  - Default target is portrait phone play around 390x844; do not require landscape.
  - Top: compact Kohaku HUD with score, best, porcelain hearts, lacquer skin %, contamination %, combo, active shard, snap gap, clamp risk, Star Focus charge, and elapsed time. Use shard/seam/lacquer/clamp/dust/star/chawan chips, not tatami/cake/fish/gear/bridge/thread/fan/valve/flower/fruit/lattice/shrine/tea-foam/firework/cat-coin/rabbit/brush-calligraphy/kite/sand/pearl/drum icons.
  - Below top: repair commission card with required shards, seam order, brush direction, clamp count, dust bonus, skin target, and progress ticks.
  - Center: large 3D repair tray stage with ghost bowl, shards, seam lines, crack endpoints, brush path, clamp ribbons, dust stars, helper art, and readable feedback. It must remain playable without zooming.
  - Bottom: status helper plus large repair controls. Controls must not cover shards, seam previews, repair card, helper, or brush path.
  - Tutorial must fit on the first portrait screen; optional details may be collapsible but objective, select/slide shard, Rotate Yaw, Tilt Pitch/Roll, Snap Shard, Brush Lacquer, Place Clamp, Dust Gold, Warm/Cool, Star Focus, pause/restart must be visible.
  - Requests must combine text, icons, seam line styles, star markers, progress ticks, and shape outlines so hue alone is not required.

## Menu and tutorial

Implement these states:

1. Title screen
   - Shows title “Kohaku Kintsugi Star Mender”.
   - Shows Day 040 badge, mode badge “3D”, public route `/kohaku/`, best score, best Star Mend time if available, and a prompt link.
   - Shows a large Start button and visible tutorial panel by default.
   - Notes: “Audio starts after you press Start; visual seam, shard, clamp, dust, and lacquer cues work if muted.”
2. Tutorial text
   - Objective: “Align porcelain shards in 3D, snap clean seams, brush gold lacquer, and complete the repair before lacquer skins over.”
   - Alignment: select a shard, slide it toward the ghost bowl, then rotate yaw and tilt until seam ghosts turn gold.
   - Snap: use Snap Shard only when the gap is small; bad snaps crack porcelain.
   - Lacquer: Brush Lacquer in the requested star order, then Dust Gold only when the seam sparkles.
   - Clamps/temperature: Place Clamp on fragile seams; Warm Lamp improves flow, Cool Tray slows skin and bubbles.
   - Star Focus: previews the best target, alignment hints, safe brush direction, and clamp risk when charged.
   - Pause/restart: P/R on desktop or visible buttons on mobile.
3. In-game HUD
   - Score, best score, porcelain hearts, lacquer skin %, contamination %, repair name, combo, selected shard, seam gap, clamp risk, Star Focus charge, elapsed time, latest warning.
   - Pause/restart controls visible or immediately accessible.
4. Status helper
   - Non-blocking helper showing selected shard, target seam, yaw/tilt hint, skin warning, clamp warning, dust-ready state, Star Focus readiness, and expected score effect.
   - Must not cover the 3D repair tray or bottom controls on mobile.
5. Pause overlay
   - Resume, restart, tutorial reminder, controls summary, audio/mute toggle, prompt link.
6. Game-over/results overlay
   - Final score, best score, repair reached, Star Mend status, cracks, bad snaps, brush smoothness, clamp saves, dust bonuses, badges, restart button.
7. Kohaku Star Mend banner
   - Trigger once per run after all three repair commissions and 5400 score.
   - Non-blocking celebration: gold seams glow into a constellation, porcelain shards settle into a complete moon bowl, the sparrow stamps a repair seal, dust motes swirl, and endless commissions continue after the banner fades.

## Assets

Prefer Imagegen2 (`openai/gpt-image-2`) for final visual art: sparrow lacquer apprentice helper mascot, portrait kintsugi repair atelier background, porcelain shard/lacquer/clamp texture sprite sheet, and shard/seam/lacquer/clamp/dust/star UI icon sheet. Three.js primitives may render the interactive bowl armature, shard meshes, seam lines, crack endpoints, brush/lacquer trails, clamps, dust particles, star overlays, and UI chrome. It should not create final character/background/texture/icon art from scratch unless Imagegen2 is unavailable after a real attempt.

Archive source generated art under `release/games/040/assets/source/` and use optimized playable copies under `release/games/040/assets/`. Also copy optimized playable assets into `apps/day-040-kohaku-kintsugi-star-mender/assets/` and the public alias `release/kohaku/assets/`.

For mobile-first crop safety: keep important content centered, leave 12-16% safe margins, avoid baked-in text, avoid watermarks, avoid fake UI labels, avoid tiny crack details that disappear at final in-game size, and keep helper/shards/gold seams/clamps/dust/star/focus silhouettes distinct against dark lacquer and porcelain backgrounds.

Generate or provide at least these final art assets:

1. Sparrow lacquer apprentice helper mascot
   - Target: transparent PNG if possible, square source, final optimized texture around 512x512 or 256x256.
   - Archive path: `release/games/040/assets/source/kohaku-helper-source.png`
   - Optimized path: `release/games/040/assets/kohaku-helper.png`
   - Imagegen2 prompt: “A charming tiny sparrow apprentice helper mascot for a mobile Japanese kintsugi porcelain repair puzzle game, small cute bird wearing a miniature indigo craft apron, holding a fine lacquer brush with a little gold powder pouch, kind focused expression, warm desk-lamp rim light, centered readable silhouette, transparent or solid warm parchment background, no checkerboard background, no text, no watermark, sprite-friendly, high contrast at small size.”
   - Aspect ratio: square.
2. Midnight kintsugi repair atelier background source
   - Target: portrait-friendly background suitable behind a large 3D repair tray with open readable center.
   - Archive path: `release/games/040/assets/source/kohaku-atelier-source.png`
   - Optimized path: `release/games/040/assets/kohaku-atelier.png`
   - Imagegen2 prompt: “A quiet midnight Japanese kintsugi repair atelier for a portrait mobile 3D puzzle game, dark urushi work tray, broken kohaku porcelain tea bowl pieces, warm desk lamp, small lacquer jars, gold powder dish, silk clamps, washi notes at the edges, deep navy and amber palette, open readable central tray area for interactive 3D shards, crop-safe for phone portrait, no characters in the center, no readable text, no watermark.”
   - Aspect ratio: portrait.
3. Porcelain shard and repair material texture sprite sheet source
   - Target: square sheet with separated readable materials that can be used as textures/decals.
   - Archive path: `release/games/040/assets/source/kohaku-pieces-source.png`
   - Optimized path: `release/games/040/assets/kohaku-pieces.png`
   - Imagegen2 prompt: “Sprite sheet of small readable kintsugi repair materials for a mobile 3D porcelain puzzle game: curved white porcelain shard top, kohaku amber glaze shard, broken crack edge sample, gold lacquer seam stroke, silk clamp ribbon, lacquer brush tip, gold powder sparkle, bubble warning, each element separated with generous margins, transparent or warm parchment background, no checkerboard background, no text, no watermark, readable at 40-96 pixels.”
   - Aspect ratio: square.
4. Kohaku shard, seam, lacquer, clamp, dust, and focus UI icon sheet source
   - Target: square icon sheet for objectives, hazards, tools, rewards, and UI decals.
   - Archive path: `release/games/040/assets/source/kohaku-icons-source.png`
   - Optimized path: `release/games/040/assets/kohaku-icons.png`
   - Imagegen2 prompt: “Small readable icon sheet for a Japanese kintsugi porcelain repair puzzle game: curved porcelain shard, rotate yaw arrow, tilt pitch roll icon, gold seam line, lacquer brush, silk clamp, gold dust star, warm lamp, cool tray, lacquer skin timer, bubble warning, contamination speck, Star Focus constellation bowl emblem, porcelain heart, repair seal, Grand Star Mend crest, transparent or solid warm parchment background, no checkerboard background, high contrast, no text, no watermark, generous margins so no icons are cut off.”
   - Aspect ratio: square.

If Imagegen2 is unavailable or fails after a real attempt, create a clearly labeled emergency fallback using simple SVG/Three.js sparrow/shard/lacquer/clamp/icon silhouettes, document the failure in `ai/postmortems/day-040.md`, and still keep source/fallback files under the same asset paths.

### Mandatory generated-image QA

For every generated image, include a real inspection step after generation and before integration:

- Analyze the actual generated file visually, not just the prompt text.
- For the sparrow helper mascot, verify transparent/cutout quality or clean background handling, readable friendly silhouette, centered pivot/crop margins, no unwanted text/watermarks, stable upright orientation, and that the brush/powder pose is compatible with static helper placement.
- For the shard/material sheet, verify separated porcelain shards, readable crack edges, gold seam sample, clamp ribbon, brush tip, dust sparkle, bubble warning, usable crop margins, no baked checkerboard, no unwanted text/watermark, and a documented visual baseline for shard top/broken-edge orientation.
- Verify control-to-motion alignment in-game: selecting a shard must visibly highlight the intended 3D shard, Slide/drag must move it in tray/depth space, Rotate Yaw and Tilt Pitch/Roll must visibly change orientation and seam gap, Snap Shard must lock it into the ghost bowl, Brush Lacquer must draw a gold line, Place Clamp must add/release a clamp, Dust Gold must add star particles only when ready, Warm Lamp/Cool Tray must visibly change viscosity/skin feedback, Star Focus must preview alignment/seam/clamp risks, Pause/Restart must work.
- For the background, verify the central tray remains readable after portrait mobile crop and does not hide shards, seam lines, repair card, helper, brush path, or controls.
- For the icon sheet, verify shard, rotate, tilt, seam, brush, clamp, dust, warm lamp, cool tray, skin timer, bubble, contamination, Star Focus, porcelain heart, repair seal, and Grand Star Mend crest are distinct at final HUD/button size and cannot be confused. Watch specifically for fake checkerboard transparency; alpha-clean or composite onto warm parchment if needed and inspect again.
- If inspection finds a problem, regenerate or post-process the image and inspect again. Do not ship broken visual assets just because tests pass.

## Audio and game feel

Because porcelain clicks, gold lacquer brushing, clamp tension, dust sparkle, and calm atelier repair are central to the theme, include lightweight WebAudio cues initialized only after a user gesture:

- Soft porcelain click when selecting or nudging a shard.
- Low ceramic thump when Rotate Yaw or Tilt Pitch/Roll changes orientation.
- Bright porcelain chime when Snap Shard succeeds.
- Dull crack warning when a mismatch or clamp tension risk appears.
- Smooth brush swish when Brush Lacquer lays a clean seam.
- Tiny silk twang when Place Clamp stabilizes a joint.
- Gold dust shimmer when Dust Gold succeeds.
- Warm lamp hum / cool tray glass tap for temperature controls.
- Star shimmer when Star Focus activates.
- Calm koto-like flourish when Kohaku Star Mend triggers.

Audio must not block play if WebAudio is unavailable. Verify no autoplay errors: audio context should be created/resumed only after Start or another user interaction. Include a visible mute toggle in pause/results or HUD. Expose a narrow debug handle such as `window.__day040Audio = { ctx, enabled }` after user-gesture initialization so Playwright can assert audio state.

## Prompt page output

The archived `release/games/040/prompt.html` must be a consistent rendered HTML page, not raw Markdown pasted into a `<pre>` block. It should include:

- A clear `<title>` and `<h1>` using `Day 040 Game Generation Prompt`.
- A back-to-game link near the top.
- Semantic rendered sections (`h2`, `h3`, `ul/ol/li`, `p`, `pre/code` only for actual code/commands).
- The same readable prompt-page style pattern across days so prompt pages feel like one system.

## Subagents to dispatch

1. Implementation subagent
   - Build the static 3D game under `apps/day-040-kohaku-kintsugi-star-mender/`.
   - Integrate it into immutable release output under `release/games/040/`.
   - Create the public playable route under `release/kohaku/`.
   - Use static HTML/CSS/JS with Three.js/WebGL/WebAudio and no backend.
   - The public alias must be self-contained or asset paths must be alias-safe.
   - If vendoring `three.module*.js`, also copy the matching `three.core*.js` beside it in the app, release archive, and `/kohaku/` alias assets.
2. Asset/polish subagent
   - Generate/prepare Imagegen2 assets, archive source files, optimize playable copies, inspect generated images, remove fake checkerboards if present, document shard/edge visual baseline, and tune mobile readability/game feel.
3. QA/browser/mobile subagent
   - Run desktop and mobile smoke checks, verify no console errors, verify menu/tutorial/objective/controls/restart/pause, prompt links, 3D repair tray render, Shard −/+, Slide/drag, Rotate Yaw, Tilt Pitch/Roll, Snap Shard, Brush Lacquer, Place Clamp, Dust Gold, Warm Lamp, Cool Tray, Star Focus control presence and visible mechanical effect, seam/skin/clamp/dust/star feedback, generated screenshot, generated assets, WebAudio initialization after user gesture, and 390x844 portrait layout.
4. Reflection/self-improvement subagent
   - Write `ai/postmortems/day-040.md` after validation with what worked, what failed, generated-image inspection notes, shard-edge visual baseline, audio verification, code-isolation confirmation, and whether generator/template/rubric improvements are justified.

## Acceptance criteria

- Static build passes.
- Code isolation is documented in QA/postmortem: no previous game implementation code was opened, inspected, copied, diffed, grepped, or adapted.
- Mode choice follows the cadence rule: Day 040 is real `3d` after Day 039 `2d`, with meaningful shard depth/curvature/orientation/seam/lacquer mechanics rather than decorative perspective.
- Desktop smoke passes.
- Mobile portrait smoke passes at about 390x844 with readable HUD/tutorial/repair card, usable 44px+ shard/action/pause/restart controls, no forced landscape canvas, and no tiny survival-critical shards.
- Prompt is visible from gallery and release folder.
- `prompts/day-040.md` is copied exactly to `release/games/040/prompt.md` and `release/kohaku/prompt.md`.
- `release/games/040/prompt.html` and `release/kohaku/prompt.html` render the prompt in browser-readable semantic HTML with the standard prompt-page styling, not a raw Markdown `<pre>` dump.
- Public alias `release/kohaku/index.html`, `release/kohaku/prompt.html`, `release/kohaku/screenshot.png`, and `release/kohaku/assets/` exist and work.
- Gallery card for Day 040 shows prompt availability, generation duration, public `/kohaku/` links, mode `3d`, and actual generated date.
- Screenshot exists at `release/games/040/screenshot.png` and is non-empty/readable. Prefer a readable desktop gameplay screenshot for gallery cards; mobile screenshots are QA evidence unless the design is intentionally portrait-card friendly.
- Image/source assets exist under `release/games/040/assets/source/` and optimized assets exist under `release/games/040/assets/`, or a documented emergency fallback exists.
- Every generated image has an inspection note in the postmortem or QA notes; interactive shard/seam/lacquer/clamp visuals have verified background handling, orientation/pivot/crop, readability, and control-to-motion alignment.
- WebAudio initializes after user gesture and creates no autoplay console errors; audio is failsafe if unsupported and visual seam/shard/clamp/dust/order cues remain playable muted.
- No console errors during desktop or mobile smoke. Add data-URI favicons to game and prompt pages if needed to avoid favicon request noise.
- Existing `release/games/001/**` through `release/games/039/**` from origin/main remain unchanged.
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
# Screenshot/static checks: verify release/games/040/screenshot.png, prompt.md, prompt.html, index.html, game.js, styles.css, release/kohaku/index.html, release/kohaku/prompt.html, release/kohaku/screenshot.png, optimized assets, source assets, and vendored Three.js files (if used) exist and are non-empty.
# Prompt copy check: cmp prompts/day-040.md release/games/040/prompt.md and cmp prompts/day-040.md release/kohaku/prompt.md.
# Prompt HTML check: verify release/games/040/prompt.html has semantic h1/h2/list markup and a back-to-game link, not a raw Markdown dump inside <pre>, and no malformed ul > p or ol > p nodes, no direct nested lists, and no strong/b tags inside code.
# Browser smoke: open the local/static /kohaku/ route and verify menu, tutorial, gameplay start, 3D repair tray render, shard selection, Slide/drag, Rotate Yaw, Tilt Pitch/Roll, Snap Shard, Brush Lacquer, Place Clamp, Dust Gold, Warm Lamp, Cool Tray, Star Focus, seam/skin/clamp/dust/star feedback, pause, restart, prompt page, WebAudio after user gesture, no console errors.
# Mobile smoke: repeat at a portrait phone viewport such as 390x844 and verify playable shard/action controls plus readable HUD/repair card/stage/controls.
# Static screenshot check: inspect release/games/040/screenshot.png and release/kohaku/screenshot.png for non-empty readable game content; use vision to judge actual visual quality.
# Image QA: inspect every Imagegen2 source/optimized asset and document the actual inspection result in ai/postmortems/day-040.md.
# Docker/static smoke: build the Docker image locally, run it, curl /kohaku/ and /kohaku/prompt.html, then stop the container.
# Immutable guard: confirm no release/games folders from origin/main changed except new Day 040.
```
