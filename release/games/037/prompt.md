# Day 037 Game Generation Prompt

## Game identity

- Day: 037
- Title: Kingyo Poi Festival Scooper
- Slug: kingyo-poi-festival-scooper
- Public route word: kingyo
- Mode: 2D
- Genre: mobile-first dexterity arcade / paper-net scooping / festival order fulfilment score chase
- Mood/style: blue-hour summer ennichi goldfish-scooping stall, shallow lacquer water tank, glowing paper lantern reflections, translucent ripples, patterned kingyo fish, fragile washi poi net, enamel prize bowl, tiny yatai helper cat, crisp water-plink and paper-tear feedback; tactile touch-first scooping rather than clockwork gears, bridge construction, spherical embroidery, fan dyeing, onsen valves, ikebana, orchard harvesting, kumiko woodworking, shrine stealth, matcha whisking, fireworks, pachinko coins, mochi hopping, calligraphy tracing, kite mapping, dry-garden raking, underwater pearl navigation, taiko rhythm routing, daruma labyrinths, spider webs, pottery wheels, canal grids, origami folds, rain parasols, snow stacking, kimono panels, bento orders, windbell tuning, rail running, or koi lantern collection.

## Why this game today

The generated series currently ends with:

- Day 033 `2d`: Uchiwa Fan Dye Maestro, bright cream radial fan, pigment/stencil/drying controls, large wedge geometry.
- Day 034 `3d`: Temari Thread Orbit Weaver, central 3D sphere, silk arcs, pearl pins, warm craft table.
- Day 035 `2d`: Hashi Tanuki Bridgewright, side-view dusk mountain stream, bamboo/rope/stone bridge engineering and stress overlays.
- Day 036 `3d`: Takumi Karakuri Gearwright, dark indigo/amber layered gear plates, brass gears, axles, torque/jam/bell routing.

The latest generated-mode streak is one `3d` (Day 036), so Day 037 may safely be `2d` without extending a 2D streak. This prompt intentionally switches away from engineering/craft-table routing into a direct, tactile festival dexterity game: drag a paper poi net through a shallow water tank, angle it under moving goldfish, lift at the right moment, fulfil pattern orders, and manage paper durability before it tears.

Recent screenshot/visual variety notes to avoid repeating:

- Day 036 used a dark mechanical workbench, translucent depth plates, brass gears, circular teeth, amber buttons, and a compact engineering HUD.
- Day 035 used a wide horizontal river gap, bamboo beams, rope braces, stone piers, stress colors, and blue mountain water.
- Day 034 used a huge centered dark ball with orbit arcs and pearl pins.
- Day 033 used pale cream paper, fan sectors, radial geometry, and pigment wedges.

Day 037 should use a shallow top-down festival water tank: oval/rounded tank border, visible water surface, goldfish with distinct body patterns, scoop net trajectory, ripples, paper-wetness rings, bowl targets, yatai lantern reflections, floating tickets, and a helpful stall-cat mascot. Avoid gear plates/axles/couplers/bells, bridges/rivers/bamboo trusses/stress heatmaps, centered spheres/thread arcs/pearl pins, radial fans/pigment sectors, ducts/valves/steam, flower/vase balance, orchard baskets, lattice strips, stealth cones, tea bowls, fireworks trajectories, pachinko pegs/coins, mochi platforms, brush strokes, kite threads, raked sand, underwater diver routes, taiko pads, labyrinth tilting, spider webs, pottery profiles, canal tiles, origami crease grids, rain parasols, snow blocks, kimono textile panels, restaurant conveyors, windbell note tuning, rail tracks, or koi pond spark collection.

## Code isolation / no previous game source

The implementation must be written from scratch for this day. Do not open, inspect, copy, diff, grep, or adapt code from previous games, including old `apps/day-*` folders, old `release/games/NNN/` HTML/CSS/JS files, or old public alias folders. You may inspect previous metadata, prompts, postmortems, and screenshots only to avoid repeating concepts and visual identity. The new game's HTML/CSS/JS must come from this prompt and general browser/canvas/WebAudio game knowledge, not from earlier game implementations.

## Mode variety / 3D cadence

Inspection target: `src/data/games.ts` currently ends with Day 033 `2d`, Day 034 `3d`, Day 035 `2d`, and Day 036 `3d`. The latest generated-mode streak is one `3d`.

Mode decision: Day 037 is rich mobile-first `2d`, selected after a real 3D day. It must be mechanically deep enough to justify the mode:

- Use static-browser HTML/CSS/JS with Canvas/SVG/DOM/WebAudio as appropriate; no backend.
- Render a top-down shallow kingyo-sukui tank where fish, water ripples, poi net position, net angle, lift timing, paper wetness, tear risk, fish alertness, bowl orders, and festival timer matter mechanically.
- Gameplay must depend on 2D spatial state: net center, rim angle, drag speed, fish direction/speed, fish size, water turbulence, scoop depth, lift timing, paper durability, combo chain, order patterns, and safe zones.
- Player actions must manipulate the system: move/tilt the poi net, slow-dip, quick-lift, swap paper net, nudge bowl position, calm water with Festival Focus, pause/restart, and inspect tutorial hints.
- Portrait mobile is the default supported layout; no landscape gate.

## Design

- Objective: Scoop requested goldfish patterns into the prize bowl using a fragile paper poi net while keeping the paper from tearing, maintaining calm water, and completing festival stall orders before the lantern timer runs out.
- Win condition: Complete three order sets — First Lantern Scoop, Pattern Bowl Rush, and Grand Ennichi Kingyo — while reaching 5100 points to trigger “Kingyo Grand Stall Prize”. After the banner, continue into endless stall orders.
- Lose condition: Three poi papers tear, lantern timer expires, five requested fish escape after being startled, order patience reaches zero, or water turbulence hits 100% and scatters the tank.
- Core loop:
  1. Start on a title/menu screen with Day 037 badge, mode badge “2D”, public route `/kingyo/`, best score, best Grand Stall time, tutorial, prompt link, audio note, and a large Start button.
  2. Show a portrait-friendly festival stall. The center is a shallow water tank with moving fish, a visible poi net, current/ripple rings, order bowl, and large touch area.
  3. An order card requests goals such as: “Scoop 2 red kingyo, 1 calico, no paper tear, keep turbulence under 55%, finish before the lantern fades.”
  4. Player drags the poi net around the tank. Slow movement keeps paper dry; fast movement creates ripples and startles fish.
  5. Tilt Net cycles Flat, Left Edge, Right Edge, and Nose Down. Correct tilt lets the rim slide under the fish; wrong tilt pushes it away or wets paper.
  6. Dip/Lift button or upward flick attempts a scoop. The fish must overlap the net bowl, approach speed must be gentle, and lift timing must match the ripple ring.
  7. Successful scoop animates the fish riding the paper net into the bowl, scores by pattern, restores patience, and builds combo. Heavy/rare fish strain paper more.
  8. Paper wetness rises with fast dragging, failed lifts, turbulence, and heavy fish. Swap Poi replaces the paper at score/cooldown cost.
  9. Bowl Nudge shifts the prize bowl slightly left/right/up/down so the player can plan shorter carries, but careless nudges spill one stored fish.
  10. Festival Focus, charged by gentle scoops and pattern streaks, slows fish, quiets ripples, and overlays safe approach arcs, requested fish highlights, paper-tear warnings, and lift timing rings.
  11. Completing an order stamps a stall ticket, restores one paper heart if needed, awards points, changes requested fish/patterns, and unlocks faster fish, decoy leaves, heavier black telescope-eye fish, and smaller safe-lift windows.
  12. Pause/restart remain visible throughout.
- 15+ minute play-value strategy:
  - Save best score, fastest Kingyo Grand Stall Prize time, longest no-tear chain, highest endless order, rarest fish scooped, calmest order completion, most perfect lift windows, and collected stall ticket seals in localStorage.
  - Include three authored order sets:
    - First Lantern Scoop: slow red/orange fish, broad net, clear overlap highlight, one red fish request, generous paper durability, no paper-heart penalty for the first tutorial failed lift.
    - Pattern Bowl Rush: red, calico, and black fish patterns; bowl nudge introduced; decoy floating maple leaves; two-step orders; turbulence meter becomes important.
    - Grand Ennichi Kingyo: rare telescope-eye and white/red comet fish; patience pressure; required Festival Focus preview; smaller lift windows; limited Swap Poi uses; target turbulence under 60%.
  - Deterministic Day 037 seed varies fish paths, fish sizes, pattern requests, ripple timing, paper wetness rates, patience decay, bowl position, decoy leaves, rare fish spawn, focus charge, and endless constraints while keeping opening seconds fair.
  - Mastery badges: complete First Lantern Scoop with zero paper wetness warnings, trigger Grand Stall under 285 seconds, complete Pattern Rush with all requested patterns, finish Grand Ennichi with no paper tears, complete an order below 25% turbulence, scoop three rare fish in one run.
  - Strategic scoring rewards gentle dexterity: approach fish from behind, match net tilt to fish direction, keep carries short with Bowl Nudge, avoid decoy leaves, swap paper before the tear threshold, save Festival Focus for rare/heavy fish, and chain requested patterns instead of random scoops.
  - Endless mode after Grand Stall adds faster fish, heavier rare types, moving lantern shadows, extra decoys, shorter patience, and bonus sparkling fish without shrinking touch controls.
- Difficulty scaling:
  - 0-45 seconds: slow fish, broad net, obvious overlap/lift ring, forgiving paper, one requested color.
  - 45-150 seconds: pattern orders, bowl nudge, decoy leaves, paper wetness and turbulence pressure.
  - 150-285 seconds: rare fish, smaller timing rings, focus-required order, patience pressure, limited swaps.
  - 285+ seconds/endless: faster paths, heavier fish, moving reflections, denser tank, same readable controls.
  - Keep mobile fair: fish silhouettes, pattern markings, net rim, lift ring, order card, paper hearts, turbulence meter, helper, and action buttons must be readable at 390x844; touch buttons should be 52px+ where possible and never below 44px; no tiny survival-critical fish.
- Scoring/rewards:
  - Requested red/orange fish scoop: +140 points times combo tier.
  - Requested calico/white-red fish: +190 points and patience relief.
  - Rare black telescope-eye fish: +260 points and Festival Focus charge.
  - Perfect gentle approach with paper wetness under 20%: +180 bonus.
  - Order completed before patience warning: +980 points and restore one paper heart if below max.
  - No-tear order: +1250 points.
  - Calm water order under 25% turbulence: +520 bonus.
  - Kingyo Grand Stall Prize: +2700 points and endless orders unlock.
  - Decoy leaf scooped or wrong pattern: no order progress, turbulence +8%, combo reset.
  - Paper tear: paper-heart damage, fish escape, order patience penalty, combo reset.

## Controls and layout

- Desktop:
  - Mouse drag: move the poi net through the water tank.
  - Mouse click / Space / Enter: Dip/Lift scoop attempt depending on current overlap and timing.
  - A/D or ArrowLeft/ArrowRight: cycle fish target or nudge bowl horizontally when Bowl Nudge mode is active.
  - W/S or ArrowUp/ArrowDown: adjust net tilt or bowl vertical nudge.
  - Q/E: cycle Tilt Net mode.
  - B: Bowl Nudge.
  - X: Swap Poi paper.
  - Shift or F: Festival Focus when charged.
  - P: pause/resume.
  - R: restart current run.
- Mobile/touch:
  - Drag directly on the tank to move the poi net. The touch point should map to the net center with a small thumb-offset so the net remains visible above the finger.
  - Use large Tilt Net, Dip/Lift, Bowl Nudge, Swap Poi, Festival Focus, Pause, Restart, and Prompt buttons.
  - Direct fish tapping may briefly highlight the nearest requested fish but must not replace the scoop mechanic.
  - Tapping order/paper/turbulence chips may show short explanations.
  - No virtual joystick. Interaction is direct drag, tilt, lift, paper swap, bowl nudge, focus, pause/restart.
- Mobile layout/orientation:
  - Default target is portrait phone play around 390x844; do not require landscape.
  - Top: compact Kingyo HUD with score, best, paper hearts, paper wetness %, turbulence %, combo, order patience, active tilt, Festival Focus charge, and elapsed time. Use fish/net/bowl/ripple/paper/lantern chips, not gear/bridge/thread/fan/valve/flower/fruit/lattice/shrine/tea/firework/cat-coin/rabbit/brush/kite/sand/pearl/drum icons.
  - Below top: order card with requested fish patterns, completed ticks, patience bar, turbulence target, paper-swap limit, and bonus objective.
  - Center: large water tank stage with fish, poi net, lift timing rings, ripples, decoy leaves, bowl, helper art, and readable feedback. It must remain playable without zooming.
  - Bottom: status helper plus large action controls. Controls must not cover the fish tank, net, order card, or bowl.
  - Tutorial must fit on the first portrait screen; optional details may be collapsible but objective, drag net, Tilt Net, Dip/Lift, Swap Poi, Bowl Nudge, Festival Focus, pause/restart must be visible.
  - Requests must combine text, icons, shapes, fish pattern markings, line styles, and progress ticks so hue alone is not required.

## Menu and tutorial

Implement these states:

1. Title screen
   - Shows title “Kingyo Poi Festival Scooper”.
   - Shows Day 037 badge, mode badge “2D”, public route `/kingyo/`, best score, best Grand Stall time if available, and a prompt link.
   - Shows a large Start button and visible tutorial panel by default.
   - Notes: “Audio starts after you press Start; visual ripple, paper, and order cues work if muted.”
2. Tutorial text
   - Objective: “Scoop the requested goldfish patterns into the bowl before the paper tears.”
   - Movement: drag the poi net slowly; fast movement raises ripples and paper wetness.
   - Tilt: Tilt Net changes which rim slides under a fish; approach from behind for clean scoops.
   - Lift: press Dip/Lift when the fish overlaps the net and the timing ring is small.
   - Safety: Swap Poi before paper tears; avoid decoy leaves and water turbulence.
   - Festival Focus: slows fish and previews safe approach arcs when charged.
   - Pause/restart: P/R on desktop or visible buttons on mobile.
3. In-game HUD
   - Score, best score, paper hearts, paper wetness %, turbulence %, order name, combo, patience, active tilt, Festival Focus charge, elapsed time, latest warning.
   - Pause/restart controls visible or immediately accessible.
4. Status helper
   - Non-blocking helper showing nearest requested fish, approach advice, tilt hint, paper wetness warning, turbulence warning, lift timing, Festival Focus readiness, and expected score effect.
   - Must not cover the fish tank or bottom controls on mobile.
5. Pause overlay
   - Resume, restart, tutorial reminder, controls summary, audio/mute toggle, prompt link.
6. Game-over/results overlay
   - Final score, best score, order reached, Grand Stall status, paper tears, fish escaped, rare fish scooped, calm-water bonus, badges, restart button.
7. Kingyo Grand Stall Prize banner
   - Trigger once per run after all three order sets and 5100 score.
   - Non-blocking celebration: lantern reflections bloom, fish make a synchronized swirl, the prize bowl sparkles, helper cat stamps stall tickets, and endless orders continue after the banner fades.

## Assets

Prefer Imagegen2 (`openai/gpt-image-2`) for final visual art: stall-cat helper mascot, portrait festival goldfish-scooping stall/tank background, kingyo fish sprite sheet, and fish/net/bowl/ripple/paper UI icon sheet. Canvas/SVG/DOM code may render the interactive net rim, hitboxes, ripple rings, water highlights, lift timing, particles, gauges, and UI chrome. It should not create final character/background/fish/icon art from scratch unless Imagegen2 is unavailable after a real attempt.

Archive source generated art under `release/games/037/assets/source/` and use optimized playable copies under `release/games/037/assets/`. Also copy optimized playable assets into `apps/day-037-kingyo-poi-festival-scooper/assets/` and the public alias `release/kingyo/assets/`.

For mobile-first crop safety: keep important content centered, leave 12-16% safe margins, avoid baked-in text, avoid watermarks, avoid fake UI labels, avoid tiny fish/tool details that disappear at final in-game size, and keep fish/net/bowl/ripple/paper/focus silhouettes distinct against dark blue festival water.

Generate or provide at least these final art assets:

1. Festival stall-cat helper mascot
   - Target: transparent PNG if possible, square source, final optimized texture around 512x512 or 256x256.
   - Archive path: `release/games/037/assets/source/kingyo-helper-source.png`
   - Optimized path: `release/games/037/assets/kingyo-helper.png`
   - Imagegen2 prompt: “A charming friendly Japanese festival stall cat helper mascot for a mobile kingyo-sukui goldfish scooping arcade game, small cute calico cat wearing a tiny indigo happi coat and red festival headband, holding a paper poi scoop and enamel fish bowl, kind focused expression, warm lantern rim light, centered readable silhouette, transparent or solid pale parchment background, no checkerboard background, no text, no watermark, sprite-friendly, high contrast at small size.”
   - Aspect ratio: square.
2. Goldfish-scooping festival tank background source
   - Target: portrait-friendly background suitable behind a playable top-down water tank with open readable center.
   - Archive path: `release/games/037/assets/source/kingyo-stall-source.png`
   - Optimized path: `release/games/037/assets/kingyo-stall.png`
   - Imagegen2 prompt: “A blue-hour Japanese ennichi festival goldfish-scooping stall for a portrait mobile arcade game, shallow lacquer water tank, glowing paper lantern reflections, enamel fish bowls at the edges, yatai counter, warm amber lanterns, deep indigo summer night, open readable central water surface for interactive fish and scoop net, crop-safe for phone portrait, no characters in the center, no readable text, no watermark.”
   - Aspect ratio: portrait.
3. Kingyo goldfish sprite sheet source
   - Target: square sprite sheet with individual fish that can be cropped into runtime sprites; transparent if possible or solid dark-water background that can be alpha-cleaned/masked.
   - Archive path: `release/games/037/assets/source/kingyo-fish-source.png`
   - Optimized path: `release/games/037/assets/kingyo-fish.png`
   - Imagegen2 prompt: “Sprite sheet of small readable top-down goldfish for a mobile kingyo-sukui arcade game: red/orange wakin, white-red comet, calico spotted goldfish, black telescope-eye goldfish, and tiny sparkling rare goldfish, viewed from above, each fish separated with generous margins, clear nose-to-tail direction, high contrast silhouettes, transparent or dark water background, no checkerboard background, no text, no watermark, sprite-friendly at 48-72 pixels.”
   - Aspect ratio: square.
4. Kingyo fish, net, bowl, ripple, paper, and focus UI icon sheet source
   - Target: square icon sheet for objectives, hazards, tools, rewards, and UI decals.
   - Archive path: `release/games/037/assets/source/kingyo-icons-source.png`
   - Optimized path: `release/games/037/assets/kingyo-icons.png`
   - Imagegen2 prompt: “Small readable icon sheet for a Japanese goldfish scooping festival arcade game: red goldfish, calico fish, black telescope fish, paper poi scoop net, enamel prize bowl, water ripple, paper tear crack, lantern timer, decoy maple leaf, Swap Poi paper stack, Bowl Nudge arrows, Festival Focus lantern-fish emblem, paper heart, stall ticket seal, Grand Stall prize emblem, transparent or solid pale parchment background, no checkerboard background, high contrast, no text, no watermark, generous margins so no icons are cut off.”
   - Aspect ratio: square.

If Imagegen2 is unavailable or fails after a real attempt, create a clearly labeled emergency fallback using simple SVG/canvas cat/fish/net/bowl/ripple silhouettes, document the failure in `ai/postmortems/day-037.md`, and still keep source/fallback files under the same asset paths.

### Mandatory generated-image QA

For every generated image, include a real inspection step after generation and before integration:

- Analyze the actual generated file visually, not just the prompt text.
- For the stall-cat helper mascot, verify transparent/cutout quality or clean background handling, readable friendly silhouette, centered pivot/crop margins, no unwanted text/watermarks, stable upright helper orientation, and that poi/bowl pose does not imply incompatible movement or rotation.
- For fish sprites, verify clear nose-to-tail facing direction, separated fish, readable red/calico/black/rare patterns at final 48-72px size, usable crop margins, no baked checkerboard, no unwanted text/watermark, and a documented rotation baseline so movement direction matches visual orientation.
- Verify control-to-motion alignment in-game: dragging must move the visible poi net under the thumb-offset, Tilt Net must visibly change rim/angle state, Dip/Lift must show scoop attempt and fish transfer or miss, Swap Poi must visibly reset paper wetness, Bowl Nudge must move the bowl, Festival Focus must slow/preview safe arcs and timing rings, Pause/Restart must work, and fish should swim in the direction their sprite faces.
- For the background, verify the central tank remains readable after portrait mobile crop and does not hide fish, net, lift rings, bowl, order card, helper, or controls.
- For the icon sheet, verify red fish, calico fish, black fish, poi net, bowl, ripple, paper tear, lantern timer, decoy leaf, swap paper, bowl arrows, Festival Focus, paper heart, ticket seal, and Grand Stall emblem are distinct at final HUD/button size and cannot be confused. Watch specifically for fake checkerboard transparency; alpha-clean or composite onto pale parchment if needed and inspect again.
- If inspection finds a problem, regenerate or post-process the image and inspect again. Do not ship broken visual assets just because tests pass.

## Audio and game feel

Because water ripples, paper-net tension, festival stall feedback, and scoop timing are central to the theme, include lightweight WebAudio cues initialized only after a user gesture:

- Soft water plink when the net enters calm water.
- Papery rustle when Tilt Net changes rim angle.
- Gentle scoop swoosh when Dip/Lift succeeds.
- Dull splash and paper-crinkle warning on failed lift.
- Rising tear crackle as paper wetness approaches red.
- Tiny bell ticket chime when an order fish lands in the bowl.
- Lantern shimmer when Festival Focus activates.
- Festival ta-da cadence when Kingyo Grand Stall Prize triggers.

Audio must not block play if WebAudio is unavailable. Verify no autoplay errors: audio context should be created/resumed only after Start or another user interaction. Include a visible mute toggle in pause/results or HUD. Expose a narrow debug handle such as `window.__day037Audio = { ctx, enabled }` after user-gesture initialization so Playwright can assert audio state.

## Prompt page output

The archived `release/games/037/prompt.html` must be a consistent rendered HTML page, not raw Markdown pasted into a `<pre>` block. It should include:

- A clear `<title>` and `<h1>` using `Day 037 Game Generation Prompt`.
- A back-to-game link near the top.
- Semantic rendered sections (`h2`, `h3`, `ul/ol/li`, `p`, `pre/code` only for actual code/commands).
- The same readable prompt-page style pattern across days so prompt pages feel like one system.

## Subagents to dispatch

1. Implementation subagent
   - Build the static 2D game under `apps/day-037-kingyo-poi-festival-scooper/`.
   - Integrate it into immutable release output under `release/games/037/`.
   - Create the public playable route under `release/kingyo/`.
   - Use static HTML/CSS/JS with Canvas/SVG/WebAudio and no backend.
   - The public alias must be self-contained or asset paths must be alias-safe.
2. Asset/polish subagent
   - Generate/prepare Imagegen2 assets, archive source files, optimize playable copies, inspect generated images, remove fake checkerboards if present, document fish facing/rotation baseline, and tune mobile readability/game feel.
3. QA/browser/mobile subagent
   - Run desktop and mobile smoke checks, verify no console errors, verify menu/tutorial/objective/controls/restart/pause, prompt links, water tank render, drag net, Tilt Net, Dip/Lift, Swap Poi, Bowl Nudge, Festival Focus control presence, fish movement/orientation, paper wetness/turbulence/order feedback, generated screenshot, generated assets, WebAudio initialization after user gesture, and 390x844 portrait layout.
4. Reflection/self-improvement subagent
   - Write `ai/postmortems/day-037.md` after validation with what worked, what failed, generated-image inspection notes, fish-sprite facing/rotation baseline, audio verification, code-isolation confirmation, and whether generator/template/rubric improvements are justified.

## Acceptance criteria

- Static build passes.
- Code isolation is documented in QA/postmortem: no previous game implementation code was opened, inspected, copied, diffed, grepped, or adapted.
- Mode choice follows the cadence rule: Day 037 is `2d` after Day 036 `3d`, with tactile water-tank scooping mechanics rather than low-effort flat decoration.
- Desktop smoke passes.
- Mobile portrait smoke passes at about 390x844 with readable HUD/tutorial/order card, usable 44px+ drag/touch/action/pause/restart controls, no forced landscape canvas, and no tiny survival-critical fish.
- Prompt is visible from gallery and release folder.
- `prompts/day-037.md` is copied exactly to `release/games/037/prompt.md` and `release/kingyo/prompt.md`.
- `release/games/037/prompt.html` and `release/kingyo/prompt.html` render the prompt in browser-readable semantic HTML with the standard prompt-page styling, not a raw Markdown `<pre>` dump.
- Public alias `release/kingyo/index.html`, `release/kingyo/prompt.html`, `release/kingyo/screenshot.png`, and `release/kingyo/assets/` exist and work.
- Gallery card for Day 037 shows prompt availability, generation duration, public `/kingyo/` links, mode `2d`, and actual generated date.
- Screenshot exists at `release/games/037/screenshot.png` and is non-empty/readable. Prefer a readable desktop gameplay screenshot for gallery cards; mobile screenshots are QA evidence unless the design is intentionally portrait-card friendly.
- Image/source assets exist under `release/games/037/assets/source/` and optimized assets exist under `release/games/037/assets/`, or a documented emergency fallback exists.
- Every generated image has an inspection note in the postmortem or QA notes; moving fish sprites have verified background handling, facing direction, rotation baseline, pivot/crop, readability, and control-to-motion alignment.
- WebAudio initializes after user gesture and creates no autoplay console errors; audio is failsafe if unsupported and visual fish/ripple/paper/order cues remain playable muted.
- No console errors during desktop or mobile smoke. Add data-URI favicons to game and prompt pages if needed to avoid favicon request noise.
- Existing `release/games/001/**` through `release/games/036/**` from origin/main remain unchanged.
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
# Screenshot/static checks: verify release/games/037/screenshot.png, prompt.md, prompt.html, index.html, game.js, styles.css, release/kingyo/index.html, release/kingyo/prompt.html, release/kingyo/screenshot.png, optimized assets, and source assets exist and are non-empty.
# Prompt copy check: cmp prompts/day-037.md release/games/037/prompt.md and cmp prompts/day-037.md release/kingyo/prompt.md.
# Prompt HTML check: verify release/games/037/prompt.html has semantic h1/h2/list markup and a back-to-game link, not a raw Markdown dump inside <pre>, and no malformed ul > p or ol > p nodes, no direct nested lists, and no strong/b tags inside code.
# Browser smoke: open the local/static /kingyo/ route and verify menu, tutorial, gameplay start, water tank render, drag net, Tilt Net, Dip/Lift, Swap Poi, Bowl Nudge, Festival Focus, paper/turbulence/order feedback, pause, restart, prompt page, WebAudio after user gesture, no console errors.
# Mobile smoke: repeat at a portrait phone viewport such as 390x844 and verify playable drag net/action controls plus readable HUD/order card/stage/controls.
# Static screenshot check: inspect release/games/037/screenshot.png and release/kingyo/screenshot.png for non-empty readable game content; use vision to judge actual visual quality.
# Image QA: inspect every Imagegen2 source/optimized asset and document the actual inspection result in ai/postmortems/day-037.md.
# Docker/static smoke: build the Docker image locally, run it, curl /kingyo/ and /kingyo/prompt.html, then stop the container.
# Immutable guard: confirm no release/games folders from origin/main changed except new Day 037.
```
